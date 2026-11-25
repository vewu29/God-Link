// English++ Web Studio — Full build program runner: a minimal WASI preview1 shim.
// Works two ways:
//   1. Imported as a module on the page: runWasi(wasm, opts) runs synchronously-in-a-promise on the main thread
//      (use this only when you need an interactive stdin callback; the page cannot repaint until the program ends).
//   2. Loaded as a module Worker (new Worker('run.js', {type:'module'})): post {type:'run', wasm, args, stdin, env}
//      and receive {type:'out', fd, text} chunks while it runs, then {type:'exit', code, error?}.
// No SharedArrayBuffer is used, so a worker run gets stdin only as text given up front.

const ESUCCESS = 0, EBADF = 8, EINVAL = 28, ENOSYS = 52, ENOTCAPABLE = 76, ENOENT = 44;

class ProcExit { constructor(code) { this.code = code; } }

/**
 * @param {ArrayBuffer|Uint8Array|WebAssembly.Module} wasm
 * @param {{args?:string[], env?:Object<string,string>, print?:(s:string)=>void, printErr?:(s:string)=>void,
 *          stdin?: string | (()=>string|null) | null, maxOutputBytes?:number}} opts
 * @returns {Promise<{code:number, error?:string, memoryBytes:number, outputBytes:number, truncated:boolean}>}
 */
export async function runWasi(wasm, opts = {}) {
  const print = opts.print || ((s) => console.log(s));
  const printErr = opts.printErr || ((s) => console.error(s));
  const args = ['main.wasm', ...(opts.args || [])];
  const env = Object.entries(opts.env || {}).map(([k, v]) => `${k}=${v}`);
  const maxOut = opts.maxOutputBytes ?? 8 * 1024 * 1024;
  const enc = new TextEncoder();
  const decoders = { 1: new TextDecoder(), 2: new TextDecoder() };
  let stdinBuf = new Uint8Array(0), stdinEOF = false;
  if (typeof opts.stdin === 'string') { stdinBuf = enc.encode(opts.stdin); stdinEOF = true; }
  const stdinCb = typeof opts.stdin === 'function' ? opts.stdin : null;
  if (opts.stdin == null) stdinEOF = true;
  let outputBytes = 0, truncated = false;

  const module = wasm instanceof WebAssembly.Module ? wasm : await WebAssembly.compile(wasm);
  let memory = null;
  const view = () => new DataView(memory.buffer);
  const bytes = () => new Uint8Array(memory.buffer);

  const writeStrings = (list, ptrsPtr, bufPtr) => {
    const v = view(), b = bytes();
    for (const s of list) {
      v.setUint32(ptrsPtr, bufPtr, true); ptrsPtr += 4;
      const e = enc.encode(s); b.set(e, bufPtr); b[bufPtr + e.length] = 0; bufPtr += e.length + 1;
    }
    return ESUCCESS;
  };
  const sizes = (list, countPtr, sizePtr) => {
    const v = view();
    v.setUint32(countPtr, list.length, true);
    v.setUint32(sizePtr, list.reduce((a, s) => a + enc.encode(s).length + 1, 0), true);
    return ESUCCESS;
  };
  const now = (id) => id === 0 ? BigInt(Date.now()) * 1000000n : BigInt(Math.round(performance.now() * 1e6));

  const wasi = {
    args_get: (p, b) => writeStrings(args, p, b),
    args_sizes_get: (c, s) => sizes(args, c, s),
    environ_get: (p, b) => writeStrings(env, p, b),
    environ_sizes_get: (c, s) => sizes(env, c, s),
    clock_res_get: (id, p) => { view().setBigUint64(p, 1000n, true); return ESUCCESS; },
    clock_time_get: (id, _prec, p) => { if (id > 3) return EINVAL; view().setBigUint64(p, now(id), true); return ESUCCESS; },
    random_get: (p, len) => {
      const b = bytes();
      for (let off = 0; off < len; off += 65536) crypto.getRandomValues(b.subarray(p + off, p + Math.min(len, off + 65536)));
      return ESUCCESS;
    },
    fd_write: (fd, iovs, n, nwritten) => {
      if (fd !== 1 && fd !== 2) return EBADF;
      const v = view(), b = bytes();
      let total = 0;
      for (let i = 0; i < n; i++) {
        const ptr = v.getUint32(iovs + i * 8, true), len = v.getUint32(iovs + i * 8 + 4, true);
        total += len;
        if (outputBytes + len > maxOut) { truncated = true; continue; }
        outputBytes += len;
        const text = decoders[fd].decode(b.subarray(ptr, ptr + len), { stream: true });
        if (text) (fd === 1 ? print : printErr)(text);
      }
      view().setUint32(nwritten, total, true);
      return ESUCCESS;
    },
    fd_read: (fd, iovs, n, nread) => {
      if (fd !== 0) return EBADF;
      if (stdinBuf.length === 0 && !stdinEOF && stdinCb) {
        const s = stdinCb();
        if (s == null) stdinEOF = true; else stdinBuf = enc.encode(s);
      }
      const v = view(), b = bytes();
      let total = 0;
      for (let i = 0; i < n && stdinBuf.length; i++) {
        const ptr = v.getUint32(iovs + i * 8, true), len = v.getUint32(iovs + i * 8 + 4, true);
        const k = Math.min(len, stdinBuf.length);
        b.set(stdinBuf.subarray(0, k), ptr); stdinBuf = stdinBuf.subarray(k); total += k;
      }
      v.setUint32(nread, total, true);
      return ESUCCESS;
    },
    fd_fdstat_get: (fd, p) => {
      if (fd > 2) return EBADF;
      const v = view();
      v.setUint8(p, 2);           // filetype: character device (so stdout is line-buffered, like a terminal)
      v.setUint16(p + 2, 0, true); // flags
      v.setBigUint64(p + 8, 0xffffffffffffffffn, true);
      v.setBigUint64(p + 16, 0xffffffffffffffffn, true);
      return ESUCCESS;
    },
    fd_fdstat_set_flags: () => ESUCCESS,
    fd_filestat_get: (fd, p) => {
      if (fd > 2) return EBADF;
      const b = bytes(); b.fill(0, p, p + 64); b[p + 16] = 2;
      return ESUCCESS;
    },
    fd_close: (fd) => fd <= 2 ? ESUCCESS : EBADF,
    fd_seek: (fd) => fd <= 2 ? 70 /* ESPIPE */ : EBADF,
    fd_tell: (fd) => fd <= 2 ? 70 : EBADF,
    fd_sync: () => ESUCCESS,
    fd_datasync: () => ESUCCESS,
    fd_prestat_get: () => EBADF,     // no preopened directories: file I/O fails cleanly
    fd_prestat_dir_name: () => EBADF,
    path_open: () => ENOTCAPABLE,
    path_filestat_get: () => ENOENT,
    proc_exit: (code) => { throw new ProcExit(code); },
    proc_raise: () => ENOSYS,
    sched_yield: () => ESUCCESS,
    poll_oneoff: (inPtr, outPtr, nsubs, neventsPtr) => {
      // Supports clock subscriptions (sleep): busy-waits until the earliest deadline.
      const v = view();
      let waitNs = 0n, events = 0;
      for (let i = 0; i < nsubs; i++) {
        const s = inPtr + i * 48;
        const userdata = v.getBigUint64(s, true), tag = v.getUint8(s + 8);
        if (tag === 0) {
          const timeout = v.getBigUint64(s + 24, true), flags = v.getUint16(s + 40, true);
          const rel = flags & 1 ? timeout - now(v.getUint32(s + 16, true)) : timeout;
          if (rel > waitNs) waitNs = rel;
        }
        const e = outPtr + events * 32;
        v.setBigUint64(e, userdata, true); v.setUint16(e + 8, 0, true); v.setUint8(e + 10, tag);
        events++;
      }
      const until = performance.now() + Number(waitNs) / 1e6;
      while (performance.now() < until) { /* spin */ }
      v.setUint32(neventsPtr, events, true);
      return ESUCCESS;
    },
  };
  // Any other WASI import the program asks for gets a stub returning ENOSYS.
  const imports = {};
  for (const imp of WebAssembly.Module.imports(module)) {
    if (imp.kind !== 'function') continue;
    imports[imp.module] ||= {};
    if (imp.module === 'wasi_snapshot_preview1' && wasi[imp.name]) imports[imp.module][imp.name] = wasi[imp.name];
    else imports[imp.module][imp.name] = () => ENOSYS;
  }
  const instance = await WebAssembly.instantiate(module, imports);
  memory = instance.exports.memory;
  let code = 0, error;
  try {
    instance.exports._start();
  } catch (e) {
    if (e instanceof ProcExit) code = e.code;
    else if (typeof WebAssembly.Exception === 'function' && e instanceof WebAssembly.Exception) {
      code = 134; error = 'terminate called after an uncaught C++ exception';
    } else if (e instanceof WebAssembly.RuntimeError) {
      code = 134; error = /unreachable/.test(e.message) ? 'program aborted (std::abort / std::terminate / trap)' : 'runtime error: ' + e.message;
    } else if (e instanceof RangeError) {
      code = 134; error = 'stack overflow or out of memory: ' + e.message;
    } else { code = 1; error = String(e && e.message || e); }
  }
  for (const fd of [1, 2]) { const t = decoders[fd].decode(); if (t) (fd === 1 ? print : printErr)(t); }
  if (truncated) printErr(`\n[output truncated after ${maxOut} bytes]\n`);
  if (error) printErr(`\n[${error}]\n`);
  return { code, error, memoryBytes: memory.buffer.byteLength, outputBytes, truncated };
}

// ---- Worker mode -----------------------------------------------------------------------------
const isWorker = typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined' && self instanceof WorkerGlobalScope;
if (isWorker) {
  self.onmessage = async (ev) => {
    const m = ev.data || {};
    if (m.type !== 'run') return;
    // Batch output: post at most every ~30 ms or 16 KB so a printing loop doesn't flood the page.
    const pending = { 1: '', 2: '' };
    let last = performance.now();
    const flush = () => {
      for (const fd of [1, 2]) if (pending[fd]) { self.postMessage({ type: 'out', fd, text: pending[fd] }); pending[fd] = ''; }
      last = performance.now();
    };
    const push = (fd) => (s) => {
      pending[fd] += s;
      if (pending[fd].length > 16384 || performance.now() - last > 30) flush();
    };
    const t0 = performance.now();
    try {
      const r = await runWasi(m.wasm, { args: m.args, env: m.env, stdin: m.stdin ?? null, maxOutputBytes: m.maxOutputBytes, print: push(1), printErr: push(2) });
      flush();
      self.postMessage({ type: 'exit', ...r, ms: Math.round(performance.now() - t0) });
    } catch (e) {
      flush();
      self.postMessage({ type: 'exit', code: 1, error: String(e && e.message || e), ms: Math.round(performance.now() - t0) });
    }
  };
}
