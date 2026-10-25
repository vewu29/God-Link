"""Checks SQL lines and snippets with SQLite (Python's sqlite3 module).

Usage: sqlcheck.py lines|snippets items.json -- prints a JSON list of
{i, err} failures.

lines: each item is compiled with EXPLAIN (so nothing runs) against the
shared schema below, so table and column names are checked as well as
grammar. Creating a table that already exists still counts as valid.
snippets: each item runs as a script on a fresh copy of the schema.
"""
import collections
import json
import sqlite3
import sys

PEOPLE = "(id INTEGER PRIMARY KEY, name TEXT, team TEXT, city TEXT, score INTEGER, level INTEGER, hp INTEGER, coins INTEGER, xp INTEGER, joined TEXT)"
SCHEMA = "".join(
    f"CREATE TABLE {t} {PEOPLE};\n" for t in ["players", "heroes", "robots", "pets", "wizards", "knights"]
) + """
CREATE TABLE items (id INTEGER PRIMARY KEY, owner_id INTEGER REFERENCES players(id), item TEXT, price INTEGER, qty INTEGER);
CREATE TABLE teams (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance INTEGER);
"""


def fresh():
    con = sqlite3.connect(":memory:", isolation_level=None)
    con.executescript(SCHEMA)
    return con


def main():
    mode, path = sys.argv[1], sys.argv[2]
    items = json.load(open(path, encoding="utf-8"))
    params = collections.defaultdict(lambda: 1)
    errs = []
    con = fresh()
    for i, code in enumerate(items):
        try:
            if mode == "lines":
                con.execute("EXPLAIN " + code, params)
            else:
                fresh().executescript(code)
        except (sqlite3.Error, sqlite3.Warning) as e:
            if mode == "lines" and "already exists" in str(e):
                continue
            errs.append({"i": i, "err": str(e)})
    print(json.dumps(errs))


main()
