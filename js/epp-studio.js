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
  /* touch row: on for a phone (coarse pointer); on a laptop or Chromebook it shows when you touch the
     screen and hides again when you type on a physical keyboard (a touchscreen Chromebook keeps both). */
  var coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  var touch = coarse || (!(window.matchMedia && window.matchMedia("(pointer: fine)").matches) && "ontouchstart" in window);
  var lastTouch = 0;
  function setTouch(on) { touch = !!on; document.documentElement.classList.toggle("es-touch", touch); document.documentElement.classList.toggle("es-keys", !touch); }
  setTouch(touch);
  window.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") { lastTouch = Date.now(); if (!touch) { setTouch(true); setTimeout(layout, 0); } } }, true);
  window.addEventListener("keydown", function (e) {
    if (coarse || !touch) return;
    if (Date.now() - lastTouch < 1500) return; // an on-screen keyboard right after a tap
    if (e.key && e.key.length === 1 || /^(Enter|Backspace|Tab|Arrow)/.test(e.key)) { setTouch(false); setTimeout(layout, 0); }
  }, true);

  var HELLO = 'note Welcome to the English++ Web Studio\nout prn "Hello, V!"\nname is "Vewu"\nout prn "Hi "&name\n';

  /* ---------- toast + status ---------- */
  var toastT = 0;
  function toast(msg) { var t = $("esToast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2200); }
  function status(text, kind) { var s = $("esStatus"); s.textContent = text; s.className = "es-status" + (kind ? " " + kind : ""); }

  /* ---------- files (tabs) ---------- */
  var files = [], active = 0, editor = null, M = null, running = false;
  function fileList() { return files.map(function (f) { return { name: f.name, text: f.state ? f.state.doc.toString() : f.text }; }); }
  function syncActive() { if (editor && files[active]) files[active].state = editor.view.state; }
  function mkState(f) { return window.EppCppMode && EppCppMode.isCppName(f.name) && editor.makeCppState ? editor.makeCppState(f.text || "") : editor.makeState(f.text || ""); }
  function cppTab() { if (window.EppCppMode) EppCppMode.onTab(); }
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
    if (!f.state) f.state = mkState(f);
    editor.view.setState(f.state);
    renderTabs(); editor.relint(); cppTab();
  }
  function setFiles(list) {
    files = list.map(function (f) { return { name: f.name, text: f.text, state: null }; });
    if (!files.length || files[0].name !== "main.epp") files.unshift({ name: "main.epp", text: "", state: null });
    active = -1; files.forEach(function (f) { f.state = null; });
    active = 0; files[0].state = mkState(files[0]); editor.view.setState(files[0].state);
    renderTabs(); editor.relint(); saveDraft(); cppTab();
  }
  $("esFiles").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "esFileAdd") {
      var n = prompt("Name of the new file (it ends in .epp — or .cpp / .h for C++):", "tools.epp");
      if (!n) return; n = n.trim().replace(/\s+/g, "_"); if (!/\.\w+$/.test(n)) n += ".epp";
      if (files.some(function (f) { return f.name === n; })) { toast("There is already a file called " + n); return; }
      var cppNew = window.EppCppMode && EppCppMode.isCppName(n);
      var hasMainCpp = files.some(function (f) { return /\.(cpp|cc|cxx)$/i.test(f.name) && /\bint\s+main\s*\(/.test(f.state ? f.state.doc.toString() : f.text || ""); });
      var newText = !cppNew ? "note " + n + "\n" : /\.(h|hpp|hh|hxx)$/i.test(n) ? "// " + n + "\n#pragma once\n\n" : hasMainCpp ? "// " + n + "\n#include <iostream>\n\n" : "#include <iostream>\n\nint main() {\n    std::cout << \"Hello!\" << std::endl;\n    return 0;\n}\n";
      syncActive(); files.push({ name: n, text: newText, state: null }); openTab(files.length - 1); saveDraft(); editor.focus(); return;
    }
    if (b.dataset.x) {
      var i = +b.dataset.x, name = files[i].name;
      if (!confirm("Close " + name + "? Its text is removed from the Studio.")) return;
      syncActive(); files.splice(i, 1);
      try { if (M) M.fsRemove(name); } catch (er) {}
      if (active === i) active = Math.max(0, i - 1); else if (active > i) active--;
      var f = files[active]; if (!f.state) f.state = mkState(f); editor.view.setState(f.state);
      renderTabs(); saveDraft(); editor.relint(); cppTab(); return;
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
    /* iPhone: stop the touch itself so Safari/Chrome-iOS never flash, focus, scroll or zoom on a game key */
    g.addEventListener("touchstart", function (e) { if (e.target.closest(".es-gk")) e.preventDefault(); }, { passive: false });
    g.addEventListener("touchend", function (e) { if (e.target.closest(".es-gk")) e.preventDefault(); }, { passive: false });
    /* iPhone double tap: never start a text selection, word highlight or zoom anywhere in the game area */
    (function () {
      var st = $("esStage");
      function noSel() { try { var sel = window.getSelection(); if (sel && sel.rangeCount && !(editor && editor.view.hasFocus)) sel.removeAllRanges(); } catch (er) {} }
      st.addEventListener("selectstart", function (e) { e.preventDefault(); });
      st.addEventListener("dblclick", function (e) { e.preventDefault(); noSel(); });
      st.addEventListener("touchstart", function (e) { if (e.touches.length === 1 && !e.target.closest("button, input, select, textarea, a, canvas")) e.preventDefault(); }, { passive: false });
      st.addEventListener("touchend", function (e) { if (!e.target.closest("button, input, select, textarea, a, canvas")) e.preventDefault(); noSel(); }, { passive: false });
      g.addEventListener("pointerdown", noSel, true);
    })();
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
    running = on; $("esRun").disabled = on || (!M && !(window.EppCppMode && EppCppMode.isActive())); $("esStop").disabled = !on;
    $("esApp").classList.toggle("is-running", on);
    status(on ? "Running…" : M ? "Ready" : status_err ? "Engine failed" : "Loading engine…", on ? "run" : M ? "ok" : status_err ? "bad" : "");
  }
  var status_err = false;
  async function run() {
    if (window.EppCppMode && EppCppMode.handlesRun()) return EppCppMode.run();
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
    try { r = await (window.EppDebug && EppDebug.active() ? EppDebug.go(M, main) : M.run(main)); }
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
      if (r.error.line && window.EppFixIt && !r.error.file) try { EppFixIt.offerRun(r.error); } catch (e) {}
    } else conNote("Finished" + (r && r.exitCode ? " with exit code " + r.exitCode : "") + " · " + ms + " ms", r && r.exitCode ? "bad" : "ok");
    if (qt.win) qt.win.classList.add("closed");
  }
  function stop() {
    if (window.EppCppMode && EppCppMode.stop()) return;
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
    if (window.EppCppMode && EppCppMode.fullBuildEpp) { var fbv4 = EppCppMode.fullBuildEpp(); if (fbv4) return fbv4; }
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
    if (window.EppCppMode && EppCppMode.newProgram()) return;
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
      var cppOn = !!(window.EppCppMode && EppCppMode.isActive());
      var open = q ? shown < 6 : g.cpp ? cppOn : (gi < 1 && !cppOn);
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
    if (!EX) Promise.all([fetch("data/epp-studio/examples.json").then(function (r) { return r.json(); }), window.EppCppMode ? EppCppMode.examples() : null]).then(function (a) { var j = a[0]; if (a[1] && a[1].items) { a[1].items.forEach(function (it) { it.cpp = true; }); j.groups.push({ name: a[1].name || "C++", items: a[1].items, cpp: true }); } return j; }).then(function (j) { j.groups.forEach(function (g) { g.lc = g.name.toLowerCase(); g.items.forEach(function (it) { it.lc = (it.title + "\n" + it.code).toLowerCase(); it.lines = it.code.split("\n").length; }); }); EX = j; renderExamples($("esExSearch").value); }).catch(function () { $("esExList").innerHTML = '<p class="es-dim">The examples could not load.</p>'; });
  }
  $("esExamples").addEventListener("click", openExamples);
  $("esExClose").addEventListener("click", function () { $("esExSheet").classList.add("hidden"); });
  $("esExSheet").addEventListener("click", function (e) { if (e.target === this) this.classList.add("hidden"); });
  $("esExSearch").addEventListener("input", function () { renderExamples(this.value); });
  $("esExList").addEventListener("click", function (e) {
    var b = e.target.closest(".es-ex"); if (!b) return;
    var it = EX.groups[+b.dataset.g].items[+b.dataset.i];
    if (it.cpp) { $("esExSheet").classList.add("hidden"); history.replaceState(null, "", location.href.split("#")[0]); EppCppMode.loadExample(it); return; }
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
  var ACC = [["&", "&"], ["@", "@"], ['"', '""'], ["*", "*"], ["+", "+"], ["-", "-"], ["=", "="], ["Tab", "\tTAB"], ["⇤", "\tOUT"],
    ["Blocks", "\tBLOCKS"], ["↶", "\tUNDO"], ["↷", "\tREDO"],
    ["now", "now "], ["note", "note "], ["is", "is "], ["prn", "prn "], ["mak", "mak "], ["igt", "igt "], ["fea", "fea "], ["oth", "oth "], ["dfn", "dfn "],
    ["Find", "\tFIND"], ["Roots", "\tROOTS"], ["▾", "\tDONE"]];
  var ACC_LABEL = { "⇤": "Shift-Tab, outdent", "▾": "Hide the keyboard", "Tab": "Tab, indent or next blank", "↶": "Undo", "↷": "Redo", "Blocks": "Blocks: drop in a shape", "Find": "Find and replace", "Roots": "Root Table" };
  $("esAcc").innerHTML = ACC.map(function (a, i) { var cmd = a[1][0] === "\t"; return '<button type="button" class="es-acc-k' + (a[1].length > 3 && !cmd ? " word" : "") + (cmd && a[0].length > 2 ? " cmd" : "") + '" data-a="' + i + '" aria-label="' + esc(ACC_LABEL[a[0]] || "Type " + a[0]) + '">' + esc(a[0]) + "</button>"; }).join("");
  $("esAcc").addEventListener("pointerdown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
  $("esAcc").addEventListener("mousedown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
  $("esAcc").addEventListener("click", function (e) {
    var b = e.target.closest(".es-acc-k"); if (!b) return;
    var v = ACC[+b.dataset.a][1];
    if (v === "\tTAB") editor.indent();
    else if (v === "\tOUT") editor.outdent();
    else if (v === "\tDONE") { editor.view.contentDOM.blur(); }
    else if (v === "\tUNDO") editor.undo();
    else if (v === "\tREDO") editor.redo();
    else if (v === "\tBLOCKS") openBlocks();
    else if (v === "\tFIND") editor.find();
    else if (v === "\tROOTS") openRootTable();
    else if (v === '""') { editor.insert('""'); var p = editor.view.state.selection.main.head; editor.view.dispatch({ selection: { anchor: p - 1 } }); }
    else editor.insert(v);
  });

  /* ---------- word card (tap a word) ---------- */
  function onCursor(c) {
    var box = $("esCard");
    if (!c) { box.classList.remove("show"); return; }
    box.innerHTML = CM.cardHTML(c); box.classList.add("show");
  }
  $("esCard").addEventListener("mousedown", function (e) { if (e.target.closest("[data-act]")) e.preventDefault(); });
  $("esCard").addEventListener("click", function (e) { if (editor) editor.cardClick(e); });

  /* ---------- sheets (Blocks, Root Table, Outline) ---------- */
  function sheetOpen(id) { $(id).classList.remove("hidden"); }
  function sheetClose(id) { $(id).classList.add("hidden"); }
  ["esBlkSheet", "esRtSheet", "esOutSheet"].forEach(function (id) {
    $(id).addEventListener("click", function (e) { if (e.target === this || e.target.closest(".es-sheet-x")) sheetClose(id); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") ["esBlkSheet", "esRtSheet", "esOutSheet"].forEach(function (id) { if (!$(id).classList.contains("hidden")) { sheetClose(id); if (editor) editor.focus(); } });
    if (e.key === "F5") { e.preventDefault(); if (!running && editor) run(); }
  });

  /* ---------- Blocks: real English++ shapes from the Book, dropped in at the right level ----------
     ${1:name} is a blank you can type over; Tab (or the Tab key on the row) jumps to the next blank.
     Every block here is run by the test suite (ui_v2/test_editor_v2.js). */
  function nearest(kindTest) {
    var names = editor.names(), line = editor.view.state.doc.lineAt(editor.view.state.selection.main.head).number, best = null;
    names.forEach(function (n) { if (n.here && n.line < line && kindTest(n) && (!best || n.line > best.line)) best = n; });
    return best && best.name;
  }
  var BLOCKS = [
    { id: "foreach", title: "For each item in a list", shape: "n fea scores", make: function () {
      var l = nearest(function (n) { return /^(list|set|stack|queue)$/.test(n.kind); });
      return l ? "${1:n} fea ${2:" + l + "}\n\tout prn ${1:n}" : "${2:scores} is 3&5&8\n${1:n} fea ${2:scores}\n\tout prn ${1:n}"; } },
    { id: "count", title: "Count 0, 1, 2 … up to a number", shape: "i flt 10", make: function () { return "${1:i} flt ${2:10}\n\tout prn ${1:i}"; } },
    { id: "while", title: "While loop", shape: "n wlt 5", make: function () { return "${1:n} is 0\n${1:n} wlt ${2:5}\n\t${1:n} add 1\nout prn ${1:n}"; } },
    { id: "if", title: "If / otherwise", shape: "x igt 3 … now oth now", make: function () {
      var x = nearest(function (n) { return /^(number|decimal|counter|constant)$/.test(n.kind); });
      return (x ? "" : "${1:x} is 5\n") + "${1:" + (x || "x") + "} igt ${2:3}\n\tout prn \"${3:big}\"\nnow oth now\n\tout prn \"${4:small}\""; } },
    { id: "ifelif", title: "If / otherwise if / otherwise", shape: "x ilt 2 … x olt 9 … now oth now", make: function () {
      var x = nearest(function (n) { return /^(number|decimal|counter|constant)$/.test(n.kind); });
      return (x ? "" : "${1:x} is 4\n") + "${1:" + (x || "x") + "} ilt ${2:2}\n\tout prn \"${3:small}\"\n${1:" + (x || "x") + "} olt ${4:9}\n\tout prn \"${5:medium}\"\nnow oth now\n\tout prn \"${6:large}\""; } },
    { id: "until", title: "Do … until", shape: "now bdo now … n uge 6", make: function () { return "${1:n} is 0\nnow bdo now\n\t${1:n} add ${2:2}\n${1:n} uge ${3:6}\nout prn ${1:n}"; } },
    { id: "switch", title: "Switch on a value", shape: "day bsw now … now bcs 6&7", make: function () {
      return "${1:day} is 6\n${1:day} bsw now\n\tnow bcs ${2:6&7}\n\t\tout prn \"${3:the weekend}\"\n\tnow bcs ${4:1}\n\t\tout prn \"${5:Monday}\"\n\tnow bdf now\n\t\tout prn \"${6:a work day}\""; } },
    { id: "function", title: "Function that gives back a number", shape: "add_up dfn num", make: function () {
      return "out prn ${1:add_up}&1&2\n\n${1:add_up} dfn num\n\t${2:a} dpm num\n\t${3:b} dpm num\n\t${1:add_up} ert ${2:a}+${3:b}"; } },
    { id: "function0", title: "Function that just does something", shape: "greet dfn now", make: function () { return "now ${1:greet} now\n\n${1:greet} dfn now\n\tout prn \"${2:Hello}\""; } },
    { id: "class", title: "Class with a field and a method", shape: "Dog dcl now", make: function () {
      return "${1:rex} mak ${2:Dog}\n${1:rex}@name is \"${3:Rex}\"\n${1:rex} bark now\n\n${2:Dog} dcl now\n\tname dfd txt\n\tbark dfn now\n\t\tout prn \"@name says woof!\""; } },
    { id: "list", title: "List: make, add, print", shape: "scores mak vec@num", make: function () { return "${1:scores} mak vec@num\n${1:scores} add ${2:4}\n${1:scores} add ${3:7}\nout prn ${1:scores}"; } },
    { id: "map", title: "Map: names to numbers, then walk it", shape: "ages mak map@txt@num", make: function () {
      return "${1:ages} mak map@txt@num\n${1:ages}@\"${2:Ada}\" is ${3:36}\nname&age fea ${1:ages}\n\tout prn \"@name is @age\""; } },
    { id: "try", title: "Try / catch a problem", shape: "now btr now … e bch now", make: function () {
      return "now btr now\n\t${1:n} is tnm&\"${2:not a number}\"\ne bch now\n\tout prn \"${3:That was not a number.}\""; } },
    { id: "raylib", title: "raylib window loop (a game)", shape: "WindowShouldClose& weq nay", make: function () {
      var has = /^\s*now\s+xlb\s+raylib\b/m.test(editor.getText());
      return (has ? "" : "now xlb raylib\n") + "now InitWindow 800&450&\"${1:My Game}\"\nnow SetTargetFPS 60\nWindowShouldClose& weq nay\n\tnow BeginDrawing now\n\tnow ClearBackground ${2:DARKBLUE}\n\tnow DrawText \"${3:Hello!}\"&20&20&30&RAYWHITE\n\tnow EndDrawing now\nnow CloseWindow now"; } },
    { id: "qt", title: "Qt-style app window", shape: "now QtMakeWindow …", make: function () {
      var has = /^\s*now\s+xlb\s+qt\b/mi.test(editor.getText());
      return (has ? "" : "now xlb qt\n") + "now QtMakeWindow \"${1:My App}\"&320&200\nnow QtAddLabel \"shown\"&\"${2:Hello}\"\nnow QtStart now"; } }
  ];
  function insertBlock(id) {
    var b = BLOCKS.filter(function (x) { return x.id === id; })[0]; if (!b) return false;
    editor.insertBlock(b.make()); return true;
  }
  function openBlocks() {
    if (window.EppCppMode && EppCppMode.openBlocks()) return;
    $("esBlkList").innerHTML = BLOCKS.map(function (b) { return '<button type="button" class="es-ex es-blk" data-b="' + b.id + '"><b>' + esc(b.title) + "</b><code>" + esc(b.shape) + "</code></button>"; }).join("");
    sheetOpen("esBlkSheet");
    var f = $("esBlkList").querySelector("button"); if (f && !touch) f.focus();
  }
  $("esBlocks").addEventListener("click", openBlocks);
  $("esBlkList").addEventListener("click", function (e) {
    var b = e.target.closest(".es-blk"); if (!b) return;
    sheetClose("esBlkSheet"); insertBlock(b.dataset.b); saveDraft();
    toast(touch ? "Tap Tab to jump to the next blank" : "Tab jumps to the next blank");
  });

  /* ---------- Root Table: every word in the Chart ---------- */
  var RT = null, rtQuery = "", rtFilter = "all";
  function rtLoad(cb) {
    if (RT) return cb();
    fetch("data/epp-studio/root_table.json").then(function (r) { return r.json(); }).then(function (j) { RT = j; cb(); })
      .catch(function () { $("esRtList").innerHTML = '<p class="es-dim">The Root Table could not load.</p>'; });
  }
  function rtRun(e) {
    if (!e.run) return "";
    if (e.run.ok) return '<span class="es-rt-ok">runs on its own</span>';
    if (e.run.needs) return '<span class="es-rt-needs">needs ' + esc(e.run.needs) + " made first</span>";
    if (e.run.refused) return '<span class="es-rt-ref">not in the Web Studio yet</span>';
    if (e.run.detail) return '<span class="es-rt-needs" title="' + esc(e.run.detail) + '">on its own, the Studio says:</span><small class="es-rt-why">' + esc(e.run.detail) + "</small>";
    return '<span class="es-rt-needs">' + esc(e.run.msg || "") + "</span>";
  }
  function rtTry(e) { return e.section === "root" ? e.example : e.section === "value" ? "out prn " + e.example : ""; }
  function rtItem(e, gi, ii) {
    var tryLine = rtTry(e);
    return '<div class="es-rt-row" id="rt-' + esc(e.section + "-" + e.word) + '" data-w="' + esc(e.word) + '">' +
      '<div class="es-rt-w"><b class="' + (e.section === "root" ? "epp-root epp-f-" + (e.word === "is" ? "is" : e.word[0]) : e.section === "value" ? "epp-value epp-f-" + e.word[0] : "epp-" + e.section) + '">' + esc(e.word) + "</b>" + (e.block ? '<span class="es-rt-blk">opens a block</span>' : "") + "</div>" +
      '<div class="es-rt-says">' + esc(e.says) + "</div>" +
      '<div class="es-rt-shape">' + (e.who ? '<span>who</span> ' + esc(e.who) + ' <span>what</span> ' + esc(e.what) : "") + "</div>" +
      '<div class="es-rt-ex">' + (e.example ? '<span class="es-rt-lab">example</span><code>' + esc(e.example) + "</code>" : "") + rtRun(e) + "</div>" +
      '<div class="es-rt-cpp">' + (e.cpp ? '<span class="es-rt-lab">C++</span><code>' + esc(e.cpp) + "</code>" : "") + "</div>" +
      '<div class="es-rt-acts">' + (tryLine ? '<button type="button" class="es-btn es-rt-try" data-g="' + gi + '" data-i="' + ii + '" title="Puts ' + esc(tryLine) + ' in your program">Try it</button>' : "") +
      (e.book ? '<button type="button" class="es-btn es-rt-book" data-g="' + gi + '" data-i="' + ii + '" title="Book program ' + e.book.id + " (" + esc(e.book.chapter) + ')">Book program</button>' : "") + "</div></div>";
  }
  function rtRender() {
    var q = rtQuery.trim().toLowerCase(), h = "", shown = 0;
    RT.groups.forEach(function (g, gi) {
      if (rtFilter !== "all" && g.section !== rtFilter) return;
      var items = g.items.map(function (e, ii) { return [e, ii]; }).filter(function (p) {
        if (!q) return true; var e = p[0];
        return (e.word + "\n" + e.says + "\n" + (e.example || "") + "\n" + (e.cpp || "") + "\n" + (e.who || "") + "\n" + (e.what || "")).toLowerCase().indexOf(q) >= 0;
      });
      if (!items.length) return;
      shown += items.length;
      h += '<section class="es-rt-g"><h3>' + (g.letter ? '<b class="epp-root epp-f-' + g.letter + '">' + esc(g.letter) + "</b> " : "") + esc(g.family) + (g.does ? ' <span>' + esc(g.does) + "</span>" : "") + ' <em>' + (g.section === "root" ? "roots" : g.section === "value" ? "value words" : "") + "</em></h3>" +
        '<div class="es-rt-head" aria-hidden="true"><span>word</span><span>says</span><span>who · what</span><span>example</span><span>C++</span><span></span></div>' +
        items.map(function (p) { return rtItem(p[0], gi, p[1]); }).join("") + "</section>";
    });
    $("esRtList").innerHTML = h || '<p class="es-dim">Nothing matches.</p>';
    $("esRtCount").textContent = shown + " of " + (RT.counts.root + RT.counts.value + RT.counts.kind + RT.counts.special);
  }
  function openRootTable(word) {
    sheetOpen("esRtSheet");
    rtLoad(function () {
      if (word) { rtQuery = ""; $("esRtSearch").value = ""; rtFilter = "all"; syncRtChips(); }
      rtRender();
      if (word) {
        var el = $("esRtList").querySelector('[data-w="' + (window.CSS && CSS.escape ? CSS.escape(word) : word) + '"]');
        if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("hit"); setTimeout(function () { el.classList.remove("hit"); }, 1600); }
      } else if (!touch) $("esRtSearch").focus();
    });
  }
  function syncRtChips() { Array.prototype.forEach.call(document.querySelectorAll(".es-rt-chip"), function (c) { c.setAttribute("aria-pressed", String(c.dataset.f === rtFilter)); }); }
  $("esRoots").addEventListener("click", function () { openRootTable(); });
  $("esRtSearch").addEventListener("input", function () { rtQuery = this.value; if (RT) rtRender(); });
  $("esRtChips").addEventListener("click", function (e) { var c = e.target.closest(".es-rt-chip"); if (!c) return; rtFilter = c.dataset.f; syncRtChips(); if (RT) rtRender(); });
  $("esRtList").addEventListener("click", function (e) {
    var b = e.target.closest(".es-rt-try, .es-rt-book"); if (!b) return;
    var it = RT.groups[+b.dataset.g].items[+b.dataset.i];
    sheetClose("esRtSheet");
    if (b.classList.contains("es-rt-try")) { editor.insertBlock(rtTry(it), true); saveDraft(); toast("Put in: " + rtTry(it)); return; }
    syncActive();
    var code = it.book.code;
    if (active !== 0) openTab(0);
    files[0].state = editor.makeState(code); editor.view.setState(files[0].state);
    renderTabs(); editor.relint(); saveDraft();
    history.replaceState(null, "", location.href.split("#")[0]);
    toast("Loaded Book program " + it.book.id + " — press Run");
    conClear(); conNote("The Book says this prints:", "dim"); conWrite(it.book.output + "\n", "book");
  });

  /* ---------- Outline: your functions and classes ---------- */
  function openOutline() {
    if (window.EppCppMode && EppCppMode.outline()) return;
    var o = editor.outline();
    $("esOutList").innerHTML = o.length ? o.map(function (n) { return '<button type="button" class="es-ex es-outl" data-l="' + n.line + '"><code>' + (n.owner ? "  " : "") + esc(n.name) + " " + esc(n.root) + "</code><span>" + esc(n.kind + (n.owner ? " of " + n.owner : "")) + " · line " + n.line + "</span></button>"; }).join("")
      : '<p class="es-dim">No functions or classes in this file yet. Blocks has a Function and a Class.</p>';
    sheetOpen("esOutSheet");
  }
  $("esOutline").addEventListener("click", openOutline);
  $("esOutList").addEventListener("click", function (e) { var b = e.target.closest(".es-outl"); if (!b) return; sheetClose("esOutSheet"); editor.goToLine(+b.dataset.l); });

  /* ---------- rename a name everywhere (every open file) ---------- */
  function doRename(oldN, newN) {
    if (!/^[A-Za-z_][A-Za-z_0-9]*$/.test(newN || "")) return { error: "A name is letters, digits and _, and starts with a letter." };
    if (CM.isReserved && CM.isReserved(newN)) return { error: newN + " is already an English++ word." };
    syncActive();
    var total = editor.rename(oldN, newN);
    files.forEach(function (f, i) {
      if (i === active) return;
      var t = f.state ? f.state.doc.toString() : (f.text || "");
      var r = editor.renameText(t, oldN, newN);
      if (r.count) { total += r.count; f.state = editor.makeState(r.text); f.text = r.text; }
    });
    saveDraft(); editor.relint();
    return { count: total };
  }
  function askRename(n) {
    var to = prompt("Rename " + n + " to:", n);
    if (!to || to === n) return;
    var r = doRename(n, to.trim());
    toast(r.error ? r.error : "Renamed " + n + " to " + to.trim() + " in " + r.count + " place" + (r.count === 1 ? "" : "s"));
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
      check: function (src) { if (!M) return null; try { if (window.EppDebug) EppDebug.syncFiles(M); return M.check(src); } catch (e) { return null; } },
      onChange: function () { saveDraft(); if (running) return; },
      onCursor: onCursor,
      onRun: run,
      fileName: function () { return files[active] ? files[active].name : "main.epp"; },
      otherFiles: function () { return files.map(function (f, i) { return i === active ? null : { name: f.name, doc: f.state ? f.state.doc : null, get text() { return f.state ? f.state.doc.toString() : (f.text || ""); } }; }).filter(Boolean); },
      onRootTable: function (w) { openRootTable(w); },
      fixesFor: function (d) { return window.EppFixIt ? EppFixIt.fixesFor(d) : null; },
      onRename: function (n) { askRename(n); },
      openFile: function (name, line) { var i = files.findIndex(function (f) { return f.name === name; }); if (i < 0) return; openTab(i); editor.goToLine(line); }
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
    if (window.EppCppMode) EppCppMode.init({
      editor: editor, files: function () { return files; }, active: function () { return active; }, fileList: fileList, syncActive: syncActive, setFiles: setFiles, openTab: openTab,
      engine: function () { return M; }, toast: toast, status: status, conClear: conClear, conNote: conNote, conWrite: conWrite, con: function () { return con; }, readLine: readLine,
      showPane: showPane, setBusy: function (on) { setRunning(on); if (!on) $("esRun").disabled = !M && !EppCppMode.isActive(); }, running: function () { return running; },
      load: load, store: store, sheetOpen: sheetOpen, sheetClose: sheetClose, saveDraft: saveDraft, touch: function () { return touch; }, eppEvent: eppEvent,
      pendingInput: function () { return pendingInput; } });
    if (window.EppCore) EppCore.init({ editor: editor, files: function () { syncActive(); return fileList(); }, setFiles: setFiles, openTab: openTab,
      toast: toast, sheetOpen: sheetOpen, sheetClose: sheetClose });
    if (window.EppDebug) setTimeout(function () { EppDebug.init({ setRunning: setRunning, conClear: conClear, conNote: conNote, conWrite: conWrite, syncActive: syncActive, fileList: fileList, files: function () { return files; }, active: function () { return active; }, openTab: openTab, showPane: showPane, status: status, touch: function () { return touch; }, qtReset: qtReset, running: function () { return running; } }); }, 0);
    window.EppStudio = { cppMode: window.EppCppMode, editor: editor, files: function () { syncActive(); return fileList(); }, shareURL: shareURL, run: run, stop: stop, engine: function () { return M; }, showPane: showPane, blocks: BLOCKS, insertBlock: insertBlock, openRootTable: openRootTable, rootTable: function () { return RT; }, openOutline: openOutline, rename: doRename, setTouch: setTouch, openTab: openTab };
  }
  Promise.all(["roots", "raylib", "qt"].map(function (n) { return fetch("data/epp-studio/" + n + ".json").then(function (r) { if (!r.ok) throw new Error(n + ".json " + r.status); return r.json(); }); }))
    .then(function (a) { start({ families: a[0].families, words: a[0].words, kinds: a[0].kinds, special: a[0].special, raylib: a[1], qt: a[2] }); })
    .catch(function (e) { status("Data failed", "bad"); $("esEditor").innerHTML = '<p class="es-dim" style="padding:16px">The Studio could not load its word lists (' + esc(e.message) + "). Reload to try again.</p>"; });
})();
