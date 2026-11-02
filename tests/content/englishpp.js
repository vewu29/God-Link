// English++ stand-in for the content checks.
//
// English++ turns programs written in plain English into C++. Its home,
// English++ Studio, is a Windows program that can't run here, so this is
// a small interpreter written from "The English++ Book" (for English++
// Studio 3). It reads the regular and the compressed forms (Appendix A's
// codes), runs the parts of the language the Code Block track teaches,
// and refuses anything whose meaning or printed form the book doesn't
// pin down (printing a yes or no or a whole collection, say, or turning
// a decimal into text), so no output the track shows rests on a guess.
// It is strict where the book is: two spaces in for every part inside
// another, an end line for every block, and the kind of a box kept.
//
//   check(code)     → "" or the first problem, from reading alone
//   checkLine(line) → the same for one drill line, set in a whole program
//   run(code, opts) → { ok, stdout, error }; opts.input = answers for ask
"use strict";
const CODES = require("./englishpp-codes.json");

const WORD_OF = Object.create(null);
for (const w of Object.keys(CODES)) if (CODES[w] !== w) WORD_OF[CODES[w]] = w;
// Three keywords start with a capital in the regular form.
const CAPITAL = { boxx: "Boxx", choices: "Choices", group: "Group" };

class EppError extends Error { constructor(msg, line) { super(msg); this.line = line; } }
class Complaint extends Error { constructor(problem, line) { super(problem); this.problem = problem; this.line = line; } }
const fail = (msg, line) => { throw new EppError(msg, line); };

/* ---------- reading ---------- */

function tokenize(text, no) {
  const toks = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === " ") { i++; continue; }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j++;
      toks.push({ t: "w", v: text.slice(i, j) });
      i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < text.length && /[0-9]/.test(text[j])) j++;
      let dec = false;
      if (text[j] === "." && /[0-9]/.test(text[j + 1] || "")) { dec = true; j++; while (j < text.length && /[0-9]/.test(text[j])) j++; }
      if (/[A-Za-z_]/.test(text[j] || "")) fail(`A name can't start with a number: “${text.slice(i, j + 1)}…”.`, no);
      toks.push({ t: "n", v: Number(text.slice(i, j)), dec });
      i = j; continue;
    }
    if (ch === '"') {
      let j = i + 1, s = "";
      for (;;) {
        if (j >= text.length) fail("This text has no closing quote mark (\").", no);
        if (text[j] === "\\") { const e = text[j + 1]; s += e === "n" ? "\n" : e === "t" ? "\t" : e; j += 2; continue; }
        if (text[j] === '"') break;
        s += text[j++];
      }
      toks.push({ t: "s", v: s });
      i = j + 1; continue;
    }
    if (ch === "'") {
      let j = i + 1, c = text[j];
      if (c === "\\") { c = text[j + 1] === "n" ? "\n" : text[j + 1]; j++; }
      if (c === undefined || text[j + 1] !== "'") fail("A letter goes between small quotes, one letter only, like 'A'.", no);
      toks.push({ t: "c", v: c });
      i = j + 2; continue;
    }
    if ("+-*/(),:".includes(ch)) { toks.push({ t: "p", v: ch }); i++; continue; }
    fail(`English++ doesn't use “${ch}” here.`, no);
  }
  return toks;
}

// The compressed form: every keyword written as its code (Appendix A).
function expand(toks) {
  return toks.map((t, k) => {
    if (t.t !== "w" || !WORD_OF[t.v]) return t;
    const w = WORD_OF[t.v];
    return { t: "w", v: k === 0 && CAPITAL[w] ? CAPITAL[w] : w };
  });
}
function isCompressed(code) {
  return code.split("\n").some((l) => { const m = l.match(/^\s*([A-Za-z]+)\b/); return m && WORD_OF[m[1]] && !/^\s*(note|code:)/.test(l); });
}

function readLines(code) {
  const compressed = isCompressed(code);
  const lines = [];
  code.split("\n").forEach((text, k) => {
    const lead = text.match(/^\s*/)[0];
    if (/\t/.test(lead)) fail("Move lines in with spaces, not tabs.", k + 1);
    const body = text.slice(lead.length).replace(/\s+$/, "");
    if (!body) return;
    let toks = null;
    const first = (body.match(/^[A-Za-z]+/) || [""])[0];
    const kind = first === "note" || (compressed && first === "nt") ? "note" : /^code\s*:/.test(body) || (compressed && /^co\s*:/.test(body)) ? "code" : "line";
    let shown = body;
    if (kind === "line") {
      toks = tokenize(body, k + 1);
      // Compressed lines are matched (end rp, ow:) by the words they stand for.
      if (compressed) { toks = expand(toks); shown = toks.map((t) => (t.t === "s" ? JSON.stringify(t.v) : t.t === "c" ? `'${t.v}'` : String(t.v))).join(" ").replace(/ ([:,])/g, "$1"); }
    }
    lines.push({ no: k + 1, indent: lead.length, text: shown, kind, toks });
  });
  return lines;
}

/* A line's tokens, read left to right. */
class TS {
  constructor(toks, line) { this.toks = toks; this.i = 0; this.line = line; }
  peek(o = 0) { return this.toks[this.i + o]; }
  isW(w, o = 0) { const t = this.toks[this.i + o]; return !!t && t.t === "w" && t.v === w; }
  isWs(...ws) { return ws.every((w, k) => this.isW(w, k)); }
  eatW(w) { if (this.isW(w)) { this.i++; return true; } return false; }
  eatWs(...ws) { if (this.isWs(...ws)) { this.i += ws.length; return true; } return false; }
  needW(w, what) { if (!this.eatW(w)) this.err(what || `I expected the word “${w}” here.`); }
  isP(p, o = 0) { const t = this.toks[this.i + o]; return !!t && t.t === "p" && t.v === p; }
  eatP(p) { if (this.isP(p)) { this.i++; return true; } return false; }
  needP(p, what) { if (!this.eatP(p)) this.err(what || `I expected “${p}” here.`); }
  end() { return this.i >= this.toks.length; }
  done() { if (!this.end()) this.err(`I don't understand “${this.rest()}” at the end of this line.`); }
  rest() { return this.toks.slice(this.i).map((t) => (t.t === "s" ? JSON.stringify(t.v) : t.t === "c" ? `'${t.v}'` : t.v)).join(" "); }
  err(msg) { fail(msg, this.line.no); }
  name(what) {
    const t = this.peek();
    if (!t || t.t !== "w") this.err(`I expected ${what || "a name"} here.`);
    if (RESERVED.has(t.v)) this.err(`“${t.v}” is an English++ word, so it can't be ${what || "a name"}.`);
    this.i++;
    return t.v;
  }
}
const RESERVED = new Set(["a", "an", "and", "or", "not", "is", "to", "with", "called", "at", "as", "the", "from", "by", "into", "onto", "of", "in", "if", "otherwise", "end", "yes", "no", "make", "set", "let", "print", "note", "define", "give", "call", "repeat", "while", "for", "each", "until", "break", "continue", "check", "try", "complain", "more", "less", "than", "has", "be", "it"]);
const S = (...ws) => new Set(ws);
const plus = (set, ...ws) => { const s = new Set(set); ws.forEach((w) => s.add(w)); return s; };

/* ---------- phrases (Appendix B, the parts the stand-in runs) ---------- */
// {x} is a hole for a value; a hole before a word ends at that word,
// and a hole at the end takes one value (with at, as text or a minus).
const PHRASES = [
  ["sqrt", "the square root of {x}"], ["cbrt", "the cube root of {x}"], ["abs", "the absolute value of {x}"],
  ["sin", "the sine of {x}"], ["cos", "the cosine of {x}"], ["tan", "the tangent of {x}"],
  ["floor", "the floor of {x}"], ["ceil", "the ceiling of {x}"], ["round", "the rounded value of {x}"], ["trunc", "the whole part of {x}"],
  ["fmod", "the remainder of {x} divided by {y}"], ["pow", "the power of {x} to {y}"], ["hypot", "the hypotenuse of {a} and {b}"],
  ["min", "the smaller of {a} and {b}"], ["max", "the larger of {a} and {b}"], ["max", "the bigger of {a} and {b}"],
  ["clamp", "the value of {x} kept between {lo} and {hi}"],
  ["gcd", "the greatest common divisor of {a} and {b}"], ["lcm", "the least common multiple of {a} and {b}"],
  ["pi", "the number pi"], ["e", "the number e"], ["intmax", "the biggest possible number"], ["intmin", "the smallest possible number"],
  ["rand", "a random number from {a} to {b}"], ["randdec", "a random decimal from {a} to {b}"], ["randitem", "a random item from {c}"], ["randbool", "a random yes or no"],
  ["secs", "the seconds since the start"], ["ms", "the milliseconds since the start"],
  ["fact", "the factorial of {n}"], ["prime", "the number {n} is prime"],
  ["length", "the length of {s}"], ["upper", "the uppercase version of {s}"], ["lower", "the lowercase version of {s}"],
  ["trim", "the trimmed version of {s}"], ["rev", "the reversed version of {s}"], ["title", "the title case version of {s}"],
  ["firstn", "the first {n} letters of {s}"], ["lastn", "the last {n} letters of {s}"],
  ["replace", "a copy of {s} with {a} replaced by {b}"], ["copies", "the text made of {n} copies of {c}"],
  ["textof", "the text of {x}"], ["numin", "the number in {s}"], ["decin", "the decimal in {s}"],
  ["code", "the letter code of {c}"], ["letter", "the letter with code {n}"],
  ["words", "the words in {s}"], ["split", "the pieces of {s} split by {sep}"], ["join", "the texts in {c} joined with {sep}"],
  ["count", "the count of {c}"], ["count", "the size of {c}"], ["first", "the first item in {c}"], ["last", "the last item in {c}"],
  ["top", "the top of {c}"], ["front", "the front of {c}"], ["back", "the back of {c}"],
  ["sum", "the sum of {c}"], ["product", "the product of {c}"], ["average", "the average of {c}"], ["median", "the median of {c}"],
  ["biggest", "the biggest in {c}"], ["smallest", "the smallest in {c}"], ["timesin", "the number of times {v} is in {c}"],
  ["sorted", "a sorted copy of {c}"], ["keys", "the keys of {c}"], ["values", "the values of {c}"],
  ["countwhere", "the number of items in {c} where {f}"], ["where", "the items of {c} where {f}"],
  ["every", "every item in {c} passes {f}"], ["some", "some item in {c} passes {f}"], ["none", "no item in {c} passes {f}"],
  ["results", "the results of {f} for every item in {c}"],
  ["deref", "the value {p} points to"],
  ["matches", "the text {t} matches the pattern {p}"], ["allmatches", "the matches of the pattern {p} in {t}"], ["rereplace", "a copy of {t} with the pattern {p} replaced by {r}"], ["exists", "the file {f} exists"], ["filetext", "the text in the file {f}"], ["filelines", "the lines of the file {f}"],
  ["problem", "the problem"]
].map(([id, pat]) => {
  const parts = pat.split(" ").map((w) => (w[0] === "{" ? { hole: w.slice(1, -1) } : { lit: w }));
  return { id, pat, parts, lits: parts.filter((p) => p.lit).length };
}).sort((a, b) => b.lits - a.lits || b.parts.length - a.parts.length);
const PHRASE_START = new Set(PHRASES.map((p) => p.parts[0].lit));

/* ---------- the parser ---------- */
const PLURAL = { numbers: "number", decimals: "decimal", texts: "text", letters: "letter" };
const COLLECTIONS = new Set(["vector", "list", "set", "stack", "queue"]);
const COLORS = ["red", "blue", "green", "gold", "purple", "white", "black", "pink", "orange", "cyan"];
const HEAD_END = { if: "end if", for: "end for", while: "end while", repeat: "end repeat", check: "end check", try: "end try" };

class Parser {
  constructor(lines, loose) {
    this.lines = lines; this.i = 0; this.loose = loose;
    this.arity = Object.create(null); this.ctor = Object.create(null);
    this.loops = 0; this.fn = null; this.made = false;
    this.prepass();
  }
  // Function and Boxx arities, so `call f with a and b` inside a print
  // knows where its values end.
  prepass() {
    let boxx = null;
    for (const L of this.lines) {
      if (L.kind !== "line" || !L.toks.length) continue;
      const w = (k) => L.toks[k] && L.toks[k].v;
      const count = () => { let n = 0, on = false; for (const t of L.toks) { if (t.t === "w" && t.v === "taking") on = true; else if (on && t.t === "w" && t.v === "called") n++; else if (t.t === "w" && t.v === "giving") on = false; } return n; };
      if (w(0) === "Boxx" && w(1) === "called") boxx = w(2);
      else if (w(0) === "define" || (w(0) === "make" && L.toks.some((t) => t.v === "function"))) {
        const at = w(0) === "define" ? 1 : L.toks.findIndex((t) => t.v === "called") + 1;
        this.arity[w(at)] = count();
      } else if (boxx && w(0) === "when" && w(1) === "made") this.ctor[boxx] = count();
    }
  }
  peekLine() { return this.lines[this.i]; }
  program() { const body = this.block(0, () => false, "the program"); return body; }

  // Lines at `indent` until one at the end condition.
  block(indent, isEnd, what) {
    const out = [];
    while (this.i < this.lines.length) {
      const L = this.lines[this.i];
      if (L.indent < indent) {
        if (indent === 0) break;
        if (isEnd(L)) break;
        fail(`${what} needs its end line before this one (or this line should move in to ${indent} spaces).`, L.no);
      }
      if (L.indent === indent - 2 && isEnd(L)) break;
      if (L.indent !== indent) fail(`This line should start ${indent} spaces in (two more for each part it is inside).`, L.no);
      out.push(this.statement(L));
    }
    if (this.i >= this.lines.length && indent > 0) fail(`${what} has no end line.`, (this.lines[this.lines.length - 1] || { no: 1 }).no);
    return out;
  }
  // The line that closes (or continues) a block, at the header's indent.
  closer(header, re, what) {
    const L = this.peekLine();
    if (!L || L.indent !== header.indent || L.kind !== "line" || !re.test(L.text)) fail(`${what} has no “${re.source.replace(/[\^$\\]/g, "").split("|")[0]}” line to close it.`, (L || header).no);
    this.i++;
    return L;
  }
  ending(re) { return (L) => L.kind === "line" && re.test(L.text); }

  statement(L) {
    this.i++;
    if (L.kind === "note") return { k: "note", no: L.no };
    if (L.kind === "code") return { k: "code", no: L.no, text: L.text };
    const ts = new TS(L.toks, L);
    const st = this.simple(ts, L, false);
    return st;
  }

  // One statement from a token stream. inline: after "if …," or "…:", where no block may start.
  simple(ts, L, inline) {
    const no = L.no;
    const st = (o) => Object.assign(o, { no });
    const head = () => { if (inline) ts.err("A part with its own lines can't start in the middle of a line."); };
    const w0 = ts.peek() && ts.peek().t === "w" ? ts.peek().v : null;
    if (!w0) ts.err("A line starts with a word, like print or make.");

    if (ts.eatW("print")) {
      if (ts.isWs("a", "blank", "line") && ts.toks.length === ts.i + 3) { ts.i += 3; return st({ k: "print", items: [] }); }
      const items = [];
      do {
        const e = this.expr(ts, S("and", "with"));
        let places = null;
        if (ts.isW("with") && ts.isW("decimal", 2) && ts.isW("places", 3)) { ts.i++; places = this.unary(ts, S()); ts.i += 2; }
        items.push({ e, places });
      } while (ts.eatW("and"));
      ts.done();
      return st({ k: "print", items });
    }
    if (ts.eatW("make")) return st(this.make(ts, L, inline));
    if (ts.eatW("let")) { const name = ts.name(); ts.needW("be", "let needs be: let speed be 12."); const e = this.expr(ts, S()); ts.done(); return st({ k: "let", name, e }); }
    if (ts.eatW("set")) {
      if (ts.eatWs("the", "random", "seed", "to")) { const e = this.expr(ts, S()); ts.done(); return st({ k: "seed", e }); }
      const target = this.target(ts, S("to"));
      ts.needW("to", "set needs to: set score to 10.");
      const e = this.expr(ts, S()); ts.done();
      return st({ k: "set", target, e });
    }
    if (ts.eatW("add")) { const e = this.expr(ts, S("to")); ts.needW("to", "add needs to: add 3 to coins."); const target = this.target(ts, S()); ts.done(); return st({ k: "add", e, target }); }
    if (ts.eatW("push")) { const e = this.expr(ts, S("onto")); ts.needW("onto", "push needs onto: push 5 onto plates."); const name = ts.name(); ts.done(); return st({ k: "push", e, name }); }
    if (ts.eatWs("take", "the")) {
      const which = ts.eatW("top") ? "top" : ts.eatW("front") ? "front" : ts.err("take the top off a stack, or take the front off a queue.");
      ts.needW("off"); const name = ts.name(); ts.done();
      return st({ k: "take", which, name });
    }
    if (ts.eatW("remove")) {
      if (ts.eatWs("the", "last", "item", "from")) { const name = ts.name(); ts.done(); return st({ k: "remove", how: "last", name }); }
      if (ts.eatWs("the", "first", "item", "from")) { const name = ts.name(); ts.done(); return st({ k: "remove", how: "first", name }); }
      if (ts.eatWs("the", "item", "at")) { const e = this.expr(ts, S("from")); ts.needW("from"); const name = ts.name(); ts.done(); return st({ k: "remove", how: "at", e, name }); }
      if (ts.eatWs("duplicates", "from")) { const name = ts.name(); ts.done(); return st({ k: "remove", how: "dups", name }); }
      const e = this.expr(ts, S("from")); ts.needW("from"); const name = ts.name(); ts.done();
      return st({ k: "remove", how: "value", e, name });
    }
    if (ts.eatW("insert")) { const e = this.expr(ts, S("into")); ts.needW("into"); const name = ts.name(); ts.needW("at"); const at = this.expr(ts, S()); ts.done(); return st({ k: "insert", e, name, at }); }
    if (ts.isW("empty") || (ts.isW("clear") && !ts.isW("the", 1))) { ts.i++; const name = ts.name(); ts.done(); return st({ k: "empty", name }); }
    if (ts.eatW("sort")) {
      const name = ts.name();
      let how = "up", f = null;
      if (ts.eatWs("from", "biggest", "to", "smallest")) how = "down";
      else if (ts.eatW("using")) { f = ts.name("a function"); how = "using"; }
      ts.done();
      return st({ k: "sort", name, how, f });
    }
    if (ts.eatW("reverse")) { const name = ts.name(); ts.done(); return st({ k: "reverse", name }); }
    if (ts.eatW("shuffle")) { const name = ts.name(); ts.done(); return st({ k: "shuffle", name }); }
    if (ts.eatW("swap")) { const a = ts.name(); ts.needW("and"); const b = ts.name(); ts.done(); return st({ k: "swap", a, b }); }
    if (ts.eatW("fill")) { const name = ts.name(); const up = ts.eatWs("counting", "up", "from"); if (!up) ts.needW("with"); const e = this.expr(ts, S()); ts.done(); return st({ k: "fill", name, up, e }); }
    if (ts.eatW("apply")) { const f = ts.name("a function"); ts.needW("to"); ts.needW("every"); ts.needW("item"); ts.needW("in"); const name = ts.name(); ts.done(); return st({ k: "apply", f, name }); }
    if (ts.isW("do") && ts.isW("for", 2)) { ts.i++; const f = ts.name("a function"); ts.needW("for"); ts.needW("every"); ts.needW("item"); ts.needW("in"); const name = ts.name(); ts.done(); return st({ k: "doeach", f, name }); }

    if (ts.eatW("if")) {
      if (ts.isWs("it", "is") || ts.isWs("it", "fails")) ts.err(ts.isW("fails", 1) ? "if it fails: belongs inside a try." : "if it is …: belongs inside a check.");
      const cond = this.expr(ts, S());
      if (ts.eatP(",")) { const then = this.simple(ts, L, true); return st({ k: "if", branches: [{ cond, body: [then] }], otherwise: null }); }
      ts.needP(":", "An if ends with a colon (:), or a comma and one thing to do."); ts.done(); head();
      const branches = [{ cond, body: this.block(L.indent + 2, this.ending(/^(otherwise\b|end if$)/), "This if") }];
      let otherwise = null;
      for (;;) {
        const E = this.closer(L, /^(end if$|otherwise\b)/, "This if");
        if (E.text === "end if") break;
        const t2 = new TS(E.toks, E); t2.needW("otherwise");
        if (t2.eatW("if")) {
          const c = this.expr(t2, S()); t2.needP(":", "otherwise if ends with a colon (:)."); t2.done();
          branches.push({ cond: c, body: this.block(L.indent + 2, this.ending(/^(otherwise\b|end if$)/), "This if") });
          continue;
        }
        t2.needP(":", "otherwise ends with a colon (:)."); t2.done();
        otherwise = this.block(L.indent + 2, this.ending(/^end if$/), "This if");
        this.closer(L, /^end if$/, "This if");
        break;
      }
      return st({ k: "if", branches, otherwise });
    }
    if (ts.eatW("repeat")) {
      if (ts.eatW("forever")) { ts.needP(":"); ts.done(); head(); return st({ k: "forever", body: this.loopBody(L, /^end repeat$/, "This repeat") }); }
      if (ts.eatP(":")) {
        ts.done(); head();
        this.loops++; const body = this.block(L.indent + 2, this.ending(/^until\b/), "This repeat"); this.loops--;
        const U = this.closer(L, /^until\b/, "This repeat");
        const t2 = new TS(U.toks, U); t2.needW("until"); const cond = this.expr(t2, S()); t2.done();
        return st({ k: "until", body, cond });
      }
      const n = this.expr(ts, S("times")); ts.needW("times", "repeat needs times: repeat 3 times:");
      ts.needP(":", "repeat … times ends with a colon (:).");
      if (!ts.end()) { this.loops++; const one = this.simple(ts, L, true); this.loops--; return st({ k: "times", n, body: [one] }); }
      head();
      return st({ k: "times", n, body: this.loopBody(L, /^end repeat$/, "This repeat") });
    }
    if (ts.eatW("for")) {
      if (ts.eatW("each")) {
        const a = ts.name(); const b = ts.eatW("and") ? ts.name() : null;
        ts.needW("in", "for each needs in: for each pet in pets:"); const e = this.expr(ts, S()); ts.needP(":"); ts.done(); head();
        return st({ k: "each", a, b, e, body: this.loopBody(L, /^end for$/, "This for") });
      }
      const name = ts.name(); ts.needW("from", "for needs from: for i from 1 to 5:");
      const from = this.expr(ts, S("to", "down")); const down = ts.eatW("down"); ts.needW("to");
      const to = this.expr(ts, S("by")); const by = ts.eatW("by") ? this.expr(ts, S()) : null;
      ts.needP(":", "A for line ends with a colon (:)."); ts.done(); head();
      return st({ k: "for", name, from, to, by, down, body: this.loopBody(L, /^end for$/, "This for") });
    }
    if (ts.eatW("while")) { const cond = this.expr(ts, S()); ts.needP(":", "A while line ends with a colon (:)."); ts.done(); head(); return st({ k: "while", cond, body: this.loopBody(L, /^end while$/, "This while") }); }
    if (ts.eatW("break") || ts.eatW("continue")) { const k = ts.toks[ts.i - 1].v; ts.done(); if (!this.loops && !this.loose) ts.err(`${k} only works inside a loop.`); return st({ k }); }
    if (ts.eatW("check")) {
      const e = this.expr(ts, S()); ts.needP(":", "A check line ends with a colon (:)."); ts.done(); head();
      const cases = []; let otherwise = null;
      for (;;) {
        const C = this.peekLine();
        if (!C || C.indent < L.indent + 2) break;
        if (C.indent !== L.indent + 2 || C.kind !== "line") fail("Inside a check, each choice starts with if it is …: two spaces in.", C.no);
        this.i++;
        const t2 = new TS(C.toks, C);
        if (t2.eatWs("otherwise")) { t2.needP(":"); t2.done(); otherwise = this.block(L.indent + 4, this.ending(/^(end check$|if it is\b|otherwise\b)/), "This check"); continue; }
        if (otherwise) fail("otherwise is the last choice in a check.", C.no);
        if (!t2.eatWs("if", "it", "is")) fail("Inside a check, each choice starts with if it is …:", C.no);
        const vals = [this.expr(t2, S("or"))];
        while (t2.eatW("or")) vals.push(this.expr(t2, S("or")));
        t2.needP(":"); t2.done();
        cases.push({ vals, body: this.block(L.indent + 4, this.ending(/^(end check$|if it is\b|otherwise\b)/), "This check") });
      }
      this.closer(L, /^end check$/, "This check");
      return st({ k: "check", e, cases, otherwise });
    }
    if (ts.eatWs("Choices", "called")) {
      head();
      const name = ts.name("the name of the choices"); ts.needP(":");
      const vals = [ts.name("a choice")];
      while (ts.eatP(",") || ts.isW("and")) { ts.eatW("and"); vals.push(ts.name("a choice")); }
      ts.done();
      return st({ k: "choices", name, vals });
    }
    if (ts.eatW("define")) {
      head();
      if (this.fn) ts.err("Make each function on its own, not inside another one.");
      const name = ts.name("the function's name"); const sig = this.signature(ts); ts.needP(":", "A define line ends with a colon (:)."); ts.done();
      this.fn = sig; const loops = this.loops; this.loops = 0;
      const body = this.block(L.indent + 2, this.ending(new RegExp("^end " + name + "$")), "This define");
      this.fn = null; this.loops = loops;
      this.closer(L, new RegExp("^end " + name + "$"), "This define");
      return st({ k: "define", name, sig, body });
    }
    if (ts.eatWs("give", "back")) {
      if (!this.fn && !this.loose) ts.err("give back only works inside a function.");
      const e = ts.end() ? null : this.expr(ts, S()); ts.done();
      return st({ k: "give", e });
    }
    if (ts.isW("call")) { const e = this.call(ts, S()); ts.done(); return st({ k: "expr", e }); }
    if (ts.eatWs("Boxx", "called")) { head(); return st(this.boxx(ts, L)); }
    if (ts.eatWs("start", "as")) {
      if (!this.made && !this.loose) ts.err("start as … only works inside when made.");
      if (!ts.eatW("a")) ts.needW("an", "start as an Animal …");
      const type = ts.name("a kind"); const args = ts.eatW("with") ? this.args(ts, this.ctor[type], S()) : []; ts.done();
      return st({ k: "startas", type, args });
    }
    if (ts.eatW("try")) {
      ts.needP(":"); ts.done(); head();
      const body = this.block(L.indent + 2, this.ending(/^if it fails:$/), "This try");
      this.closer(L, /^if it fails:$/, "This try");
      const caught = this.block(L.indent + 2, this.ending(/^end try$/), "This try");
      this.closer(L, /^end try$/, "This try");
      return st({ k: "try", body, caught });
    }
    if (ts.eatW("complain")) { const e = this.expr(ts, S()); ts.done(); return st({ k: "complain", e }); }
    if (ts.eatW("wait")) {
      if (ts.eatW("for")) { const name = ts.name(); ts.needW("to"); ts.needW("finish"); ts.done(); return st({ k: "note" }); }
      const e = this.expr(ts, S("seconds", "second", "milliseconds"));
      const unit = ts.eatW("seconds") || ts.eatW("second") ? 1 : ts.eatW("milliseconds") ? 0.001 : ts.err("wait needs seconds: wait 1 seconds.");
      ts.done();
      return st({ k: "wait", e, unit });
    }
    if (ts.eatW("ask")) {
      if (ts.eatW("for")) { const name = ts.name(); ts.done(); return st({ k: "ask", q: null, name }); }
      const q = this.expr(ts, S("into")); ts.needW("into", "ask needs into: ask \"Name?\" into name."); const name = ts.name(); ts.done();
      return st({ k: "ask", q, name });
    }
    if (ts.eatW("write")) {
      if (ts.eatWs("the", "lines")) { const name = ts.name(); ts.needW("to"); ts.needW("the"); ts.needW("file"); const f = this.expr(ts, S()); ts.done(); return st({ k: "writelines", name, f }); }
      const e = this.expr(ts, S("to")); ts.needW("to", "write needs to: write \"hi\" to \"note.txt\"."); const f = this.expr(ts, S()); ts.done();
      return st({ k: "write", e, f });
    }
    if (ts.eatW("append")) { const e = this.expr(ts, S("to")); ts.needW("to"); ts.needW("the"); ts.needW("file"); const f = this.expr(ts, S()); ts.done(); return st({ k: "append", e, f }); }
    if (ts.eatW("read")) { const f = this.expr(ts, S("into")); ts.needW("into", "read needs into: read \"note.txt\" into message."); const name = ts.name(); ts.done(); return st({ k: "read", f, name }); }
    if (ts.eatWs("delete", "the", "file")) { const f = this.expr(ts, S()); ts.done(); return st({ k: "delfile", f }); }
    if (ts.eatW("include")) { const once = ts.eatW("once"); const t = ts.peek(); if (!t || t.t !== "s") ts.err("include needs a file name in quote marks."); ts.i++; ts.done(); return st({ k: "include", file: t.v, once }); }
    if (ts.eatW("phrase")) {
      const t = ts.peek(); if (!t || t.t !== "s") ts.err("A phrase starts with its English in quote marks."); ts.i++;
      let kind = null; if (ts.eatWs("gives", "back")) { if (!ts.eatW("a")) ts.needW("an"); kind = this.kind(ts); }
      ts.needW("means", "A phrase says what it means: phrase \"…\" means \"…\"."); const c = ts.peek(); if (!c || c.t !== "s") ts.err("means is followed by C++ in quote marks."); ts.i++; ts.done();
      return st({ k: "phrase", english: t.v, cpp: c.v, kind });
    }
    if (ts.eatWs("Group", "called")) {
      head();
      const name = ts.name("the group's name"); ts.needP(":"); ts.done();
      const body = this.block(L.indent + 2, this.ending(new RegExp("^end " + name + "$")), "This Group");
      if (body.some((s) => s.k !== "define" && s.k !== "note")) fail("A Group holds functions (define …).", L.no);
      this.closer(L, new RegExp("^end " + name + "$"), "This Group");
      return st({ k: "group", name, body });
    }
    if (ts.eatW("point")) { const p = ts.name(); ts.needW("at"); const name = ts.name(); ts.done(); return st({ k: "point", p, name }); }
    if (ts.eatWs("start", "a", "thread", "called")) {
      const name = ts.name(); ts.needW("doing"); const f = ts.name("a function");
      const args = ts.eatW("with") ? this.args(ts, this.arity[f], S()) : []; ts.done();
      return st({ k: "thread", name, f, args });
    }
    if (ts.eatWs("stop", "the", "program")) { const code = ts.eatWs("with", "code") ? this.expr(ts, S()) : null; ts.done(); return st({ k: "stop", code }); }
    // The Box World (chapter 20)
    if (ts.eatW("show") || ts.eatW("hide")) { const k = ts.toks[ts.i - 1].v; const name = ts.name(); ts.done(); return st({ k: "world", op: k, name }); }
    if (ts.eatW("paint")) { const name = ts.name(); const c = ts.peek(); if (!c || c.t !== "w" || !COLORS.includes(c.v)) ts.err("paint needs a color: " + COLORS.join(", ") + "."); ts.i++; ts.done(); return st({ k: "world", op: "paint", name, color: c.v }); }
    if (ts.eatW("move")) { const name = ts.name(); ts.needW("by"); const xyz = [this.expr(ts, S())]; ts.needP(",", "move needs three numbers: move hero by 2, 0, 0."); xyz.push(this.expr(ts, S())); ts.needP(","); xyz.push(this.expr(ts, S())); ts.done(); return st({ k: "world", op: "move", name, xyz }); }
    if (ts.eatW("spin")) { const name = ts.name(); ts.needW("by"); const e = this.expr(ts, S()); ts.done(); return st({ k: "world", op: "spin", name, e }); }
    if (ts.eatW("grow") || ts.eatW("shrink")) { const op = ts.toks[ts.i - 1].v; const name = ts.name(); ts.needW("by"); const e = ts.eatW("big") ? { k: "lit", v: num(2) } : ts.eatW("small") ? { k: "lit", v: num(1) } : this.expr(ts, S()); ts.done(); return st({ k: "world", op, name, e }); }
    if (ts.eatW("say")) { const e = this.expr(ts, S()); ts.done(); return st({ k: "world", op: "say", e }); }
    if (ts.eatWs("play", "sound")) { const e = this.expr(ts, S()); ts.done(); return st({ k: "world", op: "sound", e }); }
    if (ts.eatW("when")) {
      if (ts.eatWs("the", "mouse", "is", "clicked")) { /* the event */ }
      else if (ts.eatW("the")) { ts.name("a key"); ts.needW("key"); ts.needW("is"); ts.needW("pressed"); }
      else { ts.name(); ts.needW("touches"); ts.name(); }
      ts.needP(",", "A when line says what happens after a comma."); const then = this.simple(ts, L, true);
      return st({ k: "when", then });
    }
    // rex bark: an object doing one of its can's
    if (ts.toks.length >= 2 && ts.peek().t === "w" && ts.peek(1).t === "w" && !RESERVED.has(w0) && !RESERVED.has(ts.peek(1).v)) {
      const obj = ts.name(), method = ts.name("what it can do");
      const args = ts.eatW("with") ? this.args(ts, null, S()) : []; ts.done();
      return st({ k: "method", obj, method, args });
    }
    ts.err(`I don't know how to start a line with “${w0}”.`);
  }
  loopBody(L, re, what) {
    this.loops++;
    const body = this.block(L.indent + 2, this.ending(re), what);
    this.loops--;
    this.closer(L, re, what);
    return body;
  }
  // a number / a vector of texts / a map from texts to numbers / a Dog …
  kind(ts) {
    if (ts.eatW("number")) return { base: "number" };
    if (ts.eatW("decimal")) return { base: "decimal" };
    if (ts.eatW("text")) return { base: "text" };
    if (ts.eatW("letter")) return { base: "letter" };
    if (ts.eatWs("yes", "or", "no")) return { base: "yes or no" };
    if (ts.eatWs("big", "number")) return { base: "big number" };
    if (ts.eatW("function")) return { base: "function" };
    if (ts.eatW("box")) return { base: "box" };
    for (const c of COLLECTIONS) if (ts.isW(c) && ts.isW("of", 1)) { ts.i += 2; return { base: c, of: this.plural(ts) }; }
    if (ts.eatWs("map", "from")) { const from = this.plural(ts); ts.needW("to"); return { base: "map", from, to: this.plural(ts) }; }
    if (ts.eatWs("pointer", "to") || ts.eatWs("reference", "to")) {
      const base = ts.toks[ts.i - 2].v; if (!ts.eatW("a")) ts.needW("an"); return { base, to: this.kind(ts) };
    }
    const t = ts.peek();
    if (t && t.t === "w" && /^[A-Z]/.test(t.v)) { ts.i++; return { base: "type", type: t.v }; }
    ts.err("I expected a kind here: a number, a decimal, a text, a letter, a yes or no, or a collection.");
  }
  plural(ts) {
    const t = ts.peek();
    if (t && t.t === "w" && PLURAL[t.v]) { ts.i++; return { base: PLURAL[t.v] }; }
    if (ts.eatWs("big", "numbers")) return { base: "big number" };
    ts.err("I expected numbers, decimals, texts or letters here.");
  }
  // taking a text called who and a number called times giving back a number
  signature(ts) {
    const params = [];
    if (ts.eatW("taking")) {
      do {
        if (!ts.eatW("a")) ts.needW("an", "Each thing a function takes starts with a or an.");
        const atomic = ts.eatW("atomic");
        const kind = this.kind(ts); ts.needW("called"); params.push({ kind, name: ts.name(), atomic });
      } while (ts.eatW("and"));
    }
    let ret = null;
    if (ts.eatWs("giving", "back")) { if (!ts.eatW("a")) ts.needW("an"); ret = this.kind(ts); }
    return { params, ret };
  }
  make(ts, L, inline) {
    if (!ts.eatW("a")) ts.needW("an", "make needs a or an: make a number called score with 0.");
    const constant = ts.eatW("constant"), atomic = ts.eatW("atomic");
    const kind = this.kind(ts);
    ts.needW("called", "make needs called: make a number called score with 0.");
    const name = ts.name();
    if (kind.base === "function") {
      const sig = this.signature(ts); ts.needP(":", "A function in a box ends its first part with a colon: …: give back n * 2.");
      const fn = this.fn; this.fn = sig;
      const body = this.simple(ts, L, true);
      this.fn = fn;
      return { k: "make", kind, name, sig, body: [body] };
    }
    if (kind.base === "reference") { ts.needW("for", "A reference names its box: make a reference to a number called r for count."); const of = ts.name(); ts.done(); return { k: "make", kind, name, of }; }
    let init = null;
    if (ts.eatW("with")) {
      if (COLLECTIONS.has(kind.base)) { init = [this.expr(ts, S("and"))]; while (ts.eatW("and")) init.push(this.expr(ts, S("and"))); }
      else if (kind.base === "map") {
        init = [];
        do { const k = this.expr(ts, S("as", "and")); ts.needW("as", "Each thing in a map is key as value: \"bob\" as 9."); init.push([k, this.expr(ts, S("and"))]); } while (ts.eatW("and"));
      } else if (kind.base === "type") init = this.args(ts, this.ctor[kind.type], S());
      else init = this.expr(ts, S());
    }
    ts.done();
    if (constant && init === null) ts.err("A constant needs its value: make a constant number called days with 7.");
    return { k: "make", kind, name, init, constant, atomic };
  }
  boxx(ts, L) {
    const name = ts.name("the kind's name"); const parent = ts.eatW("uses") ? ts.name("a kind") : null; ts.needP(":"); ts.done();
    const fields = [], methods = {}; let made = null;
    for (;;) {
      const M = this.peekLine();
      if (!M) fail(`This Boxx has no end ${name} line.`, L.no);
      if (M.indent === L.indent && M.kind === "line" && M.text === "end " + name) { this.i++; break; }
      if (M.indent !== L.indent + 2) fail(`Inside a Boxx, each part starts two spaces in (has, can, when made), and the Boxx ends with end ${name}.`, M.no);
      this.i++;
      if (M.kind === "note") continue;
      const t = new TS(M.toks, M);
      if (t.eatW("has")) {
        if (!t.eatW("a")) t.needW("an"); const kind = this.kind(t); t.needW("called"); const f = t.name();
        const init = t.eatW("with") ? this.expr(t, S()) : null; t.done();
        fields.push({ name: f, kind, init, no: M.no });
      } else if (t.eatWs("when", "made")) {
        const sig = this.signature(t); t.needP(":"); t.done();
        this.made = true; this.fn = sig;
        const body = this.block(M.indent + 2, this.ending(/^end when made$/), "when made");
        this.made = false; this.fn = null;
        this.closer(M, /^end when made$/, "when made");
        made = { sig, body };
      } else if (t.eatW("can")) {
        const m = t.name("what it can do"); const sig = this.signature(t); t.needP(":"); t.done();
        this.fn = sig;
        const body = this.block(M.indent + 2, this.ending(new RegExp("^end " + m + "$")), "This can");
        this.fn = null;
        this.closer(M, new RegExp("^end " + m + "$"), "This can");
        methods[m] = { sig, body };
      } else fail("Inside a Boxx, a line starts with has, can or when made.", M.no);
    }
    return { k: "boxx", name, parent, fields, methods, made };
  }
  // A box (or the FIELD of OBJ), with an optional at.
  target(ts, stops) {
    if (ts.isW("the") && ts.peek(1) && ts.peek(1).t === "w" && ts.isW("of", 2)) { ts.i++; const field = ts.name("a field"); ts.i++; const obj = ts.name(); return { k: "field", field, obj }; }
    const name = ts.name();
    if (ts.eatW("at")) return { k: "at", name, i: this.expr(ts, plus(stops, "to")) };
    return { k: "var", name };
  }
  args(ts, n, stops) {
    const out = [this.expr(ts, plus(stops, "and"))];
    while ((n == null || out.length < n) && ts.eatW("and")) out.push(this.expr(ts, plus(stops, "and")));
    return out;
  }
  call(ts, stops) {
    ts.needW("call"); const name = ts.name("a function");
    const group = ts.eatW("from") ? ts.name("a group") : null;
    const args = ts.eatW("with") ? this.args(ts, this.arity[name], stops) : [];
    return { k: "call", name, group, args };
  }

  /* ---------- values ---------- */
  expr(ts, stops) { return this.or(ts, stops); }
  or(ts, stops) { let l = this.and(ts, stops); while (!stops.has("or") && ts.eatW("or")) l = { k: "or", l, r: this.and(ts, stops) }; return l; }
  and(ts, stops) { let l = this.not(ts, stops); while (!stops.has("and") && ts.eatW("and")) l = { k: "and", l, r: this.not(ts, stops) }; return l; }
  not(ts, stops) { if (ts.eatW("not")) return { k: "not", e: this.not(ts, stops) }; return this.cmp(ts, stops); }
  cmp(ts, stops) {
    const l = this.sum(ts, stops);
    if (!stops.has("is") && ts.eatW("is")) {
      const neg = ts.eatW("not");
      let e;
      if (ts.eatWs("more", "than")) e = ts.eatWs("or", "equal", "to") ? { k: "bin", op: ">=", l, r: this.sum(ts, stops) } : { k: "bin", op: ">", l, r: this.sum(ts, stops) };
      else if (ts.eatWs("less", "than")) e = ts.eatWs("or", "equal", "to") ? { k: "bin", op: "<=", l, r: this.sum(ts, stops) } : { k: "bin", op: "<", l, r: this.sum(ts, stops) };
      else if (ts.eatW("even")) e = { k: "parity", l, even: true };
      else if (ts.eatW("odd")) e = { k: "parity", l, even: false };
      else e = { k: "bin", op: "==", l, r: this.sum(ts, stops) };
      return neg ? { k: "not", e } : e;
    }
    if (!stops.has("has") && ts.eatW("has")) return { k: "has", l, r: this.sum(ts, stops) };
    return l;
  }
  sum(ts, stops) {
    let l = this.product(ts, stops);
    for (;;) { if (ts.eatP("+")) l = { k: "bin", op: "+", l, r: this.product(ts, stops) }; else if (ts.eatP("-")) l = { k: "bin", op: "-", l, r: this.product(ts, stops) }; else return l; }
  }
  product(ts, stops) {
    let l = this.unary(ts, stops);
    for (;;) { if (ts.eatP("*")) l = { k: "bin", op: "*", l, r: this.unary(ts, stops) }; else if (ts.eatP("/")) l = { k: "bin", op: "/", l, r: this.unary(ts, stops) }; else return l; }
  }
  unary(ts, stops) { if (ts.eatP("-")) return { k: "neg", e: this.unary(ts, stops) }; return this.postfix(ts, stops); }
  postfix(ts, stops) {
    let e = this.primary(ts, stops);
    for (;;) {
      if (ts.isW("as") && ts.isW("text", 1)) { ts.i += 2; e = { k: "astext", e }; continue; }
      if (!stops.has("at") && ts.isW("at") && ts.peek(1)) { ts.i++; e = { k: "at", e, i: this.primaryish(ts, stops) }; continue; }
      return e;
    }
  }
  primaryish(ts, stops) { if (ts.eatP("-")) return { k: "neg", e: this.primaryish(ts, stops) }; return this.primary(ts, stops); }
  primary(ts, stops) {
    const t = ts.peek();
    if (!t) ts.err("A value is missing at the end of this line.");
    if (t.t === "n") { ts.i++; return { k: "lit", v: t.dec ? dec(t.v) : num(t.v) }; }
    if (t.t === "s") { ts.i++; return { k: "lit", v: txt(t.v) }; }
    if (t.t === "c") { ts.i++; return { k: "lit", v: chr(t.v) }; }
    if (t.t === "p") {
      if (t.v === "(") { ts.i++; const e = this.expr(ts, S()); ts.needP(")", "This ( has no ) to close it."); return e; }
      ts.err(`I expected a value here, not “${t.v}”.`);
    }
    if (t.v === "call") return this.call(ts, stops);
    if (PHRASE_START.has(t.v) && !(t.v === "no" && !ts.isW("item", 1))) {
      const save = ts.i;
      for (const p of PHRASES) {
        if (p.parts[0].lit !== t.v) continue;
        const got = this.tryPhrase(ts, p, stops);
        if (got) return got;
        ts.i = save;
      }
      if (t.v === "the" && ts.peek(1) && ts.peek(1).t === "w" && ts.isW("of", 2)) {
        ts.i++; const field = ts.name("a field"); ts.i++;
        return { k: "field", field, obj: this.primaryish(ts, stops) };
      }
    }
    if (t.v === "yes" || t.v === "no") { ts.i++; return { k: "lit", v: bool(t.v === "yes") }; }
    if (t.v === "it") { ts.i++; return { k: "it" }; }
    if (RESERVED.has(t.v)) ts.err(`I expected a value here, not the word “${t.v}”.`);
    ts.i++;
    return { k: "var", name: t.v };
  }
  tryPhrase(ts, p, stops) {
    const args = {};
    for (let k = 0; k < p.parts.length; k++) {
      const part = p.parts[k];
      if (part.lit) { if (!ts.isW(part.lit)) return null; ts.i++; continue; }
      const next = p.parts[k + 1];
      try {
        args[part.hole] = next ? this.expr(ts, plus(stops, next.lit)) : this.unary(ts, stops);
      } catch (e) { if (e instanceof EppError) return null; throw e; }
    }
    return { k: "phrase", id: p.id, pat: p.pat, args };
  }
}

/* ---------- values ---------- */
const num = (v) => ({ t: "number", v }), dec = (v) => ({ t: "decimal", v }), txt = (v) => ({ t: "text", v });
const chr = (v) => ({ t: "letter", v }), bool = (v) => ({ t: "yes or no", v });
const isNum = (x) => x.t === "number" || x.t === "big number" || x.t === "decimal";
const isInt = (x) => x.t === "number" || x.t === "big number";
const isColl = (x) => COLLECTIONS.has(x.t) || x.t === "map";
const KIND_NAME = (k) => (k.base === "type" ? "a " + k.type : COLLECTIONS.has(k.base) ? `a ${k.base} of ${k.of.base}s` : k.base === "map" ? `a map from ${k.from.base}s to ${k.to.base}s` : k.base === "yes or no" ? "a yes or no" : (/^[aeiou]/.test(k.base) ? "an " : "a ") + k.base);
function copy(x) {
  if (COLLECTIONS.has(x.t)) return { t: x.t, of: x.of, items: x.items.map(copy) };
  if (x.t === "map") return { t: "map", from: x.from, to: x.to, m: new Map([...x.m].map(([k, v]) => [k, copy(v)])) };
  return x;
}
// C++ prints a double with 6 significant digits, the shorter of the plain and the e form (%g).
function cppDouble(x) {
  if (!Number.isFinite(x)) return Number.isNaN(x) ? "nan" : x < 0 ? "-inf" : "inf";
  if (x === 0) return Object.is(x, -0) ? "-0" : "0";
  const [m, e] = x.toExponential(5).split("e");
  const ex = Number(e);
  const strip = (s) => (s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s);
  if (ex < -4 || ex >= 6) return strip(m) + "e" + (ex < 0 ? "-" : "+") + String(Math.abs(ex)).padStart(2, "0");
  return strip(x.toFixed(Math.max(0, 5 - ex)));
}
function key(x) { return x.t === "text" || x.t === "letter" ? x.v : isNum(x) ? x.v : x.t === "yes or no" ? x.v : x.t === "choice" ? x.i : JSON.stringify(x); }
function sameKind(a, b) { return (isNum(a) && isNum(b)) || a.t === b.t || ((a.t === "text" || a.t === "letter") && (b.t === "text" || b.t === "letter")); }
function eq(a, b, no) {
  if (!sameKind(a, b)) fail(`I can't compare ${a.t === "choice" ? "a choice" : "a " + a.t} with ${b.t === "choice" ? "a choice" : "a " + b.t}.`, no);
  if (a.t === "choice") return a.type === b.type && a.i === b.i;
  return a.v === b.v;
}
function compare(a, b, no) {
  if (isNum(a) && isNum(b)) return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  if ((a.t === "text" || a.t === "letter") && a.t === b.t) return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  fail(`I can only compare numbers with numbers, and texts with texts.`, no);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Env {
  constructor(parent) { this.vars = new Map(); this.parent = parent; }
  find(name) { for (let e = this; e; e = e.parent) if (e.vars.has(name)) return e.vars.get(name); return null; }
  declare(name, cell, no) {
    if (this.vars.has(name)) fail(`There is already a box called ${name} here.`, no);
    this.vars.set(name, cell);
  }
}
const BREAK = { b: 1 }, CONTINUE = { c: 1 };
class Give { constructor(v) { this.v = v; } }
class Stop { constructor(code) { this.code = code; } }

/* ---------- running ---------- */
class Interp {
  constructor(opts) {
    this.out = []; this.files = new Map(); this.clock = 0; this.rand = mulberry32(1);
    this.input = opts.input ? opts.input.slice() : null; this.steps = 0; this.depth = 0;
    this.funcs = Object.create(null); this.types = Object.create(null); this.choices = Object.create(null); this.choiceTypes = Object.create(null); this.groups = Object.create(null);
    this.problem = null;
  }
  run(prog) {
    const main = new Env(null);
    this.hoist(prog, main);
    try { this.block(prog, main, true); }
    catch (e) {
      if (e instanceof Stop) return;
      if (e instanceof Complaint) fail(`Nobody caught this complaint: ${e.problem}`, e.line);
      throw e;
    }
  }
  // Functions, Boxx kinds, Choices and Groups are known from the start.
  hoist(prog, env) {
    for (const s of prog) {
      if (s.k === "define") { if (this.funcs[s.name]) fail(`There are two functions called ${s.name}.`, s.no); this.funcs[s.name] = { sig: s.sig, body: s.body, closure: null, name: s.name }; }
      else if (s.k === "boxx") { if (this.types[s.name]) fail(`There are two kinds called ${s.name}.`, s.no); this.types[s.name] = s; }
      else if (s.k === "choices") {
        this.choiceTypes[s.name] = s.vals;
        s.vals.forEach((v, i) => { if (this.choices[v]) fail(`${v} is already a choice.`, s.no); this.choices[v] = { t: "choice", type: s.name, i, name: v }; });
      } else if (s.k === "group") {
        const g = Object.create(null);
        s.body.forEach((d) => { if (d.k === "define") g[d.name] = { sig: d.sig, body: d.body, closure: null, name: d.name }; });
        this.groups[s.name] = g;
      }
    }
    for (const t of Object.values(this.types)) if (t.parent && !this.types[t.parent]) fail(`There is no kind called ${t.parent} to use.`, t.no);
  }
  tick(no) { if (++this.steps > 3e6) fail("This program runs too long: maybe a loop never stops.", no); }
  block(body, env, top) {
    const scope = top ? env : new Env(env);
    for (const s of body) {
      const r = this.exec(s, scope);
      if (r) return r;
    }
    return null;
  }
  defaultOf(kind, no) {
    switch (kind.base) {
      case "number": case "big number": return num(0);
      case "decimal": return dec(0);
      case "text": return txt("");
      case "letter": return chr("\0");
      case "yes or no": return bool(false);
      case "map": return { t: "map", from: kind.from, to: kind.to, m: new Map() };
      case "box": return { t: "box", shown: false, color: "white", pos: [0, 0, 0], turn: 0, size: 1 };
      case "pointer": return { t: "pointer", to: kind.to, cell: null };
      case "type":
        if (this.types[kind.type]) return this.newObject(kind.type, [], no, false);
        if (this.choiceTypes[kind.type]) return this.choices[this.choiceTypes[kind.type][0]];
        fail(`I don't know a kind called ${kind.type}.`, no);
      default:
        if (COLLECTIONS.has(kind.base)) return { t: kind.base, of: kind.of, items: [] };
        fail(`A ${kind.base} needs a value.`, no);
    }
  }
  // Puts v into a box of `kind`: whole numbers fit a decimal box, never the other way round.
  fit(kind, v, no, what) {
    const want = kind.base;
    const say = what || "this box";
    if (want === "number" || want === "big number") {
      if (v.t === "decimal") fail(`${say} holds whole numbers, but this is a decimal (use a decimal box, or the rounded value of …).`, no);
      if (!isInt(v)) fail(`${say} holds a number, not ${v.t === "choice" ? "a choice" : "a " + v.t}.`, no);
      if (want === "number" && (v.v > 2147483647 || v.v < -2147483648)) fail(`${v.v} is too big for a number box; use a big number.`, no);
      return num(v.v);
    }
    if (want === "decimal") { if (!isNum(v)) fail(`${say} holds a decimal, not a ${v.t}.`, no); return dec(v.v); }
    if (want === "text") { if (v.t === "letter") return txt(v.v); if (v.t !== "text") fail(`${say} holds text, not ${v.t === "number" ? "a number (use as text)" : "a " + v.t}.`, no); return v; }
    if (want === "letter" || want === "yes or no") { if (v.t !== want) fail(`${say} holds ${want === "letter" ? "a letter" : "a yes or no"}, not a ${v.t}.`, no); return v; }
    if (COLLECTIONS.has(want) || want === "map") { if (v.t !== want) fail(`${say} holds ${KIND_NAME(kind)}.`, no); return copy(v); }
    if (want === "type") {
      if (v.t === "object" && this.isA(v.type, kind.type)) return v;
      if (v.t === "choice" && v.type === kind.type) return v;
      fail(`${say} holds ${KIND_NAME(kind)}.`, no);
    }
    if (want === "function") { if (v.t !== "function") fail(`${say} holds a function.`, no); return v; }
    if (want === "box" && v.t !== "box") fail(`${say} holds a box.`, no);
    if (want === "pointer" && v.t !== "pointer") fail(`${say} holds a pointer.`, no);
    return v;
  }
  isA(type, want) { for (let t = type; t; t = this.types[t] && this.types[t].parent) if (t === want) return true; return false; }
  cell(env, name, no) {
    const c = env.find(name);
    if (c) return c;
    fail(this.funcs[name] ? `${name} is a function: use call ${name}.` : `I don't know a box called ${name} here.`, no);
  }
  setCell(c, v, no, name) {
    if (c.constant) fail(`${name} is a constant, so it never changes.`, no);
    c.v = this.fit(c.kind, v, no, name);
  }
  coll(env, name, no, kinds) {
    const c = this.cell(env, name, no);
    if (kinds && !kinds.includes(c.v.t)) fail(`${name} isn't ${kinds.map((k) => "a " + k).join(" or ")}.`, no);
    if (c.constant) fail(`${name} is a constant, so it never changes.`, no);
    return c.v;
  }

  exec(s, env) {
    this.tick(s.no);
    const no = s.no;
    switch (s.k) {
      case "note": case "phrase": return null;
      case "code": fail("A code: line is plain C++, and the stand-in doesn't run C++.", no);
      case "include": fail(`${s.file} is a library that only English++ Studio has.`, no);
      case "print": {
        const parts = s.items.map(({ e, places }) => {
          const v = this.eval(e, env);
          if (places) {
            const p = this.eval(places, env);
            if (!isInt(p) || p.v < 0 || p.v > 12) fail("decimal places needs a whole number from 0 to 12.", no);
            if (!isNum(v)) fail("Only numbers have decimal places.", no);
            return v.v.toFixed(p.v);
          }
          return this.show(v, no);
        });
        this.out.push(parts.join(" "));
        if (this.out.length > 20000) fail("This program prints too much.", no);
        return null;
      }
      case "make": return this.make(s, env);
      case "let": {
        const v = this.eval(s.e, env);
        const kind = v.t === "object" || v.t === "choice" ? { base: "type", type: v.type } : COLLECTIONS.has(v.t) ? { base: v.t, of: v.of } : v.t === "map" ? { base: "map", from: v.from, to: v.to } : { base: v.t };
        env.declare(s.name, { kind, v: copy(v) }, no);
        return null;
      }
      case "set": {
        const v = this.eval(s.e, env);
        if (s.target.k === "var") { this.setCell(this.cell(env, s.target.name, no), v, no, s.target.name); return null; }
        if (s.target.k === "field") { const o = this.cell(env, s.target.obj, no).v; this.fieldCell(o, s.target.field, no).v = this.fit(this.fieldCell(o, s.target.field, no).kind, v, no, "the " + s.target.field); return null; }
        const c = this.coll(env, s.target.name, no, ["vector", "list", "map"]);
        const i = this.eval(s.target.i, env);
        if (c.t === "map") { c.m.set(key(this.fit(c.from, i, no, "a key")), this.fit(c.to, v, no, "a value")); return null; }
        const at = this.index(c, i, no);
        c.items[at] = this.fit(c.of, v, no, "an item");
        return null;
      }
      case "add": {
        const v = this.eval(s.e, env);
        if (s.target.k !== "var") fail("add needs a box: add 3 to coins.", no);
        const c = this.cell(env, s.target.name, no);
        if (isColl(c.v)) {
          if (c.v.t === "map" || c.v.t === "stack") fail(c.v.t === "map" ? "To put something in a map, use set m at key to value." : "To put something on a stack, use push … onto.", no);
          if (c.constant) fail(`${s.target.name} is a constant, so it never changes.`, no);
          const item = this.fit(c.v.of, v, no, "an item");
          if (c.v.t === "set") { if (!c.v.items.some((x) => eq(x, item, no))) { c.v.items.push(item); c.v.items.sort((a, b) => compare(a, b, no)); } }
          else c.v.items.push(item);
          return null;
        }
        if (!isNum(c.v)) fail(`add puts a number onto a number box (or an item into a collection); ${s.target.name} holds a ${c.v.t}.`, no);
        this.setCell(c, this.arith("+", c.v, v, no), no, s.target.name);
        return null;
      }
      case "push": { const c = this.coll(env, s.name, no, ["stack"]); c.items.push(this.fit(c.of, this.eval(s.e, env), no, "an item")); return null; }
      case "take": {
        const c = this.coll(env, s.name, no, s.which === "top" ? ["stack"] : ["queue", "list"]);
        if (!c.items.length) fail(`${s.name} is empty, so there is nothing to take off.`, no);
        if (s.which === "top") c.items.pop(); else c.items.shift();
        return null;
      }
      case "remove": {
        const c = this.coll(env, s.name, no, ["vector", "list", "set", "map"]);
        if (s.how === "last" || s.how === "first") { if (!c.items.length) fail(`${s.name} is empty.`, no); if (s.how === "last") c.items.pop(); else c.items.shift(); return null; }
        if (s.how === "at") { c.items.splice(this.index(c, this.eval(s.e, env), no), 1); return null; }
        if (s.how === "dups") { const seen = []; c.items = c.items.filter((x) => (seen.some((y) => eq(x, y, no)) ? false : (seen.push(x), true))); return null; }
        const v = this.eval(s.e, env);
        if (c.t === "map") { c.m.delete(key(v)); return null; }
        c.items = c.items.filter((x) => !eq(x, v, no));
        return null;
      }
      case "insert": {
        const c = this.coll(env, s.name, no, ["vector", "list"]);
        const at = this.eval(s.at, env);
        if (!isInt(at) || at.v < 0 || at.v > c.items.length) fail("It used a position that is not in the collection or text.", no);
        c.items.splice(at.v, 0, this.fit(c.of, this.eval(s.e, env), no, "an item"));
        return null;
      }
      case "empty": { const c = this.coll(env, s.name, no); if (c.t === "map") c.m.clear(); else c.items = []; return null; }
      case "sort": {
        const c = this.coll(env, s.name, no, ["vector", "list"]);
        if (s.how === "using") { const f = this.fn(env, s.f, no); c.items.sort((a, b) => (this.truth(this.callFn(f, [a, b], no), no) ? -1 : this.truth(this.callFn(f, [b, a], no), no) ? 1 : 0)); return null; }
        c.items.sort((a, b) => compare(a, b, no));
        if (s.how === "down") c.items.reverse();
        return null;
      }
      case "reverse": { const c = this.coll(env, s.name, no, ["vector", "list"]); c.items.reverse(); return null; }
      case "shuffle": { const c = this.coll(env, s.name, no, ["vector", "list"]); for (let i = c.items.length - 1; i > 0; i--) { const j = Math.floor(this.rand() * (i + 1)); [c.items[i], c.items[j]] = [c.items[j], c.items[i]]; } return null; }
      case "swap": { const a = this.cell(env, s.a, no), b = this.cell(env, s.b, no); const t = a.v; this.setCell(a, b.v, no, s.a); this.setCell(b, t, no, s.b); return null; }
      case "fill": {
        const c = this.coll(env, s.name, no, ["vector", "list"]); let v = this.fit(c.of, this.eval(s.e, env), no, "an item");
        c.items = c.items.map(() => { const x = v; if (s.up) v = this.arith("+", v, num(1), no); return x; });
        return null;
      }
      case "apply": { const c = this.coll(env, s.name, no, ["vector", "list"]); const f = this.fn(env, s.f, no); c.items = c.items.map((x) => this.fit(c.of, this.callFn(f, [x], no, true), no, "an item")); return null; }
      case "doeach": { const c = this.cell(env, s.name, no).v; const f = this.fn(env, s.f, no); c.items.slice().forEach((x) => this.callFn(f, [x], no)); return null; }
      case "if": {
        for (const b of s.branches) if (this.truth(this.eval(b.cond, env), no)) return this.block(b.body, env);
        return s.otherwise ? this.block(s.otherwise, env) : null;
      }
      case "times": {
        const n = this.eval(s.n, env);
        if (!isInt(n)) fail("repeat … times needs a whole number.", no);
        for (let k = 0; k < n.v; k++) { this.tick(no); const r = this.block(s.body, env); if (r === BREAK) break; if (r && r !== CONTINUE) return r; }
        return null;
      }
      case "forever": for (;;) { this.tick(no); const r = this.block(s.body, env); if (r === BREAK) break; if (r && r !== CONTINUE) return r; } return null;
      case "until": for (;;) { this.tick(no); const r = this.block(s.body, env); if (r === BREAK) break; if (r && r !== CONTINUE) return r; if (this.truth(this.eval(s.cond, env), no)) break; } return null;
      case "while": while (this.truth(this.eval(s.cond, env), no)) { this.tick(no); const r = this.block(s.body, env); if (r === BREAK) break; if (r && r !== CONTINUE) return r; } return null;
      case "for": {
        const from = this.eval(s.from, env), to = this.eval(s.to, env), by = s.by ? this.eval(s.by, env) : num(1);
        if (!isInt(from) || !isInt(to) || !isInt(by)) fail("for counts in whole numbers.", no);
        if (by.v <= 0) fail("by needs a number bigger than 0 (write down to to count down).", no);
        const scope = new Env(env), c = { kind: { base: "number" }, v: from };
        scope.declare(s.name, c, no);
        for (let i = from.v; s.down ? i >= to.v : i <= to.v; i += s.down ? -by.v : by.v) {
          this.tick(no); c.v = num(i);
          const r = this.block(s.body, scope); if (r === BREAK) break; if (r && r !== CONTINUE) return r;
        }
        return null;
      }
      case "each": {
        const c = this.eval(s.e, env);
        if (c.t === "text") fail("for each walks a collection; a text is not one.", no);
        if (!isColl(c)) fail("for each walks a collection, like a vector.", no);
        if (c.t === "map") {
          if (!s.b) fail("A map gives two things each time: for each name and age in ages:", no);
          const keys = [...c.m.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
          for (const k of keys) {
            this.tick(no);
            const scope = new Env(env);
            scope.declare(s.a, { kind: c.from, v: c.from.base === "text" ? txt(k) : c.from.base === "letter" ? chr(k) : c.from.base === "decimal" ? dec(k) : num(k) }, no);
            scope.declare(s.b, { kind: c.to, v: copy(c.m.get(k)) }, no);
            const r = this.block(s.body, scope); if (r === BREAK) break; if (r && r !== CONTINUE) return r;
          }
          return null;
        }
        if (s.b) fail("Only a map gives two things each time.", no);
        for (const item of c.items.slice()) {
          this.tick(no);
          const scope = new Env(env);
          scope.declare(s.a, { kind: c.of, v: copy(item) }, no);
          const r = this.block(s.body, scope); if (r === BREAK) break; if (r && r !== CONTINUE) return r;
        }
        return null;
      }
      case "break": return BREAK;
      case "continue": return CONTINUE;
      case "check": {
        const v = this.eval(s.e, env);
        for (const c of s.cases) {
          if (c.vals.some((e) => eq(v, this.eval(e, env, v), no))) return this.block(c.body, env);
        }
        return s.otherwise ? this.block(s.otherwise, env) : null;
      }
      case "choices": case "define": case "boxx": case "group": return null;
      case "give": throw new Give(s.e ? this.eval(s.e, env) : null);
      case "expr": this.eval(s.e, env, null, true); return null;
      case "method": {
        const o = this.cell(env, s.obj, no).v;
        if (o.t !== "object") fail(`${s.obj} isn't a thing made from a Boxx, so it can't ${s.method}.`, no);
        const m = this.method(o.type, s.method);
        if (!m) fail(`A ${o.type} can't ${s.method}.`, no);
        this.invoke(m, s.args.map((a) => this.eval(a, env)), no, o);
        return null;
      }
      case "startas": {
        const self = env.find("\0self");
        if (!self) fail("start as … only works inside when made.", no);
        this.construct(self.v, s.type, s.args.map((a) => this.eval(a, env)), no);
        return null;
      }
      case "try": {
        try { return this.block(s.body, env); }
        catch (e) {
          if (!(e instanceof Complaint)) throw e;
          const was = this.problem; this.problem = e.problem;
          try { return this.block(s.caught, env); } finally { this.problem = was; }
        }
      }
      case "complain": { const v = this.eval(s.e, env); if (v.t !== "text") fail("complain needs words in quote marks.", no); throw new Complaint(v.v, no); }
      case "wait": { const v = this.eval(s.e, env); if (!isNum(v) || v.v < 0) fail("wait needs a number of seconds.", no); this.clock += v.v * s.unit; return null; }
      case "ask": {
        const c = this.cell(env, s.name, no);
        if (!this.input) fail("This program asks a question, so it can't be checked without answers.", no);
        if (s.q) this.out.push(this.show(this.eval(s.q, env), no));
        const a = this.input.length ? this.input.shift() : "";
        this.setCell(c, c.kind.base === "number" ? num(parseInt(a, 10) || 0) : c.kind.base === "decimal" ? dec(parseFloat(a) || 0) : txt(a), no, s.name);
        return null;
      }
      case "write": case "append": {
        const f = this.eval(s.f, env), v = this.eval(s.e, env);
        if (f.t !== "text") fail("A file name goes in quote marks.", no);
        const line = this.show(v, no);
        this.files.set(f.v, s.k === "append" ? (this.files.get(f.v) || "") + line + "\n" : line + "\n");
        return null;
      }
      case "writelines": { const c = this.cell(env, s.name, no).v; const f = this.eval(s.f, env); this.files.set(f.v, c.items.map((x) => this.show(x, no) + "\n").join("")); return null; }
      case "read": {
        const f = this.eval(s.f, env);
        if (!this.files.has(f.v)) fail(`There is no file called ${f.v}.`, no);
        const c = this.cell(env, s.name, no), text = this.files.get(f.v).replace(/\n$/, "");
        this.setCell(c, c.kind.base === "number" ? num(parseInt(text, 10) || 0) : txt(text), no, s.name);
        return null;
      }
      case "delfile": { this.files.delete(this.eval(s.f, env).v); return null; }
      case "point": { const p = this.cell(env, s.p, no); if (p.v.t !== "pointer") fail(`${s.p} isn't a pointer.`, no); const target = this.cell(env, s.name, no); p.v = { t: "pointer", to: p.v.to, cell: target }; return null; }
      case "thread": { const f = this.fn(env, s.f, no); this.invoke(f, s.args.map((a) => a), no, null, env); return null; }
      case "stop": throw new Stop(s.code);
      case "seed": { const v = this.eval(s.e, env); this.rand = mulberry32(v.v); return null; }
      case "world": {
        if (s.op === "say" || s.op === "sound") { this.eval(s.e, env); return null; }
        const b = this.cell(env, s.name, no).v;
        if (b.t !== "box") fail(`${s.name} isn't a box: make a box called ${s.name} first.`, no);
        if (s.op === "show" || s.op === "hide") b.shown = s.op === "show";
        else if (s.op === "paint") b.color = s.color;
        else if (s.op === "move") s.xyz.forEach((e, k) => { const v = this.eval(e, env); if (!isNum(v)) fail("move needs numbers.", no); b.pos[k] += v.v; });
        else { const v = this.eval(s.e, env); if (!isNum(v)) fail(s.op + " needs a number.", no); if (s.op === "spin") b.turn += v.v; else b.size *= s.op === "grow" ? v.v : 1 / v.v; }
        return null;
      }
      case "when": return null; // events never come without the Studio's window
    }
    fail("The stand-in can't run this line.", no);
  }
  make(s, env) {
    const no = s.no;
    if (s.kind.base === "function") { env.declare(s.name, { kind: s.kind, v: { t: "function", sig: s.sig, body: s.body, closure: env, name: s.name } }, no); return null; }
    if (s.kind.base === "reference") { const c = this.cell(env, s.of, no); env.declare(s.name, c, no); return null; }
    let v;
    if (s.init === null) v = this.defaultOf(s.kind, no);
    else if (COLLECTIONS.has(s.kind.base)) { v = this.defaultOf(s.kind, no); s.init.forEach((e) => { const x = this.fit(s.kind.of, this.eval(e, env), no, "an item"); if (v.t === "set") { if (!v.items.some((y) => eq(x, y, no))) v.items.push(x); } else v.items.push(x); }); if (v.t === "set") v.items.sort((a, b) => compare(a, b, no)); }
    else if (s.kind.base === "map") { v = this.defaultOf(s.kind, no); s.init.forEach(([k, e]) => v.m.set(key(this.fit(s.kind.from, this.eval(k, env), no, "a key")), this.fit(s.kind.to, this.eval(e, env), no, "a value"))); }
    else if (s.kind.base === "type" && this.types[s.kind.type]) v = this.newObject(s.kind.type, s.init.map((e) => this.eval(e, env)), no, true);
    else if (s.kind.base === "type") {
      if (!this.choiceTypes[s.kind.type]) fail(`I don't know a kind called ${s.kind.type}.`, no);
      if (s.init.length !== 1) fail(`A ${s.kind.type} holds one choice.`, no);
      v = this.fit(s.kind, this.eval(s.init[0], env), no, s.name);
    } else v = this.fit(s.kind, this.eval(s.init, env), no, s.name);
    env.declare(s.name, { kind: s.kind, v, constant: s.constant }, no);
    return null;
  }

  /* functions, Boxx */
  fn(env, name, no) {
    const c = env.find(name);
    if (c && c.v.t === "function") return c.v;
    if (this.funcs[name]) return this.funcs[name];
    fail(`I don't know a function called ${name}.`, no);
  }
  callFn(f, vals, no, needValue) {
    const r = this.invoke(f, vals, no);
    if (needValue && !r) fail(`${f.name} doesn't give back an answer.`, no);
    return r;
  }
  // args: values, or (for a thread) expressions so atomic boxes are shared.
  invoke(f, args, no, self, argEnv) {
    const ps = f.sig.params;
    if (args.length !== ps.length) fail(`${f.name || "This"} takes ${ps.length} thing${ps.length === 1 ? "" : "s"}, but got ${args.length}.`, no);
    if (++this.depth > 2000) fail("A function kept calling itself forever.", no);
    const base = f.closure || (self ? this.fieldScope(self) : null);
    const scope = new Env(base);
    if (self) scope.vars.set("\0self", { v: self });
    ps.forEach((p, k) => {
      let a = args[k];
      if (argEnv && a && a.k) {
        if (p.atomic && a.k === "var") { scope.declare(p.name, this.cell(argEnv, a.name, no), no); return; }
        a = this.eval(a, argEnv);
      }
      scope.declare(p.name, { kind: p.kind, v: this.fit(p.kind, a, no, p.name) }, no);
    });
    try {
      const r = this.block(f.body, scope, true);
      if (r === BREAK || r === CONTINUE) fail("break and continue only work inside a loop.", no);
      if (f.sig.ret) fail(`${f.name || "This function"} ends without give back.`, no);
      return null;
    } catch (e) {
      if (!(e instanceof Give)) throw e;
      if (!f.sig.ret) { if (e.v) fail(`${f.name || "This function"} doesn't say what it gives back (giving back a …).`, no); return null; }
      if (!e.v) fail("give back needs a value here.", no);
      return this.fit(f.sig.ret, e.v, no, "the answer");
    } finally { this.depth--; }
  }
  method(type, name) { for (let t = type; t; t = this.types[t].parent) { const m = this.types[t].methods[name]; if (m) return { sig: m.sig, body: m.body, closure: null, name }; } return null; }
  fieldScope(o) { const e = new Env(null); for (const [k, c] of o.fields) e.vars.set(k, c); return e; }
  fieldCell(o, field, no) {
    if (!o || o.t !== "object") fail(`Only things made from a Boxx have a ${field}.`, no);
    const c = o.fields.get(field);
    if (!c) fail(`A ${o.type} has no ${field}.`, no);
    return c;
  }
  newObject(type, args, no, run) {
    const o = { t: "object", type, fields: new Map() };
    const chain = [];
    for (let t = type; t; t = this.types[t].parent) chain.unshift(this.types[t]);
    for (const t of chain) for (const f of t.fields) o.fields.set(f.name, { kind: f.kind, v: f.init ? this.fit(f.kind, this.eval(f.init, new Env(null)), f.no, f.name) : this.defaultOf(f.kind, f.no) });
    if (run) this.construct(o, type, args, no);
    return o;
  }
  construct(o, type, args, no) {
    const t = this.types[type];
    if (!t) fail(`I don't know a kind called ${type}.`, no);
    if (!t.made) { if (args.length) fail(`A ${type} has no when made, so it takes nothing.`, no); return; }
    this.invoke({ sig: t.made.sig, body: t.made.body, closure: null, name: "when made" }, args, no, o);
  }
  truth(v, no) { if (v.t !== "yes or no") fail("This question needs a yes or no answer.", no); return v.v; }
  index(c, i, no) {
    if (!isInt(i) || i.v < 0 || i.v >= c.items.length) fail("It used a position that is not in the collection or text.", no);
    return i.v;
  }
  show(v, no) {
    switch (v.t) {
      case "number": case "big number": return String(v.v);
      case "decimal": return cppDouble(v.v);
      case "text": case "letter": return v.v;
      case "yes or no": fail("The book doesn't show how a yes or no prints, so Code Block doesn't print one: print words with an if instead.", no);
      default: fail(`The book doesn't show how ${v.t === "object" ? "a thing made from a Boxx" : v.t === "choice" ? "a choice" : "a whole " + v.t} prints, so Code Block doesn't print one: print its parts instead.`, no);
    }
  }
  arith(op, a, b, no) {
    if (op === "+" && (a.t === "text" || b.t === "text")) {
      if ((a.t === "text" || a.t === "letter") && (b.t === "text" || b.t === "letter")) return txt(a.v + b.v);
      fail("To join a number to a text, turn the number into text with as text.", no);
    }
    if (!isNum(a) || !isNum(b)) fail(`${op === "+" ? "+" : "Math"} needs ${op === "+" ? "two numbers or two texts" : "numbers"}.`, no);
    const d = a.t === "decimal" || b.t === "decimal";
    const big = a.t === "big number" || b.t === "big number";
    if (op === "/" && b.v === 0) fail("The program divided by zero.", no);
    let r = op === "+" ? a.v + b.v : op === "-" ? a.v - b.v : op === "*" ? a.v * b.v : a.v / b.v;
    if (d) return dec(r);
    if (op === "/") r = Math.trunc(r);
    if (!big && (r > 2147483647 || r < -2147483648)) fail("This number got too big for a number box (use a big number).", no);
    return big ? { t: "big number", v: r } : num(r);
  }
  eval(e, env, it, statement) {
    switch (e.k) {
      case "lit": return e.v;
      case "var": {
        const c = env.find(e.name);
        if (c) return c.v;
        if (this.choices[e.name]) return this.choices[e.name];
        fail(this.funcs[e.name] ? `${e.name} is a function: use call ${e.name}.` : `I don't know a box called ${e.name} here.`, 0);
      }
      case "it": if (it) return it; fail("it means the value a check is checking.", 0);
      case "or": return bool(this.truth(this.eval(e.l, env, it), 0) || this.truth(this.eval(e.r, env, it), 0));
      case "and": return bool(this.truth(this.eval(e.l, env, it), 0) && this.truth(this.eval(e.r, env, it), 0));
      case "not": return bool(!this.truth(this.eval(e.e, env, it), 0));
      case "neg": { const v = this.eval(e.e, env, it); if (!isNum(v)) fail("A minus sign needs a number.", 0); return { t: v.t, v: -v.v }; }
      case "parity": { const v = this.eval(e.l, env, it); if (!isInt(v)) fail("even and odd are for whole numbers.", 0); return bool((Math.abs(v.v) % 2 === 0) === e.even); }
      case "has": {
        const c = this.eval(e.l, env, it), v = this.eval(e.r, env, it);
        if (c.t === "map") return bool(c.m.has(key(v)));
        if (isColl(c)) return bool(c.items.some((x) => eq(x, v, 0)));
        if (c.t === "text") return bool(c.v.includes(v.v));
        fail("has asks a collection or a map.", 0);
      }
      case "bin": {
        const a = this.eval(e.l, env, it), b = this.eval(e.r, env, it);
        if (e.op === "==") return bool(eq(a, b, 0));
        if ([">", "<", ">=", "<="].includes(e.op)) { const c = compare(a, b, 0); return bool(e.op === ">" ? c > 0 : e.op === "<" ? c < 0 : e.op === ">=" ? c >= 0 : c <= 0); }
        return this.arith(e.op, a, b, 0);
      }
      case "astext": {
        const v = this.eval(e.e, env, it);
        if (isInt(v)) return txt(String(v.v));
        if (v.t === "text" || v.t === "letter") return txt(v.v);
        fail(v.t === "decimal" ? "The book doesn't show how a decimal turns into text, so Code Block only does it with whole numbers." : "as text turns a number into text.", 0);
      }
      case "at": {
        const c = this.eval(e.e, env, it), i = this.eval(e.i, env, it);
        if (c.t === "map") { const k = key(i); if (!c.m.has(k)) fail("This map has nothing at that key.", 0); return c.m.get(k); }
        if (c.t === "text") { if (!isInt(i) || i.v < 0 || i.v >= c.v.length) fail("It used a position that is not in the collection or text.", 0); return chr(c.v[i.v]); }
        if (!isColl(c)) fail("at finds an item in a collection or a letter in a text.", 0);
        return c.items[this.index(c, i, 0)];
      }
      case "field": { const o = this.eval(e.obj, env, it); return this.fieldCell(o, e.field, 0).v; }
      case "call": {
        const f = e.group ? (this.groups[e.group] || fail(`I don't know a group called ${e.group}.`, 0))[e.name] || fail(`${e.group} has no function called ${e.name}.`, 0) : this.fn(env, e.name, 0);
        const r = this.invoke(f, e.args.map((a) => this.eval(a, env, it)), 0);
        if (!statement && !r) fail(`${e.name} doesn't give back an answer, so it can't be used as a value.`, 0);
        return r;
      }
      case "phrase": return this.phrase(e, env, it);
    }
    fail("The stand-in can't work this out.", 0);
  }
  phrase(e, env, it) {
    const a = {};
    for (const k of Object.keys(e.args)) if (k !== "f") a[k] = this.eval(e.args[k], env, it);
    const N = (x) => { if (!isNum(x)) fail(`${e.pat.replace(/\{\w+\}/g, "…")} needs a number.`, 0); return x.v; };
    const T = (x) => { if (x.t !== "text" && x.t !== "letter") fail(`${e.pat.replace(/\{\w+\}/g, "…")} needs a text.`, 0); return x.v; };
    const C = (x) => { if (!isColl(x)) fail(`${e.pat.replace(/\{\w+\}/g, "…")} needs a collection.`, 0); return x.t === "map" ? [...x.m.values()] : x.items; };
    const F = () => this.fn(env, e.args.f.name, 0);
    const same = (x, v) => (x.t === "decimal" ? dec(v) : num(v));
    const both = (x, y, v) => (x.t === "decimal" || y.t === "decimal" ? dec(v) : num(v));
    const nonEmpty = (c) => { if (!c.length) fail("This collection is empty.", 0); return c; };
    switch (e.id) {
      case "sqrt": { const x = N(a.x); if (x < 0) fail("A negative number has no square root.", 0); return dec(Math.sqrt(x)); }
      case "cbrt": return dec(Math.cbrt(N(a.x)));
      case "abs": return same(a.x, Math.abs(N(a.x)));
      case "sin": return dec(Math.sin(N(a.x))); case "cos": return dec(Math.cos(N(a.x))); case "tan": return dec(Math.tan(N(a.x)));
      case "floor": return dec(Math.floor(N(a.x))); case "ceil": return dec(Math.ceil(N(a.x)));
      case "round": { const x = N(a.x); return dec(x < 0 ? -Math.round(-x) : Math.round(x)); }
      case "trunc": return dec(Math.trunc(N(a.x)));
      case "fmod": { const y = N(a.y); if (y === 0) fail("The program divided by zero.", 0); return dec(N(a.x) % y); }
      case "pow": return dec(Math.pow(N(a.x), N(a.y)));
      case "hypot": return dec(Math.hypot(N(a.a), N(a.b)));
      case "min": return both(a.a, a.b, Math.min(N(a.a), N(a.b)));
      case "max": return both(a.a, a.b, Math.max(N(a.a), N(a.b)));
      case "clamp": return both(a.x, a.lo, Math.min(Math.max(N(a.x), N(a.lo)), N(a.hi)));
      case "gcd": case "lcm": {
        let x = Math.abs(N(a.a)), y = Math.abs(N(a.b)); if (!isInt(a.a) || !isInt(a.b)) fail("This needs whole numbers.", 0);
        const g = (p, q) => (q ? g(q, p % q) : p); const d = g(x, y);
        return num(e.id === "gcd" ? d : d ? (x / d) * y : 0);
      }
      case "pi": return dec(Math.PI); case "e": return dec(Math.E);
      case "intmax": return num(2147483647); case "intmin": return num(-2147483648);
      case "rand": { const lo = N(a.a), hi = N(a.b); if (!isInt(a.a) || !isInt(a.b) || hi < lo) fail("a random number needs whole numbers, small to big.", 0); return num(lo + Math.floor(this.rand() * (hi - lo + 1))); }
      case "randdec": return dec(N(a.a) + this.rand() * (N(a.b) - N(a.a)));
      case "randitem": { const c = nonEmpty(C(a.c)); return c[Math.floor(this.rand() * c.length)]; }
      case "randbool": return bool(this.rand() < 0.5);
      case "secs": return dec(this.clock); case "ms": return { t: "big number", v: Math.round(this.clock * 1000) };
      case "fact": { const n = N(a.n); if (!isInt(a.n) || n < 0 || n > 20) fail("factorial works for whole numbers from 0 to 20.", 0); let f = 1; for (let i = 2; i <= n; i++) f *= i; return { t: "big number", v: f }; }
      case "prime": { const n = N(a.n); if (!isInt(a.n)) fail("Only whole numbers can be prime.", 0); let p = n >= 2; for (let i = 2; i * i <= n; i++) if (n % i === 0) { p = false; break; } return bool(p); }
      case "length": { if (isColl(a.s)) fail("Use the count of … for a collection; the length of … is for text.", 0); return num(T(a.s).length); }
      case "upper": return a.s.t === "letter" ? chr(a.s.v.toUpperCase()) : txt(T(a.s).toUpperCase());
      case "lower": return a.s.t === "letter" ? chr(a.s.v.toLowerCase()) : txt(T(a.s).toLowerCase());
      case "trim": return txt(T(a.s).trim());
      case "rev": { if (isColl(a.s)) { const c = copy(a.s); c.items.reverse(); return c; } return txt([...T(a.s)].reverse().join("")); }
      case "title": return txt(T(a.s).toLowerCase().replace(/(^|[^A-Za-z])([a-z])/g, (m, p, c) => p + c.toUpperCase()));
      case "firstn": { const n = N(a.n); if (n < 0) fail("Use 0 or more letters.", 0); return txt(T(a.s).slice(0, n)); }
      case "lastn": { const n = N(a.n), s = T(a.s); if (n < 0) fail("Use 0 or more letters.", 0); return txt(n ? s.slice(-n) : ""); }
      case "replace": { const s = T(a.s), x = T(a.a), y = T(a.b); if (!x) fail("Say what to replace.", 0); return txt(s.split(x).join(y)); }
      case "copies": { const n = N(a.n); if (!isInt(a.n) || n < 0) fail("copies needs a whole number.", 0); return txt(T(a.c).repeat(n)); }
      case "textof": { const v = a.x; if (isInt(v)) return txt(String(v.v)); if (v.t === "text" || v.t === "letter") return txt(v.v); fail("The book doesn't show how this turns into text.", 0); }
      case "numin": { const s = T(a.s).trim(); if (!/^[+-]?\d+/.test(s)) fail(`“${s}” doesn't start with a number.`, 0); return num(parseInt(s, 10)); }
      case "decin": { const s = T(a.s).trim(); const v = parseFloat(s); if (Number.isNaN(v)) fail(`“${s}” doesn't start with a number.`, 0); return dec(v); }
      case "code": { if (a.c.t !== "letter") fail("the letter code of … needs a letter.", 0); return num(a.c.v.charCodeAt(0)); }
      case "letter": return chr(String.fromCharCode(N(a.n)));
      case "words": return { t: "vector", of: { base: "text" }, items: T(a.s).split(/\s+/).filter(Boolean).map(txt) };
      case "split": return { t: "vector", of: { base: "text" }, items: T(a.s).split(T(a.sep)).map(txt) };
      case "join": return txt(C(a.c).map((x) => T(x)).join(T(a.sep)));
      case "count": { if (a.c.t === "text") fail("Use the length of … for a text.", 0); if (a.c.t === "map") return num(a.c.m.size); return num(C(a.c).length); }
      case "first": return nonEmpty(C(a.c))[0];
      case "last": { const c = nonEmpty(C(a.c)); return c[c.length - 1]; }
      case "top": { if (a.c.t !== "stack") fail("the top of … is for a stack.", 0); return nonEmpty(a.c.items)[a.c.items.length - 1]; }
      case "front": { if (a.c.t !== "queue" && a.c.t !== "list") fail("the front of … is for a queue.", 0); return nonEmpty(a.c.items)[0]; }
      case "back": { if (a.c.t !== "queue" && a.c.t !== "list") fail("the back of … is for a queue.", 0); return nonEmpty(a.c.items)[a.c.items.length - 1]; }
      case "sum": case "product": { const c = C(a.c); let r = e.id === "sum" ? num(0) : num(1); for (const x of c) r = this.arith(e.id === "sum" ? "+" : "*", r, x, 0); if (a.c.of && a.c.of.base === "decimal") r = dec(r.v); return r; }
      case "average": { const c = nonEmpty(C(a.c)); return dec(c.reduce((s, x) => s + N(x), 0) / c.length); }
      case "median": { const c = nonEmpty(C(a.c)).map(N).sort((x, y) => x - y); const m = c.length >> 1; return dec(c.length % 2 ? c[m] : (c[m - 1] + c[m]) / 2); }
      case "biggest": case "smallest": { const c = nonEmpty(C(a.c)); return c.reduce((m, x) => (compare(x, m, 0) * (e.id === "biggest" ? 1 : -1) > 0 ? x : m)); }
      case "timesin": return num(C(a.c).filter((x) => eq(x, a.v, 0)).length);
      case "sorted": { const c = copy(a.c); if (!c.items) fail("a sorted copy of … needs a vector.", 0); c.items.sort((x, y) => compare(x, y, 0)); return c; }
      case "keys": { if (a.c.t !== "map") fail("the keys of … is for a map.", 0); return { t: "vector", of: a.c.from, items: [...a.c.m.keys()].sort().map((k) => (a.c.from.base === "text" ? txt(k) : num(k))) }; }
      case "values": { if (a.c.t !== "map") fail("the values of … is for a map.", 0); return { t: "vector", of: a.c.to, items: [...a.c.m.keys()].sort().map((k) => a.c.m.get(k)) }; }
      case "countwhere": case "where": case "every": case "some": case "none": {
        const f = F(); const c = C(a.c);
        const pass = c.map((x) => this.truth(this.callFn(f, [x], 0, true), 0));
        if (e.id === "countwhere") return num(pass.filter(Boolean).length);
        if (e.id === "where") return { t: "vector", of: a.c.of, items: c.filter((x, i) => pass[i]) };
        return bool(e.id === "every" ? pass.every(Boolean) : e.id === "some" ? pass.some(Boolean) : !pass.some(Boolean));
      }
      case "results": { const f = F(); const c = C(a.c); return { t: "vector", of: f.sig.ret, items: c.map((x) => this.callFn(f, [x], 0, true)) }; }
      case "deref": { if (a.p.t !== "pointer") fail("the value … points to needs a pointer.", 0); if (!a.p.cell) fail("This pointer points to nothing.", 0); return a.p.cell.v; }
      // std::regex reads ECMAScript patterns, the same grammar as JavaScript's.
      case "matches": return bool(new RegExp(T(a.p)).test(T(a.t)));
      case "allmatches": return { t: "vector", of: { base: "text" }, items: [...T(a.t).matchAll(new RegExp(T(a.p), "g"))].map((m) => txt(m[0])) };
      case "rereplace": return txt(T(a.t).replace(new RegExp(T(a.p), "g"), T(a.r)));
      case "exists": return bool(this.files.has(T(a.f)));
      case "filetext": { const f = T(a.f); if (!this.files.has(f)) fail(`There is no file called ${f}.`, 0); return txt(this.files.get(f)); }
      case "filelines": { const f = T(a.f); if (!this.files.has(f)) fail(`There is no file called ${f}.`, 0); return { t: "vector", of: { base: "text" }, items: this.files.get(f).replace(/\n$/, "").split("\n").map(txt) }; }
      case "problem": { if (this.problem === null) fail("the problem only means something inside if it fails.", 0); return txt(this.problem); }
    }
    fail("The stand-in can't work out " + e.pat + ".", 0);
  }
}

// Errors raised while working out a value carry line 0; the statement
// being run knows its line, so exec fills it in.
const execRaw = Interp.prototype.exec;
Interp.prototype.exec = function (s, env) {
  try { return execRaw.call(this, s, env); }
  catch (e) { if ((e instanceof EppError || e instanceof Complaint) && !e.line) e.line = s.no; throw e; }
};

/* ---------- the three checks ---------- */
function parse(code, loose) {
  const lines = readLines(code);
  return new Parser(lines, loose).program();
}
function check(code) {
  try { parse(code, false); return ""; } catch (e) { if (e instanceof EppError) return `line ${e.line}: ${e.message}`; throw e; }
}
// A drill line is checked as it would sit in a whole program: a header
// gets a body and its end, and a line that only belongs inside another
// part (otherwise, if it is, give back, has …) gets that part around it.
function checkLine(line) {
  const t = line.trim();
  const body = "note …";
  const w = (t.match(/^[A-Za-z]+/) || [""])[0];
  let code;
  if (/^otherwise\b/.test(t)) code = `if yes:\n  ${body}\n${t}\n  ${body}\nend if`;
  else if (/^if it is\b/.test(t)) code = `check 1:\n  ${t}\n    ${body}\nend check`;
  else if (/^if it fails:$/.test(t)) code = `try:\n  ${body}\n${t}\n  ${body}\nend try`;
  else if (/^until\b/.test(t)) code = `repeat:\n  ${body}\n${t}`;
  else if (/^(break|continue)$/.test(t) || /^if .*, (break|continue)$/.test(t)) code = `repeat forever:\n  ${t}\nend repeat`;
  else if (/^give back\b/.test(t)) code = `define f giving back a number:\n  ${t}\nend f`;
  else if (/^(has|can|when made)\b/.test(t)) {
    const inner = /:$/.test(t) ? `  ${t}\n    ${body}\n  end ${/^when made/.test(t) ? "when made" : t.split(/\s+/)[1].replace(/:$/, "")}` : `  ${t}`;
    code = `Boxx called Thing:\n${inner}\nend Thing`;
  } else if (/^start as\b/.test(t)) code = `Boxx called Thing uses Base:\n  when made:\n    ${t}\n  end when made\nend Thing`;
  else if (/:$/.test(t)) {
    const m = t.match(/^(define|Boxx called|Group called)\s+(\w+)/);
    const end = m ? "end " + m[2] : /^repeat:$/.test(t) ? "until yes" : HEAD_END[w];
    if (!end) return `“${t}” ends with a colon, but isn't a part that holds lines.`;
    const inside = /^check\b/.test(t) ? `  otherwise:\n    ${body}` : /^Boxx\b/.test(t) ? "  has a number called x" : /^Group\b/.test(t) ? "  define f:\n    note …\n  end f" : `  ${body}`;
    code = /^try:$/.test(t) ? `${t}\n  ${body}\nif it fails:\n  ${body}\nend try` : `${t}\n${inside}\n${end}`;
  } else code = t;
  try { parse(code, true); return ""; } catch (e) { if (e instanceof EppError) return e.message; throw e; }
}
function run(code, opts = {}) {
  let prog;
  try { prog = parse(code, false); }
  catch (e) { if (e instanceof EppError) return { ok: false, error: `line ${e.line}: ${e.message}` }; throw e; }
  const it = new Interp(opts);
  try { it.run(prog); }
  catch (e) {
    if (e instanceof EppError) {
      const src = code.split("\n")[e.line - 1] || "";
      return { ok: false, stdout: it.out.join("\n"), error: `The program stopped on line ${e.line}:\n${src.trim()}\n${e.message}` };
    }
    throw e;
  }
  return { ok: true, stdout: it.out.length ? it.out.join("\n") + "\n" : "", files: it.files };
}

module.exports = { check, checkLine, run, cppDouble, isCompressed, CODES };
