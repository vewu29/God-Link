// The English++ drills against the rules of the language and against
// what Vewu chose on Nov 20: one drill per distinct line, never padding.
// Every drill line is three words with a Chart root (or the call shape
// `now name value` / `thing method value`), no Classic, no special word
// used as a name; the 303 curated lines are all still here, unchanged and
// in order (progress is keyed by the line); every added drill teaches a
// Chart word no earlier drill had; every drill's chapter has a lesson and
// a Mastery Path stage; every "common slip" and every Fix the Line
// exercise is a real mistake from the lessons (or roots.cpp's own text).
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

function loadTrack() {
  const src = fs.readFileSync(path.join(__dirname, "..", "tracks", "englishpp.js"), "utf8");
  let T = null;
  new Function("cbRegisterTrack", src)((id, f) => { T = f(); });
  return T;
}
const T = loadTrack();
const OLD = JSON.parse(fs.readFileSync(path.join(__dirname, "content", "englishpp-drills-303.json"), "utf8"));
const ROOTS = new Set(T.chart.roots.map((r) => r.root).concat(["is"]));
const VALUES = new Set(T.chart.values.map((v) => v.word));
const KINDS = new Set(T.chart.kinds.map((k) => k.kind));
const SPECIAL = new Set(T.chart.special.map((s) => s.word));
const CHART_WORDS = new Set([...ROOTS, ...VALUES, ...KINDS, ...SPECIAL]);
const split3 = (l) => l.trim().match(/(?:"(?:[^"\\]|\\.)*"|\S)+/g) || [];
const CLASSIC_START = /^(let|set|make|say|print|show|repeat|end|Boxx|code:)$/;
const NAMING = new Set(["is", "mak", "mgl", "mrf", "mkn", "dfn", "dst", "dfd", "dpm", "dsc", "dcl", "den", "mlo", "dlm"]);
const chNum = (b) => +(/Ch\. (\d+)/.exec(b.chapter) || [])[1];
const wordsIn = (l) => (l.replace(/"(?:[^"\\]|\\.)*"/g, " ").match(/[A-Za-z_][A-Za-z_0-9]*/g) || []);
const CATS = ["first-steps", "names-values", "printing", "math", "text", "lists", "tests-choices", "loops", "talking-watching",
  "maps-collections", "functions", "checks-tests", "classes", "pointers", "errors", "bits-big", "files", "clock-threads", "outside-world"];

test("every drill line is three words with a Chart root or the call shape, and no Classic", () => {
  for (const b of T.blocks) {
    const w = split3(b.line);
    assert.strictEqual(w.length, 3, `${b.line}: not three words`);
    assert.ok(!CLASSIC_START.test(w[0]) || ROOTS.has(w[1]), `${b.line}: Classic`);
    assert.ok(ROOTS.has(w[1]) || (/^[A-Za-z_<>=!+\-*\/]+[\w]*$/.test(w[1]) && !CHART_WORDS.has(w[1])), `${b.line}: middle word ${w[1]} is not a root or a function name`);
    assert.ok(!/[{}();,\[\]]/.test(b.line.replace(/"(?:[^"\\]|\\.)*"/g, "")), `${b.line}: a control mark outside quotes`);
    assert.ok(!/^(wlt|wgt)$/.test(w[1]) || !/^(yes|nay)$/.test(w[2]), `${b.line}: wlt yes`);
  }
});

test("no special word is used as a name (the Studio refuses: '... is a word the language keeps for itself')", () => {
  for (const b of T.blocks) {
    const w = split3(b.line);
    if (NAMING.has(w[1])) assert.ok(!SPECIAL.has(w[0]) || w[0] === "now", `${b.line}: ${w[0]} is a special word`);
    assert.ok(!(NAMING.has(w[1]) && w[0] === "now" && w[1] !== "dfn"), `${b.line}: now as a name`);
    if (NAMING.has(w[1])) assert.notStrictEqual(w[0], "err", `${b.line}: err as a name`);
  }
});

test("the 303 curated lines are all still here, unchanged and in the same order", () => {
  assert.strictEqual(OLD.length, 303);
  const lines = T.blocks.map((b) => b.line);
  let at = -1;
  for (const l of OLD) {
    const k = lines.indexOf(l, at + 1);
    assert.ok(k > at, `curated line missing or moved: ${l}`);
    at = k;
  }
  assert.strictEqual(new Set(lines).size, lines.length, "a drill line appears twice");
});

test("every added drill teaches a Chart word no other drill line has", () => {
  const old = new Set(OLD);
  const added = T.blocks.filter((b) => !old.has(b.line));
  assert.strictEqual(added.length, T.blocks.length - 303);
  const count = new Map();
  for (const b of T.blocks) for (const t of new Set(wordsIn(b.line).concat([split3(b.line)[1]]))) if (CHART_WORDS.has(t)) count.set(t, (count.get(t) || 0) + 1);
  const covered = new Set();
  for (const b of OLD) for (const t of wordsIn(b).concat([split3(b)[1]])) covered.add(t);
  for (const b of added) {
    const fresh = wordsIn(b.line).filter((t) => CHART_WORDS.has(t) && !covered.has(t));
    assert.ok(fresh.length > 0, `${b.line}: adds no new Chart word (a near-duplicate)`);
    for (const t of fresh) covered.add(t);
  }
  for (const t of CHART_WORDS) assert.ok(covered.has(t), `Chart word ${t} has no drill`);
});

test("the 19 categories all stay, First Steps stays at 2, and the registry agrees", () => {
  const n = {};
  for (const b of T.blocks) { assert.ok(CATS.includes(b.category), `${b.line}: unknown category ${b.category}`); n[b.category] = (n[b.category] || 0) + 1; }
  assert.deepStrictEqual(Object.keys(n).sort(), CATS.slice().sort());
  assert.strictEqual(n["first-steps"], 2);
  const reg = fs.readFileSync(path.join(__dirname, "..", "js", "tracks.js"), "utf8");
  assert.match(reg, new RegExp("englishpp[\\s\\S]{0,400}blocks: " + T.blocks.length + ","));
  const drill = fs.readFileSync(path.join(__dirname, "..", "js", "drill.js"), "utf8");
  for (const c of CATS) assert.ok(drill.includes('"' + c + '"'), `category ${c} not in the picker`);
});

test("every drill's chapter has a Library lesson and a Mastery Path stage", () => {
  const lessons = new Map(T.lessons.filter(Boolean).map((L) => [L.num, L]));
  const chapters = new Set(T.chapters.map((c) => +(/Ch\. (\d+)/.exec(c.chapter) || [])[1]));
  const staged = new Set(T.path.flatMap((s) => s.chapters));
  for (const b of T.blocks) {
    const n = chNum(b);
    assert.ok(n >= 2 && n <= 52 && n !== 49 && n !== 50, `${b.line}: chapter ${n}`);
    assert.ok(chapters.has(n), `${b.line}: no Library chapter ${n}`);
    assert.ok(lessons.has(n), `${b.line}: no lesson for chapter ${n}`);
    assert.strictEqual(b.chapter, `English++ Book Ch. ${n} · ${lessons.get(n).title}`);
    assert.ok(staged.has(n), `${b.line}: chapter ${n} is on no path stage`);
  }
});

test("every common slip is a real lesson mistake with the Studio's own message", () => {
  for (const b of T.blocks) {
    if (!b.mk) continue;
    const [c, j] = b.mk.split(".").map(Number);
    const L = T.lessons.find((x) => x && x.num === c);
    assert.ok(L && L.mistakes && L.mistakes[j], `${b.line}: no mistake ${b.mk}`);
    assert.match(L.mistakes[j].says, /^Line \d+: /);
  }
});

test("Fix the Line: every exercise is a real mistake, names its line, and its fix is a three-word line", () => {
  assert.ok(Array.isArray(T.fixline) && T.fixline.length >= 20);
  const ids = new Set();
  for (const x of T.fixline) {
    assert.ok(!ids.has(x.id), `duplicate ${x.id}`); ids.add(x.id);
    const lines = x.code.split("\n");
    assert.strictEqual(lines[x.line - 1].trim(), x.bad, `${x.id}: the bad line is not line ${x.line}`);
    assert.match(x.says, /^Line \d+: /);
    const w = split3(x.good);
    assert.strictEqual(w.length, 3, `${x.id}: fix ${x.good} is not three words`);
    assert.ok(ROOTS.has(w[1]) || !CHART_WORDS.has(w[1]), `${x.id}: fix root ${w[1]}`);
    assert.notStrictEqual(x.good.trim(), x.bad.trim());
    const m = /^(\d+)\.(\d+)$/.exec(x.id);
    if (m) {
      const L = T.lessons.find((y) => y && y.num === +m[1]);
      const mk = L.mistakes[+m[2]];
      assert.strictEqual(mk.code, x.code, `${x.id}: code differs from the lesson`);
      assert.strictEqual(mk.says, x.says, `${x.id}: message differs from the lesson`);
    } else {
      assert.match(x.src, /^roots\.cpp line \d+$/);
      assert.match(x.says, /is a word the language keeps for itself\. Pick another name\.$/);
    }
  }
});
