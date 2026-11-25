// English++ Web Studio — Full build compiler worker (module worker).
// Runs Clang/LLD 22 (YoWASP @yowasp/clang, WASI) inside this worker and turns C++ into a wasm32-wasip1 program.
// Messages in:  {type:'build', id, cpp, files?, opt?, extraArgs?}  |  {type:'preload', id}  |  {type:'clearCache', id}
// Messages out: {type:'progress', phase, loaded, total}  |  {type:'result', id, result}
// Result: {ok:true, wasm:ArrayBuffer, ms, warnings, raw, stats} or {ok:false, errors:[{line,column,message}], warnings, raw, ms, stats}
// No SharedArrayBuffer, no special headers. Downloads are pre-gzipped (.gz), stored as base64 text chunks, decoded here and kept (as .gz) in the Cache API.

const VENDOR = new URL('./vendor/yowasp-clang/', import.meta.url);
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

async function build({ cpp, files, opt, extraArgs }) {
  const t0 = performance.now();
  const clang = await loadClang();
  const t1 = performance.now();
  sendProgress('compile');
  const tree = { 'main.cpp': cpp };
  if (files) for (const [k, v] of Object.entries(files)) tree[k] = v;
  const args = ['clang++', '-std=c++20', opt || '-O2',
    '-fwasm-exceptions', '-mllvm', '-wasm-use-legacy-eh=false',
    '-fno-color-diagnostics', '-Wall',
    '-Wl,--strip-all', '-Wl,-z,stack-size=4194304',
    ...(extraArgs || []),
    'main.cpp', '-o', 'main.wasm', '-lunwind'];
  let raw = '';
  const dec = new TextDecoder();
  const stderr = (b) => { if (b) raw += dec.decode(b, { stream: true }); };
  let out = null, failed = false;
  try {
    out = await clang.runClang(args, tree, { stderr, stdout: stderr, fetchProgress: () => {} });
  } catch (e) {
    failed = true;
    if (!(e && typeof e.code === 'number')) raw += '\n' + (e && e.stack || String(e));
  }
  sampleMemories();
  const ms = Math.round(performance.now() - t1);
  const { errors, warnings } = parseDiagnostics(raw);
  const s = { ...stats, loadMs: Math.round(t1 - t0), buildMs: ms };
  memories.clear();
  if (failed || !out || !out['main.wasm']) {
    if (!errors.length) errors.push({ file: null, line: null, column: null, message: raw.trim() || 'build failed' });
    return { result: { ok: false, errors, warnings, raw, ms, stats: s } };
  }
  const bytes = out['main.wasm'];
  const wasm = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes.buffer : bytes.slice().buffer;
  return { result: { ok: true, wasm, ms, warnings, raw, stats: s }, transfer: [wasm] };
}

self.onmessage = async (ev) => {
  const msg = ev.data || {};
  try {
    if (msg.type === 'build') {
      const { result, transfer } = await build(msg);
      post({ type: 'result', id: msg.id, result }, transfer);
    } else if (msg.type === 'preload') {
      await loadClang();
      post({ type: 'result', id: msg.id, result: { ok: true, stats } });
    } else if (msg.type === 'clearCache') {
      const ok = await caches.delete(CACHE_NAME).catch(() => false);
      post({ type: 'result', id: msg.id, result: { ok } });
    }
  } catch (e) {
    post({ type: 'result', id: msg.id, result: { ok: false, errors: [{ line: null, column: null, message: String(e && e.message || e) }], raw: String(e && e.stack || e) } });
  }
};
