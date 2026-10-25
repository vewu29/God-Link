// Typing FX: every keystroke answers — the stats strip, combos, the
// wrong-key tip, XP and levels, the today strip, trophies, the sound
// switch, and sparks that step aside for reduced motion.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage } = require("./helpers/harness");

let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

async function openDrill(page, i) {
  await page.evaluate((n) => document.querySelectorAll("#blockGrid button")[n].click(), i);
  await page.waitForFunction(() => !document.getElementById("drillView").classList.contains("hidden"));
  await page.focus("#typeInput");
  return page.evaluate((n) => BLOCKS[n].line, i);
}
const keyName = (c) => (c === " " ? "space" : c);

test("Typing FX: a typed line builds a combo, pays XP and fills today's goal", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python" });
  assert.match(await page.textContent("#fxToday"), /0\/10 lines today/);
  const line = await openDrill(page, 1);
  assert.ok(await page.$("#typeCard .fx-hud"), "the stats strip sits on the console");
  await page.keyboard.type(line, { delay: 15 });
  const s = await page.evaluate(() => ({
    combo: CBFX.combo(), p: CBFX.progress(),
    chip: document.querySelector("#typeCard .fx-combo-n").textContent,
    lv: document.querySelector("#typeCard .fx-lv b").textContent,
    strip: document.getElementById("fxToday").textContent.replace(/\s+/g, " "),
    reps: document.getElementById("repText").textContent
  }));
  assert.equal(s.reps, "1 / 8 reps");
  assert.equal(s.combo, line.length);
  assert.equal(s.chip, String(line.length));
  assert.ok(s.p.xp >= 15, "a perfect first line pays at least 15 XP, got " + s.p.xp);
  assert.equal(s.p.today.reps, 1);
  assert.equal(s.p.streak, 1);
  assert.ok(s.p.trophies["first-rep"] > 1e12, "the first-rep trophy is stamped with the time");
  assert.equal(s.lv, "Lv 1");
  assert.match(s.strip, /1\/10 lines today/);
  assert.match(s.strip, /1 day streak/);
  // The trophy shelf in the profile room shows it unlocked.
  assert.equal(await page.$$eval("#fxShelfGrid .fx-trophy.on", (els) => els.length >= 1), true);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: a wrong key breaks the combo and shows the key the line wants", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python" });
  const line = await openDrill(page, 1);
  await page.keyboard.type(line.slice(0, 3), { delay: 15 });
  assert.equal(await page.evaluate(() => CBFX.combo()), 3);
  await page.keyboard.type("§");
  const tip = await page.$eval("#typeCard .fx-tip", (el) => ({ want: el.querySelector(".fx-tip-want").textContent, got: el.querySelector(".fx-tip-got").textContent }));
  assert.equal(tip.want, keyName(line[3]));
  assert.equal(tip.got, "not §");
  assert.equal(await page.evaluate(() => CBFX.combo()), 0);
  assert.equal(await page.textContent("#typeCard .fx-acc b"), "75%");
  // The next right letter clears the tip.
  await page.waitForTimeout(450);
  await page.keyboard.type(line[3]);
  assert.equal(await page.$("#typeCard .fx-tip"), null);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: a pasted line still counts as a rep but earns no XP", async () => {
  const { ctx, page, log } = await newPage(env, { track: "javascript" });
  const line = await openDrill(page, 0);
  await page.fill("#typeInput", line);
  const s = await page.evaluate(() => ({ reps: document.getElementById("repText").textContent, xp: CBFX.progress().xp, today: CBFX.progress().today.reps }));
  assert.equal(s.reps, "1 / 8 reps");
  assert.equal(s.xp, 0);
  assert.equal(s.today, 0);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: the sound switch cycles through the sounds and is remembered", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python" });
  await openDrill(page, 0);
  const seen = [];
  for (let k = 0; k < 4; k++) {
    seen.push(await page.getAttribute("#typeCard .fx-sound", "aria-label"));
    await page.click("#typeCard .fx-sound");
  }
  assert.deepEqual(seen.map((l) => l.replace(/^Key sounds: (\w+)\..*$/, "$1")), ["Melody", "Typewriter", "Bubbles", "Off"]);
  // The fourth click wrapped back to Melody; one more is Typewriter.
  await page.click("#typeCard .fx-sound");
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem("code-block-fx-settings-v1"))).sound, "typewriter");
  await page.reload();
  await openDrill(page, 0);
  assert.match(await page.getAttribute("#typeCard .fx-sound", "aria-label"), /^Key sounds: Typewriter/);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: sparks fly only when motion is welcome", async () => {
  for (const [motion, want] of [["reduce", false], ["no-preference", true]]) {
    const { ctx, page, log } = await newPage(env, { track: "python", reducedMotion: motion });
    const line = await openDrill(page, 1);
    await page.keyboard.type(line.slice(0, 4), { delay: 15 });
    assert.equal(!!(await page.$("#typeCard canvas.fx-layer")), want, `${motion}: spark layer`);
    assert.deepEqual(log.pageErrors, []);
    await ctx.close();
  }
});

test("Typing FX: the Vault console gets the same strip, and a typed drill pays XP", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python" });
  await page.click("#menuProfile");
  await page.fill("#profName", "Typist");
  await page.click("#profCreate");
  await page.click("#menuVault");
  await page.click("#vaultMain .pack-btn");
  await page.click("#vaultMain .drill-row");
  await page.waitForSelector("#vaultInput");
  assert.ok(await page.$("#vaultMain .type-card .fx-hud"), "the Vault console has the stats strip");
  const line = await page.evaluate(() => document.getElementById("vaultTarget").textContent.replace(/ /g, " "));
  await page.focus("#vaultInput");
  await page.keyboard.type(line, { delay: 10 });
  const p = await page.evaluate(() => CBFX.progress());
  assert.equal(p.banked, 1);
  assert.ok(p.xp >= 7, "a typed Vault drill pays XP, got " + p.xp);
  const store = await page.evaluate(() => JSON.parse(localStorage.getItem("code-block-fx-progress-v1")));
  assert.ok(store["p:Typist"] && store["p:Typist"].xp === p.xp, "XP is kept under the profile");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: a new profile on this device brings the guest's XP and trophies along", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python", storage: { "code-block-fx-progress-v1": JSON.stringify({ guest: { xp: 240, bestWpm: 44, trophies: { "first-rep": 1 } } }) } });
  await page.click("#menuProfile");
  await page.fill("#profName", "Mover");
  await page.click("#profCreate");
  const p = await page.evaluate(() => CBFX.progress());
  assert.equal(p.xp, 240);
  assert.equal(p.bestWpm, 44);
  assert.ok(p.trophies["first-rep"]);
  const store = await page.evaluate(() => JSON.parse(localStorage.getItem("code-block-fx-progress-v1")));
  assert.equal(store["p:Mover"].xp, 240, "kept under the new profile");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Typing FX: one shared audio engine, woken again after the phone pauses it", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python" });
  await page.evaluate(() => {
    const C = window.AudioContext;
    window.__engines = 0;
    window.AudioContext = function () { window.__engines++; return new C(); };
  });
  await page.click("#blockGrid button");
  const line = await page.evaluate(() => document.getElementById("targetLine").textContent.replace(/ /g, " "));
  await page.focus("#typeInput");
  await page.keyboard.type(line.slice(0, 3), { delay: 20 });
  await page.click("#musicBtn");
  await page.waitForTimeout(200);
  await page.click("#musicBtn");
  await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(() => window.cbAudioContext().state), "running", "stopping the music no longer pauses the engine the typing uses");
  // A call, the lock screen or another app pauses it…
  await page.evaluate(() => window.cbAudioContext().suspend());
  await page.focus("#typeInput");
  await page.keyboard.type(line.slice(3, 5), { delay: 20 });
  await page.waitForFunction(() => window.cbAudioContext().state === "running");
  assert.ok(await page.evaluate(() => window.__engines) <= 1, "music and typing share one engine");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});
