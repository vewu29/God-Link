"use strict";
// The three-words-a-line checker, pinned to the rules in Chapter 4 of
// The English++ Book ("The Three Words").
const test = require("node:test");
const assert = require("node:assert");
const E3 = require("./content/englishpp3");

test("accepts the book's three-word lines", () => {
  for (const l of ['out prn "Hello"', "score is 0", "now wfv now", "c is a+b*2", "scores is 90&72&85",
    "out prn scores@0", "ages mak map@txt@num", '"a.txt" hwr "hello"', "price is 2.5", 'out prn "Hi, there: (you)"'])
    assert.strictEqual(E3.check(l), "", l);
});

test("refuses what the Studio refuses", () => {
  assert.match(E3.check("x is 6 7"), /4 words/);
  assert.match(E3.check("out prn"), /2 words/);
  assert.match(E3.check("c is a + b"), /5 words/);
  assert.match(E3.check("x is 6;"), /semicolons/);
  assert.match(E3.check("out prn f(x)"), /round brackets/);
  assert.match(E3.check("x zzz 1"), /Whole Chart/);
  assert.match(E3.check('out prn "Hello'), /never closed/);
  assert.match(E3.check("out prn rex.age"), /dot/);
});

test("every English++ Sandbox drill is a three-word line", () => {
  const src = require("fs").readFileSync(require("path").join(__dirname, "..", "tracks", "englishpp.js"), "utf8");
  const body = src.slice(src.indexOf("var blocks = ["), src.indexOf("var chapters = ["));
  const lines = [...body.matchAll(/line: (?:'([^']*)'|"((?:[^"\\]|\\.)*)")/g)].map((m) => m[1] !== undefined ? m[1] : JSON.parse('"' + m[2] + '"'));
  assert.strictEqual(lines.length, 30);
  for (const l of lines) assert.strictEqual(E3.check(l), "", l);
});
