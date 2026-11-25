/* English++ Web Studio — the page: editor, files, Run/Stop, console,
   game canvas, Qt-compatible app window, C++ view, examples, share, save.
   English++ is Vewu's language; this page only writes, checks and runs it.
   Storage: only keys that start with "epp-web-studio-" are ever written
   here, so drill, Vault and theme progress elsewhere on the site is safe. */
(function () {
  "use strict";
  var CM = window.EppCM;
  var KEY = "epp-web-studio-";
  var ENGINE_SRC = "engine/epp_engine.js";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v == null) localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, v); return true; } catch (e) { return false; } }
  function load(k) { try { return localStorage.getItem(KEY + k); } catch (e) { return null; } }
  var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  document.documentElement.classList.toggle("es-touch", !!touch);

  var HELLO = 'note Welcome to the English++ Web Studio\nout prn "Hello, V!"\nname is "Vewu"\nout prn "Hi "&name\n';

  /* ---------- toast + status ---------- */
  var toastT = 0;
  function toast(msg) { var t = $("esToast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2200); }
  function status(text, kind) { var s = $("esStatus"); s.textContent = text; s.className = "es-status" + (kind ? " " + kind : ""); }

  /* ---------- files (tabs) ---------- */
  var files = [], active = 0, editor = null, M = null, running = false;
  function fileList() { return files.map(function (f) { return { name: f.name, text: f.state ? f.state.doc.toString() : f.text }; }); }
  function syncActive() { if (editor && files[active]) files[active].state = editor.view.state; }
  function renderTabs() {
    var h = files.map(function (f, i) {
      return '<div class="es-ftab' + (i === active ? " active" : "") + '" role="presentation"><button type="button" role="tab" aria-selected="' + (i === active) + '" data-i="' + i + '">' + esc(f.name) + "</button>" +
        (i > 0 ? '<button type="button" class="es-fx" data-x="' + i + '" aria-label="Close ' + esc(f.name) + '">×</button>' : "") + "</div>";
    }).join("");
    $("esFiles").innerHTML = h + '<button type="button" class="es-fadd" id="esFileAdd" aria-label="Add a file">+ File</button>';
  }
  function openTab(i) {
    syncActive(); active = i;
    var f = files[i];
    if (!f.state) f.state = editor.makeState(f.text || "");
    editor.view.setState(f.state);
    renderTabs(); editor.relint();
  }
  function setFiles(list) {
    files = list.map(function (f) { return { name: f.name, text: f.text, state: null }; });
    if (!files.length || files[0].name !== "main.epp") files.unshift({ name: "main.epp", text: "", state: null });
    active = -1; files.forEach(function (f) { f.state = null; });
    active = 0; files[0].state = editor.makeState(files[0].text || ""); editor.view.setState(files[0].state);
    renderTabs(); editor.relint(); saveDraft();
  }
  $("esFiles").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "esFileAdd") {
      var n = prompt("Name of the new file (it ends in .epp):", "tools.epp");
      if (!n) return; n = n.trim().replace(/\s+/g, "_"); if (!/\.\w+$/.test(n)) n += ".epp";
      if (files.some(function (f) { return f.name === n; })) { toast("There is already a file called " + n); return; }
      syncActive(); files.push({ name: n, text: "note " + n + "\n", state: null }); openTab(files.length - 1); saveDraft(); editor.focus(); return;
    }
    if (b.dataset.x) {
      var i = +b.dataset.x, name = files[i].name;
      if (!confirm("Close " + name + "? Its text is removed from the Studio.")) return;
      syncActive(); files.splice(i, 1);
      try { if (M) M.fsRemove(name); } catch (er) {}
      if (active === i) active = Math.max(0, i - 1); else if (active > i) active--;
      var f = files[active]; if (!f.state) f.state = editor.makeState(f.text || ""); editor.view.setState(f.state);
      renderTabs(); saveDraft(); editor.relint(); return;
    }
    if (b.dataset.i != null) openTab(+b.dataset.i);
  });

  /* ---------- save / draft / share ---------- */
  var draftT = 0;
  function saveDraft() { clearTimeout(draftT); draftT = setTimeout(function () { syncActive(); store("draft", JSON.stringify({ files: fileList(), active: active })); }, 500); }
  function b64urlEncode(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function shareURL() {
    syncActive();
    var list = fileList(), hash;
    if (list.length === 1) hash = "code=" + b64urlEncode(list[0].text);
    else hash = "files=" + b64urlEncode(JSON.stringify(list));
    return location.href.split("#")[0] + "#" + hash;
  }
  function fromHash() {
    var h = location.hash.slice(1);
    try {
      if (/^code=/.test(h)) return [{ name: "main.epp", text: b64urlDecode(h.slice(5)) }];
      if (/^files=/.test(h)) { var l = JSON.parse(b64urlDecode(h.slice(6))); if (Array.isArray(l)) return l.filter(function (f) { return f && typeof f.name === "string" && typeof f.text === "string"; }); }
    } catch (e) { toast("That share link could not be read."); }
    return null;
  }
  $("esShare").addEventListener("click", function () {
    var url = shareURL();
    history.replaceState(null, "", url);
    var done = function () { toast("Share link copied — anyone who opens it sees this program."); };
    if (navigator.share && touch) { navigator.share({ title: "English++ program", url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { prompt("Copy this link:", url); });
    else prompt("Copy this link:", url);
  });
  $("esSave").addEventListener("click", function () {
    syncActive();
    var ok = store("saved", JSON.stringify({ files: fileList(), at: Date.now() })) && store("draft", JSON.stringify({ files: fileList(), active: active }));
    toast(ok ? "Saved on this device." : "Could not save — this browser blocks storage.");
  });
  window.addEventListener("hashchange", function () { var l = fromHash(); if (l && l.length) { setFiles(l); toast("Loaded the shared program."); } });

  /* ---------- console ---------- */
  var con = $("esConsole"), pendingInput = null;
  function conClear() { con.innerHTML = ""; }
  function conWrite(text, cls) {
    var hint = con.querySelector(".es-con-hint"); if (hint) hint.remove();
    var last = con.lastElementChild;
    if (last && last.classList.contains("es-chunk") && last.dataset.k === (cls || "out") && !last.dataset.closed) last.textContent += text;
    else { var s = document.createElement("span"); s.className = "es-chunk " + (cls || "out"); s.dataset.k = cls || "out"; s.textContent = text; con.appendChild(s); }
    if (con.childNodes.length > 4000) con.removeChild(con.firstChild);
    con.scrollTop = con.scrollHeight;
  }
  function conNote(text, cls) { var d = document.createElement("div"); d.className = "es-con-note " + (cls || ""); d.textContent = text; con.appendChild(d); con.scrollTop = con.scrollHeight; }
  function readLine(promptText) {
    showPane("console");
    return new Promise(function (resolve) {
      var last = con.lastElementChild; if (last) last.dataset.closed = "1";
      var row = document.createElement("div"); row.className = "es-in-row";
      row.innerHTML = '<span class="es-in-p">' + esc(promptText ? promptText + " " : "") + '›</span><input class="es-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Type your answer, then press Enter" /><button type="button" class="es-btn es-sm">Enter</button>';
      con.appendChild(row); con.scrollTop = con.scrollHeight;
      var inp = row.querySelector("input");
      function finish(v) {
        if (!pendingInput) return; pendingInput = null;
        row.innerHTML = '<span class="es-in-p">' + esc(promptText ? promptText + " " : "") + '›</span><span class="es-in-done">' + esc(v == null ? "(stopped)" : v) + "</span>";
        resolve(v);
      }
      pendingInput = finish;
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); finish(inp.value); } });
      row.querySelector("button").addEventListener("click", function () { finish(inp.value); });
      setTimeout(function () { inp.focus(); }, 30);
    });
  }

  /* ---------- output panes ---------- */
  function showPane(name) {
    Array.prototype.forEach.call(document.querySelectorAll(".es-out-tabs [data-pane]"), function (b) { var on = b.dataset.pane === name; b.classList.toggle("active", on); b.setAttribute("aria-selected", on); });
    Array.prototype.forEach.call(document.querySelectorAll(".es-pane"), function (p) { p.classList.toggle("active", p.dataset.pane === name); });
    if (name === "cpp") showCpp();
    if (name === "canvas") fitCanvas();
  }
  document.querySelector(".es-out-tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-pane]"); if (b) showPane(b.dataset.pane); });
  var outSizes = ["", "big"], outSize = 0;
  $("esOutSize").addEventListener("click", function () { outSize = (outSize + 1) % outSizes.length; $("esApp").classList.toggle("out-big", outSizes[outSize] === "big"); fitCanvas(); });

  /* ---------- C++ view ---------- */
  function showCpp() {
    var pre = $("esCpp");
    if (!M) { pre.textContent = "The engine is not ready yet."; return; }
    try { pre.textContent = M.cpp(editor.getText()) || "(no C++ for an empty program)"; }
    catch (e) { pre.textContent = "The C++ view could not be made: " + (e && e.message || e); }
  }
  $("esCppBtn").addEventListener("click", function () { showPane("cpp"); });

  /* ---------- game canvas ---------- */
  var win = { w: 800, h: 450 }, canvas = $("epp-canvas");
  function fitCanvas() {
    var box = $("esCanvasBox"), stage = $("esStage");
    var full = $("esApp").classList.contains("canvas-full");
    var availW = stage.clientWidth - (full ? 0 : 0), availH = stage.clientHeight - stage.querySelector(".es-stage-bar").offsetHeight - ($("esGameKeys").classList.contains("hidden") ? 0 : $("esGameKeys").offsetHeight) - 8;
    if (availW <= 0 || availH <= 0) return;
    var s = Math.min(availW / win.w, availH / win.h);
    box.style.width = Math.floor(win.w * s) + "px"; box.style.height = Math.floor(win.h * s) + "px";
  }
  window.addEventListener("resize", fitCanvas);
  $("esFull").addEventListener("click", function () {
    var app = $("esApp"), on = !app.classList.contains("canvas-full");
    app.classList.toggle("canvas-full", on); this.textContent = on ? "Exit full screen" : "Full screen";
    if (on) showPane("canvas");
    setTimeout(fitCanvas, 30); canvas.focus();
  });

  /* On-screen game keys: real KeyboardEvents on window (raylib's GLFW reads keyCode). */
  var GK = [
    ["ArrowUp", "ArrowUp", 38, "↑", "up"], ["ArrowLeft", "ArrowLeft", 37, "←", "left"], ["ArrowDown", "ArrowDown", 40, "↓", "down"], ["ArrowRight", "ArrowRight", 39, "→", "right"],
    ["w", "KeyW", 87, "W", "w"], ["a", "KeyA", 65, "A", "a"], ["s", "KeyS", 83, "S", "s"], ["d", "KeyD", 68, "D", "d"],
    [" ", "Space", 32, "Space", "space"], ["Enter", "Enter", 13, "Enter", "enter"], ["r", "KeyR", 82, "R", "r"], ["Escape", "Escape", 27, "Esc", "esc"]
  ];
  function sendKey(type, k) {
    var ev = new KeyboardEvent(type, { key: k[0], code: k[1], bubbles: true, cancelable: true });
    try { Object.defineProperty(ev, "keyCode", { get: function () { return k[2]; } }); Object.defineProperty(ev, "which", { get: function () { return k[2]; } }); Object.defineProperty(ev, "charCode", { get: function () { return type === "keypress" ? k[2] : 0; } }); } catch (e) {}
    window.dispatchEvent(ev);
  }
  (function buildGameKeys() {
    var g = $("esGameKeys");
    g.innerHTML = '<div class="es-gk-pad">' + GK.slice(0, 4).map(btn).join("") + '</div><div class="es-gk-pad es-gk-wasd">' + GK.slice(4, 8).map(btn).join("") + '</div><div class="es-gk-row">' + GK.slice(8).map(btn).join("") + "</div>";
    function btn(k, i) { return '<button type="button" class="es-gk es-gk-' + k[4] + '" data-k="' + GK.indexOf(k) + '" aria-label="' + esc(k[3] === " " ? "Space" : k[3]) + ' key">' + esc(k[3]) + "</button>"; }
    var held = {};
    function down(e) { var b = e.target.closest(".es-gk"); if (!b) return; e.preventDefault(); var k = GK[+b.dataset.k]; if (held[b.dataset.k]) return; held[b.dataset.k] = e.pointerId; b.classList.add("down"); sendKey("keydown", k); if (k[0].length === 1) sendKey("keypress", k); try { b.setPointerCapture(e.pointerId); } catch (er) {} }
    function up(e) { var b = e.target.closest(".es-gk"); if (!b || held[b.dataset.k] == null) return; e.preventDefault(); delete held[b.dataset.k]; b.classList.remove("down"); sendKey("keyup", GK[+b.dataset.k]); }
    g.addEventListener("pointerdown", down); g.addEventListener("pointerup", up); g.addEventListener("pointercancel", up); g.addEventListener("lostpointercapture", up);
    g.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  })();
  function setGameKeys(on) { $("esGameKeys").classList.toggle("hidden", !on); $("esKeysBtn").setAttribute("aria-pressed", on); fitCanvas(); }
  $("esKeysBtn").addEventListener("click", function () { setGameKeys($("esGameKeys").classList.contains("hidden")); });

  /* ---------- Qt-compatible layer (HTML widgets, not Qt) ---------- */
  var qt = { win: null, body: null, widgets: {}, queue: [], waiter: null };
  function qtReset() {
    if (qt.waiter) { var w = qt.waiter; qt.waiter = null; w(""); }
    qt.widgets = {}; qt.queue = []; qt.win = null; qt.body = null;
  }
  function qtFire(id) { if (qt.waiter) { var w = qt.waiter; qt.waiter = null; w(id); } else qt.queue.push(id); }
  function qtEnsure() {
    if (qt.win) return;
    qtWindow({ title: "App", width: 480, height: 300 });
  }
  function qtWindow(c) {
    var host = $("esQtHost"); host.innerHTML = "";
    var w = document.createElement("div"); w.className = "es-qt-win";
    w.style.maxWidth = Math.max(240, +c.width || 480) + "px";
    w.innerHTML = '<div class="es-qt-titlebar"><span class="es-qt-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="es-qt-title"></span><button type="button" class="es-qt-close" aria-label="Close the app">×</button></div><div class="es-qt-body"></div>';
    w.querySelector(".es-qt-title").textContent = c.title || "App";
    w.querySelector(".es-qt-body").style.minHeight = Math.min(600, Math.max(120, (+c.height || 300) - 40)) + "px";
    w.querySelector(".es-qt-close").addEventListener("click", function () { qtFire(""); w.classList.add("closed"); });
    host.appendChild(w); qt.win = w; qt.body = w.querySelector(".es-qt-body");
  }
  function qtAdd(id, el) { qtEnsure(); var row = document.createElement("div"); row.className = "es-qt-row"; row.appendChild(el); qt.body.appendChild(row); qt.widgets[id] = el; return el; }
  function eppQt(c) {
    c = c || {};
    switch (c.op) {
      case "window": qtWindow(c); return true;
      case "label": { var l = document.createElement("div"); l.className = "es-qt-labelw"; l.textContent = c.text == null ? "" : c.text; qtAdd(c.id, l); return true; }
      case "button": { var b = document.createElement("button"); b.type = "button"; b.className = "es-qt-button"; b.textContent = c.text || c.id; b.addEventListener("click", function () { qtFire(c.id); }); qtAdd(c.id, b); return true; }
      case "textbox": { var t = document.createElement("input"); t.type = "text"; t.className = "es-qt-text"; t.setAttribute("aria-label", c.id); t.autocapitalize = "off"; t.addEventListener("change", function () { qtFire(c.id); }); qtAdd(c.id, t); return true; }
      case "slider": { var s = document.createElement("input"); s.type = "range"; s.className = "es-qt-slider"; s.min = c.min == null ? 0 : c.min; s.max = c.max == null ? 100 : c.max; s.value = s.min; s.setAttribute("aria-label", c.id); var wrap = document.createElement("label"); wrap.className = "es-qt-sl"; var v = document.createElement("span"); v.textContent = s.value; s.addEventListener("input", function () { v.textContent = s.value; }); s.addEventListener("change", function () { qtFire(c.id); }); wrap.appendChild(s); wrap.appendChild(v); qtAdd(c.id, wrap); qt.widgets[c.id] = s; return true; }
      case "checkbox": { var lb = document.createElement("label"); lb.className = "es-qt-check"; var cb = document.createElement("input"); cb.type = "checkbox"; cb.addEventListener("change", function () { qtFire(c.id); }); lb.appendChild(cb); lb.appendChild(document.createTextNode(" " + (c.text || c.id))); qtAdd(c.id, lb); qt.widgets[c.id] = cb; return true; }
      case "setLabel": { var w = qt.widgets[c.id]; if (w) { if (w.tagName === "BUTTON" || w.classList.contains("es-qt-labelw")) w.textContent = c.text == null ? "" : c.text; else if (w.tagName === "INPUT" && w.type === "text") w.value = c.text; } return !!w; }
      case "message": { qtEnsure(); var m = document.createElement("div"); m.className = "es-qt-msg"; m.setAttribute("role", "alertdialog"); m.innerHTML = '<div class="es-qt-msg-card"><p></p><button type="button" class="es-qt-button">OK</button></div>'; m.querySelector("p").textContent = c.text || ""; m.querySelector("button").addEventListener("click", function () { m.remove(); }); qt.win.appendChild(m); return true; }
      case "getText": { var x = qt.widgets[c.id]; return x && x.tagName === "INPUT" ? x.value : x ? x.textContent : ""; }
      case "getSlider": { var y = qt.widgets[c.id]; return y ? +y.value : 0; }
      case "getTicked": { var z = qt.widgets[c.id]; return !!(z && z.checked); }
      case "show": qtEnsure(); $("esTabQt").classList.remove("hidden"); showPane("qt"); return true;
      case "close": if (qt.win) qt.win.classList.add("closed"); if (qt.waiter) { var ww = qt.waiter; qt.waiter = null; ww(""); } return true;
    }
    return null;
  }
  function eppQtNextEvent() {
    return new Promise(function (resolve) {
      if (qt.queue.length) resolve(qt.queue.shift());
      else qt.waiter = resolve;
    });
  }

  /* ---------- engine events ---------- */
  function eppEvent(ev) {
    if (!ev) return;
    if (ev.type === "library" && ev.name === "raylib") { $("esApp").classList.add("has-canvas", "game-on"); if (window.innerHeight > window.innerWidth && outSizes[outSize] !== "big") $("esOutSize").click(); showPane("canvas"); if (touch) setGameKeys(true); }
    else if (ev.type === "library" && ev.name === "qt") { $("esTabQt").classList.remove("hidden"); showPane("qt"); }
    else if (ev.type === "window") { win.w = +ev.width || 800; win.h = +ev.height || 450; $("esWinTitle").textContent = (ev.title || "Game") + " · " + win.w + "×" + win.h; showPane("canvas"); fitCanvas(); try { canvas.focus({ preventScroll: true }); } catch (e) {} }
    else if (ev.type === "line") { lineNow = ev.line; if (!lineRAF) lineRAF = requestAnimationFrame(function () { lineRAF = 0; if (running) editor.setRunLine(lineNow); }); }
  }
  var lineNow = 0, lineRAF = 0;

  /* ---------- Run / Stop ---------- */
  function setRunning(on) {
    running = on; $("esRun").disabled = on || !M; $("esStop").disabled = !on;
    $("esApp").classList.toggle("is-running", on);
    status(on ? "Running…" : M ? "Ready" : status_err ? "Engine failed" : "Loading engine…", on ? "run" : M ? "ok" : status_err ? "bad" : "");
  }
  var status_err = false;
  async function run() {
    if (!M || running) return;
    syncActive();
    var list = fileList(), main = list[0].text;
    try { (M.fsList() || []).forEach(function (p) { if (/\.epp$/.test(p) && !list.some(function (f) { return f.name === p; })) M.fsRemove(p); }); } catch (e) {}
    list.forEach(function (f) { try { M.fsWrite(f.name, f.text); } catch (e) {} });
    conClear(); qtReset(); $("esQtHost").innerHTML = '<p class="es-dim">A program with <code>now xlb qt</code> opens its app window here.</p>';
    $("esApp").classList.remove("has-canvas");
    if (!/^\s*now\s+xlb\s+(raylib|qt)\b/mi.test(main)) showPane("console");
    setRunning(true);
    var t0 = performance.now(), r;
    try { r = await M.run(main); }
    catch (e) { r = { exitCode: 1, error: { line: 0, message: "The engine stopped: " + (e && e.message || e) } }; conWrite(r.error.message + "\n", "err"); }
    if (pendingInput) pendingInput(null);
    editor.setRunLine(0);
    $("esApp").classList.remove("game-on");
    setRunning(false);
    var ms = Math.round(performance.now() - t0);
    if (r && r.error) {
      conNote("Stopped at line " + (r.error.line || "?") + ": " + r.error.message, "bad");
      if (r.error.line && active === 0) editor.showRuntimeError(r.error);
      else if (r.error.line) { openTab(0); editor.showRuntimeError(r.error); }
    } else conNote("Finished" + (r && r.exitCode ? " with exit code " + r.exitCode : "") + " · " + ms + " ms", r && r.exitCode ? "bad" : "ok");
    if (qt.win) qt.win.classList.add("closed");
  }
  function stop() {
    if (fbBusy && FB) { try { FB.stop(); } catch (e) {} }
    if (!M) return;
    try { M.stop(); } catch (e) {}
    if (pendingInput) pendingInput(null);
    if (qt.waiter) { var w = qt.waiter; qt.waiter = null; w(""); }
    sendKey("keydown", GK[11]); setTimeout(function () { sendKey("keyup", GK[11]); }, 60);
  }
  /* ---------- Full build: English++ -> C++ View -> real Clang (wasm, in a Worker) -> run ----------
     Nothing of it loads until this button is tapped; the fast runner above never waits on it. */
  var FB = null, fbBusy = false;
  function fbLoad() {
    if (FB) return Promise.resolve(FB);
    return import(new URL("fullbuild/fullbuild.js", document.baseURI).href).then(function (m) { FB = m.EppFullBuild || window.EppFullBuild; return FB; });
  }
  function mb(n) { return (n / 1048576).toFixed(1) + " MB"; }
  async function fullBuild() {
    if (!M || running || fbBusy) return;
    syncActive();
    var list = fileList(), main = list[0].text;
    showPane("console");
    if (/^\s*now\s+xlb\s+(raylib|qt)\b/mi.test(main)) { conClear(); conNote("Full build is for console programs. raylib and Qt programs use Run (the browser compiler has no canvas or windows).", "bad"); return; }
    if (/^\s*\S+\s+xim\s/m.test(main)) { conClear(); conNote("Full build is for one-file programs for now. This program brings in another file (xim), so use Run.", "bad"); return; }
    var cpp = M.cpp(main) || "";
    if (/^\/\/ (line \d+:|The C\+\+ View (is|stopped|is made)|C\+\+ View:)/.test(cpp)) { conClear(); conNote("Full build needs a complete C++ View. " + cpp.split("\n").slice(0, 2).join(" ").replace(/\/\/ /g, ""), "bad"); return; }
    if (!load("fullbuild-ok") && !confirm("Full build downloads the real Clang compiler once (about 37 MB) and keeps it on this device. While it builds it needs a lot of memory. Go ahead?")) return;
    store("fullbuild-ok", "1");
    fbBusy = true; $("esFullBuild").disabled = true; $("esRun").disabled = true;
    conClear(); conNote("Full build: English++ → C++ → Clang → WebAssembly", "");
    var stdin = "";
    if (/(^|\s)get(\s|$)/m.test(main)) {
      var ans = await readLine("This program reads input. Full build needs all of it first — type the answers separated by | ");
      stdin = ans == null ? "" : ans.split("|").map(function (x) { return x.trim(); }).join("\n") + "\n";
    }
    var t0 = performance.now(), lastPct = -1;
    try {
      var fb = await fbLoad();
      var f = fb.features();
      if (!f.ok) { conNote("This browser can't do Full build: missing " + f.missing.join(", ") + ". Run still works.", "bad"); return; }
      status("Building…", "run");
      var r = await fb.build(cpp, { onProgress: function (ph, a, b) {
        if (ph === "download" && b) { var pc = Math.floor(a * 100 / b); if (pc !== lastPct && pc % 10 === 0) { lastPct = pc; status("Clang " + pc + "%", "run"); } }
        else if (ph === "compile") status("Compiling…", "run");
      } });
      if (!r.ok) {
        conNote("Clang refused the C++ (" + Math.round(r.totalMs || 0) + " ms):", "bad");
        (r.errors || []).slice(0, 12).forEach(function (e) { conWrite((e.line ? "C++ line " + e.line + (e.column ? ":" + e.column : "") + "  " : "") + e.message + "\n", "err"); });
        return;
      }
      conNote("Built by Clang in " + (r.totalMs / 1000).toFixed(1) + " s · " + Math.round(r.wasm.byteLength / 1024) + " KB of wasm. Running:", "ok");
      status("Running…", "run"); $("esStop").disabled = false; running = true;
      var code = await fb.run(r.wasm, { stdin: stdin, print: function (t) { conWrite(String(t), "out"); }, printErr: function (t) { conWrite(String(t), "err"); }, timeoutMs: 30000 });
      conNote("Full build finished" + (code ? " with exit code " + code : "") + " · " + Math.round(performance.now() - t0) + " ms total", code ? "bad" : "ok");
    } catch (e) {
      conNote("Full build stopped: " + (e && e.message || e) + ". Run still works.", "bad");
    } finally {
      try { if (FB) FB.release(); } catch (e) {}
      fbBusy = false; running = false; $("esFullBuild").disabled = false; setRunning(false);
    }
  }
  $("esFullBuild").addEventListener("click", fullBuild);
  $("esRun").addEventListener("click", run);
  $("esStop").addEventListener("click", stop);

  /* ---------- New ---------- */
  $("esNew").addEventListener("click", function () {
    if (editor.getText().trim() && !confirm("Start a new program? (Save first if you want to keep this one.)")) return;
    setFiles([{ name: "main.epp", text: "note My program\nout prn \"Hello!\"\n" }]);
    history.replaceState(null, "", location.href.split("#")[0]);
    editor.focus();
  });

  /* ---------- examples ---------- */
  var EX = null;
  /* Lazy list: a group's buttons are built only when it is opened (or
     when a search matches), so the DOM stays small; the program text
     lives once, in EX. */
  function exItems(g, q) {
    var out = [];
    for (var i = 0; i < g.items.length; i++) { var it = g.items[i]; if (!q || it.lc.indexOf(q) >= 0 || g.lc.indexOf(q) >= 0) out.push(i); }
    return out;
  }
  function exButtons(gi, idx) {
    var g = EX.groups[gi];
    return idx.map(function (ii) { var it = g.items[ii]; return '<button type="button" class="es-ex" data-g="' + gi + '" data-i="' + ii + '"><code>' + esc(it.title || it.id) + "</code><span>" + it.lines + (it.lines === 1 ? " line" : " lines") + "</span></button>"; }).join("");
  }
  var exQuery = "";
  function renderExamples(q) {
    var list = $("esExList"); if (!EX) { list.innerHTML = '<p class="es-dim">Loading…</p>'; return; }
    exQuery = q = (q || "").toLowerCase().trim();
    var h = "", shown = 0;
    EX.groups.forEach(function (g, gi) {
      var idx = exItems(g, q);
      if (!idx.length) return;
      var open = q ? shown < 6 : gi < 1;
      h += '<details class="es-exg" data-g="' + gi + '"' + (open ? " open" : "") + "><summary>" + esc(g.name) + ' <span class="es-dim">' + idx.length + '</span></summary><div class="es-exg-body">' + (open ? exButtons(gi, idx) : "") + "</div></details>";
      shown++;
    });
    list.innerHTML = h || '<p class="es-dim">No example matches.</p>';
  }
  $("esExList").addEventListener("toggle", function (e) {
    var d = e.target; if (!d.classList || !d.classList.contains("es-exg")) return;
    var body = d.querySelector(".es-exg-body"), gi = +d.dataset.g;
    if (d.open && !body.firstChild) body.innerHTML = exButtons(gi, exItems(EX.groups[gi], exQuery));
    else if (!d.open) body.innerHTML = "";
  }, true);
  function openExamples() {
    $("esExSheet").classList.remove("hidden"); renderExamples($("esExSearch").value);
    if (!EX) fetch("data/epp-studio/examples.json").then(function (r) { return r.json(); }).then(function (j) { j.groups.forEach(function (g) { g.lc = g.name.toLowerCase(); g.items.forEach(function (it) { it.lc = (it.title + "\n" + it.code).toLowerCase(); it.lines = it.code.split("\n").length; }); }); EX = j; renderExamples($("esExSearch").value); }).catch(function () { $("esExList").innerHTML = '<p class="es-dim">The examples could not load.</p>'; });
  }
  $("esExamples").addEventListener("click", openExamples);
  $("esExClose").addEventListener("click", function () { $("esExSheet").classList.add("hidden"); });
  $("esExSheet").addEventListener("click", function (e) { if (e.target === this) this.classList.add("hidden"); });
  $("esExSearch").addEventListener("input", function () { renderExamples(this.value); });
  $("esExList").addEventListener("click", function (e) {
    var b = e.target.closest(".es-ex"); if (!b) return;
    var it = EX.groups[+b.dataset.g].items[+b.dataset.i];
    syncActive();
    var code = it.code.replace(/\s+$/, "") + "\n";
    if (files.length === 1 || active === 0) { files[0].state = editor.makeState(code); if (active === 0) editor.view.setState(files[0].state); else openTab(0); }
    else { openTab(0); files[0].state = editor.makeState(code); editor.view.setState(files[0].state); }
    renderTabs(); editor.relint(); saveDraft();
    $("esExSheet").classList.add("hidden");
    history.replaceState(null, "", location.href.split("#")[0]);
    toast("Loaded: " + EX.groups[+b.dataset.g].name + (it.output ? " — press Run" : ""));
    if (it.output) { conClear(); conNote("The Book says this prints:", "dim"); conWrite(it.output + "\n", "book"); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("esExSheet").classList.contains("hidden")) $("esExSheet").classList.add("hidden"); });

  /* ---------- accessory key row ---------- */
  var ACC = [["&", "&"], ["@", "@"], ['"', '""'], ["*", "*"], ["+", "+"], ["-", "-"], ["=", "="], ["Tab", "\tTAB"], ["⇤", "\tOUT"], ["now", "now "], ["note", "note "], ["is", "is "], ["prn", "prn "], ["mak", "mak "], ["igt", "igt "], ["fea", "fea "], ["oth", "oth "], ["dfn", "dfn "], ["▾", "\tDONE"]];
  $("esAcc").innerHTML = ACC.map(function (a, i) { return '<button type="button" class="es-acc-k' + (a[1].length > 3 && a[1][0] !== "\t" ? " word" : "") + '" data-a="' + i + '" aria-label="' + esc(a[0] === "⇤" ? "Shift-Tab, outdent" : a[0] === "▾" ? "Hide the keyboard" : a[0] === "Tab" ? "Tab, indent" : "Type " + a[0]) + '">' + esc(a[0]) + "</button>"; }).join("");
  $("esAcc").addEventListener("pointerdown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
  $("esAcc").addEventListener("mousedown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
  $("esAcc").addEventListener("click", function (e) {
    var b = e.target.closest(".es-acc-k"); if (!b) return;
    var v = ACC[+b.dataset.a][1];
    if (v === "\tTAB") editor.indent();
    else if (v === "\tOUT") editor.outdent();
    else if (v === "\tDONE") { editor.view.contentDOM.blur(); }
    else if (v === '""') { editor.insert('""'); var p = editor.view.state.selection.main.head; editor.view.dispatch({ selection: { anchor: p - 1 } }); }
    else editor.insert(v);
  });

  /* ---------- word card (tap a root) ---------- */
  function onCursor(c) {
    var box = $("esCard");
    if (!c) { box.classList.remove("show"); return; }
    box.innerHTML = CM.cardHTML(c); box.classList.add("show");
  }

  /* ---------- keyboard-aware layout (visualViewport) ---------- */
  var app = $("esApp");
  function layout() {
    var vv = window.visualViewport;
    var h = vv ? vv.height : window.innerHeight, top = vv ? vv.offsetTop : 0;
    app.style.height = h + "px"; app.style.transform = top ? "translateY(" + top + "px)" : "";
    var kb = !!vv && window.innerHeight - h > 140 && document.activeElement && (editor && editor.view.hasFocus);
    app.classList.toggle("kb-up", !!kb);
    fitCanvas();
  }
  if (window.visualViewport) { visualViewport.addEventListener("resize", layout); visualViewport.addEventListener("scroll", layout); }
  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", function () { setTimeout(layout, 300); });

  /* ---------- light / dark ---------- */
  $("esMode").addEventListener("click", function () {
    var root = document.documentElement, dark = root.getAttribute("data-mode") !== "dark";
    root.setAttribute("data-mode", dark ? "dark" : "light"); root.setAttribute("data-theme", dark ? "night" : "daylight");
    store("mode", dark ? "dark" : "light");
  });

  /* ---------- engine ---------- */
  // Decode base64 text bytes (ignores whitespace) into a Uint8Array.
  function b64ToBytes(txt) {
    var T = b64ToBytes.t;
    if (!T) { T = b64ToBytes.t = new Int16Array(256).fill(-1); var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; for (var i = 0; i < 64; i++) T[A.charCodeAt(i)] = i; }
    var out = new Uint8Array(Math.floor(txt.length * 3 / 4) + 3), o = 0, acc = 0, bits = 0;
    for (var j = 0; j < txt.length; j++) {
      var v = T[txt[j]];
      if (v < 0) { if (txt[j] === 61) break; continue; } // '=' ends, whitespace skipped
      acc = ((acc << 6) | v) & 0xffffff; bits += 6;
      if (bits >= 8) { bits -= 8; out[o++] = (acc >> bits) & 255; }
    }
    return out.subarray(0, o);
  }
  window.eppB64ToBytes = b64ToBytes;
  function loadEngineWasm() {
    return fetch("engine/epp_engine.wasm.gz.b64").then(function (r) {
      if (!r.ok) throw new Error("engine/epp_engine.wasm.gz.b64 could not be loaded (" + r.status + ")");
      return r.arrayBuffer();
    }).then(function (buf) {
      var gz = b64ToBytes(new Uint8Array(buf));
      if (gz.length < 2 || gz[0] !== 0x1f || gz[1] !== 0x8b) throw new Error("the engine file did not decode (bad base64)");
      if (typeof DecompressionStream !== "function") throw new Error("this browser has no DecompressionStream; update it to run programs");
      return new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    }).then(function (wasm) {
      var b = new Uint8Array(wasm, 0, 4);
      if (b[0] !== 0 || b[1] !== 0x61 || b[2] !== 0x73 || b[3] !== 0x6d) throw new Error("the engine file decoded but is not WebAssembly");
      return wasm;
    });
  }
  var engineFail = function () {};
  function loadEngine() {
    status("Loading engine…");
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script"); s.src = ENGINE_SRC; s.async = true;
      s.onload = function () { if (typeof window.createEppEngine !== "function") reject(new Error("engine/epp_engine.js has no createEppEngine")); else resolve(); };
      s.onerror = function () { reject(new Error("engine/epp_engine.js could not be loaded")); };
      document.head.appendChild(s);
    }).then(function () {
      return new Promise(function (resolveEng, rejectEng) {
      engineFail = rejectEng;
      window.createEppEngine({
        canvas: canvas,
        print: function (t) { conWrite(String(t), "out"); },
        printErr: function (t) { conWrite(String(t), "err"); },
        eppEvent: eppEvent,
        eppReadLine: readLine,
        eppQt: eppQt,
        eppQtNextEvent: eppQtNextEvent,
        locateFile: function (p) { return "engine/" + p; },
        // The engine is stored as gzip + base64 text (engine/epp_engine.wasm.gz.b64) so it can live in a text-only repo.
        instantiateWasm: function (imports, receive) {
          loadEngineWasm().then(function (bytes) { return WebAssembly.instantiate(bytes, imports); })
            .then(function (r) { receive(r.instance); })
            .catch(function (e) { engineFail(e); });
          return {};
        }
      }).then(resolveEng, rejectEng);
      });
    }).then(function (mod) {
      M = mod; setRunning(false); status("Ready", "ok");
      $("esStatus").title = "Engine " + (M.version || "");
      editor.relint();
    }).catch(function (e) {
      status_err = true; status("Engine failed", "bad");
      conClear(); conNote("The English++ engine could not start: " + (e && e.message || e) + ". You can still write and save; the three-word check still works. Reload to try again.", "bad");
    });
  }

  /* ---------- start ---------- */
  function start(data) {
    CM.setData(data);
    editor = CM.createEditor({
      parent: $("esEditor"), doc: "",
      check: function (src) { if (!M) return null; try { return M.check(src); } catch (e) { return null; } },
      onChange: function () { saveDraft(); if (running) return; },
      onCursor: onCursor,
      onRun: run
    });
    editor.view.contentDOM.addEventListener("focus", function () { setTimeout(layout, 50); });
    editor.view.contentDOM.addEventListener("blur", function () { setTimeout(layout, 50); });
    var list = fromHash(), from = "hash";
    if (!list) { from = "draft"; try { var d = JSON.parse(load("draft") || "null"); if (d && Array.isArray(d.files) && d.files.length) list = d.files; } catch (e) {} }
    if (!list || !list.length) { from = "hello"; list = [{ name: "main.epp", text: HELLO }]; }
    setFiles(list);
    if (from === "hash") toast("Loaded the shared program.");
    layout();
    loadEngine();
    window.EppStudio = { editor: editor, files: function () { syncActive(); return fileList(); }, shareURL: shareURL, run: run, stop: stop, engine: function () { return M; }, showPane: showPane };
  }
  Promise.all(["roots", "raylib", "qt"].map(function (n) { return fetch("data/epp-studio/" + n + ".json").then(function (r) { if (!r.ok) throw new Error(n + ".json " + r.status); return r.json(); }); }))
    .then(function (a) { start({ families: a[0].families, words: a[0].words, kinds: a[0].kinds, special: a[0].special, raylib: a[1], qt: a[2] }); })
    .catch(function (e) { status("Data failed", "bad"); $("esEditor").innerHTML = '<p class="es-dim" style="padding:16px">The Studio could not load its word lists (' + esc(e.message) + "). Reload to try again.</p>"; });
})();
