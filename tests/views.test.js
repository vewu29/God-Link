// The other rooms: PC, Library, Drive test, profiles + Vault, My Book.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { launch, newPage, trackIds, eachTrack } = require("./helpers/harness");

let env, ids;
before(async () => { env = await launch(); ids = await trackIds(env); });
after(async () => { await env.close(); });

test("PC: Compile & Run prints exactly the project's output", async () => {
  await eachTrack(ids.filter((t) => t !== "drive"), async (track) => {
    const { ctx, page, log } = await newPage(env, { track });
    await page.click("#menuPc");
    const expected = await page.evaluate(() => PROJECTS[pcIndex].run(pcVars()));
    await page.click("#compileBtn");
    await page.waitForFunction(() => document.querySelector("#pcStatusText").textContent === "Finished", null, { timeout: 15000 });
    let screen = await page.$$eval("#pcScreen > div", (ds) => ds.map((d) => d.textContent));
    if (await page.evaluate(() => !!CB_META.preview)) {
      // HTML & CSS: the page is drawn in a sandboxed frame; read the text the browser shows.
      const code = await page.evaluate(() => pcTarget());
      assert.equal(await page.$eval("#pcScreen iframe.pc-preview", (f) => f.getAttribute("srcdoc")), code, `${track}: the frame holds the page's code`);
      const frame = page.frames().find((f) => f.url() === "about:srcdoc");
      await frame.waitForLoadState();
      screen = (await frame.evaluate(() => document.body.innerText)).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
      assert.deepEqual(screen, expected, `${track}: the page shows the project's text`);
    }
    for (const line of expected) assert.ok(screen.includes(line), `${track}: missing output line ${JSON.stringify(line)}`);
    assert.deepEqual(log.pageErrors, []);
    await ctx.close();
  });
});

test("PC: every blue-box number is highlighted where the code declares it", async () => {
  // Two sliders pick something rather than set a number in the code:
  // "pick" chooses a word, and "coins" decides how many coins the level holds.
  const NOT_IN_CODE = ["pick", "coins"];
  await eachTrack(ids.filter((t) => t !== "drive"), async (track) => {
    const { ctx, page } = await newPage(env, { track });
    await page.click("#menuPc");
    const missing = await page.evaluate((skip) => {
      const out = [];
      for (let i = 0; i < PROJECTS.length; i++) {
        const pick = document.getElementById("pcPick");
        pick.value = String(i);
        pick.dispatchEvent(new Event("change"));
        const marked = [...document.querySelectorAll("#pcCode .hl")].map((e) => e.textContent);
        const v = pcVars();
        for (const d of PROJECTS[i].vars) {
          if (skip.includes(d.key)) continue;
          const at = marked.indexOf(String(v[d.key]));
          if (at < 0) out.push(PROJECTS[i].name + ": " + d.key);
          else marked.splice(at, 1);
        }
      }
      return out;
    }, NOT_IN_CODE);
    assert.deepEqual(missing, [], `${track}: these sliders' numbers aren't highlighted in the code`);
    await ctx.close();
  });
});

test("Library: chapters open, Next walks the whole book, Picture mode plays", async () => {
  await eachTrack(ids, async (track) => {
    const { ctx, page, log } = await newPage(env, { track });
    await page.click("#menuLibrary");
    const n = await page.evaluate(() => CHAPTERS.length);
    await page.click("#libGrid > :first-child");
    for (let i = 1; i < n; i++) await page.click("#nextChapter");
    assert.equal(await page.textContent("#readerTitle"), await page.evaluate(() => CHAPTERS[CHAPTERS.length - 1].title));
    assert.equal(await page.$eval("#nextChapter", (e) => e.disabled), true);
    await page.click("#modePicture");
    await page.click("#stagePlay");
    await page.waitForTimeout(400);
    assert.ok((await page.textContent("#stageConsole")).length > 0);
    assert.deepEqual(log.pageErrors, [], `${track}: page errors`);
    await ctx.close();
  });
});

test("Library: glossary search filters", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuLibrary");
  await page.fill("#glossSearch", "pointer");
  await page.waitForTimeout(100);
  assert.match(await page.textContent("#glossCount"), /Showing \d+ of \d+ matching/);
  await ctx.close();
});

test("Drive: a practice test starts and shows a question with four answers", async () => {
  const { ctx, page, log } = await newPage(env, { track: "drive" });
  await page.click("#menuPc");
  await page.click("text=Start a practice test");
  await page.waitForTimeout(200);
  const answers = await page.$$eval("#pcView button", (bs) => bs.filter((b) => b.offsetParent && /^[A-D]\s/.test(b.innerText.trim())).length);
  assert.equal(answers, 4);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Profiles: create a profile, the Vault opens, progress saves under it", async () => {
  const { ctx, page, log } = await newPage(env);
  await page.click("#menuProfile");
  await page.fill("#profName", "Tester");
  await page.click("#profCreate");
  assert.equal((await page.textContent("#menuProfileLabel")).trim(), "Tester");
  await page.click("#menuVault");
  assert.ok((await page.$$("#vaultMain button")).length > 100);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("code-block-profiles-v1")));
  assert.equal(saved.active, "Tester");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("My Book: a PDF chosen from the device opens on page 1", async () => {
  const pdf = path.join(os.tmpdir(), "cb-test.pdf");
  fs.writeFileSync(pdf, minimalPdf(3));
  const { ctx, page, log } = await newPage(env);
  await page.click("#menuBook");
  await page.setInputFiles("#bookFile", pdf);
  await page.waitForFunction(() => /Page 1 of 3/.test(document.querySelector("#bookStatus").textContent), null, { timeout: 15000 });
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

function minimalPdf(pages) {
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${Array.from({ length: pages }, (_, i) => `${3 + i * 2} 0 R`).join(" ")}] /Count ${pages} >>`];
  for (let i = 0; i < pages; i++) {
    const s = `BT /F1 24 Tf 72 700 Td (Page ${i + 1}) Tj ET`;
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${4 + i * 2} 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>`);
    objs.push(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);
  }
  let out = "%PDF-1.4\n";
  const offs = [];
  objs.forEach((o, n) => { offs.push(out.length); out += `${n + 1} 0 obj\n${o}\nendobj\n`; });
  const x = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  return out + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
}
