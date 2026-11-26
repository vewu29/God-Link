#!/usr/bin/env python3
"""src_v3/editor.js = src/editor.js + 3 small additions (import, Object.assign of the C++ API, exports). English++ code untouched."""
import pathlib, sys, shutil
H = pathlib.Path(__file__).resolve().parent
s = (H / 'src/editor.js').read_text()
def rep(a, b):
    global s
    if s.count(a) != 1: sys.exit('editor patch target not found once: ' + a[:60])
    s = s.replace(a, b)
rep('import { ROOT_USE } from "./usage.js";', 'import { ROOT_USE } from "./usage.js";\nimport { cppApi, setCppData, isCppName } from "./cpp_mode.js";')
rep("  return api;\n}\nexport function renameChanges", "  Object.assign(api, cppApi({ opts, api, navField, moveSel })); // v3: C++ files get a C++ EditorState in the same view\n  return api;\n}\nexport function renameChanges")
rep("export { EditorState, EditorView };", "export { EditorState, EditorView, setCppData, isCppName };")
(H / 'src_v3/editor.js').write_text(s)
shutil.copy(H / 'src/usage.js', H / 'src_v3/usage.js')
print('src_v3/editor.js patched')
