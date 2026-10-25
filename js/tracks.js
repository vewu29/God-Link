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

  window.cbRegisterTrack = function (id, factory) {
    if (id === window.__track && !window.CB_T) window.CB_T = factory();
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
