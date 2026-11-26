# Builds data/epp-studio/root_table.json straight from the frozen Chart (ENGLISHPP_CHART.md):
# every root, value word, kind and special word, grouped by the Chart's families, word for word.
# Adds, per word, the first Book program (corpus) that uses it, and (if present) the browser test's result
# for running the Chart example (ui_v2/root_example_status.json). Nothing is invented here.
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(H, '..')
CHART = os.path.expanduser('~/workspace/user/files/ENGLISHPP_CHART.md')
OUT = os.path.join(P, sys.argv[1] if len(sys.argv) > 1 else 'stage_v2', 'data/epp-studio/root_table.json')
lines = open(CHART, encoding='utf-8').read().split('\n')
def cells(l):
    # split a markdown row on | that are not inside backticks
    out, cur, tick = [], '', False
    for ch in l.strip()[1:-1] if l.strip().endswith('|') else l.strip()[1:]:
        if ch == '`': tick = not tick
        if ch == '|' and not tick: out.append(cur.strip()); cur = ''
        else: cur += ch
    out.append(cur.strip()); return out
unq = lambda s: s[1:-1] if len(s) >= 2 and s[0] == '`' and s[-1] == '`' else s
fam_names = {}; sec = None; sub = None; sub_desc = {}
entries = []; is_line = None
for i, l in enumerate(lines):
    if l.startswith('## '): sec = l[3:].strip(); sub = None; continue
    if l.startswith('### '): sub = l[4:].strip(); continue
    if sec == 'The families' and l.startswith('| `'):
        c = cells(l); fam_names[unq(c[0])] = (c[1], c[2])
    if sec and sec.startswith('The roots') and l.startswith('`is`:'): is_line = l
    if sub and not l.startswith('|') and l.strip() and sub not in sub_desc and sec and sec.startswith('The roots'): sub_desc[sub] = l.strip()
    if not l.startswith('| `'): continue
    c = cells(l)
    if sec and sec.startswith('The roots'):
        entries.append(dict(section='root', group=sub, word=unq(c[0]), says=c[1], who=c[2], what=c[3], example=unq(c[4]), cpp=unq(c[5]), block=bool(c[6].strip())))
    elif sec == 'The value words':
        entries.append(dict(section='value', group=sub, word=unq(c[0]), says=c[1], example=unq(c[2]), cpp=unq(c[3])))
    elif sec == 'The kinds':
        entries.append(dict(section='kind', group='kinds', word=unq(c[0]), says=c[1], cpp=unq(c[2])))
    elif sec == 'The special words':
        entries.append(dict(section='special', group='special words', word=unq(c[0]), says=c[1], cpp=unq(c[2])))
# `is` is written as a sentence in the Chart, not a table row
entries.insert(0, dict(section='root', group='is: the one short word', word='is', says='makes a name, or changes it', who='a name', what='a value',
                       example='x is 6', cpp='int x = 6;   after that: x = 6;', block=False, chart=is_line))
corpus = json.load(open(os.path.join(P, 'corpus/book_corpus.json')))
BAD = {250, 251, 253, 259, 261, 262, 263, 264, 265, 273}
WORD = re.compile(r'(?:"(?:[^"\\]|\\.)*"?|[^\s"])+')
def uses(code, e):
    for line in code.split('\n'):
        w = WORD.findall(line)
        if len(w) < 2 or w[0] == 'note': continue
        if e['section'] == 'root':
            if w[1] == e['word']: return True
        else:
            for x in [w[0]] + w[2:]:
                if x.startswith('"'): continue
                if re.search(r'(?<![A-Za-z_0-9])' + re.escape(e['word']) + r'(?![A-Za-z_0-9])', x): return True
    return False
st_path = os.path.join(P, 'ui_v2/root_example_status.json')
status = json.load(open(st_path)) if os.path.exists(st_path) else {}
for e in entries:
    best = None
    for p in corpus:
        if p['id'] in BAD or p['id'] >= 310: continue
        if uses(p['code'], e) and (best is None or len(p['code']) < len(best['code'])): best = p
    if best: e['book'] = dict(id=best['id'], chapter=best['chapter'].replace('  ', ' ').strip(), code=best['code'].rstrip('\n') + '\n', output=best['output'])
    s = status.get(e['section'] + ':' + e['word'])
    if s: e['run'] = s
groups = []
for e in entries:
    g = e['group']
    if not groups or groups[-1]['name'] != g or groups[-1]['section'] != e['section']:
        letter = (g or '').split(':')[0].strip()
        fam = fam_names.get(letter)
        groups.append(dict(section=e['section'], name=g, letter=letter if fam else '', family=fam[0] if fam else g, does=fam[1] if fam else '', items=[]))
    groups[-1]['items'].append(e)
data = dict(source='ENGLISHPP_CHART.md (frozen)', counts={k: sum(1 for e in entries if e['section'] == k) for k in ['root', 'value', 'kind', 'special']}, groups=groups)
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(OUT, data['counts'], 'with book program:', sum(1 for e in entries if 'book' in e), 'of', len(entries), 'status:', len(status))
