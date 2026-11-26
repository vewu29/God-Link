// Web Studio proof run: WebKit (iPhone 17 Pro Max-like) + Chromium.
// node test_studio.js [webkit|chromium]   — needs `python3 -m http.server 8765` in ui/testsite
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || require("path").join(process.env.HOME, "workspace/.pw/browsers");
const { webkit, chromium } = require(require("path").join(process.env.HOME, "workspace/.pw/node_modules/playwright"));
const fs = require("fs");
const eng0 = process.argv[2] || "webkit";
const CRIOS = process.argv[3] === "crios";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1";
const eng = eng0;
const TAG = eng0 + (CRIOS ? "-crios" : "");
const BASE = "http://localhost:8765/";
const SHOTS = __dirname + "/shots/";
const results = [];
function ok(name, pass, info) { results.push({ name, pass: !!pass, info: info || "" }); console.log((pass ? "PASS " : "FAIL ") + name + (info ? " — " + info : "")); }
(async () => {
  const B = eng === "webkit" ? webkit : chromium;
  const browser = await B.launch();
  const mk = async (vp, mode) => {
    const ctx = await browser.newContext(Object.assign({ viewport: vp, deviceScaleFactor: 3, isMobile: eng === "webkit", hasTouch: true, colorScheme: mode || "dark" }, CRIOS ? { userAgent: UA } : {}));
    const page = await ctx.newPage();
    page.errs = [];
    page.on("pageerror", e => page.errs.push(String(e)));
    page.on("dialog", d => d.accept(d.type() === "prompt" ? "tools.epp" : undefined));
    return page;
  };
  const P = { width: 440, height: 956 }, L = { width: 956, height: 440 };
  const page = await mk(P, "dark");
  await page.goto(BASE + "epp-studio.html", { waitUntil: "load" });
  await page.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 15000 });
  ok("page loads, engine ready", true, await page.textContent("#esStatus"));
  const S = (js, arg) => page.evaluate(js, arg);
  const setText = t => S(t => window.EppStudio.editor.setText(t), t);
  // highlighting
  const hl = await S(() => ({ roots: document.querySelectorAll(".epp-root").length, str: document.querySelectorAll(".epp-str").length, note: document.querySelectorAll(".epp-note").length }));
  ok("highlighting visible", hl.roots >= 3 && hl.str >= 2 && hl.note >= 1, JSON.stringify(hl));
  // all features highlight
  await setText('note colours\nnow xlb raylib\nscore is 0\nn is nsq&16\nv mak vec@num\nnow InitWindow 800&450&"Ball"\nnow fea v\n  out prn cct&v\nk is yes\n');
  await page.waitForTimeout(300);
  const hl2 = await S(() => ({ value: document.querySelectorAll(".epp-value").length, kind: document.querySelectorAll(".epp-kind").length, lib: document.querySelectorAll(".epp-lib").length, special: document.querySelectorAll(".epp-special").length, num: document.querySelectorAll(".epp-num").length }));
  ok("value words, kinds, raylib, special, numbers coloured", hl2.value >= 2 && hl2.kind >= 1 && hl2.lib >= 1 && hl2.special >= 2 && hl2.num >= 2, JSON.stringify(hl2));
  await page.screenshot({ path: SHOTS + TAG + "_01_highlight.png" });
  // autocomplete after a partial root
  await setText("x is 5\n");
  await S(() => { const v = window.EppStudio.editor.view; v.focus(); v.dispatch({ selection: { anchor: v.state.doc.length } }); });
  await page.keyboard.type("x ig", { delay: 60 });
  await page.waitForFunction(() => { const t = document.querySelector(".cm-tooltip-autocomplete"); return t && /igt/.test(t.innerText); }, null, { timeout: 4000 }).catch(() => {});
  const ac = await S(() => { const t = document.querySelector(".cm-tooltip-autocomplete"); return t ? t.innerText.slice(0, 200) : null; });
  ok("autocomplete opens after a partial root", ac && /igt/.test(ac), (ac || "").replace(/\n/g, " | ").slice(0, 120));
  await page.screenshot({ path: SHOTS + TAG + "_02_autocomplete.png" });
  await page.keyboard.press("Escape");
  // value words after &
  await setText("n is 16\nm is ");
  await S(() => { const v = window.EppStudio.editor.view; v.focus(); v.dispatch({ selection: { anchor: v.state.doc.length } }); });
  await page.keyboard.type("ns", { delay: 60 });
  await page.waitForSelector(".cm-tooltip-autocomplete", { timeout: 4000 }).catch(() => {});
  const ac2 = await S(() => { const t = document.querySelector(".cm-tooltip-autocomplete"); return t ? t.innerText : ""; });
  ok("third word offers value words", /nsq/.test(ac2), ac2.split("\n").slice(0, 3).join(" | "));
  await page.keyboard.press("Escape");
  // error on a 4-word line
  await setText('out prn "ok"\nout prn 1 2\n');
  await page.waitForTimeout(1200);
  const er = await S(() => ({ range: document.querySelectorAll(".cm-lintRange-error").length, marker: document.querySelectorAll(".cm-lint-marker-error").length }));
  ok("4-word line flagged (underline + gutter)", er.range >= 1 && er.marker >= 1, JSON.stringify(er));
  // read the message: tap the line → hover tooltip in chromium; check via lint state
  const msg = await S(() => { const el = document.querySelector(".cm-lintRange-error"); el.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: el.getBoundingClientRect().left + 5, clientY: el.getBoundingClientRect().top + 5 })); return true; });
  await page.hover(".cm-lintRange-error").catch(() => {});
  await page.waitForTimeout(700);
  const tip = await S(() => { const t = document.querySelector(".cm-tooltip-lint"); return t ? t.innerText : ""; });
  ok("error message is the plain-English hint", /exactly three words/.test(tip), tip.slice(0, 100));
  await page.screenshot({ path: SHOTS + TAG + "_03_error.png" });
  // Run with the mock
  await setText('note hello\nout prn "Hello, V!"\nname is "Vewu"\nout prn "Hi "&name\n');
  await page.click("#esRun");
  await page.waitForFunction(() => /Finished/.test(document.getElementById("esConsole").innerText), null, { timeout: 8000 }).catch(() => {});
  const out = await page.innerText("#esConsole");
  ok("Run prints output", /Hello, V!/.test(out) && /Hi Vewu/.test(out), out.replace(/\n/g, " | ").slice(0, 100));
  await page.screenshot({ path: SHOTS + TAG + "_04_run.png" });
  // input
  await setText('n get inp\nout prn "You typed "&n\n');
  await page.click("#esRun");
  await page.waitForSelector(".es-in", { timeout: 5000 });
  await page.fill(".es-in", "blue");
  await page.screenshot({ path: SHOTS + TAG + "_05_input.png" });
  await page.press(".es-in", "Enter");
  await page.waitForFunction(() => /Finished/.test(document.getElementById("esConsole").innerText), null, { timeout: 5000 }).catch(() => {});
  ok("input line inline in console", /You typed blue/.test(await page.innerText("#esConsole")));
  // runtime error on its line
  await setText('out prn "a"\nx ert boom\n');
  await page.click("#esRun");
  await page.waitForFunction(() => /Stopped at line/.test(document.getElementById("esConsole").innerText), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(200);
  const rt = await S(() => document.querySelectorAll(".cm-lintRange-error").length);
  ok("runtime error shown on its line", rt >= 1 && /Stopped at line 2/.test(await page.innerText("#esConsole")));
  // C++ view
  await setText('out prn "Hello"\n');
  await page.click("#esCppBtn");
  const cpp = await page.innerText("#esCpp");
  ok("C++ view shows M.cpp", /std::cout/.test(cpp) && /Web Studio's C\+\+ view/.test(await page.innerText(".es-cpp-label")));
  await page.screenshot({ path: SHOTS + TAG + "_06_cpp.png" });
  // examples
  await page.click("#esExamples");
  await page.waitForSelector(".es-ex", { timeout: 5000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: SHOTS + TAG + "_07_examples.png" });
  const exDom = await S(() => ({ buttons: document.querySelectorAll(".es-ex").length, groups: document.querySelectorAll(".es-exg").length }));
  ok("examples list renders lazily (small DOM)", exDom.buttons < 40 && exDom.groups >= 40, JSON.stringify(exDom));
  await S(() => { const d = document.querySelectorAll(".es-exg")[5]; d.open = true; });
  await page.waitForTimeout(150);
  const opened = await S(() => document.querySelectorAll(".es-exg")[5].querySelectorAll(".es-ex").length);
  ok("opening a chapter fills it in", opened > 0, opened + " programs");
  const corpus = JSON.parse(fs.readFileSync(__dirname + "/../corpus/book_corpus.json", "utf8"));
  await page.fill("#esExSearch", "Hello, V!");
  await page.waitForTimeout(200);
  await page.click(".es-ex >> nth=0");
  const loaded = await S(() => window.EppStudio.editor.getText());
  ok("examples menu loads a Book program", loaded.trim() === corpus[0].code.trim(), JSON.stringify(loaded.slice(0, 40)));
  const groups = await S(() => fetch("data/epp-studio/examples.json").then(r => r.json()).then(j => ({ g: j.groups.length, n: j.groups.reduce((a, g) => a + g.items.length, 0) })));
  ok("examples JSON: Book ids 0–309", groups.n >= 310, JSON.stringify(groups));
  // files + xim
  await page.click("#esFileAdd");
  await page.waitForTimeout(200);
  await setText('note tools\nhelper is 1\n');
  await page.click('.es-ftab button[data-i="0"]');
  await setText('now xim "tools.epp"\nout prn "main"\n');
  await page.click("#esRun");
  await page.waitForFunction(() => /Finished|Stopped/.test(document.getElementById("esConsole").innerText), null, { timeout: 5000 }).catch(() => {});
  ok("extra file tab written before Run (xim finds it)", /included tools\.epp/.test(await page.innerText("#esConsole")));
  // share round trip (with multi files and unicode)
  await setText('out prn "héllo — ✓ 你好"\n');
  const url = await S(() => window.EppStudio.shareURL());
  const files0 = await S(() => window.EppStudio.files());
  const p2 = await mk(P, "dark");
  await p2.goto(url, { waitUntil: "load" });
  await p2.waitForFunction(() => window.EppStudio, null, { timeout: 10000 });
  const files1 = await p2.evaluate(() => window.EppStudio.files());
  ok("share link round-trips (2 files, UTF-8)", JSON.stringify(files0) === JSON.stringify(files1), url.length + " chars");
  // single file share
  await p2.evaluate(() => window.EppStudio.editor.setText('out prn "one"\n'));
  await p2.click(".es-fx"); await p2.waitForTimeout(100);
  const u2 = await p2.evaluate(() => window.EppStudio.shareURL());
  ok("single-file share uses #code=", /#code=/.test(u2));
  await p2.context().close();
  // save key prefix only
  await page.click("#esSave");
  const keys = await S(() => Object.keys(localStorage));
  ok("storage keys all start epp-web-studio-", keys.every(k => k.indexOf("epp-web-studio-") === 0), keys.join(","));
  // accessory row inserts &
  await setText("n is 2");
  await S(() => { const v = window.EppStudio.editor.view; v.focus(); v.dispatch({ selection: { anchor: v.state.doc.length } }); });
  const accVisible = await page.isVisible("#esAcc");
  await page.tap('.es-acc-k[data-a="0"]').catch(async () => page.click('.es-acc-k[data-a="0"]'));
  await page.waitForTimeout(150);
  const t2 = await S(() => window.EppStudio.editor.getText());
  ok("accessory row inserts &", accVisible && t2 === "n is 2&", JSON.stringify(t2) + " visible=" + accVisible);
  await page.tap('.es-acc-k[data-a="7"]'); // Tab
  const t3 = await S(() => window.EppStudio.editor.getText());
  ok("accessory Tab indents 2 spaces", /2&  $/.test(t3), JSON.stringify(t3));
  await page.keyboard.press("Escape");
  // tap a root → card
  await setText("score add 10\n");
  await S(() => { const v = window.EppStudio.editor.view; v.focus(); v.dispatch({ selection: { anchor: 7 } }); });
  await page.waitForTimeout(150);
  const card = await page.innerText("#esCard").catch(() => "");
  ok("tap a root shows its card", /add/.test(card) && /arithmetic/i.test(card) && /C\+\+/.test(card), card.replace(/\n/g, " | ").slice(0, 100));
  await page.screenshot({ path: SHOTS + TAG + "_08_card.png" });
  // raylib (mock window) + game keys
  await setText('now xlb raylib\nnow InitWindow 800&450&"Ball"\n');
  await page.click("#esRun");
  await page.waitForTimeout(600);
  const gk = await page.isVisible("#esGameKeys");
  const cv = await page.isVisible("#epp-canvas");
  const box = await page.locator("#esCanvasBox").boundingBox();
  ok("canvas pane + game keys on touch", gk && cv && box && Math.abs(box.width / box.height - 800 / 450) < 0.03, box ? (box.width | 0) + "x" + (box.height | 0) : "");
  const keyOk = await S(() => new Promise(r => { let got = null; const h = e => { got = e.keyCode + "/" + e.code + "/" + e.key; }; window.addEventListener("keydown", h); const b = document.querySelector(".es-gk-right"); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 9 })); setTimeout(() => { b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 9 })); window.removeEventListener("keydown", h); r(got); }, 400); }));
  ok("game key dispatches real KeyboardEvent", keyOk === "39/ArrowRight/ArrowRight", keyOk);
  const gkIn = await S(() => { const r = document.getElementById("esGameKeys").getBoundingClientRect(); return r.bottom <= visualViewport.height + 1 && r.top >= 0; });
  ok("game keys inside the visual viewport", gkIn);
  await page.screenshot({ path: SHOTS + TAG + "_09_canvas.png" });
  await page.click("#esFull"); await page.waitForTimeout(300);
  await page.screenshot({ path: SHOTS + TAG + "_10_fullscreen.png" });
  const fb = await page.locator("#esCanvasBox").boundingBox();
  ok("full-screen canvas keeps aspect", fb && fb.width > 400 && Math.abs(fb.width / fb.height - 800 / 450) < 0.03, fb ? (fb.width | 0) + "x" + (fb.height | 0) : "");
  await page.click("#esFull");
  await page.click("#esStop");
  await page.waitForFunction(() => !document.getElementById("esApp").classList.contains("is-running"), null, { timeout: 5000 }).catch(() => {});
  ok("Stop ends a running game", !(await S(() => document.getElementById("esApp").classList.contains("is-running"))));
  // Qt layer
  await setText('now xlb qt\nnow QtMakeWindow "Hello app"&480&300\nnow QtAddLabel "out"&"Type your name"\nnow QtAddTextBox "name"\nnow QtAddSlider "s"&0&10\nnow QtAddCheckBox "c"&"Loud"\nnow QtAddButton "go"&"Say hi"\nnow QtStart now\n');
  await page.click("#esRun");
  await page.waitForSelector(".es-qt-win .es-qt-button", { timeout: 5000 });
  await page.fill(".es-qt-text", "Vewu");
  await page.click(".es-qt-win .es-qt-button");
  await page.waitForTimeout(300);
  const qtl = await page.innerText(".es-qt-labelw");
  ok("Qt-compatible pane: widgets + click event + getText", /You clicked go/.test(qtl) && /Vewu/.test(qtl), qtl);
  ok("Qt pane labelled as not Qt", /Qt-compatible layer \(HTML widgets\), not Qt itself/.test(await page.innerText(".es-qt-label")));
  await page.screenshot({ path: SHOTS + TAG + "_11_qt.png" });
  await page.click("#esStop");
  await page.waitForTimeout(300);
  ok("0 page errors (portrait)", page.errs.length === 0, page.errs.join(" / "));
  // reload restores the draft
  await setText('out prn "draft"\n'); await page.waitForTimeout(800);
  await page.reload({ waitUntil: "load" }); await page.waitForFunction(() => window.EppStudio, null, { timeout: 10000 });
  ok("reload restores the program", (await S(() => window.EppStudio.editor.getText())) === 'out prn "draft"\n');
  // UA really is CriOS when asked; layout height follows visualViewport
  const ua = await S(() => navigator.userAgent);
  ok("user agent " + (CRIOS ? "is Chrome for iOS (CriOS)" : "default"), CRIOS ? /CriOS/.test(ua) : true, ua.slice(0, 90));
  const fit = await S(() => { const a = document.getElementById("esApp").getBoundingClientRect(); const vv = window.visualViewport; return { app: Math.round(a.height), vv: Math.round(vv ? vv.height : innerHeight), bottom: Math.round(a.bottom) }; });
  ok("app height = visualViewport height (bottom not cut off)", Math.abs(fit.app - fit.vv) <= 1, JSON.stringify(fit));
  const accIn = await S(() => { const r = document.getElementById("esAcc").getBoundingClientRect(); return r.bottom <= (window.visualViewport ? visualViewport.height : innerHeight) + 1; });
  ok("accessory row inside the visual viewport", accIn);
  // viewport shrinks (toolbar / keyboard): layout follows, key row stays visible
  await page.setViewportSize({ width: 440, height: 560 }); await page.waitForTimeout(400);
  const fit2 = await S(() => ({ app: Math.round(document.getElementById("esApp").getBoundingClientRect().height), vv: Math.round(visualViewport.height), acc: Math.round(document.getElementById("esAcc").getBoundingClientRect().bottom) }));
  ok("after shrinking to 560px tall: app follows, key row on screen", Math.abs(fit2.app - fit2.vv) <= 1 && fit2.acc <= fit2.vv, JSON.stringify(fit2));
  await page.screenshot({ path: SHOTS + TAG + "_14_short_viewport.png" });
  await page.setViewportSize(P); await page.waitForTimeout(300);
  // shots: portrait light
  const pl = await mk(P, "light");
  await pl.goto(BASE + "epp-studio.html#code=" + Buffer.from('note Light theme\nout prn "Hello, V!"\nn is nsq&4\nnow fea 1&n\n  out prn n\n').toString("base64url"), { waitUntil: "load" });
  await pl.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 10000 });
  await pl.click("#esRun"); await pl.waitForTimeout(500);
  await pl.screenshot({ path: SHOTS + TAG + "_portrait_light.png" });
  ok("0 page errors (portrait light)", pl.errs.length === 0, pl.errs.join(" / "));
  // landscape dark + light
  for (const mode of ["dark", "light"]) {
    const lp = await mk(L, mode);
    await lp.goto(BASE + "epp-studio.html", { waitUntil: "load" });
    await lp.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 10000 });
    await lp.evaluate(() => window.EppStudio.editor.setText('note Landscape\nout prn "Hello, V!"\nname is "Vewu"\nout prn "Hi "&name\n'));
    await lp.click("#esRun"); await lp.waitForTimeout(500);
    const a = await lp.locator(".es-edit").boundingBox(), b = await lp.locator(".es-out").boundingBox();
    ok("landscape side by side (" + mode + ")", a && b && b.x >= a.x + a.width - 2 && Math.abs(a.y - b.y) < 4, JSON.stringify([a && a.width | 0, b && b.width | 0]));
    await lp.screenshot({ path: SHOTS + TAG + "_landscape_" + mode + ".png" });
    ok("0 page errors (landscape " + mode + ")", lp.errs.length === 0, lp.errs.join(" / "));
  }
  // portrait dark final shot
  const pd = await mk(P, "dark");
  await pd.goto(BASE + "epp-studio.html#code=" + Buffer.from('note Dark theme\nout prn "Hello, V!"\nn is nsq&4\nnow fea 1&n\n  out prn n\n').toString("base64url"), { waitUntil: "load" });
  await pd.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 10000 });
  await pd.click("#esRun"); await pd.waitForTimeout(500);
  await pd.screenshot({ path: SHOTS + TAG + "_portrait_dark.png" });
  // engine failure state
  const pf = await mk(P, "dark");
  await pf.route("**/engine/epp_engine.js", r => r.fulfill({ status: 404, body: "" }));
  await pf.goto(BASE + "epp-studio.html", { waitUntil: "load" });
  await pf.waitForFunction(() => document.getElementById("esStatus").textContent !== "Loading engine…", null, { timeout: 10000 });
  ok("engine failure shows an error state", /failed/i.test(await pf.textContent("#esStatus")) && /could not start/.test(await pf.innerText("#esConsole")) && await pf.isDisabled("#esRun"));
  await pf.screenshot({ path: SHOTS + TAG + "_12_engine_failed.png" });
  // index.html: loads, card visible, no CodeMirror/engine loaded
  const pi = await mk(P, "dark");
  const reqs = [];
  pi.on("request", r => reqs.push(r.url()));
  await pi.addInitScript(() => { try { localStorage.setItem("code-block-lang-v1", "englishpp"); localStorage.setItem("code-block-boot-seen-v1", "1"); } catch (e) {} });
  await pi.goto(BASE + "index.html", { waitUntil: "load", timeout: 120000 });
  await pi.waitForTimeout(2500);
  const cardVis = await pi.isVisible("#eppStudioHub");
  ok("index.html: English++ Web Studio card visible", cardVis, await pi.innerText("#eppStudioHub").catch(() => ""));
  await pi.locator("#eppStudioHub").scrollIntoViewIfNeeded().catch(() => {});
  await pi.screenshot({ path: SHOTS + TAG + "_13_index_card.png" });
  ok("index.html: 0 page errors", pi.errs.length === 0, pi.errs.join(" / "));
  ok("index.html loads no CodeMirror/engine", !reqs.some(u => /codemirror-epp|epp_engine|epp-studio/.test(u)));
  const libCard = await pi.evaluate(() => !!document.getElementById("eppStudioLib"));
  ok("library card present", libCard);
  // other track: no card
  const pc = await mk(P, "dark");
  await pc.addInitScript(() => { try { localStorage.removeItem("code-block-lang-v1"); localStorage.setItem("code-block-boot-seen-v1", "1"); } catch (e) {} });
  await pc.goto(BASE + "index.html", { waitUntil: "load", timeout: 120000 }); await pc.waitForTimeout(2000);
  ok("C++ track: no Web Studio card, 0 errors", !(await pc.evaluate(() => !!document.getElementById("eppStudioHub"))) && pc.errs.length === 0, pc.errs.join(" / "));
  await browser.close();
  const pass = results.filter(r => r.pass).length;
  console.log("\n" + TAG + ": " + pass + "/" + results.length + " passed");
  fs.writeFileSync(__dirname + "/shots/results_" + TAG + ".json", JSON.stringify(results, null, 1));
})().catch(e => { console.error("FAILED", e); process.exit(1); });
