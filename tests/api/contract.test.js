// The API contract: one suite, run against both servers — the Python one
// (main.py → server/) and the PHP one (api/) — so the two can't drift.
// Each server is started here on a free port against the MySQL database
// named by DB_HOST, DB_PORT, DB_NAME, DB_USERNAME and DB_PASSWORD. The
// suite empties that database before each server's run, so its name must
// contain "test":
//
//   DB_HOST=127.0.0.1 DB_NAME=cb_test DB_USERNAME=… DB_PASSWORD=… npm run test:api
//
// A server whose language or MySQL driver isn't installed is skipped.
"use strict";
const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const net = require("node:net");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "..");
const NO_DB = !process.env.DB_HOST || !process.env.DB_NAME
  ? "set DB_HOST, DB_NAME, DB_USERNAME and DB_PASSWORD to a MySQL test database"
  : !/test/i.test(process.env.DB_NAME) ? "DB_NAME must contain \"test\": this suite empties the database" : null;

const SERVERS = [
  {
    name: "python",
    missing: () => spawnSync("python3", ["-c", "import fastapi, uvicorn, pymysql"]).status === 0 ? null : "python3 with fastapi, uvicorn and pymysql",
    start: (port) => spawn("python3", ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", String(port)], { cwd: ROOT, env: process.env, stdio: ["ignore", "ignore", "pipe"] })
  },
  {
    name: "php",
    missing: () => spawnSync("php", ["-r", "exit(extension_loaded('pdo_mysql') ? 0 : 1);"]).status === 0 ? null : "php with pdo_mysql",
    start: (port) => spawn("php", ["-S", "127.0.0.1:" + port, "-t", ROOT], { cwd: ROOT, env: process.env, stdio: ["ignore", "ignore", "pipe"] })
  }
];

/* ---------- helpers ---------- */

const RUN = crypto.randomBytes(3).toString("hex");
let names = 0;
const fresh = (tag) => `t${RUN}${tag}${(names++).toString(36)}`.slice(0, 20);
let ips = 0;
const newIp = () => { ips++; return `10.${(ips >> 16) & 255}.${(ips >> 8) & 255}.${ips & 255}`; };
const day = (offset = 0) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const USER_KEYS = ["bestStreak", "bestWpm", "drills", "id", "joined", "lastDay", "level", "public", "streak", "username", "xp"];
const CODE = /^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){3}$/;

function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => resolve(port)); });
  });
}

/* Empty every table, through PHP's PDO or Python's PyMySQL — whichever is here. */
function wipe() {
  const sql = "SET FOREIGN_KEY_CHECKS=0; DELETE FROM cb_sessions; DELETE FROM cb_progress; DELETE FROM cb_daily; DELETE FROM cb_users; DELETE FROM cb_counters; DELETE FROM cb_rate; SET FOREIGN_KEY_CHECKS=1";
  const php = `$p = new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: 3306) . ';dbname=' . getenv('DB_NAME'), getenv('DB_USERNAME') ?: getenv('DB_USER'), getenv('DB_PASSWORD') ?: '');
    foreach (explode(';', $argv[1]) as $s) { try { $p->exec($s); } catch (Throwable $e) {} }`;
  if (spawnSync("php", ["-r", php, sql], { env: process.env }).status === 0) return;
  const py = `import os, sys, pymysql
c = pymysql.connect(host=os.environ["DB_HOST"], port=int(os.environ.get("DB_PORT") or 3306), user=os.environ.get("DB_USERNAME") or os.environ.get("DB_USER"), password=os.environ.get("DB_PASSWORD") or "", database=os.environ["DB_NAME"], autocommit=True)
for s in sys.argv[1].split(";"):
    try: c.cursor().execute(s)
    except pymysql.MySQLError: pass`;
  const r = spawnSync("python3", ["-c", py, sql], { env: process.env });
  if (r.status !== 0) throw new Error("couldn't empty the test database: " + r.stderr);
}

/* A browser-like visitor: one IP address (so rate limits are per test), one cookie jar. */
function visitor(base) {
  const ip = newIp();
  let cookie = null;
  async function call(method, route, opts = {}) {
    const headers = { "x-forwarded-for": ip, ...(opts.headers || {}) };
    let body;
    if (method === "POST") {
      headers["content-type"] = "application/json";
      if (!("x-code-block" in headers)) headers["x-code-block"] = "1";
      body = opts.raw !== undefined ? opts.raw : JSON.stringify(opts.body || {});
    }
    for (const k of Object.keys(headers)) if (headers[k] === null) delete headers[k];
    if (cookie && !("cookie" in headers)) headers.cookie = "cb_session=" + cookie;
    const res = await fetch(`${base}/api/index.php?r=${route}${opts.query || ""}`, { method, headers, body });
    const setCookie = res.headers.getSetCookie().find((c) => c.startsWith("cb_session=")) || null;
    if (setCookie) cookie = /max-age=0/i.test(setCookie) ? null : setCookie.split(";")[0].slice("cb_session=".length);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { /* not JSON */ }
    return { status: res.status, json, text, headers: res.headers, setCookie };
  }
  return {
    ip,
    get cookie() { return cookie; },
    set cookie(v) { cookie = v; },
    get: (route, opts) => call("GET", route, opts),
    post: (route, body, opts = {}) => call("POST", route, { ...opts, body }),
    raw: (route, raw, opts = {}) => call("POST", route, { ...opts, raw }),
    call
  };
}

function isError(r, status, code) {
  assert.equal(r.status, status, `${code}: ${r.text}`);
  assert.equal(r.json.ok, false);
  assert.equal(r.json.error, code);
  assert.equal(typeof r.json.message, "string");
  assert.ok(r.json.message.length > 5);
}

async function signUp(base, tag = "u", extra = {}) {
  const v = visitor(base);
  const username = fresh(tag);
  const password = "kite-" + crypto.randomBytes(6).toString("hex");
  const r = await v.post("signup", { username, password, ...extra });
  assert.equal(r.status, 201, r.text);
  return { v, username, password, code: r.json.recoveryCode, user: r.json.user };
}

/* ---------- the suite, for each server ---------- */

const running = {};

for (const server of SERVERS) {
  const skip = NO_DB || server.missing();
  describe(`API (${server.name})`, { skip: skip || false }, () => {
    let proc;
    let base;
    let stderr = "";
    before(async () => {
      wipe();
      const port = await freePort();
      base = `http://127.0.0.1:${port}`;
      proc = server.start(port);
      proc.stderr.on("data", (d) => { stderr += d; });
      for (let i = 0; i < 100; i++) {
        try { if ((await fetch(base + "/api/index.php?r=health")).ok) break; } catch (e) { /* not up yet */ }
        await new Promise((r) => setTimeout(r, 150));
      }
      running[server.name] = base;
    });
    after(() => {
      delete running[server.name];
      if (proc) proc.kill();
      if (/Traceback|Fatal error|PHP Warning|PHP Deprecated/.test(stderr)) throw new Error(`${server.name} server logged errors:\n${stderr.slice(0, 2000)}`);
    });

    test("health: up, with the database, and every answer carries the safety headers", async () => {
      const r = await visitor(base).get("health");
      assert.equal(r.status, 200);
      assert.deepEqual(r.json, { ok: true, server: server.name, db: true, version: 1 });
      assert.match(r.headers.get("content-type"), /^application\/json/);
      assert.equal(r.headers.get("cache-control"), "no-store");
      assert.equal(r.headers.get("x-content-type-options"), "nosniff");
      assert.equal(r.headers.get("x-frame-options"), "SAMEORIGIN");
      assert.equal(r.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
      assert.equal(r.headers.get("x-powered-by"), null);
      assert.equal(r.headers.get("access-control-allow-origin"), null);
    });

    test("routes: unknown ones are 404, the wrong method is 405", async () => {
      const v = visitor(base);
      isError(await v.get("nope"), 404, "not_found");
      isError(await v.get(""), 404, "not_found");
      isError(await v.get("signup"), 405, "method");
      isError(await v.post("me", {}), 405, "method");
      isError(await v.call("PUT", "progress"), 405, "method");
      isError(await v.call("DELETE", "me"), 405, "method");
      isError(await v.call("OPTIONS", "signup", { headers: { origin: "https://elsewhere.example", "access-control-request-method": "POST" } }), 405, "method");
    });

    test("POSTs must come from Code Block itself", async () => {
      const v = visitor(base);
      const host = base.replace("http://", "");
      const forbidden = async (headers) => isError(await v.post("settings", { public: true }, { headers }), 403, "forbidden");
      const allowed = async (headers) => isError(await v.post("settings", { public: true }, { headers }), 401, "signed_out");
      await forbidden({ "x-code-block": null });
      await forbidden({ "x-code-block": "true" });
      await forbidden({ "sec-fetch-site": "cross-site" });
      await forbidden({ "sec-fetch-site": "same-site" });
      await forbidden({ origin: "http://evil.example" });
      await forbidden({ origin: "http://" });
      await forbidden({ origin: "null" });
      await forbidden({ origin: `http://${host}.evil.example` });
      await allowed({});
      await allowed({ "sec-fetch-site": "same-origin" });
      // The browser's own same-origin verdict wins over a proxy's rewritten Host.
      await allowed({ "sec-fetch-site": "same-origin", origin: "https://code-block.example" });
      await allowed({ origin: base });
      await allowed({ origin: base + "/" });
      await allowed({ origin: `HTTP://${host.toUpperCase()}` });
      await allowed({ origin: "https://code-block.example", "x-forwarded-host": "code-block.example, inner.local" });
    });

    test("bodies must be one sensible JSON object, the same on both servers", async () => {
      const v = visitor(base);
      const bad = async (raw) => isError(await v.raw("settings", raw), 400, "bad_json");
      const fine = async (raw) => isError(await v.raw("settings", raw), 401, "signed_out");
      for (const raw of ["not json", "[]", "[1]", '"text"', "5", "null", " ", "{", '{"a":1,}', "{'a':1}",
        '{"a":NaN}', '{"a":Infinity}', '{"a":-Infinity}', '{"a":1e400}', '{"a":-1e999}', '{"a":1' + "0".repeat(400) + "}",
        '{"a":"\\ud800"}', '{"a":"\\udc00x"}', '{"\\u0000a":1}', '{"b":{"\\u0000":1}}', "﻿{}"]) await bad(raw);
      await bad(Buffer.from([0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]));
      for (const raw of ["", "{}", '{"0":"a"}', '{"a":"\\ud83d\\ude00"}', '{"a\\u0000":1}', '{"a":1e308,"b":-0,"c":1' + "0".repeat(300) + "}", '{"a":[],"b":{}}']) await fine(raw);
      // At most 32 levels of objects and lists, counting the outer object.
      await fine('{"a":'.repeat(32) + "1" + "}".repeat(32));
      await bad('{"a":'.repeat(33) + "1" + "}".repeat(33));
      await fine('{"a":' + "[".repeat(31) + "]".repeat(31) + "}");
      await bad('{"a":' + "[".repeat(32) + "]".repeat(32) + "}");
      // Size: 100,000 bytes at most.
      await fine('{"a":"' + "x".repeat(99990) + '"}');
      isError(await v.raw("settings", '{"a":"' + "x".repeat(100000) + '"}'), 413, "too_big");
    });

    test("sign-up checks the username and the password", async () => {
      const checks = [
        [{}, "missing_username"],
        [{ username: 7, password: "kite-kite-kite" }, "missing_username"],
        [{ username: "ab", password: "kite-kite-kite" }, "bad_username"],
        [{ username: "has space", password: "kite-kite-kite" }, "bad_username"],
        [{ username: "x".repeat(21), password: "kite-kite-kite" }, "bad_username"],
        [{ username: "émile", password: "kite-kite-kite" }, "bad_username"],
        [{ username: "bob\n\nbob", password: "kite-kite-kite" }, "bad_username"],
        [{ username: "a".repeat(41), password: "kite-kite-kite" }, "too_long"],
        [{ username: "Admin", password: "kite-kite-kite" }, "reserved_username"],
        [{ username: fresh("v") }, "missing_password"],
        [{ username: fresh("v"), password: "short1" }, "short_password"],
        [{ username: fresh("v"), password: "x".repeat(129) }, "long_password"],
        [{ username: fresh("v"), password: "x".repeat(401) }, "too_long"],
        [{ username: fresh("v"), password: " \t".repeat(6) }, "weak_password"],
        [{ username: fresh("v"), password: "Password123" }, "weak_password"]
      ];
      for (let i = 0; i < checks.length; i++) {
        const [body, code] = checks[i];
        isError(await visitor(base).post("signup", body), 400, code);
      }
      const name = fresh("v");
      isError(await visitor(base).post("signup", { username: name, password: name.toUpperCase() }), 400, "weak_password");
    });

    test("sign-up makes the account, signs in, and shows a recovery code once", async () => {
      const v = visitor(base);
      const username = fresh("s");
      const r = await v.post("signup", { username: "  " + username + "\n", password: "blue kite river" });
      assert.equal(r.status, 201, r.text);
      assert.deepEqual(Object.keys(r.json.user).sort(), USER_KEYS);
      assert.deepEqual({ ...r.json.user, id: 0 }, {
        id: 0, username, xp: 0, level: 1, streak: 0, bestStreak: 0, lastDay: null, drills: 0, bestWpm: 0, public: true, joined: day(0)
      });
      assert.match(r.json.recoveryCode, CODE);
      // The session cookie: script can't read it, other sites can't send it.
      const c = r.setCookie.toLowerCase();
      for (const part of ["httponly", "samesite=lax", "path=/", "max-age=2592000"]) assert.ok(c.includes(part), c);
      assert.ok(!c.includes("secure"), "no Secure flag over plain http");
      assert.match(v.cookie, /^[A-Za-z0-9_-]{43}$/);
      const me = await v.get("me");
      assert.equal(me.status, 200);
      assert.deepEqual(me.json, { ok: true, user: r.json.user });
      assert.equal(me.json.recoveryCode, undefined);
      // Names are unique whatever their case.
      isError(await visitor(base).post("signup", { username: username.toUpperCase(), password: "another-kite-9" }), 409, "taken");
      const hidden = await visitor(base).post("signup", { username: fresh("s"), password: "green-kite-55", public: false });
      assert.equal(hidden.json.user.public, false);
    });

    test("login: the same answer for a wrong password and an unknown name", async () => {
      const a = await signUp(base, "l");
      const v = visitor(base);
      const unknown = await v.post("login", { username: fresh("nobody"), password: a.password });
      const wrong = await v.post("login", { username: a.username, password: a.password + "x" });
      isError(unknown, 401, "bad_login");
      isError(wrong, 401, "bad_login");
      assert.equal(unknown.json.message, wrong.json.message);
      assert.equal(v.cookie, null);
      isError(await v.post("login", { username: a.username }), 400, "missing_password");
      const ok = await v.post("login", { username: " " + a.username.toUpperCase() + " ", password: a.password });
      assert.equal(ok.status, 200, ok.text);
      assert.deepEqual(Object.keys(ok.json.user).sort(), USER_KEYS);
      assert.equal(ok.json.user.username, a.username);
      assert.notEqual(v.cookie, null);
      assert.notEqual(v.cookie, a.v.cookie, "every sign-in gets its own session");
      assert.equal((await v.get("me")).json.user.id, a.user.id);
    });

    test("cookies get Secure when the page is on HTTPS, even behind a plain-HTTP proxy", async () => {
      const a = await signUp(base, "h");
      for (const headers of [{ "x-forwarded-proto": "https" }, { origin: base.replace("http:", "https:") }]) {
        const r = await visitor(base).post("login", { username: a.username, password: a.password }, { headers });
        assert.equal(r.status, 200, r.text);
        assert.match(r.setCookie, /;\s*secure/i);
      }
    });

    test("signed out: no session is 401; a stale cookie is cleared", async () => {
      const v = visitor(base);
      const none = await v.get("me");
      isError(none, 401, "signed_out");
      assert.equal(none.setCookie, null);
      for (const stale of ["x".repeat(43), "x".repeat(300), "a b"]) {
        v.cookie = stale;
        const r = await v.get("me");
        isError(r, 401, "signed_out");
        assert.match(r.setCookie || "", /max-age=0/i, "the stale cookie is cleared");
      }
    });

    test("logout ends that session only", async () => {
      const a = await signUp(base, "o");
      const other = visitor(base);
      assert.equal((await other.post("login", { username: a.username, password: a.password })).status, 200);
      const token = a.v.cookie;
      const out = await a.v.post("logout", {});
      assert.equal(out.status, 200);
      assert.deepEqual(out.json, { ok: true });
      assert.match(out.setCookie, /max-age=0/i);
      a.v.cookie = token;
      isError(await a.v.get("me"), 401, "signed_out");
      assert.equal((await other.get("me")).status, 200);
      // Logging out when already out is fine.
      assert.equal((await visitor(base).post("logout", {})).status, 200);
    });

    test("recovery: the code sets a new password, signs out everywhere else, and works once", async () => {
      const a = await signUp(base, "r");
      const other = visitor(base);
      await other.post("login", { username: a.username, password: a.password });
      const v = visitor(base);
      isError(await v.post("recover", { username: a.username, recoveryCode: "AAAA-BBBB-CCCC-DDDD", password: "new-kite-123" }), 401, "bad_code");
      isError(await v.post("recover", { username: fresh("nobody"), recoveryCode: a.code, password: "new-kite-123" }), 401, "bad_code");
      isError(await v.post("recover", { username: a.username, password: "new-kite-123" }), 400, "missing_recoveryCode");
      // Typed loosely — lower case, no dashes — it still matches; a weak new password still doesn't pass.
      const loose = a.code.replace(/-/g, "").toLowerCase();
      isError(await v.post("recover", { username: a.username, recoveryCode: loose, password: "password" }), 400, "weak_password");
      const r = await v.post("recover", { username: a.username.toUpperCase(), recoveryCode: loose, password: "new-kite-123" });
      assert.equal(r.status, 200, r.text);
      assert.match(r.json.recoveryCode, CODE);
      assert.notEqual(r.json.recoveryCode, a.code);
      assert.equal(r.json.user.username, a.username);
      assert.equal((await v.get("me")).status, 200);
      isError(await a.v.get("me"), 401, "signed_out");
      isError(await other.get("me"), 401, "signed_out");
      isError(await visitor(base).post("recover", { username: a.username, recoveryCode: a.code, password: "newer-kite-456" }), 401, "bad_code");
      isError(await visitor(base).post("login", { username: a.username, password: a.password }), 401, "bad_login");
      assert.equal((await visitor(base).post("login", { username: a.username, password: "new-kite-123" })).status, 200);
      const again = await visitor(base).post("recover", { username: a.username, recoveryCode: r.json.recoveryCode, password: "third-kite-789" });
      assert.equal(again.status, 200, "the new code works");
    });

    test("password change: needs the current password, keeps only this session", async () => {
      const a = await signUp(base, "p");
      const other = visitor(base);
      await other.post("login", { username: a.username, password: a.password });
      isError(await visitor(base).post("password", { password: a.password, newPassword: "fresh-kite-1" }), 401, "signed_out");
      isError(await a.v.post("password", { password: "wrong-kite-0", newPassword: "fresh-kite-1" }), 401, "bad_password");
      isError(await a.v.post("password", { password: a.password, newPassword: a.username }), 400, "weak_password");
      isError(await a.v.post("password", { password: a.password }), 400, "missing_newPassword");
      const r = await a.v.post("password", { password: a.password, newPassword: "fresh-kite-1" });
      assert.equal(r.status, 200, r.text);
      assert.deepEqual(r.json, { ok: true });
      assert.equal((await a.v.get("me")).status, 200);
      isError(await other.get("me"), 401, "signed_out");
      assert.equal((await visitor(base).post("login", { username: a.username, password: "fresh-kite-1" })).status, 200);
    });

    test("settings: on the leaderboard or not", async () => {
      const a = await signUp(base, "g");
      isError(await a.v.post("settings", {}), 400, "bad_settings");
      isError(await a.v.post("settings", { public: "no" }), 400, "bad_settings");
      isError(await a.v.post("settings", { public: 0 }), 400, "bad_settings");
      const r = await a.v.post("settings", { public: false });
      assert.equal(r.status, 200);
      assert.equal(r.json.user.public, false);
      assert.equal((await a.v.get("me")).json.user.public, false);
    });

    test("progress: one object per track, read back as saved", async () => {
      const a = await signUp(base, "q");
      assert.deepEqual((await a.v.get("progress")).json, { ok: true, tracks: {} });
      for (const track of ["Python", "py thon", "a".repeat(25), "python\n", "", 5, null]) {
        isError(await a.v.post("progress", { track, data: {} }), 400, "bad_track");
      }
      for (const data of [[1], "x", 5, null, undefined]) {
        isError(await a.v.post("progress", { track: "python", data }), 400, "bad_data");
      }
      isError(await a.v.post("progress", { track: "python", data: { s: "x".repeat(70000) } }), 413, "too_big");
      const data = { blocks: { "b-1": { reps: 3, best: 41.5 } }, empty: {}, list: [1, "two", { three: [] }], note: "ünïcödé ✓ 😀", slash: "a/b" };
      assert.deepEqual((await a.v.post("progress", { track: "python", data })).json, { ok: true });
      await a.v.post("progress", { track: "unity-3d", data: { n: 1 } });
      const got = (await a.v.get("progress")).json;
      assert.deepEqual(Object.keys(got.tracks).sort(), ["python", "unity-3d"]);
      assert.deepEqual(got.tracks.python.data, data);
      assert.match(got.tracks.python.updated, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      await a.v.post("progress", { track: "python", data: { blocks: {} } });
      assert.deepEqual((await a.v.get("progress")).json.tracks.python.data, { blocks: {} });
      isError(await visitor(base).get("progress"), 401, "signed_out");
      isError(await visitor(base).post("progress", { track: "python", data: {} }), 401, "signed_out");
    });

    test("events: XP and speed are capped; anything but a number counts as 0", async () => {
      const anon = await visitor(base).post("event", { kind: "rep", track: "python", xp: 10 });
      assert.deepEqual(anon.json, { ok: true, user: null });
      const a = await signUp(base, "e");
      isError(await a.v.post("event", { kind: "win", track: "python" }), 400, "bad_event");
      isError(await a.v.post("event", { kind: "rep", track: "Py!" }), 400, "bad_track");
      let r = await a.v.post("event", { kind: "rep", track: "python", xp: 999, wpm: 999, day: day(0) });
      assert.equal(r.status, 200, r.text);
      assert.deepEqual([r.json.user.xp, r.json.user.bestWpm, r.json.user.drills, r.json.user.streak, r.json.user.lastDay], [80, 250, 1, 1, day(0)]);
      const xpAfter = [];
      for (const xp of ["50", 5.9, -10, true, null, [], { n: 9 }, 1e300, 0.5]) {
        r = await a.v.post("event", { kind: "master", track: "python", xp, wpm: 30.7 });
        xpAfter.push(r.json.user.xp);
      }
      assert.deepEqual(xpAfter, [80, 85, 85, 85, 85, 85, 85, 165, 165]);
      assert.equal(r.json.user.bestWpm, 250);
      assert.equal(r.json.user.drills, 10);
      assert.equal(r.json.user.level, 2, "level 2 starts at 100 XP");
    });

    test("events: streaks follow the learner's own day, within a day of UTC", async () => {
      const a = await signUp(base, "k");
      const ev = async (d) => (await a.v.post("event", { kind: "bank", track: "go", xp: 5, day: d })).json.user;
      let u = await ev(day(-1));
      assert.deepEqual([u.streak, u.bestStreak, u.lastDay], [1, 1, day(-1)]);
      u = await ev(day(0));
      assert.deepEqual([u.streak, u.bestStreak, u.lastDay], [2, 2, day(0)]);
      u = await ev(day(-1));
      assert.deepEqual([u.streak, u.lastDay], [2, day(0)], "a late event for yesterday doesn't move the streak back");
      u = await ev(day(0));
      assert.deepEqual([u.streak, u.lastDay], [2, day(0)], "a second drill today keeps it");
      for (const odd of ["2001-01-01", day(5), "2026-02-30", "yesterday", day(0) + "\n", 20261025]) {
        u = await ev(odd);
        assert.equal(u.lastDay, day(0), `${JSON.stringify(odd)} counts as today`);
      }
      const b = await signUp(base, "k");
      u = (await b.v.post("event", { kind: "rep", track: "go", xp: 5, day: day(1) })).json.user;
      assert.deepEqual([u.streak, u.lastDay], [1, day(1)], "tomorrow is allowed: it may already be tomorrow where the learner is");
    });

    test("events: at most 5,000 XP a day", async () => {
      const a = await signUp(base, "x");
      let u;
      for (let i = 0; i < 64; i++) u = (await a.v.post("event", { kind: "rep", track: "python", xp: 80, day: day(0) })).json.user;
      assert.equal(u.xp, 5000);
      assert.equal(u.drills, 64);
      await a.v.post("delete", { password: a.password });
    });

    test("leaderboard: public learners by XP, this week or all time, with your own rank", async () => {
      const a = await signUp(base, "b");
      const b = await signUp(base, "b");
      const c = await signUp(base, "b");
      await a.v.post("event", { kind: "rep", track: "python", xp: 31, day: day(0) });
      await b.v.post("event", { kind: "rep", track: "python", xp: 47, day: day(0) });
      await b.v.post("settings", { public: false });
      for (const period of ["week", "all"]) {
        const r = await a.v.get("leaderboard", { query: "&period=" + period });
        assert.equal(r.status, 200, r.text);
        assert.equal(r.json.period, period);
        const rows = r.json.rows;
        rows.forEach((row, i) => {
          assert.deepEqual(Object.keys(row).sort(), ["level", "me", "rank", "streak", "username", "xp"]);
          assert.equal(row.rank, i + 1);
          if (i) assert.ok(rows[i - 1].xp >= row.xp);
          assert.ok(row.xp > 0);
        });
        const mine = rows.find((row) => row.username === a.username);
        assert.ok(mine && mine.me && mine.xp === 31 && mine.level === 1 && mine.streak === 1, JSON.stringify(rows));
        assert.equal(rows.filter((row) => row.me).length, 1);
        assert.ok(!rows.some((row) => row.username === b.username), "a private learner isn't listed");
        assert.ok(!rows.some((row) => row.username === c.username), "no XP yet, not listed");
        assert.deepEqual(r.json.me, { rank: 1 + rows.filter((row) => row.xp > 31).length, xp: 31, public: true });
        const hidden = (await b.v.get("leaderboard", { query: "&period=" + period })).json.me;
        assert.deepEqual([hidden.xp, hidden.public], [47, false]);
      }
      const anon = await visitor(base).get("leaderboard", { query: "&period=forever" });
      assert.equal(anon.json.period, "week");
      assert.equal(anon.json.me, null);
      assert.ok(anon.json.rows.every((row) => row.me === false));
    });

    test("stats: learners, who's on now, and drills typed today", async () => {
      const v = visitor(base);
      const s = (await v.get("stats")).json;
      assert.deepEqual(Object.keys(s).sort(), ["drillsAll", "drillsToday", "learners", "ok", "online"]);
      for (const k of ["drillsAll", "drillsToday", "learners", "online"]) assert.ok(Number.isInteger(s[k]) && s[k] >= 0, k);
      await v.post("event", { kind: "rep", track: "lua" });
      const t = (await v.get("stats")).json;
      assert.equal(t.drillsToday, s.drillsToday + 1);
      assert.equal(t.drillsAll, s.drillsAll + 1);
      await signUp(base, "n");
      const u = (await v.get("stats")).json;
      assert.equal(u.learners, s.learners + 1);
      assert.ok(u.online >= 1);
    });

    test("rate limits: a burst of sign-ups or guesses from one place has to wait", async () => {
      const v = visitor(base);
      for (let i = 0; i < 10; i++) isError(await v.post("signup", { username: "no", password: "kite-kite-kite" }), 400, "bad_username");
      isError(await v.post("signup", { username: fresh("z"), password: "kite-kite-kite" }), 429, "too_many");
      assert.equal((await visitor(base).post("signup", { username: "no", password: "kite-kite-kite" })).status, 400, "another address is fine");
      const a = await signUp(base, "z");
      const g = visitor(base);
      for (let i = 0; i < 10; i++) isError(await g.post("login", { username: a.username, password: "guess-" + i + "-kite" }), 401, "bad_login");
      isError(await g.post("login", { username: a.username, password: a.password }), 429, "too_many");
    });

    test("delete: needs the password, then removes the account and everything in it", async () => {
      const a = await signUp(base, "d");
      await a.v.post("progress", { track: "python", data: { n: 1 } });
      await a.v.post("event", { kind: "rep", track: "python", xp: 12 });
      isError(await a.v.post("delete", {}), 400, "missing_password");
      isError(await a.v.post("delete", { password: "wrong-kite-0" }), 401, "bad_password");
      isError(await visitor(base).post("delete", { password: a.password }), 401, "signed_out");
      const r = await a.v.post("delete", { password: a.password });
      assert.equal(r.status, 200, r.text);
      assert.match(r.setCookie, /max-age=0/i);
      isError(await a.v.get("me"), 401, "signed_out");
      isError(await visitor(base).post("login", { username: a.username, password: a.password }), 401, "bad_login");
      // The name is free again, and nothing of the old account comes back.
      const again = visitor(base);
      const s = await again.post("signup", { username: a.username, password: a.password });
      assert.equal(s.status, 201);
      assert.equal(s.json.user.xp, 0);
      assert.deepEqual((await again.get("progress")).json.tracks, {});
    });

    test("files: only the page and its assets are served, never the server's own code", async () => {
      const page = await fetch(base + "/");
      assert.equal(page.status, 200);
      assert.match(page.headers.get("content-type"), /text\/html/);
      assert.equal((await fetch(base + "/api/_lib/core.php")).status, 404);
      if (server.name === "python") {
        for (const p of ["/server/core.py", "/main.py", "/db/schema.sql", "/requirements.txt", "/tests/api/contract.test.js", "/.git/config"]) {
          assert.equal((await fetch(base + p)).status, 404, p);
        }
        assert.equal((await fetch(base + "/js/theme.js")).status, 200);
      }
    });
  });
}

/* Both servers share one database, so an account works on either. */
describe("API: one account, both servers", { skip: NO_DB || SERVERS.map((s) => s.missing()).find(Boolean) || false }, () => {
  const procs = [];
  const bases = {};
  before(async () => {
    wipe();
    for (const s of SERVERS) {
      const port = await freePort();
      bases[s.name] = `http://127.0.0.1:${port}`;
      procs.push(s.start(port));
    }
    for (const b of Object.values(bases)) {
      for (let i = 0; i < 100; i++) {
        try { if ((await fetch(b + "/api/index.php?r=health")).ok) break; } catch (e) { /* not up yet */ }
        await new Promise((r) => setTimeout(r, 150));
      }
    }
  });
  after(() => procs.forEach((p) => p.kill()));

  test("sign up on one, sign in, play and recover on the other", async () => {
    for (const [from, to] of [["python", "php"], ["php", "python"]]) {
      const a = await signUp(bases[from], from[0]);
      // The session made by one server is valid on the other.
      const there = visitor(bases[to]);
      there.cookie = a.v.cookie;
      assert.equal((await there.get("me")).json.user.username, a.username);
      // A password hashed by one server is checked by the other.
      const login = visitor(bases[to]);
      assert.equal((await login.post("login", { username: a.username, password: a.password })).status, 200);
      const ev = await login.post("event", { kind: "rep", track: "python", xp: 20, day: day(0) });
      assert.equal(ev.json.user.xp, 20);
      assert.equal((await a.v.get("me")).json.user.xp, 20);
      await a.v.post("progress", { track: "rust", data: { from } });
      assert.deepEqual((await login.get("progress")).json.tracks.rust.data, { from });
      const r = await visitor(bases[to]).post("recover", { username: a.username, recoveryCode: a.code, password: "cross-kite-77" });
      assert.equal(r.status, 200, r.text);
      assert.equal((await visitor(bases[from]).post("login", { username: a.username, password: "cross-kite-77" })).status, 200);
    }
  });
});
