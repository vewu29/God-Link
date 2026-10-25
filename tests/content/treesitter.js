// Syntax-only checks for single lines and snippets, using tree-sitter's
// prebuilt grammars (tree-sitter-wasms). A snippet passes when ANY of the
// shapes a language offers — the line alone, inside a function, inside a
// class — parses with no error nodes. Only grammar is checked: the names
// a line uses need not exist.
"use strict";
const Parser = require("web-tree-sitter");

let ready = null;
const langs = {};
async function parserFor(grammar) {
  if (!ready) ready = Parser.init();
  await ready;
  if (!langs[grammar]) langs[grammar] = await Parser.Language.load(require.resolve(`tree-sitter-wasms/out/tree-sitter-${grammar}.wasm`));
  const p = new Parser();
  p.setLanguage(langs[grammar]);
  return p;
}

// items: strings; shapes(code) -> candidate sources; pre(code) -> code
// with things the grammar cannot know (macros) removed.
async function tsErrors(grammar, items, shapes, pre = (c) => c) {
  const p = await parserFor(grammar);
  const errs = [];
  items.forEach((raw, i) => {
    const code = pre(raw);
    const ok = shapes(code).some((s) => !p.parse(s).rootNode.hasError);
    if (!ok) errs.push({ i, err: "does not parse as " + grammar });
  });
  return errs;
}

module.exports = { tsErrors };
