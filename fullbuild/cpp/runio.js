// English++ Web Studio v4 — runs a console C++ program that reads input WHILE it runs (module Worker).
// The program was built without exceptions and Asyncify'd on wasi fd_read (cppworker.js, interactive build): when it
// needs input and none is waiting, fd_read unwinds the wasm stack, this worker asks the page for a line
// ({type:'read'}), and when the page answers ({type:'input', text|null}; null = end of input) it rewinds and the
// read carries on. No SharedArrayBuffer, no special headers. Output streams to the page as it is written.
//   in:  {type:'run', wasm, maxOutputBytes?}   {type:'input', text}
//   out: {type:'out', fd, text}   {type:'read'}   {type:'exit', code, error?, ms, reads}

const ESUCCESS = 0, EBADF = 8, EINVAL = 28, ENOSYS = 52, ENOTCAPABLE = 76, ENOENT = 44;
class ProcExit { constructor(code) { this.code = code; } }

let ex = null, memory = null, DATA = 0, SIZE = 0;
let stdinBuf = new Uint8Array(0), stdinEOF = false, waiting = false, reads = 0;
const enc = new TextEncoder();
const decoders = { 1: new TextDecoder(), 2: new TextDecoder() };
const pend = { 1: '', 2: '' };
let last = 0, outputBytes = 0, maxOut = 8 * 1024 * 1024, truncated = false, t0 = 0;

function flush() { for (const fd of [1, 2]) if (pend[fd]) { self.postMessage({ type: 'out', fd, text: pend[fd] }); pend[fd] = ''; } last = performance.now(); }
function push(fd, s) { pend[fd] += s; if (pend[fd].length > 16384 || performance.now() - last > 30) flush(); }
const view = () => new DataView(memory.buffer), bytes = () => new Uint8Array(memory.buffer);
const now = id => id === 0 ? BigInt(Date.now()) * 1000000n : BigInt(Math.round(performance.now() * 1e6));
const args = ['main.wasm'];
const wasi = {
  args_get: (p, b) => { view().setUint32(p, b, true); bytes().set(enc.encode('main.wasm\0'), b); return 0; },
  args_sizes_get: (c, s) => { view().setUint32(c, 1, true); view().setUint32(s, 10, true); return 0; },
  environ_get: () => 0, environ_sizes_get: (c, s) => { view().setUint32(c, 0, true); view().setUint32(s, 0, true); return 0; },
  clock_res_get: (id, p) => { view().setBigUint64(p, 1000n, true); return 0; },
  clock_time_get: (id, _p, p) => { if (id > 3) return EINVAL; view().setBigUint64(p, now(id), true); return 0; },
  random_get: (p, len) => { const b = bytes(); for (let o = 0; o < len; o += 65536) crypto.getRandomValues(b.subarray(p + o, p + Math.min(len, o + 65536))); return 0; },
  fd_write: (fd, iovs, n, nw) => {
    if (fd !== 1 && fd !== 2) return EBADF;
    const v = view(), b = bytes(); let total = 0;
    for (let i = 0; i < n; i++) {
      const p = v.getUint32(iovs + i * 8, true), l = v.getUint32(iovs + i * 8 + 4, true); total += l;
      if (outputBytes + l > maxOut) { truncated = true; continue; }
      outputBytes += l;
      const t = decoders[fd].decode(b.subarray(p, p + l), { stream: true }); if (t) push(fd, t);
    }
    view().setUint32(nw, total, true); return 0;
  },
  fd_read: (fd, iovs, n, nr) => {
    if (fd !== 0) return EBADF;
    if (ex.asyncify_get_state() === 2) { ex.asyncify_stop_rewind(); waiting = false; }      // resumed with the answer
    else if (!stdinBuf.length && !stdinEOF) {
      // nothing typed yet: hand control back to this worker's event loop until the page sends a line
      const v = new Int32Array(memory.buffer); v[DATA >> 2] = DATA + 8; v[(DATA >> 2) + 1] = DATA + SIZE;
      waiting = true; ex.asyncify_start_unwind(DATA); return 0;
    }
    const v = view(), b = bytes(); let total = 0;
    for (let i = 0; i < n && stdinBuf.length; i++) {
      const p = v.getUint32(iovs + i * 8, true), l = v.getUint32(iovs + i * 8 + 4, true);
      const k = Math.min(l, stdinBuf.length); b.set(stdinBuf.subarray(0, k), p); stdinBuf = stdinBuf.subarray(k); total += k;
    }
    v.setUint32(nr, total, true); return 0;
  },
  fd_fdstat_get: (fd, p) => { if (fd > 2) return EBADF; const v = view(); v.setUint8(p, 2); v.setUint16(p + 2, 0, true); v.setBigUint64(p + 8, 0xffffffffffffffffn, true); v.setBigUint64(p + 16, 0xffffffffffffffffn, true); return 0; },
  fd_fdstat_set_flags: () => 0,
  fd_filestat_get: (fd, p) => { if (fd > 2) return EBADF; const b = bytes(); b.fill(0, p, p + 64); b[p + 16] = 2; return 0; },
  fd_close: fd => fd <= 2 ? 0 : EBADF, fd_seek: fd => fd <= 2 ? 70 : EBADF, fd_tell: fd => fd <= 2 ? 70 : EBADF,
  fd_sync: () => 0, fd_datasync: () => 0,
  fd_prestat_get: () => EBADF, fd_prestat_dir_name: () => EBADF, path_open: () => ENOTCAPABLE, path_filestat_get: () => ENOENT,
  proc_exit: code => { throw new ProcExit(code); }, proc_raise: () => ENOSYS, sched_yield: () => 0,
  poll_oneoff: (inP, outP, ns, neP) => {
    const v = view(); let waitNs = 0n, events = 0;
    for (let i = 0; i < ns; i++) {
      const s = inP + i * 48, tag = v.getUint8(s + 8);
      if (tag === 0) { const to = v.getBigUint64(s + 24, true), fl = v.getUint16(s + 40, true); const rel = fl & 1 ? to - now(v.getUint32(s + 16, true)) : to; if (rel > waitNs) waitNs = rel; }
      const e = outP + events * 32; v.setBigUint64(e, v.getBigUint64(s, true), true); v.setUint16(e + 8, 0, true); v.setUint8(e + 10, tag); events++;
    }
    flush();
    const until = performance.now() + Number(waitNs) / 1e6; while (performance.now() < until) { /* spin (sleep_for) */ }
    v.setUint32(neP, events, true); return 0;
  },
};

function done(code, error) {
  for (const fd of [1, 2]) { const t = decoders[fd].decode(); if (t) push(fd, t); }
  if (truncated) push(2, `\n[output truncated after ${maxOut} bytes]\n`);
  if (error) push(2, `\n[${error}]\n`);
  flush();
  self.postMessage({ type: 'exit', code, error, reads, ms: Math.round(performance.now() - t0), memoryBytes: memory ? memory.buffer.byteLength : 0 });
}
function step() {
  try { ex._start(); }
  catch (e) {
    if (e instanceof ProcExit) return done(e.code);
    if (e instanceof WebAssembly.RuntimeError) return done(134, /unreachable/.test(e.message) ? 'program aborted (std::abort / std::terminate / trap)' : 'runtime error: ' + e.message);
    if (e instanceof RangeError) return done(134, 'stack overflow or out of memory: ' + e.message);
    return done(1, String(e && e.message || e));
  }
  if (ex.asyncify_get_state() === 1) { ex.asyncify_stop_unwind(); reads++; flush(); self.postMessage({ type: 'read' }); return; }
  done(0);
}

self.onmessage = async ev => {
  const m = ev.data || {};
  if (m.type === 'input') {
    if (!waiting) return;
    if (m.text == null) stdinEOF = true; else stdinBuf = enc.encode(m.text);
    ex.asyncify_start_rewind(DATA); step();
    return;
  }
  if (m.type !== 'run') return;
  t0 = performance.now(); last = t0; if (m.maxOutputBytes) maxOut = m.maxOutputBytes;
  try {
    const module = await WebAssembly.compile(m.wasm);
    const imports = {};
    for (const imp of WebAssembly.Module.imports(module)) {
      if (imp.kind !== 'function') continue;
      imports[imp.module] ||= {};
      imports[imp.module][imp.name] = imp.module === 'wasi_snapshot_preview1' && wasi[imp.name] ? wasi[imp.name] : () => ENOSYS;
    }
    const inst = await WebAssembly.instantiate(module, imports);
    ex = inst.exports; memory = ex.memory;
    if (!ex.asyncify_start_unwind || !ex.epp_io_data) throw new Error('this program was not built for live input');
    DATA = ex.epp_io_data(); SIZE = ex.epp_io_size();
  } catch (e) { return done(1, String(e && e.message || e)); }
  step();
};
