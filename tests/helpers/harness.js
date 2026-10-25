// Shared Playwright helpers for the Code Block test suite.
//
// Serves the repository over a throwaway local HTTP server, routes the
// cdnjs scripts (three.js, pdf.js) to the identical npm copies in
// node_modules so tests run offline, and blocks web fonts so layout
// measurements do not depend on the network.
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..", "..");
const APP = process.env.CB_APP || "index.html";
const NM = path.join(ROOT, "node_modules");
const CDN_MAP = {
  "three.js/r128/three.min.js": path.join(NM, "three/build/three.min.js"),
  "pdf.js/3.11.174/pdf.min.js": path.join(NM, "pdfjs-dist/build/pdf.min.js"),
  "pdf.js/3.11.174/pdf.worker.min.js": path.join(NM, "pdfjs-dist/build/pdf.worker.min.js"),
};
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".pdf": "application/pdf" };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => resolve(srv));
  });
}

async function launch() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}/${APP.split("/").map(encodeURIComponent).join("/")}`;
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
  return { srv, base, browser, async close() { await browser.close(); srv.close(); } };
}

// Track ids as stored in localStorage "code-block-lang-v1" (C++ is the
// default and is stored as "no key").
async function newPage(env, opts = {}) {
  const {
    viewport = { width: 390, height: 844 }, mobile = true, track = "cpp", bootSeen = true,
    storage = {}, cdn = true, reducedMotion = "reduce", colorScheme = "light", world = false,
  } = opts;
  const ctx = await env.browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion, colorScheme });
  const log = { console: [], pageErrors: [] };
  await ctx.route("https://cdnjs.cloudflare.com/**", (route) => {
    const u = route.request().url();
    const key = Object.keys(CDN_MAP).find((k) => u.endsWith(k));
    // The 3D world takes seconds to build with software WebGL, so tests
    // that don't need it get the app's own no-WebGL fallback (world:
    // false); the smoke test builds the real world for every track.
    if (!cdn || !key || !fs.existsSync(CDN_MAP[key]) || (!world && key.startsWith("three"))) return route.abort();
    route.fulfill({ status: 200, contentType: "application/javascript", body: fs.readFileSync(CDN_MAP[key]) });
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const init = { ...storage };
  if (bootSeen) init["code-block-boot-seen-v1"] = "1";
  if (track !== "cpp") init["code-block-lang-v1"] = track;
  await ctx.addInitScript((kv) => {
    // Only the app itself is seeded; frames inside it (the sandboxed
    // HTML & CSS preview has no storage at all) are left alone.
    if (window.top !== window) return;
    if (sessionStorage.getItem("__cbSeeded")) return;
    sessionStorage.setItem("__cbSeeded", "1");
    for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v);
  }, init);
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") log.console.push(m.text()); });
  page.on("pageerror", (e) => log.pageErrors.push(String((e && e.stack) || e)));
  await page.goto(env.base, { waitUntil: "load" });
  await page.waitForTimeout(300);
  return { ctx, page, log };
}

// Every track the app offers, read from the running page so tests
// follow the registry instead of a hard-coded list. CB_TRACKS=a,b limits
// a run to some tracks (handy while writing one).
async function trackIds(env) {
  const { ctx, page } = await newPage(env);
  const ids = await page.evaluate(() => (window.CB_TRACK_LIST ? window.CB_TRACK_LIST.map((t) => t.id) : ["cpp", "cs", "drive"]));
  await ctx.close();
  const only = (process.env.CB_TRACKS || "").split(",").filter(Boolean);
  return only.length ? ids.filter((id) => only.includes(id)) : ids;
}

// Runs fn(track) for every track, a few at a time (each in its own
// browser context), and collects failures instead of stopping at the
// first, so one run reports every broken track.
async function eachTrack(ids, fn, width = 4) {
  const errors = [];
  let next = 0;
  async function worker() {
    while (next < ids.length) {
      const id = ids[next++];
      try { await fn(id); } catch (e) { errors.push(`${id}: ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(width, ids.length) }, worker));
  if (errors.length) throw new Error(errors.join("\n"));
}

module.exports = { launch, newPage, trackIds, eachTrack, ROOT, APP };
