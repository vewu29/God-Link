/* English++ Web Studio v3 — C++ mode (the page side).
   A .cpp / .h file opens in C++ mode: C++ highlighting and suggestions, C++ Blocks and examples, and Run builds every
   C++ file with real Clang 22 in this browser (the Full build compiler, shared download and cache). A program that
   includes raylib.h runs on the game canvas through the Studio's own raylib 5.5 build (WebGL2).
   English++ files are untouched: English++ mode works exactly as before. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var S = null;                 // Studio internals, given by epp-studio.js at start
  var CPP = null;               // fullbuild/cpp/cppbuild.js (loaded on first Run)
  var cur = null;               // running C++ program: { kind: "console"|"raylib", ctl }
  var lastErrors = {};          // file name -> compiler errors of the last build
  var isCppName = function (n) { return /\.(cpp|cc|cxx|c\+\+|h|hpp|hh|hxx)$/i.test(n || ""); };

  function active() { return S && S.files()[S.active()]; }
  function isActive() { var f = active(); return !!(f && isCppName(f.name)); }
  function cppFiles() { S.syncActive(); return S.fileList().filter(function (f) { return isCppName(f.name); }); }

  /* ---------- mode switch (called on every tab change) ---------- */
  function onTab() {
    if (!S) return;
    var on = isActive();
    document.documentElement.classList.toggle("es-lang-cpp", on);
    // the C++ key row and word list are made the first time a C++ file is opened, so an English++-only page is unchanged
    if (on) { loadCppData(); if (!$("esAccCpp")) buildAcc(); }
    if (on) { var c = $("esCard"); if (c) c.classList.remove("show"); }
    var f = active();
    var b = badgeEl || $("esLangBadge");
    if (!b) return;
    // the badge shows only once the project has a C++ file, so an English++-only Studio looks exactly as before
    b.hidden = !S.files().some(function (x) { return isCppName(x.name); });
    if (b.parentNode !== $("esFiles")) $("esFiles").appendChild(b);
    b.textContent = on ? "C++" : "English++";
    b.title = on ? f.name + " is C++: Run builds it with real Clang in this browser" : "English++ mode";
    if (on && f && lastErrors[f.name] && S.editor.setCppDiagnostics) S.editor.setCppDiagnostics(lastErrors[f.name]);
  }

  /* ---------- accessory key row for C++ (phones) ---------- */
  var ACC = [["{", "{"], ["}", "}"], ["(", "("], [")", ")"], [";", ";"], ["<", "<"], [">", ">"], ['"', '""'], ["=", "="], ["[", "["], ["]", "]"],
    ["Tab", "\tTAB"], ["⇤", "\tOUT"], ["Blocks", "\tBLOCKS"], ["↶", "\tUNDO"], ["↷", "\tREDO"],
    ["std::", "std::"], ["<<", " << "], ["::", "::"], ["&", "&"], ["*", "*"], ["->", "->"], ["#", "#"], ["//", "// "], ["Find", "\tFIND"], ["▾", "\tDONE"]];
  var ACC_LABEL = { "⇤": "Shift-Tab, outdent", "▾": "Hide the keyboard", "Tab": "Tab, indent or next blank", "↶": "Undo", "↷": "Redo", "Blocks": "Blocks: drop in a C++ shape", "Find": "Find and replace" };
  function buildAcc() {
    var row = document.createElement("div"); row.className = "es-acc es-acc-cpp"; row.id = "esAccCpp"; row.setAttribute("role", "toolbar"); row.setAttribute("aria-label", "C++ typing keys");
    row.innerHTML = ACC.map(function (a, i) { var cmd = a[1][0] === "\t"; return '<button type="button" class="es-acc-k' + (cmd && a[0].length > 2 ? " cmd" : "") + '" data-a="' + i + '" aria-label="' + esc(ACC_LABEL[a[0]] || "Type " + a[0]) + '">' + esc(a[0]) + "</button>"; }).join("");
    $("esAcc").parentNode.insertBefore(row, $("esAcc").nextSibling);
    row.addEventListener("pointerdown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
    row.addEventListener("mousedown", function (e) { if (e.target.closest(".es-acc-k")) e.preventDefault(); });
    row.addEventListener("click", function (e) {
      var b = e.target.closest(".es-acc-k"); if (!b) return;
      var v = ACC[+b.dataset.a][1], ed = S.editor;
      if (v === "\tTAB") ed.indent(); else if (v === "\tOUT") ed.outdent(); else if (v === "\tDONE") ed.view.contentDOM.blur();
      else if (v === "\tUNDO") ed.undo(); else if (v === "\tREDO") ed.redo(); else if (v === "\tBLOCKS") openBlocks(); else if (v === "\tFIND") ed.find();
      else if (v === '""') { ed.view.dispatch(ed.view.state.replaceSelection('""')); var p = ed.view.state.selection.main.head; ed.view.dispatch({ selection: { anchor: p - 1 } }); ed.focus(); }
      else { ed.view.dispatch(ed.view.state.replaceSelection(v)); ed.focus(); if (/(::|\.|->)$/.test(v)) ed.cppComplete(); }
    });
  }

  /* ---------- Blocks (C++ shapes) ---------- */
  var BLOCKS = [
    { id: "main", title: "main: where a program starts", shape: "int main() { … }", t: "#include <iostream>\n\nint main() {\n\tstd::cout << \"${1:Hello!}\" << std::endl;\n\treturn 0;\n}" },
    { id: "for", title: "for loop: count 0, 1, 2 …", shape: "for (int i = 0; i < n; i++)", t: "for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t${3:std::cout << ${1:i} << \"\\n\";}\n}" },
    { id: "foreach", title: "for each item in a vector", shape: "for (auto& x : list)", t: "for (auto& ${1:x} : ${2:items}) {\n\t${3:std::cout << ${1:x} << \"\\n\";}\n}" },
    { id: "while", title: "while loop", shape: "while (cond) { … }", t: "while (${1:n < 5}) {\n\t${2:n++;}\n}" },
    { id: "if", title: "if / else", shape: "if (…) { … } else { … }", t: "if (${1:x > 3}) {\n\t${2:std::cout << \"big\\n\";}\n} else {\n\t${3:std::cout << \"small\\n\";}\n}" },
    { id: "ifelse", title: "if / else if / else", shape: "if … else if … else", t: "if (${1:x < 2}) {\n\t${2:std::cout << \"small\\n\";}\n} else if (${3:x < 9}) {\n\t${4:std::cout << \"medium\\n\";}\n} else {\n\t${5:std::cout << \"large\\n\";}\n}" },
    { id: "switch", title: "switch on a value", shape: "switch (day) { case …: }", t: "switch (${1:day}) {\n\tcase ${2:6}:\n\t\t${3:std::cout << \"weekend\\n\";}\n\t\tbreak;\n\tdefault:\n\t\t${4:std::cout << \"work day\\n\";}\n\t\tbreak;\n}" },
    { id: "function", title: "function that gives back a number", shape: "int add(int a, int b)", t: "int ${1:add}(int ${2:a}, int ${3:b}) {\n\treturn ${2:a} + ${3:b};\n}" },
    { id: "class", title: "class with a field and methods", shape: "class Dog { … };", t: "class ${1:Dog} {\npublic:\n\t${1:Dog}(std::string name) : name_(name) {}\n\tvoid ${2:bark}() const { std::cout << name_ << \" says woof!\\n\"; }\n\nprivate:\n\tstd::string name_;\n};" },
    { id: "struct", title: "struct (plain data)", shape: "struct Point { float x, y; };", t: "struct ${1:Point} {\n\t${2:float x = 0;}\n\t${3:float y = 0;}\n};" },
    { id: "vector", title: "vector: make, add, print", shape: "std::vector<int> v", t: "std::vector<int> ${1:scores} = {${2:4, 7}};\n${1:scores}.push_back(${3:9});\nfor (int s : ${1:scores}) std::cout << s << \" \";\nstd::cout << \"\\n\";" },
    { id: "map", title: "map: names to numbers", shape: "std::map<std::string, int>", t: "std::map<std::string, int> ${1:ages};\n${1:ages}[\"${2:Ada}\"] = ${3:36};\nfor (auto& [name, age] : ${1:ages}) std::cout << name << \" is \" << age << \"\\n\";" },
    { id: "try", title: "try / catch (console programs)", shape: "try { … } catch (…) { … }", t: "try {\n\t${1:int n = std::stoi(\"not a number\");}\n} catch (const std::exception& e) {\n\tstd::cout << \"${2:That was not a number.}\" << \"\\n\";\n}" },
    { id: "raylib", title: "raylib window loop (a game)", shape: "while (!WindowShouldClose())", t: "InitWindow(800, 450, \"${1:My Game}\");\nSetTargetFPS(60);\nwhile (!WindowShouldClose()) {\n\tBeginDrawing();\n\tClearBackground(${2:DARKBLUE});\n\tDrawText(\"${3:Hello!}\", 20, 20, 30, RAYWHITE);\n\tEndDrawing();\n}\nCloseWindow();", raylib: true }
  ];
  function insertBlock(id) {
    var b = BLOCKS.filter(function (x) { return x.id === id; })[0]; if (!b) return false;
    var ed = S.editor, txt = ed.view.state.doc.toString();
    var t = b.t;
    if (b.raylib && !/#\s*include\s*["<]raylib\.h[">]/.test(txt)) {
      if (!/\bmain\s*\(/.test(txt)) t = "#include \"raylib.h\"\n\nint main() {\n\t" + t.replace(/\n/g, "\n\t") + "\n\treturn 0;\n}";
      else { ed.view.dispatch({ changes: { from: 0, insert: "#include \"raylib.h\"\n" } }); }
    }
    ed.insertCppBlock(t);
    return true;
  }
  var badgeEl = null, cppData = null;
  // the C++ word list (raylib + std + keywords, ~157 KB) loads the first time a C++ file is opened, not with the page
  function loadCppData() {
    if (cppData) return cppData;
    cppData = fetch("data/epp-studio/cpp.json").then(function (r) { return r.json(); }).then(function (d) { if (window.EppCM && EppCM.setCppData) EppCM.setCppData(d); }).catch(function () { cppData = null; });
    return cppData;
  }
  function openBlocks() {
    if (!isActive()) return false;
    $("esBlkList").innerHTML = BLOCKS.map(function (b) { return '<button type="button" class="es-ex es-blk-cpp" data-b="' + b.id + '"><b>' + esc(b.title) + "</b><code>" + esc(b.shape) + "</code></button>"; }).join("");
    S.sheetOpen("esBlkSheet");
    return true;
  }

  /* ---------- examples ---------- */
  var EXP = null;
  function examples() {
    if (!EXP) EXP = fetch("data/epp-studio/cpp_examples.json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return EXP;
  }
  function setCppProject(list, title) {
    S.syncActive();
    var keep = S.fileList().filter(function (f) { return !isCppName(f.name); });
    S.setFiles(keep.concat(list));
    var i = S.files().findIndex(function (f) { return isCppName(f.name) && /^main\./.test(f.name); });
    if (i < 0) i = S.files().findIndex(function (f) { return isCppName(f.name); });
    if (i >= 0) S.openTab(i);
    lastErrors = {};
  }
  function loadExample(it) {
    setCppProject(it.files || [{ name: "main.cpp", text: it.code }]);
    S.toast("Loaded: " + it.title + " — press Run");
    S.conClear();
    S.conNote(it.raylib ? "C++ with raylib: Run builds it with Clang in this browser, then it plays on the canvas." : "C++: Run builds it with Clang in this browser and runs it here.", "dim");
  }

  /* ---------- English++ -> "Open the C++ in C++ mode" ---------- */
  function openFromEnglish() {
    var M = S.engine();
    if (!M) { S.toast("The engine is not ready yet."); return; }
    S.syncActive();
    var main = S.fileList()[0].text, cpp = "";
    try { cpp = M.cpp(main) || ""; } catch (e) { cpp = ""; }
    if (!cpp || /^\/\/ (line \d+:|The C\+\+ View (is|stopped|is made)|C\+\+ View:)/.test(cpp)) {
      var why = /^\/\/ C\+\+ View: (.*)/.exec(cpp);
      S.toast(why ? "No complete C++ View for this program: " + why[1].replace(/ is not in the Web Studio's C\+\+ View yet\.?$/, " can't be written as C++ here yet") + "." : "This program has no complete C++ View yet — fix its red lines first.");
      return;
    }
    var name = "from_english.cpp";
    var files = S.files(), i = files.findIndex(function (f) { return f.name === name; });
    if (i >= 0 && !confirm("Replace " + name + " with the C++ of main.epp?")) return;
    var list = S.fileList();
    if (i >= 0) list[i].text = cpp; else list.push({ name: name, text: cpp });
    S.setFiles(list);
    S.openTab(S.files().findIndex(function (f) { return f.name === name; }));
    S.toast("Opened the C++ as " + name + " — edit it, then Run");
  }

  /* ---------- plain words for the most common Clang messages ---------- */
  function plain(msg) {
    var m;
    if ((m = /^expected ';'/.exec(msg))) return "a ; is missing — the line before this point needs to end with ;";
    if ((m = /^use of undeclared identifier '([^']+)'/.exec(msg))) return m[1] + " is not made (declared) anywhere yet — check the spelling, or add the #include it comes from";
    if ((m = /^unknown type name '([^']+)'/.exec(msg))) return m[1] + " is not a type Clang knows here — check the spelling or the #include";
    if (/^expected '\}'/.test(msg)) return "a } is missing — some { is never closed";
    if (/^extraneous closing brace/.test(msg)) return "there is one } too many";
    if (/^expected '\)'/.test(msg)) return "a ) is missing";
    if (/^expected expression/.test(msg)) return "something is missing here (a value or a name)";
    if (/^no matching function for call to/.test(msg)) return "this call does not match the function: the number or the kind of values is wrong";
    if (/^cannot use 'try' with exceptions disabled|^cannot use 'throw' with exceptions disabled/.test(msg)) return "try / throw / catch work in console programs, but not in raylib programs here (raylib programs are built without exceptions)";
    if ((m = /^'([^']+)' file not found/.exec(msg))) return m[1] + " is not a file or library the Studio has";
    if (/^no member named '([^']+)'/.test(msg)) return "that name is not part of this type or struct — check the spelling";
    if (/cannot initialize|cannot convert|no viable conversion/.test(msg)) return "the value is the wrong kind for this place";
    if (/^undefined symbol: (.*)|link: undefined symbol: (.*)/.test(msg)) return "a function is used but never written (defined) — check its name, or add its body";
    return "";
  }

  /* ---------- Run ---------- */
  function loadCpp() {
    if (CPP) return Promise.resolve(CPP);
    return import(new URL("fullbuild/cpp/cppbuild.js", document.baseURI).href).then(function (m) { CPP = m.EppCpp; return CPP; });
  }
  var cppCanvas = null;
  function canvasEl() {
    if (!cppCanvas) {
      cppCanvas = document.createElement("canvas"); cppCanvas.id = "esCppCanvas"; cppCanvas.tabIndex = 0; cppCanvas.setAttribute("aria-label", "C++ game window");
      cppCanvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      $("esCanvasBox").appendChild(cppCanvas);
    }
    return cppCanvas;
  }
  function showErrors(errors, files) {
    lastErrors = {};
    var main = files[0] ? files[0].name : "main.cpp";
    errors.forEach(function (e) { var n = e.file && files.some(function (f) { return f.name === e.file; }) ? e.file : (e.file ? null : main); if (!n || !e.line) return; (lastErrors[n] = lastErrors[n] || []).push(e); });
    var all = S.files();
    all.forEach(function (f, i) {
      if (!isCppName(f.name)) return;
      var errs = lastErrors[f.name] || [];
      if (i === S.active()) S.editor.setCppDiagnostics(errs);
      else if (f.state && S.editor.diagnoseState) f.state = S.editor.diagnoseState(f.state, errs);
    });
    errors.slice(0, 14).forEach(function (e) {
      var where = (e.file || "") + (e.line ? " line " + e.line + (e.column ? ":" + e.column : "") : "");
      var p = plain(e.message);
      var row = document.createElement("button"); row.type = "button"; row.className = "es-cpp-err";
      row.innerHTML = (where ? "<b>" + esc(where.trim()) + "</b> " : "") + esc(e.message) + (p ? '<span class="es-cpp-plain">' + esc(p) + "</span>" : "");
      if (e.line) row.addEventListener("click", function () { var i = S.files().findIndex(function (f) { return f.name === (e.file && lastErrors[e.file] ? e.file : main); }); if (i >= 0) { if (i !== S.active()) S.openTab(i); S.editor.goToLine(e.line); } });
      S.con().appendChild(row);
    });
    var first = errors.filter(function (e) { return e.line; })[0];
    if (first) { var fi = S.files().findIndex(function (f) { return f.name === (first.file && lastErrors[first.file] ? first.file : main); }); if (fi >= 0 && fi !== S.active()) S.openTab(fi); try { var ln = S.editor.view.state.doc.line(Math.max(1, Math.min(S.editor.view.state.doc.lines, first.line))); S.editor.view.dispatch({ selection: { anchor: ln.from }, scrollIntoView: true }); } catch (er) {} }
  }
  var busy = false, warmT = 0, WARM_MS = 120000;
  async function run() {
    if (busy || S.running()) return;
    var files = cppFiles();
    if (!files.some(function (f) { return /\.(cpp|cc|cxx|c\+\+)$/i.test(f.name); })) { S.toast("Add a .cpp file to build."); return; }
    var map = {}; files.forEach(function (f) { map[f.name] = f.text; });
    var raylib = Object.keys(map).some(function (k) { return /#\s*include\s*[<"](raylib|raymath|rlgl|rcamera)\.h[>"]/.test(map[k]); });
    if (!S.load("fullbuild-ok") && !confirm("C++ Run downloads the real Clang compiler once (about 37 MB" + (raylib ? ", plus about 5 MB for raylib" : "") + ") and keeps it on this device. While it builds it needs a lot of memory. Go ahead?")) return;
    S.store("fullbuild-ok", "1");
    var reads = Object.keys(map).some(function (k) { return /\b(std::)?(cin|getline|scanf|getchar|fgets)\b/.test(map[k]); });
    var stdin = "";
    S.showPane("console"); S.conClear();
    if (reads && !raylib) {
      var ans = await S.readLine("This program reads input. Type all of it first — separate lines with |");
      if (ans == null) return;
      stdin = ans.split("|").map(function (x) { return x.trim(); }).join("\n") + "\n";
    }
    busy = true; S.setBusy(true);
    S.conNote("C++: " + files.map(function (f) { return f.name; }).join(", ") + " → Clang 22 → WebAssembly" + (raylib ? " → raylib canvas" : ""), "");
    var t0 = performance.now(), lastPct = -1;
    try {
      var cpp = await loadCpp();
      clearTimeout(warmT);
      var r = await cpp.build(map, { keepWarm: true, onProgress: function (ph, a, b) {
        if (ph === "download" && b) { var pc = Math.floor(a * 100 / b); if (pc !== lastPct && pc % 10 === 0) { lastPct = pc; S.status("Clang " + pc + "%", "run"); } }
        else if (/^download-/.test(ph)) S.status("raylib download…", "run");
        else if (ph === "compile") S.status("Compiling…", "run");
        else if (ph === "asyncify") S.status("Preparing the game…", "run");
      } });
      if (!r.ok) {
        S.conNote("Clang found " + (r.errors || []).length + " problem" + ((r.errors || []).length === 1 ? "" : "s") + " (" + Math.round(r.totalMs || 0) + " ms):", "bad");
        showErrors(r.errors || [], files);
        return;
      }
      showErrors([], files);
      (r.warnings || []).slice(0, 4).forEach(function (w) { S.conWrite((w.file ? w.file + " " : "") + "line " + w.line + ": warning: " + w.message + "\n", "err"); });
      S.conNote("Built by Clang in " + (r.totalMs / 1000).toFixed(1) + " s · " + Math.round(r.wasm.byteLength / 1024) + " KB of wasm. Running:", "ok");
      window.EppCppLast = { totalMs: r.totalMs, stats: r.stats, bytes: r.wasm.byteLength, raylib: r.raylib };
      if (r.raylib) await runRaylib(r.wasm, t0);
      else await runConsole(r.wasm, stdin, t0);
    } catch (e) {
      S.conNote("C++ Run stopped: " + (e && e.message || e), "bad");
    } finally {
      // keep Clang loaded for 2 minutes so the next Run is quick; then give the memory back
      clearTimeout(warmT); warmT = setTimeout(function () { try { if (CPP && !busy) CPP.release(); } catch (e) {} }, WARM_MS);
      busy = false; cur = null; S.setBusy(false);
    }
  }
  async function runConsole(wasm, stdin, t0) {
    S.status("Running…", "run");
    cur = { kind: "console" };
    var code = await CPP.runConsole(wasm, { stdin: stdin, print: function (t) { S.conWrite(String(t), "out"); }, printErr: function (t) { S.conWrite(String(t), "err"); }, timeoutMs: 60000 });
    S.conNote("Finished" + (code ? " with exit code " + code : "") + " · " + Math.round(performance.now() - t0) + " ms total", code ? "bad" : "ok");
  }
  async function runRaylib(wasm, t0) {
    var cv = canvasEl();
    document.documentElement.classList.add("es-cpp-game");
    S.eppEvent({ type: "library", name: "raylib" });
    S.status("Running…", "run");
    var ctl = await CPP.runRaylib(wasm, {
      canvas: cv,
      print: function (t) { if (!/^INFO: /.test(t) || cur && cur.verbose) S.conWrite(String(t), "out"); },
      printErr: function (t) { S.conWrite(String(t), "err"); },
      onWindow: function (w) { S.eppEvent({ type: "window", width: w.width, height: w.height, title: w.title }); try { cv.focus({ preventScroll: true }); } catch (e) {} },
      onFullscreen: function (on) { var app = $("esApp"); if (app.classList.contains("canvas-full") !== on) $("esFull").click(); }
    });
    cur = { kind: "raylib", ctl: ctl };
    window.EppCppGame = ctl;
    var r = await ctl.done;
    document.documentElement.classList.remove("es-cpp-game");
    $("esApp").classList.remove("game-on");
    var fps = r.frames && r.ms ? (r.frames * 1000 / r.ms).toFixed(0) : "0";
    S.conNote("Game closed" + (r.code ? " with exit code " + r.code : "") + " · " + r.frames + " frames, about " + fps + " FPS", r.code ? "bad" : "ok");
  }
  function stop() {
    if (!cur) { if (busy && CPP) { CPP.release(); return true; } return false; }   // stopping during a build cancels it
    if (cur.kind === "raylib" && cur.ctl) cur.ctl.stop();
    else if (cur.kind === "console" && CPP) CPP.stopConsole();
    return true;
  }
  function handlesRun() { return isActive(); }

  function outline() {
    if (!isActive()) return false;
    var o = S.editor.cppOutline();
    $("esOutList").innerHTML = o.length ? o.map(function (n) { return '<button type="button" class="es-ex es-outl" data-l="' + n.line + '"><code>' + esc(n.name) + "</code><span>" + esc(n.kind) + " · line " + n.line + "</span></button>"; }).join("")
      : '<p class="es-dim">No functions or classes in this file yet. Blocks has a function and a class.</p>';
    S.sheetOpen("esOutSheet");
    return true;
  }
  function newProgram() {
    if (!isActive()) return false;
    if (S.editor.getText().trim() && !confirm("Start a new C++ program? (Save first if you want to keep this one.)")) return true;
    setCppProject([{ name: "main.cpp", text: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello!\" << std::endl;\n    return 0;\n}\n" }]);
    return true;
  }

  function init(internals) {
    S = internals;
    var badge = badgeEl = document.createElement("span"); badge.id = "esLangBadge"; badge.className = "es-lang-badge"; badge.textContent = "English++";
    badge.hidden = true;
    $("esFiles").appendChild(badge);
    // renderTabs() rewrites the tab row; put the badge back at its end
    new MutationObserver(function () { if (badge.parentNode !== $("esFiles")) { $("esFiles").appendChild(badge); onTab(); } }).observe($("esFiles"), { childList: true });
    // the C++ pane: open the C++ View as an editable, runnable C++ file
    var lab = document.querySelector(".es-cpp-label");
    if (lab) { var b = document.createElement("button"); b.type = "button"; b.className = "es-btn es-sm es-cpp-open"; b.id = "esCppOpen"; b.textContent = "Open the C++ in C++ mode"; b.addEventListener("click", openFromEnglish); lab.appendChild(b); }
    $("esBlkList").addEventListener("click", function (e) {
      var b = e.target.closest(".es-blk-cpp"); if (!b) return;
      e.stopImmediatePropagation(); S.sheetClose("esBlkSheet"); insertBlock(b.dataset.b); S.saveDraft();
      S.toast(S.touch() ? "Tap Tab to jump to the next blank" : "Tab jumps to the next blank");
    }, true);
    onTab();
  }
  window.EppCppMode = { init: init, onTab: onTab, isActive: isActive, isCppName: isCppName, run: run, stop: stop, handlesRun: handlesRun, openBlocks: openBlocks, outline: outline,
    examples: examples, loadExample: loadExample, openFromEnglish: openFromEnglish, newProgram: newProgram, blocks: BLOCKS, insertBlock: insertBlock, plain: plain,
    busy: function () { return busy; }, current: function () { return cur; } };
})();
