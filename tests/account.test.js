// Online accounts in the page (js/account.js), against a stand-in for
// the API that lives in this file — the real servers have their own
// suite (tests/api) — so these run anywhere, with no database. The
// stand-in follows the API's contract: the same routes, answers and
// session cookie.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const { launch, newPage } = require("./helpers/harness");

const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

const levelOf = (xp) => { let n = 1; while (50 * n * (n + 1) <= xp) n++; return n; };
const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

/* A small in-memory API. accounts: [{ username, password, xp, progress }] to start with. */
function fakeApi(accounts = []) {
  const api = { users: [], sessions: new Map(), progress: new Map(), requests: [], fail: null, stats: { learners: 7, online: 2, drillsToday: 41, drillsAll: 900 } };
  let next = 1;
  function add(a) {
    const u = { id: next++, username: a.username, password: a.password, xp: a.xp || 0, streak: 0, bestStreak: 0, lastDay: null, drills: 0, bestWpm: 0, public: a.public !== false, code: "ABCD-EFGH-JKLM-NPQR" };
    api.users.push(u);
    api.progress.set(u.id, a.progress || {});
    return u;
  }
  accounts.forEach(add);
  const view = (u) => ({ id: u.id, username: u.username, xp: u.xp, level: levelOf(u.xp), streak: u.streak, bestStreak: u.bestStreak, lastDay: u.lastDay, drills: u.drills, bestWpm: u.bestWpm, public: u.public, joined: "2026-10-01" });
  api.handle = async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const r = url.searchParams.get("r");
    const body = req.method() === "POST" ? JSON.parse(req.postData() || "{}") : null;
    const cookie = (req.headers().cookie || "").match(/cb_session=([^;]+)/);
    const me = cookie ? api.users.find((u) => u.id === api.sessions.get(cookie[1])) : null;
    api.requests.push({ r, method: req.method(), body, cookie: !!cookie, codeBlock: req.headers()["x-code-block"] });
    if (api.fail && api.fail(r)) return route.abort();
    const reply = (status, data, setCookie) => route.fulfill({
      status, contentType: "application/json", body: JSON.stringify(data),
      headers: setCookie === undefined ? {} : { "set-cookie": setCookie ? `cb_session=${setCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000` : "cb_session=; Path=/; Max-Age=0" }
    });
    const error = (status, code, message) => reply(status, { ok: false, error: code, message });
    const signIn = (u, status, extra) => { const t = "t" + Math.random().toString(36).slice(2); api.sessions.set(t, u.id); return reply(status, { ok: true, user: view(u), ...extra }, t); };
    if (req.method() === "POST" && req.headers()["x-code-block"] !== "1") return error(403, "forbidden", "Requests must come from Code Block itself.");
    switch (r) {
      case "health": return reply(200, { ok: true, server: "test", db: true, version: 1 });
      case "stats": return reply(200, { ok: true, ...api.stats });
      case "me": return me ? reply(200, { ok: true, user: view(me) }) : error(401, "signed_out", "Please sign in first.");
      case "signup": {
        if (api.users.some((u) => u.username.toLowerCase() === body.username.toLowerCase())) return error(409, "taken", "That username is taken — try another.");
        const u = add({ username: body.username, password: body.password, xp: Math.min(5000, Math.floor((body.carry && body.carry.xp) || 0)), public: body.public });
        return signIn(u, 201, { recoveryCode: u.code });
      }
      case "login": {
        const u = api.users.find((x) => x.username.toLowerCase() === body.username.toLowerCase());
        if (!u || u.password !== body.password) return error(401, "bad_login", "That username and password don't match.");
        return signIn(u, 200);
      }
      case "recover": {
        const u = api.users.find((x) => x.username.toLowerCase() === body.username.toLowerCase());
        if (!u || body.recoveryCode.replace(/-/g, "").toUpperCase() !== u.code.replace(/-/g, "")) return error(401, "bad_code", "That username and recovery code don't match.");
        u.password = body.password;
        u.code = "WXYZ-2345-6789-ABCD";
        return signIn(u, 200, { recoveryCode: u.code });
      }
      case "logout": return reply(200, { ok: true }, "");
      case "progress":
        if (!me) return error(401, "signed_out", "Please sign in first.");
        if (req.method() === "GET") {
          const tracks = {};
          for (const [k, v] of Object.entries(api.progress.get(me.id))) tracks[k] = { data: v, updated: "2026-10-25T10:00:00Z" };
          return reply(200, { ok: true, tracks });
        }
        api.progress.get(me.id)[body.track] = body.data;
        return reply(200, { ok: true });
      case "event":
        api.stats.drillsToday++;
        if (!me) return reply(200, { ok: true, user: null });
        me.xp += Math.min(80, body.xp); me.drills++; me.streak = Math.max(me.streak, 1); me.bestStreak = Math.max(me.bestStreak, 1); me.lastDay = body.day;
        me.bestWpm = Math.max(me.bestWpm, Math.min(250, body.wpm));
        return reply(200, { ok: true, user: view(me) });
      case "leaderboard": {
        const period = url.searchParams.get("period") === "all" ? "all" : "week";
        const rows = api.users.filter((u) => u.public && u.xp > 0).sort((a, b) => b.xp - a.xp).slice(0, 20)
          .map((u, i) => ({ rank: i + 1, username: u.username, xp: u.xp, level: levelOf(u.xp), streak: u.streak, me: !!me && me.id === u.id }));
        return reply(200, { ok: true, period, rows, me: me ? { rank: 1 + api.users.filter((u) => u.public && u.xp > me.xp).length, xp: me.xp, public: me.public } : null });
      }
      case "settings": me.public = body.public; return reply(200, { ok: true, user: view(me) });
      case "password":
        if (me.password !== body.password) return error(401, "bad_password", "Your current password isn't right.");
        me.password = body.newPassword;
        return reply(200, { ok: true });
      case "delete":
        if (!me || me.password !== body.password) return error(401, "bad_password", "That password isn't right, so nothing was deleted.");
        api.users.splice(api.users.indexOf(me), 1);
        return reply(200, { ok: true }, "");
      default: return error(404, "not_found", "No such thing here.");
    }
  };
  return api;
}

/* The page as the servers send it: with the line that says the API is there. */
async function withApi(api, opts = {}) {
  return newPage(env, {
    track: "python", ...opts,
    setup: async (ctx) => {
      await ctx.route(/\/api\/index\.php\?/, api.handle);
      await ctx.route(env.base, async (route) => {
        const res = await route.fetch();
        const body = (await res.text()).replace("<head>", '<head><meta name="cb-api" content="api/index.php">');
        await route.fulfill({ response: res, body });
      });
    }
  });
}
const posted = (api, r) => api.requests.filter((q) => q.r === r && q.method === "POST");
async function signUp(page, name = "nova", password = "blue kite river") {
  await page.click("#menuProfile");
  await page.waitForSelector("#acctForm");
  await page.fill("#acctUser", name);
  await page.fill("#acctPass", password);
  await page.click("#acctGo");
  await page.waitForSelector("#acctCode");
}
async function typeLine(page) {
  await page.click("#menuSandbox");
  if (await page.isVisible("#blockGrid button")) await page.click("#blockGrid button");
  const line = await page.evaluate(() => document.getElementById("targetLine").textContent.replace(/ /g, " "));
  await page.focus("#typeInput");
  await page.keyboard.type(line, { delay: 5 });
}

test("Accounts: without a server, profiles stay on the device and nothing is asked", async () => {
  const asked = [];
  const { ctx, page, log } = await newPage(env, { track: "python", setup: async (c) => c.on("request", (r) => { if (/\/api\//.test(r.url())) asked.push(r.url()); }) });
  assert.deepEqual(asked, [], "a static copy of the site makes no API call while loading");
  assert.equal(await page.isVisible("#liveStrip"), false);
  await page.click("#menuProfile");
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => document.getElementById("accountMain").textContent), "");
  assert.equal(await page.isVisible("#boardSection"), false);
  assert.equal(await page.isVisible("#profCreate"), true, "the device-profile form is right there");
  assert.equal(await page.textContent("#profChip"), "Free · on this device");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: the progress card counts everyone's lines today and opens the leaderboard", async () => {
  const api = fakeApi([{ username: "ada", password: "pw-ada-1234", xp: 640 }, { username: "lin", password: "pw-lin-1234", xp: 220 }]);
  const { ctx, page, log } = await withApi(api);
  await page.waitForSelector("#liveStrip:not(.hidden)");
  assert.match(await page.textContent("#liveStrip"), /41\s+lines typed today on Code Block\s+2 members online/);
  await page.click("#liveBoardBtn");
  await page.waitForSelector("#boardSection .board-row");
  const rows = await page.$$eval("#boardSection .board-row", (els) => els.map((e) => e.innerText.replace(/\s+/g, " ").trim()));
  assert.deepEqual(rows, ["1 ada Level 4 640 XP", "2 lin Level 2 220 XP"]);
  assert.match(await page.textContent("#boardSection .board-me"), /Make a free account/);
  await page.click('#boardSection [data-period="all"]');
  await page.waitForFunction(() => document.querySelector('#boardSection [data-period="all"]').getAttribute("aria-pressed") === "true");
  assert.ok(api.requests.some((q) => q.r === "leaderboard" && q.method === "GET"), "the board was asked for");
  assert.equal(await page.textContent("#profChip"), "Free · saved online");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: signing up keeps the guest's work, shows the recovery code once, and saves it all", async () => {
  const api = fakeApi();
  const { ctx, page, log } = await withApi(api, {
    storage: {
      "code-block-progress-python-v1": JSON.stringify({ reps: { 0: 8, 1: 3 }, celebrated: false }),
      "code-block-fx-progress-v1": JSON.stringify({ guest: { xp: 120, streak: 2, lastDay: today(), bestWpm: 31, trophies: { "first-rep": 1 } } })
    }
  });
  await signUp(page, "nova");
  const sent = posted(api, "signup")[0].body;
  assert.deepEqual(sent, { username: "nova", password: "blue kite river", public: true, carry: { xp: 120, bestWpm: 31 } });
  assert.match(await page.textContent("#acctCode"), /^ABCD-EFGH-JKLM-NPQR$/);
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === "acctCodeTitle");
  await page.click("#acctCodeDone");
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === "acctName");
  assert.equal(await page.isVisible("#acctCode"), false, "the code is shown once");
  assert.equal(await page.textContent("#acctName"), "@nova");
  assert.equal(await page.textContent("#menuProfileLabel"), "nova");
  const local = await page.evaluate(() => ({ active: cbStore.active, prof: cbStore.profiles["@nova"], fx: CBFX.progress() }));
  assert.equal(local.active, "@nova");
  assert.deepEqual(local.prof.account, { id: 1, username: "nova" });
  assert.deepEqual(local.prof.progress_python.reps, { 0: 8, 1: 3 });
  assert.equal(local.fx.xp, 120, "the guest's XP came along");
  assert.ok(local.fx.trophies["first-rep"], "and the guest's trophies");
  // Everything goes up to the account.
  await page.waitForFunction(() => document.getElementById("acctSync").textContent.startsWith("Saved to your account"));
  const saved = api.progress.get(1);
  assert.deepEqual(saved.python, { reps: { 0: 8, 1: 3 }, celebrated: false, vault: "" });
  assert.equal(saved.fx.xp, 120);
  assert.match(await page.textContent("#acctStats"), /Level 2\s*120 XP/);
  assert.match(await page.textContent("#acctStats"), /2 days/, "the streak shown is the learner's own");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: every finished line is sent: as the account when signed in, as a bare count otherwise", async () => {
  const api = fakeApi();
  const { ctx, page, log } = await withApi(api);
  await typeLine(page);
  await page.waitForFunction(() => true);
  await page.waitForTimeout(300);
  let ev = posted(api, "event");
  assert.equal(ev.length, 1);
  assert.equal(ev[0].cookie, false);
  assert.deepEqual(Object.keys(ev[0].body).sort(), ["day", "kind", "track", "wpm", "xp"]);
  assert.equal(ev[0].body.kind, "rep");
  assert.equal(ev[0].body.track, "python");
  assert.equal(ev[0].body.day, today());
  assert.ok(ev[0].body.xp >= 10);
  await signUp(page, "kai");
  await page.click("#acctCodeDone");
  await typeLine(page);
  await page.waitForFunction(() => document.getElementById("typeInput").value === "" || true);
  await page.waitForTimeout(500);
  ev = posted(api, "event");
  assert.equal(ev.length, 2);
  assert.equal(ev[1].cookie, true, "signed in, the line counts for the account");
  assert.ok(api.users[0].xp > 0 && api.users[0].drills === 1);
  // A cookie still set while someone types as a guest isn't borrowed.
  await page.evaluate(() => { cbStore.active = null; });
  await typeLine(page);
  await page.waitForTimeout(500);
  ev = posted(api, "event");
  assert.equal(ev.length, 3);
  assert.equal(ev[2].cookie, false);
  assert.ok(ev.every((q) => q.codeBlock === "1"));
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: logging in on another device brings the account's progress in", async () => {
  const vault = Buffer.alloc(1250);
  vault[0] = 0b00000111;
  const api = fakeApi([{
    username: "nova", password: "blue kite river", xp: 900,
    progress: {
      python: { reps: { 0: 8, 1: 8, 2: 8, 3: 8, 4: 8, 5: 2 }, celebrated: false, vault: vault.toString("base64") },
      go: { reps: { 0: 8 }, celebrated: false, vault: "" },
      fx: { xp: 900, streak: 4, lastDay: today(), trophies: { "level-5": 1700000000000 }, tracks: { python: 40 } }
    }
  }]);
  const { ctx, page, log } = await withApi(api, { storage: { "code-block-progress-python-v1": JSON.stringify({ reps: { 7: 8 }, celebrated: false }) } });
  await page.click("#menuProfile");
  await page.waitForSelector('#accountMain [data-mode="login"]');
  await page.click('#accountMain [data-mode="login"]');
  await page.fill("#acctUser", "Nova");
  await page.fill("#acctPass", "wrong password");
  await page.click("#acctGo");
  await page.waitForFunction(() => /don't match/.test(document.getElementById("acctMsg").textContent));
  assert.equal(await page.evaluate(() => document.activeElement.id), "acctPass");
  await page.fill("#acctPass", "blue kite river");
  await page.click("#acctGo");
  await page.waitForSelector("#acctName");
  await page.waitForFunction(() => document.getElementById("doneCount").textContent === "5");
  const local = await page.evaluate(() => ({ active: cbStore.active, prof: cbStore.profiles["@nova"], fx: CBFX.progress() }));
  assert.equal(local.active, "@nova");
  assert.deepEqual(Object.keys(local.prof.vault_python).sort(), ["0", "1", "2"], "the banked Vault drills");
  assert.equal(local.prof.progress_go.reps[0], 8, "other tracks come too");
  assert.equal(local.fx.xp, 900);
  assert.ok(local.fx.trophies["level-5"]);
  // The guest's own work wasn't poured into the account at log-in.
  assert.equal(local.prof.progress_python.reps[7], undefined);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("code-block-progress-python-v1")).reps[7]), 8);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: logging out leaves a guest; the account's pick asks for the password again", async () => {
  const api = fakeApi([{ username: "nova", password: "blue kite river", xp: 50 }]);
  const { ctx, page, log } = await withApi(api);
  await page.click("#menuProfile");
  await page.click('#accountMain [data-mode="login"]');
  await page.fill("#acctUser", "nova");
  await page.fill("#acctPass", "blue kite river");
  await page.click("#acctGo");
  await page.waitForSelector("#acctLogout");
  await page.click("#acctLogout");
  await page.waitForSelector("#acctForm");
  assert.equal(await page.evaluate(() => cbStore.active), null);
  assert.equal(await page.textContent("#menuProfileLabel"), "Sign Up");
  const pick = await page.textContent('[data-signin="@nova"]');
  assert.match(pick, /online account · tap to log in/);
  await page.click('[data-signin="@nova"]');
  await page.waitForFunction(() => document.activeElement && document.activeElement.id === "acctPass");
  assert.equal(await page.inputValue("#acctUser"), "nova");
  assert.equal(await page.evaluate(() => cbStore.active), null, "nothing opens without the password");
  // A session that ran out on the server: the profile asks to log in again.
  await page.fill("#acctPass", "blue kite river");
  await page.click("#acctGo");
  await page.waitForSelector("#acctName");
  api.sessions.clear();
  await page.reload();
  await page.click("#menuProfile");
  await page.waitForFunction(() => /Log in to @nova/.test(document.getElementById("accountMain").textContent));
  assert.equal(await page.inputValue("#acctUser"), "nova");
  assert.equal(await page.isVisible("#acctGuest"), true);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: problems are said in plain words, and offline is no crash", async () => {
  const api = fakeApi([{ username: "taken", password: "pw-taken-1234" }]);
  const { ctx, page, log } = await withApi(api);
  await page.click("#menuProfile");
  await page.waitForSelector("#acctForm");
  await page.fill("#acctUser", "no");
  await page.fill("#acctPass", "blue kite river");
  await page.click("#acctGo");
  assert.match(await page.textContent("#acctMsg"), /3 to 20 letters/);
  assert.equal(await page.evaluate(() => document.activeElement.id), "acctUser");
  assert.equal(posted(api, "signup").length, 0, "checked before asking the server");
  await page.fill("#acctUser", "taken");
  await page.fill("#acctPass", "short");
  await page.click("#acctGo");
  assert.match(await page.textContent("#acctMsg"), /at least 8 characters/);
  await page.fill("#acctPass", "blue kite river");
  await page.click("#acctGo");
  await page.waitForFunction(() => /taken/.test(document.getElementById("acctMsg").textContent));
  assert.equal(await page.evaluate(() => document.activeElement.id), "acctUser");
  api.fail = (r) => r === "signup";
  await page.fill("#acctUser", "fresh_name");
  await page.click("#acctGo");
  await page.waitForFunction(() => /Can't reach/.test(document.getElementById("acctMsg").textContent));
  assert.equal(await page.isDisabled("#acctGo"), false, "the button comes back");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: deleting asks for the password, then leaves this device as a guest", async () => {
  const api = fakeApi();
  const { ctx, page, log } = await withApi(api);
  await signUp(page, "gone");
  await page.click("#acctCodeDone");
  await page.click("#acctDelete");
  assert.equal(await page.evaluate(() => document.activeElement.id), "acctDeletePass");
  await page.fill("#acctDeletePass", "not it at all");
  await page.click('#acctDeleteForm [type="submit"]');
  await page.waitForFunction(() => /nothing was deleted/.test(document.getElementById("acctMsg").textContent));
  await page.fill("#acctDeletePass", "blue kite river");
  await page.click('#acctDeleteForm [type="submit"]');
  await page.waitForSelector("#acctForm");
  assert.equal(api.users.length, 0);
  assert.equal(await page.evaluate(() => cbStore.active), null);
  assert.equal(await page.evaluate(() => "@gone" in cbStore.profiles), false);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Accounts: the account cards pass the accessibility scan in every theme", async () => {
  const probe = await newPage(env, { track: "python" });
  const ids = await probe.page.evaluate(() => window.CBTheme.list().map((t) => t.id));
  await probe.ctx.close();
  const problems = [];
  const scan = async (page, label) => {
    await page.addScriptTag({ content: AXE });
    const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"], runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations
      .filter((x) => x.impact === "serious" || x.impact === "critical")
      .map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ") + " " + (n.any[0] && n.any[0].message ? n.any[0].message.slice(0, 120) : "")).join(" | ")}`));
    v.forEach((x) => problems.push(`${label}: ${x}`));
  };
  for (const id of ids) {
    const api = fakeApi([{ username: "ada", password: "pw-ada-1234", xp: 640 }]);
    const { ctx, page } = await withApi(api, { storage: { "code-block-theme-v1": id } });
    await page.click("#menuProfile");
    await page.waitForSelector("#boardSection .board-row");
    await scan(page, `${id} · signed out`);
    await signUp(page, "nova");
    await page.waitForTimeout(300);
    await scan(page, `${id} · recovery code`);
    await page.click("#acctCodeDone");
    await page.click("#acctDelete");
    await page.click("#acctPassBox summary");
    await page.waitForTimeout(300);
    await scan(page, `${id} · signed in`);
    await ctx.close();
  }
  assert.deepEqual(problems, []);
});
