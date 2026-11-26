// English++ Web Studio v3 — C++ mode page API (lazy: nothing loads until the first C++ Run).
//   const r = await EppCpp.build({ 'main.cpp': text, ... }, { onProgress })   -> {ok, wasm, raylib, errors, warnings, ms, stats}
//   console program: EppCpp.runConsole(r.wasm, { stdin, print, printErr })   (the Full build runner, in a Worker)
//   raylib program:  EppCpp.runRaylib(r.wasm, { canvas, print, printErr, onWindow })  -> { done, stop, stats }
// v4: EppCpp.build(files, { interactive: true }) makes a console program whose std::cin / getline wait for input while
//   it runs: EppCpp.runConsoleLive(r.wasm, { readLine: () => Promise<string|null>, print, printErr, timeoutMs })
//   (null = end of input). EppCpp.usesExceptions(files) / readsInput(files) give the rule the Studio uses.
// v4 memory: the Asyncify pass runs in its own short-lived worker after the Clang worker is ended (keepWarm:false),
//   so the two are never in memory together.
// The compiler is the Full build's Clang 22 (same download, same cache); raylib programs add a 1.3 MB raylib bundle and
// binaryen.js (2.6 MB) for the Asyncify pass that lets the game loop hand each frame to the browser.

const here = new URL('.', import.meta.url);
let worker = null, nextId = 1, progressCb = null;
const pending = new Map();

function features(raylib, noExceptions) {
  const missing = [];
  if (typeof WebAssembly !== 'object') missing.push('WebAssembly');
  if (typeof Worker !== 'function') missing.push('Web Workers');
  if (typeof DecompressionStream !== 'function') missing.push('DecompressionStream (gzip)');
  if (!raylib && !noExceptions && typeof WebAssembly === 'object') {
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
// a second, short-lived worker (same file) that only loads binaryen.js and runs the Asyncify pass
let auxWorker = null, auxDone = null;
function asyncifyApart(wasm, imports) {
  return new Promise(res => {
    const w = auxWorker = new Worker(new URL('cppworker.js', here), { type: 'module' });
    const end = r => { w.terminate(); if (auxWorker === w) { auxWorker = null; auxDone = null; } res(r); };
    auxDone = end;
    w.onmessage = ev => { const m = ev.data; if (m.type === 'progress') { if (progressCb) progressCb(m.phase, m.loaded, m.total); return; } if (m.type === 'result') end(m.result); };
    w.onerror = e => end({ ok: false, errors: [{ line: null, column: null, message: 'the game preparation (Asyncify) stopped: ' + (e.message || 'unknown (possibly out of memory)') }] });
    w.postMessage({ type: 'asyncify', id: 1, wasm, imports }, [wasm]);
  });
}
function release() {
  if (worker) { worker.terminate(); worker = null; }
  if (auxDone) auxDone({ ok: false, errors: [{ line: null, column: null, message: 'cancelled' }] });
  for (const r of pending.values()) r({ ok: false, errors: [{ line: null, column: null, message: 'cancelled' }], raw: '' });
  pending.clear();
}
export const RAYLIB_RE = /#\s*include\s*[<"](raylib|raymath|rlgl|rcamera)\.h[>"]/;
// code only: comments, strings and character literals blanked, so a word inside a string doesn't count
function codeOnly(t) { return String(t).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|R"([^(]*)\([\s\S]*?\)\1"|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/g, ' '); }
const EXC_RE = /\b(try|throw|catch)\b|\bstd::(exception_ptr|current_exception|rethrow_exception)\b/;
const READ_RE = /\b(cin|getline|scanf|getchar|fgets|fgetc|getc|fread|gets)\b|\bstd::istream_iterator\b|\bstdin\b/;
export const usesExceptions = files => Object.values(files).some(t => EXC_RE.test(codeOnly(t)));
export const readsInput = files => Object.values(files).some(t => READ_RE.test(codeOnly(t)));

export const EppCpp = {
  version: 'C++ mode r1: clang 22.0.0-git20695-13 (YoWASP); raylib 5.5 on WebGL2 (Studio WASI platform); binaryen 132 Asyncify',
  features,
  usesRaylib: files => Object.values(files).some(t => RAYLIB_RE.test(t)),
  usesExceptions, readsInput,
  async build(files, o = {}) {
    const raylib = EppCpp.usesRaylib(files);
    const f = features(raylib, !!o.interactive);
    if (!f.ok) return { ok: false, raylib, errors: [{ line: null, column: null, message: 'This browser lacks: ' + f.missing.join(', ') }], warnings: [], raw: '' };
    progressCb = o.onProgress || null;
    const t0 = performance.now();
    const r = await call({ type: 'build', files, opt: o.opt, interactive: !!o.interactive });
    if (!o.keepWarm) release();       // give Clang's memory back before anything else happens
    if (r.ok && r.needsAsyncify && !o.noAsyncify) {   // noAsyncify: tests only (the raw Clang output)
      const t1 = performance.now();
      const a = await asyncifyApart(r.wasm, r.needsAsyncify);
      if (!a.ok) { a.totalMs = Math.round(performance.now() - t0); a.raylib = r.raylib; a.warnings = r.warnings || []; return a; }
      r.wasm = a.wasm; r.stats = { ...(r.stats || {}), asyncifyMs: a.ms, asyncifyWallMs: Math.round(performance.now() - t1) };
      delete r.needsAsyncify;
    }
    r.totalMs = Math.round(performance.now() - t0);
    return r;
  },
  async runConsole(wasm, o = {}) {
    const { EppFullBuild } = await import(new URL('../fullbuild.js', here).href);
    return EppFullBuild.run(wasm, o);
  },
  async stopConsole() { if (liveStop) liveStop(); const { EppFullBuild } = await import(new URL('../fullbuild.js', here).href); EppFullBuild.stop(); },
  runConsoleLive,
  async runRaylib(wasm, o) {
    const { runRaylib } = await import(new URL('rlw_runtime.js', here).href);
    return runRaylib(wasm, o);
  },
  release
};
if (typeof window !== 'undefined') window.EppCpp = EppCpp;

// ---------- v4: a console program that asks for input while it runs (worker: runio.js) ----------
let liveStop = null;
function runConsoleLive(wasm, o = {}) {
  const print = o.print || (s => console.log(s)), printErr = o.printErr || (s => console.error(s));
  const w = new Worker(new URL('runio.js', here), { type: 'module' });
  const copy = wasm.slice(0);
  return new Promise(resolve => {
    let timer = null, left = o.timeoutMs || 0, since = 0, ended = false;
    const arm = () => { if (!left) return; since = performance.now(); timer = setTimeout(() => { printErr(`\n[time limit ${o.timeoutMs} ms reached]\n`); finish({ code: 124, error: 'timeout' }); }, left); };
    const pause = () => { if (!left || !timer) return; clearTimeout(timer); timer = null; left = Math.max(1, left - (performance.now() - since)); };
    const finish = info => { if (ended) return; ended = true; clearTimeout(timer); w.terminate(); if (liveStop === stopIt) liveStop = null; if (o.onExit) o.onExit(info); resolve(info.code); };
    const stopIt = () => { printErr('\n[stopped]\n'); finish({ code: 130, error: 'stopped' }); };
    liveStop = stopIt;
    w.onmessage = async ev => {
      const m = ev.data;
      if (m.type === 'out') (m.fd === 2 ? printErr : print)(m.text);
      else if (m.type === 'read') {
        pause();                                   // the time limit doesn't count while the program waits for you
        let line = null;
        try { line = o.readLine ? await o.readLine() : null; } catch (e) { line = null; }
        if (ended) return;
        arm();
        w.postMessage({ type: 'input', text: line == null ? null : String(line) + '\n' });
      }
      else if (m.type === 'exit') finish(m);
    };
    w.onerror = e => { printErr(`\n[program crashed: ${e.message || 'unknown'}]\n`); finish({ code: 1, error: e.message }); };
    arm();
    w.postMessage({ type: 'run', wasm: copy, maxOutputBytes: o.maxOutputBytes }, [copy]);
  });
}
