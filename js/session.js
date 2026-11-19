"use strict";
/* Code Block — the session: a reload lands where you were.
   One key, code-block-session-v1: {v, view, track, category, block,
   musicOn, lib:{kind,index,mode}|null, pc, scrollY}. It records
   only where the learner is — never progress, which already lives
   in the profile store, and never the other six keys, which this
   file only reads. Saving costs no new state of its own: the save
   reads the DOM and the globals the other scripts already keep.
   Restoring is tolerant by design: every value is checked against
   what actually exists, and anything missing or stale falls back
   to the hub, which is where the page already is. A broken session
   can never break the page — both directions are wrapped in
   try/catch. Loaded last, after every script it reads from. */
(function cbSession() {
  var KEY = "code-block-session-v1";
  var VIEWS = (window.roomOrder && window.roomOrder.length)
    ? window.roomOrder
    : ["sandbox", "library", "pc", "book", "vault", "profile"];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || typeof s !== "object" || s.v !== 1) return null;
      return s;
    } catch (e) { return null; }
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function el(id) { return document.getElementById(id); }
  function viewVisible(id) {
    var n = el(id);
    return !!n && !n.classList.contains("hidden");
  }

  function collect() {
    var s = {
      v: 1, view: "sandbox", track: null, category: null, block: -1,
      musicOn: false, lib: null, pc: -1, scrollY: 0
    };
    try {
      if (typeof window.currentRoom === "string" && VIEWS.indexOf(window.currentRoom) >= 0) {
        s.view = window.currentRoom;
      }
      try { s.track = localStorage.getItem("code-block-lang-v1"); } catch (e) {}
      try { s.category = localStorage.getItem("code-block-epp-category-v1"); } catch (e) {}
      if (s.view === "sandbox" && viewVisible("drillView") && typeof window.current === "number") {
        s.block = window.current;
      }
      if (typeof window.__musicIsOn === "function") {
        try { s.musicOn = !!window.__musicIsOn(); } catch (e) {}
      }
      if (s.view === "library" && viewVisible("libReader") && typeof window.currentChapter === "number") {
        s.lib = { kind: window.readerKind, index: window.currentChapter, mode: window.readerMode };
      }
      if (s.view === "pc" && typeof window.pcIndex === "number") s.pc = window.pcIndex;
      s.scrollY = Math.max(0, Math.round(window.scrollY || 0));
    } catch (e) {}
    return s;
  }

  window.cbSessionSave = function () { write(collect()); };

  /* Restore runs only for a returning visitor: the boot card is
     hidden by the inline script in index.html once boot-seen is
     set, and boot.js returns early then, so a first visit never
     reaches here — the boot card keeps its own way in. */
  function restore() {
    var overlay = el("bootOverlay");
    if (!overlay || !overlay.classList.contains("hidden")) return;
    var s = read();
    if (!s) return;
    try {
      var view = (typeof s.view === "string" && VIEWS.indexOf(s.view) >= 0) ? s.view : "sandbox";
      /* Track and category restore themselves: tracks.js reads
         code-block-lang-v1 and drill.js reads
         code-block-epp-category-v1 at load. The session only
         records them, so a track switch made elsewhere still wins. */
      if (typeof window.showView === "function") window.showView(view);
      /* Mirror the menu handlers' extra calls, so a restored room
         looks like an arrived-at room. */
      if (view === "book" && typeof window.cbBookRefit === "function") window.cbBookRefit();
      if (view === "vault" && typeof window.cbRenderVault === "function") window.cbRenderVault();
      if (view === "profile" && typeof window.cbRenderProfile === "function") window.cbRenderProfile();
      if (view === "sandbox" && typeof s.block === "number" && s.block >= 0 &&
          typeof window.BLOCKS !== "undefined" && window.BLOCKS && s.block < window.BLOCKS.length &&
          typeof window.openBlock === "function") {
        /* Safe before the world finishes building: the world
           handoff declines while its meshes do not exist yet, and
           openBlock then swaps at once, exactly as before. */
        window.openBlock(s.block);
      }
      if (view === "library" && s.lib && (s.lib.kind === "chapter" || s.lib.kind === "shelf") &&
          typeof s.lib.index === "number" && s.lib.index >= 0) {
        var books = s.lib.kind === "chapter" ? window.CHAPTERS : window.SHELFBOOKS;
        if (books && s.lib.index < books.length) {
          if (s.lib.kind === "chapter" && typeof window.openChapter === "function") {
            window.openChapter(s.lib.index);
          } else if (typeof window.openShelf === "function") {
            window.openShelf(s.lib.index);
          }
          if ((s.lib.mode === "text" || s.lib.mode === "picture") &&
              typeof window.setReaderMode === "function") {
            window.setReaderMode(s.lib.mode);
          }
        }
      }
      if (view === "pc" && typeof s.pc === "number" && s.pc >= 0 &&
          typeof window.PROJECTS !== "undefined" && window.PROJECTS && s.pc < window.PROJECTS.length) {
        var pick = el("pcPick");
        if (pick) {
          pick.value = String(s.pc);
          pick.dispatchEvent(new Event("change"));
        }
      }
      if (s.musicOn && typeof window.__musicIsOn === "function" && !window.__musicIsOn()) {
        /* The music button starts the engine, but a browser will
           ignore AudioContext.resume() until a real gesture lands;
           the first tap after the reload wakes it through
           cbAudioWake, and the loop schedules bars from there. */
        var btn = el("musicBtn");
        if (btn) btn.click();
      }
      if (typeof s.scrollY === "number" && s.scrollY > 0) {
        /* The drill's own swap scrolls at 380ms and focuses 60ms
           after it; wait past both so this final scroll wins. */
        setTimeout(function () { window.scrollTo(0, s.scrollY); }, 500);
      }
    } catch (e) {}
  }

  /* Save when the page is left or hidden — the two moments a reload
     always passes through. The view, drill, chapter, project and
     music hooks save sooner, so a crash keeps the last move too. */
  window.addEventListener("pagehide", function () { window.cbSessionSave(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) window.cbSessionSave();
  });

  restore();
})();
