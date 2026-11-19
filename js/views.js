/* Code Block — the shell: menu, room switching, the app voice.
   Split from js/views.js (lines 1-128). Loads first of the three
   views files; the Library and PC parts below call only names this
   file defines, or names defined by the time the page runs. */
"use strict";
/* ================= MENU / VIEW SWITCHING ================= */
function $(id) { return document.getElementById(id); }
/* Loop 50 — the app's one voice: every announcement that is not
   already a focused control's own live region goes through
   cbAnnounce into #srStatus. It clears first and writes on a
   short timer, because a live region set to the SAME text twice
   in a row is silently swallowed by most screen readers — the
   clear-then-write makes repeat news ("Page 4 of 40" heard
   again after a detour) actually arrive. Exposed on window so
   the drill, PC, Book, and Vault scripts can all speak through
   the same throat. */
var srStatusEl = $("srStatus"), srSpeakTimer = 0;
function cbAnnounce(msg) {
  if (!srStatusEl || !msg) return;
  srStatusEl.textContent = "";
  clearTimeout(srSpeakTimer);
  srSpeakTimer = setTimeout(function () { srStatusEl.textContent = msg; }, 50);
}
window.cbAnnounce = cbAnnounce;
/* Loop 41 — the active track, exposed on the body so the
   surface structures can lean per mode (C++ / C# / Drive)
   from the same flags the mode scripts decide by. */
document.body.setAttribute("data-track", window.__track);
var views = { sandbox: $("sandboxView"), library: $("libraryView"), pc: $("pcView"), book: $("bookView"), vault: $("vaultView"), profile: $("profileView") };
var menuBtns = { sandbox: $("menuSandbox"), library: $("menuLibrary"), pc: $("menuPc"), book: $("menuBook"), vault: $("menuVault"), profile: $("menuProfile") };
/* Loop 45 — the building's floor plan: the six sections in
   corridor order (the menu's own order). showView compares
   where you are with where you are going and tags the
   incoming room so its arrival slides from the side you
   walked in from; a jump of 2+ rooms travels further. */
var roomOrder = ["sandbox", "library", "pc", "book", "vault", "profile"];
var roomNames = { sandbox: "Sandbox", library: "Library", pc: "PC", book: "My Book", vault: "The Vault", profile: "Profile" };
var currentRoom = "sandbox";
var travelReduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
var travelToken = 0;
function showView(name) {
  var step = roomOrder.indexOf(name) - roomOrder.indexOf(currentRoom);
  Object.keys(views).forEach(function (k) {
    views[k].classList.remove("travel-fwd", "travel-back", "travel-far");
  });
  if (step !== 0 && !(travelReduce && travelReduce.matches)) {
    views[name].classList.add(step > 0 ? "travel-fwd" : "travel-back");
    if (Math.abs(step) > 1) views[name].classList.add("travel-far");
    /* Visual upgrade — the room's grids rise in on arrival: the
       .arriving tag lets the first cards stagger in (see the
       riseIn rules at the end of css/polish.css), then comes off
       once the longest stagger has landed (330ms delay + 260ms
       rise = 590ms), so later re-renders (search, filters) never
       replay the entrance. */
    views[name].classList.add("arriving");
    var arrived = views[name], token = ++travelToken;
    setTimeout(function () {
      if (token === travelToken) arrived.classList.remove("travel-fwd", "travel-back", "travel-far", "arriving");
    }, 650);
  }
  currentRoom = name;
  Object.keys(views).forEach(function (k) {
    views[k].classList.toggle("hidden", k !== name);
    menuBtns[k].classList.toggle("active", k === name);
    if (k === name) menuBtns[k].setAttribute("aria-current", "page");
    else menuBtns[k].removeAttribute("aria-current");
  });
  if (name !== "library") stopStageMusic();
  /* Loop 54 — regression sweep: leaving the Library also retires
     any Picture-mode line-reveal timeouts still pending, so no
     timer fires later against a hidden reader. The reader's own
     back/mode paths already cleared them; the menu path didn't. */
  if (name !== "library" && typeof clearStageTimers === "function") clearStageTimers();
  if (name !== "pc") pcStop(true);
  /* Loop 68 — the member-shelf gate fires in openEntry, but the
     reader itself never re-checks: a member could open Shelf S5,
     walk to the Profile room, sign out (or delete the profile),
     and walk back to a Library still holding the members-only
     book open. Re-gate on arrival, the same way the Vault
     re-renders its lock on entry: a non-member arriving at a
     Library whose reader holds a member shelf gets the shelf
     home back, closed exactly the way the reader's own back
     button closes it. Page turns were already gated; this
     closes the one page that was already open. */
  if (name === "library" && readerKind === "shelf" && activeBooks[currentChapter] && activeBooks[currentChapter].member && !(window.cbIsMember && window.cbIsMember())) {
    clearStageTimers(); stopStageMusic();
    $("libReader").classList.add("hidden");
    $("libHome").classList.remove("hidden");
  }
  /* Loop 50 — a room change is seen by eyes (the travel slide)
     and by the menu's aria-current, but a screen reader sitting
     in the old room hears nothing move. Name the room arrived
     in — only on a real change, never on the boot call. */
  if (step !== 0) cbAnnounce(roomNames[name] + " section");
  window.scrollTo(0, 0);
  /* The session keeps where you are: arriving in a room saves it,
     so a reload lands back here instead of the hub. */
  if (window.cbSessionSave) window.cbSessionSave();
}
menuBtns.sandbox.addEventListener("click", function () { showView("sandbox"); });
menuBtns.library.addEventListener("click", function () { showView("library"); });
menuBtns.pc.addEventListener("click", function () { showView("pc"); });
menuBtns.book.addEventListener("click", function () { showView("book"); if (window.cbBookRefit) window.cbBookRefit(); });
menuBtns.vault.addEventListener("click", function () { showView("vault"); if (window.cbRenderVault) window.cbRenderVault(); });
menuBtns.profile.addEventListener("click", function () { showView("profile"); if (window.cbRenderProfile) window.cbRenderProfile(); });
/* Escape steps back out of a drill or a Library chapter — same as the
   on-screen back buttons, for keyboard users. Loop 60: one press
   closes one layer — while the certificate, the ceremony or the
   music bubble is up, the Loop 15 ladder owns this press and the
   step back waits for the next one. Without the yield, Escape over
   an open bubble both closed it and threw the learner out of the
   drill underneath. */
document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  var certUp = $("certOverlay"), cerUp = $("ceremony"), dockUp = $("bubbleDock");
  if ((certUp && !certUp.classList.contains("hidden")) ||
      (cerUp && !cerUp.classList.contains("hidden")) ||
      (dockUp && dockUp.classList.contains("open"))) return;
  var dv = $("drillView"), lr = $("libReader");
  if (dv && !dv.classList.contains("hidden") && !views.sandbox.classList.contains("hidden")) $("backBtn").click();
  else if (lr && !lr.classList.contains("hidden") && !views.library.classList.contains("hidden")) $("libBack").click();
  else if (!views.vault.classList.contains("hidden")) {
    /* Loop 60 — the Vault's rooms take the same step back the
       Sandbox drill and the reader already had: a drill steps
       back to its pack, a pack back to the pack map. The pack
       search box keeps Escape for itself (a search field
       clears natively), the same exception the reader's page
       turns make for typing fields. */
    var t = e.target;
    if (t && t.id === "vaultSearch") return;
    var vBack = $("vaultBackPack") || $("vaultBackPacks");
    if (vBack) vBack.click();
  }
});

