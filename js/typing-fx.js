"use strict";
/* ================= Typing FX — sound, sparks, combos and XP =================
   Every keystroke in a drill answers. A right letter plays a note (or
   a key click, or a bubble — the learner picks the sound) and throws
   a few sparks off the letter; a wrong one thuds, shakes, buzzes on a
   phone and shows which key the line wanted. A run of right letters is
   a combo: the meter heats up through five colours, and the notes climb
   with it. A finished line plays a rising chord, pays XP and records
   the speed; levels, a daily goal, a day streak and trophies are kept
   per profile on this device. Each finished line is also announced as
   a "cb:fx" event, which js/account.js sends to the server, and an
   online account's numbers are kept in step across devices through
   syncData() / mergeSync() below.

   Sounds are synthesized with the Web Audio API — no audio files — and
   the audio context starts on the learner's first tap or key, as
   browsers require. Sparks, shakes and floating text step aside under
   prefers-reduced-motion; the numbers still update.

   The drills call in through window.CBFX:
     begin(card, { line, key })      a new line is on screen
     correct(card, target, gained, typedLen)   letters landed
     slip(card, target, at, want, got)          a wrong letter
     finish(card, target, { kind, line, track, block, rep })
   kind is "rep", "master" (the rep that masters a block) or "bank"
   (a Vault drill). */
(function () {
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var SETTINGS_KEY = "code-block-fx-settings-v1";
  var PROGRESS_KEY = "code-block-fx-progress-v1";
  var SOUNDS = ["melody", "piano", "marimba", "crystal", "mechanical", "typewriter", "bubbles", "arcade", "off"];
  var SOUND_NAMES = { melody: "Melody", piano: "Piano", marimba: "Marimba", crystal: "Crystal", mechanical: "Mechanical", typewriter: "Typewriter", bubbles: "Bubbles", arcade: "Arcade", off: "Off" };
  var SOUND_NOTES = {
    melody: "A soft tune that climbs with your combo", piano: "Warm piano notes, one per letter", marimba: "Wooden mallets, round and bright",
    crystal: "Glassy bells that ring and fade", mechanical: "A clicky mechanical keyboard", typewriter: "An old typewriter's clack",
    bubbles: "Little rising bubbles", arcade: "8-bit blips from an old game", off: "No key sounds"
  };
  var DAILY_GOAL = 10;
  var TIERS = [
    { at: 0, name: "", word: "combo" },
    { at: 10, name: "Nice rhythm!", word: "combo" },
    { at: 25, name: "On a roll!", word: "roll" },
    { at: 50, name: "On fire!", word: "fire" },
    { at: 100, name: "Unstoppable!", word: "blaze" }
  ];
  var MILESTONES = [10, 25, 50, 100, 150, 200, 300, 500];

  function readJSON(key) { try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function num(v, lo, hi, d) { v = Number(v); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function dayStr(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }
  function announce(msg) { if (window.cbAnnounce) window.cbAnnounce(msg); }

  /* ---------- Settings (this device) ---------- */
  var settings = (function () {
    var s = readJSON(SETTINGS_KEY) || {};
    return {
      sound: SOUNDS.indexOf(s.sound) >= 0 ? s.sound : "melody",
      volume: num(s.volume, 0, 1, 0.6),
      haptics: s.haptics !== false
    };
  })();
  function saveSettings() { writeJSON(SETTINGS_KEY, settings); }

  /* ---------- Progress (per profile on this device) ----------
     An online account is a profile too (js/account.js links one to it),
     so the key is always the active profile's, or "guest". */
  var store = readJSON(PROGRESS_KEY);
  if (!store || typeof store !== "object" || Array.isArray(store)) store = {};
  function whoKey() {
    var st = window.cbStore;
    return st && st.active ? "p:" + st.active : "guest";
  }
  function clean(p) {
    var c = {
      xp: Math.floor(num(p && p.xp, 0, 1e9, 0)),
      streak: Math.floor(num(p && p.streak, 0, 1e5, 0)),
      lastDay: p && typeof p.lastDay === "string" ? p.lastDay : "",
      today: { day: "", reps: 0 },
      best: {}, trophies: {}, tracks: {},
      perfectRun: Math.floor(num(p && p.perfectRun, 0, 1e6, 0)),
      banked: Math.floor(num(p && p.banked, 0, 1e7, 0)),
      maxCombo: Math.floor(num(p && p.maxCombo, 0, 1e7, 0)),
      bestWpm: Math.floor(num(p && p.bestWpm, 0, 400, 0))
    };
    if (p && p.today && typeof p.today.day === "string") c.today = { day: p.today.day, reps: Math.floor(num(p.today.reps, 0, 1e6, 0)) };
    ["best", "trophies", "tracks"].forEach(function (k) {
      if (p && p[k] && typeof p[k] === "object" && !Array.isArray(p[k])) {
        for (var j in p[k]) if (Object.prototype.hasOwnProperty.call(p[k], j)) c[k][j] = Math.floor(num(p[k][j], 0, 1e15, 0));
      }
    });
    return c;
  }
  function prog() {
    var k = whoKey();
    store[k] = clean(store[k]);
    return store[k];
  }
  function saveProgress() { writeJSON(PROGRESS_KEY, store); }
  /* Fold another record into p: counts take the higher value, the
     newer day wins the streak, and a trophy keeps its first date. */
  function mergeInto(p, r) {
    r = clean(r);
    ["xp", "perfectRun", "banked", "maxCombo", "bestWpm"].forEach(function (k) { if (r[k] > p[k]) p[k] = r[k]; });
    if (r.lastDay > p.lastDay) { p.lastDay = r.lastDay; p.streak = r.streak; }
    else if (r.lastDay === p.lastDay && r.streak > p.streak) p.streak = r.streak;
    if (r.today.day > p.today.day) p.today = r.today;
    else if (r.today.day === p.today.day && r.today.reps > p.today.reps) p.today.reps = r.today.reps;
    ["best", "tracks"].forEach(function (k) { for (var j in r[k]) if (!(r[k][j] <= p[k][j])) p[k][j] = r[k][j]; });
    for (var t in r.trophies) if (!p.trophies[t] || r.trophies[t] < p.trophies[t]) p.trophies[t] = r.trophies[t];
  }

  /* Level n begins at 50·(n−1)·n XP: 0, 100, 300, 600, 1000, … */
  function levelStart(n) { return 50 * (n - 1) * n; }
  function levelOf(xp) { var n = 1; while (levelStart(n + 1) <= xp) n++; return n; }

  /* ---------- Audio ---------- */
  var AC = null, master = null, noiseBuf = null;
  function audio() {
    var shared = window.cbAudioContext ? window.cbAudioContext() : null;
    if (AC && AC === shared) return AC;
    AC = shared;
    noiseBuf = null;
    if (!AC) return null;
    var comp = AC.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 4;
    master = AC.createGain();
    master.gain.value = settings.volume;
    master.connect(comp); comp.connect(AC.destination);
    /* A little of every sound goes to the page's shared room reverb. */
    var room = window.cbAudioRoom ? window.cbAudioRoom() : null;
    if (room) { var send = AC.createGain(); send.gain.value = 0.22; comp.connect(send); send.connect(room); }
    return AC;
  }
  var unlocked = false;
  function unlock() {
    if (settings.sound === "off") return;
    var c = audio();
    if (c && window.cbAudioWake) window.cbAudioWake();
    unlocked = true;
  }
  ["pointerdown", "keydown", "touchend", "input"].forEach(function (t) { document.addEventListener(t, unlock, true); });
  function ready() {
    if (settings.sound === "off" || !unlocked) return null;
    var c = audio();
    if (!c) return null;
    /* Paused by the phone (a call, the lock screen, another app)?
       Ask it to wake; this note is skipped, the next one plays. */
    if (c.state !== "running") { if (window.cbAudioWake) window.cbAudioWake(); return null; }
    return c;
  }
  function musicOn() { return !!(window.__musicIsOn && window.__musicIsOn()); }
  function freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  /* Notes can sit left or right: the key sounds travel across the
     stereo field as the line goes on. */
  function out(pan) {
    if (!pan || typeof AC.createStereoPanner !== "function") return master;
    var p = AC.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(master);
    return p;
  }
  function tone(f, t0, dur, type, gain, glideTo, pan) {
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(out(pan));
    o.start(t0); o.stop(t0 + dur + 0.03);
  }
  function noise(t0, dur, f, q, gain, kind, pan) {
    if (!noiseBuf) {
      noiseBuf = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.3), AC.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = AC.createBufferSource(), flt = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseBuf;
    flt.type = kind || "bandpass"; flt.frequency.value = f; flt.Q.value = q;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(flt); flt.connect(g); g.connect(out(pan));
    s.start(t0); s.stop(t0 + dur + 0.03);
  }
  /* The melody walks a major pentatonic scale up and down the line, and
     each combo tier lifts it: the faster and cleaner the run, the
     brighter it sings. */
  var PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  var WAVE = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
  var TIER_LIFT = [0, 2, 4, 7, 12];
  function soundKey(pos, ch, tier) {
    var c = ready(); if (!c) return;
    var t = c.currentTime, soft = musicOn() ? 0.55 : 1;
    var pan = ((pos % 16) / 15) * 0.9 - 0.45;
    var m0 = 60 + PENTA[WAVE[pos % WAVE.length]] + TIER_LIFT[tier] - (ch === " " ? 12 : 0), f0 = freq(m0);
    var jit = 1 + (Math.random() - 0.5) * 0.06;
    var kind = settings.sound;
    if (kind === "typewriter") {
      noise(t, 0.028, 3400 * jit, 1.1, 0.32 * soft, null, pan);
      tone(ch === " " ? 120 : 165, t, 0.045, "sine", 0.22 * soft, 110, pan);
    } else if (kind === "bubbles") {
      var fb = freq(72 + PENTA[WAVE[pos % WAVE.length]] + TIER_LIFT[tier]);
      tone(fb * 0.7, t, 0.09, "sine", 0.2 * soft, fb * 1.45, pan);
      tone(fb * 1.5, t + 0.03, 0.06, "sine", 0.05 * soft, fb * 2.2, -pan);
    } else if (kind === "mechanical") {
      /* The click of the switch, the clack of the cap, the thock of the board. */
      noise(t, 0.012, 5600 * jit, 0.8, 0.5 * soft, null, pan);
      noise(t + 0.006, 0.05, 1700 * jit, 1.6, 0.16 * soft, null, pan);
      tone((ch === " " ? 68 : 96) * jit, t, 0.07, "sine", 0.3 * soft, 55, pan);
    } else if (kind === "piano") {
      /* A hammer, then a string's fundamental and its first overtones,
         each fading at its own pace. */
      noise(t, 0.012, 2600, 0.8, 0.05 * soft, "lowpass", pan);
      tone(f0, t, 1.1, "triangle", 0.14 * soft, null, pan);
      tone(f0 * 2, t, 0.6, "sine", 0.05 * soft, null, pan);
      tone(f0 * 3, t, 0.32, "sine", 0.022 * soft, null, pan);
      tone(f0 * 1.002, t, 0.9, "sine", 0.05 * soft, null, -pan * 0.5);
    } else if (kind === "marimba") {
      tone(f0, t, 0.42, "sine", 0.24 * soft, null, pan);
      tone(f0 * 3.93, t, 0.09, "sine", 0.06 * soft, null, pan);
      tone(f0 * 10.1, t, 0.03, "sine", 0.02 * soft, null, pan);
      noise(t, 0.015, 900, 1, 0.05 * soft, "lowpass", pan);
    } else if (kind === "crystal") {
      var fc = f0 * 2;
      tone(fc, t, 1.4, "sine", 0.075 * soft, null, pan);
      tone(fc * 2.76, t, 0.55, "sine", 0.026 * soft, null, -pan);
      tone(fc * 5.4, t, 0.25, "sine", 0.012 * soft, null, pan);
      tone(fc * 1.003, t + 0.01, 1.2, "sine", 0.03 * soft, null, -pan);
    } else if (kind === "arcade") {
      tone(f0, t, 0.07, "square", 0.05 * soft, f0 * 1.5, pan);
      tone(f0 * 2, t + 0.035, 0.05, "square", 0.03 * soft, null, pan);
    } else {
      var m = 67 + PENTA[WAVE[pos % WAVE.length]] + TIER_LIFT[tier];
      if (ch === " ") m -= 12;
      tone(freq(m), t, 0.16, "triangle", 0.15 * soft, null, pan);
      tone(freq(m + 12), t, 0.08, "sine", 0.045 * soft, null, pan);
    }
  }
  function soundSlip() {
    var c = ready(); if (!c) return;
    var t = c.currentTime;
    tone(150, t, 0.17, "triangle", 0.22, 92);
    noise(t, 0.06, 520, 0.9, 0.14);
  }
  /* A finished rep plays a chord that climbs a major scale with the rep
     count, so the eight reps of a block rise like a staircase. */
  var STEPS = [0, 2, 4, 5, 7, 9, 11, 12];
  function soundRep(rep, perfect) {
    if (musicOn()) return; /* the music engine answers reps itself */
    var c = ready(); if (!c) return;
    var t = c.currentTime + 0.02, base = 60 + STEPS[Math.max(0, Math.min(7, (rep || 1) - 1))];
    [0, 4, 7, 12].forEach(function (iv, k) { tone(freq(base + iv), t + k * 0.07, 0.42, "triangle", 0.13); });
    if (perfect) tone(freq(base + 24), t + 0.3, 0.5, "sine", 0.06);
  }
  function soundMaster() {
    if (musicOn()) return;
    var c = ready(); if (!c) return;
    var t = c.currentTime + 0.02;
    [0, 4, 7, 12, 16, 19, 24].forEach(function (iv, k) { tone(freq(60 + iv), t + k * 0.06, 0.9, "triangle", 0.11); });
    [0, 4, 7].forEach(function (iv) { tone(freq(72 + iv), t + 0.5, 1.3, "sine", 0.08); });
  }
  function soundBank() {
    var c = ready(); if (!c) return;
    var t = c.currentTime + 0.02;
    [0, 7, 12].forEach(function (iv, k) { tone(freq(69 + iv), t + k * 0.06, 0.32, "triangle", 0.12); });
  }
  function soundCombo(tier) {
    var c = ready(); if (!c) return;
    var t = c.currentTime;
    noise(t, 0.28, 900, 0.7, 0.12, "highpass");
    tone(freq(76 + TIER_LIFT[Math.min(4, tier)]), t + 0.05, 0.3, "sine", 0.12);
    tone(freq(83 + TIER_LIFT[Math.min(4, tier)]), t + 0.12, 0.35, "sine", 0.1);
  }
  function soundLevel() {
    var c = ready(); if (!c) return;
    var t = c.currentTime + 0.02;
    PENTA.forEach(function (iv, k) { tone(freq(64 + iv), t + k * 0.045, 0.25, "triangle", 0.1); });
    [0, 4, 7, 12].forEach(function (iv) { tone(freq(76 + iv), t + 0.5, 1.1, "sine", 0.07); });
  }
  function haptic(pattern) {
    if (!settings.haptics || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) {}
  }

  /* ---------- Sparks (one canvas per card) ---------- */
  var COLORS = ["56,189,248", "52,211,153", "251,191,36", "249,115,22", "232,121,249"];
  var layers = [], running = false;
  function layerFor(card) {
    for (var i = 0; i < layers.length; i++) if (layers[i].card === card) return layers[i];
    var cv = document.createElement("canvas");
    cv.className = "fx-layer"; cv.setAttribute("aria-hidden", "true");
    card.appendChild(cv);
    var L = { card: card, cv: cv, g: cv.getContext("2d"), parts: [], w: 0, h: 0, dpr: 1 };
    layers.push(L);
    return L;
  }
  function fit(L) {
    var w = L.card.clientWidth, h = L.card.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w !== L.w || h !== L.h || dpr !== L.dpr) {
      L.w = w; L.h = h; L.dpr = dpr;
      L.cv.width = Math.max(1, Math.round(w * dpr)); L.cv.height = Math.max(1, Math.round(h * dpr));
    }
  }
  function spot(card, el) {
    var a = card.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
  }
  function burst(card, x, y, count, rgb, mode) {
    if (REDUCED || !card.isConnected) return;
    var L = layerFor(card);
    if (!L.g) return;
    fit(L);
    for (var i = 0; i < count && L.parts.length < 260; i++) {
      var ang, speed;
      if (mode === "shard") { ang = Math.PI * (0.15 + Math.random() * 0.7); speed = 1.2 + Math.random() * 2.2; }
      else if (mode === "ring") { ang = (i / count) * Math.PI * 2; speed = 2.4 + Math.random() * 1.6; }
      else { ang = -Math.PI * (0.15 + Math.random() * 0.7); speed = 1.1 + Math.random() * 2.4; }
      L.parts.push({
        x: x, y: y, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
        g: mode === "shard" ? 0.16 : mode === "ring" ? 0.02 : 0.05,
        life: 0, max: (mode === "ring" ? 38 : 26) + Math.random() * 14,
        r: mode === "ring" ? 2.2 + Math.random() * 1.6 : 1.4 + Math.random() * 1.8,
        rgb: rgb || COLORS[0], sq: mode === "shard"
      });
    }
    if (!running) { running = true; requestAnimationFrame(step); }
  }
  function step() {
    var alive = 0;
    layers.forEach(function (L) {
      if (!L.g) return;
      L.g.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
      L.g.clearRect(0, 0, L.w, L.h);
      for (var i = L.parts.length - 1; i >= 0; i--) {
        var p = L.parts[i];
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.97;
        if (p.life >= p.max) { L.parts.splice(i, 1); continue; }
        var a = 1 - p.life / p.max;
        L.g.fillStyle = "rgba(" + p.rgb + "," + a.toFixed(3) + ")";
        if (p.sq) L.g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        else { L.g.beginPath(); L.g.arc(p.x, p.y, p.r * (0.6 + a * 0.6), 0, Math.PI * 2); L.g.fill(); }
      }
      alive += L.parts.length;
    });
    layers = layers.filter(function (L) { return L.card.isConnected; });
    if (alive > 0) requestAnimationFrame(step); else running = false;
  }

  /* ---------- Floating words, the wrong-key tip, toasts ---------- */
  function pop(card, x, y, text, cls) {
    var s = document.createElement("span");
    s.className = "fx-pop" + (cls ? " " + cls : "");
    s.setAttribute("aria-hidden", "true");
    s.textContent = text;
    s.style.left = x + "px"; s.style.top = y + "px";
    card.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, REDUCED ? 1400 : 1150);
  }
  function keyName(c) {
    if (c === " ") return "space";
    if (c === undefined || c === "") return "nothing more";
    return c;
  }
  function tip(card, el, want, got) {
    var old = card.querySelector(".fx-tip");
    if (old) old.parentNode.removeChild(old);
    if (!el) return;
    var p = spot(card, el);
    var t = document.createElement("span");
    t.className = "fx-tip";
    t.setAttribute("aria-hidden", "true");
    t.innerHTML = '<span class="fx-tip-label">Type</span><kbd class="fx-tip-want"></kbd><span class="fx-tip-got"></span>';
    t.querySelector(".fx-tip-want").textContent = keyName(want);
    t.querySelector(".fx-tip-got").textContent = got === undefined || got === "" ? "" : "not " + keyName(got);
    /* Keep the bubble inside the card even for a letter at the edge. */
    var x = Math.max(70, Math.min(card.clientWidth - 70, p.x));
    t.style.left = x + "px"; t.style.top = (p.y - el.getBoundingClientRect().height / 2) + "px";
    card.appendChild(t);
    clearTimeout(card.__fxTipT);
    card.__fxTipT = setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1600);
  }
  function clearTip(card) {
    var t = card.querySelector(".fx-tip");
    if (t) t.parentNode.removeChild(t);
  }
  /* Toasts take turns: one on screen at a time, the rest wait. */
  var toastQueue = [], toastBusy = false;
  function toast(title, line, icon) {
    if (toastQueue.length < 5) toastQueue.push({ title: title, line: line, icon: icon });
    announce(title + (line ? ". " + line : ""));
    if (!toastBusy) nextToast();
  }
  function nextToast() {
    var item = toastQueue.shift();
    if (!item) { toastBusy = false; return; }
    toastBusy = true;
    var box = document.getElementById("fxToasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "fxToasts"; box.className = "fx-toasts"; box.setAttribute("aria-hidden", "true");
      document.body.appendChild(box);
    }
    var t = document.createElement("div");
    t.className = "fx-toast";
    t.innerHTML = '<span class="fx-toast-ico"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#' + (item.icon || "i-trophy") + '"/></svg></span><span class="fx-toast-text"><b></b><span></span></span>';
    t.querySelector("b").textContent = item.title;
    t.querySelector(".fx-toast-text span").textContent = item.line || "";
    box.appendChild(t);
    var stay = toastQueue.length ? 2200 : 3000;
    setTimeout(function () { t.classList.add("out"); }, stay);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); nextToast(); }, stay + 450);
  }

  /* ---------- Trophies ---------- */
  var TROPHIES = [
    { id: "first-rep", name: "First Rep", goal: "Type your first perfect line.", line: "You typed your first perfect line.", icon: "i-check", test: function (p) { return p.totalReps >= 1; } },
    { id: "master", name: "Block Master", goal: "Master a whole block.", line: "You mastered a whole block.", icon: "i-star", test: function (p, e) { return e.kind === "master"; } },
    { id: "combo-25", name: "On a Roll", goal: "Type 25 right letters in a row.", line: "25 right letters in a row.", icon: "i-flame", test: function (p) { return p.maxCombo >= 25; } },
    { id: "combo-50", name: "On Fire", goal: "Type 50 right letters in a row.", line: "50 right letters in a row.", icon: "i-flame", test: function (p) { return p.maxCombo >= 50; } },
    { id: "combo-100", name: "Unstoppable", goal: "Type 100 right letters in a row.", line: "100 right letters in a row.", icon: "i-flame", test: function (p) { return p.maxCombo >= 100; } },
    { id: "wpm-30", name: "Quick Fingers", goal: "Type a line at 30 words a minute.", line: "A line at 30 words a minute.", icon: "i-zap", test: function (p) { return p.bestWpm >= 30; } },
    { id: "wpm-50", name: "Lightning", goal: "Type a line at 50 words a minute.", line: "A line at 50 words a minute.", icon: "i-zap", test: function (p) { return p.bestWpm >= 50; } },
    { id: "wpm-70", name: "Speed Demon", goal: "Type a line at 70 words a minute.", line: "A line at 70 words a minute.", icon: "i-zap", test: function (p) { return p.bestWpm >= 70; } },
    { id: "flawless", name: "Flawless", goal: "Type eight perfect lines in a row.", line: "Eight perfect lines in a row.", icon: "i-shield-check", test: function (p) { return p.perfectRun >= 8; } },
    { id: "goal", name: "Goal Getter", goal: "Type " + DAILY_GOAL + " lines in one day.", line: "You hit today's goal of " + DAILY_GOAL + " lines.", icon: "i-target", test: function (p) { return p.today.reps >= DAILY_GOAL; } },
    { id: "streak-3", name: "Three in a Row", goal: "Practise three days running.", line: "You practised three days running.", icon: "i-flame", test: function (p) { return p.streak >= 3; } },
    { id: "streak-7", name: "Week Warrior", goal: "Practise seven days running.", line: "You practised seven days running.", icon: "i-flame", test: function (p) { return p.streak >= 7; } },
    { id: "level-5", name: "Rising Star", goal: "Reach level 5.", line: "You reached level 5.", icon: "i-star", test: function (p) { return levelOf(p.xp) >= 5; } },
    { id: "level-10", name: "Code Hero", goal: "Reach level 10.", line: "You reached level 10.", icon: "i-trophy", test: function (p) { return levelOf(p.xp) >= 10; } },
    { id: "polyglot", name: "Polyglot", goal: "Type lines in three languages.", line: "You typed lines in three languages.", icon: "i-layers", test: function (p) { return Object.keys(p.tracks).length >= 3; } },
    { id: "vault-10", name: "Vault Diver", goal: "Type ten Vault drills.", line: "You typed ten Vault drills.", icon: "i-lock-open", test: function (p) { return p.banked >= 10; } }
  ];
  function checkTrophies(p, ev) {
    p.totalReps = 0;
    for (var t in p.tracks) p.totalReps += p.tracks[t];
    TROPHIES.forEach(function (tr) {
      if (p.trophies[tr.id]) return;
      if (tr.test(p, ev)) {
        p.trophies[tr.id] = Date.now();
        toast("Trophy: " + tr.name, tr.line, tr.icon);
      }
    });
    delete p.totalReps;
  }

  /* ---------- The HUD on each typing card ---------- */
  var ICO = function (id) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var combo = 0, comboPeak = 0;
  var session = { ok: 0, bad: 0 };
  function tierOf(n) { var t = 0; for (var i = 0; i < TIERS.length; i++) if (n >= TIERS[i].at) t = i; return t; }
  function nextMilestone(n) { for (var i = 0; i < MILESTONES.length; i++) if (MILESTONES[i] > n) return MILESTONES[i]; return n + 100; }
  function prevMilestone(n) { var p = 0; for (var i = 0; i < MILESTONES.length; i++) if (MILESTONES[i] <= n) p = MILESTONES[i]; return p; }
  function stateOf(card) {
    if (!card.__fx) card.__fx = { start: 0, errors: 0, chars: 0, pasted: false, line: "", key: "", liveWpm: 0 };
    return card.__fx;
  }
  function hudOf(card) {
    var h = card.querySelector(".fx-hud");
    if (h) return h;
    h = document.createElement("div");
    h.className = "fx-hud";
    h.setAttribute("role", "group");
    h.setAttribute("aria-label", "Typing stats");
    h.innerHTML =
      '<span class="fx-chip fx-combo" title="Right letters in a row">' + ICO("i-flame") + '<b class="fx-combo-n">0</b><span class="fx-combo-w">combo</span><i class="fx-meter"><i></i></i></span>' +
      '<span class="fx-chip fx-wpm" title="Words per minute">' + ICO("i-zap") + '<b>—</b><span>wpm</span></span>' +
      '<span class="fx-chip fx-acc" title="Accuracy this session">' + ICO("i-target") + '<b>100%</b></span>' +
      '<span class="fx-chip fx-lv" title="Your level">' + ICO("i-star") + '<b>Lv 1</b><i class="fx-meter"><i></i></i></span>' +
      '<span class="fx-sound-wrap"><button class="fx-chip fx-sound" type="button" aria-haspopup="menu" aria-expanded="false"></button>' +
      '<span class="fx-sound-menu hidden" role="menu" aria-label="Key sounds">' +
      SOUNDS.map(function (k) {
        return '<button type="button" role="menuitemradio" aria-checked="false" data-sound="' + k + '"><b>' + SOUND_NAMES[k] + "</b><span>" + SOUND_NOTES[k] + "</span></button>";
      }).join("") + "</span></span>";
    var bar = card.querySelector(".console-bar");
    card.insertBefore(h, bar ? bar.nextSibling : card.firstChild);
    var btn = h.querySelector(".fx-sound"), menu = h.querySelector(".fx-sound-menu");
    function items() { return Array.prototype.slice.call(menu.querySelectorAll("[data-sound]")); }
    function close(refocus) {
      if (menu.classList.contains("hidden")) return;
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", outside, true);
      if (refocus) btn.focus();
    }
    function outside(e) { if (!h.querySelector(".fx-sound-wrap").contains(e.target)) close(false); }
    function open() {
      items().forEach(function (b) { b.setAttribute("aria-checked", String(b.getAttribute("data-sound") === settings.sound)); });
      menu.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", outside, true);
      var on = menu.querySelector('[aria-checked="true"]') || items()[0];
      on.focus();
    }
    /* Clicks here must not reach the card, which would send focus (and,
       on a phone, the keyboard) to the typing box. */
    h.querySelector(".fx-sound-wrap").addEventListener("click", function (e) { e.stopPropagation(); });
    btn.addEventListener("click", function () { if (menu.classList.contains("hidden")) open(); else close(true); });
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("[data-sound]");
      if (!b) return;
      settings.sound = b.getAttribute("data-sound");
      saveSettings();
      if (settings.sound !== "off") { unlock(); soundKey(4, "a", 1); setTimeout(function () { soundKey(7, "b", 1); }, 140); }
      close(true);
      paintAll();
      announce("Key sounds: " + SOUND_NAMES[settings.sound]);
    });
    menu.addEventListener("keydown", function (e) {
      var list = items(), i = list.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        list[(i + (e.key === "ArrowDown" ? 1 : list.length - 1)) % list.length].focus();
      } else if (e.key === "Home" || e.key === "End") { e.preventDefault(); list[e.key === "Home" ? 0 : list.length - 1].focus(); }
      else if (e.key === "Tab") close(false);
    });
    return h;
  }
  function paintSound(btn) {
    var off = settings.sound === "off";
    btn.innerHTML = ICO(off ? "i-volume-off" : "i-volume") + "<span>" + SOUND_NAMES[settings.sound] + "</span>";
    btn.setAttribute("aria-label", "Key sounds: " + SOUND_NAMES[settings.sound] + ". Choose a sound.");
  }
  function paintHud(card) {
    var h = hudOf(card), st = stateOf(card), p = prog();
    var tier = tierOf(combo);
    card.setAttribute("data-fx-tier", String(tier));
    var c = h.querySelector(".fx-combo");
    c.setAttribute("data-tier", String(tier));
    c.querySelector(".fx-combo-n").textContent = String(combo);
    c.querySelector(".fx-combo-w").textContent = tier ? TIERS[tier].word : "combo";
    var lo = prevMilestone(combo), hi = nextMilestone(combo);
    c.querySelector(".fx-meter i").style.width = Math.round(((combo - lo) / (hi - lo)) * 100) + "%";
    h.querySelector(".fx-wpm b").textContent = st.liveWpm ? String(st.liveWpm) : "—";
    var total = session.ok + session.bad;
    h.querySelector(".fx-acc b").textContent = (total ? Math.round((session.ok / total) * 100) : 100) + "%";
    var lv = levelOf(p.xp), a = levelStart(lv), b = levelStart(lv + 1);
    h.querySelector(".fx-lv b").textContent = "Lv " + lv;
    h.querySelector(".fx-lv .fx-meter i").style.width = Math.round(((p.xp - a) / (b - a)) * 100) + "%";
    h.querySelector(".fx-lv").setAttribute("title", "Level " + lv + " — " + p.xp + " XP, " + (b - p.xp) + " to the next level");
    paintSound(h.querySelector(".fx-sound"));
  }
  function paintAll() {
    Array.prototype.forEach.call(document.querySelectorAll(".fx-hud"), function (h) {
      var card = h.parentNode;
      if (card) paintHud(card);
    });
    paintToday();
    paintShelf();
  }
  /* The today strip in the progress card, and the trophy shelf in the
     profile room — both repaint whenever progress or the profile changes. */
  function paintToday() {
    var box = document.getElementById("fxToday");
    if (!box) return;
    var p = prog(), lv = levelOf(p.xp), a = levelStart(lv), b = levelStart(lv + 1);
    var today = p.today.day === dayStr() ? p.today.reps : 0;
    var streak = (p.lastDay === dayStr() || p.lastDay === yesterday()) ? p.streak : 0;
    var got = 0;
    TROPHIES.forEach(function (t) { if (p.trophies[t.id]) got++; });
    var goalPct = Math.min(100, Math.round((today / DAILY_GOAL) * 100));
    box.innerHTML =
      '<span class="fx-day fx-day-lv" title="' + p.xp + ' XP — ' + (b - p.xp) + ' to level ' + (lv + 1) + '">' + ICO("i-star") + ' <b>Level ' + lv + '</b> <i class="fx-meter"><i style="width:' + Math.round(((p.xp - a) / (b - a)) * 100) + '%"></i></i> <span>' + p.xp + ' XP</span></span> ' +
      '<span class="fx-day fx-day-streak' + (streak ? " on" : "") + '">' + ICO("i-flame") + ' <b>' + streak + '</b> <span>day streak</span></span> ' +
      '<span class="fx-day fx-day-goal" title="Daily goal: ' + DAILY_GOAL + ' lines"><i class="fx-ring" style="--p:' + goalPct + '"></i> <b>' + Math.min(today, DAILY_GOAL) + '/' + DAILY_GOAL + '</b> <span>lines today</span></span> ' +
      '<span class="fx-day fx-day-tro">' + ICO("i-trophy") + ' <b>' + got + '/' + TROPHIES.length + '</b> <span>trophies</span></span>';
    box.setAttribute("aria-label", "Today: level " + lv + ", " + p.xp + " XP, " + streak + " day streak, " + Math.min(today, DAILY_GOAL) + " of " + DAILY_GOAL + " lines for today's goal, " + got + " of " + TROPHIES.length + " trophies");
  }
  function paintShelf() {
    var grid = document.getElementById("fxShelfGrid");
    if (!grid) return;
    var p = prog();
    grid.innerHTML = "";
    TROPHIES.forEach(function (t) {
      var on = !!p.trophies[t.id];
      var d = document.createElement("div");
      d.className = "fx-trophy" + (on ? " on" : "");
      d.innerHTML = '<span class="fx-trophy-ico">' + ICO(on ? t.icon : "i-lock") + '</span><span class="fx-trophy-text"><b></b><span></span></span>';
      d.querySelector("b").textContent = t.name;
      d.querySelector(".fx-trophy-text span").textContent = on ? t.line : t.goal;
      if (!on) d.setAttribute("aria-label", t.name + ", locked. " + t.goal);
      grid.appendChild(d);
    });
  }
  function charEl(target, i) {
    var all = target.querySelectorAll(".ch");
    return i >= 0 && i < all.length ? all[i] : null;
  }

  /* ---------- What the drills call ---------- */
  function begin(card, opts) {
    if (!card) return;
    var st = stateOf(card);
    st.start = 0; st.errors = 0; st.chars = 0; st.pasted = false; st.liveWpm = 0;
    st.line = (opts && opts.line) || "";
    st.key = (opts && opts.key) || "";
    session.ok = 0; session.bad = 0;
    clearTip(card);
    paintHud(card);
  }
  function correct(card, target, gained, typedLen) {
    if (!card || !(gained > 0)) return;
    var st = stateOf(card), t = now();
    if (gained > 3) st.pasted = true;
    if (!st.start) st.start = t;
    st.chars += gained;
    session.ok += gained;
    var before = tierOf(combo);
    combo += gained;
    if (combo > comboPeak) comboPeak = combo;
    var tier = tierOf(combo);
    clearTip(card);
    var line = st.line || "";
    var idx = Math.max(0, typedLen - 1);
    soundKey(idx, line.charAt(idx), tier);
    var el = target ? charEl(target, idx) : null;
    if (el) {
      /* The letter itself pops and flashes blue (CSS .fx-zap). */
      el.classList.remove("fx-zap"); void el.offsetWidth; el.classList.add("fx-zap");
      var p = spot(card, el);
      burst(card, p.x, p.y, line.charAt(idx) === " " ? 2 : 5, COLORS[tier], "spark");
    }
    if (st.chars >= 5 && !st.pasted) {
      var mins = (t - st.start) / 60000;
      if (mins > 0) st.liveWpm = Math.min(250, Math.round((st.chars / 5) / mins));
    }
    for (var m = 0; m < MILESTONES.length; m++) {
      var ms = MILESTONES[m];
      if (combo >= ms && combo - gained < ms) {
        var chip = card.querySelector(".fx-combo"), cr = card.getBoundingClientRect();
        var cb = chip ? chip.getBoundingClientRect() : cr;
        var x = Math.max(90, cb.left - cr.left + cb.width / 2), y = cb.top - cr.top + cb.height / 2;
        pop(card, x, y, "Combo ×" + ms + (TIERS[tier].name && tier > before ? " — " + TIERS[tier].name : ""), "fx-pop-combo t" + tier);
        burst(card, x, y, 18, COLORS[tier], "ring");
        soundCombo(tier);
        if (tier > before && TIERS[tier].name) announce("Combo " + ms + ". " + TIERS[tier].name);
      }
    }
    var pp = prog();
    if (combo > pp.maxCombo) { pp.maxCombo = combo; }
    paintHud(card);
  }
  function slip(card, target, at, want, got) {
    if (!card) return;
    var st = stateOf(card);
    st.errors++;
    session.bad++;
    var lost = combo;
    combo = 0;
    soundSlip();
    haptic(28);
    var el = target ? (target.querySelector(".ch.err") || charEl(target, at)) : null;
    if (el) {
      var p = spot(card, el);
      burst(card, p.x, p.y, 7, "255,120,100", "shard");
      tip(card, el, want, got);
    }
    if (lost >= 10) {
      var cr = card.getBoundingClientRect(), tl = target ? target.getBoundingClientRect() : cr;
      pop(card, tl.left - cr.left + tl.width / 2, tl.top - cr.top, "Combo lost at " + lost, "fx-pop-lost");
    }
    var pp = prog();
    pp.perfectRun = 0;
    saveProgress();
    paintHud(card);
  }
  function finish(card, target, info) {
    if (!card) return;
    info = info || {};
    var st = stateOf(card), p = prog(), t = now();
    var line = info.line || st.line || "";
    var ms = st.start ? t - st.start : 0;
    var perfect = st.errors === 0 && !st.pasted;
    var wpm = (!st.pasted && ms > 400 && line.length >= 5) ? Math.min(250, Math.round((line.length / 5) / (ms / 60000))) : 0;
    var kind = info.kind || "rep";
    var levelBefore = levelOf(p.xp);
    var gain = 0;
    if (!st.pasted) {
      gain = (kind === "bank" ? 5 : 10) + (perfect ? (kind === "bank" ? 2 : 5) : 0) + Math.min(10, Math.floor(combo / 25) * 2);
      if (kind === "master") gain += 50;
    }
    p.xp += gain;
    if (perfect) p.perfectRun++; else p.perfectRun = 0;
    if (kind === "bank") p.banked++;
    var track = info.track || (window.CB_META && CB_META.id) || "";
    if (track && !st.pasted) p.tracks[track] = (p.tracks[track] || 0) + 1;
    /* The day: a streak counts days with at least one finished line. */
    var today = dayStr();
    if (p.today.day !== today) p.today = { day: today, reps: 0 };
    var goalBefore = p.today.reps;
    if (!st.pasted) p.today.reps++;
    if (p.lastDay !== today && !st.pasted) {
      p.streak = p.lastDay === yesterday() ? p.streak + 1 : 1;
      p.lastDay = today;
    }
    var newBest = false;
    if (wpm && st.key) {
      if (wpm > (p.best[st.key] || 0)) { newBest = !!p.best[st.key]; p.best[st.key] = wpm; }
    }
    if (wpm > p.bestWpm) p.bestWpm = wpm;
    /* Show it. */
    var cr = card.getBoundingClientRect(), tl = target ? target.getBoundingClientRect() : cr;
    var cx = tl.left - cr.left + tl.width / 2, cy = tl.top - cr.top + tl.height / 2;
    if (kind === "master") { burst(card, cx, cy, 70, COLORS[2], "ring"); burst(card, cx, cy, 40, COLORS[4], "spark"); soundMaster(); haptic([30, 40, 60]); }
    else if (kind === "bank") { burst(card, cx, cy, 30, COLORS[1], "ring"); soundBank(); }
    else { burst(card, cx, cy, 28, COLORS[tierOf(combo)], "ring"); soundRep(info.rep, perfect); }
    if (st.pasted) pop(card, cx, cy - 18, "Pasted lines earn no XP — type it!", "fx-pop-lost");
    else {
      var head = kind === "master" ? "Mastered! " : perfect ? "Perfect! " : "";
      pop(card, cx, cy - 18, head + "+" + gain + " XP", "fx-pop-xp" + (head ? " fx-pop-perfect" : ""));
      if (newBest) setTimeout(function () { pop(card, cx, cy + 22, "New best: " + wpm + " wpm", "fx-pop-best"); }, 240);
    }
    st.liveWpm = wpm || st.liveWpm;
    st.start = 0; st.errors = 0; st.chars = 0; st.pasted = false;
    var levelNow = levelOf(p.xp);
    if (levelNow > levelBefore) {
      setTimeout(function () { soundLevel(); toast("Level " + levelNow + "!", "You have " + p.xp + " XP. Keep typing!", "i-star"); }, 450);
      card.classList.remove("fx-levelup"); void card.offsetWidth; card.classList.add("fx-levelup");
    }
    if (goalBefore < DAILY_GOAL && p.today.reps >= DAILY_GOAL) toast("Daily goal done!", DAILY_GOAL + " lines today — your streak is " + p.streak + " day" + (p.streak === 1 ? "" : "s") + ".", "i-target");
    checkTrophies(p, { kind: kind });
    saveProgress();
    paintHud(card);
    paintToday();
    paintShelf();
    try {
      document.dispatchEvent(new CustomEvent("cb:fx", { detail: { kind: kind, xp: gain, wpm: wpm, perfect: perfect, pasted: st.pasted, track: track, block: info.block, combo: combo } }));
    } catch (e) {}
  }

  /* ---------- The finished line: a slow-motion rainbow ----------
     A wave runs left to right: each letter grows and flashes through
     seven colours, settling on its own colour of the rainbow; then the
     whole line zooms in so the eye takes in the full sequence. Seven
     soft notes climb with the wave. Returns how long it lasts, so the
     drill can hold the line that long; typing again ends it at once.
     With reduced motion: the colours only, quickly, without growing. */
  var RAINBOW = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#c084fc"];
  function finale(target) {
    if (!target) return 0;
    var all = target.querySelectorAll(".ch"), n = all.length;
    if (!n) return 0;
    var each = REDUCED ? 700 : 1500;
    var step = REDUCED ? 0 : Math.max(35, Math.min(110, 1900 / n));
    var wave = step * (n - 1) + each, zoom = REDUCED ? 0 : 1300;
    Array.prototype.forEach.call(all, function (el, i) {
      el.style.setProperty("--fin-delay", Math.round(i * step) + "ms");
      el.style.setProperty("--fin-end", RAINBOW[i % 7]);
    });
    target.style.setProperty("--fin-wave", Math.round(wave) + "ms");
    target.classList.remove("cb-finale"); void target.offsetWidth;
    target.classList.add("cb-finale");
    var c = ready();
    if (c && !musicOn()) {
      var t = c.currentTime + 0.05;
      [0, 2, 4, 5, 7, 9, 11].forEach(function (iv, k) {
        var at = t + (k / 6) * (wave - each * 0.4) / 1000;
        tone(freq(72 + iv), at, 1.3, "sine", 0.05, null, -0.6 + k * 0.2);
        tone(freq(84 + iv), at, 0.6, "sine", 0.015, null, 0.6 - k * 0.2);
      });
    }
    return Math.round(wave + zoom + 150);
  }
  function endFinale(target) {
    if (target) target.classList.remove("cb-finale");
  }

  paintToday();
  paintShelf();

  window.CBFX = {
    begin: begin, correct: correct, slip: slip, finish: finish,
    levelOf: levelOf, levelStart: levelStart, dailyGoal: DAILY_GOAL, trophies: TROPHIES,
    progress: function () { return prog(); },
    combo: function () { return combo; },
    settings: function () { return { sound: settings.sound, volume: settings.volume, haptics: settings.haptics }; },
    setSound: function (s) { if (SOUNDS.indexOf(s) >= 0) { settings.sound = s; saveSettings(); paintAll(); } },
    /* js/account.js: after the server answers, its totals for the
       account lift the ones shown here (never lower them). */
    adopt: function (fields) {
      if (!fields) return;
      mergeInto(prog(), { xp: fields.xp, bestWpm: fields.bestWpm, streak: fields.streak, lastDay: typeof fields.lastDay === "string" ? fields.lastDay : "" });
      saveProgress(); paintAll();
    },
    /* A new profile made from the guest (or a profile renamed) brings
       its record along. */
    carry: function (fromKey) {
      if (!store[fromKey] || fromKey === whoKey()) return;
      mergeInto(prog(), store[fromKey]);
      saveProgress(); paintAll();
    },
    /* What an online account keeps on the server, and folding the
       server's copy back in. Per-line bests of Vault drills stay on the
       device: there can be thousands. */
    syncData: function () {
      var p = clean(prog()), best = {}, n = 0;
      for (var k in p.best) if (k.indexOf("vault:") !== 0 && n++ < 600) best[k] = p.best[k];
      p.best = best;
      return p;
    },
    mergeSync: function (remote) {
      if (!remote || typeof remote !== "object") return;
      var before = JSON.stringify(prog());
      mergeInto(prog(), remote);
      if (JSON.stringify(prog()) === before) return;
      saveProgress(); paintAll();
    },
    finale: finale,
    endFinale: endFinale,
    repaint: paintAll
  };
})();
