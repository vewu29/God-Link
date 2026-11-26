"""v4 core layer (coordinator): phone toolbar More menu, Project sheet (file list, search every file,
.zip export/import), Fix it (console offer after Run stops on a mistake; editor lint actions come from
the debug layer's editor hook `fixesFor`)."""
import pathlib, shutil
UI = pathlib.Path(__file__).resolve().parent

SCRIPTS = ["js/epp-core.js", "js/epp-fixit.js"]
CSS = ["v4/epp-core.css"]

JS_PATCHES = [
    # Run stopped on a mistake: offer a certain fix under the message
    ("      else if (r.error.line) { openTab(0); editor.showRuntimeError(r.error); }\n",
     "      else if (r.error.line) { openTab(0); editor.showRuntimeError(r.error); }\n"
     "      if (r.error.line && window.EppFixIt && !r.error.file) try { EppFixIt.offerRun(r.error); } catch (e) {}\n", 1),
    # hand the core module the Studio's hooks
    ("    window.EppStudio = { cppMode: window.EppCppMode,",
     "    if (window.EppCore) EppCore.init({ editor: editor, files: function () { syncActive(); return fileList(); }, setFiles: setFiles, openTab: openTab,\n"
     "      toast: toast, sheetOpen: sheetOpen, sheetClose: sheetClose });\n"
     "    window.EppStudio = { cppMode: window.EppCppMode,", 1),
]

def build(stage):
    for f in ("epp-core.js", "epp-fixit.js"):
        shutil.copy(UI / "v4" / f, stage / "js" / f)
