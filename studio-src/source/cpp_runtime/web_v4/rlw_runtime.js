// English++ Web Studio — C++ mode: runs a raylib C++ program (built by in-browser Clang for wasm32-wasip1
// against raylib 5.5 with the Studio's own platform layer, then Asyncify'd) on a WebGL2 canvas.
//
//   * window / input / timing  -> env.rlw_* imports (see cpp/raylib-wasi/src/platforms/rcore_wasi.c)
//   * OpenGL ES 3.0            -> env.gl* imports, implemented here on WebGL2
//   * stdout / stderr          -> a small WASI preview1 shim
//   * frame pacing             -> rlw_present() (EndDrawing) and rlw_sleep() (WaitTime) unwind the wasm stack
//                                  with Asyncify, the page waits for requestAnimationFrame / setTimeout, then rewinds.
// No SharedArrayBuffer, no Worker, no special headers: it runs on the page's main thread like the English++ engine.

const ESUCCESS = 0, EBADF = 8, EINVAL = 28, ENOSYS = 52, ENOTCAPABLE = 76, ENOENT = 44;
class ProcExit { constructor(code) { this.code = code; } }

// KeyboardEvent.code -> raylib KeyboardKey (GLFW numbering)
const KEYMAP = (() => {
  const m = { Space: 32, Quote: 39, Comma: 44, Minus: 45, Period: 46, Slash: 47, Semicolon: 59, Equal: 61,
    BracketLeft: 91, Backslash: 92, BracketRight: 93, Backquote: 96, Escape: 256, Enter: 257, Tab: 258, Backspace: 259,
    Insert: 260, Delete: 261, ArrowRight: 262, ArrowLeft: 263, ArrowDown: 264, ArrowUp: 265, PageUp: 266, PageDown: 267,
    Home: 268, End: 269, CapsLock: 280, ScrollLock: 281, NumLock: 282, PrintScreen: 283, Pause: 284,
    NumpadDecimal: 330, NumpadDivide: 331, NumpadMultiply: 332, NumpadSubtract: 333, NumpadAdd: 334, NumpadEnter: 335, NumpadEqual: 336,
    ShiftLeft: 340, ControlLeft: 341, AltLeft: 342, MetaLeft: 343, ShiftRight: 344, ControlRight: 345, AltRight: 346, MetaRight: 347, ContextMenu: 348 };
  for (let i = 0; i < 10; i++) { m['Digit' + i] = 48 + i; m['Numpad' + i] = 320 + i; }
  for (let i = 0; i < 26; i++) m['Key' + String.fromCharCode(65 + i)] = 65 + i;
  for (let i = 1; i <= 12; i++) m['F' + i] = 289 + i;
  return m;
})();
const KEY_BY_KEY = { ' ': 32, Enter: 257, Escape: 256, ArrowUp: 265, ArrowDown: 264, ArrowLeft: 263, ArrowRight: 262, Backspace: 259, Tab: 258, Shift: 340, Control: 341, Alt: 342 };
export function rayKey(e) {
  if (e.code && KEYMAP[e.code] != null) return KEYMAP[e.code];
  if (KEY_BY_KEY[e.key] != null) return KEY_BY_KEY[e.key];
  if (e.key && e.key.length === 1) { const c = e.key.toUpperCase().charCodeAt(0); if (c >= 32 && c < 127) return c; }
  return 0;
}

/**
 * Run an Asyncify'd raylib program.
 * @param {ArrayBuffer|Uint8Array|WebAssembly.Module} wasm
 * @param {{canvas:HTMLCanvasElement, print?:Function, printErr?:Function, onWindow?:Function, stdin?:string,
 *          keyTarget?:EventTarget, isTyping?:(e:Event)=>boolean}} opts
 * @returns {{done:Promise<{code:number,error?:string,frames:number,ms:number,memoryBytes:number}>, stop:Function, stats:Function, key:Function}}
 */
export function runRaylib(wasm, opts) {
  const canvas = opts.canvas;
  const print = opts.print || (s => console.log(s)), printErr = opts.printErr || (s => console.error(s));
  const enc = new TextEncoder(), dec = new TextDecoder();
  const outDec = { 1: new TextDecoder(), 2: new TextDecoder() };
  let ex = null, mem = null, gl = null;
  let stopReq = false, finished = false, frames = 0, t0 = performance.now(), fpsWin = [], lastFrame = 0;
  let debt = 0, lastTs = 0, ivs = [], drawn = false, holdMs = 0;   // drawn: GL drawing since the last EndDrawing
  let sleeps = 0, sleepMs = 0, busyMs = 0, stepT = 0, midYields = 0;
  let pending = null, timer = 0, raf = 0, killT = 0;
  let stdinBuf = enc.encode(opts.stdin || '');
  const queue = [];           // input events waiting for rlw_poll()
  let resolveDone; const done = new Promise(r => { resolveDone = r; });

  const U8 = () => new Uint8Array(mem.buffer), DV = () => new DataView(mem.buffer);
  const I32 = () => new Int32Array(mem.buffer), F32 = () => new Float32Array(mem.buffer);
  const cstr = (p, n) => { if (!p) return ''; const b = U8(); let e = p; if (n == null || n < 0) { while (b[e]) e++; } else e = p + n; return dec.decode(b.subarray(p, e)); };

  // ---------------- WASI (stdout/stderr, clocks, random; no files) ----------------
  const now = id => id === 0 ? BigInt(Date.now()) * 1000000n : BigInt(Math.round(performance.now() * 1e6));
  const wasi = {
    args_get: (p, b) => { DV().setUint32(p, b, true); U8().set(enc.encode('main\0'), b); return 0; },
    args_sizes_get: (c, s) => { DV().setUint32(c, 1, true); DV().setUint32(s, 5, true); return 0; },
    environ_get: () => 0, environ_sizes_get: (c, s) => { DV().setUint32(c, 0, true); DV().setUint32(s, 0, true); return 0; },
    clock_res_get: (id, p) => { DV().setBigUint64(p, 1000n, true); return 0; },
    clock_time_get: (id, _p, p) => { if (id > 3) return EINVAL; DV().setBigUint64(p, now(id), true); return 0; },
    random_get: (p, len) => { const b = U8(); for (let o = 0; o < len; o += 65536) crypto.getRandomValues(b.subarray(p + o, p + Math.min(len, o + 65536))); return 0; },
    fd_write: (fd, iovs, n, nw) => {
      if (fd !== 1 && fd !== 2) return EBADF;
      const v = DV(), b = U8(); let total = 0;
      for (let i = 0; i < n; i++) { const p = v.getUint32(iovs + i * 8, true), l = v.getUint32(iovs + i * 8 + 4, true); total += l; const t = outDec[fd].decode(b.subarray(p, p + l), { stream: true }); if (t) (fd === 1 ? print : printErr)(t); }
      DV().setUint32(nw, total, true); return 0;
    },
    fd_read: (fd, iovs, n, nr) => {
      if (fd !== 0) return EBADF;
      const v = DV(), b = U8(); let total = 0;
      for (let i = 0; i < n && stdinBuf.length; i++) { const p = v.getUint32(iovs + i * 8, true), l = v.getUint32(iovs + i * 8 + 4, true); const k = Math.min(l, stdinBuf.length); b.set(stdinBuf.subarray(0, k), p); stdinBuf = stdinBuf.subarray(k); total += k; }
      v.setUint32(nr, total, true); return 0;
    },
    fd_fdstat_get: (fd, p) => { if (fd > 2) return EBADF; const v = DV(); v.setUint8(p, 2); v.setUint16(p + 2, 0, true); v.setBigUint64(p + 8, 0xffffffffffffffdbn, true); v.setBigUint64(p + 16, 0xffffffffffffffffn, true); return 0; },
    fd_fdstat_set_flags: () => 0,
    fd_filestat_get: (fd, p) => { if (fd > 2) return EBADF; U8().fill(0, p, p + 64); U8()[p + 16] = 2; return 0; },
    fd_close: fd => fd <= 2 ? 0 : EBADF, fd_seek: fd => fd <= 2 ? 70 : EBADF, fd_tell: fd => fd <= 2 ? 70 : EBADF, fd_sync: () => 0,
    fd_prestat_get: () => EBADF, fd_prestat_dir_name: () => EBADF, path_open: () => ENOTCAPABLE, path_filestat_get: () => ENOENT,
    proc_exit: code => { throw new ProcExit(code); }, sched_yield: () => 0,
    poll_oneoff: (inP, outP, ns, neP) => { const v = DV(); for (let i = 0; i < ns; i++) { const s = inP + i * 48, e = outP + i * 32; v.setBigUint64(e, v.getBigUint64(s, true), true); v.setUint16(e + 8, 0, true); v.setUint8(e + 10, v.getUint8(s + 8)); } v.setUint32(neP, ns, true); return 0; },
  };

  // ---------------- WebGL2 ----------------
  const T = { buf: [null], tex: [null], prog: [null], sh: [null], vao: [null], fbo: [null], rbo: [null], loc: [null] };
  const add = (tab, o) => { if (!o) return 0; tab.push(o); o.__id = tab.length - 1; return o.__id; };
  const genN = (tab, make) => (n, p) => { const a = I32(); for (let i = 0; i < n; i++) a[(p >> 2) + i] = add(tab, make()); };
  const delN = (tab, del) => (n, p) => { const a = I32(); for (let i = 0; i < n; i++) { const id = a[(p >> 2) + i], o = tab[id]; if (o) { del(o); tab[id] = null; } } };
  let unpackAlign = 4, strOff = 0;
  const strCache = {};
  function putStr(key, s) {
    if (strCache[key]) return strCache[key];
    const base = ex.rlw_strbuf(), bytes = enc.encode(s + '\0');
    if (strOff + bytes.length > 16384) return 0;
    U8().set(bytes, base + strOff); strCache[key] = base + strOff; strOff += bytes.length; return strCache[key];
  }
  function pixelBytes(w, h, fmt, type) {
    const comps = { 0x1903: 1, 0x8227: 2, 0x1907: 3, 0x1908: 4, 0x1909: 1, 0x190A: 2, 0x1906: 1, 0x8D94: 1, 0x8228: 2, 0x8D98: 3, 0x8D99: 4, 0x1902: 1 }[fmt] || 4;
    let bpp; if (type === 0x8363 || type === 0x8033 || type === 0x8034) bpp = 2; else if (type === 0x1406 || type === 0x1405 || type === 0x1404) bpp = 4 * comps; else if (type === 0x140B || type === 0x8D61 || type === 0x1403 || type === 0x1402) bpp = 2 * comps; else bpp = comps;
    const row = Math.ceil(w * bpp / unpackAlign) * unpackAlign;
    return { size: h > 0 ? row * (h - 1) + w * bpp : 0, type };
  }
  function pixelView(ptr, w, h, fmt, type) {
    if (!ptr) return null;
    const { size } = pixelBytes(w, h, fmt, type);
    const b = mem.buffer;
    if (type === 0x1406) return (ptr & 3) ? new Float32Array(U8().slice(ptr, ptr + size).buffer) : new Float32Array(b, ptr, size >> 2);
    if (type === 0x8363 || type === 0x8033 || type === 0x8034 || type === 0x140B || type === 0x8D61 || type === 0x1403) return (ptr & 1) ? new Uint16Array(U8().slice(ptr, ptr + size).buffer) : new Uint16Array(b, ptr, size >> 1);
    if (type === 0x1405) return new Uint32Array(U8().slice(ptr, ptr + size).buffer);
    return new Uint8Array(b, ptr, size);
  }
  const fv = (p, n) => new Float32Array(mem.buffer, p, n), iv = (p, n) => new Int32Array(mem.buffer, p, n);
  const L = id => T.loc[id] || null;
  function writeParam(p, v, asFloat) {
    const dv = DV();
    const put = (i, x) => asFloat ? dv.setFloat32(p + i * 4, x, true) : dv.setInt32(p + i * 4, x, true);
    if (v == null) put(0, 0);
    else if (typeof v === 'boolean') put(0, v ? 1 : 0);
    else if (typeof v === 'number') put(0, v);
    else if (v.length != null && typeof v !== 'string') for (let i = 0; i < v.length; i++) put(i, typeof v[i] === 'boolean' ? (v[i] ? 1 : 0) : v[i]);
    else if (typeof v === 'object') put(0, v.__id || 0);
  }
  const GLI = {
    glViewport: (x, y, w, h) => gl.viewport(x, y, w, h),
    glScissor: (x, y, w, h) => gl.scissor(x, y, w, h),
    glClearColor: (r, g, b, a) => gl.clearColor(r, g, b, a), glClear: m => { drawn = true; gl.clear(m); }, glClearDepthf: d => gl.clearDepth(d),
    glEnable: c => gl.enable(c), glDisable: c => gl.disable(c), glDepthMask: f => gl.depthMask(!!f), glDepthFunc: f => gl.depthFunc(f),
    glColorMask: (r, g, b, a) => gl.colorMask(!!r, !!g, !!b, !!a), glCullFace: m => gl.cullFace(m), glFrontFace: m => gl.frontFace(m),
    glLineWidth: w => gl.lineWidth(w), glGetError: () => gl.getError(),
    glBlendFunc: (s, d) => gl.blendFunc(s, d), glBlendEquation: m => gl.blendEquation(m),
    glBlendFuncSeparate: (a, b, c, d) => gl.blendFuncSeparate(a, b, c, d), glBlendEquationSeparate: (a, b) => gl.blendEquationSeparate(a, b),
    glPixelStorei: (p, v) => { if (p === 0x0CF5) unpackAlign = v; gl.pixelStorei(p, v); },
    glGetString: name => {
      if (name === 0x1F03) return putStr('ext', gl.getSupportedExtensions().map(e => 'GL_' + e).join(' '));
      const s = { 0x1F00: 'WebKit/Chromium (WebGL2)', 0x1F01: 'WebGL2', 0x1F02: 'OpenGL ES 3.0 (WebGL 2.0)', 0x8B8C: 'OpenGL ES GLSL ES 3.00' }[name];
      return s ? putStr('s' + name, s) : 0;
    },
    glGetIntegerv: (pname, p) => {
      if (pname === 0x821D) return writeParam(p, gl.getSupportedExtensions().length);
      if (pname === 0x86A2) { const f = gl.getParameter(0x86A3); return writeParam(p, f ? f.length : 0); }
      let v = null; try { v = gl.getParameter(pname); } catch (e) {}
      writeParam(p, v);
    },
    glGetFloatv: (pname, p) => { let v = null; try { v = gl.getParameter(pname); } catch (e) {} writeParam(p, v, true); },
    glGenTextures: genN(T.tex, () => gl.createTexture()), glDeleteTextures: delN(T.tex, o => gl.deleteTexture(o)),
    glGenBuffers: genN(T.buf, () => gl.createBuffer()), glDeleteBuffers: delN(T.buf, o => gl.deleteBuffer(o)),
    glGenVertexArrays: genN(T.vao, () => gl.createVertexArray()), glDeleteVertexArrays: delN(T.vao, o => gl.deleteVertexArray(o)),
    glGenFramebuffers: genN(T.fbo, () => gl.createFramebuffer()), glDeleteFramebuffers: delN(T.fbo, o => gl.deleteFramebuffer(o)),
    glGenRenderbuffers: genN(T.rbo, () => gl.createRenderbuffer()), glDeleteRenderbuffers: delN(T.rbo, o => gl.deleteRenderbuffer(o)),
    glBindTexture: (t, id) => gl.bindTexture(t, T.tex[id] || null), glActiveTexture: u => gl.activeTexture(u),
    glBindBuffer: (t, id) => gl.bindBuffer(t, T.buf[id] || null), glBindVertexArray: id => gl.bindVertexArray(T.vao[id] || null),
    glBindFramebuffer: (t, id) => gl.bindFramebuffer(t, T.fbo[id] || null), glBindRenderbuffer: (t, id) => gl.bindRenderbuffer(t, T.rbo[id] || null),
    glBufferData: (t, size, p, usage) => p ? gl.bufferData(t, U8(), usage, p, size) : gl.bufferData(t, size, usage),
    glBufferSubData: (t, off, size, p) => gl.bufferSubData(t, off, U8(), p, size),
    glTexImage2D: (t, lv, ifmt, w, h, b, fmt, type, p) => gl.texImage2D(t, lv, ifmt, w, h, b, fmt, type, pixelView(p, w, h, fmt, type)),
    glTexSubImage2D: (t, lv, x, y, w, h, fmt, type, p) => gl.texSubImage2D(t, lv, x, y, w, h, fmt, type, pixelView(p, w, h, fmt, type)),
    glCompressedTexImage2D: (t, lv, ifmt, w, h, b, size, p) => gl.compressedTexImage2D(t, lv, ifmt, w, h, b, new Uint8Array(mem.buffer, p, size)),
    glTexParameteri: (t, p, v) => gl.texParameteri(t, p, v), glTexParameterf: (t, p, v) => gl.texParameterf(t, p, v),
    glGenerateMipmap: t => gl.generateMipmap(t),
    glReadPixels: (x, y, w, h, fmt, type, p) => { const sv = unpackAlign; unpackAlign = 4; gl.readPixels(x, y, w, h, fmt, type, pixelView(p, w, h, fmt, type)); unpackAlign = sv; },
    glRenderbufferStorage: (t, f, w, h) => gl.renderbufferStorage(t, f, w, h),
    glFramebufferTexture2D: (t, a, tt, id, lv) => gl.framebufferTexture2D(t, a, tt, T.tex[id] || null, lv),
    glFramebufferRenderbuffer: (t, a, rt, id) => gl.framebufferRenderbuffer(t, a, rt, T.rbo[id] || null),
    glCheckFramebufferStatus: t => gl.checkFramebufferStatus(t),
    glGetFramebufferAttachmentParameteriv: (t, a, pn, p) => writeParam(p, gl.getFramebufferAttachmentParameter(t, a, pn)),
    glBlitFramebuffer: (a, b, c, d, e, f, g, h, m, fl) => gl.blitFramebuffer(a, b, c, d, e, f, g, h, m, fl),
    glDrawBuffersEXT: (n, p) => gl.drawBuffers(Array.from(new Uint32Array(mem.buffer, p, n))),
    glDrawBuffers: (n, p) => gl.drawBuffers(Array.from(new Uint32Array(mem.buffer, p, n))),
    glCreateShader: t => add(T.sh, gl.createShader(t)), glDeleteShader: id => { if (T.sh[id]) { gl.deleteShader(T.sh[id]); T.sh[id] = null; } },
    glShaderSource: (id, n, strs, lens) => { const v = DV(); let s = ''; for (let i = 0; i < n; i++) { const sp = v.getUint32(strs + i * 4, true); const l = lens ? v.getInt32(lens + i * 4, true) : -1; s += cstr(sp, l); } gl.shaderSource(T.sh[id], s); },
    glCompileShader: id => gl.compileShader(T.sh[id]),
    glGetShaderiv: (id, pn, p) => { const s = T.sh[id]; if (pn === 0x8B84) { const l = gl.getShaderInfoLog(s) || ''; writeParam(p, l.length ? l.length + 1 : 0); } else if (pn === 0x8B88) writeParam(p, (gl.getShaderSource(s) || '').length + 1); else writeParam(p, gl.getShaderParameter(s, pn)); },
    glGetShaderInfoLog: (id, max, lp, buf) => { const l = enc.encode(gl.getShaderInfoLog(T.sh[id]) || ''); const n = Math.max(0, Math.min(l.length, max - 1)); if (max > 0) { U8().set(l.subarray(0, n), buf); U8()[buf + n] = 0; } if (lp) DV().setInt32(lp, n, true); },
    glCreateProgram: () => add(T.prog, gl.createProgram()), glDeleteProgram: id => { if (T.prog[id]) { gl.deleteProgram(T.prog[id]); T.prog[id] = null; } },
    glAttachShader: (p, s) => gl.attachShader(T.prog[p], T.sh[s]), glDetachShader: (p, s) => gl.detachShader(T.prog[p], T.sh[s]),
    glBindAttribLocation: (p, i, n) => gl.bindAttribLocation(T.prog[p], i, cstr(n)),
    glLinkProgram: p => { gl.linkProgram(T.prog[p]); T.prog[p].__locs = {}; },
    glGetProgramiv: (id, pn, p) => { const g = T.prog[id]; if (pn === 0x8B84) { const l = gl.getProgramInfoLog(g) || ''; writeParam(p, l.length ? l.length + 1 : 0); } else if (pn === 0x8B87 || pn === 0x8B8A) writeParam(p, 256); else writeParam(p, gl.getProgramParameter(g, pn)); },
    glGetProgramInfoLog: (id, max, lp, buf) => { const l = enc.encode(gl.getProgramInfoLog(T.prog[id]) || ''); const n = Math.max(0, Math.min(l.length, max - 1)); if (max > 0) { U8().set(l.subarray(0, n), buf); U8()[buf + n] = 0; } if (lp) DV().setInt32(lp, n, true); },
    glUseProgram: id => gl.useProgram(T.prog[id] || null),
    glGetAttribLocation: (p, n) => gl.getAttribLocation(T.prog[p], cstr(n)),
    glGetUniformLocation: (p, n) => {
      const g = T.prog[p], name = cstr(n); if (!g) return -1;
      g.__locs = g.__locs || {};
      if (g.__locs[name] != null) return g.__locs[name];
      const l = gl.getUniformLocation(g, name);
      return (g.__locs[name] = l ? add(T.loc, l) : -1);
    },
    glUniform1i: (l, a) => gl.uniform1i(L(l), a), glUniform2i: (l, a, b) => gl.uniform2i(L(l), a, b),
    glUniform1f: (l, a) => gl.uniform1f(L(l), a), glUniform2f: (l, a, b) => gl.uniform2f(L(l), a, b),
    glUniform3f: (l, a, b, c) => gl.uniform3f(L(l), a, b, c), glUniform4f: (l, a, b, c, d) => gl.uniform4f(L(l), a, b, c, d),
    glUniform1fv: (l, n, p) => gl.uniform1fv(L(l), fv(p, n)), glUniform2fv: (l, n, p) => gl.uniform2fv(L(l), fv(p, 2 * n)),
    glUniform3fv: (l, n, p) => gl.uniform3fv(L(l), fv(p, 3 * n)), glUniform4fv: (l, n, p) => gl.uniform4fv(L(l), fv(p, 4 * n)),
    glUniform1iv: (l, n, p) => gl.uniform1iv(L(l), iv(p, n)), glUniform2iv: (l, n, p) => gl.uniform2iv(L(l), iv(p, 2 * n)),
    glUniform3iv: (l, n, p) => gl.uniform3iv(L(l), iv(p, 3 * n)), glUniform4iv: (l, n, p) => gl.uniform4iv(L(l), iv(p, 4 * n)),
    glUniformMatrix4fv: (l, n, tr, p) => gl.uniformMatrix4fv(L(l), !!tr, fv(p, 16 * n)),
    glVertexAttribPointer: (i, s, t, nm, st, off) => gl.vertexAttribPointer(i, s, t, !!nm, st, off),
    glEnableVertexAttribArray: i => gl.enableVertexAttribArray(i), glDisableVertexAttribArray: i => gl.disableVertexAttribArray(i),
    glVertexAttrib1fv: (i, p) => gl.vertexAttrib1fv(i, fv(p, 1)), glVertexAttrib2fv: (i, p) => gl.vertexAttrib2fv(i, fv(p, 2)),
    glVertexAttrib3fv: (i, p) => gl.vertexAttrib3fv(i, fv(p, 3)), glVertexAttrib4fv: (i, p) => gl.vertexAttrib4fv(i, fv(p, 4)),
    glVertexAttribDivisor: (i, d) => gl.vertexAttribDivisor(i, d),
    glDrawArrays: (m, f, c) => { drawn = true; gl.drawArrays(m, f, c); }, glDrawElements: (m, c, t, off) => { drawn = true; gl.drawElements(m, c, t, off); },
    glDrawArraysInstanced: (m, f, c, n) => { drawn = true; gl.drawArraysInstanced(m, f, c, n); }, glDrawElementsInstanced: (m, c, t, off, n) => { drawn = true; gl.drawElementsInstanced(m, c, t, off, n); },
  };

  // ---------------- window, input, frames ----------------
  let cursorLocked = false;
  const canvasXY = (cx, cy) => { const r = canvas.getBoundingClientRect(); return [(cx - r.left) * canvas.width / (r.width || 1), (cy - r.top) * canvas.height / (r.height || 1)]; };
  const typing = e => {
    if (opts.isTyping) return opts.isTyping(e);
    const t = e.target; return t && t !== window && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  };
  const onKey = e => {
    if (finished || typing(e)) return;
    const k = rayKey(e); if (!k) return;
    if (e.type === 'keydown') {
      queue.push(['key', k, e.repeat ? 2 : 1]);
      if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) queue.push(['char', e.key.codePointAt(0)]);
      if (/^(Arrow|Space$|Tab$|Backspace$)/.test(e.code || e.key) || e.key === ' ') e.preventDefault();
    } else queue.push(['key', k, 0]);
  };
  const onMove = e => {
    if (cursorLocked && document.pointerLockElement === canvas) { queue.push(['delta', e.movementX * canvas.width / (canvas.getBoundingClientRect().width || 1), e.movementY * canvas.height / (canvas.getBoundingClientRect().height || 1)]); return; }
    if (e.pointerType === 'touch') return;
    const [x, y] = canvasXY(e.clientX, e.clientY); queue.push(['pos', x, y]);
  };
  const onDown = e => {
    if (e.pointerType === 'touch') return;
    const [x, y] = canvasXY(e.clientX, e.clientY); queue.push(['pos', x, y]);
    const b = e.button === 2 ? 1 : e.button === 1 ? 2 : e.button; queue.push(['btn', b, 1]);
    if (cursorLocked && document.pointerLockElement !== canvas) try { canvas.requestPointerLock(); } catch (er) {}
    try { canvas.focus({ preventScroll: true }); } catch (er) {}
  };
  const onUp = e => { if (e.pointerType === 'touch') return; const b = e.button === 2 ? 1 : e.button === 1 ? 2 : e.button; queue.push(['btn', b, 0]); };
  const onWheel = e => { e.preventDefault(); queue.push(['wheel', -e.deltaX / 100, -e.deltaY / 100]); };
  const onTouch = action => e => {
    e.preventDefault();
    const pts = Array.from(e.touches).slice(0, 8).map(t => [t.identifier, ...canvasXY(t.clientX, t.clientY)]);
    if (action === 0) { const c = e.changedTouches[0]; if (c) pts.push([c.identifier, ...canvasXY(c.clientX, c.clientY)]); }
    queue.push(['touch', action, pts]);
  };
  const tStart = onTouch(1), tMove = onTouch(2), tEnd = onTouch(0);
  const keyTarget = opts.keyTarget || window;
  const ctx = e => e.preventDefault();
  function listen(on) {
    const f = on ? 'addEventListener' : 'removeEventListener';
    keyTarget[f]('keydown', onKey, true); keyTarget[f]('keyup', onKey, true);
    canvas[f]('pointermove', onMove); canvas[f]('pointerdown', onDown); window[f]('pointerup', onUp);
    canvas[f]('wheel', onWheel, { passive: false }); canvas[f]('contextmenu', ctx);
    canvas[f]('touchstart', tStart, { passive: false }); canvas[f]('touchmove', tMove, { passive: false });
    canvas[f]('touchend', tEnd, { passive: false }); canvas[f]('touchcancel', tEnd, { passive: false });
  }
  // A press and its release that arrive between two frames: the release waits one frame, so IsKeyPressed /
  // IsMouseButtonPressed (which compare this frame with the last) still see the press - quick taps and clicks count.
  function drain() {
    const downNow = new Set();
    while (queue.length) {
      const q = queue[0];
      if ((q[0] === 'key' || q[0] === 'btn') && q[2] === 0 && downNow.has(q[0] + q[1])) break;
      if ((q[0] === 'key' || q[0] === 'btn') && q[2] === 1) downNow.add(q[0] + q[1]);
      if (q[0] === 'touch' && q[1] === 0 && downNow.has('touch')) break;
      if (q[0] === 'touch' && q[1] === 1) downNow.add('touch');
      queue.shift();
      switch (q[0]) {
        case 'key': ex.rlw_key(q[1], q[2]); break;
        case 'char': ex.rlw_char(q[1]); break;
        case 'pos': ex.rlw_mouse_pos(q[1], q[2]); break;
        case 'delta': ex.rlw_mouse_delta(q[1], q[2]); break;
        case 'btn': ex.rlw_mouse_button(q[1], q[2]); break;
        case 'wheel': ex.rlw_wheel(q[1], q[2]); break;
        case 'touch': q[2].forEach((p, i) => ex.rlw_touch_point(i, p[0], p[1], p[2])); ex.rlw_touch_done(q[1], q[2].length); break;
      }
    }
  }

  // Asyncify: the two imports that hand control back to the browser
  let DATA = 0, SIZE = 0;
  function suspend(kind, ms) {
    if (ex.asyncify_get_state() === 2) { ex.asyncify_stop_rewind(); return; }   // resumed: carry on
    const v = I32(); v[DATA >> 2] = DATA + 8; v[(DATA >> 2) + 1] = DATA + SIZE;
    if (drawn) midYields++;   // v4: counted for the tests; the rules above keep it at 0 (a yield only after EndDrawing)
    pending = { kind, ms };
    ex.asyncify_start_unwind(DATA);
  }
  const env = {
    rlw_init: (w, h, title, flags) => {
      canvas.width = w; canvas.height = h;
      gl = canvas.getContext('webgl2', { alpha: false, depth: true, stencil: true, antialias: !!(flags & 0x20), preserveDrawingBuffer: !!opts.preserve, premultipliedAlpha: false });
      if (!gl) return 0;
      for (const e of gl.getSupportedExtensions() || []) { if (!/^WEBGL_(debug|lose_context)/.test(e)) try { gl.getExtension(e); } catch (er) {} }
      listen(true);
      if (opts.onWindow) opts.onWindow({ width: w, height: h, title: cstr(title) });
      return 1;
    },
    rlw_present: () => {
      if (ex.asyncify_get_state() !== 2) { frames++; const t = performance.now(); if (lastFrame) { fpsWin.push(t - lastFrame); if (fpsWin.length > 120) fpsWin.shift(); } lastFrame = t; }
      drawn = false;
      suspend('frame');
    },
    // short waits (raylib's SetTargetFPS pacing) become 'skip a display frame' debt; long waits (WaitTime(1.0)) really yield
    rlw_sleep: ms => { if (ex.asyncify_get_state() !== 2) { if (ms < 1) return; sleeps++; sleepMs += ms; if (ms < 50) { debt += ms; return; }
      // never hand the browser a half-drawn frame: a long wait in the middle of drawing waits after the next EndDrawing instead
      if (drawn) { holdMs = Math.min(holdMs + ms, 10000); return; } } suspend('sleep', ms); },
    rlw_now: () => performance.now(),
    rlw_poll: () => drain(),
    rlw_should_close: () => stopReq ? 1 : 0,
    rlw_set_title: t => { if (opts.onWindow) opts.onWindow({ width: canvas.width, height: canvas.height, title: cstr(t) }); },
    rlw_set_size: (w, h) => { canvas.width = w; canvas.height = h; if (opts.onWindow) opts.onWindow({ width: w, height: h }); },
    rlw_cursor: mode => {
      if (mode === 1) canvas.style.cursor = 'none'; else if (mode === 0) canvas.style.cursor = '';
      else if (mode === 2) { cursorLocked = true; try { canvas.requestPointerLock(); } catch (e) {} }
      else if (mode === 3) { cursorLocked = false; if (document.pointerLockElement) document.exitPointerLock(); }
    },
    rlw_open_url: p => { try { window.open(cstr(p), '_blank', 'noopener'); } catch (e) {} },
    rlw_set_clipboard: p => { try { navigator.clipboard.writeText(cstr(p)); } catch (e) {} },
    rlw_get_clipboard: () => 0,
    rlw_fullscreen: on => { if (opts.onFullscreen) opts.onFullscreen(!!on); return 1; },
    rlw_display_size: (wp, hp) => { const dv = DV(); dv.setInt32(wp, Math.round(screen.width * (devicePixelRatio || 1)), true); dv.setInt32(hp, Math.round(screen.height * (devicePixelRatio || 1)), true); },
  };

  let warned = new Set();
  function finish(code, error) {
    if (finished) return; finished = true;
    clearTimeout(timer); cancelAnimationFrame(raf); clearTimeout(killT); listen(false);
    if (document.pointerLockElement === canvas) try { document.exitPointerLock(); } catch (e) {}
    for (const fd of [1, 2]) { const t = outDec[fd].decode(); if (t) (fd === 1 ? print : printErr)(t); }
    if (error) printErr('\n[' + error + ']\n');
    resolveDone({ code, error, frames, ms: Math.round(performance.now() - t0), memoryBytes: mem ? mem.buffer.byteLength : 0 });
  }
  function step() {
    if (finished) return;
    stepT = performance.now();
    try {
      ex._start();
    } catch (e) {
      if (e instanceof ProcExit) return finish(e.code);
      if (e instanceof WebAssembly.RuntimeError) return finish(134, /unreachable/.test(e.message) ? 'program aborted (std::abort / trap)' : 'runtime error: ' + e.message);
      if (e instanceof RangeError) return finish(134, 'stack overflow or out of memory: ' + e.message);
      return finish(1, String(e && e.message || e));
    }
    busyMs += performance.now() - stepT;
    if (ex.asyncify_get_state() === 1) {
      ex.asyncify_stop_unwind();
      const p = pending; pending = null;
      const resume = () => { if (finished) return; ex.asyncify_start_rewind(DATA); step(); };
      if (p.kind === 'frame') {
        // pace to the display; a 120 Hz screen running a SetTargetFPS(60) game skips every other frame
        const wait = () => { raf = requestAnimationFrame(ts => {
          if (lastTs) { ivs.push(ts - lastTs); if (ivs.length > 30) ivs.shift(); } lastTs = ts;
          const iv = ivs.length ? ivs.slice().sort((a, b) => a - b)[ivs.length >> 1] : 16.7;
          if (debt >= iv * 0.5) { debt -= iv; wait(); } else { debt = 0; resume(); }
        }); };
        if (holdMs > 0) { const h = holdMs; holdMs = 0; timer = setTimeout(wait, h); } else wait();
      }
      else timer = setTimeout(resume, Math.max(0, p.ms));
      return;
    }
    finish(0);   // main returned
  }

  (async () => {
    try {
      const module = wasm instanceof WebAssembly.Module ? wasm : await WebAssembly.compile(wasm);
      const imports = { env: {}, wasi_snapshot_preview1: {} };
      for (const imp of WebAssembly.Module.imports(module)) {
        if (imp.kind !== 'function') continue;
        const tab = imp.module === 'wasi_snapshot_preview1' ? wasi : imp.module === 'env' ? (imp.name.startsWith('gl') ? GLI : env) : null;
        const fn = tab && tab[imp.name];
        (imports[imp.module] ||= {})[imp.name] = fn || ((...a) => { if (!warned.has(imp.name)) { warned.add(imp.name); printErr('[the Studio does not have ' + imp.name + ' yet; it does nothing here]\n'); } return imp.module === 'wasi_snapshot_preview1' ? ENOSYS : 0; });
      }
      const inst = await WebAssembly.instantiate(module, imports);
      ex = inst.exports; mem = ex.memory;
      if (!ex.asyncify_start_unwind) throw new Error('this program was not prepared for the canvas (no Asyncify)');
      DATA = ex.rlw_asyncify_data(); SIZE = ex.rlw_asyncify_size();
      t0 = performance.now();
      step();
    } catch (e) { finish(1, String(e && e.message || e)); }
  })();

  return {
    done,
    stop() {
      stopReq = true;
      // a program that never asks WindowShouldClose() is abandoned after 1.5 s
      clearTimeout(killT); killT = setTimeout(() => finish(0, 'stopped'), 1500);
    },
    key(k, down) { queue.push(['key', k, down ? 1 : 0]); },
    stats() {
      const avg = fpsWin.length ? fpsWin.reduce((a, b) => a + b, 0) / fpsWin.length : 0;
      return { sleeps, midYields, sleepMs: Math.round(sleepMs), busyMs: Math.round(busyMs), frames, fps: avg ? 1000 / avg : 0, ms: performance.now() - t0, memoryBytes: mem ? mem.buffer.byteLength : 0, finished };
    },
    get gl() { return gl; }
  };
}
