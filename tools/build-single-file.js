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
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  if (/^https?:/.test(src)) return m;
  const code = fs.readFileSync(path.join(ROOT, src), "utf8").replace(/<\/script/gi, "<\\/script");
  return "<script>\n" + code + "</script>";
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
