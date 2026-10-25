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
  if (msg) { msg.textContent = "That shelf is members-only. Create a free profile below — it takes ten seconds and lives only on this device."; msg.classList.add("err"); }
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
  if (!p) {
    var picks = names.map(function (n) {
      var pr = cbStore.profiles[n];
      return '<button class="profile-pick" type="button" data-signin="' + esc(n) + '">' + cbAvatarHTML(n, pr.color) +
        '<span><b>' + esc(n) + '</b><span>' + cbProfileTotals(pr).mastered + ' blocks mastered · ' + cbProfileTotals(pr).banked.toLocaleString() + ' vault drills banked · tap to sign in</span></span></button>';
    }).join("");
    var swatches = AVATAR_COLORS.map(function (c, i) {
      return '<button class="swatch' + (c === cbChosenColor ? " sel" : "") + '" type="button" data-color="' + c + '" style="background:' + c + '" aria-label="Avatar color ' + (i + 1) + '" aria-pressed="' + (c === cbChosenColor) + '"></button>';
    }).join("");
    host.innerHTML =
      '<p class="prof-msg err" id="profMsgTop" aria-live="polite"></p>' +
      '<div class="prof-card"><h3 style="margin:0 0 4px;">Create your free profile</h3>' +
      '<p class="prof-sub">Pick a display name and an avatar color. Your progress on screen right now moves into the new profile, and from then on everything you master saves under your name on this device.</p>' +
      '<label class="prof-label" for="profName">Display name</label>' +
      '<input class="prof-input" id="profName" type="text" maxlength="24" placeholder="e.g. V, Nova, CodeFox…" autocomplete="off" />' +
      '<span class="prof-label">Avatar color</span><div class="swatch-row" id="swatchRow">' + swatches + '</div>' +
      '<button class="big-btn" id="profCreate" type="button">Sign up &amp; unlock member content</button>' +
      '<p class="prof-msg" id="profMsg" aria-live="polite"></p></div>' +
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
      var taken = names.some(function (n) { return n.toLowerCase() === name.toLowerCase(); });
      if (taken) { msg.textContent = "That name is already taken on this device — pick another, or sign in below."; msg.classList.add("err"); return; }
      var np = { name: name, color: cbChosenColor, progress: { reps: {}, celebrated: false }, vault: {}, progressCS: { reps: {}, celebrated: false }, vaultCS: {}, progressDrive: { reps: {}, celebrated: false }, vaultDrive: {} };
      np[CB_PROG_KEY] = JSON.parse(JSON.stringify(state));
      cbStore.profiles[name] = np;
      cbStore.active = name;
      cbSaveStore();
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
      return '<button class="profile-pick" type="button" data-switch="' + esc(n) + '">' + cbAvatarHTML(n, pr.color) +
        '<span><b>' + esc(n) + '</b><span>tap to switch to this profile</span></span></button>';
    }).join("");
    var tRows = cbProfileRows(p);
    var jRows = tRows.map(function (r) { return [r.meta.name + " blocks", r.mastered, r.meta.blocks]; });
    jRows.push(["Vault drills", cbProfileTotals(p).banked, 10000 * tRows.length]);
    var journey = '<div class="journey" role="img" aria-label="Your journey across every track you have started, and the Vault">' + jRows.map(function (r) {
      var pct = Math.max(0, Math.min(100, Math.round(100 * r[1] / r[2])));
      return '<div class="journey-row"><span class="j-label">' + r[0] + '</span><span class="j-track"><span class="j-fill" style="width:' + pct + '%"></span></span><span class="j-count">' + r[1].toLocaleString() + " / " + r[2].toLocaleString() + "</span></div>";
    }).join("") + "</div>";
    host.innerHTML =
      '<div class="prof-card"><div class="prof-head">' + cbAvatarHTML(p.name, p.color, true) +
      '<div><p class="prof-name">' + esc(p.name) + '<span class="member-pill">Member</span></p><p class="prof-sub">Welcome back — this is your whole journey, every track you have started, saved under your name on this device.</p></div></div>' +
      journey +
      '<div class="prof-stats">' +
      tRows.map(function (r) {
        return '<div class="prof-stat"><b>' + r.mastered + " / " + r.meta.blocks + "</b><span>" + esc(r.meta.name) + " blocks mastered</span></div>" +
          '<div class="prof-stat"><b>' + r.banked.toLocaleString() + " / 10,000</b><span>" + esc(r.meta.name) + " Vault drills</span></div>";
      }).join("") +
      '<div class="prof-stat"><b>' + (names.length) + '</b><span>Profiles on this device</span></div></div>' +
      '<button class="big-btn" id="profVault" type="button">Open the Vault — 10,000 drills</button>' +
      '<button class="ghost-btn" id="profOut" type="button">Sign out (keep browsing as guest)</button>' +
      '<button class="ghost-btn danger" id="profDelete" type="button">Delete this profile</button>' +
      '<p class="prof-msg" id="profMsg" aria-live="polite"></p></div>' +
      (others ? '<div class="prof-card"><h3 style="margin:0 0 4px;">Switch profile</h3>' + others + "</div>" : "");
    $("profVault").addEventListener("click", function () { showView("vault"); window.cbRenderVault(); });
    $("profOut").addEventListener("click", function () {
      cbStore.active = null;
      cbSaveStore();
      state = cbGuestState();
      refreshProgress();
      cbUpdateMenuLabel();
      window.cbRenderProfile();
      if (window.__refreshWorld) window.__refreshWorld();
      if (window.cbAnnounce) window.cbAnnounce("Signed out. Browsing as guest now.");
    });
    $("profDelete").addEventListener("click", function () {
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

/* ---------- The Vault: 10,000 generated drills ---------- */
var VARS = ["score","coins","hp","gems","stars","level","speed","count","total","steps","points","energy","shield","keys","apples","robots","dragons","laps","jumps","rings","bolts","hearts","potions","arrows","mana","gold","xp","size","age","price","weight","height","width","power","magic","luck"];
/* Loop 65 — ten more string-box names. Naming one box per
   line (above) shrank the string templates' line space to
   the bank's size; the string-heavy C# themes (Text & Names,
   String Workshop) hold barely 120 distinct lines for 100
   drills and were saturating into the fallback line. Twenty
   names restore headroom in every track's string themes. */
var STRVARS = ["name","hero","title","word","song","city","team","pet","ship","book","label","tag","note","poem","story","quest","badge","motto","riddle","charm"];
var WORDS = ["Hello","Go","Win","Jump","Run","Fly","Code","Blue","Star","Moon","Quest","Brave","Pixel","Turbo","Magic","Dream","Power","Block","World","Hero","Spark","Nova","Echo","Bolt","Wave","Comet","Orbit","Fern"];
var CLASSES = ["Block","Player","Robot","Dragon","Wizard","Knight","Rocket","Castle","Potion","Shield","Engine","Garden","Comet","Falcon","Turtle","Beacon","Puzzle","Sailor","Archer","Keeper"];
var FUNCS = ["play","heal","jump","run","draw","sing","build","open","close","spin","dash","grow","shine","count","mix","lift","drop","start","stop","move","turn","push","pull","wave","zap","mend","craft","boost"];
var ARRS = ["nums","scores","bag","deck","row","pack","chest","shelf","team","trail"];
var OBJS = ["gem","hero","bot","box","pet","ship","star","cube","orb","egg"];
var PTRS = ["ptr","hook","sign","guide","link","rope"];
var MAPS = ["scores","vault","atlas","index","ledger"];
var NS = ["game","shop","zoo","lab","guild","harbor"];
var DECS = ["1.5","2.5","3.75","0.5","9.99","4.2","7.3","12.6"];
var LETTERS = ["A","B","C","D","E","F","G","H","J","K","M","N","P","R","S","T","V","W","X","Z"];
var VT = window.CB_T ? CB_T.vt : window.__isDrive ? DRIVE_VT : window.__isCS ? CS_VT : [
  { line: 'std::cout << "{w}";', why: "cout pours the words in quotes straight onto the screen." },
  { line: "std::cout << {v};", why: "cout prints whatever value is inside the box right now." },
  { line: 'std::cout << "{w}: " << {v};', why: "Two pours in one line: a label first, then the box's value." },
  { line: "std::cout << {v} + {u};", why: "The math happens first, then cout prints the answer." },
  { line: "int {v} = {n};", why: "Build a whole-number box and put a starting value inside." },
  { line: "int {v} = 0;", why: "A fresh counter, starting from zero — the classic beginning." },
  { line: "double {v} = {dec};", why: "double boxes hold numbers with a decimal point." },
  { line: "bool {v} = {b};", why: "A bool box holds exactly one thing: true or false." },
  { line: "char {v} = '{L}';", why: "Single quotes hold ONE character — a letter, a digit, a symbol." },
  { line: 'std::string {sv} = "{w}";', why: "A string box built for text, wearing double quotes." },
  { line: "std::cin >> {v};", why: "cin listens to the keyboard and pours the typing into the box." },
  { line: "std::cin >> {sv};", why: "Reading a word from the keyboard into a string box." },
  { line: "{v} += {n};", why: "Add onto what is already in the box — never erase, pile on." },
  { line: "{v} -= {d};", why: "Take away from the box's current value in one shortcut." },
  { line: "{v} *= {d};", why: "Multiply the box's value by a number, shortcut style." },
  { line: "{v}++;", why: "Step the box up by exactly one." },
  { line: "{v}--;", why: "Step the box down by exactly one." },
  { line: "{v} = {u} + {n};", why: "An answer is worked out on the right, then stored on the left." },
  { line: "if ({v} > {n}) { {f}(); }", why: "Ask a question; if yes, the machine in the braces runs." },
  { line: "if ({v} == {n}) { {v} = 0; }", why: "Two equals signs ASK if they match. One would have filled the box." },
  { line: "if ({v} < {d}) { {v} = {d}; }", why: "A floor guard: if the box dips too low, lift it back up." },
  { line: "int {r} = ({v} > {u}) ? {v} : {u};", why: "The one-line choice: question, then value-if-yes, value-if-no." },
  { line: "switch ({v}) { case {d}: break; }", why: "switch opens the one matching door; break closes it behind you." },
  { line: "for (int i = 0; i < {d}; i++) { {v} += i; }", why: "Start, rule, step — the counting loop adds i on every lap." },
  { line: "for (int i = 1; i <= {n}; i++) { std::cout << i; }", why: "Count from 1 upward, printing every lap number." },
  { line: "while ({v} > 0) { {v}--; }", why: "Keep going while the question stays true — and something changes each lap." },
  { line: "do { {f}(); } while ({v} > 0);", why: "Run FIRST, ask afterwards — the code always happens at least once." },
  { line: "for (int x : {arr}) { total += x; }", why: "Range-for visits every item in the container — no counting at all." },
  { line: "if (i == {d}) { break; }", why: "break jumps out of the loop right now, mid-lap." },
  { line: "if (i == {d}) { continue; }", why: "continue skips the rest of this lap and starts the next one." },
  { line: "std::vector<int> {arr} = {{n}, {n2}, {n3}};", why: "A vector: a list that can grow, born with its first items inside." },
  { line: "{arr}.push_back({n});", why: "push_back grows the vector by one item at the end." },
  { line: "std::cout << {arr}.size();", why: "size() asks the container how many items it holds right now." },
  { line: '{sv} += "{w}";', why: "For strings, += glues more text onto the end." },
  { line: "std::cout << {sv}.size();", why: "A string's size is its letter count." },
  { line: "std::getline(std::cin, {sv});", why: "getline reads a WHOLE line of typing, spaces included." },
  { line: "std::string part = {sv}.substr(0, {d});", why: "substr cuts a piece out of a string, starting at a position." },
  { line: "int {f}(int x) { return x + {d}; }", why: "A function machine: a number goes in, a bigger number comes back." },
  { line: 'void {f}() { std::cout << "{w}"; }', why: "void means the machine hands nothing back — it just does its job." },
  { line: "{f}({n});", why: "Calling the machine: name it, hand it an input, it runs." },
  { line: "{f}({v});", why: "Handing a box's value to a machine as its input." },
  { line: "return {v} * {d};", why: "return hands the answer back to whoever called the machine." },
  { line: "class {c} { public: int size; };", why: "A class is a blueprint; the trailing semicolon is part of its shape." },
  { line: "{c} {o};", why: "Building one real object from the blueprint, with a name." },
  { line: "{o}.size = {n};", why: "The dot reaches inside the object to set one of its parts." },
  { line: "std::cout << {o}.size;", why: "The dot again — this time reading the part instead of setting it." },
  { line: "class {k} : public {c} { };", why: "A child blueprint: start from the parent, then add your own ideas." },
  { line: "int* {p} = &{v};", why: "& asks where the box lives; the pointer box keeps that address." },
  { line: "*{p} = {n};", why: "Follow the signpost and change the REAL box at the address." },
  { line: "std::cout << *{p};", why: "The star reads the value at the address the pointer holds." },
  { line: "void {f}(int& {v}) { {v} += {d}; }", why: "The & nickname means the function heals the ORIGINAL box." },
  { line: "int& {r} = {v};", why: "A second name tag on the same box — change one, both change." },
  { line: "int* {p} = new int({n});", why: "new builds a box on demand and hands back its address." },
  { line: "delete {p};", why: "Give memory built with new back when you are done with it." },
  { line: "auto {p} = std::make_unique<{c}>();", why: "The smart pointer builds the object AND tidies up after itself." },
  { line: "auto {f} = [](int x) { return x * {d}; };", why: "A lambda: a tiny unnamed machine folded into a variable." },
  { line: "auto {f} = [&] { {v}++; };", why: "[&] lets the lambda borrow the neighborhood's boxes by nickname." },
  { line: "template <typename T> T {f}(T x) { return x + x; }", why: "T is the fill-in-the-blank type — one recipe, many stampings." },
  { line: "Box<int> {o};", why: "A class template stamped for int: the mold poured with whole numbers." },
  { line: "std::sort({arr}.begin(), {arr}.end());", why: "sort tidies the whole stretch, from the first bookmark to the last." },
  { line: "auto it = std::find({arr}.begin(), {arr}.end(), {n});", why: "find hunts the stretch and reports where it stopped." },
  { line: "int c = std::count({arr}.begin(), {arr}.end(), {n});", why: "count walks the stretch and tallies the exact matches." },
  { line: "std::reverse({arr}.begin(), {arr}.end());", why: "reverse flips the whole stretch back to front." },
  { line: "std::map<std::string, int> {m};", why: "A map: labeled drawers, found by name, each holding a number." },
  { line: '{m}["{w}"] = {n};', why: "Open the drawer with that name tag and put a value inside." },
  { line: '{m}["{w}"] += {d};', why: "The same drawer, found by the same name: pile more on top." },
  { line: "try { {f}(); } catch (...) { }", why: "Risky code in try; if it throws, catch lands the fall." },
  { line: "if ({v} < 0) { throw {n}; }", why: "throw raises the alarm — a value flies up to the nearest catch." },
  { line: "const int {v} = {n};", why: "const seals the box: set once, never changed again." },
  { line: "static int {v} = 0;", why: "static remembers: built once, keeps its value between calls." },
  { line: "auto {v} = {n};", why: "auto lets the compiler figure out the box's type from the value." },
  { line: "namespace {ns} { int score = {n}; }", why: "A namespace is a labeled drawer that keeps names from colliding." },
  { line: "enum class {c} { Low, High };", why: "An enum names a small set of choices instead of mystery numbers." },
  { line: "int {arr}[3] = {{n}, {n2}, {n3}};", why: "A plain array: a fixed row of boxes that never grows." },
  { line: "{arr}[0] = {n};", why: "Square brackets reach into the row by number — counting from 0." },
  { line: "int {r} = std::min({v}, {u});", why: "std::min compares two values and hands back the smaller." },
  { line: "int {r} = std::max({v}, {u});", why: "std::max compares two values and hands back the bigger." },
  { line: "std::swap({v}, {u});", why: "swap trades the contents of two boxes in one move." },
  { line: "std::pair<int, int> {o} = {{n}, {n2}};", why: "A pair: one box with exactly two compartments." },
  { line: "std::set<int> {arr};", why: "A set keeps every different item exactly once, in order." },
  { line: "{arr}.insert({n});", why: "insert files a new item into an ordered container." },
  { line: "int s = std::accumulate({arr}.begin(), {arr}.end(), 0);", why: "accumulate adds the whole stretch into one running total." }
];
var THEMES = window.CB_T ? CB_T.themes : window.__isDrive ? DRIVE_THEMES : window.__isCS ? CS_THEMES : [
  { name: "Print & Talk", t: [0, 1, 2, 3, 24] },
  { name: "Boxes & Numbers", t: [4, 5, 6, 68, 70] },
  { name: "True, False & Letters", t: [7, 8, 9, 19, 17] },
  { name: "Listening In", t: [10, 11, 35, 32, 65] },
  { name: "Number Tricks", t: [12, 13, 14, 15, 16] },
  { name: "Yes or No", t: [18, 19, 20, 21, 77] },
  { name: "Door Picker", t: [22, 28, 29, 18, 21] },
  { name: "Counting Loops", t: [23, 24, 27, 28, 29] },
  { name: "Question Loops", t: [25, 26, 23, 15, 16] },
  { name: "Growing Lists", t: [30, 31, 32, 73, 74] },
  { name: "Text & Words", t: [9, 33, 34, 35, 36] },
  { name: "Machines (Functions)", t: [37, 38, 39, 40, 41] },
  { name: "Blueprints (Classes)", t: [42, 43, 44, 45, 72] },
  { name: "Family Blueprints", t: [46, 42, 43, 44, 58] },
  { name: "Signposts (Pointers)", t: [47, 48, 49, 52, 53] },
  { name: "Nicknames (References)", t: [50, 51, 47, 40, 56] },
  { name: "Fresh Memory", t: [52, 53, 54, 55, 47] },
  { name: "Tiny Machines (Lambdas)", t: [55, 56, 37, 39, 40] },
  { name: "Workshop Tools (STL)", t: [59, 60, 61, 62, 81] },
  { name: "Maps, Sets & Pairs", t: [63, 64, 65, 79, 80] }
];
var ROUNDS = ["Warm-Up", "Builders", "Boosters", "Masters", "Legends"];
function cbRng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function cbFill(tpl, r) {
  var usedV = [], usedC = [];
  /* Loop 65 — one name per placeholder per line. A template
     that names the same box twice ({v} … {v}, {arr}.begin() …
     {arr}.end(), new {c}()) means ONE box; filling each
     occurrence independently minted a fresh name every time,
     so ~3,100 of the 30,000 drills taught a line that acts
     on a different variable than the one it just named
     ("if (power == 24) { width = 0; }"). Fills are now
     remembered per key for the length of the line; distinct
     keys (v/u/r, n/n2/n3) still draw distinct values. */
  var memo = {};
  function pick(bank) { return bank[Math.floor(r() * bank.length)]; }
  function distinct(bank, used) {
    var x = pick(bank), guard = 0;
    while (used.indexOf(x) >= 0 && guard < 40) { x = pick(bank); guard++; }
    used.push(x); return x;
  }
  function fillOnce(k, m) {
    if (window.__isDrive && window.cbDriveFill) { var dv = window.cbDriveFill(k, r); if (dv !== null) return dv; }
          if (window.CB_T && CB_T.fill) { var tv = CB_T.fill(k, r); if (tv !== null && tv !== undefined) return tv; }
    switch (k) {
      case "v": case "u": case "r": return distinct(VARS, usedV);
      case "sv": return pick(STRVARS);
      case "w": return pick(WORDS);
      case "c": case "k": return distinct(CLASSES, usedC);
      case "f": return pick(FUNCS);
      case "arr": return pick(ARRS);
      case "o": return pick(OBJS);
      case "p": return pick(PTRS);
      case "m": return pick(MAPS);
      case "ns": return pick(NS);
      case "n": case "n2": case "n3": return String(1 + Math.floor(r() * 99));
      case "d": return String(2 + Math.floor(r() * 8));
      case "dec": return pick(DECS);
      case "b": return r() < 0.5 ? "true" : "false";
      case "L": return pick(LETTERS);
    }
    return m;
  }
  return tpl.line.replace(/\{([a-z0-9]+)\}/g, function (m, k) {
    if (Object.prototype.hasOwnProperty.call(memo, k)) return memo[k];
    var val = fillOnce(k, m);
    memo[k] = val;
    return val;
  });
}
function cbGenPack(p) {
  var theme = THEMES[Math.floor(p / 5)];
  var out = [], seen = {};
  for (var j = 0; j < 100; j++) {
    var line = null, why = "", tries = 0;
    while (!line && tries < 25) {
      var r = cbRng(p * 100003 + j * 131 + tries * 7919 + 17);
      var tpl = VT[theme.t[Math.floor(r() * theme.t.length)]];
      var cand = cbFill(tpl, r);
      if (!seen[cand]) { seen[cand] = 1; line = cand; why = tpl.why; }
      tries++;
    }
    if (!line) { line = "int drill" + (p * 100 + j) + " = " + (j + 1) + ";"; why = "A fresh counter box — every drill in the Vault is one of a kind."; }
    out.push({ line: line, why: why });
  }
  return out;
}
function cbPackName(p) { return THEMES[Math.floor(p / 5)].name + " · " + ROUNDS[p % 5]; }
function cbPackDone(p, done) { var c = 0; for (var j = 0; j < 100; j++) if (done[p * 100 + j]) c++; return c; }

var vaultPack = -1, vaultDrill = -1, vaultCache = null;
var vaultFilter = "all", vaultQuery = "";
var VAULT_MILESTONES = [100, 500, 1000, 2500, 5000, 7500, 9000, 10000];
var VAULT_CHEV = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-chev-left"/></svg>';
function cbVaultFileName() { return CB_META.vaultFile; }

/* The monument: a 100×100 field of dots — one per drill in the
   Vault. Banked drills burn ice-blue; the rest wait in the dark. */
function cbDrawMonument(done) {
  var cv = document.getElementById("vaultMonument");
  if (!cv) return;
  var w = cv.clientWidth || 320;
  /* Loop 56 — capped at 2 like the 3D stage and the Book
     reader: on a 3x phone an uncapped canvas quadruples the
     pixels under 10,000 arc fills for no visible gain. */
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(w * dpr);
  var ctx = cv.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  var cell = w / 100, r = Math.max(0.7, cell * 0.3);
  for (var i = 0; i < 10000; i++) {
    var x = (i % 100) * cell + cell / 2, y = Math.floor(i / 100) * cell + cell / 2;
    ctx.beginPath();
    ctx.arc(x, y, done[i] ? r : r * 0.72, 0, 6.2832);
    ctx.fillStyle = done[i] ? "#4fc3ff" : "rgba(140, 200, 255, 0.13)";
    ctx.fill();
  }
}
var vaultResizeT = null;
window.addEventListener("resize", function () {
  if (!document.getElementById("vaultMonument")) return;
  if (vaultResizeT) clearTimeout(vaultResizeT);
  vaultResizeT = setTimeout(function () { cbDrawMonument(cbVaultDone()); }, 160);
});
function cbMonumentHTML(count, guest) {
  var pct = (count / 100).toFixed(1);
  var next = null;
  for (var m = 0; m < VAULT_MILESTONES.length; m++) { if (count < VAULT_MILESTONES[m]) { next = VAULT_MILESTONES[m]; break; } }
  var cap = guest
    ? "Every dot is one drill. Right now the wall is dark — members light it up, one drill at a time."
    : next
      ? "<b>" + pct + "%</b> of the wall is lit · next milestone <b>" + next.toLocaleString() + "</b> — " + (next - count).toLocaleString() + " drills to go"
      : "<b>The whole wall is lit.</b> Ten thousand drills banked — there is nothing left but to admire it.";
  return '<div class="vault-card monument-card closet-crown"><div class="mastery-top"><span class="mastery-label"><svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#i-dots"/></svg>The 10,000-dot wall</span><span class="vault-meter-num">' + count.toLocaleString() + " / 10,000</span></div>" +
    '<canvas id="vaultMonument" class="monument-canvas" role="img" aria-label="A wall of 10,000 dots, one for every Vault drill. ' + count.toLocaleString() + ' are lit."></canvas>' +
    '<p class="monument-cap">' + cap + "</p></div>";
}
function cbPackMapHTML(done) {
  var cells = "";
  for (var p = 0; p < 100; p++) {
    var pd = cbPackDone(p, done);
    cells += '<button class="pmap-cell' + (pd === 100 ? " done" : pd > 0 ? " doing" : "") + '" type="button" data-mappack="' + p + '" aria-label="Pack ' + (p + 1) + " · " + esc(cbPackName(p)) + " — " + pd + ' of 100 drills banked" title="Pack ' + (p + 1) + " · " + esc(cbPackName(p)) + '"><span class="fill" style="height:' + pd + '%"></span></button>';
  }
  return '<div class="vault-card packmap-card"><div class="mastery-top"><span class="mastery-label">Pack map — the whole gym at a glance</span></div>' +
    '<div class="pack-map">' + cells + "</div>" +
    '<div class="pack-map-legend"><span><i style="background:rgba(56,189,248,.14)"></i>Untouched</span><span><i style="background:linear-gradient(180deg,#38bdf8,#1d4ed8)"></i>Filling up</span><span><i style="background:#38bdf8"></i>Complete</span><span>Tap a square to walk straight into that pack.</span></div></div>';
}
function cbOpenPack(p) {
  vaultPack = p;
  vaultDrill = -1;
  vaultCache = cbGenPack(p);
  window.cbRenderVault();
}
function cbPackMatches(p, pd) {
  if (vaultFilter === "doing" && !(pd > 0 && pd < 100)) return false;
  if (vaultFilter === "new" && pd !== 0) return false;
  if (vaultFilter === "done" && pd !== 100) return false;
  if (vaultQuery) {
    var hay = ("pack " + (p + 1) + " " + cbPackName(p)).toLowerCase();
    if (hay.indexOf(vaultQuery.toLowerCase()) < 0) return false;
  }
  return true;
}
/* The grouped, filterable pack list — re-rendered on its own so
   typing in the search box never loses focus or scroll. */
function cbRenderPackZone() {
  var zone = document.getElementById("vaultPackZone");
  if (!zone) return;
  var done = cbVaultDone();
  var html = "";
  for (var t = 0; t < THEMES.length; t++) {
    var themeDone = 0, group = "";
    for (var r = 0; r < 5; r++) {
      var p = t * 5 + r;
      var pd = cbPackDone(p, done);
      themeDone += pd;
      if (!cbPackMatches(p, pd)) continue;
      group += '<button class="pack-btn' + (pd === 100 ? " full" : pd > 0 ? " doing" : "") + '" type="button" data-pack="' + p + '"><b>Pack ' + (p + 1) + " · " + esc(cbPackName(p)) + '</b><span>' + (pd === 100 ? "Complete — all 100 drills" : pd + " / 100 drills done") + '</span><span class="pack-bar"><i style="width:' + pd + '%"></i></span></button>';
    }
    if (group) {
      html += '<div class="closet-shelf"><div class="theme-head"><h3>' + esc(THEMES[t].name) + '</h3><span>' + themeDone + " / 500 banked</span></div>" +
        '<div class="bar-track theme-track"><div class="bar-fill" style="width:' + (themeDone / 5) + '%"></div></div>' +
        '<div class="pack-grid">' + group + "</div>" +
        '<div class="closet-rail" aria-hidden="true"></div></div>';
    }
  }
  zone.innerHTML = html || '<div class="empty-state"><span class="es-ico" aria-hidden="true"><svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-lock-open"/></svg></span><p class="es-title">No packs match that</p><p class="es-body">Clear the search or pick a different filter, and the packs come right back.</p></div>';
  Array.prototype.forEach.call(zone.querySelectorAll("[data-pack]"), function (b) {
    b.addEventListener("click", function () { cbOpenPack(parseInt(b.getAttribute("data-pack"), 10)); });
  });
}

window.cbRenderVault = function () {
  var host = $("vaultMain");
  var prof = cbProfile();
  if (!prof) {
    var sample = [0, 7, 23, 55, 99].map(function (p) {
      return '<button class="pack-btn" type="button" data-govault-signup="1"><b>Pack ' + (p + 1) + " · " + esc(cbPackName(p)) + '</b><span>100 drills · locked for guests</span></button>';
    }).join("");
    var peek = cbGenPack(0).slice(0, 3).map(function (d) {
      return '<code class="peek-line">' + esc(d.line) + "</code>";
    }).join("");
    host.innerHTML =
      cbMonumentHTML(0, true) +
      '<div class="vault-card empty-state es-card"><span class="es-ico" aria-hidden="true"><svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-lock"/></svg></span><h3 style="margin:0 0 6px;">Members only</h3>' +
      '<p class="prof-sub">Guests can browse the whole site — but the Vault\'s 10,000 drills open only for profiles, so your Vault progress can save under your name. Creating a profile is free, takes ten seconds, and never leaves this device.</p>' +
      '<p class="prof-sub" style="margin-top:14px;"><strong>A taste of Pack 1 — three of its hundred lines:</strong></p>' + peek +
      '<div class="pack-grid">' + sample + '</div>' +
      '<button class="big-btn" id="vaultSignup" type="button">Create a free profile to open the Vault</button></div>';
    $("vaultSignup").addEventListener("click", function () { showView("profile"); window.cbRenderProfile(); });
    Array.prototype.forEach.call(host.querySelectorAll("[data-govault-signup]"), function (b) {
      b.addEventListener("click", function () { showView("profile"); window.cbRenderProfile(); });
    });
    cbDrawMonument({});
    return;
  }
  if (vaultPack >= 0 && !vaultCache) vaultCache = cbGenPack(vaultPack);
  var done = cbVaultDone();
  var count = cbVaultCount();
  if (vaultPack < 0) {
    var chips = [["all", "All 100"], ["doing", "In progress"], ["new", "Untouched"], ["done", "Complete"]].map(function (c) {
      return '<button class="vchip' + (vaultFilter === c[0] ? " active" : "") + '" type="button" data-vfilter="' + c[0] + '" aria-pressed="' + (vaultFilter === c[0]) + '">' + c[1] + "</button>";
    }).join("");
    host.innerHTML =
      cbMonumentHTML(count, false) +
      cbPackMapHTML(done) +
      '<div class="vault-tools"><input class="vault-search" id="vaultSearch" type="search" autocomplete="off" placeholder="Search 100 packs — a theme, a round, a number…" aria-label="Search packs" value="' + esc(vaultQuery) + '" />' +
      '<div class="vault-chips" role="group" aria-label="Filter packs by progress">' + chips + "</div></div>" +
      '<div id="vaultPackZone"></div>' +
      '<p class="prof-sub" style="margin:16px 2px 0;">Signed in as <strong>' + esc(prof.name) + '</strong>. Pick a pack — each holds 100 drills. Type a drill line perfectly once to bank it.</p>';
    cbDrawMonument(done);
    Array.prototype.forEach.call(host.querySelectorAll("[data-mappack]"), function (b) {
      b.addEventListener("click", function () { cbOpenPack(parseInt(b.getAttribute("data-mappack"), 10)); });
    });
    var search = $("vaultSearch");
    search.addEventListener("input", function () { vaultQuery = search.value; cbRenderPackZone(); });
    Array.prototype.forEach.call(host.querySelectorAll("[data-vfilter]"), function (b) {
      b.addEventListener("click", function () {
        vaultFilter = b.getAttribute("data-vfilter");
        Array.prototype.forEach.call(host.querySelectorAll("[data-vfilter]"), function (x) {
          var on = x.getAttribute("data-vfilter") === vaultFilter;
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", on);
        });
        cbRenderPackZone();
      });
    });
    cbRenderPackZone();
    return;
  }
  if (vaultDrill < 0) {
    var pd2 = cbPackDone(vaultPack, done);
    var themeName = THEMES[Math.floor(vaultPack / 5)].name;
    var rows = vaultCache.map(function (d, j) {
      var g = vaultPack * 100 + j;
      return '<button class="drill-row' + (done[g] ? " done" : "") + '" type="button" data-drill="' + j + '"><span class="rnum">' + (j + 1) + '</span><span class="tick"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-check"/></svg></span><code>' + esc(d.line) + "</code></button>";
    }).join("");
    host.innerHTML =
      '<div class="session-bar">' +
        '<button class="back-btn" id="vaultBackPacks" type="button">' + VAULT_CHEV + 'All 100 packs</button>' +
        '<div class="block-chip drill-chip session-chip">' + (vaultPack + 1) + '</div>' +
        '<div class="session-id"><h2 class="drill-title">' + esc(cbPackName(vaultPack)) + '</h2><div class="drill-chapter">Pack ' + (vaultPack + 1) + ' of 100 · ' + esc(themeName) + '</div></div>' +
        '<div class="session-meta"><span class="session-pill reps-pill">' + pd2 + ' / 100 banked</span></div>' +
      '</div>' +
      '<div class="pack-meter"><div class="mastery-top"><span class="mastery-label">Pack progress</span><span class="pack-meter-num">' + pd2 + '%</span></div>' +
      '<div class="bar-track" style="margin-top:8px;" role="progressbar" aria-label="Pack progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pd2 + '" aria-valuetext="' + pd2 + ' of 100 drills banked"><div class="bar-fill" style="width:' + pd2 + '%"></div></div>' +
      '<p class="prof-sub" style="margin-top:9px;">Tap a drill and type it perfectly to bank it. Banked drills light up on the pack map and the dot wall.</p></div>' +
      '<div class="closet-drawer">' + rows + "</div>";
    $("vaultBackPacks").addEventListener("click", function () { vaultPack = -1; vaultCache = null; window.cbRenderVault(); });
    Array.prototype.forEach.call(host.querySelectorAll("[data-drill]"), function (b) {
      b.addEventListener("click", function () { vaultDrill = parseInt(b.getAttribute("data-drill"), 10); window.cbRenderVault(); });
    });
    return;
  }
  var drill = vaultCache[vaultDrill];
  var gIdx = vaultPack * 100 + vaultDrill;
  var packDoneNow = cbPackDone(vaultPack, done);
  host.innerHTML =
    '<div class="session-bar">' +
      '<button class="back-btn" id="vaultBackPack" type="button">' + VAULT_CHEV + 'Pack ' + (vaultPack + 1) + '</button>' +
      '<div class="block-chip drill-chip session-chip">' + (vaultDrill + 1) + '</div>' +
      '<div class="session-id"><h2 class="drill-title">' + esc(cbPackName(vaultPack)) + '</h2><div class="drill-chapter">Pack ' + (vaultPack + 1) + ' · ' + esc(THEMES[Math.floor(vaultPack / 5)].name) + '</div></div>' +
      '<div class="session-meta"><span class="session-pill">Drill ' + (vaultDrill + 1) + ' of 100</span><span class="session-pill reps-pill" id="vaultPackPill">' + packDoneNow + ' / 100 banked</span></div>' +
    '</div>' +
    '<div class="explain-card"><h3>Why this line?</h3><p>' + esc(drill.why) + '</p></div>' +
    '<div class="type-card drawer-open">' +
      '<div class="console-bar" aria-hidden="true"><span class="cdot"></span><span class="cdot"></span><span class="cdot"></span><span class="console-name">' + cbVaultFileName() + '</span></div>' +
      '<div class="type-label">Type this line — exactly</div>' +
      '<div class="target-line" id="vaultTarget" role="button" aria-label="The drill line to type"></div>' +
      '<div class="line-progress" aria-hidden="true"><div id="vaultLineFill"></div></div>' +
      '<div class="console-input"><span class="console-prompt" aria-hidden="true">›</span>' +
      '<input class="vault-input" id="vaultInput" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Type the drill line here" placeholder="Type the line here…" /></div>' +
      '<div class="drill-status" id="vaultMsg" aria-live="polite">' + (done[gIdx] ? "Already banked — type it again for practice, it still counts as a rep for your fingers." : "Type the line exactly. A wrong letter is gently refused, just like the Sandbox.") + '</div>' +
      '<button class="next-btn hidden" id="vaultNext" type="button">Next drill →</button>' +
    '</div>';
  var input = $("vaultInput"), target = $("vaultTarget"), fill = $("vaultLineFill");
  function paint() {
    var val = input.value, html = '<span class="word">';
    for (var i = 0; i < drill.line.length; i++) {
      var cls = i < val.length ? "ok" : i === val.length ? "next" : "todo";
      /* Loop 71 — a lone plain space as a span's only content
         collapses to zero width in the browser's whitespace
         processing, so Vault target lines rendered run-together
         (std::cout<<speed+rings;) even though the line itself was
         right. The Sandbox target has always mapped spaces to
         NBSP for exactly this reason; the Vault now does the
         same. Display only — comparisons still use drill.line. */
      var ch = drill.line.charAt(i);
      html += '<span class="ch ' + cls + '">' + (ch === " " ? "&nbsp;" : esc(ch)) + "</span>";
      if (ch === " ") html += '</span><span class="word">';
    }
    target.innerHTML = html + "</span>";
    /* Loop 50 — same fix as the Sandbox target line: the Vault
       target's label ("The drill line to type") hid the line
       itself from screen readers. Carry the line in the label,
       refreshed only when it changes (paint runs per keystroke). */
    var vLabel = "Drill line: " + drill.line + " — tap to start typing";
    if (target.getAttribute("aria-label") !== vLabel) target.setAttribute("aria-label", vLabel);
    target.classList.toggle("all-ok", val === drill.line);
    if (fill) fill.style.width = (drill.line.length ? (val.length / drill.line.length) * 100 : 0) + "%";
  }
  paint();
  input.focus();
  /* Loop 50 — opening a drill (or stepping to the next) swaps
     the whole Vault room and lands focus in the typing box;
     say which drill this is before the first letter. */
  if (window.cbAnnounce) window.cbAnnounce("Drill " + (vaultDrill + 1) + " of 100, pack " + (vaultPack + 1) + " — " + cbPackName(vaultPack) + ". Type the line to bank it.");
  var echoBanked = false;
  input.addEventListener("input", function () {
    /* Loop 54 — the same space fold as the Sandbox drill: a
       pasted, dictated or assistive-typed line can carry
       U+00A0 / U+202F where the drill line has a plain space,
       and the strict walk below would refuse it at the spot
       that looks right. One char for one char, positions kept. */
    var folded = cbFoldTyping(input.value, drill.line);
    if (folded !== input.value) input.value = folded;
    var val = input.value, i = 0;
    while (i < val.length && i < drill.line.length && val.charAt(i) === drill.line.charAt(i)) i++;
    if (val.length > i) {
      input.value = drill.line.slice(0, i);
      /* Loop 32: a refused letter dips the music, gently. */
      if (window.__musicEcho) window.__musicEcho("slip");
    } else if (input.value !== drill.line) {
      echoBanked = false;
      if (window.__musicEcho) window.__musicEcho("key");
    }
    paint();
    if (input.value === drill.line) {
      /* Loop 32: banking a drill answers like a perfect rep. */
      if (!echoBanked) { echoBanked = true; if (window.__musicEcho) window.__musicEcho("rep"); }
      var profNow = cbProfile();
      if (profNow) {
        var vk = CB_VAULT_KEY;
        if (!profNow[vk] || typeof profNow[vk] !== "object" || Array.isArray(profNow[vk])) profNow[vk] = {};
        profNow[vk][gIdx] = 1;
        cbSaveStore();
      }
      $("vaultMsg").textContent = "Banked! That is " + cbVaultCount().toLocaleString() + " of 10,000 Vault drills. Your fingers are learning.";
      var pill = $("vaultPackPill");
      if (pill) pill.textContent = cbPackDone(vaultPack, cbVaultDone()) + " / 100 banked";
      $("vaultNext").classList.remove("hidden");
    }
  });
  $("vaultBackPack").addEventListener("click", function () { vaultDrill = -1; window.cbRenderVault(); });
  $("vaultNext").addEventListener("click", function () {
    vaultDrill = (vaultDrill + 1) % 100;
    window.cbRenderVault();
  });
};

/* ---------- The Glossary: 309 words of C++ ---------- */
var GLOSSARY = window.CB_T ? CB_T.glossary : window.__isDrive ? DRIVE_GLOSSARY : window.__isCS ? CS_GLOSSARY : [
  ["abstract class", "A blueprint with at least one promised-but-unwritten function; you can build children from it, never the blueprint itself."],
  ["accumulate", "A Standard Library machine that adds a whole stretch of values into one running total."],
  ["address", "Where a variable lives in memory — a number the computer uses like a house number."],
  ["algorithm", "Any step-by-step method for getting a job done; also the header <algorithm> full of ready-made ones."],
  ["alias", "A second name for something that already exists, like a nickname for a type."],
  ["allocate", "To set aside memory for a program to use."],
  ["API", "The agreed surface of a library — the names and shapes you are invited to use."],
  ["argument", "The actual value you hand to a function when you call it."],
  ["arithmetic", "Math with numbers: adding, subtracting, multiplying, dividing."],
  ["array", "A fixed row of boxes of the same type, reached by number."],
  ["ASCII", "A classic table matching numbers to letters and symbols — 'A' is 65."],
  ["assert", "A test guard inside code: if its truth fails while testing, the program stops and points at the line."],
  ["assignment", "Putting a value into a variable with the = sign."],
  ["associativity", "The tie-breaking rule for which side of an expression is worked out first."],
  ["at", "Checked reaching: v.at(2) throws an error instead of wandering off the end of the row."],
  ["auto", "The keyword that lets the compiler deduce a variable's type from its starting value."],
  ["base case", "The stopping point of a recursive function — the smallest problem it answers directly."],
  ["base class", "The parent blueprint a child class inherits from."],
  ["begin", "Hands you an iterator pointing at the first item of a container."],
  ["benchmark", "A timed trial that measures how fast a piece of code really is."],
  ["binary", "Numbers written in base 2 — only 0s and 1s — the computer's native counting."],
  ["binary file", "A file of machine-ready bytes rather than human-readable text."],
  ["bit", "The smallest piece of information: a single 0 or 1."],
  ["bitwise operator", "An operator that works on the individual bits of a number: &, |, ^, ~, <<, >>."],
  ["block", "Lines fenced together by curly braces { } so they act as one group."],
  ["bool", "The type that holds exactly one of two values: true or false."],
  ["boolean", "Any yes/no, true/false value or question."],
  ["brace", "A curly fence mark, { or }, that groups lines together."],
  ["bracket", "A square mark, [ or ], used to reach into a row by number or open a lambda."],
  ["break", "The instruction that jumps out of a loop or switch right now."],
  ["buffer", "A holding shelf where data waits briefly — printed text often queues here before appearing."],
  ["buffer overflow", "Writing past the end of a row into memory that is not yours — a classic dangerous bug."],
  ["bug", "A mistake hiding in your instructions — the code says the wrong thing."],
  ["build", "The whole journey from source code to a running program."],
  ["build system", "A tool like Make or CMake that organizes compiling many files in the right order."],
  ["byte", "Eight bits bundled together — the standard unit of memory size."],
  ["call", "To run a function by naming it and handing it its inputs."],
  ["call stack", "The pile of functions currently mid-job, waiting for the one below to finish."],
  ["capacity", "How many items a container could hold before it must grow its storage."],
  ["capture", "A lambda borrowing variables from around itself, by value or by nickname."],
  ["case", "One labeled door inside a switch."],
  ["cast", "Telling the compiler to treat a value as a different type."],
  ["catch", "The safety net that receives an error thrown inside try."],
  ["char", "The type that holds a single character, written in single quotes."],
  ["cin", "The keyboard's ear: std::cin reads what the user types."],
  ["class", "A blueprint for a new kind of box, with data and machines inside."],
  ["code", "The instructions themselves — the text of a program."],
  ["comment", "A note for humans after // or between /* */; the compiler skips it."],
  ["commit", "A saved snapshot of your code in version control, with a note about what changed."],
  ["compile", "Translating source code into machine language, checking the rules as it goes."],
  ["compile error", "The compiler refusing your code because it breaks the language's rules."],
  ["compile time", "The stretch when the compiler is translating — before the program ever runs."],
  ["compiler", "The translator program that turns your code into machine language."],
  ["compound assignment", "Shortcuts like += and *= that change a box using its own value."],
  ["concatenate", "Gluing strings together end to end."],
  ["concurrency", "Several threads making progress at the same time, taking turns or truly in parallel."],
  ["condition", "A yes/no question that steers an if or a loop."],
  ["const", "A promise that a value will never change after it is set."],
  ["const correctness", "Marking things const wherever they should not change, so the compiler guards them."],
  ["constexpr", "A value worked out at compile time, before the program ever runs."],
  ["constructor", "The special machine that runs when an object is born, setting it up."],
  ["container", "A Standard Library holder of many items: vector, map, set, and friends."],
  ["continue", "Skip the rest of this loop lap and start the next one."],
  ["copy", "A photocopy of a value — changing the copy never touches the original."],
  ["copy assignment", "Copying a value into an object that already exists, using =."],
  ["copy constructor", "The machine that builds a new object as a copy of an existing one."],
  ["cout", "The screen's mouth: std::cout prints values for the user to see."],
  ["curly brace", "See brace — the { } fences that group code."],
  ["dangling pointer", "A signpost still pointing at a box that has been destroyed — following it is trouble."],
  ["dangling reference", "A nickname for a box that no longer exists."],
  ["data type", "The shape of a box: what kind of values it may hold."],
  ["deadlock", "Two threads each waiting for the other forever — a freeze with no villain but the design."],
  ["debug", "The detective work of finding and fixing bugs."],
  ["debugger", "A tool that runs your program slowly, pausing at breakpoints so you can peek inside."],
  ["declaration", "Announcing that something exists — its name and type — before it is fully built."],
  ["decrement", "Stepping a value down by one, with --."],
  ["default argument", "A stand-in input a function uses when the caller hands it nothing."],
  ["definition", "The full building of something: the declaration plus its body or value."],
  ["delete", "The instruction that gives back memory taken with new."],
  ["deque", "A container like a vector that also grows quickly at the front."],
  ["dereference", "Following a pointer with * to reach the real value at the address."],
  ["derived class", "A child blueprint built by inheriting from a base class."],
  ["destructor", "The special machine that runs when an object is tidied away."],
  ["deterministic", "Same input, same result, every single time — no dice involved."],
  ["do-while loop", "A loop that runs its code first, then asks if it should repeat."],
  ["documentation", "The written explanations that travel with code so humans can use it."],
  ["double", "The type for numbers with a decimal point, with room for big values."],
  ["dynamic", "Decided while the program runs, not when it is written or compiled."],
  ["element", "One item inside a container or array."],
  ["else", "The other road of an if — the code that runs when the answer is no."],
  ["empty", "Asking a container whether it holds nothing at all."],
  ["encapsulation", "Hiding a class's insides behind a small set of public handles."],
  ["end", "An iterator pointing just PAST the last item — the 'stop here' bookmark."],
  ["endl", "std::endl ends the printed line and flushes it to the screen."],
  ["enum", "A type made of a small set of named choices."],
  ["eof", "End of file: the signal that input has run out."],
  ["escape sequence", "A backslash code inside text, like \\n for a new line or \\t for a tab."],
  ["exception", "An error parcel thrown when something goes wrong, to be caught elsewhere."],
  ["exception type", "The named kind of an error parcel — std::out_of_range is one — so catch can choose which to catch."],
  ["executable", "The finished program file that a computer can run directly."],
  ["explicit", "Written out in full, on purpose — the opposite of automatic or hidden."],
  ["expression", "Any piece of code that works out to a value, like 2 + 3."],
  ["extern", "A promise that a variable exists in another file of the program."],
  ["fail state", "A stream's red flag after bad input; until cleared, the stream refuses to keep reading."],
  ["field", "A data member of a class — one of the parts inside the blueprint."],
  ["file", "A named bundle of bytes stored on a device."],
  ["find", "A Standard Library machine that hunts a stretch of values for one match."],
  ["fixed", "A printing instruction: always show the same number of digits after the decimal point."],
  ["float", "A decimal-point number type, smaller and less precise than double."],
  ["flowchart", "A diagram of steps and decisions — a program drawn as a map."],
  ["flush", "Forcing queued output out of the buffer and onto the screen or into the file, right now."],
  ["for loop", "The counting loop: start, keep-going rule, step."],
  ["format", "How values are dressed for printing — width, decimals, alignment."],
  ["friend", "A function or class a class trusts with its private insides."],
  ["front", "A container's first item — and the function that fetches it."],
  ["function", "A named machine: inputs go in, work happens, an answer may come back."],
  ["function call", "The moment a function is named with inputs and actually runs."],
  ["future", "A promise slip for an answer a thread will deliver later, when the work is done."],
  ["generic", "Written to work with many types at once, like templates are."],
  ["getline", "Reads a whole line of typing, spaces included, into a string."],
  ["getter", "A small function whose only job is to read one of a class's parts."],
  ["global", "Visible everywhere in the program, not fenced inside one function."],
  ["header", "A file of promises — declarations other files share with #include."],
  ["header guard", "The shield (#pragma once or #ifndef) that stops a header being pasted twice."],
  ["heap", "The big open memory warehouse where new builds boxes on demand."],
  ["hexadecimal", "Counting in base 16 — digits 0–9 then A–F — often written 0x…"],
  ["identifier", "A name you give to a variable, function, class, or other thing."],
  ["if statement", "The yes/no fork: run the braced code only when the answer is yes."],
  ["immutable", "Cannot be changed after creation — const values live this way."],
  ["implicit", "Happening automatically, without being written — like some type conversions."],
  ["include", "#include pastes a header's promises into your file before compiling."],
  ["increment", "Stepping a value up by one, with ++."],
  ["index", "A position number inside a row — counting starts at 0."],
  ["infinite loop", "A loop whose stopping question never turns false — it spins forever."],
  ["inheritance", "A child blueprint starting from everything a parent blueprint has."],
  ["initialization", "Giving a variable its first value at the moment it is born."],
  ["inline", "A hint that a small function's code be pasted at each call instead of jumped to."],
  ["input", "Information flowing into a program or function."],
  ["insert", "Filing a new item into a container."],
  ["instance", "One real thing built from a blueprint; an object is an instance of its class."],
  ["instantiation", "The moment the compiler stamps a real version from a template."],
  ["int", "The type for whole numbers: no halves, no decimal points."],
  ["integer division", "Dividing whole numbers and dropping the remainder: 7 / 2 is 3."],
  ["interface", "The public surface of a class — the handles others may use."],
  ["invalid", "Not allowed — a value or action the rules reject."],
  ["invalid_argument", "The error parcel thrown when a function is handed an input that makes no sense."],
  ["invariant", "A truth that must always hold — like a size never being negative."],
  ["invoke", "A formal word for calling a function."],
  ["iostream", "The header that fetches cout, cin, and the stream tools."],
  ["iteration", "One full lap of a loop."],
  ["iterator", "A bookmark that points at one spot inside a container and can step along."],
  ["iterator invalidation", "A container changing shape so its bookmarks point at stale spots — they must be re-fetched."],
  ["keyword", "A word the language keeps for itself: int, if, class, return, and friends."],
  ["lambda", "A tiny unnamed function you can fold into a variable."],
  ["library", "A whole collection of ready-made tools you can fetch and use."],
  ["lifetime", "The stretch of time a variable or object exists."],
  ["linker", "The tool that stitches compiled pieces into one finished program."],
  ["list", "A container of items chained together, quick to edit in the middle."],
  ["literal", "A value written directly in code: 42, 2.5, 'A', \"Hello\"."],
  ["literal suffix", "A letter tagged onto a literal to name its type — 2.5f is a float, 7u is unsigned."],
  ["local", "Living inside one function or block, invisible outside it."],
  ["logic error", "Code that compiles and runs but does the wrong thing — the sneaky bug kind."],
  ["long", "A whole-number type with extra room for very big values."],
  ["loop", "Any structure that repeats code: for, while, do-while."],
  ["lvalue", "Something with a lasting home in memory — you can take its address."],
  ["macro", "A preprocessor text trick: a name replaced by other text before compiling."],
  ["main", "The front door function — every program starts running at main."],
  ["make_unique", "Builds an object and hands it to a self-cleaning smart pointer."],
  ["manipulator", "A printing dresser like std::setw that adjusts how output looks."],
  ["map", "The container of labeled drawers: each key name opens one value."],
  ["member", "Anything living inside a class: its data parts and its machines."],
  ["member function", "A function that lives inside a class — a method."],
  ["memory", "The computer's workspace of numbered boxes where all values live."],
  ["memory leak", "Memory taken with new and never given back, piling up lost."],
  ["method", "Another name for a member function — a machine inside a class."],
  ["modulo", "The % operator: the remainder after division. 7 % 2 is 1."],
  ["move assignment", "Handing contents into an existing object with = and std::move, instead of copying."],
  ["move constructor", "The machine that builds a new object by taking another object's contents."],
  ["move semantics", "Handing contents over instead of photocopying them — fast for big values."],
  ["multiple inheritance", "A child blueprint inheriting from two parents at once — powerful, and easy to tangle."],
  ["mutable", "A member allowed to change even inside a const object."],
  ["mutex", "A lock that lets only one thread into a shared room at a time."],
  ["namespace", "A labeled drawer for names, so two scores never collide."],
  ["narrowing", "A conversion that loses information — pouring a double into an int drops the fraction."],
  ["nested", "One structure living inside another — a loop inside a loop."],
  ["new", "Asks for fresh memory while the program runs and returns its address."],
  ["noexcept", "A written promise that a function never throws."],
  ["null", "Nothing there — the value of a pointer holding no address."],
  ["nullptr", "The modern C++ word for 'this pointer points at nothing'."],
  ["object", "One real box built from a class blueprint."],
  ["object file", "One compiled piece of a program, waiting for the linker to stitch it."],
  ["object slicing", "Forcing a child object into a parent-shaped box, slicing away the child's extra parts."],
  ["off-by-one", "The classic counting bug: one too few or one too many, usually at a row's end."],
  ["operand", "A value an operator works on — in 2 + 3, the 2 and the 3."],
  ["operator", "A symbol that does work: +, ==, &&, <<, and friends."],
  ["operator overloading", "Teaching a symbol like + or == a meaning for your own class."],
  ["optimization", "The compiler quietly making your code faster or smaller without changing its meaning."],
  ["optional", "std::optional: a box that may hold a value or honestly hold nothing."],
  ["out_of_range", "The error parcel thrown when you reach past a container's end with at()."],
  ["output", "Information flowing out of a program — printed text, files, answers."],
  ["overflow", "A value growing past the biggest number its type can hold, and wrapping."],
  ["overload", "Several functions sharing one name, told apart by their inputs."],
  ["override", "A child class replacing a parent function with its own version."],
  ["ownership", "Who is responsible for tidying up a resource when it is done — the heart of RAII."],
  ["pair", "std::pair: one box with exactly two compartments."],
  ["parameter", "The named input slot in a function's definition."],
  ["parent class", "Another name for a base class — the blueprint a child inherits."],
  ["parsing", "The compiler reading your text and working out its structure, like diagramming a sentence."],
  ["pass by reference", "Handing a function the nickname, so it can change the original."],
  ["pass by value", "Handing a function a photocopy — the original is untouched."],
  ["platform", "The combination of machine and system your program runs on."],
  ["pointer", "A variable whose job is to hold an address — a signpost box."],
  ["polymorphism", "Many voices: the same call answered differently by different child classes."],
  ["portable", "Code that runs unchanged on many platforms — a C++ promise kept since 1998."],
  ["postcondition", "What a function guarantees will be true when it returns."],
  ["pragma", "A direct note to the compiler itself, like #pragma once."],
  ["precedence", "The ranking that decides which operator works first in an expression."],
  ["precondition", "What must already be true before a function is called for its promise to hold."],
  ["preprocessor", "The tool that runs before compiling, pasting includes and handling # lines."],
  ["priority queue", "A container that always hands you the most important item first."],
  ["private", "Class parts only the class itself may touch."],
  ["profiling", "Measuring where a running program spends its time, to find the slow spots."],
  ["program", "The full set of instructions you hand the computer."],
  ["promotion", "A small type automatically widened — a char becoming an int inside math."],
  ["protected", "Class parts open to the class and its children, closed to everyone else."],
  ["prototype", "A function's declaration — its name and shape — without its body."],
  ["pseudocode", "A code-shaped sketch in plain words, written to plan before you code."],
  ["public", "Class parts anyone may use — the handles on the outside."],
  ["push_back", "Growing a vector by one item at the end."],
  ["queue", "A container that serves items first-come, first-served, like a line at a bakery."],
  ["RAII", "The rule that a box's birth acquires a resource and its death releases it — tidy by design."],
  ["random", "Chosen by chance — std::rand and modern engines shuffle values unpredictably."],
  ["range", "A stretch of values from a start to an end."],
  ["range-for loop", "The loop that visits every item in a container with no counting."],
  ["reallocation", "A vector moving house: when it outgrows its storage, everything relocates to roomier memory."],
  ["recursion", "A function that calls itself, on a smaller problem each time."],
  ["refactoring", "Restructuring code without changing what it does — same behavior, cleaner shape."],
  ["reference", "A nickname: a second name tag on the very same box."],
  ["regression", "A bug that returns after it was fixed — or an old feature quietly breaking."],
  ["remainder", "What is left over after division — the answer % gives you."],
  ["repository", "The home folder of a project under version control, history included."],
  ["reserve", "Asking a vector to grow its capacity early, so later additions skip the moving house."],
  ["reserved word", "Another name for a keyword — the language keeps it for itself."],
  ["return", "Hands a function's answer back to whoever called it — and ends the function."],
  ["return type", "The kind of value a function promises to hand back."],
  ["reverse", "A machine that flips a stretch of values back to front."],
  ["rule of five", "If a class needs one of the copy/move/destructor machines, it probably needs all five considered."],
  ["rule of three", "The older trio: destructor, copy constructor, copy assignment — need one, think about all three."],
  ["run time", "The stretch while the program is actually running."],
  ["runtime_error", "std::runtime_error: the general-purpose error parcel for failures discovered while running."],
  ["rvalue", "A temporary value with no lasting home — a move can safely take its contents."],
  ["scope", "The region of code where a name can be seen and used."],
  ["segmentation fault", "The crash when a program reaches for memory it does not own."],
  ["semicolon", "The full stop of C++ — it ends a statement."],
  ["set", "A container that keeps every different item exactly once, in order."],
  ["setprecision", "A manipulator choosing how many digits a printed decimal shows."],
  ["setter", "A small function whose only job is to change one of a class's parts."],
  ["setw", "A manipulator giving a printed value a minimum width, padding with spaces."],
  ["shadowing", "An inner variable hiding an outer one with the same name."],
  ["short-circuit", "&& and || stopping early: once the answer is decided, the rest is skipped."],
  ["shrink_to_fit", "Asking a container to hand back spare capacity it is not using."],
  ["side effect", "Any change a function makes beyond handing back its answer — printing, editing a box, saving a file."],
  ["signed", "A number type that can hold negatives as well as positives."],
  ["smart pointer", "A pointer that tidies up its memory by itself: unique_ptr, shared_ptr."],
  ["sort", "Arranging values in order — and the Standard Library machine that does it."],
  ["source file", "A .cpp file of code written by a human."],
  ["stack", "Memory that piles function calls up and pops them off in reverse order."],
  ["stack overflow", "The call stack piling higher than its shelf allows — usually runaway recursion."],
  ["standard library", "The free, ready-made machinery that ships with C++ itself."],
  ["state", "The full picture of a program at one moment: every box's current value."],
  ["statement", "One complete instruction, usually ending in a semicolon."],
  ["static", "A value built once that keeps its value — or a member belonging to the class itself."],
  ["static_cast", "The tidy, explicit way to convert a value to another type."],
  ["std", "The namespace drawer where all the Standard Library tools live."],
  ["stream", "A flowing channel of data — cout and cin are streams."],
  ["string", "std::string: the box built for text, which can grow and shrink."],
  ["struct", "A class-like bundle whose parts are public by default."],
  ["substr", "Cuts a piece out of a string, starting at a chosen position."],
  ["switch", "The hallway of doors: looks at one value and opens the matching case."],
  ["syntax", "The spelling rules of the language — where every mark must go."],
  ["template", "A fill-in-the-blank recipe where a type is the blank."],
  ["ternary operator", "The one-line choice: question ? value-if-yes : value-if-no."],
  ["test", "A small check that runs code and verifies the answer — proof instead of hope."],
  ["thread", "A second path of execution running alongside the main one, sharing the same memory."],
  ["throw", "Raising an error parcel to be caught by a matching catch."],
  ["token", "The smallest meaningful crumb of code the compiler reads — a name, a number, a symbol."],
  ["translation unit", "One source file plus everything its includes paste in — compiled as one piece."],
  ["try", "Marks risky code so a thrown error jumps to catch instead of crashing."],
  ["tuple", "A box with a fixed handful of compartments, possibly of different types."],
  ["type deduction", "The compiler figuring out a type by itself — what auto asks it to do."],
  ["typedef", "An older way to give a type a second name."],
  ["undefined behavior", "Breaking the rules so deeply that the language promises nothing at all."],
  ["underflow", "A value shrinking below the smallest its type can hold."],
  ["unit test", "A test of one small piece — a single function, a single class — in isolation."],
  ["unordered_map", "A map that finds drawers by hashing names instead of sorting them — faster, unordered."],
  ["unsigned", "A number type that holds only zero and positives — with double the headroom."],
  ["using", "Brings a name out of its namespace drawer, or gives a type an alias."],
  ["value", "The thing inside a box: a number, a letter, a word, an answer."],
  ["variable", "A labeled box whose contents can change — it varies."],
  ["variant", "std::variant: a box holding one of several possible types at a time."],
  ["vector", "The growing list: a container that stretches and shrinks as needed."],
  ["version control", "A system, like Git, that remembers every change to your code and lets you travel back."],
  ["virtual", "Marks a function whose child-class version should answer at run time."],
  ["virtual destructor", "A destructor marked virtual so child objects are tidied fully through parent signposts."],
  ["void", "Nothing — a function with void hands back no answer."],
  ["warning", "The compiler frowning at legal-but-suspicious code. Worth listening to."],
  ["while loop", "The loop that repeats while its question stays true."],
  ["whitespace", "Spaces, tabs, and new lines — mostly invisible to the compiler."],
  ["wild pointer", "A pointer never given an address — it points at pure chance. Do not follow it."]
];

/* ---------- Field Guide: 20 more Standard Library tools ---------- */
var FIELDGUIDE = window.CB_T ? CB_T.field : window.__isDrive ? DRIVE_FIELD : window.__isCS ? CS_FIELD : [
  { name: "std::array", head: "<array>", what: "A fixed row of boxes that knows its own size and never grows — the plain array, dressed in container clothes so algorithms can visit it.", ex: "std::array<int, 3> row = {4, 8, 15};" },
  { name: "std::deque", head: "<deque>", what: "A double-ended queue: a growing row that adds items quickly at BOTH ends, front and back.", ex: "dq.push_front(1);  dq.push_back(2);" },
  { name: "std::list", head: "<list>", what: "A chain of items linked hand to hand. Slower to visit by number, but items can be added or removed mid-chain without moving anyone else.", ex: "trail.insert(it, 42);  // slip one in, mid-chain" },
  { name: "std::multiset", head: "<set>", what: "A set that allows repeats: every item is kept, duplicates included, all in sorted order.", ex: "std::multiset<int> bag = {3, 1, 3};" },
  { name: "std::unordered_set", head: "<unordered_set>", what: "A set that files items by a hash trick instead of sorting them — lookups are blazing fast, order is not promised.", ex: "seen.insert(7);  // have we met this one?" },
  { name: "std::stack", head: "<stack>", what: "A pile: you may only add to the top and take from the top. Last in, first out — like a stack of plates.", ex: "plates.push(3);  int top = plates.top();" },
  { name: "std::queue", head: "<queue>", what: "A fair line: first to arrive is first served. push joins the back, front is next up, pop sends them on their way.", ex: "line.push(9);  line.pop();  // 9 is served" },
  { name: "std::priority_queue", head: "<queue>", what: "A line where the most important item always jumps to the front — top() is always the biggest (or your chosen champion).", ex: "auto best = pq.top();  // the biggest, instantly" },
  { name: "std::tuple", head: "<tuple>", what: "A box with a fixed handful of compartments of different types — a pair's bigger sibling, for carrying three or more things together.", ex: "std::tuple<std::string, int, bool> card;" },
  { name: "std::optional", head: "<optional>", what: "A box that may hold a value or honestly hold nothing, so 'no answer' needs no fake -1 or empty string disguises.", ex: "if (found) { use(*found); }" },
  { name: "std::variant", head: "<variant>", what: "A box holding ONE of several possible types at a time — a number today, a word tomorrow, never both at once.", ex: "std::variant<int, std::string> slot = 42;" },
  { name: "std::string_view", head: "<string_view>", what: "A window that LOOKS at text without owning or copying it — fast reading of someone else's string.", ex: "std::string_view peek = name;  // no copy made" },
  { name: "std::count_if", head: "<algorithm>", what: "Counts only the items that pass your test — hand it a lambda describing what counts.", ex: "int big = std::count_if(v.begin(), v.end(), [](int n) { return n > 10; });" },
  { name: "std::transform", head: "<algorithm>", what: "Visits every item and replaces it with a changed version of itself — double everything, shout-case every word.", ex: "std::transform(v.begin(), v.end(), v.begin(), [](int n) { return n * 2; });" },
  { name: "std::accumulate", head: "<numeric>", what: "Folds a whole stretch into one answer, starting from a seed value: sums, products, even glued-together strings.", ex: "int sum = std::accumulate(v.begin(), v.end(), 0);" },
  { name: "std::min / std::max", head: "<algorithm>", what: "Two tiny referees: min hands back the smaller of two values, max the bigger. They also scan whole stretches for champions.", ex: "int lo = std::min(a, b);  int hi = std::max(a, b);" },
  { name: "std::swap", head: "<utility>", what: "Trades the contents of two boxes in one tidy move — the three-step shuffle of copying, done for you.", ex: "std::swap(left, right);  // contents traded" },
  { name: "std::sort with a lambda", head: "<algorithm>", what: "Sort's second gear: hand it your own rule for what 'in order' means — biggest first, shortest word first, anything.", ex: "std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });" },
  { name: "std::find_if", head: "<algorithm>", what: "Find's smarter sibling: hunts for the first item that passes your test instead of matching one exact value.", ex: "auto it = std::find_if(v.begin(), v.end(), [](int n) { return n < 0; });" },
  { name: "std::chrono", head: "<chrono>", what: "The stopwatch shelf: measure how long code takes, or ask the program to rest for a blink — in honest units like milliseconds.", ex: "auto t0 = std::chrono::steady_clock::now();" }
];

/* ---------- Cheat Sheets: 10 new cards ---------- */
var CHEATS = window.CB_T ? CB_T.cheats : window.__isDrive ? DRIVE_CHEATS : window.__isCS ? CS_CHEATS : [
  { title: "Decisions Card", body: "The if ladder and its cousins, on one card.", code: "if (a) { }\nelse if (b) { }\nelse { }\nint m = (a > b) ? a : b;" },
  { title: "Vector Moves Card", body: "The five moves a vector is asked for every day.", code: "v.push_back(9);      // grow at the end\nv.pop_back();        // shrink at the end\nv.size();            // how many?\nv.at(0);             // checked reach\nv.clear();           // empty it" },
  { title: "Map & Set Moves Card", body: "Drawers and one-of-each shelves, side by side.", code: "scores[\"V\"] = 10;    // open drawer V\nscores.count(\"V\");   // is there a V?\nseen.insert(7);       // file it in the set\nseen.count(7);        // 1 if present" },
  { title: "String Moves Card", body: "Text's daily toolkit.", code: "s.size();             // letter count\ns += \"!\";             // glue on the end\ns.substr(0, 3);       // cut a piece\ns.find(\"cat\");        // hunt for a word\nstd::getline(std::cin, s);  // whole line" },
  { title: "Function Shapes Card", body: "Four shapes cover most machines you will ever write.", code: "int add(int a, int b) { return a + b; }\nvoid cheer() { std::cout << \"Go!\"; }\nvoid heal(int& hp) { hp += 10; }\nint twice(int x = 2) { return x * 2; }" },
  { title: "Class & Object Card", body: "Blueprint, build, dot — the daily rhythm.", code: "class Bot {\npublic:\n    int size = 1;\n    void beep() { }\n};\nBot bit;\nbit.size = 5;" },
  { title: "Pointer & Reference Card", body: "Signposts and nicknames, one glance apart.", code: "int* p = &score;   // p holds the address\n*p = 9;            // change the real box\nint& nick = score; // a second name tag\nnick = 9;          // same box, same change" },
  { title: "Safety Net Card", body: "try, throw, catch — the whole net on one card.", code: "try {\n    risky();\n} catch (const std::exception& e) {\n    std::cout << e.what();\n}" },
  { title: "Template Card", body: "One recipe, every type — fill in the blank.", code: "template <typename T>\nT bigger(T a, T b) {\n    return (a > b) ? a : b;\n}\n// bigger(3, 9) → 9 · bigger(2.5, 1.5) → 2.5" },
  { title: "Lambda Card", body: "Tiny machines, folded on the spot.", code: "auto dbl = [](int x) { return x * 2; };\nauto addB = [&](int x) { return x + bonus; };\n// [] nothing borrowed · [&] borrow by nickname" }
];

/* ---------- Render glossary / field guide / cheat sheets ---------- */
(function cbRenderLibraryExtras() {
  var az = $("glossAZ"), list = $("glossList"), count = $("glossCount"), search = $("glossSearch");
  if (!az || !list) return;
  /* Loop 60 — the count used to be its own live region, so a
     screen-reader learner typing a search heard "Showing…"
     after every keystroke, talking over their own typing —
     two Phase F systems (the live region, the search box)
     colliding. The count is plain text now; the app's one
     voice (cbAnnounce) reports it once it settles — 700ms
     after the last keystroke, or at once for a letter jump
     or the empty-state reset. */
  var sayMode = null, sayTimer = 0;
  function sayCount() { if (window.cbAnnounce) window.cbAnnounce(count.textContent); }
  var letter = "All", query = "";
  var letters = ["All"];
  GLOSSARY.forEach(function (g) { var L = g[0].charAt(0).toUpperCase(); if (letters.indexOf(L) < 0) letters.push(L); });
  letters.sort(function (a, b) { return a === "All" ? -1 : b === "All" ? 1 : a < b ? -1 : 1; });
  az.innerHTML = letters.map(function (L) {
    return '<button type="button" data-letter="' + L + '"' + (L === letter ? ' class="sel"' : "") + ' aria-pressed="' + (L === letter ? "true" : "false") + '">' + L + "</button>";
  }).join("");
  function draw() {
    var q = query.trim().toLowerCase();
    var hits = GLOSSARY.filter(function (g) {
      if (letter !== "All" && g[0].charAt(0).toUpperCase() !== letter) return false;
      if (q && g[0].toLowerCase().indexOf(q) < 0 && g[1].toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var shown = hits.slice(0, 80);
    list.innerHTML = shown.map(function (g) {
      return '<div class="gloss-item"><b>' + esc(g[0]) + "</b><p>" + esc(g[1]) + "</p></div>";
    }).join("") || '<div class="empty-state"><span class="es-ico" aria-hidden="true"><svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-search"/></svg></span><p class="es-title">No word matches that search</p><p class="es-body">Try a shorter piece of the word — or clear the search and browse all ' + GLOSSARY.length + ' words again.</p><div class="es-action"><button class="ghost-btn" type="button" data-gloss-clear="1">Show all words</button></div></div>';
    var clr = list.querySelector("[data-gloss-clear]");
    if (clr) clr.addEventListener("click", function () {
      query = ""; letter = "All"; search.value = "";
      Array.prototype.forEach.call(az.children, function (el) { el.classList.toggle("sel", el.getAttribute("data-letter") === "All"); });
      sayMode = "now"; draw();
    });
    count.textContent = "Showing " + shown.length + " of " + hits.length + " matching words · " + GLOSSARY.length + " words in the full glossary.";
    if (sayMode === "now") { sayMode = null; sayCount(); }
    else if (sayMode === "later") { sayMode = null; clearTimeout(sayTimer); sayTimer = setTimeout(sayCount, 700); }
    /* Loop 50 — the letter buttons showed their state with a
       class alone; keep aria-pressed in step on every draw
       (letter jumps, searches, and the empty-state reset). */
    Array.prototype.forEach.call(az.children, function (el) { el.setAttribute("aria-pressed", String(el.getAttribute("data-letter") === letter)); });
  }
  az.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-letter]"); if (!b) return;
    letter = b.getAttribute("data-letter");
    Array.prototype.forEach.call(az.children, function (el) { el.classList.toggle("sel", el.getAttribute("data-letter") === letter); });
    sayMode = "now"; draw();
  });
  search.addEventListener("input", function () { query = search.value; sayMode = "later"; draw(); });
  draw();
  $("fieldList").innerHTML = FIELDGUIDE.map(function (f) {
    return '<div class="field-card"><h4><code>' + esc(f.name) + "</code> · " + esc(f.head) + "</h4><p>" + esc(f.what) + '</p><span class="fx">' + esc(f.ex) + "</span></div>";
  }).join("");
  $("cheatList").innerHTML = CHEATS.map(function (c) {
    return '<div class="cheat-card"><h4>' + esc(c.title) + "</h4><p>" + esc(c.body) + '</p><span class="fx">' + esc(c.code) + "</span></div>";
  }).join("");
})();

/* ---------- Init ---------- */
cbUpdateMenuLabel();
if (cbProfile() && window.__refreshWorld) window.__refreshWorld();
