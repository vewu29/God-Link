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
    // Library and reference code, and every line the Vault can deal.
    examples: [
      ...DEEP.map((d, i) => d && { where: "chapter " + (i + 1), code: d.ex.code, run: !d.ex.browser }),
      ...SHELFDEEP.map((d, i) => d && { where: "shelf " + (i + 1), code: d.ex.code, run: !d.ex.browser }),
      ...CHEATS.map((c) => ({ where: "cheat card " + c.title, code: c.code })),
      ...CHAPTERS.map((c, i) => ({ where: "chapter " + (i + 1) + " key line", code: Array.isArray(c.line) ? c.line.join("\n") : c.line, line: true })),
    ].filter(Boolean),
    vault: (() => { const out = []; for (let p = 0; p < 100; p++) cbGenPack(p).forEach((d) => out.push(d.line)); return out; })(),
    projects: (window.__isDrive ? [] : PROJECTS).map((p) => {
      const sets = { default: {}, min: {}, max: {} };
      p.vars.forEach((d) => { sets.default[d.key] = d.val; sets.min[d.key] = d.min; sets.max[d.key] = d.max; });
      // harness(v): test-only setup for engine tracks (which objects to
      // build, how many frames to play); never shown in the app.
      return { name: p.name, file: p.file, cases: Object.entries(sets).map(([k, v]) => ({ k, v, code: p.code(v).join("\n"), out: p.run(v), harness: p.harness ? p.harness(v) : null })) };
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
        const r = tc.build(dir, c.code, p, c);
        if (!r.ok) { bad++; console.log(`FAIL  ${track} · ${p.name} (${c.k}): does not build\n      ${r.error.split("\n").slice(0, 4).join("\n      ")}`); continue; }
        const got = r.stdout.replace(/\r/g, "").replace(/\n$/, "");
        const want = c.out.join("\n");
        if (got !== want) { bad++; console.log(`FAIL  ${track} · ${p.name} (${c.k} ${JSON.stringify(c.v)}): output differs\n      real: ${JSON.stringify(got.split("\n").slice(0, 5))}\n      app:  ${JSON.stringify(c.out.slice(0, 5))}`); }
      }
    }
    // Lines (drills + every Vault line) are checked in one batch per
    // track; examples are parsed, and run when they are whole programs.
    const notes = [];
    let lineBad = 0, exBad = 0;
    if (tc.checkLines) {
      const all = [...data.lines.map((l, i) => ({ where: `drill ${i + 1}`, code: l })), ...data.vault.map((l, i) => ({ where: `vault line ${i + 1}`, code: l }))];
      const errs = tc.checkLines(dir, all.map((x) => x.code));
      errs.forEach((e) => { lineBad++; if (lineBad <= 12) console.log(`FAIL  ${track} · ${all[e.i].where} ${JSON.stringify(all[e.i].code)}: ${e.err}`); });
      notes.push(`${all.length - lineBad}/${all.length} drill + Vault lines parse`);
    }
    if (tc.checkExamples) {
      const errs = tc.checkExamples(dir, data.examples);
      errs.forEach((e) => { exBad++; console.log(`FAIL  ${track} · ${data.examples[e.i].where}: ${e.err.split("\n").slice(-3).join(" | ")}`); });
      notes.push(`${data.examples.length - exBad}/${data.examples.length} library examples check out`);
    }
    const ok = bad === 0 && lineBad === 0 && exBad === 0;
    console.log(`${ok ? "PASS" : "FAIL"}  ${track}: ${n - bad}/${n} program runs match the app${notes.length ? ", " + notes.join(", ") : ""}`);
    if (ok) passes++; else failures++;
  }
  await env.close();
  console.log(`\n${passes} track(s) passed, ${failures} failed, ${skips} skipped`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
