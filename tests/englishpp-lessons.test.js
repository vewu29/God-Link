// The English++ extras (Mastery Path, Root Finder, full lessons) against
// the rules of the language: every line a lesson teaches is a
// three-word line whose root is in the frozen Chart, every lesson
// program reads as English++ with no Classic-dialect line in it, every
// program the stand-in can run prints what the lesson says, and the
// Root Finder carries the whole Chart.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const E3 = require("./content/englishpp3");

function loadTrack() {
  const src = fs.readFileSync(path.join(__dirname, "..", "tracks", "englishpp.js"), "utf8");
  let T = null;
  new Function("cbRegisterTrack", src)((id, f) => { T = f(); });
  return T;
}
const T = loadTrack();
const ROOTS = new Set(T.chart.roots.map((r) => r.root).concat(["is"]));
const split3 = (l) => l.trim().match(/(?:"[^"]*"|\S)+/g) || [];
// A Classic line opens with a Classic verb and has no Chart root in the
// middle (say "hi", let x be 6, make a Dog called rex, Boxx called Dog).
// A three-word line that only happens to name a function say or show
// (say dfn txt) is not Classic.
const CLASSIC_START = /^(let|set|make|say|print|show|repeat|end|Boxx|code:)$/;
const isClassic = (l) => { const w = split3(l); return w.length > 0 && CLASSIC_START.test(w[0]) && !(w.length === 3 && ROOTS.has(w[1])); };
function programs(L) {
  const out = [];
  (L.sections || []).forEach((s, i) => s.code && out.push({ where: `${L.title} section ${i + 1}`, code: s.code, out: s.out }));
  (L.mistakes || []).forEach((m, i) => m.fix_code && out.push({ where: `${L.title} mistake fix ${i + 1}`, code: m.fix_code, out: m.fix_out }));
  (L.practice || []).forEach((p, i) => p.answer_code && out.push({ where: `${L.title} practice ${i + 1}`, code: p.answer_code, out: p.answer_out }));
  return out;
}
const LESSONS = T.lessons.filter(Boolean);

test("the Root Finder carries the whole frozen Chart", () => {
  assert.strictEqual(T.chart.families.map((f) => f.letter).join(""), "abcdefghiklmnoprstuwx");
  assert.strictEqual(T.chart.rules.length, 9);
  assert.strictEqual(T.chart.pairs.length, 6);
  assert.strictEqual(T.chart.roots.length, 149);
  assert.strictEqual(T.chart.values.length, 132);
  assert.strictEqual(T.chart.kinds.length, 49);
  assert.deepStrictEqual(T.chart.special.map((s) => s.word).sort(), ["err", "inp", "nay", "nil", "now", "out", "slf", "yes"]);
  for (const r of T.chart.roots) {
    assert.match(r.root, /^[a-z]{3}$/, JSON.stringify(r));
    assert.ok(r.says && r.ex && r.cpp, "missing a field: " + r.root);
    const w = split3(r.ex);
    assert.strictEqual(w.length, 3, "example is not three words: " + r.ex);
    assert.strictEqual(w[1], r.root, "example does not use its root: " + r.ex);
  }
});

test("every chapter has a full lesson, in step with its chapter", () => {
  assert.strictEqual(T.lessons.length, T.chapters.length);
  T.lessons.forEach((L, i) => {
    assert.ok(L, "chapter " + (i + 1) + " has no lesson");
    for (const k of ["idea", "sections", "lines", "practice", "recap"]) assert.ok(L[k] && L[k].length, `${L.title}: missing ${k}`);
    assert.ok(new RegExp("Ch\\. " + L.num + "\\b").test(T.chapters[i].chapter), `lesson ${L.num} sits under ${T.chapters[i].chapter}`);
  });
});

test("every lesson line is a three-word line whose root is in the Chart", () => {
  for (const L of LESSONS) for (const x of L.lines) {
    const w = split3(x.line);
    assert.strictEqual(w.length, 3, `${L.title}: ${x.line}`);
    assert.ok(ROOTS.has(w[1]), `${L.title}: ${w[1]} is not a root in the Chart`);
    assert.ok(x.say, `${L.title}: ${x.line} has no plain reading`);
  }
});

test("every lesson program reads as English++, with no Classic lines", () => {
  let n = 0;
  for (const L of LESSONS) for (const p of programs(L)) {
    n++;
    const names = E3.definedNames(p.code);
    p.code.split("\n").forEach((l) => {
      if (!l.trim() || /^\s*note\s/.test(l)) return;
      assert.ok(!isClassic(l), `${p.where}: Classic line: ${l}`);
      assert.strictEqual(E3.check(l.trim(), names) || "", "", `${p.where}: ${l}`);
    });
  }
  assert.ok(n >= 150, "only " + n + " lesson programs");
});

test("lesson programs the stand-in can run print what the lesson says", () => {
  let ran = 0;
  for (const L of LESSONS) for (const p of programs(L)) {
    if (p.out == null || /^\s*err /m.test(p.code)) continue; // the stand-in leaves err's lines out
    const r = E3.run(p.code);
    if (!r.ok) continue; // a feature the stand-in refuses (maps, classes, input, threads)
    ran++;
    assert.strictEqual(r.stdout.replace(/\n+$/, ""), String(p.out).replace(/\n+$/, ""), `${p.where}\n${p.code}`);
  }
  assert.ok(ran >= 80, `only ${ran} lesson programs ran`);
});

test("every mistake shows the Studio's own message and a fix", () => {
  for (const L of LESSONS) for (const m of L.mistakes || []) {
    assert.ok(m.code && m.says && m.fix, `${L.title}: incomplete mistake`);
  }
});

test("the mastery path covers every chapter and names real projects", () => {
  const nums = new Set(T.chapters.map((c) => +(/Ch\. (\d+)/.exec(c.chapter) || [])[1]));
  const projects = new Set(T.projects.map((p) => p.name));
  const seen = new Set();
  for (const st of T.path) {
    for (const n of st.chapters) { assert.ok(nums.has(n), `${st.name}: no chapter ${n}`); seen.add(n); }
    if (st.checkpoint && st.checkpoint.project) assert.ok(projects.has(st.checkpoint.project), `${st.name}: no project ${st.checkpoint.project}`);
  }
  assert.strictEqual(seen.size, nums.size, "the path skips a chapter");
});

test("the drill set is the curated 303 plus one drill per new Chart word, and the registry agrees", () => {
  assert.strictEqual(T.blocks.length, 452);
  const reg = fs.readFileSync(path.join(__dirname, "..", "js", "tracks.js"), "utf8");
  assert.match(reg, /englishpp[\s\S]{0,400}blocks: 452,/);
});
