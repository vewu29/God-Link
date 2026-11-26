"""v4 layer 'fb': the C++ runtime side.
  (A) Full build for raylib English++ programs (English++ -> C++ View -> Clang -> raylib canvas)
  (B) interactive console input (std::cin / getline / English++ get wait for the Studio console while the program runs)
  (C) lower peak memory for C++ builds
All logic lives in js/epp-cpp.js (cpp/studio_v4) and fullbuild/cpp/* (cpp/web_v4). epp-studio.js gets one hook line:
Full build asks EppCppMode first; EppCppMode.fullBuildEpp() returns a promise when it takes the build (all programs today).
"""
import pathlib, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent

JS_PATCHES = [
    ("  async function fullBuild() {\n    if (!M || running || fbBusy) return;\n",
     "  async function fullBuild() {\n    if (!M || running || fbBusy) return;\n"
     "    if (window.EppCppMode && EppCppMode.fullBuildEpp) { var fbv4 = EppCppMode.fullBuildEpp(); if (fbv4) return fbv4; }\n", 1),
]


def build(stage):
    stage = pathlib.Path(stage)
    dst = stage / 'fullbuild/cpp'
    src = ROOT / 'cpp/web_v4'
    for p in src.rglob('*'):
        if p.is_dir():
            continue
        rel = p.relative_to(src)
        if rel.parts[0] == 'vendor' or rel.suffix == '.js':
            (dst / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, dst / rel)
    shutil.copy2(ROOT / 'cpp/studio_v4/epp-cpp.js', stage / 'js/epp-cpp.js')
