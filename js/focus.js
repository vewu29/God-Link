"use strict";
/* ================= LOOP 52 · GAPS — FOCUS THAT SURVIVES A SWAP ====
   The first pass fixed the tab order; this one fixes the places
   where a swap still ate the focus outright:
   1. The two target lines carry role="button" (so the drill
      line can live in their label for screen readers) but no
      way to press them from a keyboard. They take a tab stop
      now, and Enter/Space does exactly what a tap does —
      lands in the typing box. The Vault line is re-stamped
      by an observer every time the Vault re-renders it.
   2. The Library reader opened and closed the way the Sandbox
      drill used to: the card that opened it hid with focus
      still on it, and the Back button hid itself the same
      way, so ears and keys fell to the top of the page both
      times. An observer on the reader now lands focus on the
      reader as it opens (only when focus was actually lost)
      and hands it back to the card that opened the book.
   3. Every Vault step re-renders the room, destroying the
      control that was pressed: opening a pack, stepping back
      from a drill, stepping back to the packs. A capture-phase
      listener notes where the learner was headed before the
      render and lands focus on the matching control in the
      new room — the drill row they just left, the pack they
      just left, the drill list's back button. Drill openings
      already land in the typing box and are left alone.
   4. The three overlays (boot, ceremony, certificate) move
      focus in and give it back, but Tab could still wander
      out the back into the covered page. While one is up,
      Tab now cycles inside it, topmost first — the same
      ladder the Escape key already climbs.
   5. Closing the music bubble with Escape while focus sat
      in the panel stranded it in a display:none room; it
      returns to the bubble's toggle instead.
   Announcements, storage, datasets, drill rules and music
   are untouched; every hook is guarded and delegated. */
(function keyboardFocusGaps() {
  var $ = function (id) { return document.getElementById(id); };
  function land(el) {
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (err) {} }
  }
  function lostFocus() {
    var a = document.activeElement;
    return !a || a === document.body || a === document.documentElement;
  }

  /* ---------- 1 · the target lines are buttons, truly ---------- */
  var targetLine = $("targetLine");
  if (targetLine) targetLine.setAttribute("tabindex", "0");
  var vaultMain = $("vaultMain");
  function stampVaultTarget() {
    var vt = $("vaultTarget");
    if (vt && !vt.hasAttribute("tabindex")) vt.setAttribute("tabindex", "0");
  }
  if (vaultMain && window.MutationObserver) {
    new MutationObserver(stampVaultTarget).observe(vaultMain, { childList: true, subtree: true });
  }
  stampVaultTarget();
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    var t = e.target;
    if (!t || !t.id) return;
    if (t.id === "targetLine") { e.preventDefault(); land($("typeInput")); }
    else if (t.id === "vaultTarget") { e.preventDefault(); land($("vaultInput")); }
  });

  /* ---------- 2 · the Library reader keeps its focus ---------- */
  var libReader = $("libReader"), libHome = $("libHome"), lastLibCard = null;
  document.addEventListener("focusin", function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains("lib-card")) lastLibCard = t;
  });
  if (libReader && window.MutationObserver) {
    new MutationObserver(function () {
      if (!libReader.classList.contains("hidden")) {
        /* Opened: land on the reader only when the swap
           stranded focus — on the body, or on a card the
           Library home just hid. A page turn never toggles
           the class, so turns never steal focus. */
        var a = document.activeElement;
        if (lostFocus() || (a && libHome && libHome.contains(a))) land(libReader);
      } else {
        /* Closed: hand focus back to the card that opened
           the book, when it is still on the shelf. */
        if (lastLibCard && document.contains(lastLibCard) && lastLibCard.getClientRects().length) land(lastLibCard);
        else if (lostFocus()) land($("libraryView"));
      }
    }).observe(libReader, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---------- 3 · Vault steps land where they were headed ---------- */
  if (vaultMain) {
    var vaultIntent = null;
    vaultMain.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      vaultIntent = null;
      if (t.closest("#vaultBackPack")) {
        var pill = vaultMain.querySelector(".session-pill");
        var m = pill ? /Drill (\d+)/.exec(pill.textContent || "") : null;
        vaultIntent = m ? '[data-drill="' + (parseInt(m[1], 10) - 1) + '"]' : "#vaultBackPacks";
      } else if (t.closest("#vaultBackPacks")) {
        var chip = vaultMain.querySelector(".session-chip");
        var n = chip ? parseInt(chip.textContent, 10) : NaN;
        vaultIntent = isNaN(n) ? "#vaultSearch" : '[data-pack="' + (n - 1) + '"]';
      } else if (t.closest("[data-pack]") || t.closest("[data-mappack]")) {
        vaultIntent = "#vaultBackPacks";
      }
      if (vaultIntent) {
        var want = vaultIntent; vaultIntent = null;
        setTimeout(function () {
          var el = vaultMain.querySelector(want);
          if (!el && want.indexOf("data-pack") > -1) el = vaultMain.querySelector(want.replace("data-pack", "data-mappack"));
          if (!el) el = vaultMain.querySelector("#vaultBackPacks, #vaultSearch, [data-drill]");
          land(el);
        }, 0);
      }
    }, true);
  }

  /* ---------- 4 · Tab stays inside the overlay that is up ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var layers = [$("certOverlay"), $("ceremony"), $("bootOverlay")], top = null, i;
    for (i = 0; i < layers.length; i++) {
      if (layers[i] && !layers[i].classList.contains("hidden") && layers[i].getClientRects().length) { top = layers[i]; break; }
    }
    if (!top) return;
    var focusables = Array.prototype.filter.call(
      top.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]'),
      function (el) {
        if (el.disabled || !el.getClientRects().length) return false;
        /* Loop 60: a rect is not visibility — a ceremony step
           still waiting for its reveal keeps its layout box
           (visibility:hidden) but must not take Tab yet. */
        var cs = window.getComputedStyle ? getComputedStyle(el) : null;
        return !cs || cs.visibility !== "hidden";
      }
    );
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    var a = document.activeElement, inside = a && top.contains(a);
    if (e.shiftKey && (!inside || a === first)) { e.preventDefault(); land(last); }
    else if (!e.shiftKey && (!inside || a === last)) { e.preventDefault(); land(first); }
  });

  /* ---------- 5 · the bubble hands its focus back ---------- */
  var dock = $("bubbleDock"), bubbleToggle = $("bubbleToggle"), bubblePanel = $("bubblePanel");
  if (dock && bubbleToggle && bubblePanel) {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      /* The bubble's own ladder (an earlier listener) has
         already closed the dock by the time this runs. */
      if (!dock.classList.contains("open") && bubblePanel.contains(document.activeElement)) land(bubbleToggle);
    });
    document.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("#bubbleToggle") &&
          !dock.classList.contains("open") && bubblePanel.contains(document.activeElement)) land(bubbleToggle);
    });
  }
})();
