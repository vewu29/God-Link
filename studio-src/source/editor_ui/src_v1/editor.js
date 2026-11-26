// English++ Web Studio — the editor bundle (CodeMirror 6 + the English++ mode).
// English++ is Vewu's language; this file only highlights and helps type it.
import { EditorState, StateEffect, StateField, RangeSetBuilder, Compartment, Prec } from "@codemirror/state";
import {
  EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection,
  Decoration, ViewPlugin, hoverTooltip, highlightSpecialChars, dropCursor
} from "@codemirror/view";
import { history, defaultKeymap, historyKeymap, indentLess, indentMore } from "@codemirror/commands";
import { indentUnit, bracketMatching } from "@codemirror/language";
import { autocompletion, completionKeymap, closeBrackets, startCompletion } from "@codemirror/autocomplete";
import { linter, lintGutter, setDiagnostics, forceLinting } from "@codemirror/lint";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";

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
}

// ---------- tokenising one line ----------
// Words are split by spaces, except inside "quotes".
const WORD_RE = /(?:"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|[^\s"'])+/g;
export function splitWords(text) {
  const out = []; let m; WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(text))) out.push({ text: m[0], from: m.index, to: m.index + m[0].length });
  return out;
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
  const lead = text.match(/^\s*/)[0].length;
  const body = text.slice(lead);
  if (!body) return toks;
  if (/^note(\s|$)/.test(body)) { toks.push({ from: lead, to: text.length, cls: "epp-note" }); return toks; }
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
export function libsOf(doc) {
  const s = typeof doc === "string" ? doc : doc.toString();
  return { raylib: /^\s*now\s+xlb\s+raylib\b/m.test(s), qt: /^\s*now\s+xlb\s+qt\b/mi.test(s) };
}
export function namesOf(src) {
  const names = new Map();
  for (const line of src.split("\n")) {
    const w = splitWords(line);
    if (w.length >= 2 && DEF_ROOTS.has(w[1].text) && /^[A-Za-z_][A-Za-z_0-9]*$/.test(w[0].text) && !D.special.has(w[0].text))
      if (!names.has(w[0].text)) names.set(w[0].text, w[1].text);
  }
  return names;
}

// ---------- highlighter ----------
const markCache = new Map();
function mark(cls) { let d = markCache.get(cls); if (!d) { d = Decoration.mark({ class: cls }); markCache.set(cls, d); } return d; }
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
  const lead = line.text.match(/^\s*/)[0].length;
  const from = line.from + Math.min(lead, line.length), to = Math.max(from, line.to);
  return { from, to: to === from ? Math.min(doc.length, from + 1) : to, severity, message: e.message, source };
}

// ---------- autocomplete ----------
function opt(label, type, detail, info, boost) { return { label, type, detail, info, boost: boost || 0 }; }
function completions(ctx, opts) {
  const line = ctx.state.doc.lineAt(ctx.pos);
  const before = line.text.slice(0, ctx.pos - line.from);
  if (/^\s*note\s/.test(before)) return null;
  const words = splitWords(before);
  const endsSpace = /\s$/.test(before) || before.trim() === "";
  const idx = endsSpace ? words.length : words.length - 1;
  // inside an open string: no completions
  const q = (before.match(/"/g) || []).length; if (q % 2 === 1) return null;
  const tok = ctx.matchBefore(/[A-Za-z_][A-Za-z_0-9]*$/);
  const from = tok ? tok.from : ctx.pos;
  if (!tok && !ctx.explicit && !/[&@]$/.test(before) && !(endsSpace && idx === 1)) return null;
  const src = ctx.state.doc.toString(), libs = libsOf(src);
  const list = [];
  const addNames = (boost) => { for (const [n, r] of namesOf(src)) list.push(opt(n, "variable", "your name · " + r, null, boost)); };
  const addLib = () => {
    if (libs.raylib) for (const [n, r] of D.raylib) list.push(opt(n, r.kind === "function" ? "function" : r.kind === "struct" ? "class" : "constant", "raylib", libInfo(r), -2));
    if (libs.qt) for (const [n, r] of D.qt) list.push(opt(n, "function", "Qt layer", r.desc + (r.args ? " — " + n + " " + r.args : ""), -1));
  };
  if (idx === 0) {
    for (const s of ["now", "out", "err", "inp", "slf"]) list.push(opt(s, "keyword", D.special.get(s) ? D.special.get(s).says : "", null, 2));
    list.push(opt("note", "keyword", "a comment line", null, 1));
    addNames(3);
  } else if (idx === 1) {
    for (const [w, r] of D.roots) list.push({ label: w, type: "keyword", detail: r.says, info: rootInfo(r), boost: 1, section: famName(r) });
    addLib();
  } else {
    for (const [w, r] of D.values) list.push(opt(w, "function", r.says, w + "&…  " + (r.example ? "e.g. " + r.example : "") + (r.cpp ? "\nC++: " + r.cpp : ""), 1));
    for (const [w, k] of D.kinds) list.push(opt(w, "type", "kind · " + k.says, "C++: " + k.cpp, 0));
    for (const [w, s] of D.special) list.push(opt(w, "keyword", s.says, s.cpp ? "C++: " + s.cpp : null, 1));
    addNames(3);
    addLib();
  }
  if (!list.length) return null;
  return { from, options: list, validFor: /^[A-Za-z_][A-Za-z_0-9]*$/ };
}
function famName(r) { return r.family ? r.family + " · " + r.familyName : "is · the one short word"; }
function rootInfo(r) {
  return () => {
    const d = document.createElement("div"); d.className = "epp-cinfo";
    d.innerHTML = cardHTML({ kind: "root", data: r });
    return d;
  };
}
function libInfo(r) {
  return r.kind === "function" ? r.name + "(" + (r.params || []).join(", ") + ") → " + r.returns + "\n" + (r.desc || "") : (r.desc || r.kind);
}
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// ---------- word cards (hover on desktop, tap strip on phones) ----------
export function wordAt(lineText, col) {
  const words = splitWords(lineText);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (col < w.from || col > w.to) continue;
    if (i === 1) {
      if (D.roots.has(w.text)) return { kind: "root", data: D.roots.get(w.text), from: w.from, to: w.to };
      if (D.raylib.has(w.text)) return { kind: "raylib", data: D.raylib.get(w.text), from: w.from, to: w.to };
      if (D.qt.has(w.text)) return { kind: "qt", data: D.qt.get(w.text), from: w.from, to: w.to };
      return null;
    }
    const re = /[A-Za-z_][A-Za-z_0-9]*/g; let m;
    while ((m = re.exec(w.text))) {
      const a = w.from + m.index, b = a + m[0].length, t = m[0];
      if (col < a || col > b) continue;
      if (/^\s*note\b/.test(lineText)) return null;
      if (D.values.has(t) && w.text[m.index + t.length] === "&") return { kind: "value", data: D.values.get(t), from: a, to: b };
      if (D.special.has(t)) return { kind: "special", data: D.special.get(t), from: a, to: b };
      if (D.kinds.has(t)) return { kind: "kind", data: D.kinds.get(t), from: a, to: b };
      if (D.raylib.has(t)) return { kind: "raylib", data: D.raylib.get(t), from: a, to: b };
      if (D.qt.has(t)) return { kind: "qt", data: D.qt.get(t), from: a, to: b };
    }
  }
  return null;
}
export function cardHTML(c) {
  const r = c.data;
  if (c.kind === "root" || c.kind === "value") {
    const fam = r.family ? r.family : "is";
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-root epp-f-${fam}">${esc(r.word)}</b><span class="epp-card-fam">${c.kind === "value" ? "value word · " : "root · "}${esc(r.family ? r.family + " · " + r.familyName : r.familyName)}</span></div>` +
      `<div class="epp-card-says">${esc(r.says)}</div>` +
      (r.who ? `<div class="epp-card-row"><span>who</span>${esc(r.who)}<span>what</span>${esc(r.what)}</div>` : "") +
      (r.example ? `<div class="epp-card-row"><span>example</span><code>${esc(r.example)}</code></div>` : "") +
      (r.cpp ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.cpp)}</code></div>` : "") + `</div>`;
  }
  if (c.kind === "kind" || c.kind === "special")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-${c.kind}">${esc(r.word)}</b><span class="epp-card-fam">${c.kind === "kind" ? "kind" : "special word"}</span></div><div class="epp-card-says">${esc(r.says)}</div>${r.cpp ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.cpp)}</code></div>` : ""}</div>`;
  if (c.kind === "raylib")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-lib">${esc(r.name)}</b><span class="epp-card-fam">raylib ${esc(r.kind)}</span></div><div class="epp-card-says">${esc(r.desc)}</div>${r.kind === "function" ? `<div class="epp-card-row"><span>C++</span><code>${esc(r.returns)} ${esc(r.name)}(${esc((r.params || []).join(", "))})</code></div>` : ""}</div>`;
  if (c.kind === "qt")
    return `<div class="epp-card"><div class="epp-card-top"><b class="epp-qt">${esc(r.name)}</b><span class="epp-card-fam">Qt-compatible layer</span></div><div class="epp-card-says">${esc(r.desc)}</div><div class="epp-card-row"><span>line</span><code>now ${esc(r.name)} ${esc(r.args)}</code></div></div>`;
  return "";
}
const hover = hoverTooltip((view, pos) => {
  const line = view.state.doc.lineAt(pos);
  const c = wordAt(line.text, pos - line.from);
  if (!c) return null;
  return { pos: line.from + c.from, end: line.from + c.to, above: true, create() { const d = document.createElement("div"); d.innerHTML = cardHTML(c); return { dom: d }; } };
}, { hoverTime: 350 });

// ---------- the editor ----------
export function createEditor(opts) {
  let engineDiags = [], runtimeDiags = [], runtimeDoc = null;
  const checker = linter(async (view) => {
    const src = view.state.doc.toString();
    const doc = view.state.doc;
    let errs = localErrors(src);
    let engine = [];
    if (opts.check) {
      try { const r = await opts.check(src); engine = (r && r.errors) || []; } catch (e) { engine = []; }
    }
    if (view.state.doc.toString() !== src) return [];
    const seen = new Set(errs.map(e => e.line));
    engine = engine.filter(e => !(seen.has(e.line) && /three words/i.test(e.message)));
    engineDiags = engine.map(e => toDiag(doc, e, "error", "Web Studio"));
    if (runtimeDoc !== src) runtimeDiags = [];
    const all = errs.map(e => toDiag(doc, e, "error", "three words")).concat(engineDiags, runtimeDiags);
    if (opts.onDiagnostics) opts.onDiagnostics(errs.concat(engine));
    return all;
  }, { delay: 400 });
  const libsCompartment = new Compartment();
  const extensions = [
        lineNumbers(), highlightActiveLineGutter(), highlightSpecialChars(), history(), drawSelection(), dropCursor(),
        indentUnit.of("  "), EditorState.tabSize.of(2), bracketMatching(), closeBrackets(),
        highlightActiveLine(), highlightSelectionMatches(),
        runLineField, highlighter, hover, lintGutter(), checker,
        autocompletion({ override: [ctx => completions(ctx, opts)], activateOnTyping: true, maxRenderedOptions: 80, icons: false }),
        Prec.high(keymap.of([
          { key: "Tab", run: v => { if (v.state.selection.ranges.some(r => !r.empty)) return indentMore(v); v.dispatch(v.state.replaceSelection("  ")); return true; }, shift: indentLess },
          { key: "Mod-Enter", run: () => { opts.onRun && opts.onRun(); return true; } }
        ])),
        keymap.of([...completionKeymap, ...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ autocapitalize: "off", autocorrect: "off", spellcheck: "false", "aria-label": "English++ program" }),
        EditorView.updateListener.of(u => {
          if (u.docChanged && opts.onChange) opts.onChange(u.state.doc.toString());
          if ((u.selectionSet || u.docChanged) && opts.onCursor) {
            const pos = u.state.selection.main.head, line = u.state.doc.lineAt(pos);
            opts.onCursor(wordAt(line.text, pos - line.from), line.number);
          }
        }),
        libsCompartment.of([])
  ];
  const makeState = (doc) => EditorState.create({ doc: doc || "", extensions });
  const view = new EditorView({ parent: opts.parent, state: makeState(opts.doc) });
  return {
    view, makeState,
    getText: () => view.state.doc.toString(),
    setText(t) { view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: t }, selection: { anchor: 0 } }); },
    setState(st) { view.setState(st); },
    insert(text) {
      view.dispatch(view.state.replaceSelection(text)); view.focus();
      if (/[&@]$/.test(text)) startCompletion(view);
    },
    indent() { const r = view.state.selection.main; if (r.empty) view.dispatch(view.state.replaceSelection("  ")); else indentMore(view); view.focus(); },
    outdent() { indentLess(view); view.focus(); },
    focus() { view.focus(); },
    complete() { startCompletion(view); },
    relint() { forceLinting(view); },
    setRunLine(n) { view.dispatch({ effects: runLineEffect.of(n || 0) }); },
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
    }
  };
}
export { EditorState, EditorView };
