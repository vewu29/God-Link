// English++ three-words-a-line: a checker and a stand-in interpreter
// for the content checks.
//
// The English++ Book (for English++ Studio 3) teaches one main form:
// every line has exactly three words, who · the root · what, and lines
// moved in by two spaces belong to the line above them. English++
// Studio is a Windows program that turns that into C++, so it can't run
// here. This file reads and runs the part of the language the Code Block
// track teaches, written from the book, and is pinned to the book's own
// examples and outputs by tests/englishpp3.test.js.
//
// It refuses what it doesn't know rather than guess: a root it doesn't
// run, a word it can't read, or a value it can't print stops the check
// with a message, so no output the track shows rests on a guess.
//
//   looksThreeWord(line) → true when a line is written in this form
//   check(line)          → "" or the first problem with one line
//   checkProgram(code)   → "" or the first problem, from reading alone
//   run(code, opts)      → { ok, stdout, error }; opts.input = answers for get
"use strict";

// Every root in the book's Whole Chart (Chapter 43), plus is.
const ROOTS = new Set((
  "is " +
  "add adv amd aml and ant aor apw asb asl asr axr bbl bch bcs bdf bdo blk bsw btr bts " +
  "cav cct cde cfr cft chm chs cky cla cme cmn cmp cmx cpd cps cra crv csm cso ctx cvl " +
  "dal dbs dcl dds den dfd dfm dfn dfy dgr dhd dkn dlm dmb dmk dop dov dpm dsc dsf dsh dst dtp dun dvr " +
  "ebk edl enx ert etw ext fea fge fgt fle flt fne fpr get gln hap hcp hex hln hls hmk hmv hrd hrm hsz hwr " +
  "ieq iff ige igt ile ilt ine kda kdy kel khr kmi kmo kms kse ktm kwk kyr " +
  "ldx lfl lin lpf lpl lrm lrs lrv lso lsu luq lwp mak mfi mfo mgl mkn mlo mmv mnw mpt mrf msh msy mtd mwn " +
  "nab nac nas nat nco ncr ndn nep nfc ngd nhi nhy nkb nlg nlx nmn nmu nmx npe npi npw nra nro nrz nsn nsq ntn nup nwh " +
  "oeq oge ogt ole olt one oth prn put rcm rdt rjn rsd rwt seq sge sgt sle slt sne " +
  "tbg tcu tdc ted tfx ths tlc tln tma tmt tnm tpa tps trp trv trx tsp tsz ttc tti tuc twd " +
  "ueq uge ugt ule ult une weq wfv wge wgt wle wln wlt wne xag xcd xcm xev xgl xic xim xlb xpp xus xwb"
).split(/\s+/));

/* ---------- reading a line ---------- */

// Split on spaces outside quote marks. Returns null for an unclosed quote.
function words(line) {
  const out = [];
  let cur = "", q = null;
  for (const ch of line) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === " ") { if (cur) out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (q) return null;
  if (cur) out.push(cur);
  return out;
}

// The middle word is a root from the chart, or the name of a function or
// method the program defines (now greet "Ada", rex bark now). Every root
// has three letters, so a name of four or more, or one with _, is a name.
const isOwnName = (w) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(w) && (w.length > 3 || w.includes("_"));
const middleOk = (w) => ROOTS.has(w) || isOwnName(w);

function looksThreeWord(line) {
  const w = words(line.trim());
  return !!w && w.length === 3 && middleOk(w[1]);
}

const MARKS = { ";": "semicolons", "(": "round brackets", ")": "round brackets", "[": "square brackets", "]": "square brackets",
  "{": "curly brackets", "}": "curly brackets", ",": "commas", ":": "colons" };

function marksProblem(word) {
  const bare = word.replace(/"[^"]*"|'[^']*'/g, "");
  for (const ch of bare) if (MARKS[ch]) return `English++ has no ${MARKS[ch]}.`;
  if (/\.(?!\d)|(?<!\d)\./.test(bare)) return "The one dot English++ allows is the point inside a number.";
  return "";
}

// One drill line, on its own. The middle word must be a root in the chart.
function check(line) {
  if (line !== line.trim()) return "A drill line has no spaces at its start or end.";
  const w = words(line);
  if (!w) return "A quote mark is never closed.";
  if (w.length !== 3) return `This line has ${w.length} words. Every line has exactly 3: who, the root, and what.`;
  if (!middleOk(w[1])) return `“${w[1]}” is not a root in the Whole Chart.`;
  for (const word of w) { const p = marksProblem(word); if (p) return p; }
  return "";
}

class EppError extends Error { constructor(msg, line) { super(msg); this.line = line; } }
class Problem extends Error { constructor(text, line) { super(text); this.text = text; this.line = line; } }
const fail = (msg) => { throw new EppError(msg); };

// A program becomes a tree of lines: { no, who, root, what, kids }.
function read(code) {
  const top = { kids: [] }, stack = [{ depth: -1, node: top }];
  code.split("\n").forEach((raw, i) => {
    const no = i + 1;
    if (!raw.trim()) return;
    const lead = raw.match(/^ */)[0].length;
    if (/^\t/.test(raw.slice(lead))) throw new EppError("Move lines in with spaces, not tabs.", no);
    if (lead % 2) throw new EppError("Move lines in by two spaces at a time.", no);
    const depth = lead / 2, text = raw.slice(lead).replace(/\s+$/, "");
    while (stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1];
    if (depth > parent.depth + 1) throw new EppError("This line is moved in further than the line above it allows.", no);
    if (/^note( |$)/.test(text)) return;
    const w = words(text);
    if (!w) throw new EppError("A quote mark is never closed.", no);
    if (w.length !== 3) throw new EppError(`This line has ${w.length} words. Every line has exactly 3: who, the root, and what.`, no);
    for (const word of w) { const p = marksProblem(word); if (p) throw new EppError(p, no); }
    const node = { no, who: w[0], root: w[1], what: w[2], kids: [] };
    parent.node.kids.push(node);
    stack.push({ depth, node });
  });
  return top.kids;
}

/* ---------- values ---------- */

const NUM_KINDS = new Set(["num", "big", "sml", "pos", "byt", "hug"]);
const DEC_KINDS = new Set(["dec", "flo"]);
const num = (v) => ({ k: "num", v: Math.trunc(v) });
const dec = (v) => ({ k: "dec", v });
const yno = (v) => ({ k: "yno", v: !!v });
const ltr = (c) => ({ k: "ltr", v: c });
const vec = (a) => ({ k: "vec", a });
const isNum = (x) => x && (x.k === "num" || x.k === "dec");
const NONE = { k: "none" };

// A decimal prints the way C++ prints a double: 6 significant digits.
function g6(x) {
  if (x === 0) return "0";
  if (!isFinite(x)) return x > 0 ? "inf" : x < 0 ? "-inf" : "nan";
  const parts = x.toExponential(5).split("e"), ex = Number(parts[1]);
  const strip = (s) => (s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s);
  if (ex < -4 || ex >= 6) return strip(parts[0]) + "e" + (ex < 0 ? "-" : "+") + (Math.abs(ex) < 10 ? "0" : "") + Math.abs(ex);
  return strip(x.toFixed(Math.max(0, 5 - ex)));
}

function show(x) {
  if (typeof x === "string") return x;
  switch (x.k) {
    case "num": return String(x.v);
    case "dec": return g6(x.v);
    case "yno": return x.v ? "yes" : "nay";
    case "ltr": return x.v;
    case "vec": return "[" + x.a.map(show).join(", ") + "]";
    case "set": return "{" + x.a.map(show).join(", ") + "}";
    case "map": return "{" + mapKeys(x).map((key) => show(x.m.get(key).k) + ": " + show(x.m.get(key).v)).join(", ") + "}";
    case "obj": return x.cls + "(" + x.order.map((f) => f + ": " + show(x.f[f])).join(", ") + ")";
    default: return fail("I can't print that.");
  }
}

function keyOf(x) { return typeof x === "string" ? "t:" + x : x.k + ":" + show(x); }
function cmp(a, b) {
  if (typeof a === "string" && typeof b === "string") return a < b ? -1 : a > b ? 1 : 0;
  if (isNum(a) && isNum(b)) return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  if (a.k === "ltr" && b.k === "ltr") return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  if (a.k === "yno" && b.k === "yno") return (a.v ? 1 : 0) - (b.v ? 1 : 0);
  return fail("These two can't be compared.");
}
function equal(a, b) {
  if (isNum(a) && isNum(b)) return a.v === b.v;
  if (typeof a === "string" || typeof b === "string") return a === b;
  if (a.k !== b.k) return false;
  if (a.k === "vec") return a.a.length === b.a.length && a.a.every((x, i) => equal(x, b.a[i]));
  return show(a) === show(b);
}
function mapKeys(m) { return [...m.m.keys()].sort((x, y) => cmp(m.m.get(x).k, m.m.get(y).k)); }
function truth(x) {
  if (x && x.k === "yno") return x.v;
  if (isNum(x)) return x.v !== 0;
  return fail("A test needs a yes or no.");
}
function copy(x) {
  if (!x || typeof x !== "object") return x;
  if (x.k === "vec") return vec(x.a.map(copy));
  if (["set", "stk", "que", "hep"].includes(x.k)) return { k: x.k, a: x.a.map(copy) };
  if (x.k === "map") { const m = new Map(); for (const [k, e] of x.m) m.set(k, { k: copy(e.k), v: copy(e.v) }); return { k: "map", m, vk: x.vk }; }
  if (x.k === "obj") { const f = {}; for (const n of x.order) f[n] = copy(x.f[n]); return { ...x, f }; }
  return x;
}

function arith(op, a, b) {
  if (op === "+" && (typeof a === "string" || typeof b === "string")) {
    if (typeof a === "string" && typeof b === "string") return a + b;
    if (typeof a === "string" && b.k === "ltr") return a + b.v;
    if (a.k === "ltr" && typeof b === "string") return a.v + b;
    return fail("Text joins only with text. Use txt& to turn a number into text.");
  }
  if (!isNum(a) || !isNum(b)) return fail(`${op} works on numbers.`);
  const d = a.k === "dec" || b.k === "dec";
  switch (op) {
    case "+": return d ? dec(a.v + b.v) : num(a.v + b.v);
    case "-": return d ? dec(a.v - b.v) : num(a.v - b.v);
    case "*": return d ? dec(a.v * b.v) : num(a.v * b.v);
    case "/": if (!d && b.v === 0) fail("A whole number can't be divided by 0."); return d ? dec(a.v / b.v) : num(a.v / b.v);
    case "%": if (d) fail("% works on whole numbers."); if (b.v === 0) fail("A whole number can't be divided by 0."); return num(a.v % b.v);
  }
  return fail("Unknown math.");
}

/* ---------- reading a value (one word) ---------- */

// Split a word on a mark that sits outside quotes, at the top level.
function splitTop(s, mark) {
  const out = []; let cur = "", q = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (s.startsWith(mark, i) && !(mark === "&" && s[i + 1] === "&") && !(mark === "&" && s[i - 1] === "&")) { out.push(cur); cur = ""; i += mark.length - 1; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function lex(s) {
  const toks = []; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '"') { const j = s.indexOf('"', i + 1); toks.push({ t: "text", v: s.slice(i + 1, j) }); i = j + 1; continue; }
    if (ch === "'") { const j = s.indexOf("'", i + 1); toks.push({ t: "ltr", v: s.slice(i + 1, j) }); i = j + 1; continue; }
    if (/[0-9]/.test(ch)) { const m = s.slice(i).match(/^\d+(\.\d+)?/); toks.push({ t: m[1] ? "dec" : "num", v: Number(m[0]) }); i += m[0].length; continue; }
    if (/[A-Za-z_]/.test(ch)) { const m = s.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/); toks.push({ t: "name", v: m[0] }); i += m[0].length; continue; }
    const two = s.slice(i, i + 2);
    if (["==", "!=", "<=", ">=", "&&", "||"].includes(two)) { toks.push({ t: "op", v: two }); i += 2; continue; }
    if ("+-*/%<>!@".includes(ch)) { toks.push({ t: "op", v: ch }); i++; continue; }
    fail(`I can't read “${ch}” in ${s}.`);
  }
  return toks;
}

const BIN = [["||"], ["&&"], ["==", "!="], ["<", "<=", ">", ">="], ["+", "-"], ["*", "/", "%"]];

class Interp {
  constructor(opts) {
    this.out = []; this.line = ""; this.input = (opts.input || []).slice(); this.files = Object.assign({}, opts.files || {});
    this.funcs = Object.create(null); this.classes = Object.create(null); this.globals = new Map();
    this.steps = 0; this.seed = 1;
  }
  print(s, nl) {
    this.line += s;
    if (nl) { this.out.push(this.line); this.line = ""; }
  }

  /* --- values --- */
  value(word, env) {
    const parts = splitTop(word, "&");
    if (parts.length > 1) {
      const head = parts[0];
      const args = parts.slice(1).filter((p, i, a) => !(p === "" && i === a.length - 1)).map((p) => this.value(p, env));
      if (/^[A-Za-z_]\w*$/.test(head) && !this.has(env, head)) return this.call(head, args, env);
      if (/^[A-Za-z_]\w*@\w+$/.test(head) && head.split("@")[1] === "at") return this.call(head, args, env);
      return vec([this.value(head, env), ...args]);
    }
    return this.expr(lex(word), env, word);
  }
  expr(toks, env, src) {
    let i = 0;
    const peek = () => toks[i], next = () => toks[i++];
    const self = this;
    function bin(level) {
      if (level === BIN.length) return unary();
      let a = bin(level + 1);
      while (peek() && peek().t === "op" && BIN[level].includes(peek().v)) {
        const op = next().v, b = bin(level + 1);
        if (op === "&&") a = yno(truth(a) && truth(b));
        else if (op === "||") a = yno(truth(a) || truth(b));
        else if (op === "==") a = yno(equal(a, b));
        else if (op === "!=") a = yno(!equal(a, b));
        else if (["<", "<=", ">", ">="].includes(op)) { const c = cmp(a, b); a = yno(op === "<" ? c < 0 : op === "<=" ? c <= 0 : op === ">" ? c > 0 : c >= 0); }
        else a = arith(op, a, b);
      }
      return a;
    }
    function unary() {
      const t = peek();
      if (t && t.t === "op" && t.v === "!") { next(); return yno(!truth(unary())); }
      if (t && t.t === "op" && t.v === "-") { next(); const x = unary(); if (!isNum(x)) fail("- works on numbers."); return x.k === "dec" ? dec(-x.v) : num(-x.v); }
      return postfix();
    }
    function postfix() {
      let x = atom();
      while (peek() && peek().t === "op" && peek().v === "@") {
        next();
        const t = next();
        if (!t) fail("@ needs something after it.");
        let key;
        if (t.t === "name" && x && x.k === "obj") { x = self.field(x, t.v); continue; }
        if (t.t === "name" && x && (x.k === "stk" || x.k === "que" || x.k === "hep")) { x = self.peekOf(x, t.v); continue; }
        if (t.t === "name") key = self.lookup(env, t.v);
        else if (t.t === "num") key = num(t.v);
        else if (t.t === "text") key = self.text(t.v, env);
        else fail("@ can't reach with that.");
        x = self.at(x, key);
      }
      return x;
    }
    function atom() {
      const t = next();
      if (!t) fail(`A value is missing in ${src}.`);
      if (t.t === "num") return num(t.v);
      if (t.t === "dec") return dec(t.v);
      if (t.t === "text") return self.text(t.v, env);
      if (t.t === "ltr") return ltr(t.v);
      if (t.t === "name") {
        if (t.v === "yes") return yno(true);
        if (t.v === "nay") return yno(false);
        if (t.v === "npi") return dec(Math.PI);
        if (self.has(env, t.v)) return self.lookup(env, t.v);
        if (self.funcs[t.v] || BUILTIN[t.v]) return self.call(t.v, [], env);
        return fail(`I don't know a name called ${t.v}.`);
      }
      return fail(`I can't read ${src}.`);
    }
    const v = bin(0);
    if (i < toks.length) fail(`I can't read ${src}.`);
    return v;
  }
  // "@name" and "@list@0" inside text.
  text(s, env) {
    return s.replace(/\\n/g, "\n").replace(/@@|@([A-Za-z_]\w*(?:@(?:[A-Za-z_]\w*|\d+))*)/g, (m, path) => (m === "@@" ? "@" : show(this.expr(lex(path), env, path))));
  }
  at(x, key) {
    if (x && x.k === "vec") {
      if (!isNum(key)) fail("A position is a whole number.");
      if (key.v < 0 || key.v >= x.a.length) throw new EppError("It used a position that is not in the collection or text.");
      return x.a[key.v];
    }
    if (x && x.k === "map") {
      let e = x.m.get(keyOf(key));
      if (!e) { e = { k: key, v: this.blank(x.vk || "num", {}) }; x.m.set(keyOf(key), e); }
      return e.v;
    }
    if (typeof x === "string") {
      if (!isNum(key) || key.v < 0 || key.v >= x.length) fail("That position is outside the text.");
      return ltr(x[key.v]);
    }
    return fail("Only a list, a map or a text can be reached into with a position.");
  }
  peekOf(c, word) {
    const want = c.k === "que" ? "front" : "top";
    if (word !== want) fail(`A ${c.k} is read with @${want}.`);
    if (!c.a.length) fail(`The ${c.k} is empty.`);
    return c.k === "que" ? c.a[0] : c.a[c.a.length - 1];
  }
  field(obj, name) {
    if (!(name in obj.f)) fail(`A ${obj.cls} has no ${name}.`);
    return obj.f[name];
  }

  /* --- names --- */
  has(env, name) { for (let e = env; e; e = e.up) if (e.vars.has(name)) return true; return this.globals.has(name) || (env.self && name in env.self.f); }
  lookup(env, name) {
    for (let e = env; e; e = e.up) if (e.vars.has(name)) return e.vars.get(name);
    if (env.self && name in env.self.f) return env.self.f[name];
    if (this.globals.has(name)) return this.globals.get(name);
    return fail(`I don't know a name called ${name}.`);
  }
  set(env, name, val) {
    for (let e = env; e; e = e.up) if (e.vars.has(name)) {
      if (e.consts && e.consts.has(name)) fail(`${name} is a constant, so it can't change.`);
      e.vars.set(name, this.fit(e.vars.get(name), val)); return;
    }
    if (env.self && name in env.self.f) { env.self.f[name] = this.fit(env.self.f[name], val); return; }
    env.vars.set(name, val);
  }
  // A box keeps its kind: a decimal stays a decimal, a whole number stays whole.
  fit(old, val) {
    if (old && old.k === "num" && val && val.k === "dec") return num(val.v);
    if (old && old.k === "dec" && val && val.k === "num") return dec(val.v);
    return val;
  }
  // Where a line puts a value: a name, a name@position, or rex@field.
  place(word, env) {
    const p = word.split("@");
    if (p.length === 1) return { get: () => this.lookup(env, word), put: (v) => this.set(env, word, v), name: word };
    const base = this.expr(lex(p.slice(0, -1).join("@")), env, word), last = p[p.length - 1];
    if (base && base.k === "obj" && /^[A-Za-z_]/.test(last)) return { get: () => this.field(base, last), put: (v) => { this.field(base, last); base.f[last] = this.fit(base.f[last], v); } };
    const key = this.expr(lex(last), env, last);
    if (base && base.k === "vec") return { get: () => this.at(base, key), put: (v) => { this.at(base, key); base.a[key.v] = v; } };
    if (base && base.k === "map") return { get: () => this.at(base, key), put: (v) => base.m.set(keyOf(key), { k: key, v }) };
    return fail(`${word} can't be changed.`);
  }

  /* --- kinds --- */
  blank(kind, env) {
    const parts = kind.split("@"), k = parts[0];
    if (NUM_KINDS.has(k)) return num(0);
    if (DEC_KINDS.has(k)) return dec(0);
    if (k === "txt") return "";
    if (k === "ltr") return ltr("\0");
    if (k === "yno") return yno(false);
    if (k === "vec" || k === "lst") return vec([]);
    // A stack gives its top (the last in), a queue its front (the first
    // in), and a priority queue (hep) its biggest; lpl takes that one off.
    if (k === "stk" || k === "que" || k === "hep") return { k, a: [] };
    if (k === "map" || k === "hsh") return { k: "map", m: new Map(), vk: parts.slice(2).join("@") || "num" };
    if (k === "set" || k === "bag") return { k: "set", a: [] };
    if (this.classes[k]) return this.make(k, [], env);
    return fail(`I don't know a kind called ${kind}.`);
  }
  convert(kind, v) {
    if (NUM_KINDS.has(kind)) {
      if (typeof v === "string") { const n = parseInt(v, 10); if (isNaN(n)) fail("invalid stoi argument"); return num(n); }
      if (v.k === "ltr") return num(v.v.charCodeAt(0));
      if (v.k === "yno") return num(v.v ? 1 : 0);
      return num(v.v);
    }
    if (DEC_KINDS.has(kind)) { if (typeof v === "string") { const n = parseFloat(v); if (isNaN(n)) fail("invalid stod argument"); return dec(n); } return dec(v.v); }
    if (kind === "txt") return show(v);
    if (kind === "ltr") return isNum(v) ? ltr(String.fromCharCode(v.v)) : ltr(show(v)[0]);
    if (kind === "yno") return isNum(v) ? yno(v.v !== 0) : v.k === "yno" ? v : fail("That can't be a yes or no.");
    return fail(`I don't know a kind called ${kind}.`);
  }

  /* --- functions and classes --- */
  call(name, args, env) {
    if (name.includes("@")) fail(`I can't run ${name}.`);
    if (NUM_KINDS.has(name) || DEC_KINDS.has(name) || ["txt", "ltr", "yno"].includes(name)) {
      if (args.length !== 1) fail(`${name}& takes one value.`);
      return this.convert(name, args[0]);
    }
    if (this.classes[name]) return this.make(name, args, env);
    const f = this.funcs[name];
    if (f) return this.invoke(f, args, null);
    if (BUILTIN[name]) return BUILTIN[name](args, this);
    return fail(`I don't know a function called ${name}.`);
  }
  invoke(f, args, self) {
    const env = { vars: new Map(), up: null, self };
    const params = f.body.filter((n) => n.root === "dpm");
    if (args.length > params.length || args.length < params.filter((p) => !this.isDefault(p.what)).length)
      fail(`${f.name} takes ${params.length} value${params.length === 1 ? "" : "s"}.`);
    if (params.some((p) => /^(ref|mlo)@/.test(p.what))) fail("References (ref@) aren't part of this stand-in.");
    params.forEach((p, i) => env.vars.set(p.who, i < args.length ? this.fitKind(p.what, args[i]) : this.value(p.what, env)));
    try { this.block(f.body.filter((n) => n.root !== "dpm"), env); }
    catch (e) { if (e && e.ret) return e.value; throw e; }
    if (f.kind !== "now") fail(`${f.name} ended without giving back a value.`);
    return NONE;
  }
  isDefault(w) { return !/^[a-z]{3}(@|$)/.test(w) || ["yes"].includes(w); }
  fitKind(kind, v) {
    if (NUM_KINDS.has(kind) && v.k === "dec") return num(v.v);
    if (DEC_KINDS.has(kind) && v.k === "num") return dec(v.v);
    return copy(v);
  }
  make(cls, args, env) {
    const c = this.classes[cls];
    const obj = { k: "obj", cls, f: {}, order: [] };
    const chain = []; for (let k = c; k; k = k.parent ? this.classes[k.parent] : null) chain.unshift(k);
    for (const k of chain) for (const n of k.body) if (n.root === "dfd") { obj.f[n.who] = /^[a-z]{3}(@|$)/.test(n.what) && !["yes"].includes(n.what) ? this.blank(n.what, env) : this.value(n.what, { vars: new Map(), up: null }); obj.order.push(n.who); }
    const ctor = c.body.find((n) => n.root === "dmk");
    if (ctor) this.runCtor(c, ctor, obj, args);
    else if (c.plain && args.length <= obj.order.length) args.forEach((a, i) => { obj.f[obj.order[i]] = this.fit(obj.f[obj.order[i]], copy(a)); });
    else if (args.length) fail(`A ${cls} is made with no values.`);
    else if (c.parent) { const pc = this.classes[c.parent].body.find((n) => n.root === "dmk"); if (pc) this.runCtor(this.classes[c.parent], pc, obj, []); }
    return obj;
  }
  runCtor(c, ctor, obj, args) {
    const f = { name: c.name, kind: "now", body: ctor.kids.filter((n) => !(n.root === "dbs")) };
    const base = ctor.kids.find((n) => n.root === "dbs");
    const env = { vars: new Map(), up: null, self: obj };
    const params = ctor.kids.filter((n) => n.root === "dpm");
    if (args.length > params.length) fail(`A ${c.name} is made with at most ${params.length} values.`);
    params.forEach((p, i) => env.vars.set(p.who, i < args.length ? this.fitKind(p.what, args[i]) : this.value(p.what, env)));
    if (c.parent) {
      const pc = this.classes[c.parent], pctor = pc.body.find((n) => n.root === "dmk");
      if (pctor) this.runCtor(pc, pctor, obj, base ? splitTop(base.what, "&").filter((x) => x !== "now").map((w) => this.value(w, env)) : []);
    }
    this.block(f.body.filter((n) => n.root !== "dpm"), env);
  }
  method(obj, name, args) {
    for (let c = this.classes[obj.cls]; c; c = c.parent ? this.classes[c.parent] : null) {
      const m = c.body.find((n) => (n.root === "dfn" || n.root === "dov" || n.root === "dvr") && n.who === name);
      if (m) return this.invoke({ name, kind: m.what, body: m.kids }, args, obj);
    }
    return fail(`A ${obj.cls} can't ${name}.`);
  }

  /* --- running lines --- */
  tick() { if (++this.steps > 2e6) fail("The program ran too long."); }
  block(lines, env) {
    let i = 0;
    while (i < lines.length) {
      const n = lines[i];
      // An if, and the otherwise lines straight after it, are one choice.
      if (/^i(eq|ne|lt|le|gt|ge)$/.test(n.root)) {
        const chain = [n]; let j = i + 1;
        while (j < lines.length && /^o(eq|ne|lt|le|gt|ge|th)$/.test(lines[j].root)) { chain.push(lines[j]); if (lines[j].root === "oth") { j++; break; } j++; }
        for (const c of chain) if (c.root === "oth" || this.test(c.root.slice(1), c, env)) { this.block(c.kids, this.inner(env)); break; }
        i = j; continue;
      }
      if (/^o(eq|ne|lt|le|gt|ge|th)$/.test(n.root)) this.at_(n, "An otherwise line has to come straight after an if.");
      if (n.root === "btr") {
        const c = lines[i + 1];
        if (!c || c.root !== "bch") this.at_(n, "A try needs a catch straight after it (e bch now).");
        try { this.block(n.kids, this.inner(env)); }
        catch (e) {
          if (!(e instanceof Problem) && !(e instanceof EppError && !e.fatal)) throw e;
          const inner = this.inner(env);
          if (c.who !== "now") inner.vars.set(c.who, e.text !== undefined ? e.text : e.message);
          inner.problem = e;
          this.block(c.kids, inner);
        }
        i += 2; continue;
      }
      if (n.root === "bch") this.at_(n, "A catch has to come straight after a try.");
      this.stmt(n, env);
      i++;
    }
  }
  at_(n, msg) { throw new EppError(msg, n.no); }
  inner(env) { return { vars: new Map(), up: env, self: env.self, consts: new Set() }; }
  test(op, n, env) {
    const a = this.value(n.who, env), b = this.value(n.what, env);
    if (op === "eq") return equal(a, b);
    if (op === "ne") return !equal(a, b);
    const c = cmp(a, b);
    return op === "lt" ? c < 0 : op === "le" ? c <= 0 : op === "gt" ? c > 0 : c >= 0;
  }
  loop(env, body, each, name) {
    // each() → false to stop; returns after the loop ends or breaks.
    while (true) {
      this.tick();
      if (!each()) return;
      try { this.block(body, this.inner(env)); }
      catch (e) {
        if (e && e.brk && (!e.label || e.label === name)) return;
        if (e && e.nxt && (!e.label || e.label === name)) continue;
        throw e;
      }
    }
  }
  stmt(n, env) {
    this.tick();
    const { who, root, what } = n;
    try {
      switch (root) {
        case "is": {
          if (who.includes("&")) fail("Taking a value apart isn't part of this stand-in.");
          const v = copy(this.value(what, env));
          return this.place(who, env).put(v);
        }
        case "mak": case "mgl": {
          const parts = splitTop(what, "&");
          const v = parts.length > 1 ? this.value(what, env) : this.blank(what, env);
          if (root === "mgl") { this.globals.set(who, v); return; }
          env.vars.set(who, v); return;
        }
        case "mkn": env.vars.set(who, copy(this.value(what, env))); env.consts = env.consts || new Set(); env.consts.add(who); return;
        case "add": case "asb": case "aml": case "adv": case "amd": case "apw": {
          const p = this.place(who, env), cur = p.get(), v = this.value(what, env);
          if (root === "add" && cur && cur.k === "vec") { cur.a.push(copy(v)); return; }
          if (root === "add" && cur && (cur.k === "stk" || cur.k === "que")) { cur.a.push(copy(v)); return; }
          if (root === "add" && cur && cur.k === "hep") { cur.a.push(copy(v)); cur.a.sort(cmp); return; }
          if (root === "add" && cur && cur.k === "set") { if (!cur.a.some((x) => equal(x, v))) { cur.a.push(copy(v)); cur.a.sort(cmp); } return; }
          if (root === "add" && typeof cur === "string") { p.put(arith("+", cur, typeof v === "string" ? v : v.k === "ltr" ? v.v : fail("Text joins only with text."))); return; }
          if (root === "apw") { const r = Math.pow(cur.v, v.v); p.put(cur.k === "dec" ? dec(r) : num(r)); return; }
          const r = arith({ add: "+", asb: "-", aml: "*", adv: "/", amd: "%" }[root], cur, v);
          return p.put(r);
        }
        case "lrm": { const l = this.list(who, env), v = this.value(what, env), at = l.a.findIndex((x) => equal(x, v)); if (at >= 0) l.a.splice(at, 1); return; }
        case "ldx": { const l = this.list(who, env), v = this.value(what, env); if (v.v < 0 || v.v >= l.a.length) fail("That position is outside the list."); l.a.splice(v.v, 1); return; }
        case "lin": { const l = this.list(who, env), [p, v] = splitTop(what, "&").map((w) => this.value(w, env)); l.a.splice(p.v, 0, v); return; }
        case "lpl": { const l = this.list(who, env); if (!l.a.length) fail(`The ${l.k === "vec" ? "list" : l.k} is empty.`); if (l.k === "que") l.a.shift(); else l.a.pop(); return; }
        case "lpf": { const l = this.list(who, env); if (!l.a.length) fail("The list is empty."); l.a.shift(); return; }
        case "lso": {
          // lso now sorts smallest first; lso f sorts by a function that says
          // whether its first value goes before its second.
          const l = this.list(who, env);
          if (what === "now") { l.a.sort(cmp); return; }
          const before = (a, b) => truth(this.call(what, [a, b], env));
          l.a.sort((a, b) => (before(a, b) ? -1 : before(b, a) ? 1 : 0));
          return;
        }
        case "lrv": { const l = this.list(who, env); l.a.reverse(); return; }
        case "lwp": { const l = this.list(who, env); if (l.k === "map") l.m.clear(); else l.a.length = 0; return; }
        case "prn": case "put": {
          if (who !== "out" && who !== "err") fail("prn and put write to out or err.");
          const parts = splitTop(what, "&");
          const v = parts.length > 1 && !(/^[A-Za-z_]\w*$/.test(parts[0]) && !this.has(env, parts[0]))
            ? parts.map((w) => show(this.value(w, env))).join(" ") : show(this.value(what, env));
          if (who === "err") return;
          return this.print(v, root === "prn");
        }
        case "get": {
          const p = this.place(who, env), cur = this.has(env, who.split("@")[0]) ? p.get() : "";
          const prompt = this.value(what, env);
          if (typeof prompt !== "string") fail("get asks with a text.");
          this.print(prompt, false);
          if (!this.input.length) fail("The program asked for an answer, and none was given.");
          const ans = this.input.shift();
          this.print(ans, true);
          return p.put(typeof cur === "string" ? ans : this.convert(cur.k, ans));
        }
        case "ieq": case "ine": case "ilt": case "ile": case "igt": case "ige":
        case "oeq": case "one": case "olt": case "ole": case "ogt": case "oge": case "oth":
          return fail("A choice line needs the lines it runs moved in under it.");
        case "flt": case "fle": case "fgt": case "fge": case "fne": {
          const op = root.slice(1);
          const limit = () => this.value(what, env);
          const down = op === "gt" || op === "ge";
          let i = this.has(env, who) ? this.lookup(env, who) : down ? fail(`${who} needs a value to count down from.`) : num(0);
          let first = true;
          return this.loop(env, n.kids, () => {
            if (!first) i = num(i.v + (down ? -1 : 1));
            first = false;
            const c = cmp(i, limit());
            const go = op === "lt" ? c < 0 : op === "le" ? c <= 0 : op === "gt" ? c > 0 : op === "ge" ? c >= 0 : c !== 0;
            if (go) env.vars.set(who, i);
            return go;
          }, who);
        }
        case "fea": {
          const c = this.value(what, env);
          const items = c.k === "vec" || c.k === "set" ? c.a.slice() : typeof c === "string" ? [...c].map(ltr) : c.k === "map" ? mapKeys(c).map((k) => c.m.get(k)) : fail("fea walks through a collection.");
          let i = 0;
          return this.loop(env, n.kids, () => {
            if (c.k === "vec" && i > 0 && i <= c.a.length && env.vars.has(who)) c.a[i - 1] = env.vars.get(who);
            if (i >= items.length) return false;
            const it = items[i++];
            if (c.k === "map") {
              const ks = who.split("&");
              if (ks.length !== 2) fail("A walk through a map names the key and the value: k&v fea m.");
              env.vars.set(ks[0], it.k); env.vars.set(ks[1], it.v);
            } else env.vars.set(who, it);
            return true;
          }, who.split("&")[0]);
        }
        case "weq": case "wne": case "wlt": case "wle": case "wgt": case "wge":
          return this.loop(env, n.kids, () => this.test(root.slice(1), n, env), who);
        case "wfv": return this.loop(env, n.kids, () => true, null);
        case "ebk": case "enx":
          if (what === "now" || truth(this.value(what, env))) throw root === "ebk" ? { brk: true, label: who === "now" ? null : who } : { nxt: true, label: who === "now" ? null : who };
          return;
        case "ert": throw { ret: true, value: copy(this.value(what, env)) };
        case "etw": {
          if (what === "now") { for (let e = env; e; e = e.up) if (e.problem) throw e.problem; fail("now etw now passes a problem on, so it belongs inside a catch."); }
          throw new Problem(show(this.value(what, env)), n.no);
        }
        case "seq": case "sne": case "slt": case "sle": case "sgt": case "sge":
          if (!this.test(root.slice(1), n, env)) { const e = new EppError(`A check failed: ${who} ${root} ${what}.`); e.fatal = true; throw e; }
          return;
        case "bsw": {
          const v = this.value(who, env);
          for (const c of n.kids) {
            if (c.root === "bdf" || (c.root === "bcs" && splitTop(c.what, "&").some((w) => equal(v, this.value(w, env))))) { this.block(c.kids, this.inner(env)); return; }
            if (c.root !== "bcs" && c.root !== "bdf") this.at_(c, "Inside a switch, every line is a case (now bcs 1) or the default (now bdf now).");
          }
          return;
        }
        case "rsd": this.seed = this.value(what, env).v; return;
        case "rwt": return;
        case "hwr": case "hap": {
          const f = this.value(who, env), t = show(this.value(what, env));
          this.files[f] = (root === "hap" ? this.files[f] || "" : "") + t;
          return;
        }
        case "hrm": delete this.files[this.value(who, env)]; return;
        case "dfn": case "dcl": case "dst": return; // read before the program runs
        case "dlm": this.funcs[who] = { name: who, kind: what, body: n.kids }; return;
        default: {
          // A line that runs a function or a method: now f 1, rex bark now.
          if (who === "now" && this.funcs[root]) { this.invoke(this.funcs[root], what === "now" ? [] : splitTop(what, "&").map((w) => this.value(w, env)), null); return; }
          if (who !== "now" && this.has(env, who) && this.lookup(env, who).k === "obj") {
            this.method(this.lookup(env, who), root, what === "now" ? [] : splitTop(what, "&").map((w) => this.value(w, env)));
            return;
          }
          if (who !== "now" && env.self && root in {}) return;
          return fail(`This stand-in doesn't run ${root} yet.`);
        }
      }
    } catch (e) {
      if (e instanceof EppError && e.line === undefined) e.line = n.no;
      if (e instanceof Problem && e.line === undefined) e.line = n.no;
      throw e;
    }
  }
  list(word, env) {
    const l = this.place(word, env).get();
    if (!l || !["vec", "map", "set", "stk", "que", "hep"].includes(l.k)) fail(`${word} isn't a list.`);
    return l;
  }
  run(top) {
    // Functions and classes are read first, so they can be used above where they're written.
    for (const n of top) {
      if (n.root === "dfn") { if (this.funcs[n.who]) throw new EppError(`There are two functions called ${n.who}.`, n.no); this.funcs[n.who] = { name: n.who, kind: n.what, body: n.kids }; }
      if (n.root === "dcl" || n.root === "dst") this.classes[n.who] = { name: n.who, parent: n.what === "now" ? null : n.what, body: n.kids, plain: n.root === "dst" };
    }
    for (const c of Object.values(this.classes)) if (c.parent && !this.classes[c.parent]) throw new EppError(`I don't know a class called ${c.parent}.`, 0);
    const env = { vars: new Map(), up: null, self: null, consts: new Set() };
    this.block(top.filter((n) => n.root !== "dfn" && n.root !== "dcl" && n.root !== "dst"), env);
    if (this.line) { this.out.push(this.line); this.line = ""; }
  }
}

/* ---------- the built-in values (word&value&value) ---------- */

const N = (x) => (isNum(x) ? x : fail("That needs a number."));
const L = (x) => (x && (x.k === "vec" || x.k === "set") ? x : fail("That needs a list."));
const T = (x) => (typeof x === "string" ? x : fail("That needs a text."));
const one = (f) => (a) => { if (a.length !== 1) fail("That takes one value."); return f(a[0]); };
const BUILTIN = {
  cct: one((c) => num(c.k === "map" ? c.m.size : ["stk", "que", "hep"].includes(c.k) ? c.a.length : L(c).a.length)),
  csm: one((c) => L(c).a.reduce((s, x) => arith("+", s, x), num(0))),
  cmx: one((c) => { if (!L(c).a.length) fail("The list is empty."); return c.a.reduce((m, x) => (cmp(x, m) > 0 ? x : m)); }),
  cmn: one((c) => { if (!L(c).a.length) fail("The list is empty."); return c.a.reduce((m, x) => (cmp(x, m) < 0 ? x : m)); }),
  cav: one((c) => { if (!L(c).a.length) fail("The list is empty."); return dec(c.a.reduce((s, x) => s + N(x).v, 0) / c.a.length); }),
  cfr: one((c) => { if (!L(c).a.length) fail("The list is empty."); return c.a[0]; }),
  cla: one((c) => { if (!L(c).a.length) fail("The list is empty."); return c.a[c.a.length - 1]; }),
  cso: one((c) => vec(L(c).a.slice().sort(cmp))),
  crv: one((c) => vec(L(c).a.slice().reverse())),
  chs: (a) => { if (a.length !== 2) fail("chs takes a collection and a value."); const [c, v] = a; return yno(c.k === "map" ? c.m.has(keyOf(v)) : L(c).a.some((x) => equal(x, v))); },
  chm: (a) => num(L(a[0]).a.filter((x) => equal(x, a[1])).length),
  cps: (a) => num(L(a[0]).a.findIndex((x) => equal(x, a[1]))),
  ctx: (a) => L(a[0]).a.map(show).join(T(a[1])),
  tsz: one((s) => num(T(s).length)),
  tuc: one((s) => T(s).toUpperCase()),
  tlc: one((s) => T(s).toLowerCase()),
  trv: one((s) => [...T(s)].reverse().join("")),
  tti: one((s) => T(s).trim()),
  tps: (a) => num(T(a[0]).indexOf(T(a[1]))),
  trp: (a) => T(a[0]).split(T(a[1])).join(T(a[2])),
  ths: (a) => yno(T(a[0]).includes(T(a[1]))),
  tbg: (a) => yno(T(a[0]).startsWith(T(a[1]))),
  ted: (a) => yno(T(a[0]).endsWith(T(a[1]))),
  tcu: (a) => T(a[0]).substr(N(a[1]).v, N(a[2]).v),
  tsp: (a) => vec(T(a[0]).split(T(a[1]))),
  twd: one((s) => vec(T(s).split(/\s+/).filter(Boolean))),
  tnm: one((s) => { const m = T(s).trim().match(/^[-+]?\d+/); if (!m) throw new Problem("invalid stoi argument"); return num(Number(m[0])); }),
  tdc: one((s) => { const m = T(s).trim().match(/^[-+]?\d*\.?\d+/); if (!m) throw new Problem("invalid stod argument"); return dec(Number(m[0])); }),
  nab: one((x) => (N(x).k === "dec" ? dec(Math.abs(x.v)) : num(Math.abs(x.v)))),
  nsq: one((x) => dec(Math.sqrt(N(x).v))),
  ncr: one((x) => dec(Math.cbrt(N(x).v))),
  nro: one((x) => dec(Math.sign(N(x).v) * Math.round(Math.abs(x.v)))),
  ndn: one((x) => dec(Math.floor(N(x).v))),
  nup: one((x) => dec(Math.ceil(N(x).v))),
  npw: (a) => dec(Math.pow(N(a[0]).v, N(a[1]).v)),
  nmx: (a) => (cmp(a[0], a[1]) >= 0 ? a[0] : a[1]),
  nmn: (a) => (cmp(a[0], a[1]) <= 0 ? a[0] : a[1]),
  nfc: one((x) => { let r = 1; for (let i = 2; i <= N(x).v; i++) r *= i; return num(r); }),
  npe: one((x) => { const n = N(x).v; if (n < 2) return yno(false); for (let i = 2; i * i <= n; i++) if (n % i === 0) return yno(false); return yno(true); }),
  ngd: (a) => { let x = Math.abs(N(a[0]).v), y = Math.abs(N(a[1]).v); while (y) [x, y] = [y, x % y]; return num(x); },
  nhy: (a) => dec(Math.hypot(N(a[0]).v, N(a[1]).v)),
  iff: (a) => { if (a.length !== 3) fail("iff takes a test and two values."); return truth(a[0]) ? a[1] : a[2]; },
  hrd: one((f, it) => f),
  hex: one((f) => f),
};
// Files live in the interpreter, so these need it.
BUILTIN.hrd = (a, it) => { const f = T(a[0]); if (!(f in it.files)) throw new Problem(`There is no file called ${f}.`); return it.files[f]; };
BUILTIN.hex = (a, it) => yno(T(a[0]) in it.files);
BUILTIN.hln = (a, it) => { const f = T(a[0]); if (!(f in it.files)) throw new Problem(`There is no file called ${f}.`); return vec(it.files[f].split("\n").filter((x, i, arr) => !(x === "" && i === arr.length - 1))); };

function checkProgram(code) {
  try { read(code); return ""; } catch (e) { if (e instanceof EppError) return `line ${e.line}: ${e.message}`; throw e; }
}

function run(code, opts = {}) {
  let top;
  try { top = read(code); } catch (e) { if (e instanceof EppError) return { ok: false, stdout: "", error: `line ${e.line}: ${e.message}` }; throw e; }
  const it = new Interp(opts);
  try { it.run(top); }
  catch (e) {
    if (it.line) it.out.push(it.line);
    if (e instanceof EppError || e instanceof Problem) {
      const src = code.split("\n")[(e.line || 1) - 1] || "";
      return { ok: false, stdout: it.out.join("\n"), error: `The program stopped on line ${e.line}:\n${src.trim()}\n${e.text !== undefined ? e.text : e.message}` };
    }
    if (e && (e.brk || e.nxt)) return { ok: false, stdout: it.out.join("\n"), error: "ebk and enx belong inside a loop." };
    if (e && e.ret) return { ok: false, stdout: it.out.join("\n"), error: "ert belongs inside a function." };
    if (e instanceof RangeError) return { ok: false, stdout: it.out.join("\n"), error: "The program called itself too deeply for this stand-in." };
    throw e;
  }
  return { ok: true, stdout: it.out.length ? it.out.join("\n") + "\n" : "", files: it.files };
}

// A whole program is in this form if its lines (notes aside) are three-word lines.
function isThreeWordProgram(code) {
  const rows = code.split("\n").map((l) => l.trim()).filter((l) => l && !/^note( |$)/.test(l));
  return rows.length > 0 && rows.every((l) => { const w = words(l); return w && w.length === 3; }) && rows.some(looksThreeWord);
}

module.exports = { looksThreeWord, check, checkProgram, run, isThreeWordProgram, ROOTS, g6 };
