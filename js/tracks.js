"use strict";
/* ================= TRACKS — the registry of everything Code Block teaches =================
   One list names every track: its group, its words, and the storage keys
   its progress lives under. The three original tracks keep the exact keys
   they always used, so progress saved before the registry existed is
   still found. This file runs first: it decides the active track from
   the saved choice ("code-block-lang-v1"; no key means C++), sets the
   flags the rest of the app reads (__track, __isCS, __isDrive, CB_META),
   and loads ONLY the active track's data file — a learner on Python never
   downloads the Unreal library. In the single-file bundle every track is
   already inline (__cbBundled), so nothing is fetched.

   A track data file registers itself:
     cbRegisterTrack("python", function () { return { blocks: [...], ... }; });
   The function runs only for the active track, so bundled tracks that
   are not in use cost a parse, not a build. */
(function () {
  var GROUPS = [
    { id: "lang", name: "Programming languages" },
    { id: "engine", name: "Game engines" },
    { id: "life", name: "Road & life skills" }
  ];
  /* blocks = drill blocks in the track (the picker shows progress
     without loading the track). badge = the short mark on its tile. */
  var LIST = [
    { id: "cpp", name: "C++", badge: "C++", group: "lang", color: "#2563eb", blocks: 30,
      blurb: "Fast, powerful, everywhere: games, engines, browsers and devices.",
      file: "main.cpp", run: "g++ main.cpp -o app && ./app", comment: "//", vaultFile: "vault.cpp",
      storeKey: "code-block-progress-v1", profileProg: "progress", profileVault: "vault", bookKey: "code-block-book-v1" },
    { id: "cs", name: "C#", badge: "C#", group: "lang", color: "#7c3aed", blocks: 30, src: "tracks/cs.js",
      blurb: "Apps, tools and Unity games on .NET — friendly, strict and fast.",
      file: "Program.cs", run: "dotnet run", comment: "//", vaultFile: "Vault.cs",
      storeKey: "code-block-progress-cs-v1", profileProg: "progressCS", profileVault: "vaultCS", bookKey: "code-block-book-cs-v1" },
    { id: "drive", name: "Minnesota Drive", badge: "MN", group: "life", color: "#0f766e", blocks: 24, src: "tracks/drive.js",
      blurb: "Signs, right-of-way and safe driving for the Minnesota permit test.",
      file: "road-rules.txt", run: "", comment: "★", vaultFile: "road-vault.txt",
      storeKey: "code-block-progress-drive-v1", profileProg: "progressDrive", profileVault: "vaultDrive", bookKey: "code-block-book-drive-v1" }
  ];
  /* New tracks follow one naming pattern for their keys. */
  function addTrack(meta) {
    meta.storeKey = meta.storeKey || "code-block-progress-" + meta.id + "-v1";
    meta.profileProg = meta.profileProg || "progress_" + meta.id;
    meta.profileVault = meta.profileVault || "vault_" + meta.id;
    meta.bookKey = meta.bookKey || "code-block-book-" + meta.id + "-v1";
    meta.src = meta.src || "tracks/" + meta.id + ".js";
    LIST.push(meta);
  }
  window.cbAddTrackMeta = addTrack;
  addTrack({ id: "python", name: "Python", badge: "Py", group: "lang", color: "#3572a5", blocks: 30,
    blurb: "The friendliest first language: clear code for data, automation, AI and the web.",
    keywords: "beginner data science ai machine learning automation scripting",
    file: "main.py", run: "python3 main.py", comment: "#", vaultFile: "vault.py", varPrefix: "" });
  addTrack({ id: "javascript", name: "JavaScript", badge: "JS", group: "lang", color: "#8a6d00", blocks: 30,
    blurb: "The language of the web: interactive pages, apps, servers with Node.js.",
    keywords: "web browser website frontend node react js",
    file: "main.js", run: "node main.js", comment: "//", vaultFile: "vault.js", varPrefix: "" });
  addTrack({ id: "java", name: "Java", badge: "Java", group: "lang", color: "#8a5a12", blocks: 30,
    blurb: "Android apps, big business systems and Minecraft mods — typed, fast and everywhere.",
    keywords: "android minecraft enterprise jvm oop backend",
    file: "Main.java", run: "java Main.java", comment: "//", vaultFile: "Vault.java", varPrefix: "int " });
  addTrack({ id: "typescript", name: "TypeScript", badge: "TS", group: "lang", color: "#2f74c0", blocks: 30,
    blurb: "JavaScript with types: catch bugs before your code runs, in apps big and small.",
    keywords: "web typed javascript react angular node frontend ts",
    file: "main.ts", run: "npx tsc && node main.js", comment: "//", vaultFile: "vault.ts", varPrefix: "" });
  addTrack({ id: "unity", name: "Unity", badge: "Unity", group: "engine", color: "#1f2937", blocks: 30,
    blurb: "Make 2D and 3D games with Unity and C#: scripts, physics, input, UI and more.",
    keywords: "game engine games 3d 2d c# csharp unity3d gamedev",
    file: "Player.cs", run: "\u25B6 Play mode · Console", comment: "//", vaultFile: "Vault.cs", varPrefix: "" });
  addTrack({ id: "unreal", name: "Unreal Engine", badge: "UE5", group: "engine", color: "#0e0e10", blocks: 30,
    blurb: "Build Unreal Engine 5 games in C++: Actors, components, input, Blueprints and more.",
    keywords: "game engine games 3d c++ cpp unreal ue5 epic gamedev blueprints",
    file: "MyActor.cpp", run: "\u25B6 Play in Editor · Output Log", comment: "//", vaultFile: "Vault.cpp", varPrefix: "" });
  window.CB_TRACK_GROUPS = GROUPS;
  window.CB_TRACK_LIST = LIST;
  window.cbTrackMeta = function (id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; };

  /* Progress counting, shared by the profile room, the boot card and the
     track picker: a block counts once it holds the full eight reps. */
  window.cbCountProg = function (prog) {
    if (!prog || typeof prog !== "object" || !prog.reps || typeof prog.reps !== "object") return 0;
    var c = 0;
    for (var k in prog.reps) { var n = Number(prog.reps[k]); if (isFinite(n) && n >= 8) c++; }
    return c;
  };
  window.cbVaultLen = function (v) { return (v && typeof v === "object" && !Array.isArray(v)) ? Object.keys(v).length : 0; };
  /* One row per track a profile has touched (plus the active one), and
     the totals across all of them — the profile room and boot card read
     these instead of naming tracks one by one. */
  window.cbProfileRows = function (p) {
    var rows = [];
    LIST.forEach(function (m) {
      var mastered = window.cbCountProg(p && p[m.profileProg]), banked = window.cbVaultLen(p && p[m.profileVault]);
      if (mastered || banked || m.id === window.__track) rows.push({ meta: m, mastered: mastered, banked: banked });
    });
    return rows;
  };
  window.cbProfileTotals = function (p) {
    var t = { mastered: 0, banked: 0 };
    LIST.forEach(function (m) { t.mastered += window.cbCountProg(p && p[m.profileProg]); t.banked += window.cbVaultLen(p && p[m.profileVault]); });
    return t;
  };

  /* Track files stay readable by writing each chapter's deep dive next
     to the chapter itself ({ ..., deep: { more, ex, mistake } }) and
     leaving colours and shelf numbers out; this fills in the parallel
     arrays and the defaults the app's scripts expect. */
  var PALETTE = ["#53b1fd", "#38bdf8", "#22d3ee", "#2fc4e8", "#3ec6dd", "#4a90d9", "#6d9df5", "#7aa5f8", "#5ea8f7", "#4fb3ff",
    "#38a3f8", "#2fb9e8", "#3b8ef0", "#2f9be8", "#7fb2e5", "#6495ed", "#3f7de0", "#31b8c6"];
  function normalize(T) {
    function paint(list) { list.forEach(function (x, i) { if (!x.color) x.color = PALETTE[i % PALETTE.length]; }); }
    paint(T.blocks); paint(T.chapters); paint(T.shelves);
    T.shelves.forEach(function (s, i) { if (!s.num) s.num = "S" + (i + 1); });
    if (!T.deep) T.deep = T.chapters.map(function (c) { return c.deep || null; });
    if (!T.shelfDeep) T.shelfDeep = T.shelves.map(function (s) { return s.deep || null; });
    T.projects.forEach(function (p) { if (!p.file) p.file = window.CB_META.file; });
    return T;
  }
  window.cbRegisterTrack = function (id, factory) {
    if (id === window.__track && !window.CB_T) window.CB_T = normalize(factory());
  };
  /* Phone keyboards "improve" what you type: iOS Smart Punctuation turns
     " into “ ”, ' into ’, -- into —, ... into …, and some keyboards and
     dictation send a no-break space. None of that changes what the
     learner meant, so where the target line has the plain character, the
     look-alike is folded back to it — position by position, so a wrong
     letter is still a wrong letter. */
  window.cbFoldTyping = function (typed, target) {
    var out = "", t = 0;
    for (var k = 0; k < typed.length; k++) {
      var c = typed.charAt(k), want = target.charAt(t);
      if (c === "\u00A0" || c === "\u202F") c = " ";
      else if (want === '"' && /[\u201C\u201D\u201E\u201F\u2033\u00AB\u00BB]/.test(c)) c = '"';
      else if (want === "'" && /[\u2018\u2019\u201A\u201B\u2032]/.test(c)) c = "'";
      else if (c === "\u2014" && target.substr(t, 2) === "--") c = "--";
      else if (c === "\u2013" && want === "-") c = target.substr(t, 2) === "--" ? "--" : "-";
      else if (c === "\u2026" && target.substr(t, 3) === "...") c = "...";
      out += c; t += c.length;
    }
    return out;
  };
  /* The same fold for code typed with free whitespace (the PC), where
     positions are not one-to-one: only look-alikes of plain ASCII. */
  window.cbFoldCode = function (s) {
    return s.replace(/[\u00A0\u202F]/g, " ").replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"').replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").replace(/\u2014/g, "--").replace(/\u2026/g, "...");
  };
  /* A label written as a comment in the active track's language. */
  window.cbCommentLabel = function (text) {
    var c = window.CB_META.comment;
    return c === "<!--" ? "<!-- " + text + " -->" : c + " " + text;
  };
  window.cbSelectTrack = function (id) {
    try {
      if (id === "cpp") localStorage.removeItem("code-block-lang-v1");
      else localStorage.setItem("code-block-lang-v1", id);
    } catch (e) {}
    location.reload();
  };

  /* ---------- The active track ---------- */
  var saved = null;
  try { saved = localStorage.getItem("code-block-lang-v1"); } catch (e) {}
  var meta = (saved && window.cbTrackMeta(saved)) || LIST[0];
  window.__track = meta.id;
  window.__isCS = meta.id === "cs";
  window.__isDrive = meta.id === "drive";
  window.CB_META = meta;
  window.CB_T = null;
  /* Parser-blocking on purpose: the data must exist before the drill,
     library and vault scripts below declare their arrays from it. */
  if (meta.src && !window.__cbBundled) document.write('<script src="' + meta.src + '"><\/script>');
})();
