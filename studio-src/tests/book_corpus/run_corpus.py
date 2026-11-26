#!/usr/bin/env python3
"""Runs every scored Book program (ids 0-309) through the engine and compares output byte for byte."""
import json, subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
RUN = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'engine', 'epp_run')
d = json.load(open(os.path.join(HERE, 'book_corpus.json')))
EXPECTED_REFUSE = {250, 251, 253, 259, 261, 262, 263, 264, 265, 273}
only = set(int(x) for x in sys.argv[2:]) if len(sys.argv) > 2 else None
res = {'pass': [], 'refuse_ok': [], 'fail': []}
for e in d[:310]:
    i = e['id']
    if only and i not in only: continue
    src = e['code'] + '\n'
    p = os.path.join(HERE, 'tmp', f'{i}.epp')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w').write(src)
    args = [RUN, p]
    if 'xim' in src: args.append(os.path.join(HERE, 'disk', 'tools.epp'))
    try:
        r = subprocess.run(args, capture_output=True, timeout=20, input=b'')
        out = r.stdout.decode('utf-8', 'replace'); err = r.stderr.decode('utf-8', 'replace')
    except subprocess.TimeoutExpired:
        out, err = '', 'TIMEOUT'
    exp = e['output']
    if out.rstrip('\n') == exp.rstrip('\n') and 'EPP_ERROR' not in err:
        res['pass'].append(i)
    elif i in EXPECTED_REFUSE and 'not in the Web Studio yet' in err:
        res['refuse_ok'].append(i)
    else:
        res['fail'].append((i, e['chapter'], out[-300:], err[-300:], exp[-300:]))
# the Book's input example (Book para 119-120): the typed answer is shown after the question, as on screen
src = 'name get "What is your name? "\nout prn "Hello, @name!"\n'
p = os.path.join(HERE, 'tmp', 'input1.epp'); open(p, 'w').write(src)
r = subprocess.run([RUN, p], capture_output=True, input=b'Ada\n', timeout=20)
shown = r.stdout.decode().replace('What is your name? ', 'What is your name? Ada\n', 1)
res['input_test'] = shown.rstrip('\n') == 'What is your name? Ada\nHello, Ada!'
print('INPUT TEST (Book ch. 1, Ada):', 'PASS' if res['input_test'] else 'FAIL ' + repr(shown))
n = len(res['pass']); print(f"PASS {n}  honest-refusal {len(res['refuse_ok'])}  FAIL {len(res['fail'])}")
for f in res['fail']:
    print(f"--- #{f[0]} {f[1]}\n  got: {f[2]!r}\n  err: {f[3]!r}\n  exp: {f[4]!r}")
json.dump(res, open(os.path.join(HERE, 'last_run.json'), 'w'), indent=1)
