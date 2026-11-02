// The English++ stand-in (tests/content/englishpp.js) against "The
// English++ Book" itself: where the book shows what a program prints,
// the stand-in must print exactly that, and where the book leaves the
// printed form open, it must refuse rather than guess.
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const E = require("./content/englishpp");

const out = (code, opts) => { const r = E.run(code, opts); assert.ok(r.ok, r.error); return r.stdout.replace(/\n$/, "").split("\n"); };
const src = (...lines) => lines.join("\n");

test("English++ stand-in: the book's own examples print what the book says", () => {
  assert.deepEqual(out('print "Hello, V!"'), ["Hello, V!"]);
  assert.deepEqual(out(src("make a number called score with 0", "set score to 10", "print score", "set score to score + 5", "print score")), ["10", "15"]);
  assert.deepEqual(out(src("print 7 / 2", "print 7.0 / 2")), ["3", "3.5"], "whole numbers divide to a whole number");
  // Chapter 25: the program behind the Blueprint picture, and its output.
  assert.deepEqual(out(src(
    "note Add up the odd numbers, and show the even ones.",
    "make a number called total with 0",
    "for i from 1 to 10:",
    "  if i is even:",
    "    print i",
    "  otherwise:",
    "    add i to total",
    "  end if",
    "end for",
    'print "The odd numbers add up to " + (total as text)')), ["2", "4", "6", "8", "10", "The odd numbers add up to 25"]);
  // Chapter 28: two threads each add 1,000 to one atomic number.
  assert.deepEqual(out(src(
    "make an atomic number called counter with 0",
    "define work taking an atomic number called total and a number called times:",
    "  repeat times times: add 1 to total",
    "end work",
    "start a thread called one doing work with counter and 1000",
    "start a thread called two doing work with counter and 1000",
    "wait for one to finish", "wait for two to finish", "print counter")), ["2000"]);
});

test("English++ stand-in: a mistake stops with the book's plain-English message", () => {
  const r = E.run(src("make a vector of numbers called scores with 1 and 2 and 3", 'print "before"', "print scores at 5"));
  assert.equal(r.ok, false);
  assert.equal(r.stdout, "before");
  assert.equal(r.error, "The program stopped on line 3:\nprint scores at 5\nIt used a position that is not in the collection or text.");
});

test("English++ stand-in: the compressed form means the same program", () => {
  assert.deepEqual(out(src("mk aa nm cd score wi 7", "if score is mr th 5:", '  pr "big"', "end if")), ["big"]);
  assert.equal(E.CODES.make, "mk");
  assert.equal(new Set(Object.values(E.CODES)).size, Object.keys(E.CODES).length, "every code stands for one word");
});

test("English++ stand-in: lines are read the way the book writes them", () => {
  for (const line of ["if score is more than 10:", "otherwise if score is more than 5:", "if it is 2 or 3:", "give back x * 2", "has a number called age with 1", "until n is more than 5", "if n is 3, continue"]) {
    assert.equal(E.checkLine(line), "", line);
  }
  for (const line of ["if score > 10:", "set score = 5", "make number called x with 3", 'print "oops']) assert.notEqual(E.checkLine(line), "", line);
  assert.match(E.check(src("if yes:", 'print "not moved in"', "end if")), /should move in to 2 spaces/);
  assert.match(E.check(src("if yes:", '   print "too far"', "end if")), /should start 2 spaces in/);
  assert.match(E.check(src("repeat 3 times:", '  print "hi"')), /no end line/);
});

test("English++ stand-in: what the book leaves open is refused, not guessed", () => {
  for (const code of [
    "make a yes or no called happy with yes\nprint happy",
    "make a vector of numbers called scores with 1 and 2\nprint scores",
    "make a decimal called price with 2.5\nprint (price as text)",
    'make a number called age with 7\nprint "I am " + age',
    'make a number called n with 2.5',
  ]) assert.equal(E.run(code).ok, false, code);
  assert.equal(E.cppDouble(1 / 3), "0.333333", "decimals print the way C++ prints a double");
  assert.equal(E.cppDouble(1234567), "1.23457e+06");
  assert.equal(E.cppDouble(2.5), "2.5");
});
