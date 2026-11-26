#!/usr/bin/env python3
"""Builds the Web Studio's data files into stage/data/epp-studio/.
Re-run after new examples land in ../examples/*.epp (games and Qt apps)."""
import json, os, glob, re
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(H)
OUT = os.path.join(ROOT, "stage", "data", "epp-studio")
os.makedirs(OUT, exist_ok=True)

roots = json.load(open(os.path.join(ROOT, "data", "roots.json")))
json.dump(roots, open(os.path.join(OUT, "roots.json"), "w"), separators=(",", ":"), ensure_ascii=False)

ray = json.load(open(os.path.join(ROOT, "data", "raylib_names.json")))
slim = []
for r in ray:
    x = {"name": r["name"], "kind": r["kind"], "desc": r.get("desc", "")}
    if r["kind"] == "function":
        x["returns"] = r.get("returns", ""); x["params"] = r.get("params", [])
    slim.append(x)
json.dump(slim, open(os.path.join(OUT, "raylib.json"), "w"), separators=(",", ":"), ensure_ascii=False)
qt = json.load(open(os.path.join(ROOT, "data", "qt_names.json")))
json.dump(qt, open(os.path.join(OUT, "qt.json"), "w"), separators=(",", ":"), ensure_ascii=False)

corpus = json.load(open(os.path.join(ROOT, "corpus", "book_corpus.json")))
groups, order = {}, []
for p in corpus:
    if not (0 <= p["id"] <= 309):
        continue
    ch = re.sub(r"\s+", " ", p["chapter"]).strip()
    m = re.match(r"(\d+)\. (.*)", ch)
    name = ("Ch. %s · %s" % (m.group(1), m.group(2))) if m else ch
    if name not in groups:
        groups[name] = []; order.append(name)
    first = next((l.strip() for l in p["code"].split("\n") if l.strip() and not l.strip().startswith("note")), "")
    groups[name].append({"id": "book-%d" % p["id"], "title": first[:48], "code": p["code"], "output": p.get("output", "")})

extra = {"Games (raylib)": [], "Apps (Qt layer)": [], "More examples": []}
for f in sorted(glob.glob(os.path.join(ROOT, "examples", "*.epp"))):
    code = open(f, encoding="utf-8").read().replace("\r\n", "\n")
    base = os.path.splitext(os.path.basename(f))[0]
    title = next((re.sub(r"^\s*note\s+", "", l).strip() for l in code.split("\n") if re.match(r"^\s*note\s", l)), "") or base.replace("_", " ").replace("-", " ").title()
    g = "Games (raylib)" if re.search(r"^\s*now\s+xlb\s+raylib\b", code, re.M) else "Apps (Qt layer)" if re.search(r"^\s*now\s+xlb\s+qt\b", code, re.M | re.I) else "More examples"
    extra[g].append({"id": "ex-" + base, "title": title[:60], "code": code, "output": ""})

out = {"groups": [{"name": n, "items": extra[n]} for n in extra if extra[n]] + [{"name": n, "items": groups[n]} for n in order]}
json.dump(out, open(os.path.join(OUT, "examples.json"), "w"), separators=(",", ":"), ensure_ascii=False)
print("book programs:", sum(len(v) for v in groups.values()), "chapters:", len(order),
      "extra:", {k: len(v) for k, v in extra.items()})
for n in os.listdir(OUT):
    print(n, os.path.getsize(os.path.join(OUT, n)))
