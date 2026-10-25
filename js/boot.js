"use strict";
/* ================= LOOP 23 — BOOT MOMENT WIRING =================
   The arrival card in the markup shows once per device. This
   script personalizes it from state that already exists — the
   active profile's name, the mastered count for the current
   track, the next open block — and wires the way in: the
   primary button drops you straight into that block through
   the app's own showView/openBlock, the secondary just
   dismisses, and Escape or a backdrop tap does the same.
   Learners with progress also get a twelve-second courtesy
   fade; Loop 24's first-run restraint keeps brand-new
   learners (no profile, nothing mastered) free of any
   countdown — the card waits quietly until they choose.
   Dismissing is the only thing it ever saves (one flag, so
   it never shows twice). */
(function bootMoment() {
  var overlay = document.getElementById("bootOverlay");
  if (!overlay || overlay.classList.contains("hidden")) return;
  var go = document.getElementById("bootGo"), skip = document.getElementById("bootSkip");
  var title = document.getElementById("bootTitle"), line = document.getElementById("bootLine");
  var stats = document.getElementById("bootStats");
  var track = window.__isDrive ? "Drive" : window.__isCS ? "C#" : "C++";
  var total = (typeof BLOCKS !== "undefined" && BLOCKS) ? BLOCKS.length : 0;
  var goal = (typeof REPS_GOAL !== "undefined") ? REPS_GOAL : 8;
  var done = 0, i;
  try {
    if (typeof state !== "undefined" && state && state.reps) {
      for (i = 0; i < total; i++) if ((state.reps[i] || 0) >= goal) done++;
    }
  } catch (e) {}
  var profile = null;
  try { if (typeof cbProfile === "function") profile = cbProfile(); } catch (e) {}
  var open = -1;
  try { if (typeof firstOpen === "function") open = firstOpen(); } catch (e) {}
  var complete = total > 0 && done >= total;

  if (complete) {
    title.textContent = "Every block is lit";
    line.textContent = "You finished the " + track + " track — the full masterpiece, built one repeated line at a time. Come admire the world you made; the ceremony replays from the banner any time.";
    go.textContent = "Admire your world";
  } else if (profile || done > 0) {
    title.textContent = profile ? "Welcome back, " + profile.name : "Welcome back";
    line.textContent = "Your world kept your place: " + done + " of " + total + " " + track + " blocks mastered. The next one is one tap away — " + goal + " perfect reps and it lights up too.";
    if (open >= 0) go.textContent = "Continue — " + BLOCKS[open].name;
  } else {
    title.textContent = window.__isDrive ? "Learn the road, one rule at a time" : "One line at a time, until it’s yours";
    line.textContent = window.__isDrive
      ? "Code Block teaches Minnesota driving by repetition: pick a road block, type its rule eight perfect times, then face the practice test in the Test tab. The music grows with every block you master."
      : "Code Block teaches " + track + " by repetition: pick a block in the world, type its line eight perfect times, and watch it light up. The music grows with every block you master — finish them all and it becomes the masterpiece.";
    if (open >= 0) go.textContent = "Start — " + BLOCKS[open].name;
  }

  var banked = 0;
  try {
    if (profile && typeof cbVaultLen === "function") {
      banked = cbVaultLen(profile.vault) + cbVaultLen(profile.vaultCS) + cbVaultLen(profile.vaultDrive);
    }
  } catch (e) {}
  var chips = ['<span class="boot-stat"><strong>' + done + " / " + total + "</strong>&nbsp;blocks mastered</span>"];
  chips.push(profile
    ? '<span class="boot-stat"><strong>' + banked.toLocaleString() + "</strong>&nbsp;Vault drills banked</span>"
    : '<span class="boot-stat"><strong>3</strong>&nbsp;tracks — C++ · C# · Drive</span>');
  chips.push('<span class="boot-stat"><strong>' + goal + "</strong>&nbsp;perfect reps master a block</span>");
  stats.innerHTML = chips.join("");

  var gone = false, autoTimer = null;
  /* Loop 53 gap: under reduced motion the bye fade is stilled,
     so the dismiss hides at once rather than holding the card
     on screen for the fade's 420ms. */
  var bootReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  /* Loop 24 — first-run restraint: the courtesy countdown only
     exists for learners who already have a place to return to. */
  var hasPlace = !!(profile || done > 0);
  function armAuto() {
    if (!hasPlace) return;
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(function () { dismiss(false); }, 12000);
  }
  function onKey(e) { if (e.key === "Escape") dismiss(false); }
  function dismiss(into) {
    if (gone) return; gone = true;
    try { localStorage.setItem("code-block-boot-seen-v1", "1"); } catch (e) {}
    if (autoTimer) clearTimeout(autoTimer);
    document.removeEventListener("keydown", onKey, true);
    overlay.classList.add("bye");
    setTimeout(function () { overlay.classList.add("hidden"); overlay.classList.remove("bye"); }, bootReduced ? 0 : 420);
    if (into && open >= 0 && !complete) {
      try { if (typeof showView === "function") showView("sandbox"); } catch (e) {}
      try { if (typeof openBlock === "function") openBlock(open); } catch (e) {}
    } else {
      var m = document.getElementById("menuSandbox");
      if (m && document.activeElement && overlay.contains(document.activeElement)) m.focus();
    }
  }
  go.addEventListener("click", function () { dismiss(true); });
  skip.addEventListener("click", function () { dismiss(false); });
  overlay.addEventListener("pointerdown", function (e) {
    if (e.target === overlay) dismiss(false); else armAuto();
  });
  /* Loop 60: tabbing inside the card re-arms the courtesy
     countdown too, not just pointing at it — a keyboard or
     screen-reader learner gets the same 12 unhurried seconds
     after their last move as a pointer user does. */
  overlay.addEventListener("focusin", armAuto);
  document.addEventListener("keydown", onKey, true);
  armAuto();
  requestAnimationFrame(function () { if (!gone && go) go.focus(); });
})();
