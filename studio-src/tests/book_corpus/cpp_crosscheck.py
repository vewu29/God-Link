#!/usr/bin/env python3
"""C++ View cross-check: for every scored Book program (ids 0-309), turn the English++
into C++ with ToCpp, build it with g++ -std=c++20 -O1, run it with empty input, and
compare what it prints with the Book's output (trailing newlines don't count, as in run_corpus.py)."""
import json, os, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
TOCPP = os.path.join(HERE, '..', 'engine', 'cppview_dev', 'tocpp')
WORK = os.path.join(HERE, 'cpp_tmp')
TOOLS = os.path.join(HERE, 'disk', 'tools.epp')
corpus = {e['id']: e for e in json.load(open(os.path.join(HERE, 'book_corpus.json')))}
ids = [int(a) for a in sys.argv[1:]] or [i for i in range(310) if i in corpus]

def one(i):
    e = corpus[i]
    d = os.path.join(WORK, str(i))
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    src = os.path.join(d, 'prog.epp')
    open(src, 'w').write(e['code'] + '\n')
    args = [TOCPP, src]
    if 'xim' in e['code']:
        shutil.copy(TOOLS, d); args.append(os.path.join(d, 'tools.epp'))
    r = subprocess.run(args, capture_output=True, timeout=60)
    cpp = r.stdout.decode('utf-8', 'replace')
    open(os.path.join(d, 'prog.cpp'), 'w').write(cpp)
    if r.returncode not in (0, 3):
        return i, 'tocpp-crash', r.stderr.decode()[-300:]
    if r.returncode == 3:
        first = cpp.split('\n', 1)[0]
        return i, 'refused', first.replace("// C++ View: ", "")
    try:
        c = subprocess.run(['g++', '-std=c++20', '-O1', '-w', '-o', 'prog', 'prog.cpp', '-pthread'], cwd=d, capture_output=True, timeout=180)
    except subprocess.TimeoutExpired:
        return i, 'compile-failed', 'compile timed out'
    if c.returncode != 0:
        err = [l for l in c.stderr.decode('utf-8', 'replace').split('\n') if 'error' in l]
        return i, 'compile-failed', (err[0] if err else c.stderr.decode()[:300])
    try:
        p = subprocess.run(['./prog'], cwd=d, input=b'', stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=40)
    except subprocess.TimeoutExpired:
        return i, 'mismatch', 'timed out'
    out = p.stdout.decode('utf-8', 'replace')
    exp = e['output']
    if out.rstrip('\n') == exp.rstrip('\n'):
        return i, 'match', ''
    ol, el = out.rstrip('\n').split('\n'), exp.rstrip('\n').split('\n')
    for k in range(max(len(ol), len(el))):
        a = ol[k] if k < len(ol) else '<nothing>'
        b = el[k] if k < len(el) else '<nothing>'
        if a != b:
            return i, 'mismatch', f'line {k+1}: got {a!r}, Book has {b!r}' + (f' (exit {p.returncode})' if p.returncode else '')
    return i, 'mismatch', 'differs'

with ThreadPoolExecutor(4) as ex:
    results = sorted(ex.map(one, ids))
cats = {}
for i, k, why in results: cats.setdefault(k, []).append((i, why))
json.dump(results, open(os.path.join(WORK, 'results.json'), 'w'), indent=1)
print(f"complete+match: {len(cats.get('match', []))}")
for k in ['mismatch', 'refused', 'compile-failed', 'tocpp-crash']:
    print(f"{k}: {len(cats.get(k, []))}")
    for i, why in cats.get(k, []): print(f"  #{i}: {why}")
