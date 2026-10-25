"use strict";
/* ================= Online accounts =================
   Where the site runs with its server (server/ in Python, or api/ in
   PHP, on MySQL), a learner can make a free online account: a username
   and a password, with a one-time recovery code instead of an email.
   The page knows a server is there from the <meta name="cb-api"> tag
   the server adds to it; elsewhere (a static host, the single-file
   build, a file on disk) all of this stays out of sight and profiles
   work on the device alone, exactly as before.

   An account is a profile like any other on this device (cbStore, in
   js/profiles-vault.js) with an `account` field linking it, so the
   Vault, the member shelves and saving work just as they always have.
   On top of that:
   - progress — every track's mastered blocks and Vault drills, and the
     typing record (XP, streak, trophies) — is saved to the account and
     merged on each device it signs in on, never losing either side's;
   - every finished line goes to the server as an event (XP, speed,
     the learner's day), which keeps the account's level, streak and
     place on the leaderboard; lines typed offline wait and go later;
   - the profile room gains the account card and the leaderboard, and
     the Sandbox shows how many lines everyone has typed today.
   Lines finished without an account are counted too, as a bare number
   for that total: no name and nothing about the learner. */
(function cbAccounts() {
  var API = "api/index.php?r=";
  var OUTBOX_KEY = "code-block-outbox-v1";
  var VAULT_SIZE = 10000;
  var GOAL = typeof REPS_GOAL === "number" ? REPS_GOAL : 8;
  var OFFLINE = "Can't reach Code Block's server right now. Check your connection, then try again.";
  var meta = document.querySelector('meta[name="cb-api"]');
  var hinted = !!meta;
  var usable = !window.__cbBundled && /^https?:$/.test(location.protocol);

  var available = false;   // the server answered, with its database
  var checked = false;     // health has been asked
  var answered = false;    // ... and has answered, one way or the other
  var me = null;           // the signed-in account, as the server last described it
  var needsLogin = false;  // the active profile is an account the server says is signed out
  var pendingCode = null;  // a recovery code on screen until the learner says it's saved
  var mode = "signup";     // the form: "signup", "login" or "recover"
  var prefill = "";        // the username to offer on the log-in form
  var focusNext = "";      // what to focus once the room is drawn again
  var busy = false;
  var syncedAt = 0;
  var stats = null;
  var board = { week: null, all: null };
  var period = "week";
  var boardAt = 0;

  function $(id) { return document.getElementById(id); }
  function icon(id) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function say(msg) { if (window.cbAnnounce) window.cbAnnounce(msg); }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function localDay() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function plural(n, word) { return n.toLocaleString() + " " + word + (n === 1 ? "" : "s"); }

  /* ---------- Talking to the server ---------- */
  /* how: { anon: send no cookie, keepalive: finish even if the page closes } */
  function call(method, route, body, query, how) {
    how = how || {};
    var opts = { method: method, credentials: how.anon ? "omit" : "same-origin", cache: "no-store", headers: { "X-Code-Block": "1" } };
    if (how.keepalive) opts.keepalive = true;
    if (method === "POST") { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body || {}); }
    return fetch(API + route + (query || ""), opts).then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data && typeof data === "object" ? data : {} }; },
        function () { return { status: res.status, data: {} }; });
    });
  }
  function words(r) { return (r && r.data && r.data.message) || OFFLINE; }

  /* ---------- Who is here ---------- */
  function linkedProfile() {
    var p = cbProfile();
    return p && p.account && typeof p.account.id === "number" && typeof p.account.username === "string" ? p : null;
  }
  function signedIn() { var p = linkedProfile(); return !!(p && me && me.id === p.account.id); }

  /* The profile on this device that belongs to account u, made if needed.
     A profile left over from an older account of the same name is kept,
     renamed, as a plain profile on this device. */
  function profileKeyFor(u) {
    var names = Object.keys(cbStore.profiles);
    for (var i = 0; i < names.length; i++) {
      var pr = cbStore.profiles[names[i]];
      if (pr.account && pr.account.id === u.id) return names[i];
    }
    var key = "@" + u.username;
    if (cbStore.profiles[key]) {
      var n = 1, old;
      do { old = u.username + " (earlier" + (n > 1 ? " " + n : "") + ")"; n++; } while (cbStore.profiles[old]);
      cbStore.profiles[old] = cbStore.profiles[key];
      cbStore.profiles[old].name = old;
      delete cbStore.profiles[old].account;
    }
    var colors = typeof AVATAR_COLORS !== "undefined" ? AVATAR_COLORS : ["#1d4ed8"];
    var h = 0;
    for (var c = 0; c < u.username.length; c++) h = (h * 31 + u.username.charCodeAt(c)) >>> 0;
    cbStore.profiles[key] = { name: u.username, color: colors[h % colors.length], account: { id: u.id, username: u.username } };
    return key;
  }

  /* Make a profile the active one: its progress on screen, its name in the menu. */
  function activate(key) {
    cbStore.active = key;
    baseSaveStore();
    state = sanitizeState(cbStore.profiles[key][CB_PROG_KEY]);
    refreshProgress();
    cbUpdateMenuLabel();
    if (window.__refreshWorld) window.__refreshWorld();
    if (window.CBFX) window.CBFX.repaint();
  }

  function took(user) {
    me = user;
    needsLogin = false;
    if (window.CBFX) window.CBFX.adopt({ xp: user.xp, streak: user.streak, bestWpm: user.bestWpm, lastDay: user.lastDay });
  }

  function signedOut() {
    me = null;
    if (linkedProfile()) needsLogin = true;
    paint();
  }

  /* After sign-up, log-in or recovery: link this device's profile to the
     account, then bring both sides' progress together. A new account
     made by a guest takes the guest's progress along, the way a new
     profile on this device always has; logging in never does. */
  function arrive(user, isNew) {
    var p = cbProfile();
    var fromGuest = false;
    var key;
    if (isNew && p && !p.account) {
      p.account = { id: user.id, username: user.username };
      key = cbStore.active;
    } else {
      key = profileKeyFor(user);
      if (isNew && !p) {
        cbStore.profiles[key][CB_PROG_KEY] = JSON.parse(JSON.stringify(state));
        fromGuest = true;
      }
    }
    me = user;
    sent = {};
    activate(key);
    if (fromGuest && window.CBFX) window.CBFX.carry("guest");
    took(user);
    pull();
    flush();
    focusNext = pendingCode ? "code" : "card";
    window.cbRenderProfile();
  }

  /* ---------- Progress, kept in step with the account ----------
     Each track is saved as { reps, celebrated, vault }: the blocks'
     rep counts, the masterpiece flag, and the Vault's 10,000 drills as
     a bitmap (about 1.7 KB when full). Merging takes the higher count
     and every banked drill from either side, so nothing is ever lost. */
  function packVault(v) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return "";
    var bytes = new Uint8Array(VAULT_SIZE / 8), any = false;
    for (var k in v) {
      var i = Number(k);
      if (Math.floor(i) === i && i >= 0 && i < VAULT_SIZE) { bytes[i >> 3] |= 1 << (i & 7); any = true; }
    }
    if (!any) return "";
    var s = "";
    for (var j = 0; j < bytes.length; j++) s += String.fromCharCode(bytes[j]);
    return btoa(s);
  }
  function unpackVault(text, into) {
    if (typeof text !== "string" || !text) return 0;
    var s;
    try { s = atob(text); } catch (e) { return 0; }
    var added = 0;
    for (var j = 0; j < s.length && j < VAULT_SIZE / 8; j++) {
      var b = s.charCodeAt(j);
      for (var bit = 0; b && bit < 8; bit++) {
        if (b & (1 << bit) && !into[j * 8 + bit]) { into[j * 8 + bit] = 1; added++; }
      }
    }
    return added;
  }
  function trackPayload(prog, vault) {
    var reps = {}, celebrated = false;
    if (prog && typeof prog === "object") {
      celebrated = !!prog.celebrated;
      if (prog.reps && typeof prog.reps === "object") {
        for (var k in prog.reps) {
          var n = Math.floor(Number(prog.reps[k]));
          if (/^\d{1,4}$/.test(k) && isFinite(n) && n > 0) reps[k] = Math.min(n, GOAL);
        }
      }
    }
    return { reps: reps, celebrated: celebrated, vault: packVault(vault) };
  }
  function payloadFor(p, id) {
    if (id === "fx") return window.CBFX ? window.CBFX.syncData() : null;
    var m = window.cbTrackMeta(id);
    return m ? trackPayload(p[m.profileProg], p[m.profileVault]) : null;
  }
  function mergeTrack(p, m, remote) {
    var r = trackPayload(remote, null), changed = false;
    var prog = p[m.profileProg];
    if (!prog || typeof prog !== "object") prog = p[m.profileProg] = { reps: {}, celebrated: false };
    if (!prog.reps || typeof prog.reps !== "object") prog.reps = {};
    for (var k in r.reps) if (!(prog.reps[k] >= r.reps[k])) { prog.reps[k] = r.reps[k]; changed = true; }
    if (r.celebrated && !prog.celebrated) { prog.celebrated = true; changed = true; }
    var vault = p[m.profileVault];
    if (!vault || typeof vault !== "object" || Array.isArray(vault)) vault = p[m.profileVault] = {};
    if (unpackVault(remote.vault, vault)) changed = true;
    return changed;
  }

  var sent = {};
  function push(ids, keepalive) {
    var p = linkedProfile();
    if (!p || !signedIn()) return;
    ids.forEach(function (id) {
      var data = payloadFor(p, id);
      /* Nothing done on a track yet: nothing to save (merging only ever
         adds, so the server has nothing there either). */
      if (!data || id !== "fx" && !data.celebrated && !data.vault && !Object.keys(data.reps).length) return;
      var text = JSON.stringify(data);
      if (sent[id] === text) return;
      call("POST", "progress", { track: id, data: data }, "", { keepalive: keepalive }).then(function (r) {
        if (r.status === 200) { sent[id] = text; syncedAt = Date.now(); paintSync(); }
        else if (r.status === 401) signedOut();
      }, function () { /* offline: the next save tries again */ });
    });
  }
  function pull() {
    var p = linkedProfile();
    if (!p || !signedIn()) return;
    var id = p.account.id;
    call("GET", "progress").then(function (r) {
      if (r.status === 401) { signedOut(); return; }
      var now = linkedProfile();
      if (r.status !== 200 || !now || now.account.id !== id) return;
      var tracks = r.data.tracks && typeof r.data.tracks === "object" ? r.data.tracks : {};
      var here = false;
      Object.keys(tracks).forEach(function (t) {
        var remote = tracks[t] && tracks[t].data;
        if (!remote || typeof remote !== "object") return;
        if (t === "fx") { if (window.CBFX) window.CBFX.mergeSync(remote); return; }
        var m = window.cbTrackMeta(t);
        if (!m) return;
        if (mergeTrack(now, m, remote) && t === CB_META.id) here = true;
        var mine = JSON.stringify(payloadFor(now, t));
        var theirs = trackPayload(remote, null);
        theirs.vault = typeof remote.vault === "string" ? remote.vault : "";
        if (mine === JSON.stringify(theirs)) sent[t] = mine;
      });
      baseSaveStore();
      if (here) {
        state = sanitizeState(now[CB_PROG_KEY]);
        refreshProgress();
        if (window.__refreshWorld) window.__refreshWorld();
      }
      syncedAt = Date.now();
      var ids = ["fx"];
      window.CB_TRACK_LIST.forEach(function (m) { if (now[m.profileProg] || now[m.profileVault]) ids.push(m.id); });
      push(ids);
      paintSync();
    }, function () {});
  }
  /* Every save on this device (a rep, a banked Vault drill) sends the
     active track a moment later; a burst of reps makes one request. */
  var pushTimer = 0;
  function schedulePush() {
    if (!signedIn()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { push([CB_META.id, "fx"]); }, 2500);
  }
  var baseSaveStore = window.cbSaveStore;
  window.cbSaveStore = function () { baseSaveStore(); schedulePush(); };
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && pushTimer) { clearTimeout(pushTimer); pushTimer = 0; push([CB_META.id, "fx"], true); }
    if (document.visibilityState === "visible") tick();
  });

  /* ---------- Finished lines ---------- */
  var outbox = {};
  try {
    var saved = JSON.parse(localStorage.getItem(OUTBOX_KEY) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      Object.keys(saved).forEach(function (k) { if (Array.isArray(saved[k])) outbox[k] = saved[k].slice(-300); });
    }
  } catch (e) {}
  function saveOutbox() { try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox)); } catch (e) {} }
  var flushing = false, retryTimer = 0;
  function flush() {
    var p = linkedProfile();
    if (flushing || !p || !signedIn()) return;
    var box = outbox[p.account.id];
    if (!box || !box.length) return;
    flushing = true;
    call("POST", "event", box[0]).then(function (r) {
      flushing = false;
      if (r.status === 200 || r.status === 400) {
        box.shift();
        saveOutbox();
        if (r.data.user) { took(r.data.user); paintStats(); }
        flush();
      } else if (r.status === 401) signedOut();
      else later();
    }, function () { flushing = false; later(); });
  }
  function later() { clearTimeout(retryTimer); retryTimer = setTimeout(flush, 30000); }
  window.addEventListener("online", function () { flush(); });

  document.addEventListener("cb:fx", function (e) {
    var d = e.detail || {};
    if (!available || d.pasted) return;
    var ev = { kind: d.kind, track: d.track || CB_META.id, xp: Math.max(0, Math.round(d.xp || 0)), wpm: Math.max(0, Math.round(d.wpm || 0)), day: localDay() };
    if (stats) { stats.drillsToday++; stats.drillsAll++; paintLive(); }
    var p = linkedProfile();
    if (p) {
      var box = outbox[p.account.id] || (outbox[p.account.id] = []);
      box.push(ev);
      if (box.length > 300) box.shift();
      saveOutbox();
      flush();
    } else {
      /* Without the cookie: this browser may still be logged in to an
         account while someone types as a guest or another profile. */
      call("POST", "event", ev, "", { anon: true }).then(function () {}, function () {});
    }
  });

  /* ---------- The live numbers and the leaderboard ---------- */
  function loadStats() {
    return call("GET", "stats").then(function (r) { if (r.status === 200) { stats = r.data; paintLive(); paintBoard(); } }, function () {});
  }
  function loadBoard(force) {
    if (!force && Date.now() - boardAt < 20000 && board[period]) return;
    boardAt = Date.now();
    var want = period;
    call("GET", "leaderboard", null, "&period=" + want).then(function (r) {
      if (r.status === 200) { board[want] = r.data; paintBoard(); }
    }, function () {});
  }
  function roomOpen() { var v = $("profileView"); return !!v && !v.classList.contains("hidden"); }
  function tick() {
    if (document.visibilityState === "hidden") return;
    /* A server that was resting when the page opened is asked again. */
    if (!available) { if (hinted && answered) boot(); return; }
    loadStats();
    if (roomOpen()) loadBoard(true);
  }
  setInterval(tick, 60000);

  function paintLive() {
    var strip = $("liveStrip");
    if (!strip) return;
    if (!available || !stats) { strip.classList.add("hidden"); return; }
    strip.classList.remove("hidden");
    $("liveToday").textContent = stats.drillsToday.toLocaleString();
    $("liveTodayWord").textContent = stats.drillsToday === 1 ? " line typed today on Code Block" : " lines typed today on Code Block";
    $("liveOnline").textContent = stats.online ? plural(stats.online, "member") + " online" : plural(stats.learners, "member");
  }
  function boardRow(r) {
    var medal = r.rank <= 3 ? " medal-" + r.rank : "";
    return '<li class="board-row' + (r.me ? " me" : "") + '">' +
      '<span class="board-rank' + medal + '">' + r.rank + "</span>" +
      '<span class="board-who"><b>' + esc(r.username) + (r.me ? ' <span class="board-you">you</span>' : "") + "</b>" +
      "<span>Level " + r.level + (r.streak > 1 ? " · " + r.streak + "-day streak" : "") + "</span></span>" +
      '<span class="board-xp">' + r.xp.toLocaleString() + " XP</span></li>";
  }
  function paintBoard() {
    var host = $("boardSection");
    if (!host) return;
    if (!available) { host.classList.add("hidden"); return; }
    host.classList.remove("hidden");
    var b = board[period];
    var rows = !b ? '<p class="board-empty">Loading the board…</p>' : b.rows.length
      ? '<ol class="board-list">' + b.rows.map(boardRow).join("") + "</ol>"
      : '<p class="board-empty">' + (period === "week" ? "No one is on this week's board yet. Type a few lines and the top spot is yours." : "The board is empty so far. Be the first name on it!") + "</p>";
    var mine = "";
    if (b && b.me && signedIn()) {
      mine = b.me.public
        ? "You're <b>#" + b.me.rank + "</b> " + (period === "week" ? "this week" : "of all time") + " with <b>" + b.me.xp.toLocaleString() + " XP</b>."
        : "You'd be <b>#" + b.me.rank + "</b> with " + b.me.xp.toLocaleString() + " XP. Your name is hidden from the board; switch it on in your account above.";
    } else if (!signedIn()) {
      mine = 'Make a free account to put your name on the board. <button type="button" class="board-join" id="boardJoin">Create an account</button>';
    }
    var live = stats ? '<p class="board-live">' + icon("i-zap") + "<span>" + plural(stats.drillsToday, "line") + " typed today · " +
      plural(stats.learners, "member") + " · " + stats.online.toLocaleString() + " online now</span></p>" : "";
    host.innerHTML =
      '<div class="board-head"><h3 id="boardTitle">' + icon("i-trophy") + "Leaderboard</h3>" +
      '<div class="board-tabs" role="group" aria-label="Leaderboard period">' +
      '<button type="button" data-period="week" aria-pressed="' + (period === "week") + '">This week</button>' +
      '<button type="button" data-period="all" aria-pressed="' + (period === "all") + '">All time</button></div></div>' +
      '<p class="board-hint">XP comes from typing lines: more for perfect lines, long combos and mastering a block. This week means the last seven days.</p>' +
      rows + (mine ? '<p class="board-me">' + mine + "</p>" : "") + live;
    Array.prototype.forEach.call(host.querySelectorAll("[data-period]"), function (btn) {
      btn.addEventListener("click", function () {
        period = btn.getAttribute("data-period");
        paintBoard();
        loadBoard(false);
      });
    });
    var join = $("boardJoin");
    if (join) join.addEventListener("click", function () { mode = "signup"; paint(); var f = $("acctUser"); if (f) { f.scrollIntoView({ block: "center" }); f.focus({ preventScroll: true }); } });
  }

  /* ---------- The account card ---------- */
  function msg(text, bad) {
    var el = $("acctMsg");
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("err", !!bad);
  }
  function paintSync() {
    var el = $("acctSync");
    if (!el) return;
    el.textContent = syncedAt ? "Saved to your account · " + new Date(syncedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Saving to your account…";
  }
  /* The card shows the learner's own record, as the progress strip does:
     the server's numbers, or this device's where they're ahead (a line
     typed as a guest just before signing up, say). Lines typed counts
     the account's lines on every device. */
  function paintStats() {
    var host = $("acctStats");
    if (!host || !me) return;
    var fx = window.CBFX ? window.CBFX.progress() : {};
    var xp = Math.max(me.xp, fx.xp || 0), streak = Math.max(me.streak, fx.streak || 0), wpm = Math.max(me.bestWpm, fx.bestWpm || 0);
    var lv = window.CBFX ? window.CBFX.levelOf(xp) : me.level;
    host.innerHTML =
      '<div class="prof-stat"><b>Level ' + lv + "</b><span>" + xp.toLocaleString() + " XP</span></div>" +
      '<div class="prof-stat"><b>' + plural(streak, "day") + "</b><span>Streak · best " + Math.max(me.bestStreak, streak) + "</span></div>" +
      '<div class="prof-stat"><b>' + (wpm ? wpm + " wpm" : "—") + "</b><span>Best speed</span></div>" +
      '<div class="prof-stat"><b>' + me.drills.toLocaleString() + "</b><span>Lines typed</span></div>";
  }
  function passField(id, label, auto, hint) {
    return '<label class="prof-label" for="' + id + '">' + label + "</label>" +
      '<div class="acct-pass"><input class="prof-input" id="' + id + '" type="password" autocomplete="' + auto + '" maxlength="128" required>' +
      '<button type="button" class="acct-show" data-show="' + id + '" aria-pressed="false" aria-label="Show the password">' + icon("i-eye") + "</button></div>" +
      (hint ? '<p class="acct-hint">' + hint + "</p>" : "");
  }
  function userField(value, hint) {
    return '<label class="prof-label" for="acctUser">Username</label>' +
      '<input class="prof-input" id="acctUser" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="20" required value="' + esc(value || "") + '">' +
      (hint ? '<p class="acct-hint">' + hint + "</p>" : "");
  }
  function codeCard() {
    return '<div class="prof-card acct-code-card" role="group" aria-labelledby="acctCodeTitle">' +
      '<h3 id="acctCodeTitle">' + icon("i-key") + "Save your recovery code</h3>" +
      '<p class="prof-sub">If you ever forget your password, this code is the only way back in: there is no email to reset it. Write it down or keep it somewhere safe. It is shown just this once, and works one time.</p>' +
      '<p class="acct-code" id="acctCode">' + esc(pendingCode) + "</p>" +
      '<div class="acct-row"><button type="button" class="ghost-btn" id="acctCopy">Copy the code</button>' +
      '<button type="button" class="big-btn" id="acctCodeDone">I’ve saved it</button></div></div>';
  }

  function paint() {
    var host = $("accountMain");
    if (!host) return;
    if (!available) {
      var lp = linkedProfile();
      host.innerHTML = lp && answered
        ? '<p class="acct-note">' + icon("i-cloud") + "<span>Online saving is resting right now. Everything you do is kept on this device and goes to <b>@" + esc(lp.account.username) + "</b> next time the server answers.</span></p>"
        : "";
      return;
    }
    var p = cbProfile();
    var html = pendingCode ? codeCard() : "";
    if (signedIn()) {
      html += '<div class="prof-card acct-card">' +
        '<div class="acct-head"><span class="acct-badge">' + icon("i-cloud") + "Online account</span>" +
        '<p class="prof-name" id="acctName" tabindex="-1">@' + esc(me.username) + "</p>" +
        '<p class="prof-sub">Your progress is saved to your account. Log in on any phone or computer to pick up where you left off.</p></div>' +
        '<div class="prof-stats" id="acctStats"></div>' +
        '<p class="acct-sync" id="acctSync" aria-live="off"></p>' +
        '<label class="acct-check"><input type="checkbox" id="acctPublic"' + (me.public ? " checked" : "") + "><span>Show my name on the leaderboard</span></label>" +
        '<details class="acct-more" id="acctPassBox"><summary>Change password</summary><form id="acctPassForm" novalidate>' +
        passField("acctPassOld", "Current password", "current-password") +
        passField("acctPassNew", "New password", "new-password", "At least 8 characters. Other devices will be logged out.") +
        '<button class="big-btn" type="submit">Change password</button></form></details>' +
        '<div class="acct-row"><button type="button" class="ghost-btn" id="acctLogout">' + icon("i-log-out") + "Log out</button>" +
        '<button type="button" class="ghost-btn danger" id="acctDelete">Delete account</button></div>' +
        '<form class="acct-delete hidden" id="acctDeleteForm" novalidate><p class="prof-sub"><b>This deletes @' + esc(me.username) + " for good:</b> its progress, XP and place on the board, on every device. There is no undo.</p>" +
        passField("acctDeletePass", "Type your password to confirm", "current-password") +
        '<div class="acct-row"><button type="button" class="ghost-btn" id="acctDeleteCancel">Keep my account</button>' +
        '<button type="submit" class="ghost-btn danger-fill">Delete forever</button></div></form>' +
        '<p class="prof-msg" id="acctMsg" aria-live="polite"></p></div>';
      host.innerHTML = html;
      paintStats();
      paintSync();
      wireSignedIn();
    } else {
      var lp2 = linkedProfile();
      if (lp2) mode = mode === "recover" ? "recover" : "login";
      var title, sub, form;
      if (mode === "login") {
        title = lp2 ? "Log in to @" + esc(lp2.account.username) : "Welcome back";
        sub = lp2 ? "You were logged out on this device. Your progress here is safe; log in to keep it saving to your account." : "Log in to bring your progress to this device.";
        form = userField(lp2 ? lp2.account.username : prefill) + passField("acctPass", "Password", "current-password") +
          '<button class="big-btn" type="submit" id="acctGo">Log in</button>' +
          '<button type="button" class="acct-link" data-mode="recover">Forgot your password?</button>';
      } else if (mode === "recover") {
        title = "Reset your password";
        sub = "Type the recovery code you saved when you signed up, then choose a new password. You'll get a fresh code.";
        form = userField(lp2 ? lp2.account.username : prefill) +
          '<label class="prof-label" for="acctCodeIn">Recovery code</label>' +
          '<input class="prof-input acct-code-in" id="acctCodeIn" type="text" autocomplete="one-time-code" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="40" placeholder="XXXX-XXXX-XXXX-XXXX" required>' +
          passField("acctPass", "New password", "new-password", "At least 8 characters.") +
          '<button class="big-btn" type="submit" id="acctGo">Reset my password</button>' +
          '<button type="button" class="acct-link" data-mode="login">Back to log in</button>';
      } else {
        var local = p && !p.account;
        title = local ? "Save " + esc(p.name) + " online" : "Create your free account";
        sub = local
          ? "Make an online account for this profile: everything " + esc(p.name) + " has done comes with you, saved to your account and ready on any device."
          : "Save your progress online, use it on any device, and join the leaderboard. Everything you've done here so far comes with you.";
        form = userField(local ? suggestName(p.name) : "", "3 to 20 letters, numbers, dots, dashes or underscores. Others see it on the leaderboard.") +
          passField("acctPass", "Password", "new-password", "At least 8 characters. A short sentence is easy to remember and hard to guess.") +
          '<label class="acct-check"><input type="checkbox" id="acctPublicNew" checked><span>Show my name on the leaderboard</span></label>' +
          '<button class="big-btn" type="submit" id="acctGo">Create my account</button>';
      }
      var tabs = lp2 ? "" : '<div class="acct-tabs" role="group" aria-label="Account">' +
        '<button type="button" data-mode="signup" aria-pressed="' + (mode === "signup") + '">New here? Sign up</button>' +
        '<button type="button" data-mode="login" aria-pressed="' + (mode !== "signup") + '">I have an account</button></div>';
      html += '<div class="prof-card acct-card">' + tabs +
        '<h3 class="acct-title">' + title + "</h3><p class=\"prof-sub\">" + sub + "</p>" +
        '<form id="acctForm" novalidate>' + form + "</form>" +
        '<p class="prof-msg" id="acctMsg" aria-live="polite"></p>' +
        (lp2 ? '<button type="button" class="acct-link" id="acctGuest">Use Code Block as a guest instead</button>' : "") +
        '<p class="acct-fine">' + icon("i-shield-check") + "<span>No email and no real name: just a username, and your password stored scrambled so that no one, not even Code Block, can read it. Every lesson stays free, with or without an account.</span></p></div>";
      host.innerHTML = html;
      wireSignedOut();
    }
    if (pendingCode) wireCode();
    wireShowButtons(host);
    var aim = focusNext === "code" ? $("acctCodeTitle") : focusNext === "card" ? $("acctName") : focusNext === "pass" ? $("acctPass") : null;
    focusNext = "";
    if (aim) {
      if (aim.id === "acctCodeTitle") aim.setAttribute("tabindex", "-1");
      setTimeout(function () { aim.focus({ preventScroll: true }); aim.scrollIntoView({ block: "center" }); }, 40);
    }
  }
  function suggestName(name) {
    var s = String(name || "").replace(/\s+/g, "_").replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 20);
    return s.length >= 3 ? s : "";
  }
  function wireShowButtons(host) {
    Array.prototype.forEach.call(host.querySelectorAll("[data-show]"), function (b) {
      b.addEventListener("click", function () {
        var f = $(b.getAttribute("data-show"));
        var show = f.type === "password";
        f.type = show ? "text" : "password";
        b.setAttribute("aria-pressed", String(show));
        b.setAttribute("aria-label", show ? "Hide the password" : "Show the password");
        b.innerHTML = icon(show ? "i-eye-off" : "i-eye");
      });
    });
  }
  function wireCode() {
    $("acctCopy").addEventListener("click", function () {
      var done = function () { $("acctCopy").textContent = "Copied"; say("Recovery code copied."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pendingCode).then(done, function () {});
    });
    $("acctCodeDone").addEventListener("click", function () {
      pendingCode = null;
      focusNext = "card";
      paint();
    });
  }
  function setBusy(on, label) {
    busy = on;
    var go = $("acctGo");
    if (!go) return;
    if (on) { go.setAttribute("data-label", go.textContent); go.textContent = label; }
    else if (go.getAttribute("data-label")) go.textContent = go.getAttribute("data-label");
    go.disabled = on;
    go.setAttribute("aria-busy", String(on));
  }
  function fail(text, field) {
    msg(text, true);
    var f = field && $(field);
    if (f) f.focus();
  }

  function wireSignedOut() {
    Array.prototype.forEach.call($("accountMain").querySelectorAll("[data-mode]"), function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-mode");
        paint();
        var f = $("acctUser");
        if (f) (f.value ? ($("acctCodeIn") || $("acctPass")) : f).focus();
      });
    });
    var guest = $("acctGuest");
    if (guest) guest.addEventListener("click", function () {
      cbStore.active = null;
      baseSaveStore();
      state = cbGuestState();
      refreshProgress();
      cbUpdateMenuLabel();
      if (window.__refreshWorld) window.__refreshWorld();
      if (window.CBFX) window.CBFX.repaint();
      needsLogin = false;
      mode = "signup";
      window.cbRenderProfile();
      say("Browsing as a guest now.");
    });
    $("acctForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var username = $("acctUser").value.trim();
      var password = $("acctPass").value;
      if (!/^[A-Za-z0-9_.-]{3,20}$/.test(username)) {
        return fail(mode === "signup" ? "Usernames are 3 to 20 letters, numbers, dots, dashes or underscores." : "Type your username.", "acctUser");
      }
      if (mode === "recover") {
        var code = $("acctCodeIn").value;
        if (code.replace(/[^A-Za-z0-9]/g, "").length !== 16) return fail("Recovery codes have 16 letters and numbers, like ABCD-EFGH-JKLM-NPQR.", "acctCodeIn");
        if (password.length < 8) return fail("Your new password needs at least 8 characters.", "acctPass");
        setBusy(true, "Checking the code…");
        call("POST", "recover", { username: username, recoveryCode: code, password: password }).then(function (r) {
          setBusy(false);
          if (r.status !== 200) return fail(words(r));
          pendingCode = r.data.recoveryCode;
          mode = "signup";
          arrive(r.data.user, false);
          say("Password reset. You're logged in as " + r.data.user.username + ". Save your new recovery code.");
        }, function () { setBusy(false); fail(OFFLINE); });
        return;
      }
      if (mode === "login") {
        if (!password) return fail("Type your password.", "acctPass");
        setBusy(true, "Logging in…");
        call("POST", "login", { username: username, password: password }).then(function (r) {
          setBusy(false);
          if (r.status !== 200) return fail(words(r), "acctPass");
          mode = "signup";
          arrive(r.data.user, false);
          say("Logged in as " + r.data.user.username + ". Your progress is coming in.");
        }, function () { setBusy(false); fail(OFFLINE); });
        return;
      }
      if (password.length < 8) return fail("Passwords need at least 8 characters.", "acctPass");
      var p = cbProfile();
      var fx = (!p || !p.account) && window.CBFX ? window.CBFX.progress() : null;
      setBusy(true, "Creating your account…");
      call("POST", "signup", { username: username, password: password, public: $("acctPublicNew").checked, carry: fx ? { xp: fx.xp, bestWpm: fx.bestWpm } : {} }).then(function (r) {
        setBusy(false);
        if (r.status !== 201) return fail(words(r), r.data.error === "taken" || /username/.test(r.data.error || "") ? "acctUser" : "acctPass");
        pendingCode = r.data.recoveryCode;
        arrive(r.data.user, true);
        say("Account created. Welcome, " + r.data.user.username + ". Save your recovery code.");
      }, function () { setBusy(false); fail(OFFLINE); });
    });
  }

  function wireSignedIn() {
    $("acctPublic").addEventListener("change", function () {
      var on = $("acctPublic").checked;
      call("POST", "settings", { public: on }).then(function (r) {
        if (r.status !== 200) { $("acctPublic").checked = !on; return msg(words(r), true); }
        me = r.data.user;
        msg(on ? "Your name is on the leaderboard." : "Your name is hidden from the leaderboard.");
        loadBoard(true);
      }, function () { $("acctPublic").checked = !on; msg(OFFLINE, true); });
    });
    $("acctPassForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var old = $("acctPassOld").value, next = $("acctPassNew").value;
      if (!old) return fail("Type your current password.", "acctPassOld");
      if (next.length < 8) return fail("Your new password needs at least 8 characters.", "acctPassNew");
      call("POST", "password", { password: old, newPassword: next }).then(function (r) {
        if (r.status !== 200) return fail(words(r), r.data.error === "bad_password" ? "acctPassOld" : "acctPassNew");
        $("acctPassOld").value = ""; $("acctPassNew").value = "";
        $("acctPassBox").open = false;
        msg("Password changed. Any other devices were logged out.");
      }, function () { fail(OFFLINE); });
    });
    $("acctLogout").addEventListener("click", function () {
      call("POST", "logout", {}).then(function () {
        me = null;
        needsLogin = false;
        mode = "login";
        cbStore.active = null;
        baseSaveStore();
        state = cbGuestState();
        refreshProgress();
        cbUpdateMenuLabel();
        if (window.__refreshWorld) window.__refreshWorld();
        if (window.CBFX) window.CBFX.repaint();
        window.cbRenderProfile();
        say("Logged out. Browsing as a guest now; your progress stays saved in your account.");
      }, function () { msg("Couldn't reach the server to log out. Try again when you're online.", true); });
    });
    $("acctDelete").addEventListener("click", function () {
      $("acctDeleteForm").classList.remove("hidden");
      $("acctDelete").classList.add("hidden");
      $("acctDeletePass").focus();
    });
    $("acctDeleteCancel").addEventListener("click", function () {
      $("acctDeleteForm").classList.add("hidden");
      $("acctDelete").classList.remove("hidden");
      $("acctDelete").focus();
    });
    $("acctDeleteForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = $("acctDeletePass").value;
      if (!pw) return fail("Type your password to confirm.", "acctDeletePass");
      call("POST", "delete", { password: pw }).then(function (r) {
        if (r.status !== 200) return fail(words(r), "acctDeletePass");
        var name = me.username;
        var key = cbStore.active;
        delete outbox[me.id];
        saveOutbox();
        me = null;
        mode = "signup";
        delete cbStore.profiles[key];
        cbStore.active = null;
        baseSaveStore();
        state = cbGuestState();
        refreshProgress();
        cbUpdateMenuLabel();
        if (window.__refreshWorld) window.__refreshWorld();
        if (window.CBFX) window.CBFX.repaint();
        window.cbRenderProfile();
        loadBoard(true);
        say("The account @" + name + " is deleted.");
      }, function () { fail(OFFLINE); });
    });
  }

  /* The profile room's words, for a site with accounts. */
  function paintIntro() {
    var intro = $("profIntro"), chip = $("profChip"), hint = $("profHint");
    if (!available) return;
    if (chip) chip.textContent = "Free · saved online";
    if (signedIn()) {
      if (hint) hint.textContent = "Signed in as @" + me.username + ".";
      if (intro) intro.innerHTML = "Every lesson here is free. Your account <strong>saves your progress online</strong> as you go: log in on any phone or computer to carry on where you left off.";
    } else {
      if (hint) hint.textContent = "Make a free account to save your progress online and join the leaderboard.";
      if (intro) intro.innerHTML = "Every lesson here is free, with or without an account. Make a free account to <strong>save your progress online</strong>, pick it up on any device, join the <strong>leaderboard</strong>, and unlock the <strong>10,000-drill Vault</strong> and two extra Library shelves. A profile kept on this device only unlocks them too.";
    }
  }
  var shelfHint = $("fxShelfHint");

  /* ---------- Into the page ---------- */
  var baseRender = window.cbRenderProfile;
  window.cbRenderProfile = function () {
    baseRender();
    if (!checked && usable) boot();
    paintIntro();
    paint();
    paintBoard();
    if (available) loadBoard(false);
    if (shelfHint) shelfHint.textContent = signedIn() ? "Earned by typing: combos, speed, streaks and levels. They're saved to your account." : "Earned by typing: combos, speed, streaks and levels. They stay with this profile on this device.";
  };
  var liveBtn = $("liveBoardBtn");
  if (liveBtn) liveBtn.addEventListener("click", function () {
    showView("profile");
    window.cbRenderProfile();
    var b = $("boardSection");
    if (b) setTimeout(function () { b.scrollIntoView({ block: "start" }); var t = b.querySelector("[aria-pressed='true']"); if (t) t.focus({ preventScroll: true }); }, 60);
  });

  function boot() {
    checked = true;
    call("GET", "health").then(function (r) {
      answered = true;
      available = r.status === 200 && r.data.db === true;
      if (!available) { paint(); return; }
      document.documentElement.classList.add("cb-online");
      paintIntro();
      loadStats();
      /* Who this browser is logged in as: the active profile's account
         picks up where it was, and a tap on another account's profile can
         switch straight to it. A device that has never had an account
         doesn't need to ask. */
      var any = Object.keys(cbStore.profiles).some(function (k) { return !!cbStore.profiles[k].account; });
      if (any) call("GET", "me").then(function (m) {
        var p = linkedProfile();
        if (m.status === 200 && m.data.user) {
          me = m.data.user;
          if (p && me.id === p.account.id) { took(me); pull(); flush(); }
          else if (p) needsLogin = true;
        } else if (m.status === 401) {
          me = null;
          needsLogin = !!p;
        }
        if (roomOpen()) window.cbRenderProfile();
      }, function () {});
      if (roomOpen()) window.cbRenderProfile();
    }, function () { answered = true; available = false; paint(); });
  }

  window.CBAccount = {
    available: function () { return available; },
    user: function () { return signedIn() ? me : null; },
    /* A tap on an online account's profile pick: switch to it when this
       browser is still logged in as that account, else ask to log in. */
    claim: function (key) {
      var pr = cbStore.profiles[key];
      if (!pr || !pr.account || !available) return false;
      if (me && me.id === pr.account.id) { activate(key); focusNext = "card"; window.cbRenderProfile(); return true; }
      mode = "login";
      prefill = pr.account.username;
      focusNext = "pass";
      window.cbRenderProfile();
      return true;
    },
    sync: function () { pull(); flush(); }
  };

  if (hinted && usable) boot();
})();
