// English++ Web Studio — Full build page API.
// Nothing is downloaded until build()/preload() is called. Usage:
//   import { EppFullBuild } from './fullbuild/fullbuild.js';   (also sets window.EppFullBuild)
//   const r = await EppFullBuild.build(cpp, { onProgress(phase, loaded, total) {} });
//   if (r.ok) await EppFullBuild.run(r.wasm, { print: s => ..., printErr: s => ... });
//   else r.errors -> [{line, column, message}]

const here = new URL('.', import.meta.url);
let compiler = null;      // Worker running worker.js (clang)
let runner = null;        // Worker running run.js (the user's program)
let nextId = 1;
const pending = new Map();
let progressCb = null;

function features() {
  const missing = [];
  if (typeof WebAssembly !== 'object') missing.push('WebAssembly');
  if (typeof Worker !== 'function') missing.push('Web Workers');
  if (typeof DecompressionStream !== 'function') missing.push('DecompressionStream (gzip)');
  if (typeof WebAssembly === 'object') {
    // exnref exception handling (try_table): needed because programs are built with -fwasm-exceptions.
    const exn = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 0x60, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 0x1f, 0x40, 0, 0x0b, 0x0b]);
    if (!WebAssembly.validate(exn)) missing.push('WebAssembly exception handling (exnref)');
  }
  return { ok: missing.length === 0, missing };
}

function getCompiler() {
  if (!compiler) {
    compiler = new Worker(new URL('worker.js', here), { type: 'module' });
    compiler.onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'progress') { if (progressCb) progressCb(m.phase, m.loaded, m.total); return; }
      if (m.type === 'result' && pending.has(m.id)) { pending.get(m.id).resolve(m.result); pending.delete(m.id); }
    };
    compiler.onerror = (e) => {
      const err = { ok: false, errors: [{ line: null, column: null, message: 'compiler worker crashed: ' + (e.message || 'unknown (possibly out of memory)') }], raw: '' };
      for (const p of pending.values()) p.resolve(err);
      pending.clear();
      compiler = null;
    };
  }
  return compiler;
}

function call(msg, transfer) {
  const w = getCompiler();
  const id = nextId++;
  return new Promise((resolve) => { pending.set(id, { resolve }); w.postMessage({ ...msg, id }, transfer || []); });
}

/** Free the compiler (its ~hundreds of MB of toolchain memory). The next build re-instantiates it from the Cache API. */
function release() {
  if (compiler) { compiler.terminate(); compiler = null; }
  for (const p of pending.values()) p.resolve({ ok: false, errors: [{ line: null, column: null, message: 'cancelled' }], raw: '' });
  pending.clear();
}

export const EppFullBuild = {
  version: 'clang 22.0.0-git20695-13 (YoWASP) + wasi-sdk-33 exception libs',
  features,

  /** Download (or load from cache) and initialise the toolchain without building anything. */
  async preload({ onProgress } = {}) {
    progressCb = onProgress || null;
    return call({ type: 'preload' });
  },

  /**
   * Compile C++ to a WASI wasm program.
   * @param {string} cpp
   * @param {{files?:Object<string,string>, opt?:'-O0'|'-O1'|'-O2'|'-Os', extraArgs?:string[],
   *          onProgress?:(phase:string, loaded:number, total:number)=>void, keepWarm?:boolean}} [o]
   *   keepWarm=false (default) terminates the compiler worker after the build to give its memory back.
   * @returns {Promise<{ok:true, wasm:ArrayBuffer, ms:number, warnings:any[], raw:string, stats:object}
   *                  | {ok:false, errors:{line:number|null, column:number|null, message:string}[], warnings:any[], raw:string, ms:number}>}
   */
  async build(cpp, o = {}) {
    const f = features();
    if (!f.ok) return { ok: false, errors: [{ line: null, column: null, message: 'This browser lacks: ' + f.missing.join(', ') }], warnings: [], raw: '' };
    progressCb = o.onProgress || null;
    const t0 = performance.now();
    const r = await call({ type: 'build', cpp, files: o.files, opt: o.opt, extraArgs: o.extraArgs });
    r.totalMs = Math.round(performance.now() - t0);
    if (!o.keepWarm) release();
    if (progressCb) progressCb('done', 0, 0);
    return r;
  },

  /**
   * Run a built program in a worker, streaming output. Resolves with the exit code.
   * @param {ArrayBuffer} wasm
   * @param {{print?:(s:string)=>void, printErr?:(s:string)=>void, stdin?:string|(()=>string|null), args?:string[],
   *          timeoutMs?:number, maxOutputBytes?:number, onExit?:(info:object)=>void}} [o]
   *   stdin as a string runs in a worker (output streams live). stdin as a callback runs on the page thread
   *   (sync callback, e.g. prompt()); output then appears when the program ends.
   */
  async run(wasm, o = {}) {
    const print = o.print || ((s) => console.log(s));
    const printErr = o.printErr || ((s) => console.error(s));
    if (typeof o.stdin === 'function') {
      const { runWasi } = await import(new URL('run.js', here).href);
      const r = await runWasi(wasm, { ...o, print, printErr });
      if (o.onExit) o.onExit(r);
      return r.code;
    }
    this.stop();
    const w = runner = new Worker(new URL('run.js', here), { type: 'module' });
    const copy = wasm.slice(0); // keep the caller's buffer usable for re-runs
    return new Promise((resolve) => {
      let timer = null;
      const finish = (info) => {
        if (timer) clearTimeout(timer);
        w.terminate(); if (runner === w) runner = null;
        if (o.onExit) o.onExit(info);
        resolve(info.code);
      };
      w.onmessage = (ev) => {
        const m = ev.data;
        if (m.type === 'out') (m.fd === 2 ? printErr : print)(m.text);
        else if (m.type === 'exit') finish(m);
      };
      w.onerror = (e) => { printErr(`\n[program crashed: ${e.message || 'unknown'}]\n`); finish({ code: 1, error: e.message }); };
      w._stop = () => { printErr('\n[stopped]\n'); finish({ code: 130, error: 'stopped' }); };
      if (o.timeoutMs) timer = setTimeout(() => { printErr(`\n[time limit ${o.timeoutMs} ms reached]\n`); finish({ code: 124, error: 'timeout' }); }, o.timeoutMs);
      w.postMessage({ type: 'run', wasm: copy, args: o.args, stdin: o.stdin ?? null, maxOutputBytes: o.maxOutputBytes }, [copy]);
    });
  },

  /** Stop a running program (kills its worker). */
  stop() { if (runner && runner._stop) runner._stop(); },

  /** Terminate the compiler worker now. */
  release,

  /** Delete the cached toolchain downloads. */
  async clearCache() {
    const r = await call({ type: 'clearCache' });
    release();
    return r.ok;
  },
};

if (typeof window !== 'undefined') window.EppFullBuild = EppFullBuild;
