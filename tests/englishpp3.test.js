"use strict";
// The three-words-a-line checker and stand-in, pinned to The English++
// Book (for English++ Studio 3): its rules for a line (Chapter 4, "The
// Three Words") and every example in it that prints its output.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const E3 = require("./content/englishpp3");
const BOOK = require("./content/englishpp-book-examples.json");

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
  assert.match(E3.run("x is 1\n   out prn x").error, /two spaces/);
});

// Two examples print something the stand-in leaves out on purpose: a
// line written to err (not the program's output), and a file's own
// last newline, which the book's output panel doesn't show.
const SKIP = (ex) => /^err prn /m.test(ex.code) || /hrd&/.test(ex.code);

test("never prints something the book doesn't", () => {
  let ran = 0;
  for (const ex of BOOK.filter((e) => !SKIP(e))) {
    const r = E3.run(ex.code);
    if (!r.ok) continue; // a feature the stand-in refuses, or a stop the book shows
    ran++;
    assert.strictEqual(r.stdout.replace(/\n$/, ""), ex.output, `${ex.chapter}\n${ex.code}`);
  }
  assert.ok(ran >= 170, `only ${ran} book examples ran`);
});

test("a program's answers come from opts.input", () => {
  const r = E3.run('name is ""\nname get "Name? "\nout prn "Hi @name!"', { input: ["Sam"] });
  assert.strictEqual(r.stdout, "Name? Sam\nHi Sam!\n");
});

test("every English++ Sandbox drill is a three-word line", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "tracks", "englishpp.js"), "utf8");
  const body = src.slice(src.indexOf("var blocks = ["), src.indexOf("var chapters = ["));
  const lines = [...body.matchAll(/line: (?:'([^']*)'|"((?:[^"\\]|\\.)*)")/g)].map((m) => (m[1] !== undefined ? m[1] : JSON.parse('"' + m[2] + '"')));
  assert.ok(lines.length >= 30);
  for (const l of lines) assert.strictEqual(E3.check(l), "", l);
});
