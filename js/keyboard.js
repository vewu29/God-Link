"use strict";
/* ================= LOOP 52 — KEYBOARD & FOCUS =================
   Phase F's keyboard pass: the whole app usable without a
   mouse. Loops 7/28/50 already gave the drills their focus
   landings and returns, the world its camera keys, the reader
   its page turns and every overlay its Escape. What was left
   was the tab order itself: from the top of the page a
   keyboard met the track switcher, six menu pills, the music
   bubble and a card of controls before any content — and three
   of the app's button crowds charged full price per button:
   30 moods in each picker, 26 glossary letters, and the
   Vault's 100-cell pack map, a hundred tab stops to cross
   one room.
   This script fixes the order, not the look:
   1. A skip link (markup + CSS above) is the first tab stop;
      it hands focus to the room on screen — the drill or the
      reader when one is open, else the visible section —
      whose containers take a program-only tabindex here.
   2. The three crowds become roving groups: one tab stop per
      group, parked on the current item (the pressed mood, the
      chosen letter, the first pack in progress), with arrow
      keys walking the group — the pack map by its real row
      length, so it stays true at ten across and at five.
      Selection never changes: Enter, Space and clicks work
      exactly as before; the arrows only move the focus.
   3. The menu and the track switcher learn Left/Right/Home/
      End as a bonus, but keep every button in the tab order —
      six and three stops are a fair price for the main roads.
   Everything is delegated and guarded: groups rendered late
   (the pack map, the letters) are normalised by observers,
   focus landing anywhere in a group re-parks its stop there,
   and while the Library reader is open it keeps sole
   ownership of Left/Right (its Loop 6 page turns). No state,
   storage, dataset, drill rule or note of music changes. */
(function keyboardFocus() {
  var $ = function (id) { return document.getElementById(id); };
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function items(root, sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }

  /* ---------- 1 · the skip link ---------- */
  var roomIds = ["drillView", "libReader", "sandboxView", "libraryView", "pcView", "bookView", "vaultView", "profileView"];
  each(roomIds, function (id) {
    var el = $(id);
    if (el && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  });
  var skip = $("skipLink");
  if (skip) skip.addEventListener("click", function (e) {
    e.preventDefault();
    for (var i = 0; i < roomIds.length; i++) {
      var el = $(roomIds[i]);
      if (el && !el.classList.contains("hidden") && el.getClientRects().length) {
        try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
        window.scrollTo(0, 0);
        return;
      }
    }
  });

  /* ---------- 2 · roving groups ---------- */
  function setStop(list, el) { each(list, function (b) { b.tabIndex = (b === el) ? 0 : -1; }); }
  function currentOf(list) {
    var i;
    for (i = 0; i < list.length; i++) if (list[i].getAttribute("aria-pressed") === "true") return list[i];
    for (i = 0; i < list.length; i++) if (list[i].classList.contains("sel") || list[i].classList.contains("active")) return list[i];
    for (i = 0; i < list.length; i++) if (list[i].classList.contains("doing")) return list[i];
    return list[0];
  }
  function normalize(root, sel) {
    var list = items(root, sel);
    if (!list.length) return;
    var active = document.activeElement;
    var stop = (active && root.contains(active) && list.indexOf(active) >= 0) ? active : currentOf(list);
    setStop(list, stop);
  }
  var moodRoots = items(document, ".music-moods, .bubble-moods");
  var azRoot = $("glossAZ");
  function packRoot() { return document.querySelector(".pack-map"); }
  function normalizePack() {
    var pm = packRoot();
    if (!pm) return;
    if (!pm.getAttribute("role")) {
      pm.setAttribute("role", "group");
      pm.setAttribute("aria-label", "Pack map — 100 packs. Arrow keys move between packs; Enter opens the pack in focus.");
    }
    normalize(pm, ".pmap-cell");
  }
  function normalizeAll() {
    each(moodRoots, function (r) { normalize(r, ".mood-btn"); });
    if (azRoot) normalize(azRoot, "button");
    normalizePack();
  }
  normalizeAll();
  /* Groups rendered after this script runs (the pack map is
     rebuilt with the Vault, the letters with the Library) are
     normalised as they land; a mood picked in one picker
     re-parks the other picker's stop via its aria-pressed. */
  if (window.MutationObserver) {
    var vaultView = $("vaultView");
    if (vaultView) new MutationObserver(normalizePack).observe(vaultView, { childList: true, subtree: true });
    if (azRoot) new MutationObserver(function () { normalize(azRoot, "button"); }).observe(azRoot, { childList: true });
    each(moodRoots, function (r) {
      new MutationObserver(function () { normalize(r, ".mood-btn"); }).observe(r, { attributes: true, attributeFilter: ["aria-pressed"], subtree: true });
    });
  }
  /* Focus arriving in a group — by Tab, click or arrow —
     makes the focused button the group's stop, so the group
     is always left the way it was entered. */
  document.addEventListener("focusin", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.classList && t.classList.contains("pmap-cell")) {
      var pm = t.closest(".pack-map"); if (pm) setStop(items(pm, ".pmap-cell"), t);
    } else if (t.classList && t.classList.contains("mood-btn")) {
      var mr = t.closest(".music-moods, .bubble-moods"); if (mr) setStop(items(mr, ".mood-btn"), t);
    } else if (azRoot && t.tagName === "BUTTON" && azRoot.contains(t)) {
      setStop(items(azRoot, "button"), t);
    }
  });

  /* ---------- 3 · arrow-key walking ---------- */
  function move(list, from, delta, wrap) {
    var i = list.indexOf(from);
    if (i < 0 || !list.length) return;
    var n = i + delta;
    if (wrap) n = ((n % list.length) + list.length) % list.length;
    else n = Math.max(0, Math.min(list.length - 1, n));
    list[n].focus();
  }
  function rowLength(list) {
    if (!list.length) return 1;
    var top = list[0].offsetTop, n = 0;
    while (n < list.length && list[n].offsetTop === top) n++;
    return Math.max(1, n);
  }
  document.addEventListener("keydown", function (e) {
    var t = e.target, key = e.key;
    if (!t || !t.classList || e.altKey || e.ctrlKey || e.metaKey) return;
    /* While the reader is open it owns Left/Right outright
       (Loop 6's page turns) — no group may spend them. */
    var lr = $("libReader");
    if (lr && !lr.classList.contains("hidden") && (key === "ArrowLeft" || key === "ArrowRight")) return;
    var handled = true;
    if (t.classList.contains("pmap-cell")) {
      var pm = t.closest(".pack-map"); if (!pm) return;
      var cells = items(pm, ".pmap-cell"), cols = rowLength(cells);
      if (key === "ArrowRight") move(cells, t, 1, false);
      else if (key === "ArrowLeft") move(cells, t, -1, false);
      else if (key === "ArrowDown") move(cells, t, cols, false);
      else if (key === "ArrowUp") move(cells, t, -cols, false);
      else if (key === "PageDown") move(cells, t, cols * 3, false);
      else if (key === "PageUp") move(cells, t, -cols * 3, false);
      else if (key === "Home") cells[0].focus();
      else if (key === "End") cells[cells.length - 1].focus();
      else handled = false;
    } else if (t.classList.contains("mood-btn")) {
      var mr = t.closest(".music-moods, .bubble-moods"); if (!mr) return;
      var moods = items(mr, ".mood-btn");
      if (key === "ArrowRight" || key === "ArrowDown") move(moods, t, 1, true);
      else if (key === "ArrowLeft" || key === "ArrowUp") move(moods, t, -1, true);
      else if (key === "Home") moods[0].focus();
      else if (key === "End") moods[moods.length - 1].focus();
      else handled = false;
    } else if (azRoot && t.tagName === "BUTTON" && azRoot.contains(t)) {
      var letters = items(azRoot, "button");
      if (key === "ArrowRight" || key === "ArrowDown") move(letters, t, 1, true);
      else if (key === "ArrowLeft" || key === "ArrowUp") move(letters, t, -1, true);
      else if (key === "Home") letters[0].focus();
      else if (key === "End") letters[letters.length - 1].focus();
      else handled = false;
    } else if (t.classList.contains("menu-btn") || t.classList.contains("lang-btn")) {
      var sel = t.classList.contains("menu-btn") ? ".menu-btn" : ".lang-btn";
      var sibs = items(t.parentElement, sel);
      if (key === "ArrowRight") move(sibs, t, 1, true);
      else if (key === "ArrowLeft") move(sibs, t, -1, true);
      else if (key === "Home") sibs[0].focus();
      else if (key === "End") sibs[sibs.length - 1].focus();
      else handled = false;
    } else handled = false;
    if (handled) e.preventDefault();
  });
})();
