"use strict";
/* ================= TRACK PICKER + TRACK WORDS =================
   The track switcher used to be three equal buttons (C++ · C# · Drive).
   With a registry of many tracks it becomes one compact bar — the track
   you are on, and a Change button — that opens a sheet listing every
   track by group, each tile showing your progress there. Choosing a
   track saves it and reloads, exactly as the three buttons did, so each
   track still boots with its own data, keys and world.

   For registry tracks (window.CB_T) this script also says the page's
   words in that track's voice — the jobs the C# and Drive files do for
   themselves with hand-written copy. */
(function cbTrackPicker() {
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var LIST = window.CB_TRACK_LIST, GROUPS = window.CB_TRACK_GROUPS, cur = window.CB_META;
  var CHEV = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-chev-down"/></svg>';

  /* Progress per track, read straight from storage: the active profile's
     save when someone is signed in, the guest save otherwise. */
  function progressFor(m) {
    try {
      var store = JSON.parse(localStorage.getItem("code-block-profiles-v1") || "null");
      var p = store && store.active && store.profiles && Object.prototype.hasOwnProperty.call(store.profiles, store.active) ? store.profiles[store.active] : null;
      if (p) return window.cbCountProg(p[m.profileProg]);
      return window.cbCountProg(JSON.parse(localStorage.getItem(m.storeKey) || "null"));
    } catch (e) { return 0; }
  }
  function badge(m) { return '<span class="track-badge" style="--tb:' + esc(m.color) + '" aria-hidden="true">' + esc(m.badge) + "</span>"; }

  var bar = document.createElement("div");
  bar.className = "lang-toggle track-bar";
  bar.innerHTML = '<button type="button" class="track-current" id="trackCurrent" aria-haspopup="dialog" aria-controls="trackSheet" aria-expanded="false">' +
    badge(cur) +
    '<span class="track-cur-text"><span class="track-kicker">Now learning</span><span class="track-cur-name">' + esc(cur.name) + "</span></span>" +
    '<span class="track-cur-change">' + LIST.length + " tracks " + CHEV + "</span></button>";
  var nav = document.querySelector(".wrap > .menu");
  nav.parentNode.insertBefore(bar, nav);

  var sheet = document.createElement("div");
  sheet.className = "track-sheet hidden";
  sheet.id = "trackSheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-labelledby", "trackSheetTitle");
  var groupsHTML = GROUPS.map(function (g) {
    var tiles = LIST.filter(function (m) { return m.group === g.id; }).map(function (m) {
      var done = progressFor(m), on = m.id === cur.id;
      return '<button type="button" class="track-tile' + (on ? " on" : "") + '" data-track-id="' + esc(m.id) + '" data-find="' + esc((m.name + " " + m.blurb + " " + (m.keywords || "")).toLowerCase()) + '"' + (on ? ' aria-current="true"' : "") + ">" +
        badge(m) +
        '<span class="track-tile-text"><span class="track-tile-name">' + esc(m.name) + (on ? ' <span class="track-here">· you are here</span>' : "") + '</span><span class="track-tile-blurb">' + esc(m.blurb) + "</span></span>" +
        '<span class="track-tile-prog" aria-label="' + done + " of " + m.blocks + ' blocks mastered">' + done + "/" + m.blocks + "</span></button>";
    }).join("");
    return tiles ? '<section class="track-group" aria-label="' + esc(g.name) + '"><h3>' + esc(g.name) + '</h3><div class="track-grid">' + tiles + "</div></section>" : "";
  }).join("");
  sheet.innerHTML = '<div class="track-sheet-card">' +
    '<div class="track-sheet-head"><h2 id="trackSheetTitle">Choose what to learn</h2>' +
    '<button type="button" class="track-close" id="trackClose" aria-label="Close the track list"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-x"/></svg></button></div>' +
    '<p class="track-sheet-sub">Every track is free, and each one keeps its own progress on this device. Switching never erases anything.</p>' +
    '<input type="search" class="track-search" id="trackSearch" placeholder="Find a track — try “game” or “web”" aria-label="Find a track" autocomplete="off" />' +
    groupsHTML +
    '<p class="prof-msg" id="trackNone" hidden>No track matches that yet.</p></div>';
  document.body.appendChild(sheet);

  var opener = $("trackCurrent"), lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    sheet.classList.remove("hidden");
    document.documentElement.classList.add("track-sheet-open");
    opener.setAttribute("aria-expanded", "true");
    var here = sheet.querySelector(".track-tile.on") || sheet.querySelector(".track-tile");
    setTimeout(function () { try { here.focus({ preventScroll: false }); } catch (e) { here.focus(); } }, 30);
  }
  function close() {
    sheet.classList.add("hidden");
    document.documentElement.classList.remove("track-sheet-open");
    opener.setAttribute("aria-expanded", "false");
    try { (lastFocus || opener).focus({ preventScroll: true }); } catch (e) { opener.focus(); }
  }
  opener.addEventListener("click", open);
  $("trackClose").addEventListener("click", close);
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) { close(); return; }
    var t = e.target.closest("[data-track-id]");
    if (!t) return;
    var id = t.getAttribute("data-track-id");
    if (id === cur.id) { close(); return; }
    t.classList.add("loading");
    t.querySelector(".track-tile-prog").textContent = "Opening…";
    window.cbSelectTrack(id);
  });
  /* The sheet owns its keys: Escape closes it (and only it), Tab cycles
     inside it, so focus never wanders into the page behind. */
  sheet.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = Array.prototype.filter.call(sheet.querySelectorAll("button, input"), function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  $("trackSearch").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase(), shown = 0;
    Array.prototype.forEach.call(sheet.querySelectorAll(".track-tile"), function (t) {
      var hit = !q || t.getAttribute("data-find").indexOf(q) >= 0;
      t.hidden = !hit; if (hit) shown++;
    });
    Array.prototype.forEach.call(sheet.querySelectorAll(".track-group"), function (g) {
      g.hidden = !g.querySelector(".track-tile:not([hidden])");
    });
    $("trackNone").hidden = shown > 0;
  });

  /* ---------- Registry tracks speak their own words ---------- */
  var T = window.CB_T;
  if (!T) return;
  var name = cur.name;
  function setText(sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; }
  function setHTML(sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; }
  var nB = T.blocks.length, nC = T.chapters.length, nS = T.shelves.length;
  setText(".mastery-label", name + " Mastery");
  /* Only the words after the live counter change: drill.js already
     holds #doneCount and keeps writing into it. */
  var mc = document.querySelector(".mastery-count");
  if (mc) { for (var n = 0; n < mc.childNodes.length; n++) { if (mc.childNodes[n].nodeType === 3 && mc.childNodes[n].nodeValue.indexOf("of 30") >= 0) mc.childNodes[n].nodeValue = " of " + nB + " blocks mastered"; } }
  setText(".music-note", "Chill generative music plays while you drill. Every block you master adds a new layer — finish all " + nB + " and it blooms into the full piece.");
  var world = $("world");
  if (world) world.setAttribute("aria-label", "3D top-down world of " + nB + " " + name + " blocks. Tap a block to open its drill, drag to look around, pinch or scroll to zoom, double-tap to reset the view.");
  setText("#masterpieceBanner h2", "The " + name + " Masterpiece");
  setText("#masterpieceBanner p", "All " + nB + " " + name + " blocks mastered. Every block in your world glows bright blue, and the music is playing the full arrangement. You built this — one repeated line at a time.");
  var hubH = document.querySelector("#hubView .list-head h2");
  if (hubH) hubH.textContent = "All " + nB + " blocks";
  setText("#hubChip", nB + " blocks");
  setText("#hubHint", "In learning order — tap any block to drill it.");
  setHTML("#sandboxView .source-note", esc(T.sandboxNote || ("Every " + name + " block is written in plain words for Code Block. Each block takes 8 perfect repetitions. Your " + name + " progress is saved separately from every other track.")));
  setText("#libraryView .lib-intro h2", "The " + name + " Library");
  setText("#libChip", nC + " chapters · " + nS + " shelves");
  setText("#libHint", "Tap a chapter — read it in Text, or watch it move in Picture mode.");
  setHTML("#libraryView .lib-intro p:not(.sec-hint)", "The " + esc(name) + " story, told in bright, simple words anyone can follow. Open a chapter, then read it two ways: <strong>Text</strong> tells you the idea in plain words, and <strong>Picture</strong> shows it moving. Below the chapters sit " + nS + " shelves that go further — reference guides for the days you write your own programs.");
  var heads = document.querySelectorAll("#libHome .shelf-head");
  var headWords = [
    ["Beyond the Basics — " + name + " Shelves", nS + " shelves for the next steps — each reads two ways, Text and Picture, just like a chapter. All of them are open to everyone."],
    ["The Glossary — " + T.glossary.length + " Words of " + name, "Every word you will meet, each in one plain sentence. Search it, or jump by letter."],
    ["Field Guide — " + T.field.length + " Tools", "Tools worth knowing in " + name + ", each with where it comes from and a line you can borrow."],
    ["Cheat Sheets — " + T.cheats.length + " Cards", "Pin-up cards for the shapes you will reach for every day."]
  ];
  Array.prototype.forEach.call(heads, function (h, i) {
    if (!headWords[i]) return;
    h.querySelector("h3").textContent = headWords[i][0];
    h.querySelector("p").textContent = headWords[i][1];
  });
  var gs = $("glossSearch");
  if (gs) gs.placeholder = "Search " + T.glossary.length + " " + name + " words…";
  var libNotes = document.querySelectorAll("#libraryView .source-note");
  if (libNotes[0]) libNotes[0].textContent = "Every chapter is written fresh in Code Block's own words. The code is real " + name + " — its key lines are the very lines you drill in the Sandbox.";
  if (libNotes[1]) libNotes[1].innerHTML = T.sourcesHTML || "";
  setText("#pcChip", T.projects.length + " projects");
  setHTML("#pcView .pc-intro p:not(.sec-hint)", "A friendly little computer. It hands you a " + esc(name) + " project — type along with the code, press <strong>Compile &amp; Run</strong>, and watch what it prints. Then change the numbers in the blue boxes and run it again to see what changes.");
  setHTML("#bookView .book-intro p:not(.sec-hint)", "Read any " + esc(name) + " book you own, right here in Code Block: open its PDF from your device and read it page by page, beside the Library.");
  setText("#vaultView .lib-intro h2", "The Vault — 10,000 " + name + " Drills");
  setHTML("#vaultView .lib-intro p:not(.sec-hint)", "The members-only drill vault, in " + esc(name) + ": <strong>100 themed packs of 100 drills each</strong>, built from hand-written patterns so every line is real " + esc(name) + ". Your " + esc(name) + " Vault progress saves under your profile, separate from every other track.");
  setText("#profileView .sec-hint", "Create a profile to unlock the Vault.");
  var foot = document.querySelectorAll(".wrap > .source-note");
  if (foot.length && T.sourcesHTML) foot[foot.length - 1].innerHTML = T.sourcesHTML;
})();
