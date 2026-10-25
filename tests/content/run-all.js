#!/usr/bin/env node
// Content validation: every PC project in every programming track is
// compiled/run with the real toolchain at its default, minimum and
// maximum settings, and its real output must equal what the app's
// Compile & Run screen shows. Drill lines are parse-checked where the
// language can parse a single line on its own.
//
// Toolchains that are not installed are reported as SKIP, never PASS.
// Usage: node tests/content/run-all.js [trackId ...]
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { launch, newPage, trackIds } = require("../helpers/harness");
const TOOLCHAINS = require("./toolchains");

function has(cmd) { return spawnSync("sh", ["-c", `command -v ${cmd}`]).status === 0; }

async function dumpTrack(env, track) {
  const { ctx, page } = await newPage(env, { track });
  const data = await page.evaluate(() => ({
    lines: BLOCKS.map((b) => b.line),
    projects: (window.__isDrive ? [] : PROJECTS).map((p) => {
      const sets = { default: {}, min: {}, max: {} };
      p.vars.forEach((d) => { sets.default[d.key] = d.val; sets.min[d.key] = d.min; sets.max[d.key] = d.max; });
      return { name: p.name, file: p.file, cases: Object.entries(sets).map(([k, v]) => ({ k, v, code: p.code(v).join("\n"), out: p.run(v) })) };
    }),
  }));
  await ctx.close();
  return data;
}

(async () => {
  const env = await launch();
  const wanted = process.argv.slice(2);
  const ids = (await trackIds(env)).filter((t) => (wanted.length ? wanted.includes(t) : true));
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "cb-content-"));
  let failures = 0, passes = 0, skips = 0;
  for (const track of ids) {
    const tc = TOOLCHAINS[track];
    if (!tc) { console.log(`SKIP  ${track}: no toolchain defined`); skips++; continue; }
    const missing = tc.needs.filter((c) => !has(c));
    if (missing.length) { console.log(`SKIP  ${track}: missing ${missing.join(", ")}`); skips++; continue; }
    const data = await dumpTrack(env, track);
    const dir = path.join(work, track);
    fs.mkdirSync(dir, { recursive: true });
    if (tc.setup) tc.setup(dir);
    let bad = 0, n = 0;
    for (const p of data.projects) {
      for (const c of p.cases) {
        n++;
        const r = tc.build(dir, c.code, p);
        if (!r.ok) { bad++; console.log(`FAIL  ${track} · ${p.name} (${c.k}): does not build\n      ${r.error.split("\n").slice(0, 4).join("\n      ")}`); continue; }
        const got = r.stdout.replace(/\r/g, "").replace(/\n$/, "");
        const want = c.out.join("\n");
        if (got !== want) { bad++; console.log(`FAIL  ${track} · ${p.name} (${c.k} ${JSON.stringify(c.v)}): output differs\n      real: ${JSON.stringify(got.split("\n").slice(0, 5))}\n      app:  ${JSON.stringify(c.out.slice(0, 5))}`); }
      }
    }
    let lineBad = 0;
    if (tc.parseLine) {
      data.lines.forEach((l, i) => {
        const err = tc.parseLine(dir, l);
        if (err) { lineBad++; console.log(`FAIL  ${track} · drill ${i + 1} ${JSON.stringify(l)} does not parse: ${err.split("\n")[0]}`); }
      });
    }
    const ok = bad === 0 && lineBad === 0;
    console.log(`${ok ? "PASS" : "FAIL"}  ${track}: ${n - bad}/${n} program runs match the app${tc.parseLine ? `, ${data.lines.length - lineBad}/${data.lines.length} drill lines parse` : ""}`);
    if (ok) passes++; else failures++;
  }
  await env.close();
  console.log(`\n${passes} track(s) passed, ${failures} failed, ${skips} skipped`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
