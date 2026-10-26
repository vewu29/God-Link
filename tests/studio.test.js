// Code Block Studio, the no-code game engine (studio.html), driven in a
// real browser: the Babylon.js view, the Blueprint editor (palette,
// wiring by drag and by tap, undo), Play mode on desktop and phone,
// saving, import, and an accessibility scan.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { launch, newPage } = require("./helpers/harness");

const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const DESK = { path: "studio.html", viewport: { width: 1440, height: 900 }, mobile: false };
let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

// Opens the Studio and waits for the 3D view; the first visit shows a
// welcome sheet, closed here unless keepWelcome.
async function openStudio(opts = {}) {
  const { keepWelcome, ...rest } = opts;
  const s = await newPage(env, { ...DESK, ...rest });
  await s.page.waitForFunction(() => window.CBStudioEditor && window.BABYLON && document.querySelector("#stCanvas").width > 0, null, { timeout: 20000 });
  if (!keepWelcome) {
    const close = s.page.locator("#stSheetClose");
    await close.waitFor({ state: "visible", timeout: 3000 }).then(() => close.click(), () => {});
  }
  return s;
}
const links = (page) => page.evaluate(() => window.CBStudioEditor.graph().links.map((l) => `${l.from.node}.${l.from.pin}>${l.to.node}.${l.to.pin}`).sort());
const nodeIds = (page, type) => page.evaluate((t) => window.CBStudioEditor.graph().nodes.filter((n) => n.type === t).map((n) => n.id), type);
function pin(page, node, name, side) { return page.locator(`.bp-pin[data-node="${node}"][data-pin="${name}"][data-side="${side}"]`); }
async function centre(loc) { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 6 });
  await page.mouse.move(to.x, to.y, { steps: 6 }); await page.mouse.up();
}
// Starts the Empty level from the Games menu, picks its Level Blueprint
// (BeginPlay wired to a Print) and returns the graph's empty corner.
async function showGraph(page) {
  await page.click("#stGames");
  await page.click('#stSheetBody [data-sample="blank"]');
  await page.click('#stActors [data-actor="level"]');
  const b = await page.locator("#bp").boundingBox();
  return { x: b.x + b.width - 60, y: b.y + b.height - 40 };
}

test("opens Coin Run in the 3D view with every starter's Blueprints laid out without overlaps", async () => {
  const { ctx, page, log } = await openStudio({ keepWelcome: true });
  assert.ok(await page.locator("#stSheet").isVisible(), "a first visit shows the welcome sheet");
  await page.click("#stSheetClose");
  assert.equal(await page.inputValue("#stName"), "Coin Run");
  assert.equal(await page.locator("#stActors [data-actor]").count(), 10, "the Level, ground, two platforms, the player and five coins");
  assert.ok(await page.locator(".bp-node").count() > 10, "the Player's Blueprint is drawn");
  const overlaps = await page.evaluate(() => {
    const out = [];
    for (const sample of window.CBStudioSamples) {
      window.CBStudioEditor.addStarter(sample);
      const p = window.CBStudioEditor.project();
      for (const id of ["level"].concat(p.actors.map((a) => a.id))) {
        window.CBStudioEditor.select(id);
        const r = [...document.querySelectorAll(".bp-node")].map((el) => ({ t: el.querySelector(".bp-head").textContent, x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }));
        for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
          const a = r[i], b = r[j];
          if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) out.push(`${sample.id}/${id}: ${a.t} overlaps ${b.t}`);
        }
      }
    }
    return out;
  });
  assert.deepEqual(overlaps, []);
  assert.deepEqual(log.pageErrors, []);
  assert.deepEqual(log.console, []);
  await ctx.close();
});

test("Blueprint editing: add from the palette, wire by dragging and by tapping, drop a wire to add, undo and redo", async () => {
  const { ctx, page, log } = await openStudio();
  const corner = await showGraph(page);
  const [begin] = await nodeIds(page, "BeginPlay");
  const [print] = await nodeIds(page, "PrintString");
  const start = await links(page);
  assert.deepEqual(start, [`${begin}.Then>${print}.In`]);

  // double-click empty space: the palette opens; search and press Enter
  await page.mouse.dblclick(corner.x - 160, corner.y - 120);
  await page.locator("#stPalette").waitFor({ state: "visible" });
  await page.keyboard.type("delay");
  await page.keyboard.press("Enter");
  const [delay] = await nodeIds(page, "Delay");
  assert.ok(delay, "a Delay node was added");

  // drag BeginPlay's Then onto the Delay: an exec output has one wire, so it moves
  await drag(page, await centre(pin(page, begin, "Then", "out")), await centre(pin(page, delay, "In", "in")));
  assert.deepEqual(await links(page), [`${begin}.Then>${delay}.In`]);

  // tap Completed, then tap the Print's In (the phone way)
  await pin(page, delay, "Completed", "out").click();
  assert.ok(await pin(page, delay, "Completed", "out").evaluate((el) => el.classList.contains("armed")), "the first tap arms the pin");
  await pin(page, print, "In", "in").click();
  assert.deepEqual(await links(page), [`${begin}.Then>${delay}.In`, `${delay}.Completed>${print}.In`].sort());

  // drop a wire from the Print's Then on empty space: the palette shows what fits, and the new node arrives wired
  await drag(page, await centre(pin(page, print, "Then", "out")), { x: corner.x - 20, y: corner.y - 20 });
  await page.locator("#stPalette").waitFor({ state: "visible" });
  assert.match(await page.textContent("#stPalHint"), /fit Then/);
  await page.keyboard.type("play sound");
  await page.keyboard.press("Enter");
  const [sound] = await nodeIds(page, "PlaySound");
  assert.ok((await links(page)).includes(`${print}.Then>${sound}.In`), "the dropped wire connects the new node");

  // Delete removes the selected node and its wires; undo brings it back, redo removes it again
  await page.locator(`.bp-node[data-id="${sound}"] .bp-head`).click();
  await page.keyboard.press("Delete");
  assert.deepEqual(await nodeIds(page, "PlaySound"), []);
  await page.keyboard.press("Control+z");
  assert.deepEqual(await nodeIds(page, "PlaySound"), [sound]);
  await page.keyboard.press("Control+y");
  assert.deepEqual(await nodeIds(page, "PlaySound"), []);
  for (let i = 0; i < 4; i++) await page.click("#stUndo");
  assert.deepEqual(await links(page), start, "undoing every step restores the starting wires");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("a typed value on a node and Tidy up are each one undo step", async () => {
  const { ctx, page } = await openStudio();
  await showGraph(page);
  const [print] = await nodeIds(page, "PrintString");
  const text = () => page.evaluate((id) => window.CBStudioEditor.graph().nodes.find((n) => n.id === id).data.in.Text, print);
  const spots = () => page.evaluate(() => JSON.stringify(window.CBStudioEditor.graph().nodes.map((n) => [n.x, n.y])));
  const original = await text();
  const box = page.locator(`.bp-node[data-id="${print}"] input[data-in="Text"]`);
  await box.fill("Ready, set, go!");
  await box.press("Tab");
  assert.equal(await text(), "Ready, set, go!");
  const tidy = await spots();
  // drag the Print node far away, then Tidy up puts it back in line
  const head = await centre(page.locator(`.bp-node[data-id="${print}"] .bp-head`));
  await drag(page, head, { x: head.x + 150, y: head.y + 160 });
  assert.notEqual(await spots(), tidy, "the node moved");
  await page.click("#stTidy");
  assert.equal(await spots(), tidy);
  await page.click("#stUndo");
  assert.notEqual(await spots(), tidy, "undo takes back the tidy");
  await page.click("#stUndo");
  assert.equal(await spots(), tidy, "undo takes back the drag");
  await page.click("#stUndo");
  assert.equal(await text(), original, "undo takes back the typing");
  await ctx.close();
});

test("Play runs Coin Run: the HUD counts coins, keys move the player, Escape goes back", async () => {
  const { ctx, page, log } = await openStudio();
  await page.click("#stPlay");
  await page.waitForFunction(() => document.querySelector("#stHud").textContent.includes("0 / 5"));
  assert.ok(await page.evaluate(() => document.body.classList.contains("playing")));
  const x0 = await page.evaluate(() => window.CBStudioEditor.game().byName("Player").pos.x);
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(700);
  await page.keyboard.up("ArrowRight");
  assert.ok(await page.evaluate(() => window.CBStudioEditor.game().byName("Player").pos.x) > x0 + 1, "the right arrow walks the player right");
  // stand the player on a coin: the overlap event, the broadcast and the HUD all run
  await page.evaluate(() => { const g = window.CBStudioEditor.game(), c = g.withTag("coin")[0], p = g.byName("Player"); p.pos = { x: c.pos.x, y: c.pos.y, z: c.pos.z }; p.vel = { x: 0, y: 0, z: 0 }; });
  await page.waitForFunction(() => document.querySelector("#stHud").textContent.includes("1 / 5"), null, { timeout: 5000 });
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => document.body.classList.contains("playing")), false);
  assert.equal(await page.evaluate(() => window.CBStudioEditor.project().actors.filter((a) => a.tags.includes("coin")).length), 5, "playing never changes the level being edited");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("phone: tabs switch panels, the Blueprint opens readable, and Play shows the game and touch pad from any tab", async () => {
  const { ctx, page, log } = await openStudio({ path: "studio.html", viewport: { width: 390, height: 844 }, mobile: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, "no sideways scrolling");
  await page.click('.st-tabs [data-tab="graph"]');
  await page.waitForTimeout(100);
  assert.ok(await page.locator("#bp").isVisible());
  const z = await page.evaluate(() => { const m = getComputedStyle(document.querySelector("#bpWorld")).transform; return new DOMMatrix(m).a; });
  assert.ok(z >= 0.45, `the Blueprint opens big enough to read (zoom ${z})`);
  const head = await page.locator(".bp-node .bp-head").first().boundingBox();
  assert.ok(head.x >= 0 && head.x < 390, "the first node is on screen");
  await page.click('.st-tabs [data-tab="details"]');
  assert.ok(await page.locator("#stDetails").isVisible());
  assert.equal(await page.locator("#stView").isVisible(), false);
  await page.click("#stPlay");
  await page.waitForFunction(() => document.querySelector("#stHud").textContent.includes("0 / 5"));
  const canvas = await page.locator("#stCanvas").boundingBox();
  assert.ok(canvas.width >= 380 && canvas.height >= 800, "the game fills the screen");
  assert.ok(await page.locator('#stPad [data-key="Space"]').isVisible(), "the touch pad shows");
  const x0 = await page.evaluate(() => window.CBStudioEditor.game().byName("Player").pos.x);
  await page.dispatchEvent('#stPad [data-key="Right"]', "pointerdown", { pointerId: 7, pointerType: "touch" });
  await page.waitForTimeout(500);
  await page.dispatchEvent('#stPad [data-key="Right"]', "pointerup", { pointerId: 7, pointerType: "touch" });
  assert.ok(await page.evaluate(() => window.CBStudioEditor.game().byName("Player").pos.x) > x0, "holding the pad's right arrow walks right");
  await page.click("#stStop");
  assert.equal(await page.evaluate(() => document.body.classList.contains("playing")), false);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("games save on this device, reopen after a reload, and import from a file", async () => {
  const { ctx, page } = await openStudio();
  await page.fill("#stName", "My Coin Game");
  await page.press("#stName", "Enter");
  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForFunction(() => window.CBStudioEditor && document.querySelector("#stName").value);
  assert.equal(await page.inputValue("#stName"), "My Coin Game");
  assert.equal(await page.locator("#stSheet:not(.hidden)").count(), 0, "the welcome sheet is only for the first visit");

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cb-studio-"));
  const file = path.join(dir, "rocks.codeblock.json");
  const rocks = await page.evaluate(() => { const p = window.CBStudioSamples.find((s) => s.id === "dodge").make(); p.name = "Imported Rocks"; return p; });
  fs.writeFileSync(file, JSON.stringify({ codeBlockStudio: 1, project: rocks }));
  await page.click("#stGames");
  await page.setInputFiles("#stFile", file);
  await page.waitForFunction(() => document.querySelector("#stName").value === "Imported Rocks");
  await page.click("#stGames");
  const names = await page.locator("#stSheetBody").textContent();
  assert.ok(names.includes("My Coin Game") && names.includes("Imported Rocks"), "both games are listed");

  fs.writeFileSync(file, "{\"not\": \"a game\"}");
  await page.setInputFiles("#stFile", file);
  await page.waitForFunction(() => document.querySelector("#stSheetTitle").textContent === "Import");
  assert.equal(await page.inputValue("#stName"), "Imported Rocks", "a bad file changes nothing");
  fs.rmSync(dir, { recursive: true, force: true });
  await ctx.close();
});

test("no serious or critical accessibility problems in the editor, the palette and Play", async () => {
  const { ctx, page } = await openStudio();
  await page.addScriptTag({ content: AXE });
  const scan = () => page.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"], runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations
    .filter((x) => x.impact === "serious" || x.impact === "critical")
    .map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`));
  const problems = [];
  (await scan()).forEach((x) => problems.push(`editor: ${x}`));
  await page.click("#stAddNode");
  (await scan()).forEach((x) => problems.push(`palette: ${x}`));
  await page.keyboard.press("Escape");
  await page.click("#stPlay");
  await page.waitForFunction(() => document.querySelector("#stHud").textContent.includes("0 / 5"));
  (await scan()).forEach((x) => problems.push(`play: ${x}`));
  assert.deepEqual(problems, []);
  await ctx.close();
});
