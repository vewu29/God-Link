// Bundles src/editor.js (CodeMirror 6 + the English++ mode) into one minified
// file for the site, with every bundled package's licence text in the header.
const fs = require("fs"), path = require("path"), esbuild = require("esbuild");
const out = process.argv[2] || path.join(__dirname, "../stage/js/vendor/codemirror-epp.js");
(async () => {
  const r = await esbuild.build({
    entryPoints: [path.join(__dirname, "src/editor.js")], bundle: true, minify: true, format: "iife",
    globalName: "EppCM", target: ["safari15", "chrome100"], write: false, metafile: true, legalComments: "none"
  });
  // which packages ended up in the bundle
  const pkgs = new Map();
  for (const f of Object.keys(r.metafile.inputs)) {
    const m = f.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//); if (!m) continue;
    const dir = path.join(__dirname, "node_modules", m[1]);
    const pj = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    const lic = fs.readdirSync(dir).find(n => /^licen[sc]e/i.test(n));
    pkgs.set(m[1], { v: pj.version, license: pj.license, text: lic ? fs.readFileSync(path.join(dir, lic), "utf8").trim() : "" });
  }
  const groups = new Map();
  for (const [n, p] of pkgs) { const k = p.text; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(n + "@" + p.v + " (" + p.license + ")"); }
  let banner = "/*! English++ Web Studio editor bundle — CodeMirror 6 with the English++ mode.\n * English++ is Vewu's language. Bundled packages and their licences:\n";
  for (const [text, names] of groups) banner += " *\n * " + names.join(", ") + "\n *\n" + text.split("\n").map(l => " * " + l).join("\n").replace(/\*\//g, "* /") + "\n";
  banner += " */\n";
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, banner + r.outputFiles[0].text);
  console.log("wrote", out, fs.statSync(out).size, "bytes;", pkgs.size, "packages:", [...pkgs.keys()].join(" "));
})().catch(e => { console.error(e); process.exit(1); });
