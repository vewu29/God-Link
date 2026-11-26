"""v4 layer `debug`: the English++ debugger, big-program speed-ups and the fix-it hook.
Engine: cpp/engine_v4 (= cpp/engine_v3 + src/debug.{h,cpp}, one test per line in Interp::Exec, the debug calls in
src_web/wasm_api.cpp + post.js). Editor: ui/src_v4/editor.js bundled by ui/build_editor_v4.js. UI: js/epp-debug.js + css.
Notes: V4_DBG_NOTES.md. API: ENGINE_API_V4.md.
"""
import pathlib, shutil, subprocess, gzip, base64
UI = pathlib.Path(__file__).resolve().parent
ROOT = UI.parent
ENG = ROOT / 'cpp/engine_v4/dist'
SRC = UI / 'v4/debug'          # this layer's own page files (epp-debug.js, epp-debug.css)

SCRIPTS = ['js/epp-debug.js']
CSS = [str(SRC / 'epp-debug.css')]

JS_PATCHES = [
    # (B) the live check sees the other tabs (a main.epp with `now xim "x.epp"` was red until the first Run)
    ('      check: function (src) { if (!M) return null; try { return M.check(src); } catch (e) { return null; } },\n',
     '      check: function (src) { if (!M) return null; try { if (window.EppDebug) EppDebug.syncFiles(M); return M.check(src); } catch (e) { return null; } },\n', 1),
    # (A) Run goes through the debugger when breakpoints are set or Debug was pressed (else exactly the v3 M.run)
    ('    try { r = await M.run(main); }\n',
     '    try { r = await (window.EppDebug && EppDebug.active() ? EppDebug.go(M, main) : M.run(main)); }\n', 1),
    # (C) fix-it hook: the editor asks for line fixes; the coordinator's EppFixIt fills them in
    ('      onRootTable: function (w) { openRootTable(w); },\n',
     '      onRootTable: function (w) { openRootTable(w); },\n'
     '      fixesFor: function (d) { return window.EppFixIt ? EppFixIt.fixesFor(d) : null; },\n', 1),
    # (B) other files: hand the editor the file's CodeMirror text too, so it can skip files that did not change (no toString per keystroke)
    ('      otherFiles: function () { return files.map(function (f, i) { return i === active ? null : { name: f.name, text: f.state ? f.state.doc.toString() : (f.text || "") }; }).filter(Boolean); },\n',
     '      otherFiles: function () { return files.map(function (f, i) { return i === active ? null : { name: f.name, doc: f.state ? f.state.doc : null, get text() { return f.state ? f.state.doc.toString() : (f.text || ""); } }; }).filter(Boolean); },\n', 1),
    # (A) the debugger starts after the page is up (it finds the editor, the engine and Run through window.EppStudio)
    ('    window.EppStudio = { cppMode: window.EppCppMode,',
     '    if (window.EppDebug) setTimeout(function () { EppDebug.init({ setRunning: setRunning, conClear: conClear, conNote: conNote, conWrite: conWrite, syncActive: syncActive, fileList: fileList, files: function () { return files; }, active: function () { return active; }, openTab: openTab, showPane: showPane, status: status, touch: function () { return touch; }, qtReset: qtReset, running: function () { return running; } }); }, 0);\n'
     '    window.EppStudio = { cppMode: window.EppCppMode,', 1),
]


def build(stage):
    stage = pathlib.Path(stage)
    # engine: js + gzip -9n | base64 (text only)
    (stage / 'engine').mkdir(exist_ok=True)
    shutil.copy(ENG / 'epp_engine.js', stage / 'engine/epp_engine.js')
    raw = (ENG / 'epp_engine.wasm').read_bytes()
    gz = subprocess.run(['gzip', '-9n', '-c'], input=raw, capture_output=True, check=True).stdout
    (stage / 'engine/epp_engine.wasm.gz.b64').write_bytes(base64.b64encode(gz))
    # editor bundle
    subprocess.run(['node', str(UI / 'build_editor_v4.js'), str(stage / 'js/vendor/codemirror-epp.js')], check=True, cwd=str(UI))
    # page script
    shutil.copy(SRC / 'epp-debug.js', stage / 'js/epp-debug.js')
