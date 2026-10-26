#!/usr/bin/env node
// Bundles index.html + css/ + js/ + tracks/ into ONE self-contained
// HTML file (dist/code-block.html) — handy for opening the app from a
// phone's Files app or sharing it as a single download. Only the CDN
// libraries (three.js, pdf.js) and web fonts stay external, exactly as
// in the original single-file app; it works without them too.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const out = path.join(ROOT, "dist", "code-block.html");
let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

html = html.replace(/<link rel="stylesheet" href="([^"]+)" \/>/g, (m, href) => {
  if (/^https?:/.test(href)) return m;
  return "<style>\n" + fs.readFileSync(path.join(ROOT, href), "utf8") + "</style>";
});
const inline = (file) => "<script>\n" + fs.readFileSync(path.join(ROOT, file), "utf8").replace(/<\/script/gi, "<\\/script") + "</script>";
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  if (/^https?:/.test(src)) return m;
  if (src !== "js/tracks.js") return inline(src);
  // Every track ships inside the bundle; the registry sees __cbBundled
  // and skips its on-demand loader. Track files only register (or, for
  // the original C# and Drive files, declare) their data, and build
  // nothing unless they are the active track.
  const tracks = fs.readdirSync(path.join(ROOT, "tracks")).filter((f) => f.endsWith(".js")).sort();
  return "<script>window.__cbBundled = true;</script>\n    " + inline(src) + "\n    " + tracks.map((f) => inline("tracks/" + f)).join("\n    ");
});

// Studio is a page of its own (studio.html) that a lone file can't link
// to, so the single file leaves out the card that opens it.
html = html.replace(/\s*<!-- Code Block Studio:[\s\S]*?<\/a>\n/, "\n");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
