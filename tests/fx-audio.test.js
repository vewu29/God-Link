"use strict";
// Sound effects: volume and the tab-switch mute.
// The typing sounds (js/typing-fx.js) play through the page's one
// shared AudioContext (js/tracks.js). Two behaviours are pinned here
// with a mock AudioContext, because no real browser runs in this VM:
//
//  1. The sounds are loud: the default volume is 0.9 and a melody
//     key note peaks at 0.22 (was 0.6 and 0.15).
//  2. Coming back to the tab does not mute them: when the engine is
//     suspended (a tab switch, a call, the lock screen), the note is
//     scheduled anyway and plays the moment the engine runs again,
//     instead of being dropped. Browsers ignore a resume() that is
//     not from a user gesture, so the resume from visibilitychange
//     is modelled as ignored here — the note must still be scheduled.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

/* ---------- minimal browser ---------- */
function makeEl() {
  const el = {
    children: [], style: { setProperty() {} }, dataset: {}, __listeners: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return null; },
    appendChild(c) { this.children.push(c); return c; },
    insertBefore(c) { this.children.push(c); return c; },
    removeChild() {}, querySelector() { return makeEl(); }, querySelectorAll() { return []; },
    addEventListener(t, fn) { (this.__listeners[t] = this.__listeners[t] || []).push(fn); },
    removeEventListener() {}, focus() {},
    getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 20 }; },
    clientWidth: 100, clientHeight: 20, offsetWidth: 100, innerHTML: "", textContent: ""
  };
  return el;
}
const elsById = {};
const listeners = {};
const documentStub = {
  visibilityState: "visible",
  addEventListener(t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
  removeEventListener() {},
  createElement() { return makeEl(); },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById(id) { return elsById[id] || (elsById[id] = makeEl()); },
  dispatchEvent() { return true; },
  hidden: false
};
function fire(type, init) {
  (listeners[type] || []).forEach(function (fn) { fn(init || {}); });
}
function fireEl(el, type, init) {
  (el.__listeners[type] || []).forEach(function (fn) { fn(init || {}); });
}
global.addEventListener = function (t, fn) { (listeners[t] = listeners[t] || []).push(fn); };
global.removeEventListener = function () {};
const store = {};
global.window = global;
global.document = documentStub;
global.localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem(k, v) { store[k] = String(v); }
};
global.matchMedia = function () { return { matches: false }; };
// Node already has a global navigator (no vibrate), so haptic() stays silent.
global.CustomEvent = function (type, init) { this.type = type; this.detail = init && init.detail; };

/* ---------- mock AudioContext ---------- */
// gestureAllowed models the browser rule: resume() only works from a
// user gesture. A resume from visibilitychange is ignored (its
// promise never settles); a resume from a tap or key works.
let gestureAllowed = false;
let resumeCalls = 0;
const started = []; // {type, gain} per oscillator/noise scheduled
class MockParam {
  constructor() { this.value = 0; this.peak = 0; }
  setValueAtTime(v) { this.value = v; this.peak = Math.max(this.peak, v); return this; }
  exponentialRampToValueAtTime(v) { this.value = v; this.peak = Math.max(this.peak, v); return this; }
  linearRampToValueAtTime(v) { this.value = v; this.peak = Math.max(this.peak, v); return this; }
  setTargetAtTime(v) { this.value = v; this.peak = Math.max(this.peak, v); return this; }
  cancelScheduledValues() { return this; }
}
class MockNode {
  constructor() { this.gain = new MockParam(); }
  connect() { return this; }
}
class MockContext {
  constructor() {
    this.state = "suspended";
    this.currentTime = 1;
    this.sampleRate = 44100;
    this.destination = {};
  }
  resume() {
    resumeCalls++;
    if (!gestureAllowed) return new Promise(function () {}); // ignored, never settles
    const self = this;
    return Promise.resolve().then(function () { self.state = "running"; });
  }
  createGain() { return new MockNode(); }
  createDynamicsCompressor() { const n = new MockNode(); n.threshold = new MockParam(); n.ratio = new MockParam(); n.attack = new MockParam(); n.release = new MockParam(); return n; }
  createStereoPanner() { const n = new MockNode(); n.pan = new MockParam(); return n; }
  createBiquadFilter() { const n = new MockNode(); n.frequency = new MockParam(); n.Q = new MockParam(); return n; }
  createOscillator() {
    const o = new MockNode();
    o.type = "sine"; o.frequency = new MockParam(); o.detune = new MockParam();
    o.start = function () { started.push({ kind: "tone", gain: o._gain }); };
    o.stop = function () {};
    // tone() connects the osc to a gain node; record that gain's peak.
    const realConnect = o.connect.bind(o);
    o.connect = function (g) { o._gain = g; return realConnect(g); };
    return o;
  }
  createBufferSource() {
    const s = new MockNode();
    s.buffer = null;
    s.start = function () { started.push({ kind: "noise", gain: s._gain }); };
    s.stop = function () {};
    const realConnect = s.connect.bind(s);
    s.connect = function (g) { s._gain = g; return realConnect(g); };
    return s;
  }
  createBuffer(ch, len) {
    return { getChannelData() { return new Float32Array(len); } };
  }
  createConvolver() { const n = new MockNode(); n.buffer = null; return n; }
  createWaveShaper() { const n = new MockNode(); n.curve = null; n.oversample = "1x"; return n; }
  createDelay() { const n = new MockNode(); n.delayTime = new MockParam(); return n; }
}
let sharedCtx = null;
global.AudioContext = function () {
  if (!sharedCtx) sharedCtx = new MockContext();
  return sharedCtx;
};

const tick = function () { return new Promise(function (r) { setTimeout(r, 10); }); };
const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

test("sound effects: loud by default and not muted by a tab switch", async function () {
  const tracksSrc = fs.readFileSync(path.join(__dirname, "..", "js", "tracks.js"), "utf8");
  const fxSrc = fs.readFileSync(path.join(__dirname, "..", "js", "typing-fx.js"), "utf8");
  if (!window.cbAudioContext) { eval(tracksSrc); eval(fxSrc); }

  // 1. Default volume is 0.9 (was 0.6).
  assert.strictEqual(window.CBFX.settings().volume, 0.9);

  // A fake drill card: enough DOM for the FX hud and sparks.
  const card = makeEl();
  card.querySelector = function () { return null; };

  // 2. First gesture unlocks and runs the engine; a wrong key plays.
  gestureAllowed = true;
  fire("pointerdown");
  await tick();
  assert.strictEqual(sharedCtx.state, "running");
  started.length = 0;
  window.CBFX.slip(card, null, 0, "a", "b");
  assert.ok(started.length > 0, "a slip sound is scheduled while running");
  // The slip thud's tone peak is 0.33 (was 0.22).
  const toneGain = started.filter(function (s) { return s.kind === "tone"; })
    .map(function (s) { return s.gain && s.gain.gain ? s.gain.gain.peak : 0; });
  assert.ok(toneGain.indexOf(0.33) >= 0, "slip tone peaks at 0.33, got " + toneGain.join(","));

  // 3. Switch tabs: the browser suspends the engine. Coming back
  //    fires visibilitychange, whose resume the browser ignores
  //    (not a gesture) — the engine stays suspended.
  sharedCtx.state = "suspended";
  gestureAllowed = false;
  const callsBefore = resumeCalls;
  fire("visibilitychange");
  await tick();
  assert.strictEqual(sharedCtx.state, "suspended", "resume from visibilitychange is ignored");
  assert.ok(resumeCalls > callsBefore, "a wake was attempted on return");

  // 3b. The ignored resume's promise never settles, so a retry
  //     chained to .then() would never fire — the old code's retry
  //     was dead in exactly this case. The retry now runs on a
  //     timer, so another wake is attempted with no gesture at all.
  const callsAfterReturn = resumeCalls;
  await sleep(350);
  assert.ok(resumeCalls > callsAfterReturn, "the wake retried on its own after the ignored resume");

  // 4. The user types. The keydown is a gesture, so the resume is
  //    allowed — but it resolves after this task, so the engine is
  //    still suspended when the note is asked for. The note must be
  //    scheduled anyway (old code dropped it here, and every note
  //    after it, so the sounds stayed silent).
  gestureAllowed = true;
  started.length = 0;
  fire("keydown");
  window.CBFX.slip(card, null, 0, "a", "b");
  assert.ok(started.length > 0, "a slip sound is scheduled even while the engine is still waking");
  await tick();
  assert.strictEqual(sharedCtx.state, "running", "the gesture resume runs the engine again");

  // 5. And the next sounds play normally once it is running.
  started.length = 0;
  window.CBFX.slip(card, null, 0, "a", "b");
  assert.ok(started.length > 0, "sounds play again once running");
});

test("music: the scheduler restarts after a tab switch", async function () {
  // The main engine's interval is its heartbeat. A hidden tab can
  // freeze that interval, so even once the shared engine runs
  // again no new bar is ever scheduled — the music stays silent
  // until a refresh. Coming back must restart the heartbeat.
  const tracksSrc = fs.readFileSync(path.join(__dirname, "..", "js", "tracks.js"), "utf8");
  const fxSrc = fs.readFileSync(path.join(__dirname, "..", "js", "typing-fx.js"), "utf8");
  const musicSrc = fs.readFileSync(path.join(__dirname, "..", "js", "music.js"), "utf8");
  if (!window.cbAudioContext) { eval(tracksSrc); eval(fxSrc); }

  // Record the music interval so the test can kill it, the way a
  // backgrounded tab freezes it.
  const liveIntervals = [];
  const realSetInterval = global.setInterval;
  const realClearInterval = global.clearInterval;
  global.setInterval = function (fn, ms) { const id = realSetInterval(fn, ms); liveIntervals.push(id); return id; };
  global.clearInterval = function (id) {
    const i = liveIntervals.indexOf(id);
    if (i >= 0) liveIntervals.splice(i, 1);
    return realClearInterval(id);
  };
  try {
    // music.js reads the drill room's globals for how many blocks
    // are done (the layers grow as the track fills). The real page
    // defines them in drill.js; the harness stands them in.
    if (typeof global.doneCount !== "function") global.doneCount = function () { return 0; };
    if (!global.BLOCKS) global.BLOCKS = new Array(30);
    eval(musicSrc);
    const btn = elsById.musicBtn;

    // 1. Turn the music on with a gesture; bars are scheduled.
    gestureAllowed = true;
    started.length = 0;
    fireEl(btn, "click");
    await tick();
    assert.strictEqual(window.__musicIsOn(), true, "music is on");
    assert.strictEqual(sharedCtx.state, "running", "the gesture starts the engine");
    assert.ok(started.length > 0, "bars are scheduled while the music plays");
    assert.ok(liveIntervals.length > 0, "the scheduler interval is running");

    // 2. Switch tabs: the browser suspends the engine and freezes
    //    the scheduler's interval, and the clock walks on.
    sharedCtx.state = "suspended";
    gestureAllowed = false;
    liveIntervals.slice().forEach(function (id) { global.clearInterval(id); });
    assert.strictEqual(liveIntervals.length, 0, "the scheduler interval is dead");
    sharedCtx.currentTime = 100;
    started.length = 0;

    // 3. Come back. The resume from visibilitychange is ignored
    //    (not a gesture), but the scheduler must restart anyway and
    //    schedule fresh bars just ahead of the clock — not repay the
    //    missed ones, and not stay silent. The old code had no
    //    return-to-tab recovery at all, so nothing was scheduled.
    fire("visibilitychange");
    await tick();
    assert.ok(liveIntervals.length > 0, "the scheduler interval is running again");
    assert.ok(started.length > 0, "fresh bars are scheduled after coming back");

    // 4. Turn the music off again so no interval is left running.
    fireEl(btn, "click");
    assert.strictEqual(window.__musicIsOn(), false, "music is off");
    assert.strictEqual(liveIntervals.length, 0, "the scheduler interval is stopped");
  } finally {
    // Never leave the scheduler interval running: a live interval
    // keeps the test process alive even if an assertion above threw.
    try { if (window.__musicIsOn && window.__musicIsOn()) fireEl(elsById.musicBtn, "click"); } catch (e) {}
    liveIntervals.slice().forEach(function (id) { try { realClearInterval(id); } catch (e) {} });
    global.setInterval = realSetInterval;
    global.clearInterval = realClearInterval;
  }
});
