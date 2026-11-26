#!/usr/bin/env python3
"""v4: make STAGE (default stage_v4) from the live v3 stage (stage_v3) plus every v4 feature layer.

Each feature layer is a python file ui/v4_hooks_*.py (applied in name order). A layer may define:
  JS_PATCHES   = [(old, new, count), ...]   exact text replacements in js/epp-studio.js (count = times old must occur)
  HTML_PATCHES = [(old, new, count), ...]   same, in epp-studio.html
  SCRIPTS      = ["js/epp-x.js", ...]       extra <script> tags, placed BEFORE js/epp-studio.js (so they can be init'ed by a hook)
  CSS          = ["/abs/or/ui-relative.css"] appended to css/epp-studio.css
  def build(stage: pathlib.Path): ...       copy/generate its own files into the stage (engine, runtime, editor bundle, data)
A layer that is missing simply isn't applied, so every layer can be developed and tested on its own.
"""
import sys, pathlib, shutil, importlib.util
UI = pathlib.Path(__file__).resolve().parent
ROOT = UI.parent
STAGE = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / 'stage_v4'
BASE = ROOT / 'stage_v3'
only = set(sys.argv[2].split(',')) if len(sys.argv) > 2 and sys.argv[2] else None   # optional: apply only these layers

if STAGE.exists(): shutil.rmtree(STAGE)
shutil.copytree(BASE, STAGE)
js = (STAGE / 'js/epp-studio.js').read_text()
html = (STAGE / 'epp-studio.html').read_text()
css = (STAGE / 'css/epp-studio.css').read_text()

def rep(src, old, new, count, what):
    c = src.count(old)
    if c != count: sys.exit('%s: patch target found %d times (want %d): %r' % (what, c, count, old[:100]))
    return src.replace(old, new)

layers = sorted(UI.glob('v4_hooks_*.py'))
applied = []
for p in layers:
    name = p.stem[len('v4_hooks_'):]
    if only is not None and name not in only: continue
    spec = importlib.util.spec_from_file_location(p.stem, p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for (o, n, c) in getattr(m, 'JS_PATCHES', []): js = rep(js, o, n, c, p.name + ' js')
    for (o, n, c) in getattr(m, 'HTML_PATCHES', []): html = rep(html, o, n, c, p.name + ' html')
    for s in getattr(m, 'SCRIPTS', []):
        anchor = '    <script src="js/epp-studio.js"></script>'
        html = rep(html, anchor, '    <script src="%s"></script>\n' % s + anchor, 1, p.name + ' script')
    for c in getattr(m, 'CSS', []):
        cp = pathlib.Path(c); cp = cp if cp.is_absolute() else UI / cp
        css += '\n/* ---- v4 layer: %s (%s) ---- */\n' % (name, cp.name) + cp.read_text()
    if hasattr(m, 'build'): m.build(STAGE)
    applied.append(name)

(STAGE / 'js/epp-studio.js').write_text(js)
(STAGE / 'epp-studio.html').write_text(html)
(STAGE / 'css/epp-studio.css').write_text(css)
print('stage:', STAGE, '· layers:', ', '.join(applied) or '(none)')
