#!/usr/bin/env python3
import json, sys, pathlib
D = pathlib.Path(__file__).resolve().parent.parent / 'examples'
T = {'01_hello': 'Hello, V! (C++)', '02_loops': 'Loops, vectors and strings', '03_class': 'A class: Dog', '04_ball': 'raylib: Bouncing ball', '05_orbit': 'raylib: 3D orbit camera', '06_game': 'raylib game: Star Catcher'}
items = []
for k, title in T.items():
    code = (D / (k + '.cpp')).read_text()
    it = {'id': 'cpp_' + k, 'title': title, 'code': code, 'raylib': '#include "raylib.h"' in code, 'files': [{'name': 'main.cpp', 'text': code}]}
    out = D / (k + '.out')
    if out.exists(): it['output'] = out.read_text()
    items.append(it)
json.dump({'name': 'C++ (real Clang in your browser)', 'items': items}, open(sys.argv[1], 'w'), indent=0)
print(len(items), 'C++ examples')
