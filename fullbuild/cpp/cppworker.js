// English++ Web Studio — C++ mode compiler worker (module worker). Shares the Full build's Clang download and cache.
// (The toolchain-loading part below is the same code as ../worker.js.)
// Runs Clang/LLD 22 (YoWASP @yowasp/clang, WASI) inside this worker and turns C++ into a wasm32-wasip1 program.
// Messages in:  {type:'build', id, cpp, files?, opt?, extraArgs?}  |  {type:'preload', id}  |  {type:'clearCache', id}
// Messages out: {type:'progress', phase, loaded, total}  |  {type:'result', id, result}
// Result: {ok:true, wasm:ArrayBuffer, ms, warnings, raw, stats} or {ok:false, errors:[{line,column,message}], warnings, raw, ms, stats}
// No SharedArrayBuffer, no special headers. Downloads are pre-gzipped (.gz), stored as base64 text chunks, decoded here and kept (as .gz) in the Cache API.

const VENDOR = new URL('../vendor/yowasp-clang/', import.meta.url);
const CPPV = new URL('./vendor/', import.meta.url);
const CPP_CACHE = 'epp-cpp-mode-r1';
const CACHE_NAME = 'epp-fullbuild-clang-22.0.0-git20695-13-r2-b64';
const origFetch = globalThis.fetch.bind(globalThis);

let manifest = null;
let clangPromise = null;
const progress = { loaded: 0, total: 0 };
const stats = { maxWasmMemory: 0, downloads: {}, fromCache: 0, fromNetwork: 0, cacheErrors: null };

function post(msg, transfer) { self.postMessage(msg, transfer || []); }
function sendProgress(phase) { post({ type: 'progress', phase, loaded: progress.loaded, total: progress.total }); }

// Track every wasm Memory the toolchain creates, to report clang's linear-memory peak.
const memories = new Set();
function noteInstance(inst) {
  try { for (const v of Object.values(inst.exports)) if (v instanceof WebAssembly.Memory) memories.add(v); } catch (_) {}
}
function sampleMemories() {
  for (const m of memories) stats.maxWasmMemory = Math.max(stats.maxWasmMemory, m.buffer.byteLength);
}
{
  const OrigInstance = WebAssembly.Instance;
  const origInstantiate = WebAssembly.instantiate;
  WebAssembly.Instance = function (mod, imp) { const i = new OrigInstance(mod, imp); noteInstance(i); return i; };
  WebAssembly.Instance.prototype = OrigInstance.prototype;
  WebAssembly.instantiate = async function (src, imp) {
    const r = await origInstantiate.call(WebAssembly, src, imp);
    noteInstance(r.instance || r);
    return r;
  };
}


// Decode base64 text bytes (whitespace ignored) to bytes.
const B64T = (() => { const t = new Int16Array(256).fill(-1); const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; for (let i = 0; i < 64; i++) t[A.charCodeAt(i)] = i; return t; })();
function b64ToBytes(txt) {
  const out = new Uint8Array(Math.floor(txt.length * 3 / 4) + 3); let o = 0, acc = 0, bits = 0;
  for (let j = 0; j < txt.length; j++) {
    const v = B64T[txt[j]];
    if (v < 0) { if (txt[j] === 61) break; continue; }
    acc = ((acc << 6) | v) & 0xffffff; bits += 6;
    if (bits >= 8) { bits -= 8; out[o++] = (acc >> bits) & 255; }
  }
  return out.subarray(0, o);
}

async function openCache() {
  try { return await caches.open(CACHE_NAME); } catch (e) { (stats.cacheErrors ||= []).push('open: ' + e); return null; } // Cache API absent (e.g. insecure origin): fall back to HTTP cache
}

// fetch() replacement handed to the YoWASP bundle: serves <name>.gz from the Cache API (or network),
// counts compressed bytes for progress, and returns a decompressed Response.
async function vendorFetch(input, init) {
  const url = new URL(input instanceof Request ? input.url : String(input));
  const name = url.pathname.split('/').pop();
  if (!manifest || !manifest.files[name]) return origFetch(input, init);
  const gzUrl = new URL(name + '.gz', VENDOR).href;
  const cache = await openCache();
  let resp = cache ? await cache.match(gzUrl) : null;
  const fromCache = !!resp;
  const phase = fromCache ? 'cache' : 'download';
  let blob, got = 0;
  if (resp) {
    blob = await resp.blob();
    got = blob.size; progress.loaded += manifest.files[name].b64 || got; sendProgress(phase);
  } else {
    // Stored as base64 text chunks (<name>.gz.b64.000 ...) because the site repo only takes text files.
    const n = manifest.files[name].b64_chunks;
    const parts = [];
    for (let i = 0; i < n; i++) {
      const cUrl = new URL(`${name}.gz.b64.${String(i).padStart(3, '0')}`, VENDOR).href;
      const r = await origFetch(cUrl);
      if (!r.ok) throw new Error(`Full build: download failed ${r.status} ${cUrl}`);
      const reader = r.body.getReader();
      const tchunks = []; let tlen = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        tchunks.push(value); tlen += value.length; progress.loaded += value.length;
        sendProgress(phase);
      }
      const txt = new Uint8Array(tlen); let o = 0;
      for (const c of tchunks) { txt.set(c, o); o += c.length; }
      tchunks.length = 0;
      parts.push(b64ToBytes(txt));
    }
    blob = new Blob(parts); // Blob lets the engine keep the bytes off the JS heap
    parts.length = 0;
    got = blob.size;
    const h = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
    if (h[0] !== 0x1f || h[1] !== 0x8b) throw new Error(`Full build: ${name} did not decode (bad base64)`);
  }
  stats.downloads[name] = { bytes: got, fromCache };
  if (fromCache) stats.fromCache += got; else stats.fromNetwork += got;
  if (!fromCache && cache) {
    try { await cache.put(gzUrl, new Response(blob, { headers: { 'content-type': 'application/gzip' } })); }
    catch (e) { (stats.cacheErrors ||= []).push(name + ': ' + (e && e.name) + ' ' + (e && e.message)); }
  }
  const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  const gz = head[0] === 0x1f && head[1] === 0x8b; // host may already have decoded Content-Encoding
  const body = gz ? blob.stream().pipeThrough(new DecompressionStream('gzip')) : blob.stream();
  const type = name.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
  return new Response(body, { headers: { 'content-type': type } });
}

async function loadClang() {
  if (!clangPromise) {
    clangPromise = (async () => {
      manifest = await (await origFetch(new URL('manifest.json', VENDOR))).json();
      progress.total = Object.values(manifest.files).reduce((a, f) => a + (f.b64 || f.gz), 0);
      progress.loaded = 0;
      sendProgress('download');
      globalThis.fetch = vendorFetch; // the bundle captures globalThis.fetch when it is first evaluated
      const mod = await import(new URL('bundle.js', VENDOR).href);
      const t0 = performance.now();
      await mod.runClang(null, {}, { fetchProgress: () => {} }); // fetch + compile toolchain modules, unpack sysroot
      stats.initMs = Math.round(performance.now() - t0);
      sendProgress('ready');
      return mod;
    })();
    clangPromise.catch(() => { clangPromise = null; });
  }
  return clangPromise;
}

const DIAG_RE = /^(?:\/)?([^\s:][^:\n]*):(\d+):(\d+): (fatal error|error|warning): (.*)$/;
function parseDiagnostics(raw) {
  const errors = [], warnings = [];
  for (const line of raw.split('\n')) {
    let m = DIAG_RE.exec(line);
    if (m) {
      const d = { file: m[1], line: +m[2], column: +m[3], message: m[5] };
      (m[4] === 'warning' ? warnings : errors).push(d);
      continue;
    }
    m = /^wasm-ld: error: (.*)$/.exec(line);
    if (m) errors.push({ file: null, line: null, column: null, message: 'link: ' + m[1] });
    else if (/^(clang|clang\+\+|error): error: /.test(line)) errors.push({ file: null, line: null, column: null, message: line });
  }
  return { errors, warnings };
}


// ---------- C++ mode downloads (raylib bundle, binaryen.js): base64 text chunks of gzip, cached as .gz ----------
let cppManifest = null;
async function cppFile(name) {
  cppManifest ||= await (await origFetch(new URL('manifest.json', CPPV))).json();
  const info = cppManifest[name]; if (!info) throw new Error('C++ mode: unknown download ' + name);
  const key = new URL(name + '.gz', CPPV).href;
  let cache = null; try { cache = await caches.open(CPP_CACHE); } catch (e) {}
  let blob = null;
  const hit = cache ? await cache.match(key) : null;
  if (hit) { blob = await hit.blob(); stats.downloads[name] = { bytes: blob.size, fromCache: true }; }
  else {
    const parts = [];
    for (let i = 0; i < info.b64_chunks; i++) {
      const u = new URL(`${name}.gz.b64.${String(i).padStart(3, '0')}`, CPPV).href;
      const r = await origFetch(u); if (!r.ok) throw new Error(`C++ mode: download failed ${r.status} ${u}`);
      parts.push(b64ToBytes(new Uint8Array(await r.arrayBuffer())));
      post({ type: 'progress', phase: 'download-' + name, loaded: i + 1, total: info.b64_chunks });
    }
    blob = new Blob(parts);
    stats.downloads[name] = { bytes: blob.size, fromCache: false };
    if (cache) try { await cache.put(key, new Response(blob, { headers: { 'content-type': 'application/gzip' } })); } catch (e) {}
  }
  return new Uint8Array(await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
let raylibTree = null;
async function loadRaylib() {
  if (raylibTree) return raylibTree;
  const p = await cppFile('raylib-cpp.pack');
  const n = new DataView(p.buffer, p.byteOffset).getUint32(0, true);
  const hdr = JSON.parse(new TextDecoder().decode(p.subarray(4, 4 + n)));
  const tree = {}; let off = 4 + n;
  for (const [path, size] of hdr.files) {
    const parts = path.split('/'); let d = tree;
    for (const q of parts.slice(0, -1)) d = (d[q] ||= {});
    const bytes = p.slice(off, off + size); off += size;
    d[parts[parts.length - 1]] = /\.(h|syms)$/.test(path) ? new TextDecoder().decode(bytes) : bytes;
  }
  return (raylibTree = tree);
}
let binaryenP = null;
function loadBinaryen() {
  binaryenP ||= (async () => {
    const js = await cppFile('binaryen.js');
    const url = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
    try { return (await import(url)).default; } finally { URL.revokeObjectURL(url); }
  })();
  binaryenP.catch(() => { binaryenP = null; });
  return binaryenP;
}
async function asyncify(bytes) {
  const binaryen = await loadBinaryen();
  const t0 = performance.now();
  const m = binaryen.readBinary(bytes);
  try {
    // only what Clang 22 emits for wasm32-wasip1 (All would also turn on newer encodings such as compact imports,
    // which browsers reject: "Invalid import kind 127")
    const F = binaryen.Features;
    m.setFeatures(F.MutableGlobals | F.NontrappingFPToInt | F.BulkMemory | F.BulkMemoryOpt | F.SignExt | F.ReferenceTypes | F.Multivalue | F.CallIndirectOverlong);
    binaryen.setPassArgument('asyncify-imports', 'env.rlw_present,env.rlw_sleep');
    binaryen.setOptimizeLevel(1); binaryen.setShrinkLevel(0);
    m.runPasses(['asyncify']);
    const out = m.emitBinary();
    return { wasm: out, ms: Math.round(performance.now() - t0) };
  } finally { m.dispose(); }
}

const RAYLIB_RE = /#\s*include\s*[<"](raylib|raymath|rlgl|rcamera)\.h[>"]/;
/** files: {name: text}. Builds every .cpp/.cc/.cxx file; headers are available to #include. */
async function buildCpp({ files, opt }) {
  const t0 = performance.now();
  const names = Object.keys(files);
  const units = names.filter(n => /\.(cpp|cc|cxx|c\+\+)$/i.test(n));
  if (!units.length) return { result: { ok: false, errors: [{ file: null, line: null, column: null, message: 'There is no .cpp file to build.' }], warnings: [], raw: '', ms: 0 } };
  const raylib = names.some(n => RAYLIB_RE.test(files[n]));
  const clang = await loadClang();
  const tree = {};
  for (const n of names) tree[n] = files[n];
  if (raylib) { tree.raylib = await loadRaylib(); sendProgress('raylib'); }
  const t1 = performance.now();
  sendProgress('compile');
  const args = raylib
    ? ['clang++', '-std=c++20', opt || '-O2', '-fno-exceptions', '-fno-color-diagnostics', '-Wall', '-Iraylib/include', '-nostdlib++',
       ...units, 'raylib/lib/libraylib.a', 'raylib/lib/libc++.a', 'raylib/lib/libc++abi.a', '-o', 'main.wasm',
       '-Wl,--allow-undefined-file=raylib/lib/gl.syms', '-Wl,--strip-all', '-Wl,-z,stack-size=1048576']
    : ['clang++', '-std=c++20', opt || '-O2', '-fwasm-exceptions', '-mllvm', '-wasm-use-legacy-eh=false', '-fno-color-diagnostics', '-Wall',
       '-Wl,--strip-all', '-Wl,-z,stack-size=4194304', ...units, '-o', 'main.wasm', '-lunwind'];
  let raw = '';
  const dec = new TextDecoder();
  const stderr = (b) => { if (b) raw += dec.decode(b, { stream: true }); };
  let out = null, failed = false;
  try { out = await clang.runClang(args, tree, { stderr, stdout: stderr, fetchProgress: () => {} }); }
  catch (e) { failed = true; if (!(e && typeof e.code === 'number')) raw += '\n' + (e && e.stack || String(e)); }
  sampleMemories();
  const compileMs = Math.round(performance.now() - t1);
  const { errors, warnings } = parseDiagnostics(raw);
  const s = { ...stats, loadMs: Math.round(t1 - t0), buildMs: compileMs, raylib };
  memories.clear();
  if (failed || !out || !out['main.wasm']) {
    if (!errors.length) errors.push({ file: null, line: null, column: null, message: raw.trim() || 'build failed' });
    return { result: { ok: false, errors, warnings, raw, ms: compileMs, raylib, stats: s } };
  }
  let bytes = out['main.wasm'];
  if (raylib) {
    sendProgress('asyncify');
    const a = await asyncify(bytes);
    bytes = a.wasm; s.asyncifyMs = a.ms;
  }
  const wasm = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes.buffer : bytes.slice().buffer;
  return { result: { ok: true, wasm, raylib, ms: Math.round(performance.now() - t1), warnings, raw, stats: s }, transfer: [wasm] };
}

self.onmessage = async (ev) => {
  const msg = ev.data || {};
  try {
    if (msg.type === 'build') {
      const { result, transfer } = await buildCpp(msg);
      post({ type: 'result', id: msg.id, result }, transfer);
    } else if (msg.type === 'preload') {
      await loadClang(); if (msg.raylib) { await loadRaylib(); await loadBinaryen(); }
      post({ type: 'result', id: msg.id, result: { ok: true, stats } });
    }
  } catch (e) {
    post({ type: 'result', id: msg.id, result: { ok: false, errors: [{ line: null, column: null, message: String(e && e.message || e) }], raw: String(e && e.stack || e) } });
  }
};
