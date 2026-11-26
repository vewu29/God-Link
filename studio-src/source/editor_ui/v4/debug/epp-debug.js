/* English++ Web Studio v4 — the debugger panel.
   English++ is Vewu's language. The debugger only watches a program run: it never changes a line, a value or the output.
   - Tap / click a line number to set a breakpoint (red dot). Run with breakpoints set stops on them; Debug stops on the first line.
   - When stopped: the line is marked in the editor; Go on / Step / Over / Out / Stop (44 px buttons);
     Variables (this function, then mgl globals) with lists, maps, sets and things you can open; the call stack (tap a row).
   - Keys (Chromebook / desktop): F8 go on, F10 step over, F11 step (into), Shift+F11 step out.
   Talks to the page only through window.EppStudio and the ctx given by init() (see ui/v4_hooks_debug.py). */
(function () {
  "use strict";
  var C = null, S = null;                 // page ctx, window.EppStudio
  var wantPause = false, debugging = false, paused = null, waker = null, lastVals = {}, frameShown = -1;
  var nextVals = {}, openSet = {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function isCpp() { return !!(window.EppCppMode && EppCppMode.handlesRun && EppCppMode.handlesRun()); }
  function isCppName(n) { return /\.(cpp|cc|cxx|h|hpp)$/i.test(n); }

  // ---- breakpoints of every file: [{file: "" for the first (main) file, else its tab name, line, tab}]
  function allBreakpoints() {
    var out = [], files = C.files(), act = C.active();
    files.forEach(function (f, i) {
      if (isCppName(f.name)) return;
      var lines = i === act ? S.editor.breakpoints() : (f.state && window.EppCM && EppCM.breakpointLines ? EppCM.breakpointLines(f.state) : []);
      lines.forEach(function (n) { out.push({ file: i === 0 ? "" : f.name, line: n, tab: i }); });
    });
    return out;
  }
  function pushBreakpoints() {
    renderBps();
    var M = S.engine();
    if (debugging && M && M.setBreakpoints) M.setBreakpoints(allBreakpoints());
  }

  // ---- the run hook: epp-studio.js run() calls EppDebug.go(M, main) instead of M.run(main) when active() says so
  function active() { return !!(S && S.engine() && S.engine().debug && !isCpp() && (wantPause || allBreakpoints().length)); }
  function go(M, main) {
    var start = wantPause; wantPause = false;
    debugging = true; lastVals = {}; frameShown = -1; openSet = {};
    setBar("running");
    return M.debug(main, { breakpoints: allBreakpoints(), pauseAtStart: start, onPause: onPause }).finally(function () {
      debugging = false; paused = null; waker = null;
      S.editor.setDebugLine(0, false);
      setBar("idle"); renderVars(null);
    });
  }
  function onPause(info) {
    paused = info;
    var files = C.files(), tab = 0;
    if (info.file) { tab = files.findIndex(function (f) { return f.name === info.file; }); if (tab < 0) tab = 0; }
    if (tab !== C.active()) { S.editor.setDebugLine(0, false); C.openTab(tab); }
    S.editor.setDebugLine(info.line, true);
    C.status("Paused · line " + info.line, "run");
    frameShown = info.stack.length - 1;
    renderVars(info);
    setBar("paused");
    var cur = document.querySelector(".es-out-tabs [role=tab].active");
    if (!cur || cur.dataset.pane === "console" || cur.dataset.pane === "cpp") C.showPane("debug");
    return new Promise(function (res) { waker = res; });
  }
  function act(a) {
    if (!waker) return;
    var w = waker; waker = null; paused = null;
    setBar(a === "continue" ? "running" : "stepping");
    C.status("Running…", "run");
    w(a);
  }
  function startDebug() {
    if (debugging) { if (waker) act("step"); return; }
    if (C.running() || isCpp()) return;
    wantPause = !allBreakpoints().length; S.run();
  }

  // ---- the panel
  var BAR = [
    ["continue", "Go on", "Go on to the next breakpoint (F8)", '<path d="M6 4l12 8-12 8z"/>'],
    ["step", "Step", "Step: the next line, into functions (F11)", '<path d="M12 3v11M7 9l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="20" r="2.2"/>'],
    ["over", "Over", "Step over: the next line in this function (F10)", '<path d="M4 15a8 8 0 0 1 15-5M19 4v6h-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="20" r="2.2"/>'],
    ["out", "Out", "Step out: finish this function (Shift+F11)", '<path d="M12 16V4M7 9l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="20" r="2.2"/>'],
    ["stop", "Stop", "Stop the program", '<rect x="6" y="6" width="12" height="12" rx="2"/>']
  ];
  function build() {
    var dbg = document.createElement("button");
    dbg.type = "button"; dbg.className = "es-btn es-dbg-btn"; dbg.id = "esDebug";
    dbg.title = "Run and stop on the first line (or on your breakpoints). Tap a line number to set a breakpoint.";
    dbg.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="7" width="10" height="12" rx="5"/><path d="M4 11h3M17 11h3M4 17h3M17 17h3" stroke="currentColor" stroke-width="2"/></svg><span class="es-dbg-lbl">Debug</span>';
    $("esStop").insertAdjacentElement("afterend", dbg);
    dbg.addEventListener("click", startDebug);
    var tab = document.createElement("button");
    tab.type = "button"; tab.setAttribute("role", "tab"); tab.dataset.pane = "debug"; tab.id = "esTabDebug"; tab.setAttribute("aria-selected", "false"); tab.textContent = "Debug";
    var cppTab = document.querySelector('.es-out-tabs [data-pane="cpp"]');
    cppTab.parentNode.insertBefore(tab, cppTab);
    var pane = document.createElement("div");
    pane.className = "es-pane es-dbg-pane"; pane.dataset.pane = "debug";
    pane.innerHTML =
      '<div class="es-dbg-bar" role="toolbar" aria-label="Debugger">' + BAR.map(function (b) {
        return '<button type="button" class="es-dbg-k es-dbg-' + b[0] + '" data-a="' + b[0] + '" title="' + esc(b[2]) + '" aria-label="' + esc(b[2]) + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + b[3] + "</svg><span>" + b[1] + "</span></button>";
      }).join("") + "</div>" +
      '<div class="es-dbg-where" id="esDbgWhere"></div>' +
      '<div class="es-dbg-body" id="esDbgBody">' +
        '<section class="es-dbg-sec"><h3>Variables <small id="esDbgFrameName"></small></h3><div id="esDbgLocals" class="es-dbg-vars"></div></section>' +
        '<section class="es-dbg-sec" id="esDbgGlobSec"><h3>Globals <small>mgl</small></h3><div id="esDbgGlobals" class="es-dbg-vars"></div></section>' +
        '<section class="es-dbg-sec"><h3>Call stack</h3><div id="esDbgStack" class="es-dbg-stack"></div></section>' +
        '<section class="es-dbg-sec"><h3>Breakpoints <button type="button" class="es-dbg-clear" id="esDbgClear">Clear all</button></h3><div id="esDbgBps" class="es-dbg-bps"></div></section>' +
      "</div>";
    var host = document.querySelector('.es-pane[data-pane="cpp"]');
    host.parentNode.insertBefore(pane, host);
    var bar = pane.querySelector(".es-dbg-bar");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]"); if (!b || b.disabled) return;
      if (b.dataset.a === "stop") { S.stop(); return; }
      act(b.dataset.a);
    });
    bar.addEventListener("mousedown", function (e) { if (e.target.closest("[data-a]")) e.preventDefault(); });   // keep the editor's focus and keyboard
    $("esDbgStack").addEventListener("click", function (e) {
      var r = e.target.closest("[data-k]"); if (!r || !paused) return;
      var k = +r.dataset.k, M = S.engine(), top = paused.stack.length - 1;
      frameShown = k;
      var fr = paused.stack[k];
      var vars = k === top ? paused.locals : (M.debugFrame ? M.debugFrame(k) : []);
      $("esDbgLocals").innerHTML = varsHTML(vars, "f" + k + ":", true) || '<p class="es-dim">No names made here yet.</p>';
      $("esDbgFrameName").textContent = "in " + fr.name;
      renderStack(paused);
      var line = k === top ? paused.line : fr.line, file = k === top ? paused.file : fr.file;
      if (line) {
        var files = C.files(), t = file ? files.findIndex(function (f) { return f.name === file; }) : 0;
        if (t >= 0 && t !== C.active()) { S.editor.setDebugLine(0, false); C.openTab(t); }
        S.editor.setDebugLine(line, true);
      }
    });
    $("esDbgBps").addEventListener("click", function (e) {
      var r = e.target.closest("[data-tab]"); if (!r) return;
      var t = +r.dataset.tab; if (t !== C.active()) C.openTab(t);
      var v = S.editor.view; v.dispatch({ selection: { anchor: v.state.doc.line(Math.min(+r.dataset.line, v.state.doc.lines)).from }, scrollIntoView: true });
    });
    $("esDbgClear").addEventListener("click", function () {
      C.files().forEach(function (f, i) { if (i === C.active()) S.editor.clearBreakpoints(); else if (f.state && window.EppCM && EppCM.clearBreakpointsIn) f.state = EppCM.clearBreakpointsIn(f.state); });
      pushBreakpoints();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "F8" && e.key !== "F10" && e.key !== "F11") return;
      if (!debugging) { if (e.key !== "F8" && !C.running() && !isCpp()) { e.preventDefault(); startDebug(); } return; }
      e.preventDefault();
      act(e.key === "F8" ? "continue" : e.key === "F10" ? "over" : e.shiftKey ? "out" : "step");
    }, true);
    S.editor.onBreakpoints(pushBreakpoints);
    // switching tabs swaps the editor's state: the list follows
    $("esFiles").addEventListener("click", function () { setTimeout(renderBps, 0); });
    document.addEventListener("toggle", function (e) { var d = e.target; if (d && d.classList && d.classList.contains("es-dbg-row")) { if (d.open) openSet[d.dataset.key] = 1; else delete openSet[d.dataset.key]; } }, true);
    setBar("idle"); renderBps(); renderVars(null);
  }
  function setBar(mode) {
    var bar = document.querySelector(".es-dbg-bar"); if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll("[data-a]"), function (b) { b.disabled = b.dataset.a === "stop" ? mode === "idle" : mode !== "paused"; });
    document.documentElement.classList.toggle("es-dbg-paused", mode === "paused");
    var d = $("esDebug");
    if (d) { d.classList.toggle("on", mode !== "idle"); d.querySelector(".es-dbg-lbl").textContent = mode === "paused" ? "Step" : "Debug"; d.disabled = mode === "running" || mode === "stepping"; }
    var tab = $("esTabDebug"); if (tab) tab.classList.toggle("es-dbg-live", mode === "paused");
    var w = $("esDbgWhere"); if (!w) return;
    if (mode === "running") w.textContent = "Running with the debugger on. It stops at a breakpoint.";
    else if (mode === "stepping") w.textContent = "Running to the next stop…";
    else if (mode === "idle") w.innerHTML = "Tap a line number to set a breakpoint, then press <b>Run</b>. <b>Debug</b> stops on the first line.";
    else if (paused) w.innerHTML = '<span class="es-dbg-dot"></span>Stopped at <b>line ' + paused.line + "</b>" + (paused.file ? " of <b>" + esc(paused.file) + "</b>" : "") + (paused.why === "breakpoint" ? " · breakpoint" : "") + (paused.stack.length > 1 ? " · in <b>" + esc(paused.stack[paused.stack.length - 1].name) + "</b>" : "");
  }
  // one variable row; things with insides open (lists, maps, sets, tuples, things)
  function rowHTML(v, path, noMark) {
    var key = path + (v.n || "·"), val = v.v, changed = !noMark && lastVals[key] != null && lastVals[key] !== val;
    nextVals[key] = val;
    var name = v.n === "" ? "" : '<span class="es-dbg-n">' + esc(v.n) + "</span>";
    var shown = val === "" && v.t ? '<i class="es-dim">(empty text)</i>' : esc(val);
    var kind = '<span class="es-dbg-kd">' + esc(v.k) + (v.count != null ? " · " + v.count + (/^an? [A-Z]/.test(v.k) ? (v.count === 1 ? " field" : " fields") : (v.count === 1 ? " item" : " items")) : "") + "</span>";
    if (v.kids || v.more) {
      var inner = (v.kids || []).map(function (k, i) { return rowHTML(k, key + "/" + i + ":", noMark); }).join("");
      if (v.count != null && v.kids && v.count > v.kids.length) inner += '<div class="es-dbg-more">… and ' + (v.count - v.kids.length) + " more</div>";
      if (v.more) inner = '<div class="es-dbg-more">(too deep to show here)</div>';
      return '<details class="es-dbg-row' + (changed ? " changed" : "") + '"' + (openSet[key] ? " open" : "") + ' data-key="' + esc(key) + '"><summary><span class="es-dbg-tw" aria-hidden="true"></span>' + name + kind + '<code class="es-dbg-v">' + shown + "</code></summary><div class=\"es-dbg-kids\">" + inner + "</div></details>";
    }
    return '<div class="es-dbg-row leaf' + (changed ? " changed" : "") + '">' + name + kind + '<code class="es-dbg-v">' + shown + "</code></div>";
  }
  function varsHTML(list, path, noMark) { return (list || []).map(function (v) { return rowHTML(v, path, noMark); }).join(""); }
  function renderVars(info) {
    var L = $("esDbgLocals"), G = $("esDbgGlobals"); if (!L) return;
    if (!info) { L.innerHTML = '<p class="es-dim">Variables show here when the program stops.</p>'; G.innerHTML = ""; $("esDbgGlobSec").classList.add("hidden"); $("esDbgStack").innerHTML = '<p class="es-dim">Shows when the program stops.</p>'; $("esDbgFrameName").textContent = ""; return; }
    nextVals = {};
    var top = info.stack.length - 1;
    L.innerHTML = varsHTML(info.locals, "f" + top + ":") || '<p class="es-dim">No names made here yet.</p>';
    $("esDbgFrameName").textContent = "in " + info.stack[top].name;
    G.innerHTML = varsHTML(info.globals, "g:");
    $("esDbgGlobSec").classList.toggle("hidden", !info.globals.length);
    lastVals = nextVals;
    renderStack(info);
  }
  function renderStack(info) {
    var top = info.stack.length - 1;
    $("esDbgStack").innerHTML = info.stack.map(function (s, k) { return { s: s, k: k }; }).reverse().map(function (x) {
      var ln = x.k === top ? info.line : x.s.line, fl = x.k === top ? info.file : x.s.file;
      return '<button type="button" class="es-dbg-fr' + (x.k === frameShown ? " on" : "") + '" data-k="' + x.k + '"><b>' + esc(x.s.name) + "</b><span>line " + ln + (fl ? " · " + esc(fl) : "") + "</span></button>";
    }).join("");
  }
  function renderBps() {
    var el = $("esDbgBps"); if (!el) return;
    var list = allBreakpoints(), files = C.files();
    el.innerHTML = list.length ? list.map(function (b) {
      var f = files[b.tab], text = "";
      try { var st = b.tab === C.active() ? S.editor.view.state : f.state; if (st && b.line <= st.doc.lines) text = st.doc.line(b.line).text.trim(); } catch (e) {}
      return '<button type="button" class="es-dbg-bp" data-tab="' + b.tab + '" data-line="' + b.line + '"><span class="es-dbg-dot"></span><b>' + esc(f ? f.name : "") + ":" + b.line + "</b><code>" + esc(text) + "</code></button>";
    }).join("") : '<p class="es-dim">None yet. Tap a line number in the editor.</p>';
    var d = $("esDebug"); if (d) d.classList.toggle("has-bp", list.length > 0);
  }

  // the engine's file box gets the other English++ tabs before a live check, so `now xim "x.epp"` finds them.
  // A tab is written again only when its text changed (CodeMirror keeps one text object per version).
  var written = new Map();
  function syncFiles(M) {
    if (!C || !M || !M.fsWrite) return;
    var files = C.files(), act = C.active();
    files.forEach(function (f, i) {
      if (i === act || isCppName(f.name)) return;
      var doc = f.state ? f.state.doc : null, ver = doc || f.text;
      if (written.get(f.name) === ver) return;
      try { M.fsWrite(f.name, doc ? doc.toString() : (f.text || "")); written.set(f.name, ver); } catch (e) {}
    });
  }

  window.EppDebug = {
    syncFiles: syncFiles,
    init: function (ctx) { C = ctx; S = window.EppStudio; build(); },
    active: active, go: go, act: act, start: startDebug,
    state: function () { return { debugging: debugging, paused: paused, breakpoints: allBreakpoints() }; },
    breakpoints: allBreakpoints, refresh: renderBps
  };
})();
