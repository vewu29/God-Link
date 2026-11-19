/* Code Block — profiles: device-local sign up, the shared
   progress store, the profile card. Split from
   js/profiles-vault.js (lines 1-321). Loads before js/vault.js. */
"use strict";
/* ================= PROFILES, THE VAULT, AND THE BIG LIBRARY EXPANSION =================
   Profiles are device-local: name + avatar color, stored in this browser only.
   Signing up swaps the shared progress state so Sandbox mastery and Vault
   drills save under the active profile; guests keep the original guest save.
   The Vault generates its 10,000 drills deterministically from hand-written
   templates + word banks (seeded RNG), so every visit rebuilds the same vault. */
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
var CB_PROG_KEY = CB_META.profileProg;
var CB_VAULT_KEY = CB_META.profileVault;

/* ---------- Profile store ---------- */
var CB_PROFILES_KEY = "code-block-profiles-v1";
var cbStore = { active: null, profiles: {} };
/* Loop 56 — the store is validated at the door, like every
   other save in the app: only a plain object of plain-object
   profiles survives, and `active` must name one of them —
   anything else reads as a fresh, empty store instead of a
   bent shape every later read has to survive. */
try {
  var cbRaw = localStorage.getItem(CB_PROFILES_KEY);
  if (cbRaw) {
    var cbParsed = JSON.parse(cbRaw);
    if (cbParsed && typeof cbParsed === "object" && cbParsed.profiles && typeof cbParsed.profiles === "object" && !Array.isArray(cbParsed.profiles)) {
      var cbClean = { active: null, profiles: {} };
      for (var cbName in cbParsed.profiles) {
        var cbEntry = cbParsed.profiles[cbName];
        if (cbEntry && typeof cbEntry === "object" && !Array.isArray(cbEntry)) cbClean.profiles[cbName] = cbEntry;
      }
      if (typeof cbParsed.active === "string" && Object.prototype.hasOwnProperty.call(cbClean.profiles, cbParsed.active)) cbClean.active = cbParsed.active;
      cbStore = cbClean;
    }
  }
} catch (e) {}
function cbSaveStore() { try { localStorage.setItem(CB_PROFILES_KEY, JSON.stringify(cbStore)); } catch (e) {} }
/* Loop 56 — the counters live in the track files; if one ever
   fails to load, counting falls back to "nothing banked"
   instead of taking the profile room down with it. */
if (typeof cbVaultLen !== "function") window.cbVaultLen = function (v) { return (v && typeof v === "object" && !Array.isArray(v)) ? Object.keys(v).length : 0; };
if (typeof cbCountProg !== "function") window.cbCountProg = function () { return 0; };
function cbProfile() { return cbStore.active && Object.prototype.hasOwnProperty.call(cbStore.profiles, cbStore.active) ? cbStore.profiles[cbStore.active] : null; }
window.cbIsMember = function () { return !!cbProfile(); };
/* Loop 56 — a vault map counts only as a plain object; a
   string or array in its place would index as phantom
   banked drills all through the Vault room. */
function cbVaultDone() {
  var p = cbProfile();
  var v = p && p[CB_VAULT_KEY];
  return (v && typeof v === "object" && !Array.isArray(v)) ? v : {};
}
function cbVaultCount() { return Object.keys(cbVaultDone()).length; }
function cbMasteredCount() {
  var c = 0;
  for (var i = 0; i < BLOCKS.length; i++) { if ((state.reps[i] || 0) >= REPS_GOAL) c++; }
  return c;
}
/* Route every progress save into the active profile (guests keep the original save). */
var cbOrigSave = save;
save = function () {
  var p = cbProfile();
  if (p) {
    p[CB_PROG_KEY] = JSON.parse(JSON.stringify(state));
    cbSaveStore();
  } else {
    cbOrigSave();
  }
};
/* On load, a returning member's progress replaces the guest state on screen. */
(function cbRestoreProfile() {
  var p = cbProfile();
  var src = p && p[CB_PROG_KEY];
  if (src && src.reps) {
    state = sanitizeState(src);
    refreshProgress();
  }
})();
function cbGuestState() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) { var parsed = JSON.parse(raw); if (parsed && parsed.reps) return sanitizeState(parsed); }
  } catch (e) {}
  return { reps: {}, celebrated: false };
}
function cbUpdateMenuLabel() {
  var p = cbProfile();
  $("menuProfileLabel").textContent = p ? p.name : "Sign Up";
  var av = $("menuAvatar"), ic = $("menuProfileIcon");
  if (av && ic) {
    if (p) {
      av.textContent = (p.name || "?").charAt(0).toUpperCase();
      av.style.background = p.color || AVATAR_COLORS[0];
      av.classList.remove("hidden");
      ic.classList.add("hidden");
    } else {
      av.classList.add("hidden");
      ic.classList.remove("hidden");
    }
  }
  cbPaintHello();
}
/* Loop 12 — the mastery card says hello. Signed in, it greets you
   by name with your live numbers for this track plus everything
   banked in the Vault; guests never see the row. refreshProgress
   is wrapped (the same trick the save router uses) so the hello
   stays true after every single rep. */
function cbPaintHello() {
  var row = $("helloRow");
  if (!row) return;
  var p = cbProfile();
  if (!p) { row.classList.add("hidden"); return; }
  row.classList.remove("hidden");
  $("helloAvatar").innerHTML = cbAvatarHTML(p.name, p.color);
  $("helloName").textContent = "Keep going, " + p.name;
  var trackName = CB_META.id === "drive" ? "Drive" : CB_META.name;
  var banked = cbProfileTotals(p).banked;
  $("helloSub").textContent = cbMasteredCount() + " of " + BLOCKS.length + " " + trackName + " blocks mastered · " + banked.toLocaleString() + " Vault drills banked across all tracks";
}
var cbOrigRefresh = refreshProgress;
refreshProgress = function () {
  cbOrigRefresh(); cbPaintHello();
  /* Loop 68 — the wrapper keeps the hello row true after
     every refresh; the open drill needed the same care. A
     drill stays open underneath a trip to the Profile room,
     and sign-in / switch / sign-out / delete all swap `state`
     and call this refresh — which repaints the hub list, the
     banner and the world, but never the drill's own rep
     dots, rep counter, Next button or status line. Those
     kept showing the previous identity's count for the block
     (in the mastered direction, even offering Next for a
     block this identity has not mastered) until the learner
     banked another rep and the input handler repainted.
     Repaint the open drill from the swapped state here, the
     way openBlock paints it, so the room the learner returns
     to is already telling the new identity's truth. */
  if (typeof current !== "undefined" && current >= 0 &&
      typeof renderReps === "function" && typeof isDone === "function" && typeof setStatus === "function") {
    renderReps();
    setStatus(isDone(current) ? "Mastered. Keep typing it for the rhythm — that\u2019s how it sticks." : "", isDone(current) ? "good" : "");
  }
};
$("helloVaultBtn").addEventListener("click", function () { showView("vault"); window.cbRenderVault(); });
window.cbMemberNudge = function () {
  var msg = $("profMsgTop");
  var online = !!(window.CBAccount && window.CBAccount.available());
  if (msg) { msg.textContent = online ? "That shelf is members-only. Make a free account above — it takes ten seconds — or keep a profile on this device only." : "That shelf is members-only. Create a free profile below — it takes ten seconds and lives only on this device."; msg.classList.add("err"); }
};

/* ---------- Sign up / profile view ---------- */
/* Loop 51: three palette blues (#0284c7, #0ea5e9, #38bdf8)
   put the white avatar initial under 4.5:1; the deepened
   blues that replace them all measure 5.12:1 or better. */
var AVATAR_COLORS = ["#1d4ed8", "#1e3a8a", "#2563eb", "#0369a1", "#1f6ccf", "#1e40af", "#1a63c2", "#155e75"];
var cbChosenColor = AVATAR_COLORS[0];
function cbAvatarHTML(name, color, big) {
  var c = color || AVATAR_COLORS[0];
  var ring = big ? "box-shadow:0 0 0 3px var(--surface),0 0 0 5.5px " + esc(c) + ",0 6px 14px rgba(10,42,90,0.3);" : "";
  return '<span class="avatar" style="background:' + esc(c) + ";" + ring + '" aria-hidden="true">' + esc((name || "?").charAt(0).toUpperCase()) + "</span>";
}
window.cbRenderProfile = function () {
  var host = $("profileMain");
  var p = cbProfile();
  var names = Object.keys(cbStore.profiles);
  /* With the site's server on (js/account.js), online accounts lead and
     a profile kept on this device only folds away beneath them. */
  var online = !!(window.CBAccount && window.CBAccount.available());
  if (!p) {
    var picks = names.map(function (n) {
      var pr = cbStore.profiles[n];
      return '<button class="profile-pick" type="button" data-signin="' + esc(n) + '">' + cbAvatarHTML(pr.name || n, pr.color) +
        '<span><b>' + esc(n) + '</b><span>' + cbProfileTotals(pr).mastered + ' blocks mastered · ' + cbProfileTotals(pr).banked.toLocaleString() + ' vault drills banked · ' + (pr.account ? "online account · tap to log in" : "tap to sign in") + '</span></span></button>';
    }).join("");
    var swatches = AVATAR_COLORS.map(function (c, i) {
      return '<button class="swatch' + (c === cbChosenColor ? " sel" : "") + '" type="button" data-color="' + c + '" style="background:' + c + '" aria-label="Avatar color ' + (i + 1) + '" aria-pressed="' + (c === cbChosenColor) + '"></button>';
    }).join("");
    var localForm =
      '<p class="prof-sub">Pick a display name and an avatar color. Your progress on screen right now moves into the new profile, and from then on everything you master saves under your name on this device.</p>' +
      '<label class="prof-label" for="profName">Display name</label>' +
      '<input class="prof-input" id="profName" type="text" maxlength="24" placeholder="e.g. V, Nova, CodeFox…" autocomplete="off" />' +
      '<span class="prof-label">Avatar color</span><div class="swatch-row" id="swatchRow">' + swatches + '</div>' +
      '<button class="big-btn" id="profCreate" type="button">' + (online ? "Make a profile on this device" : "Sign up &amp; unlock member content") + '</button>' +
      '<p class="prof-msg" id="profMsg" aria-live="polite"></p>';
    host.innerHTML =
      '<p class="prof-msg err" id="profMsgTop" aria-live="polite"></p>' +
      (online
        ? '<details class="prof-card prof-local"><summary>Or keep a profile on this device only</summary>' + localForm + '</details>'
        : '<div class="prof-card"><h3 style="margin:0 0 4px;">Create your free profile</h3>' + localForm + '</div>') +
      (names.length ? '<div class="prof-card"><h3 style="margin:0 0 4px;">Already have a profile on this device?</h3><p class="prof-sub">Tap your name to sign in — your saved progression comes right back.</p>' + picks + "</div>" : "") +
      '<div class="prof-card"><h3 style="margin:0 0 6px;">What members get</h3>' +
      '<p class="prof-sub"><strong>The Vault</strong> — 10,000 extra drills in 100 themed packs.<br><strong>Member shelves</strong> — in C++ mode, Shelf S5 · The Pattern Workshop and Shelf S6 · The C++ Time Machine; every track has its own 10,000-drill Vault, each with its own progress.<br><strong>Saved progression</strong> — Sandbox mastery and Vault drills kept under your name, separate from guest progress and from other profiles on this device.</p></div>';
    $("swatchRow").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-color]"); if (!b) return;
      cbChosenColor = b.getAttribute("data-color");
      Array.prototype.forEach.call($("swatchRow").children, function (el) { var on = el.getAttribute("data-color") === cbChosenColor; el.classList.toggle("sel", on); el.setAttribute("aria-pressed", on ? "true" : "false"); });
    });
    $("profCreate").addEventListener("click", function () {
      var name = $("profName").value.trim();
      var msg = $("profMsg");
      if (name.length < 2) { msg.textContent = "Give your profile a name of at least 2 characters."; msg.classList.add("err"); return; }
      /* Names are keys in the saved store; a name the browser treats as
         an object's own machinery (__proto__) would silently never save. */
      if (name in {}) { msg.textContent = "That name is reserved by the browser — pick another."; msg.classList.add("err"); return; }
      if (name.charAt(0) === "@") { msg.textContent = "Names starting with @ are kept for online accounts — pick another."; msg.classList.add("err"); return; }
      var taken = names.some(function (n) { return n.toLowerCase() === name.toLowerCase(); });
      if (taken) { msg.textContent = "That name is already taken on this device — pick another, or sign in below."; msg.classList.add("err"); return; }
      var np = { name: name, color: cbChosenColor, progress: { reps: {}, celebrated: false }, vault: {}, progressCS: { reps: {}, celebrated: false }, vaultCS: {}, progressDrive: { reps: {}, celebrated: false }, vaultDrive: {} };
      np[CB_PROG_KEY] = JSON.parse(JSON.stringify(state));
      cbStore.profiles[name] = np;
      cbStore.active = name;
      cbSaveStore();
      if (window.CBFX) window.CBFX.carry("guest");
      cbUpdateMenuLabel();
      window.cbRenderProfile();
      if (window.__refreshWorld) window.__refreshWorld();
      /* Loop 50 — the re-render swaps the whole room silently;
         say who just arrived. */
      if (window.cbAnnounce) window.cbAnnounce("Profile created. Welcome, " + name + ((window.__isCS || window.__isDrive) ? ". The Vault is open." : ". The Vault and member shelves are open."));
    });
    Array.prototype.forEach.call(host.querySelectorAll("[data-signin]"), function (btn) {
      btn.addEventListener("click", function () {
        var n = btn.getAttribute("data-signin");
        if (!cbStore.profiles[n]) return;
        if (cbStore.profiles[n].account && window.CBAccount && window.CBAccount.claim(n)) return;
        cbStore.active = n;
        cbSaveStore();
        state = sanitizeState(cbStore.profiles[n][CB_PROG_KEY]);
        refreshProgress();
        cbUpdateMenuLabel();
        window.cbRenderProfile();
        if (window.__refreshWorld) window.__refreshWorld();
        if (window.cbAnnounce) window.cbAnnounce("Signed in as " + n + ". Your saved progress is back.");
      });
    });
  } else {
    var others = names.filter(function (n) { return n !== cbStore.active; }).map(function (n) {
      var pr = cbStore.profiles[n];
      return '<button class="profile-pick" type="button" data-switch="' + esc(n) + '">' + cbAvatarHTML(pr.name || n, pr.color) +
        '<span><b>' + esc(n) + '</b><span>' + (pr.account ? "online account · tap to switch" : "tap to switch to this profile") + '</span></span></button>';
    }).join("");
    var linked = !!(p.account && online);
    var tRows = cbProfileRows(p);
    var jRows = tRows.map(function (r) { return [r.meta.name + " blocks", r.mastered, r.meta.blocks]; });
    jRows.push(["Vault drills", cbProfileTotals(p).banked, 10000 * tRows.length]);
    var journey = '<div class="journey" role="img" aria-label="Your journey across every track you have started, and the Vault">' + jRows.map(function (r) {
      var pct = Math.max(0, Math.min(100, Math.round(100 * r[1] / r[2])));
      return '<div class="journey-row"><span class="j-label">' + r[0] + '</span><span class="j-track"><span class="j-fill" style="width:' + pct + '%"></span></span><span class="j-count">' + r[1].toLocaleString() + " / " + r[2].toLocaleString() + "</span></div>";
    }).join("") + "</div>";
    host.innerHTML =
      '<div class="prof-card"><div class="prof-head">' + cbAvatarHTML(p.name, p.color, true) +
      '<div><p class="prof-name">' + esc(p.name) + '<span class="member-pill">Member</span></p><p class="prof-sub">Welcome back — this is your whole journey, every track you have started, ' + (p.account ? "saved to your online account and on this device." : "saved under your name on this device.") + '</p></div></div>' +
      journey +
      '<div class="prof-stats">' +
      tRows.map(function (r) {
        return '<div class="prof-stat"><b>' + r.mastered + " / " + r.meta.blocks + "</b><span>" + esc(r.meta.name) + " blocks mastered</span></div>" +
          '<div class="prof-stat"><b>' + r.banked.toLocaleString() + " / 10,000</b><span>" + esc(r.meta.name) + " Vault drills</span></div>";
      }).join("") +
      '<div class="prof-stat"><b>' + (names.length) + '</b><span>Profiles on this device</span></div></div>' +
      '<button class="big-btn" id="profVault" type="button">Open the Vault — 10,000 drills</button>' +
      (linked ? "" : '<button class="ghost-btn" id="profOut" type="button">Sign out (keep browsing as guest)</button>' +
      '<button class="ghost-btn danger" id="profDelete" type="button">Delete this profile</button>') +
      '<p class="prof-msg" id="profMsg" aria-live="polite"></p></div>' +
      (others ? '<div class="prof-card"><h3 style="margin:0 0 4px;">Switch profile</h3>' + others + "</div>" : "");
    $("profVault").addEventListener("click", function () { showView("vault"); window.cbRenderVault(); });
    if (!linked) $("profOut").addEventListener("click", function () {
      cbStore.active = null;
      cbSaveStore();
      state = cbGuestState();
      refreshProgress();
      cbUpdateMenuLabel();
      window.cbRenderProfile();
      if (window.__refreshWorld) window.__refreshWorld();
      if (window.cbAnnounce) window.cbAnnounce("Signed out. Browsing as guest now.");
    });
    if (!linked) $("profDelete").addEventListener("click", function () {
      var btn = $("profDelete"), msg = $("profMsg");
      if (btn.getAttribute("data-arm") !== "1") {
        btn.setAttribute("data-arm", "1");
        btn.textContent = "Tap again to really delete " + p.name + " and its saved progress";
        msg.textContent = "This removes the profile and all of its saved progress from this device. There is no undo.";
        msg.classList.add("err");
        return;
      }
      delete cbStore.profiles[cbStore.active];
      cbStore.active = null;
      cbSaveStore();
      state = cbGuestState();
      refreshProgress();
      cbUpdateMenuLabel();
      window.cbRenderProfile();
      if (window.__refreshWorld) window.__refreshWorld();
      /* Loop 68 — create, sign-in, switch and sign-out all
         announce their arrival through the app's one voice;
         delete was the one lifecycle step that finished in
         silence, its button destroyed by the re-render with
         nothing spoken. Say what happened. */
      if (window.cbAnnounce) window.cbAnnounce("Profile " + p.name + " deleted. Browsing as guest now.");
    });
    /* Loop 67 — the Switch profile picks rendered above were
       dead buttons: the guest room wires its [data-signin]
       picks, but nothing anywhere listened for [data-switch],
       so a signed-in learner tapping another profile's card
       got no response at all. They switch exactly the way a
       sign-in does — same store write, same sanitized state
       swap, same refresh and announcement. */
    Array.prototype.forEach.call(host.querySelectorAll("[data-switch]"), function (btn) {
      btn.addEventListener("click", function () {
        var n = btn.getAttribute("data-switch");
        if (!cbStore.profiles[n]) return;
        if (cbStore.profiles[n].account && window.CBAccount && window.CBAccount.claim(n)) return;
        cbStore.active = n;
        cbSaveStore();
        state = sanitizeState(cbStore.profiles[n][CB_PROG_KEY]);
        refreshProgress();
        cbUpdateMenuLabel();
        window.cbRenderProfile();
        if (window.__refreshWorld) window.__refreshWorld();
        if (window.cbAnnounce) window.cbAnnounce("Switched to " + n + ". Your saved progress is back.");
      });
    });
  }
};

