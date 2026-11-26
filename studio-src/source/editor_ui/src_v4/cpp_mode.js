// English++ Web Studio v3 — the C++ mode of the editor (same EditorView; a C++ file simply has a C++ EditorState).
// Highlighting: @codemirror/lang-cpp. Suggestions: C++ keywords, std names, the program's own names, every raylib /
// raymath / rcamera function with its signature, structs (and their fields after "."), colours, keys and other constants.
// Phone rules are the same as the English++ mode: no detail panel over the list, 44 px rows, and Enter never inserts a
// suggestion you did not pick with the arrow keys (Tab or a tap takes the top one).
import { EditorState, Prec } from "@codemirror/state";
import {
  EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, highlightSpecialChars, dropCursor
} from "@codemirror/view";
import { history, defaultKeymap, historyKeymap, indentLess, indentMore, insertNewlineAndIndent, toggleComment } from "@codemirror/commands";
import { indentUnit, bracketMatching, indentOnInput, syntaxHighlighting, HighlightStyle, foldGutter, foldKeymap } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import {
  autocompletion, closeBrackets, closeBracketsKeymap, startCompletion, closeCompletion, acceptCompletion,
  completionStatus, selectedCompletionIndex, setSelectedCompletion, snippet, snippetCompletion,
  nextSnippetField, prevSnippetField, hasNextSnippetField, hasPrevSnippetField, clearSnippet
} from "@codemirror/autocomplete";
import { lintGutter, setDiagnostics } from "@codemirror/lint";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { cpp } from "@codemirror/lang-cpp";

const C = { fn: new Map(), struct: new Map(), color: new Map(), constant: new Map(), keywords: [], std: [], includes: [], ready: false };
export function setCppData(d) {
  if (!d) return;
  for (const f of d.functions || []) if (!C.fn.has(f.name)) C.fn.set(f.name, f);
  for (const s of d.structs || []) C.struct.set(s.name, s);
  for (const c of d.colors || []) C.color.set(c.name, c);
  for (const k of d.constants || []) C.constant.set(k.name, k);
  C.keywords = d.keywords || []; C.std = d.std || []; C.includes = d.includes || [];
  C.ready = true;
}
export function cppData() { return C; }
export const isCppName = n => /\.(cpp|cc|cxx|c\+\+|h|hpp|hh|hxx)$/i.test(n || "");

const style = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.modifier], class: "cpp-kw" },
  { tag: [t.typeName, t.standard(t.typeName)], class: "cpp-type" },
  { tag: [t.string, t.special(t.string), t.character], class: "cpp-str" },
  { tag: [t.number, t.bool, t.null, t.atom], class: "cpp-num" },
  { tag: [t.lineComment, t.blockComment, t.comment], class: "cpp-com" },
  { tag: [t.processingInstruction, t.meta], class: "cpp-pp" },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName], class: "cpp-fn" },
  { tag: [t.propertyName], class: "cpp-prop" },
  { tag: [t.className, t.namespace], class: "cpp-type" },
  { tag: [t.operator, t.punctuation, t.bracket, t.derefOperator], class: "cpp-op" }
]);

// ---------- names in the program (every open C++ file) ----------
const KW = new Set();
function ownNames(text, here) {
  const out = new Map();
  const strip = text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, " ");
  const lineOf = i => text.slice(0, i).split("\n").length;
  const add = (name, kind, i) => { if (!KW.has(name) && !out.has(name)) out.set(name, { name, kind, line: lineOf(i), here }); };
  let m;
  const reType = /\b(?:class|struct|enum(?:\s+class)?|union|namespace)\s+([A-Za-z_]\w*)/g;
  while ((m = reType.exec(strip))) add(m[1], "type", m.index);
  const reFn = /\b([A-Za-z_][\w:<>,\s\*&]*?)\s+\**&?([A-Za-z_]\w*)\s*\(([^;{)]*)\)\s*(?:const\s*)?(?:noexcept\s*)?(?:override\s*)?\{/g;
  while ((m = reFn.exec(strip))) if (!/^(if|for|while|switch|return|else|catch)$/.test(m[2])) add(m[2], "function", m.index);
  const reVar = /\b(?:int|float|double|bool|char|auto|long|short|unsigned|size_t|string|std::string|Vector2|Vector3|Vector4|Color|Rectangle|Camera2D|Camera3D|Camera|Texture2D|Texture|Image|Font|Sound|Music|Model|Mesh|Matrix|Ray|BoundingBox|RenderTexture2D|[A-Z]\w*(?:<[^;()]*>)?|std::\w+(?:<[^;()]*>)?|vector<[^;()]*>|map<[^;()]*>)\s*[&\*]*\s+([A-Za-z_]\w*)\s*(?=[=;,\[\{\)(:])/g;
  while ((m = reVar.exec(strip))) add(m[1], "variable", m.index);
  const reDefine = /#\s*define\s+([A-Za-z_]\w*)/g;
  while ((m = reDefine.exec(strip))) add(m[1], "constant", m.index);
  return out;
}
// the type of a name, for "ball." / "cam->" field suggestions
function typeOf(text, name) {
  const re = new RegExp("\\b([A-Z]\\w*)\\s*[&\\*]*\\s+" + name + "\\b", "g"); let m, last = null;
  while ((m = re.exec(text))) last = m[1];
  return last;
}

function sig(f) { return f.ret + " " + f.name + "(" + f.params.join(", ") + ")"; }
function fnSnippet(f) {
  if (!f.params.length) return f.name + "()";
  return f.name + "(" + f.params.map((p, i) => "${" + (i + 1) + ":" + (p.match(/([A-Za-z_]\w*)\s*(\[\])?$/) || [, "x"])[1] + "}").join(", ") + ")";
}
function rank(label, p) {
  if (!p) return 1;
  if (label.startsWith(p)) return 4;
  const l = label.toLowerCase(), q = p.toLowerCase();
  if (l.startsWith(q)) return 3;
  if (q.length >= 2 && l.includes(q)) return 2;
  return 0;
}

export function cppApi(ctx) {
  const { opts, api, navField, moveSel } = ctx;
  for (const k of C.keywords) KW.add(k);
  const otherTexts = () => (opts.otherFiles ? opts.otherFiles() : []).filter(f => isCppName(f.name)).map(f => f.text);

  const source = c => {
    const st = c.state, pos = c.pos, line = st.doc.lineAt(pos), before = line.text.slice(0, pos - line.from);
    if (/^\s*\/\/|\/\/.*$/.test(before) && /\/\//.test(before)) return null;            // in a comment
    if ((before.match(/"/g) || []).length % 2 === 1 && !/#\s*include\s*"[^"]*$/.test(before)) return null; // in a string
    let m;
    if ((m = /#\s*include\s*([<"])([\w.\/]*)$/.exec(before))) {
      const p = m[2], close = m[1] === "<" ? ">" : '"';
      const options = C.includes.filter(h => rank(h, p)).map(h => ({ label: h, type: "namespace", detail: /\.h$/.test(h) ? "raylib header" : "standard library", apply: h + close }));
      return { from: pos - p.length, options, filter: false };
    }
    if ((m = /([A-Za-z_]\w*)\s*(\.|->)\s*(\w*)$/.exec(before))) {        // fields of a raylib struct
      const ty = typeOf(st.doc.toString() + "\n" + otherTexts().join("\n"), m[1]);
      const s = ty && C.struct.get(ty);
      if (!s) return null;
      const p = m[3];
      const options = s.fields.filter(f => rank(f.name, p)).map(f => ({ label: f.name, type: "property", detail: f.type + (f.desc ? " — " + f.desc : ""), boost: rank(f.name, p) }));
      return options.length ? { from: pos - p.length, options, filter: false } : null;
    }
    m = /(std::)?([A-Za-z_]\w*)$/.exec(before);
    const p = m ? m[2] : "";
    if (!p && !c.explicit) return null;
    if (m && m[1]) {
      const options = C.std.filter(n => rank(n, p)).map(n => ({ label: n, type: "namespace", detail: "std::" + n, boost: rank(n, p) }));
      return { from: pos - p.length, options, filter: false };
    }
    const out = [];
    const push = (o, r) => { o.boost = r; out.push(o); };
    const names = ownNames(st.doc.toString(), true);
    for (const t of otherTexts()) for (const [k, v] of ownNames(t, false)) if (!names.has(k)) names.set(k, v);
    for (const [n, v] of names) { if (n === p) continue; const r = rank(n, p); if (r) push({ label: n, type: v.kind === "function" ? "function" : v.kind === "type" ? "class" : "variable", detail: v.kind + (v.here ? ", line " + v.line : "") }, r + 0.5); }
    for (const k of C.keywords) { const r = rank(k, p); if (r && k !== p) push({ label: k, type: "keyword", detail: "C++ keyword" }, r); }
    if (/\busing\s+namespace\s+std\b/.test(st.doc.toString())) for (const n of C.std) { const r = rank(n, p); if (r && n !== p) push({ label: n, type: "namespace", detail: "std::" + n }, r - 0.2); }
    if (p.length >= 1) {
      for (const f of C.fn.values()) { const r = rank(f.name, p); if (r) push(snippetCompletion(fnSnippet(f), { label: f.name, type: "function", detail: sig(f) + (f.desc ? " — " + f.desc : "") }), r - 0.1); }
      for (const s of C.struct.values()) { const r = rank(s.name, p); if (r) push({ label: s.name, type: "class", detail: "raylib struct { " + s.fields.map(f => f.name).join(", ") + " }" }, r); }
      for (const c of C.color.values()) { const r = rank(c.name, p); if (r) push({ label: c.name, type: "constant", detail: "Color { " + c.rgba.join(", ") + " }" + (c.desc ? " — " + c.desc : "") }, r - 0.1); }
      for (const k of C.constant.values()) { const r = rank(k.name, p); if (r) push({ label: k.name, type: "constant", detail: k.enum + (k.desc ? " — " + k.desc : "") }, r - 0.3); }
    }
    out.sort((a, b) => b.boost - a.boost || a.label.length - b.label.length || (a.label < b.label ? -1 : 1));
    const list = out.slice(0, 60);
    if (list.length) list[0]._top = true;
    return list.length ? { from: pos - p.length, options: list, filter: false } : null;
  };

  function enterKey(view) {
    if (completionStatus(view.state) === "active" && selectedCompletionIndex(view.state) != null && view.state.field(navField, false)) return acceptCompletion(view);
    if (completionStatus(view.state)) closeCompletion(view);
    return insertNewlineAndIndent(view);
  }
  function tabKey(view) {
    if (completionStatus(view.state) === "active") {
      if (selectedCompletionIndex(view.state) == null) view.dispatch({ effects: setSelectedCompletion(0) });
      if (acceptCompletion(view)) return true;
    }
    if (hasNextSnippetField(view.state)) return nextSnippetField(view);
    if (view.state.selection.ranges.some(r => !r.empty)) return indentMore(view);
    view.dispatch(view.state.replaceSelection("    ")); return true;
  }
  // a closing } typed on its own line steps back out (indentOnInput does it with the C++ grammar's indent rules)
  const extensions = [
    lineNumbers(), foldGutter(), highlightActiveLineGutter(), highlightSpecialChars(), history(), drawSelection(), dropCursor(),
    indentUnit.of("    "), EditorState.tabSize.of(4), EditorState.allowMultipleSelections.of(true),
    cpp(), syntaxHighlighting(style), indentOnInput(), bracketMatching(), closeBrackets(),
    highlightActiveLine(), highlightSelectionMatches(), lintGutter(), navField,
    autocompletion({
      override: [source], activateOnTyping: true, maxRenderedOptions: 60, icons: false,
      selectOnOpen: false, interactionDelay: 0, defaultKeymap: false,
      optionClass: c => (c._top ? "epp-top" : "") + " cpp-opt"
    }),
    Prec.highest(keymap.of([
      { key: "Enter", run: enterKey },
      { key: "Tab", run: tabKey, shift: v => hasPrevSnippetField(v.state) ? prevSnippetField(v) : indentLess(v) },
      { key: "ArrowDown", run: moveSel(true) }, { key: "ArrowUp", run: moveSel(false) },
      { key: "PageDown", run: moveSel(true, "page") }, { key: "PageUp", run: moveSel(false, "page") },
      { key: "Escape", run: v => { if (completionStatus(v.state)) { closeCompletion(v); return true; } return clearSnippet(v); } },
      { key: "Ctrl-Space", run: startCompletion }, { key: "Mod-i", run: startCompletion },
      { key: "Mod-Enter", run: () => { opts.onRun && opts.onRun(); return true; } },
      { key: "F5", run: () => { opts.onRun && opts.onRun(); return true; }, preventDefault: true },
      { key: "Mod-/", run: toggleComment }, { key: "Ctrl-/", run: toggleComment }
    ])),
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...searchKeymap, ...foldKeymap]),
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({ autocapitalize: "off", autocorrect: "off", spellcheck: "false", "aria-label": "C++ program" }),
    EditorView.editorAttributes.of({ class: "cm-cpp" }),
    EditorView.updateListener.of(u => {
      if (u.docChanged && opts.onChange) opts.onChange(u.state.doc.toString());
      if (u.docChanged) { /* compiler errors belong to the text they were found in */
        const has = u.state.field && u.startState.doc !== u.state.doc;
        if (has && cppDiagDoc && cppDiagDoc !== u.state.doc.toString()) { /* keep marks until the next build; they move with edits */ }
      }
    })
  ];
  let cppDiagDoc = null;
  const makeCppState = doc => EditorState.create({ doc: doc || "", extensions });
  const view = api.view;
  const toDiags = (doc, errs) => errs.map(e => {
    const n = Math.max(1, Math.min(doc.lines, e.line | 0 || 1)), line = doc.line(n);
    let from = line.from + Math.min(Math.max(0, (e.column | 0) - 1), line.length);
    let to = from;
    const word = /^[A-Za-z_0-9]+/.exec(line.text.slice(from - line.from));
    if (word) to = from + word[0].length;
    if (to === from) { const lead = line.text.match(/^\s*/)[0].length; from = line.from + Math.min(lead, line.length); to = Math.max(line.to, from + 1); }
    return { from, to: Math.min(doc.length, to), severity: e.severity || "error", message: e.message, source: e.source || "Clang" };
  });
  return {
    makeCppState,
    isCppState: st => !!(st && st.facet(EditorView.editorAttributes).some(a => a && a.class === "cm-cpp")),
    isCpp: () => !!view.state.facet(EditorView.editorAttributes).some(a => a && a.class === "cm-cpp"),
    // errors: [{line, column, message, severity?}] for the shown file
    setCppDiagnostics(errs) { cppDiagDoc = view.state.doc.toString(); view.dispatch(setDiagnostics(view.state, toDiags(view.state.doc, errs || []))); },
    // same for a file that is not on screen: returns its new state
    diagnoseState(state, errs) { return state.update(setDiagnostics(state, toDiags(state.doc, errs || []))).state; },
    cppNames() { return [...ownNames(view.state.doc.toString(), true).values()]; },
    cppOutline() {
      return [...ownNames(view.state.doc.toString(), true).values()].filter(n => n.kind === "function" || n.kind === "type").sort((a, b) => a.line - b.line);
    },
    cppComplete() { startCompletion(view); },
    insertCppBlock(template) {
      const st = view.state, s = st.selection.main, line = st.doc.lineAt(s.head);
      const ind = line.text.match(/^\s*/)[0];
      let at, base;
      if (!line.text.trim()) { at = line.to; base = ind; }
      else { const opens = /\{\s*$/.test(line.text); base = ind + (opens ? "    " : ""); view.dispatch({ changes: { from: line.to, insert: "\n" + base } }); at = line.to + 1 + base.length; }
      // CodeMirror's snippet() already gives every later line the indentation of the line it starts on
      const tpl = template.split("\n").map(l => l.replace(/\t/g, "    ")).join("\n");
      snippet(tpl)({ state: view.state, dispatch: tr => view.dispatch(tr) }, null, at, at);
      view.focus();
    }
  };
}
