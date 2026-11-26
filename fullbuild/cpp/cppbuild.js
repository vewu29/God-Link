// English++ Web Studio v3 — C++ mode page API (lazy: nothing loads until the first C++ Run).
//   const r = await EppCpp.build({ 'main.cpp': text, ... }, { onProgress })   -> {ok, wasm, raylib, errors, warnings, ms, stats}
//   console program: EppCpp.runConsole(r.wasm, { stdin, print, printErr })   (the Full build runner, in a Worker)
//   raylib program:  EppCpp.runRaylib(r.wasm, { canvas, print, printErr, onWindow })  -> { done, stop, stats }
// The compiler is the Full build's Clang 22 (same download, same cache); raylib programs add a 1.3 MB raylib bundle and
// binaryen.js (2.6 MB) for the Asyncify pass that lets the game loop hand each frame to the browser.

const here = new URL('.', import.meta.url);
let worker = null, nextId = 1, progressCb = null;
const pending = new Map();

function features(raylib) {
  const missing = [];
  if (typeof WebAssembly !== 'object') missing.push('WebAssembly');
  if (typeof Worker !== 'function') missing.push('Web Workers');
  if (typeof DecompressionStream !== 'function') missing.push('DecompressionStream (gzip)');
  if (!raylib && typeof WebAssembly === 'object') {
    const exn = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 0x60, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 0x1f, 0x40, 0, 0x0b, 0x0b]);
    if (!WebAssembly.validate(exn)) missing.push('WebAssembly exception handling (exnref)');
  }
  if (raylib) { try { if (!document.createElement('canvas').getContext('webgl2')) missing.push('WebGL2'); } catch (e) { missing.push('WebGL2'); } }
  return { ok: missing.length === 0, missing };
}
function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('cppworker.js', here), { type: 'module' });
    worker.onmessage = ev => {
      const m = ev.data;
      if (m.type === 'progress') { if (progressCb) progressCb(m.phase, m.loaded, m.total); return; }
      if (m.type === 'result' && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    };
    worker.onerror = e => {
      const err = { ok: false, errors: [{ line: null, column: null, message: 'the compiler stopped: ' + (e.message || 'unknown (possibly out of memory)') }], raw: '' };
      for (const r of pending.values()) r(err);
      pending.clear(); worker = null;
    };
  }
  return worker;
}
function call(msg) { const w = getWorker(), id = nextId++; return new Promise(r => { pending.set(id, r); w.postMessage({ ...msg, id }); }); }
function release() {
  if (worker) { worker.terminate(); worker = null; }
  for (const r of pending.values()) r({ ok: false, errors: [{ line: null, column: null, message: 'cancelled' }], raw: '' });
  pending.clear();
}
export const RAYLIB_RE = /#\s*include\s*[<"](raylib|raymath|rlgl|rcamera)\.h[>"]/;

export const EppCpp = {
  version: 'C++ mode r1: clang 22.0.0-git20695-13 (YoWASP); raylib 5.5 on WebGL2 (Studio WASI platform); binaryen 132 Asyncify',
  features,
  usesRaylib: files => Object.values(files).some(t => RAYLIB_RE.test(t)),
  async build(files, o = {}) {
    const raylib = EppCpp.usesRaylib(files);
    const f = features(raylib);
    if (!f.ok) return { ok: false, raylib, errors: [{ line: null, column: null, message: 'This browser lacks: ' + f.missing.join(', ') }], warnings: [], raw: '' };
    progressCb = o.onProgress || null;
    const t0 = performance.now();
    const r = await call({ type: 'build', files, opt: o.opt });
    r.totalMs = Math.round(performance.now() - t0);
    if (!o.keepWarm) release();
    return r;
  },
  async runConsole(wasm, o = {}) {
    const { EppFullBuild } = await import(new URL('../fullbuild.js', here).href);
    return EppFullBuild.run(wasm, o);
  },
  async stopConsole() { const { EppFullBuild } = await import(new URL('../fullbuild.js', here).href); EppFullBuild.stop(); },
  async runRaylib(wasm, o) {
    const { runRaylib } = await import(new URL('rlw_runtime.js', here).href);
    return runRaylib(wasm, o);
  },
  release
};
if (typeof window !== 'undefined') window.EppCpp = EppCpp;
