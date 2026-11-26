#!/usr/bin/env python3
"""v3: make stage_v3/js/epp-studio.js from the live v2 file (stage_v2/js/epp-studio.js) with small, named hooks into the
C++ mode (js/epp-cpp.js). Every hook first asks the C++ mode whether the *open file* is C++; for an English++ file each
hook falls through to the v2 code unchanged, so English++ mode behaves exactly as before.
Also patches epp-studio.html (one extra <script>) and writes the C++ styles."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'stage_v2/js/epp-studio.js'
DST = ROOT / 'stage_v3/js/epp-studio.js'
s = SRC.read_text()
n_patches = 0
def rep(old, new, count=1):
    global s, n_patches
    c = s.count(old)
    if c != count: sys.exit('patch target found %d times (want %d): %r' % (c, count, old[:90]))
    s = s.replace(old, new); n_patches += 1

# 1. a file's editor state: C++ files get the C++ mode
rep('  function syncActive() { if (editor && files[active]) files[active].state = editor.view.state; }',
    '  function syncActive() { if (editor && files[active]) files[active].state = editor.view.state; }\n'
    '  function mkState(f) { return window.EppCppMode && EppCppMode.isCppName(f.name) && editor.makeCppState ? editor.makeCppState(f.text || "") : editor.makeState(f.text || ""); }\n'
    '  function cppTab() { if (window.EppCppMode) EppCppMode.onTab(); }')
rep('    if (!f.state) f.state = editor.makeState(f.text || "");\n    editor.view.setState(f.state);\n    renderTabs(); editor.relint();\n',
    '    if (!f.state) f.state = mkState(f);\n    editor.view.setState(f.state);\n    renderTabs(); editor.relint(); cppTab();\n')
rep('    active = 0; files[0].state = editor.makeState(files[0].text || ""); editor.view.setState(files[0].state);\n    renderTabs(); editor.relint(); saveDraft();\n',
    '    active = 0; files[0].state = mkState(files[0]); editor.view.setState(files[0].state);\n    renderTabs(); editor.relint(); saveDraft(); cppTab();\n')
rep('      var f = files[active]; if (!f.state) f.state = editor.makeState(f.text || ""); editor.view.setState(f.state);\n      renderTabs(); saveDraft(); editor.relint(); return;',
    '      var f = files[active]; if (!f.state) f.state = mkState(f); editor.view.setState(f.state);\n      renderTabs(); saveDraft(); editor.relint(); cppTab(); return;')
# 2. "+ File" can make a .cpp / .h
rep('      var n = prompt("Name of the new file (it ends in .epp):", "tools.epp");',
    '      var n = prompt("Name of the new file (it ends in .epp — or .cpp / .h for C++):", "tools.epp");')
rep('      syncActive(); files.push({ name: n, text: "note " + n + "\\n", state: null }); openTab(files.length - 1); saveDraft(); editor.focus(); return;',
    '      var cppNew = window.EppCppMode && EppCppMode.isCppName(n);\n'
    '      var hasMainCpp = files.some(function (f) { return /\\.(cpp|cc|cxx)$/i.test(f.name) && /\\bint\\s+main\\s*\\(/.test(f.state ? f.state.doc.toString() : f.text || ""); });\n'
    '      var newText = !cppNew ? "note " + n + "\\n" : /\\.(h|hpp|hh|hxx)$/i.test(n) ? "// " + n + "\\n#pragma once\\n\\n" : hasMainCpp ? "// " + n + "\\n#include <iostream>\\n\\n" : "#include <iostream>\\n\\nint main() {\\n    std::cout << \\"Hello!\\" << std::endl;\\n    return 0;\\n}\\n";\n'
    '      syncActive(); files.push({ name: n, text: newText, state: null }); openTab(files.length - 1); saveDraft(); editor.focus(); return;')
# 3. Run / Stop / New / Blocks / Outline: the open C++ file takes them
rep('  async function run() {\n    if (!M || running) return;',
    '  async function run() {\n    if (window.EppCppMode && EppCppMode.handlesRun()) return EppCppMode.run();\n    if (!M || running) return;')
rep('  function stop() {\n    if (fbBusy && FB) { try { FB.stop(); } catch (e) {} }',
    '  function stop() {\n    if (window.EppCppMode && EppCppMode.stop()) return;\n    if (fbBusy && FB) { try { FB.stop(); } catch (e) {} }')
rep('  $("esNew").addEventListener("click", function () {\n    if (editor.getText()',
    '  $("esNew").addEventListener("click", function () {\n    if (window.EppCppMode && EppCppMode.newProgram()) return;\n    if (editor.getText()')
rep('  function openBlocks() {\n    $("esBlkList")',
    '  function openBlocks() {\n    if (window.EppCppMode && EppCppMode.openBlocks()) return;\n    $("esBlkList")')
rep('  function openOutline() {\n    var o = editor.outline();',
    '  function openOutline() {\n    if (window.EppCppMode && EppCppMode.outline()) return;\n    var o = editor.outline();')
# the Run button: a C++ file can be built even before the English++ engine finished loading
rep('    running = on; $("esRun").disabled = on || !M; $("esStop").disabled = !on;',
    '    running = on; $("esRun").disabled = on || (!M && !(window.EppCppMode && EppCppMode.isActive())); $("esStop").disabled = !on;')
# 4. Examples: a C++ group at the end of the list (open first when a C++ file is open)
rep('      var open = q ? shown < 6 : gi < 1;',
    '      var cppOn = !!(window.EppCppMode && EppCppMode.isActive());\n      var open = q ? shown < 6 : g.cpp ? cppOn : (gi < 1 && !cppOn);')
rep('    if (!EX) fetch("data/epp-studio/examples.json").then(function (r) { return r.json(); }).then(function (j) {',
    '    if (!EX) Promise.all([fetch("data/epp-studio/examples.json").then(function (r) { return r.json(); }), window.EppCppMode ? EppCppMode.examples() : null]).then(function (a) { var j = a[0]; if (a[1] && a[1].items) { a[1].items.forEach(function (it) { it.cpp = true; }); j.groups.push({ name: a[1].name || "C++", items: a[1].items, cpp: true }); } return j; }).then(function (j) {')
rep('    var it = EX.groups[+b.dataset.g].items[+b.dataset.i];\n    syncActive();\n    var code = it.code',
    '    var it = EX.groups[+b.dataset.g].items[+b.dataset.i];\n    if (it.cpp) { $("esExSheet").classList.add("hidden"); history.replaceState(null, "", location.href.split("#")[0]); EppCppMode.loadExample(it); return; }\n    syncActive();\n    var code = it.code')
# 5. hand the C++ mode what it needs, after the Studio started
rep('    window.EppStudio = { editor: editor,',
    '    if (window.EppCppMode) EppCppMode.init({\n'
    '      editor: editor, files: function () { return files; }, active: function () { return active; }, fileList: fileList, syncActive: syncActive, setFiles: setFiles, openTab: openTab,\n'
    '      engine: function () { return M; }, toast: toast, status: status, conClear: conClear, conNote: conNote, conWrite: conWrite, con: function () { return con; }, readLine: readLine,\n'
    '      showPane: showPane, setBusy: function (on) { setRunning(on); if (!on) $("esRun").disabled = !M && !EppCppMode.isActive(); }, running: function () { return running; },\n'
    '      load: load, store: store, sheetOpen: sheetOpen, sheetClose: sheetClose, saveDraft: saveDraft, touch: function () { return touch; }, eppEvent: eppEvent,\n'
    '      pendingInput: function () { return pendingInput; } });\n'
    '    window.EppStudio = { cppMode: window.EppCppMode, editor: editor,')
DST.write_text(s)
print('epp-studio.js: %d hooks, %d -> %d bytes' % (n_patches, SRC.stat().st_size, DST.stat().st_size))

h = (ROOT / 'stage_v2/epp-studio.html').read_text()
old = '    <script src="js/epp-studio.js"></script>'
assert h.count(old) == 1
h = h.replace(old, '    <script src="js/epp-cpp.js"></script>\n' + old)
(ROOT / 'stage_v3/epp-studio.html').write_text(h)
print('epp-studio.html: + js/epp-cpp.js')
