#!/usr/bin/env python3
"""data/epp-studio/cpp.json for the C++ mode autocomplete: every raylib/raymath function with its signature (from the
same raylib 5.5 headers the program is compiled against), structs with fields, colours, enum constants, C++ keywords, std names."""
import re, json, sys
import os
H = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'raylib-wasi/out/include/')
out = {'functions': [], 'structs': [], 'colors': [], 'constants': []}
def funcs(text, api, lib):
    for m in re.finditer(api + r'\s+([\w\s\*]+?)\s*\b(\w+)\(([^)]*)\);\s*(?://\s*(.*))?', text):
        ret, name, params, desc = m.group(1).strip(), m.group(2), m.group(3).strip(), (m.group(4) or '').strip()
        ps = [] if params in ('', 'void') else [p.strip() for p in params.split(',')]
        out['functions'].append({'name': name, 'ret': re.sub(r'\s+', ' ', ret), 'params': ps, 'desc': desc, 'lib': lib})
rl = open(H + 'raylib.h').read(); funcs(rl, 'RLAPI', 'raylib'); funcs(open(H + 'rcamera.h').read(), 'RLAPI', 'rcamera')
for m in re.finditer(r'(?://\s*([^\n]*)\n)?RMAPI\s+([\w\s\*]+?)\s*\b(\w+)\(([^)]*)\)\s*\n\{', open(H + 'raymath.h').read()):
    ps = [] if m.group(4).strip() in ('', 'void') else [x.strip() for x in m.group(4).split(',')]
    out['functions'].append({'name': m.group(3), 'ret': m.group(2).strip(), 'params': ps, 'desc': (m.group(1) or '').strip(), 'lib': 'raymath'})
for m in re.finditer(r'#define (\w+)\s+CLITERAL\(Color\)\{\s*([\d, ]+)\}\s*(?://\s*(.*))?', rl): out['colors'].append({'name': m.group(1), 'rgba': [int(x) for x in m.group(2).split(',')], 'desc': (m.group(3) or '').strip()})
for m in re.finditer(r'typedef struct (\w+) \{(.*?)\} \1;', rl, re.S):
    fields = []
    for fm in re.finditer(r'^\s*([\w\s\*]+?)\s*\b(\w+)(\[\d+\])?;\s*(?://\s*(.*))?$', m.group(2), re.M): fields.append({'name': fm.group(2), 'type': fm.group(1).strip() + (fm.group(3) or ''), 'desc': (fm.group(4) or '').strip()})
    out['structs'].append({'name': m.group(1), 'fields': fields})
for alias in ['Quaternion Vector4', 'Texture2D Texture', 'TextureCubemap Texture', 'RenderTexture2D RenderTexture', 'Camera Camera3D']:
    a, b = alias.split(); src = next((s for s in out['structs'] if s['name'] == b), None)
    if src: out['structs'].append({'name': a, 'fields': src['fields'], 'alias': b})
for m in re.finditer(r'typedef enum \{(.*?)\} (\w+);', rl, re.S):
    for cm in re.finditer(r'^\s*(\w+)\s*(?:=\s*([^,/\n]+))?,?\s*(?://\s*(.*))?$', m.group(1), re.M): out['constants'].append({'name': cm.group(1), 'enum': m.group(2), 'desc': (cm.group(3) or '').strip()})
out['keywords'] = ('alignas alignof auto bool break case catch char char8_t char16_t char32_t class concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while override final size_t').split()
out['std'] = ('cout cin cerr endl string vector map unordered_map set unordered_set multimap pair tuple array deque list queue priority_queue stack optional variant any function unique_ptr shared_ptr make_unique make_shared move forward swap sort stable_sort reverse find find_if count count_if accumulate transform for_each min max min_element max_element clamp abs sqrt pow sin cos tan atan2 floor ceil round fabs to_string stoi stod stof getline istringstream ostringstream stringstream setw setprecision fixed boolalpha hex size_t begin end distance iota fill copy remove remove_if unique lower_bound upper_bound binary_search next_permutation format ranges views numeric_limits runtime_error invalid_argument out_of_range exception string_view span chrono rand srand exit').split()
out['includes'] = 'iostream string vector map unordered_map set unordered_set algorithm numeric cmath sstream iomanip memory functional utility array deque list queue stack optional variant tuple stdexcept chrono random format ranges cstdio cstdlib cstring cctype limits raylib.h raymath.h rlgl.h rcamera.h'.split()
json.dump(out, open(sys.argv[1], 'w'), separators=(',', ':'))
print({k: len(v) for k, v in out.items()})
