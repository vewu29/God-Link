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

