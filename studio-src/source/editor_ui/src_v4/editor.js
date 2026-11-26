// English++ Web Studio — the editor bundle (CodeMirror 6 + the English++ mode).
// English++ is Vewu's language; this file only highlights and helps type it. Nothing here changes what a line means.
// v2: three-word-aware suggestions (Enter never picks a word for you), auto-indent, Blocks, ghost guess,
//     names scan, go to definition, rename, outline, note toggle.
// v4: breakpoints in the gutter + the paused line (debugger), fix-it actions on diagnostics, big-program speed
//     (words cached per line text, names/libs cached per document, the engine check waits for a pause in typing).
import { EditorState, EditorSelection, StateEffect, StateField, RangeSetBuilder, RangeSet, Compartment, Prec, Transaction } from "@codemirror/state";
import {
  EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection,
  Decoration, ViewPlugin, WidgetType, hoverTooltip, highlightSpecialChars, dropCursor, gutter, GutterMarker
} from "@codemirror/view";
import { history, defaultKeymap, historyKeymap, indentLess, indentMore, undo, redo } from "@codemirror/commands";
import { indentUnit, bracketMatching } from "@codemirror/language";
import {
  autocompletion, closeBrackets, closeBracketsKeymap, startCompletion, closeCompletion, acceptCompletion,
  moveCompletionSelection, completionStatus, selectedCompletionIndex, setSelectedCompletion, snippet,
  nextSnippetField, prevSnippetField, hasNextSnippetField, hasPrevSnippetField, clearSnippet
} from "@codemirror/autocomplete";
import { linter, lintGutter, setDiagnostics, forceLinting, forEachDiagnostic } from "@codemirror/lint";
import { searchKeymap, highlightSelectionMatches, openSearchPanel, closeSearchPanel, searchPanelOpen } from "@codemirror/search";
import { ROOT_USE } from "./usage.js";
import { cppApi, setCppData, isCppName } from "./cpp_mode.js";

// ---------- data (set by the page from data/epp-studio/*.json) ----------
const D = {
  roots: new Map(), values: new Map(), kinds: new Map(), special: new Map(),
  raylib: new Map(), qt: new Map(), families: {}
};
export function setData(data) {
  D.families = data.families || {};
  for (const w of data.words || []) (w.type === "value" ? D.values : D.roots).set(w.word, w);
  for (const k of data.kinds || []) D.kinds.set(k.word, k);
  for (const s of data.special || []) D.special.set(s.word, s);
  for (const r of data.raylib || []) D.raylib.set(r.name, r);
  for (const q of data.qt || []) D.qt.set(q.name, q);
  for (const [w, r] of D.roots) if (r.block) BLOCK.add(w);
}

// ---------- block shapes (engine build.cpp BlockRoots(); same as roots.json block:true) ----------
const BLOCK = new Set(("ieq ine ilt ile igt ige oeq one olt ole ogt oge oth weq wne wlt wle wgt wge wfv wln " +
  "flt fle fgt fge fne fea fpr bdo bsw bcs bdf btr bch blk bbl bdr bts " +
  "dfn dcx dcl dst dun dgr dlm dlv dmk dds dvr dov dsf dhd dfy dkn dop").split(" "));
const ELSE = new Set(["oth", "oeq", "one", "olt", "ole", "ogt", "oge"]);
const UNTIL = new Set(["ueq", "une", "ult", "ule", "ugt", "uge"]);
const isIfRoot = r => /^i[a-z]{2}$/.test(r) && r !== "iff" && BLOCK.has(r);
export function opensBlock(text) {
  if (/^\s*note(\s|$)/.test(text)) return false;
  const w = splitWords(text);
  return w.length >= 2 && BLOCK.has(w[1].text);
}
const lead = s => s.match(/^ */)[0].length;

// ---------- tokenising one line ----------
// Words are split by spaces, except inside "quotes".
const WORD_RE = /(?:"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|[^\s"'])+/g;
function splitWords0(text) {
  const out = []; let m; WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(text))) out.push({ text: m[0], from: m.index, to: m.index + m[0].length });
  return out;
}
// v4: the same line text always splits the same way, so a 15,000-line program only re-splits the lines that changed.
// (Callers only read the result; it is frozen so nothing can change a cached copy by accident.)
const WORDS = new Map();
export function splitWords(text) {
  let r = WORDS.get(text);
  if (r) return r;
  r = Object.freeze(splitWords0(text));
  if (WORDS.size > 80000) WORDS.clear();
  WORDS.set(text, r);
  return r;
}
const DEF_ROOTS = new Set(["is", "mak", "mkn", "mgl", "mpt", "mrf", "mlo", "mnw", "mwn", "msh", "mtd", "msy", "mfi", "mfo", "mmv", "msv", "mtl",
  "dfn", "dcl", "dst", "den", "dlm", "dgr", "dun", "dpm", "dfd", "dtp", "dal", "dvr", "dov", "dmb", "dop", "dcx", "dsc", "dfm", "dsh", "dmk", "dbs", "dds", "dsf", "dhd", "dfy", "dkn", "dlv", "dbb"]);
function famOf(root) {
  const r = D.roots.get(root);
  if (!r) return null;
  return r.family || "is";
}
// Returns [{from,to,cls}] for one line (offsets within the line).
export function tokenizeLine(text, libs) {
  const toks = [];
  const lead0 = text.match(/^\s*/)[0].length;
  const body = text.slice(lead0);
  if (!body) return toks;
  if (/^note(\s|$)/.test(body)) { toks.push({ from: lead0, to: text.length, cls: "epp-note" }); return toks; }
  const words = splitWords(text);
  words.forEach((w, i) => {
    if (i === 1) {
      const f = famOf(w.text);
      if (f) { toks.push({ from: w.from, to: w.to, cls: "epp-root epp-f-" + f }); return; }
      if (libs.raylib && D.raylib.has(w.text)) { toks.push({ from: w.from, to: w.to, cls: "epp-lib" }); return; }
      if (libs.qt && D.qt.has(w.text)) { toks.push({ from: w.from, to: w.to, cls: "epp-qt" }); return; }
      if (D.raylib.has(w.text)) { toks.push({ from: w.from, to: w.to, cls: "epp-lib" }); return; }
      if (D.qt.has(w.text)) { toks.push({ from: w.from, to: w.to, cls: "epp-qt" }); return; }
      toks.push({ from: w.from, to: w.to, cls: "epp-unknown-root" });
      return;
    }
    subTokens(w.text, w.from, i, toks);
  });
  return toks;
}
const PART_RE = /"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|[&@]|[^\sA-Za-z_0-9"'&@]+/g;
function subTokens(word, base, idx, toks) {
  let m; const parts = []; PART_RE.lastIndex = 0;
  while ((m = PART_RE.exec(word))) parts.push({ t: m[0], from: base + m.index, to: base + m.index + m[0].length });
  parts.forEach((p, j) => {
    const t = p.t, next = parts[j + 1], prev = parts[j - 1];
    let cls = null;
    if (t[0] === '"' || t[0] === "'") cls = "epp-str";
    else if (/^-?\d/.test(t)) cls = "epp-num";
    else if (t === "&" || t === "@") cls = "epp-punct";
    else if (/^[A-Za-z_]/.test(t)) {
      const afterAt = prev && prev.t === "@";
      if (D.special.has(t) && !afterAt) cls = "epp-special";
      else if (D.values.has(t) && next && next.t === "&") cls = "epp-value epp-f-" + D.values.get(t).family;
      else if (D.kinds.has(t) && (idx === 2 || afterAt || (next && next.t === "@"))) cls = "epp-kind";
      else if (D.raylib.has(t)) cls = "epp-lib";
      else if (D.qt.has(t)) cls = "epp-qt";
      else if (idx === 0) cls = "epp-who";
    } else cls = "epp-op";
    if (cls) toks.push({ from: p.from, to: p.to, cls });
  });
}
const LIBS = new WeakMap();
export function libsOf(doc) {
  if (typeof doc !== "string" && LIBS.has(doc)) return LIBS.get(doc);
  let r;
  if (typeof doc === "string") r = { raylib: /^\s*now\s+xlb\s+raylib\b/m.test(doc), qt: /^\s*now\s+xlb\s+qt\b/mi.test(doc) };
  else {   // v4: walk the lines (no whole-document string); only lines that say xlb can change the answer
    r = { raylib: false, qt: false };
    for (const it = doc.iter(); !it.next().done;) {
      const t = it.value; if (t.indexOf("xlb") < 0) continue;
      if (/^\s*now\s+xlb\s+raylib\b/.test(t)) r.raylib = true;
      if (/^\s*now\s+xlb\s+qt\b/i.test(t)) r.qt = true;
    }
    LIBS.set(doc, r);
  }
  return r;
}
// v1 API kept: name -> the root that made it
export function namesOf(src) {
  const names = new Map();
  for (const n of scanNames(src, "")) if (!names.has(n.name)) names.set(n.name, n.root);
  return names;
}

// ---------- the names scan: every name the program makes, with its kind and line ----------
const KIND_OF = {
  vec: "list", lst: "list", dqu: "list", arr: "list", stk: "stack", que: "queue", hep: "heap", mhp: "heap",
  map: "map", hsh: "map", set: "set", bag: "set", par: "pair", tup: "tuple", opt: "maybe", alt: "one-of",
  txt: "text", ltr: "letter", num: "number", big: "number", sml: "number", pos: "number", byt: "number", pbg: "number", hug: "number",
  dec: "decimal", flo: "decimal", cpx: "complex", yno: "yes-no", any: "value", fun: "function value",
  own: "pointer", shr: "pointer", ptr: "pointer", mtx: "mutex", atm: "atomic", thd: "thread", fut: "future", gnr: "generator",
  chn: "channel", cnd: "signal", ifs: "file in", ofs: "file out", jsn: "json", sck: "socket", srv: "server"
};
const COLLECTION = new Set(["list", "stack", "queue", "heap", "map", "set"]);
const FN_ROOTS = new Set(["dfn", "dcx", "dlm", "dlv", "dsf"]);
const METHOD_ROOTS = new Set(["dvr", "dov", "dmb", "dhd", "dfy", "dkn"]);
const FIELD_ROOTS = new Set(["dfd", "dbb", "dsc", "dfm", "dsh"]);
const CLASS_ROOTS = new Set(["dcl", "dst", "dun"]);
const NUMWORD = /^-?\d+$/, DECWORD = /^-?\d+\.\d*$/;
function kindOfKindWord(w, classes) {
  const base = (w.match(/^[A-Za-z_][A-Za-z_0-9]*/) || [""])[0];
  if (KIND_OF[base]) return { kind: KIND_OF[base] };
  if (classes && classes.has(base)) return { kind: "thing", cls: base };
  if (/^[A-Z]/.test(base)) return { kind: "thing", cls: base };
  return { kind: "value" };
}
function valueKind(w3, known, classes) {
  if (!w3) return { kind: "value" };
  if (w3[0] === '"') return { kind: "text" };
  if (w3[0] === "'") return { kind: "letter" };
  if (NUMWORD.test(w3)) return { kind: "number" };
  if (DECWORD.test(w3)) return { kind: "decimal" };
  if (w3 === "yes" || w3 === "nay") return { kind: "yes-no" };
  if (w3 === "nil") return { kind: "pointer" };
  const head = (w3.match(/^[A-Za-z_][A-Za-z_0-9]*/) || [""])[0];
  if (/&/.test(w3)) {
    if (head && D.kinds.has(head) && KIND_OF[head]) return { kind: KIND_OF[head] };
    if (head && (D.values.has(head) || D.raylib.has(head) || D.qt.has(head) || (known.get(head) && /function/.test(known.get(head).kind)))) return { kind: "value" };
    if (head && w3[head.length] === "&" && !known.has(head) && !/^[0-9"'-]/.test(w3)) return { kind: "value" };
    return { kind: "list" };
  }
  if (head && head === w3 && known.get(head)) { const k = known.get(head); return { kind: k.kind, cls: k.cls }; }
  if (/^-?[\d.]+$/.test(w3)) return { kind: "number" };
  if (/^[-\d+*\/%() ]+$/.test(w3)) return { kind: "number" };
  return { kind: "value" };
}
// -> [{name, kind, cls, root, line, file, owner}] in file order
export function scanNames(src, file) {
  const out = [], known = new Map(), classes = new Set();
  const lines = src.split("\n");
  // classes first (definitions can be in any order)
  for (const l of lines) { const w = splitWords(l); if (w.length >= 2 && CLASS_ROOTS.has(w[1].text)) classes.add(w[0].text); }
  const stack = []; // [{indent, cls}] open class blocks
  lines.forEach((line, i) => {
    const body = line.trim();
    if (!body || /^note(\s|$)/.test(body)) return;
    const ind = lead(line);
    while (stack.length && stack[stack.length - 1].indent >= ind) stack.pop();
    const owner = stack.length ? stack[stack.length - 1].cls : null;
    const w = splitWords(line);
    if (w.length < 2) return;
    const w1 = w[0].text, r = w[1].text, w3 = w[2] ? w[2].text : "";
    const add = (name, kind, extra) => {
      if (!/^[A-Za-z_][A-Za-z_0-9]*$/.test(name) || D.special.has(name)) return;
      const rec = Object.assign({ name, kind, root: r, line: i + 1, file, owner }, extra || {});
      out.push(rec); if (!known.has(name)) known.set(name, rec);
    };
    if (CLASS_ROOTS.has(r)) { add(w1, r === "dst" ? "struct" : r === "dun" ? "union" : "class", { parent: w3 !== "now" ? w3 : null }); stack.push({ indent: ind, cls: w1 }); return; }
    if (r === "is" || r === "mgl" || r === "mmv" || r === "msv" || r === "mtl") {
      if (known.has(w1)) return; // changing it, not making it
      const k = valueKind(w3, known, classes); add(w1, k.kind, { cls: k.cls }); return;
    }
    if (r === "mkn") { const k = valueKind(w3, known, classes); add(w1, "constant", { of: k.kind }); return; }
    if (r === "mak" || r === "mnw" || r === "mwn" || r === "msh") { const k = kindOfKindWord(w3, classes); add(w1, r === "mak" ? k.kind : "pointer", { cls: k.cls }); return; }
    if (r === "mpt") { add(w1, "pointer"); return; }
    if (r === "mrf" || r === "mlo") { add(w1, "reference"); return; }
    if (r === "mtd" || r === "msy") { add(w1, "thread"); return; }
    if (r === "mfi") { add(w1, "file in"); return; }
    if (r === "mfo") { add(w1, "file out"); return; }
    if (FN_ROOTS.has(r)) { add(w1, owner ? "method" : "function", { gives: w3 }); stack.length && owner ? null : null; return; }
    if (METHOD_ROOTS.has(r)) { add(w1, "method", { gives: w3 }); return; }
    if (FIELD_ROOTS.has(r)) { const k = /^[a-z]{3}/.test(w3) && KIND_OF[w3] ? { kind: KIND_OF[w3] } : valueKind(w3, known, classes); add(w1, owner ? "field" : "variable", { of: k.kind }); return; }
    if (r === "dpm") { const k = KIND_OF[w3] ? { kind: KIND_OF[w3] } : kindOfKindWord(w3, classes); add(w1, "parameter", { of: k.kind, cls: k.cls }); return; }
    if (r === "den") { add(w1, "choice kind"); for (const v of w3.split("&")) add(v, "choice", { of: w1 }); return; }
    if (r === "dgr") { add(w1, "group"); return; }
    if (r === "dtp" || r === "dal") { add(w1, "kind name"); return; }
    if (r === "fea" || r === "fpr") { for (const v of w1.split("&")) add(v, "loop item"); return; }
    if (r === "flt" || r === "fle" || r === "fne") { if (!known.has(w1)) add(w1, "counter"); return; }
    if (r === "wln" || r === "gln") { if (!known.has(w1)) add(w1, "text"); return; }
    if (r === "get") { if (!known.has(w1)) add(w1, "value"); return; }
    if (r === "bch" && w1 !== "now") { add(w1, "error"); return; }
  });
  return out;
}
// what a name's kind looks like in a short label
function kindLabel(n) {
  if (n.kind === "function") return "your function";
  if (n.kind === "method") return "method" + (n.owner ? " of " + n.owner : "");
  if (n.kind === "class" || n.kind === "struct" || n.kind === "union") return "your " + n.kind;
  if (n.kind === "field") return "field · " + (n.of || "value") + (n.owner ? " · " + n.owner : "");
  if (n.kind === "parameter") return "parameter · " + (n.cls || n.of || "value");
  if (n.kind === "constant") return "constant · " + (n.of || "value");
  if (n.kind === "thing") return "variable · a " + (n.cls || "thing");
  return "variable · " + n.kind;
}

// ---------- highlighter ----------
const markCache = new Map();
function mark(cls) { let d = markCache.get(cls); if (!d) { d = Decoration.mark({ class: cls }); markCache.set(cls, d); } return d; }
// v4: an edit that touches no "xlb" line keeps the libraries answer (no whole-document walk per keystroke)
const libsCarry = StateField.define({
  create: () => 0,
  update(v, tr) {
    if (!tr.docChanged || !LIBS.has(tr.startState.doc)) return v;
    const a = tr.startState.doc, b = tr.newDoc; let touch = false;
    tr.changes.iterChangedRanges((fA, tA, fB, tB) => {
      if (touch) return;
      if (a.sliceString(a.lineAt(fA).from, a.lineAt(tA).to).indexOf("xlb") >= 0 || b.sliceString(b.lineAt(fB).from, b.lineAt(tB).to).indexOf("xlb") >= 0) touch = true;
    });
    if (!touch) LIBS.set(b, LIBS.get(a));
    return v;
  }
});
// ---------- v4 debugger: breakpoints (red dots in their own gutter; tap a line number or the dot) + the paused line ----------
const bpEffect = StateEffect.define({ map: (v, m) => ({ pos: m.mapPos(v.pos), on: v.on }) });
const bpClearEffect = StateEffect.define();
const bpMarker = new (class extends GutterMarker {
  toDOM() { const d = document.createElement("span"); d.className = "epp-bp-dot"; d.setAttribute("aria-hidden", "true"); return d; }
})();
const bpSpacer = new (class extends GutterMarker { toDOM() { const d = document.createElement("span"); d.className = "epp-bp-space"; return d; } })();
const bpField = StateField.define({
  create: () => RangeSet.empty,
  update(set, tr) {
    set = set.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(bpClearEffect)) set = RangeSet.empty;
      else if (e.is(bpEffect)) {
        set = set.update({ filter: from => from !== e.value.pos });
        if (e.value.on) set = set.update({ add: [bpMarker.range(e.value.pos)] });
      }
    }
    return set;
  }
});
export function breakpointLines(state) {
  const f = state.field(bpField, false); if (!f) return [];
  const out = new Set();
  for (const it = f.iter(); it.value; it.next()) out.add(state.doc.lineAt(it.from).number);
  return [...out].sort((x, y) => x - y);
}
function toggleBreakpointAt(view, pos) {
  const line = view.state.doc.lineAt(pos);
  const on = !breakpointLines(view.state).includes(line.number);
  view.dispatch({ effects: bpEffect.of({ pos: line.from, on }) });
  return on;
}
const debugLineEffect = StateEffect.define();
const debugLineField = StateField.define({
  create: () => 0,
  update(v, tr) { for (const e of tr.effects) if (e.is(debugLineEffect)) v = e.value; if (v && tr.docChanged && v > tr.newDoc.lines) v = 0; return v; }
});
const pausedLine = Decoration.line({ class: "epp-paused" });
const debugLineDeco = EditorView.decorations.compute([debugLineField, "doc"], st => {
  const n = st.field(debugLineField); if (!n || n > st.doc.lines) return Decoration.none;
  return Decoration.set([pausedLine.range(st.doc.line(n).from)]);
});
const pausedMarker = new (class extends GutterMarker { toDOM() { const d = document.createElement("span"); d.className = "epp-paused-arrow"; d.textContent = "▶"; d.setAttribute("aria-hidden", "true"); return d; } })();
const runLineEffect = StateEffect.define();
const runLineField = StateField.define({
  create: () => 0,
  update(v, tr) { for (const e of tr.effects) if (e.is(runLineEffect)) v = e.value; return v; }
});
const highlighter = ViewPlugin.fromClass(class {
  constructor(view) { this.decorations = this.build(view); }
  update(u) {
    if (u.docChanged || u.viewportChanged || u.transactions.some(t => t.effects.some(e => e.is(runLineEffect))))
      this.decorations = this.build(u.view);
  }
  build(view) {
    const b = new RangeSetBuilder();
    const doc = view.state.doc, libs = libsOf(doc);
    const runLine = view.state.field(runLineField);
    for (const { from, to } of view.visibleRanges) {
      let line = doc.lineAt(from);
      while (true) {
        if (runLine && line.number === runLine) b.add(line.from, line.from, Decoration.line({ class: "epp-running" }));
        for (const t of tokenizeLine(line.text, libs)) b.add(line.from + t.from, line.from + t.to, mark(t.cls));
        if (line.to >= to || line.number >= doc.lines) break;
        line = doc.line(line.number + 1);
      }
    }
    return b.finish();
  }
}, { decorations: v => v.decorations });

// ---------- the three-word check (instant, in the editor) ----------
export const THREE_HINT = "A line is exactly three words: who, root, what.";
export function localErrors(src) {
  const errs = [];
  src.split("\n").forEach((line, i) => {
    const body = line.trim();
    if (!body || /^note(\s|$)/.test(body)) return;
    const n = splitWords(line).length;
    if (n !== 3) errs.push({ line: i + 1, message: THREE_HINT + " This line has " + n + " word" + (n === 1 ? "" : "s") + ".", local: true });
    else if (/\t/.test(line.match(/^\s*/)[0])) errs.push({ line: i + 1, message: "Use two spaces to indent, not a tab.", local: true });
  });
  return errs;
}
function toDiag(doc, e, severity, source) {
  const n = Math.max(1, Math.min(doc.lines, e.line | 0 || 1));
  const line = doc.line(n);
  const lead0 = line.text.match(/^\s*/)[0].length;
  const from = line.from + Math.min(lead0, line.length), to = Math.max(from, line.to);
  return { from, to: to === from ? Math.min(doc.length, from + 1) : to, severity, message: e.message, source };
}

// ---------- suggestions: the three-word line tells us exactly what kind of word comes next ----------
// Matching: prefix first (case-insensitive, exact case a little higher), then letters-in-order ("fuzzy").
function matchLabel(label, p) {
  if (!p) return { tier: 2, ranges: [] };
  if (label.startsWith(p)) return { tier: 3, ranges: [0, p.length] };
  if (label.toLowerCase().startsWith(p.toLowerCase())) return { tier: 2, ranges: [0, p.length] };
  const L = label.toLowerCase(), q = p.toLowerCase();
  if (L[0] !== q[0]) return null;
  const ranges = []; let j = 0;
  for (let i = 0; i < L.length && j < q.length; i++) if (L[i] === q[j]) { ranges.push(i, i + 1); j++; }
  return j === q.length ? { tier: 1, ranges } : null;
}
function shortSays(s, n) { s = String(s || ""); return s.length > (n || 26) ? s.slice(0, (n || 26) - 1) + "…" : s; }
// which "who" descriptions (Chart column "First word") fit a word-1 name of this kind
function whoFits(kind, isNew) {
  if (isNew) return w => /^(a name|its name|a counter|a name, or names with &|a text|a thing|a value)$/.test(w);
  if (COLLECTION.has(kind)) return w => /collection|^a thing$/.test(w);
  if (kind === "text") return w => /^(a text|a value|a thing|a name)$/.test(w);
  if (kind === "thread") return w => /thread/.test(w);
  if (kind === "mutex") return w => /mutex/.test(w);
  if (kind === "file in" || kind === "file out") return w => /file/.test(w);
  if (kind === "function" || kind === "method") return w => /function's name|^its name$/.test(w);
  if (kind === "class" || kind === "struct") return w => /class's name|^its name$|parent/.test(w);
  return w => /^(a value|a thing|a name|a counter|a counter you made)$/.test(w);
}
// what a root wants as word 3 (Chart column "Third word")
function whatWants(rootWord) {
  const r = D.roots.get(rootWord);
  const what = r ? (r.what || "") : "";
  if (/collection/.test(what)) return "collection";
  if (/^now$/.test(what)) return "now";
  if (/kind/.test(what)) return "kind";
  if (/function/.test(what)) return "function";
  if (/text|file name|question/.test(what)) return "text";
  if (/whole number|how many|milliseconds/.test(what)) return "number";
  return "value";
}
const NUMBERISH = new Set(["number", "decimal", "counter", "constant", "loop item", "value", "parameter", "field", "variable"]);
function nameFitsWant(n, want) {
  if (want === "collection") return COLLECTION.has(n.kind) || (n.kind === "parameter" && COLLECTION.has(n.of));
  if (want === "kind") return n.kind === "class" || n.kind === "struct" || n.kind === "union" || n.kind === "kind name" || n.kind === "choice kind";
  if (want === "function") return n.kind === "function" || n.kind === "method";
  if (want === "text") return n.kind === "text" || n.kind === "letter" || n.kind === "value" || n.kind === "loop item" || (n.kind === "parameter" && n.of === "text");
  if (want === "number") return NUMBERISH.has(n.kind) && n.kind !== "text";
  if (want === "now") return false;
  return !(n.kind === "class" || n.kind === "struct" || n.kind === "union" || n.kind === "kind name" || n.kind === "choice kind" || n.kind === "group");
}

// The ranking. Returns {from, prefix, list:[{label,detail,score,ranges,kind,word,...}]} or null.
export function rankAt(state, pos, explicit, env) {
  const line = state.doc.lineAt(pos);
  const before = line.text.slice(0, pos - line.from);
  if (/^\s*note(\s|$)/.test(before) && /^\s*note\s/.test(before)) return null;
  if ((before.match(/"/g) || []).length % 2 === 1) return null; // inside a quote
  const words = splitWords(before);
  const endsSpace = /\s$/.test(before) || before.trim() === "";
  const idx = endsSpace ? words.length : words.length - 1;
  if (idx > 2) return null;
  const m = before.match(/[A-Za-z_][A-Za-z_0-9]*$/);
  const prefix = m ? m[0] : "";
  const from = pos - prefix.length;
  const charBefore = before[before.length - prefix.length - 1] || "";
  if (!prefix && !explicit && !/[&@]/.test(charBefore) && !(endsSpace && (idx === 1 || idx === 2))) return null;
  if (prefix && /[0-9]/.test(before[before.length - prefix.length - 1] || "")) return null; // part of a number
  const libs = libsOf(state.doc);
  const lineNo = line.number;
  const all = env.names(state); // [{...rec}] this file first, then others
  // nearest-first: lines above the cursor in this file (closest first), then below, then other files
  const byName = new Map();
  for (const n of all) {
    let dist;
    if (n.here) dist = n.line < lineNo ? (lineNo - n.line) : n.line === lineNo ? 1e5 : 5e4 + (n.line - lineNo);
    else dist = 2e5 + n.line;
    const prev = byName.get(n.name);
    if (!prev || dist < prev.dist) byName.set(n.name, Object.assign({}, n, { dist }));
  }
  // never suggest the name being typed right now as its own definition on this line
  const names = [...byName.values()].filter(n => !(n.here && n.line === lineNo && n.name === prefix && n.dist === 1e5));
  const list = [];
  const push = (label, detail, score, extra) => {
    const mm = matchLabel(label, prefix); if (!mm) return;
    let s = mm.tier * 1e6 + score;
    if (label === prefix) s += 5e6; // exactly what you typed: always first
    list.push(Object.assign({ label, detail, score: s, ranges: mm.ranges }, extra || {}));
  };
  const recency = n => Math.max(0, 900 - Math.min(900, n.dist < 1e5 ? n.dist * 3 : 600 + n.dist / 1e3));
  const w1 = words[0] ? words[0].text : "", w2 = words[1] ? words[1].text : "";
  const used = env.usage(state, lineNo); // roots this program uses: {count:Map, last:Map(root->line), withWho:Map("who root")}
  if (idx === 0 && charBefore === "@") {
    fieldsAfterAt(before.slice(0, before.length - prefix.length - 1), names, push);
  } else if (idx === 0) {
    for (const n of names) {
      if (n.kind === "field" || n.kind === "choice") continue;
      push(n.name, kindLabel(n), 30000 + recency(n), { kind: "name", rec: n });
    }
    const SP = { out: 2600, now: 2500, err: 600, inp: 500, slf: 400 };
    for (const s of ["out", "now", "err", "inp", "slf"]) push(s, "word · " + shortSays(D.special.get(s) ? D.special.get(s).says : ""), 20000 + SP[s], { kind: "special", word: s });
    push("note", "word · a note line", 19000, { kind: "special" });
  } else if (idx === 1) {
    // word 2 = the root. What is word 1?
    const who = names.find(n => n.name === w1);
    const isSpecial = D.special.has(w1);
    const isNew = !who && !isSpecial && /^[A-Za-z_]/.test(w1);
    const fits = isSpecial ? (w1 === "out" || w1 === "err" ? (w => /out, err/.test(w)) : w1 === "now" ? (w => /^now|or now$/.test(w)) : (w => /^a thing$|^inp/.test(w)))
      : whoFits(who ? who.kind : "", isNew);
    for (const [w, r] of D.roots) {
      let s = Math.log2(2 + (ROOT_USE[w] || 0)) * 100; // Book usage
      const c = used.count.get(w) || 0;
      s += Math.min(c, 8) * 80; // used in this program
      if (used.last.has(w)) s += Math.max(0, 400 - (lineNo - used.last.get(w)) * 10); // used just above
      if (used.withWho.has(w1 + " " + w)) s += 900; // you already used this root with this name
      const fit = fits(r.who || "");
      if (fit) s += 4000;
      push(w, "root · " + shortSays(r.says), 10000 + s, { kind: "root", word: w, fit });
    }
    // a thing made from your class: its methods are word 2
    if (who && who.cls) for (const n of names) if (n.kind === "method" && n.owner === who.cls) push(n.name, "method of " + who.cls, 16000, { kind: "name", rec: n });
    if (w1 === "now") {
      if (libs.raylib) for (const [n, r] of D.raylib) if (r.kind === "function") push(n, "raylib function", 9000 + (used.count.get(n) ? 3000 : 0), { kind: "raylib", word: n });
      if (libs.qt) for (const [n] of D.qt) push(n, "Qt function", 9500, { kind: "qt", word: n });
      for (const n of names) if (n.kind === "function") push(n.name, "your function", 14500, { kind: "name", rec: n });
    } else if (libs.raylib && prefix.length >= 2) for (const [n, r] of D.raylib) if (r.kind === "function") push(n, "raylib function", 3000, { kind: "raylib", word: n });
  } else {
    // word 3 (or a part of it after & or an operator)
    if (charBefore === "@") { fieldsAfterAt(before.slice(0, before.length - prefix.length - 1), names, push); }
    else {
      const rootIsLib = !D.roots.has(w2) && (D.raylib.has(w2) || D.qt.has(w2));
      const want = rootIsLib ? "value" : whatWants(w2);
      const rw = D.roots.get(w2);
      const orNow = rw && /now/.test(rw.what || "");
      for (const n of names) {
        if (n.kind === "field" && charBefore !== "@") continue;
        if (n.here && n.line === lineNo && n.name === w1 && DEF_ROOTS.has(w2)) continue; // x is x? no
        const fit = nameFitsWant(n, want);
        push(n.name, kindLabel(n), (fit ? 30000 : 15000) + recency(n), { kind: "name", rec: n, fit });
      }
      if (want === "kind" || want === "collection" && false) for (const [w, k] of D.kinds) push(w, "kind · " + shortSays(k.says), 26000 - (["num", "txt", "dec", "vec", "yno", "map"].indexOf(w) < 0 ? 500 : 0), { kind: "kind", word: w });
      else for (const [w, k] of D.kinds) push(w, "kind · " + shortSays(k.says), 6000, { kind: "kind", word: w });
      for (const [w, r] of D.values) push(w, "value · " + shortSays(r.says), want === "collection" ? 5000 : 12000 + Math.min(500, (used.count.get(w) || 0) * 60), { kind: "value", word: w });
      for (const s of ["now", "yes", "nay", "nil", "inp", "slf"]) {
        let sc = 11000; if (s === "now" && (want === "now" || orNow)) sc = 40000; if (s === "inp" && /inp/.test(rw ? rw.what || "" : "")) sc = 29000;
        push(s, "word · " + shortSays(D.special.get(s).says), sc, { kind: "special", word: s });
      }
      if (libs.raylib) for (const [n, r] of D.raylib) push(n, "raylib " + r.kind, r.kind === "color" ? 8000 : r.kind === "function" ? 7000 : 6500, { kind: "raylib", word: n });
      if (libs.qt) for (const [n] of D.qt) push(n, "Qt function", 6500, { kind: "qt", word: n });
    }
  }
  if (!list.length) return null;
  list.sort((a, b) => b.score - a.score || (a.label < b.label ? -1 : 1));
  const seen = new Set(), outL = [];
  for (const o of list) { if (seen.has(o.label)) continue; seen.add(o.label); outL.push(o); if (outL.length >= 60) break; }
  return { from, to: pos, prefix, idx, list: outL };
}
function fieldsAfterAt(left, names, push) {
  const base = (left.match(/[A-Za-z_][A-Za-z_0-9]*$/) || [""])[0];
  if (D.kinds.has(base)) { for (const [w, k] of D.kinds) push(w, "kind · " + shortSays(k.says), 20000, { kind: "kind", word: w }); return; }
  const who = names.find(n => n.name === base);
  const cls = who && (who.cls || (who.kind === "class" ? who.name : null));
  const parents = new Set(); let c = cls;
  for (let k = 0; c && k < 8; k++) { parents.add(c); const cr = names.find(n => n.name === c && /class|struct/.test(n.kind)); c = cr && cr.parent; }
  for (const n of names) if ((n.kind === "field" || n.kind === "method") && (!cls || parents.has(n.owner))) push(n.name, kindLabel(n), parents.has(n.owner) ? 30000 : 15000, { kind: "name", rec: n });
  if (who && /pair|tuple/.test(who.kind)) for (const f of ["first", "second"]) push(f, "part of a pair", 25000, {});
  if (!cls && D.raylib.size) for (const f of ["x", "y", "z", "width", "height", "r", "g", "b", "a"]) push(f, "field", 8000, {});
}
function famName(r) { return r.family ? r.family + " · " + r.familyName : "is · the one short word"; }
function libInfo(r) {
  return r.kind === "function" ? r.name + "(" + (r.params || []).join(", ") + ") → " + r.returns + "\n" + (r.desc || "") : (r.desc || r.kind);
}
function toCompletion(o, env) {
  const c = { label: o.label, detail: o.detail, type: o.kind === "root" ? "keyword" : o.kind === "name" ? "variable" : o.kind === "kind" ? "type" : o.kind === "raylib" || o.kind === "qt" ? "function" : "keyword", _m: o.ranges, _o: o };
  if (o.kind === "root") c.info = () => { const d = document.createElement("div"); d.className = "epp-cinfo"; d.innerHTML = cardHTML({ kind: "root", data: D.roots.get(o.word) }); return d; };
  else if (o.kind === "value") c.info = () => { const d = document.createElement("div"); d.className = "epp-cinfo"; d.innerHTML = cardHTML({ kind: "value", data: D.values.get(o.word) }); return d; };
  else if (o.kind === "raylib") c.info = libInfo(D.raylib.get(o.word));
  else if (o.kind === "name" && o.rec) c.info = (o.rec.file && !o.rec.here ? o.rec.file + ", " : "") + "made on line " + o.rec.line;
  return c;
}

// ---------- word cards (hover on desktop, tap strip on phones) ----------
export function wordAt(lineText, col, names) {
  const words = splitWords(lineText);
  const nameCard = (t, a, b) => { const n = names && names.get(t); return n ? { kind: "name", data: n, from: a, to: b } : null; };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (col < w.from || col > w.to) continue;
    if (/^\s*note\b/.test(lineText)) return null;
    if (i === 1) {
      if (D.roots.has(w.text)) return { kind: "root", data: D.roots.get(w.text), from: w.from, to: w.to };
      if (D.raylib.has(w.text)) return { kind: "raylib", data: D.raylib.get(w.text), from: w.from, to: w.to };
      if (D.qt.has(w.text)) return { kind: "qt", data: D.qt.get(w.text), from: w.from, to: w.to };
      return nameCard(w.text, w.from, w.to);
    }
    if (w.text[0] === '"') return null;
    const re = /[A-Za-z_][A-Za-z_0-9]*/g; let m;
    while ((m = re.exec(w.text))) {
      const a = w.from + m.index, b = a + m[0].length, t = m[0];
      if (col < a || col > b) continue;
      if (m.index > 0 && /[0-9.]/.test(w.text[m.index - 1])) continue;
      if (D.values.has(t) && w.text[m.index + t.length] === "&") return { kind: "value", data: D.values.get(t), from: a, to: b };
      if (D.special.has(t)) return { kind: "special", data: D.special.get(t), from: a, to: b };
      const nc = nameCard(t, a, b); if (nc && (i === 0 || !D.kinds.has(t))) return nc;
      if (D.kinds.has(t)) return { kind: "kind", data: D.kinds.get(t), from: a, to: b };
      if (D.raylib.has(t)) return { kind: "raylib", data: D.raylib.get(t), from: a, to: b };
      if (D.qt.has(t)) return { kind: "qt", data: D.qt.get(t), from: a, to: b };
    }
  }
  return null;
}
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export function cardHTML(c) {
  const r = c.data;
  if (c.kind === "root" || c.kind === "value") {
    const fam = r.family ? r.family : "is";
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-root epp-f-${fam}">${esc(r.word)}</b><span class="epp-card-fam">${c.kind === "value" ? "value word · " : "root · "}${esc(r.family ? r.family + " · " + r.familyName : r.familyName)}</span><button type="button" class="epp-card-btn" data-act="table" data-word="${esc(r.word)}">Root Table</button></div>` +
      `<div class="epp-card-says">${esc(r.says)}</div>` +
      (r.who ? `<div class="epp-card-row"><span>who</span>${esc(r.who)}<span>what</span>${esc(r.what)}</div>` : "") +
      (r.example ? `<div class="epp-card-row"><span>example</span><code>${esc(r.example)}</code></div>` : "") +
      (r.cpp ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.cpp)}</code></div>` : "") + `</div>`;
  }
  if (c.kind === "kind" || c.kind === "special")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-${c.kind}">${esc(r.word)}</b><span class="epp-card-fam">${c.kind === "kind" ? "kind" : "special word"}</span><button type="button" class="epp-card-btn" data-act="table" data-word="${esc(r.word)}">Root Table</button></div><div class="epp-card-says">${esc(r.says)}</div>${r.cpp ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.cpp)}</code></div>` : ""}</div>`;
  if (c.kind === "raylib")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-lib">${esc(r.name)}</b><span class="epp-card-fam">raylib ${esc(r.kind)}</span></div><div class="epp-card-says">${esc(r.desc)}</div>${r.kind === "function" ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.returns)} ${esc(r.name)}(${esc((r.params || []).join(", "))})</code></div>` : ""}</div>`;
  if (c.kind === "qt")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-qt">${esc(r.name)}</b><span class="epp-card-fam">Qt-compatible layer</span></div><div class="epp-card-says">${esc(r.desc)}</div><div class="epp-card-row"><span>line</span><code>now ${esc(r.name)} ${esc(r.args)}</code></div></div>`;
  if (c.kind === "name")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-who">${esc(r.name)}</b><span class="epp-card-fam">${esc(kindLabel(r))}</span></div>` +
      `<div class="epp-card-row"><span>made</span>${r.file && !r.here ? esc(r.file) + ", " : ""}line ${r.line} <span>by</span><code>${esc(r.root)}</code></div>` +
      `<div class="epp-card-acts"><button type="button" class="epp-card-btn" data-act="def" data-name="${esc(r.name)}">Go to where it's made</button><button type="button" class="epp-card-btn" data-act="rename" data-name="${esc(r.name)}">Rename</button></div></div>`;
  return "";
}

// ---------- ghost guess: the top suggestion, faint, only when it is a sure thing. Tab or → takes it. Never Enter. ----------
const ghostEffect = StateEffect.define();
const ghostField = StateField.define({
  create: () => null,
  update(v, tr) {
    for (const e of tr.effects) if (e.is(ghostEffect)) return e.value;
    if (tr.docChanged || tr.selection) return null;
    return v;
  }
});
class GhostWidget extends WidgetType {
  constructor(t) { super(); this.t = t; }
  eq(o) { return o.t === this.t; }
  toDOM() { const s = document.createElement("span"); s.className = "epp-ghost"; s.textContent = this.t; s.setAttribute("aria-hidden", "true"); return s; }
  ignoreEvent() { return false; }
}
const ghostDeco = EditorView.decorations.compute([ghostField], s => {
  const g = s.field(ghostField);
  if (!g || g.pos > s.doc.length) return Decoration.none;
  return Decoration.set([Decoration.widget({ widget: new GhostWidget(g.text), side: 1 }).range(g.pos)]);
});
export function ghostGuess(r) {
  // r = rankAt result. Sure thing = one clear winner.
  if (!r || !r.list.length) return null;
  const top = r.list[0], second = r.list[1];
  if (top.label === r.prefix) return null;
  if (r.prefix) {
    if (!top.label.startsWith(r.prefix)) return null;
    const sameTier = second && Math.floor(second.score / 1e6) === Math.floor(top.score / 1e6);
    if (sameTier && top.score - second.score < 3000) return null;
  } else {
    // nothing typed yet: only a kind-matched name of your own that is the only one of its kind
    if (r.idx !== 2 || top.kind !== "name" || !top.fit) return null;
    if (second && second.kind === "name" && second.fit) return null;
    if (top.score < 2e6 + 30000) return null;
  }
  return { label: top.label, text: top.label.slice(r.prefix.length) };
}
function acceptGhost(view) {
  const g = view.state.field(ghostField, false);
  const head = view.state.selection.main;
  if (!g || !head.empty || head.head !== g.pos) return false;
  view.dispatch({ changes: { from: g.pos, insert: g.text }, selection: { anchor: g.pos + g.text.length }, userEvent: "input.complete", effects: ghostEffect.of(null) });
  closeCompletion(view);
  return true;
}

// ---------- Enter, Tab, auto-indent ----------
const navEffect = StateEffect.define();
const navField = StateField.define({
  create: () => false,
  update(v, tr) { for (const e of tr.effects) if (e.is(navEffect)) v = e.value; if (tr.docChanged) v = false; return v; }
});
function moveSel(forward, by) {
  const cmd = moveCompletionSelection(forward, by);
  return view => { if (!cmd(view)) return false; view.dispatch({ effects: navEffect.of(true) }); return true; };
}
// where an otherwise/catch/until/case line belongs: the indent of its head, or null
export function headIndent(doc, lineNo, root) {
  let heads, plus = 0;
  if (ELSE.has(root)) heads = r => isIfRoot(r) || ELSE.has(r);
  else if (root === "bch") heads = r => r === "btr" || r === "bch";
  else if (UNTIL.has(root)) heads = r => r === "bdo";
  else if (root === "bcs" || root === "bdf") heads = r => r === "bcs" || r === "bdf" || r === "bsw";
  else return null;
  const cur = lead(doc.line(lineNo).text);
  let lim = cur;
  for (let n = lineNo - 1; n >= 1; n--) {
    const t = doc.line(n).text;
    if (!t.trim() || /^\s*note(\s|$)/.test(t)) continue;
    const ind = lead(t);
    if (ind > lim) continue;
    const w = splitWords(t), r = w[1] ? w[1].text : "";
    if (heads(r)) return r === "bsw" ? ind + 2 : ind;
    lim = ind - 1;
    if (lim < 0) return null;
  }
  return null;
}
function dedentChange(doc, line) {
  const w = splitWords(line.text);
  if (w.length < 2) return null;
  const t = headIndent(doc, line.number, w[1].text);
  const ind = lead(line.text);
  if (t == null || t >= ind) return null;
  return { from: line.from, to: line.from + (ind - t), insert: "" };
}
export function eppNewline(view) {
  const st = view.state;
  if (st.selection.ranges.length > 1) return false;
  const r = st.selection.main, line = st.doc.lineAt(r.from), endLine = st.doc.lineAt(r.to);
  const before = line.text.slice(0, r.from - line.from);
  const after = endLine.text.slice(r.to - endLine.from);
  const ind = lead(line.text);
  // Enter on an empty indented line steps back out one level
  if (r.empty && !line.text.trim() && ind > 0) {
    const n = Math.max(0, ind - 2 - (ind % 2 ? -1 : 0));
    view.dispatch({ changes: { from: line.from, to: line.to, insert: " ".repeat(n) }, selection: { anchor: line.from + n }, userEvent: "input", scrollIntoView: true });
    return true;
  }
  const changes = [];
  let curInd = ind;
  if (before.trim() && r.from - line.from >= ind) { const d = dedentChange(st.doc, line); if (d) { changes.push(d); curInd = ind - (d.to - d.from); } }
  let next;
  if (!before.trim()) next = before.length;
  else next = Math.min(curInd, before.length) + (opensBlock(before) ? 2 : 0);
  const trail = before.trim() ? before.length - before.replace(/\s+$/, "").length : 0;
  const afterLead = after.match(/^ */)[0].length;
  const insFrom = r.from - trail, insTo = r.to + afterLead;
  changes.push({ from: insFrom, to: insTo, insert: "\n" + " ".repeat(next) });
  const cs = st.changes(changes);
  view.dispatch({ changes: cs, selection: { anchor: cs.mapPos(insTo, 1) }, userEvent: "input", scrollIntoView: true });
  return true;
}
function enterKey(view) {
  if (completionStatus(view.state) === "active" && selectedCompletionIndex(view.state) != null && view.state.field(navField, false)) return acceptCompletion(view);
  if (completionStatus(view.state)) closeCompletion(view);
  return eppNewline(view);
}
function tabKey(view) {
  if (completionStatus(view.state) === "active") {
    if (selectedCompletionIndex(view.state) == null) view.dispatch({ effects: setSelectedCompletion(0) });
    if (acceptCompletion(view)) return true;
  }
  if (acceptGhost(view)) return true;
  if (hasNextSnippetField(view.state)) return nextSnippetField(view);
  if (view.state.selection.ranges.some(r => !r.empty)) return indentMore(view);
  view.dispatch(view.state.replaceSelection("  ")); return true;
}
function shiftTabKey(view) {
  if (hasPrevSnippetField(view.state)) return prevSnippetField(view);
  return indentLess(view);
}
// Ctrl+/ : note lines on and off (a line that starts with note is a note)
export function toggleNote(view) {
  const st = view.state, lines = [];
  for (const r of st.selection.ranges) {
    for (let n = st.doc.lineAt(r.from).number; n <= st.doc.lineAt(r.to).number; n++) if (!lines.includes(n)) lines.push(n);
  }
  const L = lines.map(n => st.doc.line(n)).filter(l => l.text.trim());
  if (!L.length) return true;
  const allNote = L.every(l => /^\s*note(\s|$)/.test(l.text));
  const changes = L.map(l => {
    const i = lead(l.text);
    if (allNote) { const m = l.text.slice(i).match(/^note ?/); return { from: l.from + i, to: l.from + i + m[0].length, insert: "" }; }
    return { from: l.from + i, insert: "note " };
  });
  view.dispatch({ changes, userEvent: "input" });
  return true;
}
// typing the space after an otherwise/catch/until/case root puts the line under its if/try/do/switch
const electric = EditorView.inputHandler.of((view, from, to, text) => {
  if (text !== " " || from !== to) return false;
  const line = view.state.doc.lineAt(from);
  const before = line.text.slice(0, from - line.from);
  const m = before.match(/^( *)(\S+) +(\S+)$/);
  if (!m) return false;
  const t = headIndent(view.state.doc, line.number, m[3]);
  if (t == null || t >= m[1].length) return false;
  const cut = m[1].length - t;
  view.dispatch({ changes: [{ from: line.from, to: line.from + cut }, { from, insert: " " }], selection: { anchor: from + 1 - cut }, userEvent: "input.type" });
  return true;
});
// pasted or dropped blocks keep their shape and land at the current line's level
export function reindentPaste(text, before) {
  text = text.replace(/\r\n?/g, "\n");
  if (!text.includes("\n")) return text;
  let lines = text.split("\n").map(l => { const m = l.match(/^[ \t]*/)[0]; return m.replace(/\t/g, "  ") + l.slice(m.length); });
  const endsNL = lines[lines.length - 1] === "";
  if (endsNL) lines.pop();
  const atStart = !before.trim();
  const base = atStart ? before.length : lead(before);
  const rest = lines.slice(1).filter(l => l.trim());
  const restMin = rest.length ? Math.min(...rest.map(lead)) : 0;
  let lead0 = lead(lines[0]);
  if (lead0 === 0 && rest.length && restMin > 0) lead0 = opensBlock(lines[0]) ? Math.max(0, restMin - 2) : restMin;
  const common = Math.min(lead0, rest.length ? restMin : lead0);
  const out = lines.map((l, i) => {
    if (i === 0) return (atStart ? " ".repeat(Math.max(0, lead0 - common)) : "") + l.replace(/^ +/, "");
    if (!l.trim()) return "";
    return " ".repeat(base + lead(l) - common) + l.replace(/^ +/, "");
  });
  if (endsNL) out.push(" ".repeat(base));
  return out.join("\n");
}
const pasteFilter = EditorState.transactionFilter.of(tr => {
  if (!tr.docChanged || !(tr.isUserEvent("input.paste") || tr.isUserEvent("input.drop"))) return tr;
  let n = 0, ch = null;
  tr.changes.iterChanges((fA, tA, fB, tB, ins) => { n++; ch = { fA, tA, text: ins.toString() }; });
  if (n !== 1 || !ch.text.includes("\n")) return tr;
  const st = tr.startState, line = st.doc.lineAt(ch.fA);
  const text = reindentPaste(ch.text, line.text.slice(0, ch.fA - line.from));
  if (text === ch.text) return tr;
  return { changes: { from: ch.fA, to: ch.tA, insert: text }, selection: { anchor: ch.fA + text.length }, userEvent: tr.annotation(Transaction.userEvent), scrollIntoView: true };
});

// ---------- the editor ----------
const OTHER_NAMES = new WeakMap(), DOC_IDS = new WeakMap(); let docIdNext = 1;
function docId(d) { let i = DOC_IDS.get(d); if (!i) { i = docIdNext++; DOC_IDS.set(d, i); } return i; }
export const BIG_LINES = 1500;   // v4: from here on the engine check waits for a pause in typing
export function createEditor(opts) {
  let engineDiags = [], runtimeDiags = [], runtimeDoc = null;
  // names scan, cached per document
  let cacheDoc = null, cacheNames = null, cacheOthers = [], cacheOthersKey = "", cacheAll = null, cacheAllOthers = null, scannedAt = 0, rescanT = 0;
  let api = null;
  const env = {
    names(state) {
      const doc = state.doc;
      const others = opts.otherFiles ? opts.otherFiles() : [];
      // v4: a file the page hands over with its CodeMirror text (f.doc) is scanned once per version of that text, never turned into a string per keystroke
      const key = others.map(f => f.doc ? f.name + ":#" + docId(f.doc) : f.name + ":" + f.text.length + ":" + f.text.slice(0, 64)).join("|");
      if (key !== cacheOthersKey) {
        cacheOthers = [];
        for (const f of others) {
          let ns = f.doc ? OTHER_NAMES.get(f.doc) : null;
          if (!ns || ns.file !== f.name) { ns = scanNames(f.doc ? f.doc.toString() : f.text, f.name); ns.file = f.name; if (f.doc) OTHER_NAMES.set(f.doc, ns); }
          for (const n of ns) cacheOthers.push(n);
        }
        cacheOthersKey = key;
      }
      if (doc !== cacheDoc && cacheNames && doc.lines > BIG_LINES && performance.now() - scannedAt < 400) {
        // v4: a big file is rescanned at most ~2-3 times a second while typing; in between the last scan answers
        if (!rescanT) rescanT = setTimeout(() => { rescanT = 0; scannedAt = 0; if (api && api.view) env.names(api.view.state); }, 400);
        return cacheAll || cacheNames.concat(cacheOthers);
      }
      if (doc !== cacheDoc) { scannedAt = performance.now(); cacheNames = scanNames(doc.toString(), opts.fileName ? opts.fileName() : "").map(n => Object.assign(n, { here: true })); cacheDoc = doc; cacheAll = null; }
      if (!cacheAll || cacheAllOthers !== cacheOthers) { cacheAll = cacheNames.concat(cacheOthers); cacheAllOthers = cacheOthers; }
      return cacheAll;
    },
    usage(state, lineNo) {
      const count = new Map(), last = new Map(), withWho = new Map();
      const doc = state.doc;
      if (doc.lines > BIG_LINES) return bigUsage(doc, lineNo);
      for (let n = 1; n <= doc.lines; n++) {
        if (n === lineNo) continue;
        const w = splitWords(doc.line(n).text);
        if (w.length < 2 || w[0].text === "note") continue;
        const r = w[1].text;
        count.set(r, (count.get(r) || 0) + 1);
        if (n < lineNo) last.set(r, n);
        withWho.set(w[0].text + " " + r, n);
        if (w[2]) for (const m of w[2].text.match(/[A-Za-z_][A-Za-z_0-9]*(?=&)/g) || []) count.set(m, (count.get(m) || 0) + 1);
      }
      return { count, last, withWho };
    }
  };
  let nmFor = null, nmMap = null;
  const nameMap = state => {
    const all = env.names(state);
    if (all === nmFor && nmMap) return nmMap;
    const m = new Map(); for (const n of all) if (!m.has(n.name) || (n.here && !m.get(n.name).here)) m.set(n.name, n);
    nmFor = all; nmMap = m; return m;
  };
  // v4: big files: the per-line roots are taken once per document version; a query is then one pass over small records
  let ubDoc = null, ubRows = null;
  function bigUsage(doc, lineNo) {
    if (ubDoc !== doc) {
      ubRows = new Array(doc.lines + 1);
      let n = 1;
      for (const it = doc.iterLines(); !it.next().done; n++) {
        const w = splitWords(it.value);
        if (w.length < 2 || w[0].text === "note") continue;
        ubRows[n] = { who: w[0].text, r: w[1].text, parts: w[2] ? (w[2].text.match(/[A-Za-z_][A-Za-z_0-9]*(?=&)/g) || []) : [] };
      }
      ubDoc = doc;
    }
    const count = new Map(), last = new Map(), withWho = new Map();
    for (let n = 1; n < ubRows.length; n++) {
      const x = ubRows[n]; if (!x || n === lineNo) continue;
      count.set(x.r, (count.get(x.r) || 0) + 1);
      if (n < lineNo) last.set(x.r, n);
      withWho.set(x.who + " " + x.r, n);
      for (const m of x.parts) count.set(m, (count.get(m) || 0) + 1);
    }
    return { count, last, withWho };
  }
  const source = ctx => {
    const r = rankAt(ctx.state, ctx.pos, ctx.explicit, env);
    if (!r) return null;
    let first = true;
    const options = r.list.map(o => { const c = toCompletion(o, env); if (first) { c._top = true; first = false; } return c; });
    return { from: r.from, options, filter: false, getMatch: c => c._m || [] };
  };
  // v4: the engine check. Small files: as in v3 (checked on every lint). Big files (> BIG_LINES): the three-word check shows at once;
  // the engine check runs only after typing has paused (900 ms + browser idle), never twice for the same text, and then
  // replaces the diagnostics itself. Until then the file's last engine errors stay on their lines.
  const checkCache = new Map(), lastEngine = new Map();
  let lastTyped = 0, bigTimer = 0;
  const fileNow = () => (opts.fileName ? opts.fileName() : "");
  const idle = (ms) => new Promise(res => (typeof requestIdleCallback === "function" ? requestIdleCallback(() => res(), { timeout: ms }) : setTimeout(res, 1)));
  // the check of one file also reads the files it brings in (xim), so they are part of the key
  const othersKey = () => (opts.otherFiles ? opts.otherFiles() : []).map(f => f.doc ? f.name + ":#" + docId(f.doc) : f.name + ":" + f.text).join("\u0001");
  const ckey = src => fileNow() + "\u0000" + othersKey() + "\u0000" + src;
  async function runCheck(src) {
    const key = ckey(src);
    if (checkCache.has(key)) return checkCache.get(key);
    let r = null;
    try { r = await opts.check(src); } catch (e) { r = null; }
    if (!r || r.busy) return null;   // no engine yet / failed / a program is running: the three-word check still runs
    const errs = r.errors || [];
    checkCache.set(key, errs); if (checkCache.size > 6) checkCache.delete(checkCache.keys().next().value);
    return errs;
  }
  function scheduleBig(view) {
    clearTimeout(bigTimer);
    bigTimer = setTimeout(async function go() {
      const wait = 900 - (Date.now() - lastTyped);
      if (wait > 0) { bigTimer = setTimeout(go, wait); return; }
      await idle(1500);
      if (Date.now() - lastTyped < 900) { bigTimer = setTimeout(go, 900); return; }
      const st = view.state, src = st.doc.toString(), file = fileNow();
      const errs = await runCheck(src);
      if (errs === null || view.state.doc !== st.doc || fileNow() !== file) return;
      lastEngine.set(file, errs);
      view.dispatch(setDiagnostics(view.state, buildDiags(view, localErrors(src), errs, src)));
    }, 900);
  }
  let lastDiags = [];
  function withFixes(view, d, e) {
    if (typeof opts.fixesFor !== "function") return d;
    const doc = view.state.doc, ln = doc.lineAt(d.from);
    let fixes = null;
    try { fixes = opts.fixesFor({ line: ln.number, message: e.message, lineText: ln.text, from: d.from, to: d.to, file: fileNow() }); } catch (x) { fixes = null; }
    if (!Array.isArray(fixes) || !fixes.length) return d;
    d.actions = fixes.filter(f => f && typeof f.text === "string").map(f => ({
      name: String(f.name || "Fix"),
      apply(v, from) { const n = v.state.doc.lineAt(Math.min(from, v.state.doc.length)).number; api.replaceLine(n, f.text); forceLinting(v); }
    }));
    return d;
  }
  function buildDiags(view, errs, engine, src) {
    const doc = view.state.doc;
    const seen = new Set(errs.map(e => e.line));
    engine = engine.filter(e => !(seen.has(e.line) && /three words/i.test(e.message)) && (e.line | 0) <= doc.lines);
    engineDiags = engine.map(e => withFixes(view, toDiag(doc, e, "error", "Web Studio"), e));
    if (runtimeDoc !== src) runtimeDiags = [];
    const all = errs.map(e => withFixes(view, toDiag(doc, e, "error", "three words"), e)).concat(engineDiags, runtimeDiags);
    if (opts.onDiagnostics) opts.onDiagnostics(errs.concat(engine));
    lastDiags = all;
    return all;
  }
  const checker = linter(async (view) => {
    const doc = view.state.doc;
    const src = doc.toString();
    const errs = localErrors(src);
    let engine = [];
    if (opts.check) {
      if (doc.lines > BIG_LINES) {
        const hit = checkCache.get(ckey(src));
        if (hit) engine = hit; else { engine = lastEngine.get(fileNow()) || []; scheduleBig(view); }
      } else {
        const r = await runCheck(src); engine = r || [];
        if (view.state.doc !== doc) return [];
      }
    }
    return buildDiags(view, errs, engine, src);
  }, { delay: 400 });
  const hover = hoverTooltip((view, pos) => {
    const line = view.state.doc.lineAt(pos);
    const c = wordAt(line.text, pos - line.from, nameMap(view.state));
    if (!c) return null;
    return { pos: line.from + c.from, end: line.from + c.to, above: true, create() { const d = document.createElement("div"); d.innerHTML = cardHTML(c); d.addEventListener("click", e => cardClick(e)); return { dom: d }; } };
  }, { hoverTime: 350 });
  function cardClick(e) {
    const b = e.target.closest && e.target.closest("[data-act]"); if (!b) return;
    e.preventDefault();
    if (b.dataset.act === "table" && opts.onRootTable) opts.onRootTable(b.dataset.word);
    if (b.dataset.act === "def") api.goToDef(b.dataset.name);
    if (b.dataset.act === "rename" && opts.onRename) opts.onRename(b.dataset.name);
  }
  // ghost guess after typing
  const ghostPlugin = ViewPlugin.fromClass(class {
    constructor() { this.t = 0; }
    update(u) {
      if (!u.docChanged || !u.transactions.some(t => t.isUserEvent("input.type"))) return;
      const view = u.view;
      clearTimeout(this.t);
      this.t = setTimeout(() => {
        const st = view.state, s = st.selection.main;
        if (!s.empty) return;
        const line = st.doc.lineAt(s.head);
        if (line.text.slice(s.head - line.from).trim()) return; // only at the end of a line
        const g = ghostGuess(rankAt(st, s.head, false, env));
        if (g && g.text) view.dispatch({ effects: ghostEffect.of({ pos: s.head, text: g.text, label: g.label }) });
      }, 60);
    }
    destroy() { clearTimeout(this.t); }
  });
  const rowLink = {
    render(c) {
      const o = c._o; if (!o || (o.kind !== "root" && o.kind !== "value" && o.kind !== "kind")) return null;
      const b = document.createElement("button"); b.type = "button"; b.className = "epp-row-table"; b.textContent = "?";
      b.setAttribute("aria-label", "Open " + o.label + " in the Root Table");
      const stop = e => { e.stopPropagation(); e.preventDefault(); };
      b.addEventListener("mousedown", stop); b.addEventListener("pointerdown", stop); b.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
      b.addEventListener("click", e => { stop(e); if (opts.onRootTable) opts.onRootTable(o.word || o.label); });
      return b;
    },
    position: 90
  };
  const libsCompartment = new Compartment();
  let bpListener = null;
  const extensions = [
        bpField, debugLineField, debugLineDeco, libsCarry,
        gutter({
          class: "epp-bp-gutter", markers: v => v.state.field(bpField), initialSpacer: () => bpSpacer,
          lineMarker: (v, line) => { const n = v.state.field(debugLineField); return n && n <= v.state.doc.lines && v.state.doc.line(n).from === line.from ? pausedMarker : null; },
          lineMarkerChange: u => u.startState.field(debugLineField) !== u.state.field(debugLineField),
          domEventHandlers: { click: (v, line) => { toggleBreakpointAt(v, line.from); return true; } }
        }),
        lineNumbers({ domEventHandlers: { click: (v, line) => { toggleBreakpointAt(v, line.from); return true; } } }), highlightActiveLineGutter(), highlightSpecialChars(), history(), drawSelection(), dropCursor(),
        indentUnit.of("  "), EditorState.tabSize.of(2), EditorState.allowMultipleSelections.of(true), bracketMatching(), closeBrackets(),
        highlightActiveLine(), highlightSelectionMatches(),
        runLineField, highlighter, hover, lintGutter(), checker,
        navField, ghostField, ghostDeco, ghostPlugin, electric, pasteFilter,
        autocompletion({
          override: [source], activateOnTyping: true, maxRenderedOptions: 60, icons: false,
          selectOnOpen: false, interactionDelay: 0, defaultKeymap: false,
          optionClass: c => (c._top ? "epp-top" : "") + (c._o && c._o.fit ? " epp-fit" : ""),
          addToOptions: [rowLink]
        }),
        Prec.highest(keymap.of([
          { key: "Enter", run: enterKey },
          { key: "Tab", run: tabKey, shift: shiftTabKey },
          { key: "ArrowRight", run: acceptGhost },
          { key: "ArrowDown", run: moveSel(true) }, { key: "ArrowUp", run: moveSel(false) },
          { key: "PageDown", run: moveSel(true, "page") }, { key: "PageUp", run: moveSel(false, "page") },
          { key: "Escape", run: v => { if (completionStatus(v.state)) { closeCompletion(v); return true; } if (v.state.field(ghostField, false)) { v.dispatch({ effects: ghostEffect.of(null) }); return true; } return clearSnippet(v); } },
          { key: "Ctrl-Space", run: startCompletion }, { key: "Mod-i", run: startCompletion },
          { key: "Mod-Enter", run: () => { opts.onRun && opts.onRun(); return true; } },
          { key: "F5", run: () => { opts.onRun && opts.onRun(); return true; }, preventDefault: true },
          { key: "Mod-/", run: toggleNote }, { key: "Ctrl-/", run: toggleNote },
          { key: "F12", run: v => api.goToDef() }, { key: "F2", run: v => { const w = api.wordUnderCursor(); if (w && opts.onRename) { opts.onRename(w); return true; } return false; } }
        ])),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ autocapitalize: "off", autocorrect: "off", spellcheck: "false", "aria-label": "English++ program" }),
        EditorView.updateListener.of(u => {
          if (u.docChanged) lastTyped = Date.now();
          if (u.docChanged && opts.onChange) { if (opts.onChange.length) opts.onChange(u.state.doc.toString()); else opts.onChange(); }   // v4: no whole-document string when the page doesn't want it
          if (bpListener && (u.docChanged || u.transactions.some(t => t.effects.some(e => e.is(bpEffect) || e.is(bpClearEffect))))) {
            const was = breakpointLines(u.startState).join(","), now = breakpointLines(u.state);
            if (was !== now.join(",")) bpListener(now);
          }
          if ((u.selectionSet || u.docChanged) && opts.onCursor) {
            const pos = u.state.selection.main.head, line = u.state.doc.lineAt(pos);
            opts.onCursor(wordAt(line.text, pos - line.from, nameMap(u.state)), line.number);
          }
        }),
        libsCompartment.of([])
  ];
  const makeState = (doc) => EditorState.create({ doc: doc || "", extensions });
  const view = new EditorView({ parent: opts.parent, state: makeState(opts.doc) });
  api = {
    view, makeState, env, cardClick,
    getText: () => view.state.doc.toString(),
    setText(t) { view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: t }, selection: { anchor: 0 } }); },
    setState(st) { view.setState(st); },
    insert(text) {
      view.dispatch(view.state.replaceSelection(text)); view.focus();
      if (/[&@]$/.test(text)) startCompletion(view);
    },
    indent() { if (hasNextSnippetField(view.state)) { nextSnippetField(view); view.focus(); return; } const r = view.state.selection.main; if (r.empty) view.dispatch(view.state.replaceSelection("  ")); else indentMore(view); view.focus(); },
    outdent() { indentLess(view); view.focus(); },
    undo() { undo(view); view.focus(); }, redo() { redo(view); view.focus(); },
    find() { if (searchPanelOpen(view.state)) closeSearchPanel(view); else openSearchPanel(view); },
    toggleNote() { toggleNote(view); view.focus(); },
    focus() { view.focus(); },
    complete() { startCompletion(view); },
    relint() { forceLinting(view); },
    names() { return env.names(view.state); },
    outline() {
      return env.names(view.state).filter(n => n.here && /function|method|class|struct|union|choice kind|group/.test(n.kind))
        .map(n => ({ name: n.name, kind: n.kind, line: n.line, owner: n.owner, root: n.root }));
    },
    wordUnderCursor() {
      const s = view.state.selection.main, line = view.state.doc.lineAt(s.head);
      const c = wordAt(line.text, s.head - line.from, nameMap(view.state));
      return c && c.kind === "name" ? c.data.name : null;
    },
    goToDef(name) {
      name = name || api.wordUnderCursor(); if (!name) return false;
      const all = env.names(view.state).filter(n => n.name === name);
      const n = all.find(x => x.here) || all[0];
      if (!n) return false;
      if (!n.here) { if (opts.openFile) opts.openFile(n.file, n.line); return true; }
      const line = view.state.doc.line(n.line);
      const w = splitWords(line.text), at = w.find(x => x.text.split("&").includes(name)) || w[0];
      const off = at.text.indexOf(name);
      view.dispatch({ selection: { anchor: line.from + at.from + Math.max(0, off), head: line.from + at.from + Math.max(0, off) + name.length }, scrollIntoView: true });
      view.focus(); return true;
    },
    // rename every use of a name in this file (word 1, word 3 and its parts, and @name inside quotes); never the root (word 2) unless it is your method
    rename(oldN, newN) {
      const changes = renameChanges(view.state.doc.toString(), oldN, newN, env.names(view.state));
      if (changes.length) view.dispatch({ changes, userEvent: "input.rename" });
      return changes.length;
    },
    renameText(text, oldN, newN) {
      const ch = renameChanges(text, oldN, newN, scanNames(text, ""));
      let out = text; for (const c of ch.slice().sort((a, b) => b.from - a.from)) out = out.slice(0, c.from) + c.insert + out.slice(c.to);
      return { text: out, count: ch.length };
    },
    // drop a block in at the cursor: on an empty line it goes right there; otherwise on a new line under this one, at the right level
    insertBlock(template, plain) {
      const st = view.state, s = st.selection.main, line = st.doc.lineAt(s.head);
      let at;
      if (!line.text.trim()) { const ind = line.text.length; view.dispatch({ changes: { from: line.from, to: line.to, insert: " ".repeat(ind) } }); at = line.from + ind; }
      else { const want = lead(line.text) + (opensBlock(line.text) ? 2 : 0); view.dispatch({ changes: { from: line.to, insert: "\n" + " ".repeat(want) } }); at = line.to + 1 + want; }
      if (plain) { const base = " ".repeat(lead(view.state.doc.lineAt(at).text)); const t = template.split("\n").map((l, i) => i ? base + l.replace(/\t/g, "  ") : l).join("\n"); view.dispatch({ changes: { from: at, insert: t }, selection: { anchor: at + t.length } }); }
      else snippet(template)({ state: view.state, dispatch: tr => view.dispatch(tr) }, null, at, at);
      view.focus();
    },
    setRunLine(n) { view.dispatch({ effects: runLineEffect.of(n || 0) }); },
    // ---- v4 debugger ----
    breakpoints(state) { return breakpointLines(state || view.state); },
    toggleBreakpoint(lineNo) { const d = view.state.doc; if (lineNo < 1 || lineNo > d.lines) return false; return toggleBreakpointAt(view, d.line(lineNo).from); },
    setBreakpoints(lines) {
      const d = view.state.doc, eff = [bpClearEffect.of(null)];
      for (const n of lines || []) if (n >= 1 && n <= d.lines) eff.push(bpEffect.of({ pos: d.line(n).from, on: true }));
      view.dispatch({ effects: eff });
    },
    clearBreakpoints() { view.dispatch({ effects: bpClearEffect.of(null) }); },
    onBreakpoints(fn) { bpListener = typeof fn === "function" ? fn : null; },
    setDebugLine(n, scroll) {
      const d = view.state.doc; n = n | 0; if (n < 0 || n > d.lines) n = 0;
      const tr = { effects: debugLineEffect.of(n) };
      if (n && scroll !== false) tr.effects = [tr.effects, EditorView.scrollIntoView(d.line(n).from, { y: "center" })];
      view.dispatch(tr);
    },
    debugLine() { return view.state.field(debugLineField, false) || 0; },
    // ---- v4 fix-it hook ----
    diagnostics() {
      const out = [];
      forEachDiagnostic(view.state, (dg, from, to) => out.push({ line: view.state.doc.lineAt(from).number, message: dg.message, from, to, actions: (dg.actions || []).map(a => a.name) }));
      return out;
    },
    replaceLine(lineNo, text) {
      const d = view.state.doc; if (lineNo < 1 || lineNo > d.lines) return false;
      const l = d.line(lineNo);
      view.dispatch({ changes: { from: l.from, to: l.to, insert: String(text) }, userEvent: "input.fix" });
      return true;
    },
    showRuntimeError(err) {
      if (!err) return;
      const d = toDiag(view.state.doc, err, "error", "when it ran");
      d.message = "When it ran: " + err.message;
      runtimeDiags = [d]; runtimeDoc = view.state.doc.toString();
      view.dispatch(setDiagnostics(view.state, engineDiags.concat(localErrors(view.state.doc.toString()).map(e => toDiag(view.state.doc, e, "error", "three words")), runtimeDiags)));
      const line = view.state.doc.line(Math.max(1, Math.min(view.state.doc.lines, err.line | 0 || 1)));
      view.dispatch({ selection: { anchor: line.from }, scrollIntoView: true });
    },
    goToLine(n) {
      const line = view.state.doc.line(Math.max(1, Math.min(view.state.doc.lines, n | 0 || 1)));
      view.dispatch({ selection: { anchor: line.from, head: line.to }, scrollIntoView: true }); view.focus();
    },
    rankAt(pos) { return rankAt(view.state, pos == null ? view.state.selection.main.head : pos, true, env); },
    ghost() { return view.state.field(ghostField, false); }
  };
  Object.assign(api, cppApi({ opts, api, navField, moveSel })); // v3: C++ files get a C++ EditorState in the same view
  return api;
}
export function renameChanges(src, oldN, newN, names) {
  const changes = [];
  const isMethod = names.some(n => n.name === oldN && (n.kind === "method" || n.kind === "function"));
  let off = 0;
  for (const line of src.split("\n")) {
    if (!/^\s*note(\s|$)/.test(line)) {
      splitWords(line).forEach((w, i) => {
        if (i === 1) { if (isMethod && w.text === oldN) changes.push({ from: off + w.from, to: off + w.to, insert: newN }); return; }
        if (w.text[0] === '"' || w.text[0] === "'") {
          const re = new RegExp("@" + oldN + "(?![A-Za-z_0-9])", "g"); let m;
          while ((m = re.exec(w.text))) changes.push({ from: off + w.from + m.index + 1, to: off + w.from + m.index + 1 + oldN.length, insert: newN });
          return;
        }
        const re = /"(?:[^"\\]|\\.)*"?|[A-Za-z_][A-Za-z_0-9]*|\d+(?:\.\d+)?|[^A-Za-z_0-9"]+/g; let m;
        while ((m = re.exec(w.text))) {
          if (m[0] === oldN) changes.push({ from: off + w.from + m.index, to: off + w.from + m.index + oldN.length, insert: newN });
          else if (m[0][0] === '"') { const r2 = new RegExp("@" + oldN + "(?![A-Za-z_0-9])", "g"); let k; while ((k = r2.exec(m[0]))) changes.push({ from: off + w.from + m.index + k.index + 1, to: off + w.from + m.index + k.index + 1 + oldN.length, insert: newN }); }
        }
      });
    }
    off += line.length + 1;
  }
  return changes;
}
export function isReserved(w) { return D.roots.has(w) || D.values.has(w) || D.kinds.has(w) || D.special.has(w); }
export { EditorState, EditorView, setCppData, isCppName };
// v4 debugger: breakpoints kept in a file's saved state (tabs that are not open)
export function clearBreakpointsIn(state) { return state.field(bpField, false) ? state.update({ effects: bpClearEffect.of(null) }).state : state; }
