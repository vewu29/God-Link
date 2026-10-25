"use strict";
/* ================= GENERATIVE MUSIC (Web Audio) ================= */
(function initMusic() {
  var btn = document.getElementById("musicBtn");
  var btnText = document.getElementById("musicBtnText");
  var AC = null, master = null, padFilter = null, padGain = null, delayIn = null, delayNode = null, hatVol = 0.018;
  var on = false, timer = null, nextBar = 0, barCount = 0;
  /* Thirty generative moods — the same growing-layers idea in
     thirty different harmonic worlds. Calm is the original Code Block sound
     (Cmaj7 · Am7 · Fmaj7 · G6 at 72 BPM). Focus drifts slower through
     A minor; Bright lifts the tempo through a I–V–vi–IV pop loop.
     Night sinks into a slow, deep D-minor hush with no hats at all;
     Arcade runs the same loop at chiptune speed with square-wave
     plucks, an octave up. Rain is the softest of all: a slow E-minor
     wash, sine plucks falling like drips through the delay, and no
     hats — just the pads breathing underneath. Meadow (Loop 3) is
     the sunny one: a G-major pastoral at 84 BPM, triangle plucks
     wandering a G pentatonic ladder over Gmaj7 · Em7 · Cmaj7 · D7.
     Forge (Loop 4) pushes ahead in A major at 100 BPM — a bright
     filter, hats arriving early from layer 6, and warm sawtooth
     plucks kept low (Arcade's square-wave volume is the precedent).
     Orbit (Loop 6) circles in D major at 92 BPM — Dmaj7 · Bm7 ·
     Gmaj7 · A7 under a weightless triangle melody. Pebble
     (Loop 7) skips stones in G major at 76 BPM — Gmaj7 · Em7 ·
     Fmaj7 · Dm7 under soft sine plucks that land like pebbles
     on still water, hats only from layer 14. Summit (Loop 9)
     climbs in F major at 88 BPM — Fmaj7 · Dm7 · Bbmaj7 · C7
     under clear triangle plucks, the view-from-the-top mood:
     bright air, steady steps, hats from layer 10. Vault
     (Loop 11) is the after-hours one, made for the Vault's
     night room: B minor at 70 BPM — Bm7 · Gmaj7 · Dmaj7 · A7
     under a low, dark filter, soft sine plucks ticking like a
     combination lock, hats held back until layer 16. */
  var MOODS = {
    calm: { bpm: 72, filterBase: 850, filterMp: 1500, plucks: [2, 3], hatAt: 12, hatVol: 0.018,
      chords: [[130.81, 164.81, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81], [98.00, 123.47, 146.83, 196.00]],
      roots: [65.41, 55.00, 43.65, 49.00],
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25] },
    focus: { bpm: 60, filterBase: 620, filterMp: 1150, plucks: [1, 2], hatAt: 99, hatVol: 0.010,
      chords: [[110.00, 164.81, 196.00, 246.94], [87.31, 110.00, 130.81, 164.81], [130.81, 164.81, 196.00, 246.94], [98.00, 123.47, 146.83, 196.00]],
      roots: [55.00, 43.65, 65.41, 49.00],
      scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33] },
    bright: { bpm: 96, filterBase: 1150, filterMp: 1900, plucks: [3, 4], hatAt: 8, hatVol: 0.02,
      chords: [[130.81, 164.81, 196.00, 246.94], [98.00, 146.83, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81]],
      roots: [65.41, 49.00, 55.00, 43.65],
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25] },
    night: { bpm: 54, filterBase: 460, filterMp: 880, plucks: [1, 2], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.06,
      chords: [[146.83, 220.00, 261.63, 349.23], [116.54, 146.83, 174.61, 220.00], [87.31, 130.81, 174.61, 220.00], [110.00, 164.81, 220.00, 261.63]],
      roots: [73.42, 58.27, 43.65, 55.00],
      scale: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99] },
    arcade: { bpm: 118, filterBase: 1650, filterMp: 2500, plucks: [4, 5], hatAt: 4, hatVol: 0.013,
      pluckType: "square", pluckVol: 0.026, arpType: "square", arpVol: 0.008,
      chords: [[130.81, 164.81, 196.00, 246.94], [98.00, 146.83, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81]],
      roots: [65.41, 49.00, 55.00, 43.65],
      scale: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51] },
    rain: { bpm: 66, filterBase: 680, filterMp: 1280, plucks: [2, 3], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.05, arpVol: 0.011,
      chords: [[164.81, 196.00, 246.94, 293.66], [130.81, 164.81, 196.00, 246.94], [146.83, 196.00, 246.94, 293.66], [110.00, 164.81, 196.00, 261.63]],
      roots: [82.41, 65.41, 98.00, 55.00],
      scale: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00] },
    /* Drizzle (Loop 13) is Rain's quieter sibling, tuned for
       Library reading: B minor at 62 BPM — Bm7 · Gmaj7 · Em7 ·
       A7 under a soft, low filter, sine plucks pattering like
       drizzle on a window, a sine arp from layer 8, no hats. */
    drizzle: { bpm: 62, filterBase: 720, filterMp: 1340, plucks: [2, 3], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.052, arpType: "sine", arpVol: 0.013,
      chords: [[123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [164.81, 196.00, 246.94, 293.66], [110.00, 138.59, 164.81, 196.00]],
      roots: [61.74, 49.00, 82.41, 55.00],
      scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25] },
    meadow: { bpm: 84, filterBase: 980, filterMp: 1700, plucks: [2, 3], hatAt: 8, hatVol: 0.014,
      pluckType: "triangle", pluckVol: 0.055, arpVol: 0.013,
      chords: [[98.00, 123.47, 146.83, 185.00], [82.41, 98.00, 123.47, 146.83], [130.81, 164.81, 196.00, 246.94], [146.83, 185.00, 220.00, 261.63]],
      roots: [49.00, 41.20, 65.41, 73.42],
      scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00, 987.77] },
    forge: { bpm: 100, filterBase: 1250, filterMp: 2050, plucks: [3, 4], hatAt: 6, hatVol: 0.016,
      pluckType: "sawtooth", pluckVol: 0.028, arpType: "triangle", arpVol: 0.012,
      chords: [[110.00, 138.59, 164.81, 220.00], [82.41, 103.83, 123.47, 164.81], [92.50, 110.00, 138.59, 185.00], [73.42, 92.50, 110.00, 146.83]],
      roots: [55.00, 41.20, 46.25, 36.71],
      scale: [440.00, 493.88, 554.37, 659.25, 739.99, 880.00, 987.77, 1108.73] },
    orbit: { bpm: 92, filterBase: 1080, filterMp: 1880, plucks: [2, 4], hatAt: 10, hatVol: 0.015,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.014,
      chords: [[146.83, 185.00, 220.00, 277.18], [123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 196.00], [110.00, 138.59, 164.81, 220.00]],
      roots: [73.42, 61.74, 49.00, 55.00],
      scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99] },
    pebble: { bpm: 76, filterBase: 760, filterMp: 1420, plucks: [2, 3], hatAt: 14, hatVol: 0.011,
      pluckType: "sine", pluckVol: 0.052, arpType: "sine", arpVol: 0.012,
      chords: [[196.00, 246.94, 293.66, 392.00], [164.81, 196.00, 246.94, 329.63], [174.61, 220.00, 261.63, 349.23], [146.83, 174.61, 220.00, 293.66]],
      roots: [98.00, 82.41, 87.31, 73.42],
      scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00, 987.77] },
    summit: { bpm: 88, filterBase: 1050, filterMp: 1800, plucks: [2, 3], hatAt: 10, hatVol: 0.013,
      pluckType: "triangle", pluckVol: 0.05, arpType: "triangle", arpVol: 0.013,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00] },
    vault: { bpm: 70, filterBase: 560, filterMp: 1050, plucks: [1, 2], hatAt: 16, hatVol: 0.009,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.012,
      chords: [[110.00, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [146.83, 185.00, 220.00, 277.18], [110.00, 138.59, 164.81, 196.00]],
      roots: [61.74, 49.00, 73.42, 55.00],
      scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25] },
    /* Drift (Loop 12) is the slowest water in the collection:
       A major at 58 BPM — Amaj7 · F#m7 · Dmaj7 · E7 — under a
       low, soft filter, sparse sine plucks and a sine arp that
       floats like light on a lake. No hats, ever: the current
       carries this one. */
    drift: { bpm: 58, filterBase: 640, filterMp: 1150, plucks: [1, 2], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.015,
      chords: [[110.00, 138.59, 164.81, 207.65], [92.50, 110.00, 138.59, 164.81], [146.83, 185.00, 220.00, 277.18], [123.47, 164.81, 185.00, 246.94]],
      roots: [55.00, 46.25, 73.42, 61.74],
      scale: [220.00, 246.94, 277.18, 329.63, 440.00, 493.88, 554.37, 659.25] },
    /* Fortune (Loop 16) is the golden one — the mood the
       ceremony deserves: E major at 104 BPM — Emaj7 · C#m7 ·
       Amaj7 · B7 under a warm, open filter, triangle plucks
       with a coin-bright sparkle, hats from layer 8. Lucky,
       but never loud. */
    fortune: { bpm: 104, filterBase: 1180, filterMp: 1980, plucks: [3, 4], hatAt: 8, hatVol: 0.015,
      pluckType: "triangle", pluckVol: 0.05, arpType: "triangle", arpVol: 0.013,
      chords: [[164.81, 207.65, 246.94, 311.13], [138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [123.47, 155.56, 185.00, 220.00]],
      roots: [82.41, 69.30, 55.00, 61.74],
      scale: [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61] },
    /* Halo (Loop 17) is the light-and-glow mood — the sound of
       this loop's luminous blue: C major at 80 BPM — Cmaj7 ·
       Em7 · Am7 · G6 under a bright, wide-open filter,
       crystal sine plucks ringing an octave up,
       a sine arp halo overhead, hats from layer 8. */
    halo: { bpm: 80, filterBase: 1250, filterMp: 2100, plucks: [2, 3], hatAt: 8, hatVol: 0.012,
      pluckType: "sine", pluckVol: 0.05, arpType: "sine", arpVol: 0.014,
      chords: [[130.81, 164.81, 196.00, 246.94], [164.81, 196.00, 246.94, 293.66], [110.00, 130.81, 164.81, 196.00], [98.00, 123.47, 146.83, 196.00]],
      roots: [65.41, 82.41, 55.00, 49.00],
      scale: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51] },
    /* Tide (Loop 18) is the depth-system mood — the sound of
       water over deep blue: E-flat major at 74 BPM — Ebmaj7 ·
       Cm7 · Abmaj7 · Bb7 under a mid, breathing filter,
       triangle plucks that swell and recede like a slow tide,
       a sine arp from layer 10, hats hushed from layer 12. */
    tide: { bpm: 74, filterBase: 900, filterMp: 1560, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.052, arpType: "sine", arpVol: 0.013,
      chords: [[155.56, 196.00, 233.08, 293.66], [130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [116.54, 146.83, 174.61, 207.65]],
      roots: [77.78, 65.41, 51.91, 58.27],
      scale: [311.13, 349.23, 392.00, 466.16, 523.25, 587.33, 622.25, 783.99] },
    /* Velvet (Loop 19) is the tactile mood — the sound of a
       soft press: C minor at 68 BPM — Cm7 · Abmaj7 · Ebmaj7 ·
       Fm7 under a low, close filter, plush triangle plucks
       close to the ear, a whisper of sine arp, hats held back
       to layer 14 so the surface stays unbroken. */
    velvet: { bpm: 68, filterBase: 700, filterMp: 1250, plucks: [1, 2], hatAt: 14, hatVol: 0.010,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.012,
      chords: [[130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [155.56, 196.00, 233.08, 293.66], [174.61, 207.65, 261.63, 311.13]],
      roots: [65.41, 51.91, 77.78, 87.31],
      scale: [261.63, 293.66, 311.13, 392.00, 466.16, 523.25, 587.33, 622.25] },
    /* Lagoon (Loop 21) is the spacing system's mood — the
       sound of room to breathe: A-flat major at 82 BPM —
       Abmaj7 · Fm7 · Dbmaj7 · Eb7 under a warm, open filter,
       triangle plucks wading in shallow sunlit water, a sine
       arp rippling from layer 10, hats hushed from layer 12.
       A key no other mood in the collection uses. */
    lagoon: { bpm: 82, filterBase: 950, filterMp: 1650, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[207.65, 261.63, 311.13, 392.00], [174.61, 207.65, 261.63, 311.13], [138.59, 174.61, 207.65, 261.63], [155.56, 196.00, 233.08, 277.18]],
      roots: [103.83, 87.31, 69.30, 77.78],
      scale: [415.30, 466.16, 523.25, 622.25, 698.46, 783.99, 830.61, 1046.50] },
    /* Aurora (Loop 23) is the boot moment's mood — the sound
       of first light over the world: B-flat major at 86 BPM —
       Bbmaj7 · Gm7 · Ebmaj7 · F7 under a wide, brightening
       filter, triangle plucks rising like dawn, a sine arp
       shimmering from layer 10, hats hushed from layer 12.
       A key no other mood in the collection uses. */
    aurora: { bpm: 86, filterBase: 1020, filterMp: 1780, plucks: [2, 3], hatAt: 12, hatVol: 0.012,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[116.54, 146.83, 174.61, 220.00], [98.00, 116.54, 146.83, 174.61], [155.56, 196.00, 233.08, 293.66], [87.31, 110.00, 130.81, 155.56]],
      roots: [58.27, 49.00, 77.78, 43.65],
      scale: [233.08, 261.63, 293.66, 349.23, 392.00, 440.00, 466.16, 587.33] },
    /* Cascade (Loop 27) is the lit road's mood — the sound
       of water over stepping stones: E major at 78 BPM —
       Emaj7 · C#m7 · Amaj7 · B7 under a clear, open filter,
       triangle plucks stepping down an E-major ladder, a
       sine arp rippling from layer 10, hats hushed from
       layer 12. Fortune's E-major loop, slowed to a
       walking pace under a cooler filter. */
    cascade: { bpm: 78, filterBase: 980, filterMp: 1720, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[164.81, 207.65, 246.94, 311.13], [138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [123.47, 155.56, 185.00, 220.00]],
      roots: [82.41, 69.30, 55.00, 61.74],
      scale: [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61] },
    /* Granite (Loop 29) is the weighted world's mood — the
       sound of stone settling: C minor at 64 BPM, a slow,
       heavy walk — Cm7 · Abmaj7 ·
       Ebmaj7 · Bb7 under a low, grounded filter, deep sine
       plucks landing like set blocks, a sine arp from
       layer 12, hats held back until layer 16 so the
       weight arrives before the shimmer. A tempo no other
       mood in the collection uses; the key is Velvet's
       C minor, walked heavier. */
    granite: { bpm: 64, filterBase: 620, filterMp: 1150, plucks: [1, 2], hatAt: 16, hatVol: 0.009,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.011,
      chords: [[130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [155.56, 196.00, 233.08, 293.66], [116.54, 146.83, 174.61, 220.00]],
      roots: [65.41, 51.91, 77.78, 58.27],
      scale: [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25] },
    /* Laurel (Loop 31) is the trophy mood — the sound of a
       crown being set down: D major at 90 BPM — Dmaj7 ·
       Bm7 · Gmaj7 · A7 under a clear, open filter, triangle
       plucks with a victor's easy stride, a sine arp
       circling from layer 10 like light around a halo, hats
       hushed from layer 12. Orbit's D-major loop at a
       statelier tempo, its hats held two layers later. */
    laurel: { bpm: 90, filterBase: 1080, filterMp: 1850, plucks: [2, 3], hatAt: 12, hatVol: 0.012,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[146.83, 185.00, 220.00, 277.18], [123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [110.00, 138.59, 164.81, 196.00]],
      roots: [73.42, 61.74, 49.00, 55.00],
      scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99] },
    /* Meridian (Loop 33) is the bridge mood — the sound of
       crossing from one place to another: D-flat major at
       84 BPM — Dbmaj7 · Bbm7 · Gbmaj7 · Ab7 under a clear,
       travelling filter, triangle plucks walking the line
       between keys, a sine arp from layer 10, hats hushed
       from layer 12. A key no other mood in the collection
       uses, at Meadow's travelling tempo. */
    meridian: { bpm: 84, filterBase: 1000, filterMp: 1740, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[138.59, 174.61, 207.65, 261.63], [116.54, 138.59, 174.61, 207.65], [92.50, 116.54, 138.59, 174.61], [103.83, 130.81, 155.56, 185.00]],
      roots: [69.30, 58.27, 46.25, 51.91],
      scale: [277.18, 311.13, 349.23, 415.30, 466.16, 523.25, 554.37, 698.46] },
    /* Ember (Loop 34) is the hearth mood — the sound of a
       fire kept low: G minor at 94 BPM — Gm7 · Ebmaj7 ·
       Bbmaj7 · F7 under a low, warm filter, triangle plucks
       glowing close to the ear, and the engine's new bell
       voice tolling one high chord tone per bar from
       layer 6 — the first mood ever scored for it. Hats
       held back to layer 14 so the warmth stays unbroken.
       A key and a tempo no other mood in the collection
       uses. */
    ember: { bpm: 94, filterBase: 680, filterMp: 1260, plucks: [2, 3], hatAt: 14, hatVol: 0.010,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.012,
      bellAt: 6, bellVol: 0.016,
      chords: [[196.00, 233.08, 293.66, 349.23], [155.56, 196.00, 233.08, 293.66], [116.54, 146.83, 174.61, 220.00], [174.61, 220.00, 261.63, 311.13]],
      roots: [98.00, 77.78, 58.27, 87.31],
      scale: [392.00, 440.00, 466.16, 523.25, 587.33, 698.46, 783.99, 932.33] },
    /* Zephyr (Loop 35) is the wind mood — the sound of air
       moving over open blue: F major at 98 BPM — Fmaj7 ·
       Dm7 · Bbmaj7 · C7 under a clear, travelling filter,
       triangle plucks drifting like leaves on a breeze, a
       sine arp from layer 10, and the engine's new swell
       voice breathing one long chord tone per bar from
       layer 8 — the first mood ever scored for it. Hats
       hushed from layer 12. Summit's F-major voicing, at
       a tempo no other mood in the collection uses. */
    zephyr: { bpm: 98, filterBase: 1050, filterMp: 1820, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      swellAt: 8, swellVol: 0.02,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00] },
    /* Hymn (Loop 38) is the quiet side — the sound of
       winding down at the end of the day: B major at
       52 BPM, the slowest tempo in the collection —
       Bmaj7 · G#m7 · Emaj7 · F#7, the old hymn loop,
       under the lowest, closest filter of any major-key
       mood, sparse sine plucks falling like last light,
       no hats ever. It is the first mood scored for both
       signature voices at once: the bell tolls one high
       chord tone per bar from layer 5 and the swell
       breathes one long tone per bar from layer 6, so
       the two voices Ember and Zephyr each introduced
       sing together here like a small choir settling.
       A key and a tempo no other mood in the collection
       uses. Loop 39 flags it quiet: true — the mark of
       the winding-down moods, which the Bridge (below)
       now crosses into by descending, an amen instead
       of a climb. */
    hymn: { bpm: 52, filterBase: 540, filterMp: 1020, plucks: [1, 2], hatAt: 99, hatVol: 0, quiet: true,
      pluckType: "sine", pluckVol: 0.05, arpType: "sine", arpVol: 0.011,
      bellAt: 5, bellVol: 0.014, swellAt: 6, swellVol: 0.018,
      chords: [[123.47, 155.56, 185.00, 233.08], [103.83, 123.47, 155.56, 185.00], [164.81, 207.65, 246.94, 311.13], [185.00, 233.08, 277.18, 329.63]],
      roots: [61.74, 51.91, 41.20, 46.25],
      scale: [246.94, 277.18, 311.13, 329.63, 369.99, 415.30, 466.16, 493.88] },
    /* Vespers (Loop 39) is Hymn's evening companion —
       the last office of the day, sung as the light
       goes: F minor at 56 BPM, the third-slowest tempo
       in the collection — Fm7 · Dbmaj7 · Abmaj7 · C7
       under the lowest filter of any mood but Night,
       sparse sine plucks like single candles, no hats
       ever. Like Hymn it is scored for both signature
       voices, but they arrive sooner and softer —
       the bell from layer 4, the swell from layer 5 —
       because at vespers the quiet voices lead and the
       plucks only follow. It carries the quiet flag
       too, so crossing into it descends the amen.
       A key and a tempo no other mood in the
       collection uses. */
    vespers: { bpm: 56, filterBase: 520, filterMp: 980, plucks: [1, 2], hatAt: 99, hatVol: 0, quiet: true,
      pluckType: "sine", pluckVol: 0.048, arpType: "sine", arpVol: 0.010,
      bellAt: 4, bellVol: 0.013, swellAt: 5, swellVol: 0.017,
      chords: [[174.61, 207.65, 261.63, 311.13], [138.59, 174.61, 207.65, 261.63], [103.83, 130.81, 155.56, 196.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 69.30, 51.91, 65.41],
      scale: [174.61, 196.00, 207.65, 233.08, 261.63, 277.18, 311.13, 349.23] },
    /* Monsoon (Loop 40) is Zephyr's mirror — the same
       F-major loop heard from the other side of the glass:
       Fmaj7 · Dm7 · Bbmaj7 · C7, the same chords and roots
       as Zephyr over a lower, wider ladder of the same
       key, the breeze become a rain-front.
       It rides faster — 104 BPM, Fortune's tempo pushed
       harder — under the widest travelling filter of any
       wind mood, with square-wave plucks pattering where
       Zephyr's triangles drifted, kept at Forge's sawtooth
       volume (0.028) so the edge never shouts. Hats arrive
       early, from layer 10, like rain finding the roof,
       and the swell breathes from layer 7 — one layer
       sooner than Zephyr's — on the polished three-bar
       lane below. Monsoon is pointedly NOT quiet: a front
       arrives standing up, so the Bridge climbs into it
       like any working mood; only the winding-down side
       ever earns the amen. */
    monsoon: { bpm: 104, filterBase: 1180, filterMp: 2050, plucks: [2, 3], hatAt: 10, hatVol: 0.012,
      pluckType: "square", pluckVol: 0.028, arpType: "sine", arpVol: 0.013,
      swellAt: 7, swellVol: 0.019,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [174.61, 196.00, 220.00, 261.63, 293.66, 329.63, 349.23, 392.00] },
    /* Night Drive (Loop 41) is the synth-forward mood —
       the sound of a night highway at cruise speed:
       C-sharp minor at 102 BPM — C#m7 · Amaj7 · Emaj7 ·
       B7, the classic synthwave loop — under a wide-open
       synth filter, with sawtooth on BOTH melody voices:
       saw plucks at 0.03 (Forge's sawtooth precedent,
       a breath louder) and the collection's first sawtooth
       arp at 0.009 (Arcade's square-arp weight), so the
       whole top of the arrangement is circuitry, not
       wood. Hats arrive from layer 6 — only Arcade
       starts its rhythm sooner, Forge just as soon —
       like a steady road beat. And it is the first mood scored wide:
       panWide: true opens the engine's new stereo field
       (Loop 41, below) to full width, so its plucks
       travel and its arp sweeps kerb to kerb while every
       other mood moves in a gentler lane. Pointedly NOT
       quiet: a drive starts standing up, so the Bridge
       climbs into it like any working mood. A key and a
       tempo no other mood in the collection uses. */
    nightdrive: { bpm: 102, filterBase: 1320, filterMp: 2240, plucks: [3, 4], hatAt: 6, hatVol: 0.014,
      pluckType: "sawtooth", pluckVol: 0.03, arpType: "sawtooth", arpVol: 0.009,
      panWide: true,
      chords: [[138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [164.81, 207.65, 246.94, 311.13], [123.47, 155.56, 185.00, 220.00]],
      roots: [69.30, 55.00, 82.41, 61.74],
      scale: [277.18, 311.13, 329.63, 369.99, 415.30, 440.00, 493.88, 554.37] }
  };
  var mood = "calm";
  try {
    var savedMood = localStorage.getItem("code-block-music-mood-v1");
    if (savedMood && MOODS[savedMood]) mood = savedMood;
  } catch (e) {}
  /* A gentle composed phrase for the masterpiece lead (pentatonic indexes, -1 = rest) */
  var LEAD = [4, -1, 2, 3, 4, -1, 5, 4, 3, 2, -1, 1, 2, -1, -1, -1,
              4, -1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, -1, -1, -1];
  var melodyIdx = 3;
  /* Loop 32 — Echo: the music listens to the learner. Typing
     signals (window.__musicEcho, fed by the Sandbox drill, the
     PC type-along and the Vault) raise and lower a slow "flow"
     tide inside the engine: correct letters feed it, perfect
     reps feed it more, a refused letter lets some out, and
     stillness drains it back to rest over ~30 quiet seconds.
     scheduleBar spends the tide — pads open toward their
     masterpiece brightness, plucks thicken, the arp and hats
     arrive early, and a high sheen rides hot streaks — while
     each perfect rep answers with one soft note that climbs
     the mood's own scale as the streak grows. Nothing here
     touches a drill rule, a rep count, or storage. */
  var flow = 0, streak = 0, duckTimer = null;
  function flowFilter(M) { return M.filterBase + (M.filterMp - M.filterBase) * Math.min(1, flow * 0.85); }

  function layers() { return doneCount(); }
  function isMasterpiece() { return doneCount() >= BLOCKS.length; }

  /* The finishing chain: a gentle tape-style saturation warms every
     voice before the compressor, and the shared room reverb (the same
     hall the typing sounds ring in) gives the music depth. */
  function warmCurve() {
    var n = 2048, c = new Float32Array(n), k = 1.6;
    for (var i = 0; i < n; i++) { var x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); }
    return c;
  }
  function buildGraph() {
    AC = window.cbAudioContext();
    master = AC.createGain(); master.gain.value = 0;
    var comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.3;
    var warm = AC.createWaveShaper();
    warm.curve = warmCurve(); warm.oversample = "2x";
    var air = AC.createBiquadFilter(); air.type = "highshelf"; air.frequency.value = 7000; air.gain.value = -3;
    master.connect(warm); warm.connect(air); air.connect(comp); comp.connect(AC.destination);
    var room = window.cbAudioRoom ? window.cbAudioRoom() : null;
    if (room) { var send = AC.createGain(); send.gain.value = 0.34; comp.connect(send); send.connect(room); }
    padFilter = AC.createBiquadFilter();
    padFilter.type = "lowpass"; padFilter.frequency.value = 850; padFilter.Q.value = 0.4;
    padFilter.connect(master);
    /* The pad filter breathes: a very slow LFO opens and closes it,
       so the bed swells like slow breathing instead of sitting still. */
    var lfo = AC.createOscillator(), lfoDepth = AC.createGain();
    lfo.frequency.value = 0.06; lfoDepth.gain.value = 260;
    lfo.connect(lfoDepth); lfoDepth.connect(padFilter.frequency); lfo.start();
    /* The pads get their own gain stage into the filter, so the
       pad bed can be balanced apart from the master bus. */
    padGain = AC.createGain(); padGain.gain.value = 0.9;
    padGain.connect(padFilter);
    var delay = AC.createDelay(1); delay.delayTime.value = (60 / MOODS[mood].bpm) * 0.75;
    delayNode = delay;
    var fb = AC.createGain(); fb.gain.value = 0.32;
    var wet = AC.createGain(); wet.gain.value = 0.22;
    /* Ping-pong: each echo lands on the opposite side, softened by a
       low-pass so repeats grow darker as they fade. */
    var dampEcho = AC.createBiquadFilter(); dampEcho.type = "lowpass"; dampEcho.frequency.value = 3200;
    var second = AC.createDelay(1); second.delayTime.value = delay.delayTime.value / 2;
    delay.connect(dampEcho); dampEcho.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(panDest(-0.6, master));
    var wet2 = AC.createGain(); wet2.gain.value = 0.16;
    delay.connect(second); second.connect(wet2); wet2.connect(panDest(0.6, master));
    delayIn = delay;
  }
  /* Loop 41 — stereo: until now every voice summed to the
     middle of the road. panDest routes a gain through a
     StereoPannerNode into a destination bus, clamped to
     [-1, 1]; where the browser has no StereoPanner it
     returns the bus itself, so the graph degrades to
     exactly the old mono mix. Pads and swells take a
     fixed gentle spread (their two detuned oscillators
     sit a little left and a little right), while tone()
     gains an optional seventh argument — a pan position
     for that one note — which scheduleBar spends as
     movement: plucks travel on a slow arc, the arp
     sweeps side to side. Voices that must come from one
     place (the bass root, the bell, the fanfare, the
     bridge, the answer notes) pass no pan and stay
     centred, byte-identical to before. */
  function panDest(pan, dest) {
    if (!AC || typeof AC.createStereoPanner !== "function") return dest;
    var p = AC.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(dest);
    return p;
  }
  /* Three voices per pad note — a sine in the middle and two gently
     detuned triangles spread left and right — make a wide, slowly
     shimmering chorus instead of a single flat tone. */
  function pad(freq, t, dur) {
    [[0, "sine", 0, 0.04], [7, "triangle", 0.35, 0.026], [-7, "triangle", -0.35, 0.026]].forEach(function (v) {
      var o = AC.createOscillator();
      o.type = v[1];
      o.frequency.value = freq; o.detune.value = v[0];
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(v[3], t + 1.1);
      g.gain.setValueAtTime(v[3], t + dur - 1.0);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
      o.connect(g); g.connect(panDest(v[2], padGain));
      o.start(t); o.stop(t + dur + 0.5);
    });
  }
  function tone(freq, t, dur, vol, type, toDelay, pan) {
    var o = AC.createOscillator(); o.type = type || "triangle"; o.frequency.value = freq;
    var g = AC.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(typeof pan === "number" && pan !== 0 ? panDest(pan, master) : master);
    if (toDelay) g.connect(delayIn);
    o.start(t); o.stop(t + dur + 0.05);
  }
  /* Loop 34 — the bell: the engine's fifth voice. A struck
     bell is two sines — the fundamental and a quiet inharmonic
     partial a little above two octaves up (×4.2) — struck
     fast and left to ring out on a long exponential tail,
     always sent through the shared delay so it hangs in the
     same air as the plucks. Used sparingly: a mood opts in
     with bellAt, and scheduleBar tolls it once a bar. */
  function bell(freq, t, dur, vol) {
    [[1, 1], [4.2, 0.32]].forEach(function (p) {
      var o = AC.createOscillator(); o.type = "sine";
      o.frequency.value = freq * p[0];
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * p[1], t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur * (p[0] === 1 ? 1 : 0.45));
      o.connect(g); g.connect(master); g.connect(delayIn);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  /* Loop 35 — the swell: the engine's sixth voice, and the
     opposite of the bell. Where the bell is struck, the
     swell breathes in: two triangle oscillators detuned a
     few cents apart swell up slowly over nearly half the
     note and sigh back down, routed through the pad bus so
     the voice rides the same breathing filter as the chord
     bed — a bowed, wind-like tone that never starts or
     stops abruptly. Used sparingly: a mood opts in with
     swellAt, and scheduleBar breathes it once a bar. */
  function swell(freq, t, dur, vol) {
    [-4, 4].forEach(function (det) {
      var o = AC.createOscillator(); o.type = "triangle";
      o.frequency.value = freq; o.detune.value = det;
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + dur * 0.45);
      g.gain.linearRampToValueAtTime(0, t + dur);
      /* Loop 41: the breath opens widest of the bed voices —
         its two detuned triangles sit ±0.3 out, so a swell
         feels like air arriving from both sides at once. */
      o.connect(g); g.connect(panDest(det < 0 ? -0.3 : 0.3, padGain));
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function hat(t) {
    var len = AC.sampleRate * 0.05;
    var buf = AC.createBuffer(1, len, AC.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = AC.createBufferSource(); src.buffer = buf;
    var f = AC.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 7000;
    var g = AC.createGain(); g.gain.value = hatVol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }
  function scheduleBar(bar, t) {
    var M = MOODS[mood];
    var CHORDS = M.chords, ROOTS = M.roots, PENTA = M.scale;
    var SPB = 60 / M.bpm, BAR = SPB * 4;
    hatVol = M.hatVol;
    var chord = CHORDS[bar % 4];
    var L = layers(), mp = isMasterpiece();
    padFilter.frequency.setTargetAtTime(mp ? M.filterMp : flowFilter(M), t, 1.5);
    chord.forEach(function (f) { pad(f, t, BAR); });
    if (L >= 4 || mp) tone(ROOTS[bar % 4], t, BAR * 0.9, 0.10, "sine", false);
    /* Loop 41 — stereo movement: the melody voices travel.
       panRange is the half-width of this mood's lane —
       ±0.38 for every mood, ±0.8 for a panWide mood
       (Night Drive is the first) — and every pan below
       stays inside it. The bass above passes no pan: the
       root anchors the middle of the road. */
    var panRange = M.panWide ? 0.8 : 0.38;
    /* sparse pluck melody — random walk on the pentatonic ladder */
    var plucks = mp ? 5 : (L >= 1 ? M.plucks[1] : M.plucks[0]) + (flow >= 0.55 ? 1 : 0) + (flow >= 0.85 ? 1 : 0);
    var slots = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
    for (var k = 0; k < plucks; k++) {
      if (Math.random() < 0.25) continue;
      var slot = slots[Math.floor(Math.random() * slots.length)];
      melodyIdx = Math.max(0, Math.min(PENTA.length - 1, melodyIdx + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      /* Each pluck is placed on a slow arc that swings
         with the bar count and the note's own slot, so the
         melody wanders the lane instead of sitting in it. */
      tone(PENTA[melodyIdx], t + slot * SPB, 1.6, M.pluckVol || 0.055, M.pluckType || "triangle", true, Math.sin(bar * 0.9 + slot * 1.1) * panRange);
    }
    if (L >= 8 || flow >= 0.7 || mp) {
      for (var s = 0; s < 8; s++) {
        var f = chord[s % chord.length] * (s % 2 ? 4 : 2);
        /* The arp sweeps the lane step by step — left to
           right on even bars, right to left on odd ones —
           so the pattern drives back and forth overhead. */
        var arpPan = (s / 7 * 2 - 1) * panRange;
        if (bar % 2) arpPan = -arpPan;
        tone(f, t + s * SPB * 0.5, 0.7, M.arpVol || 0.016, M.arpType || "sine", true, arpPan);
      }
    }
    /* Loop 34 — the bell bed: a mood that carries bellAt
       earns one slow struck bell on the bar's third beat
       once enough layers are in (or while the flow runs
       hot, or in the masterpiece), tolling a chord tone
       two octaves up. Moods without bellAt never schedule
       one — the voice stays Ember's signature (Hymn, Loop
       38, joins it — the first mood scored for both the
       bell and the swell at once; Vespers, Loop 39, joins
       them both on the quiet side). */
    if (M.bellAt && (L >= M.bellAt || flow >= 0.8 || mp)) {
      bell(chord[(bar + 1) % chord.length] * 4, t + SPB * 2, 2.8, M.bellVol || 0.016);
    }
    /* Loop 35 — the swell bed: a mood that carries swellAt
       earns one slow breath per bar once enough layers are
       in (or while the flow runs warm, or in the
       masterpiece), swelling a chord tone one octave up
       from the bar's second beat across almost the whole
       bar. Moods without swellAt never schedule one — the
       voice stays Zephyr's signature (Hymn, Loop 38, joins
       it — the first mood scored for both voices at once;
       Vespers, Loop 39, breathes with it on the quiet side;
       Monsoon, Loop 40, blows with it on the working side).
       Loop 40 — the swell lane: the breath used to ride ONE
       chord slot every bar (index +2), so over a four-bar
       loop it traced the same two tones forever. It now
       rotates on a three-bar lane — slot +2, +2, then +3 —
       so the breath crosses the loop's chord tones out of
       phase with the chords themselves (fifth, seventh,
       then the third held across the join), and the whole
       breath-pattern repeats every twelve bars instead of
       four. Nothing else
       moves: same beat (the bar's second), same octave,
       same span, same gate, same per-mood volume — and the
       fanfare's own swell call sites are untouched, because
       a ceremony is composed, not generated. */
    if (M.swellAt && (L >= M.swellAt || flow >= 0.75 || mp)) {
      var swellLane = bar % 3 === 2 ? 3 : 2;
      swell(chord[(bar + swellLane) % chord.length] * 2, t + SPB, BAR * 0.95, M.swellVol || 0.02);
    }
    /* Loop 32: a hot streak earns a sheen — one high, quiet
       sparkle per bar while the flow lasts. Loop 41: it
       shines from the far side of the lane, answering the
       bar's pluck arc from the opposite kerb. */
    if (flow >= 0.6 && !mp) tone(PENTA[PENTA.length - 1] * 2, t + SPB * 2.5, 1.4, 0.011, "sine", true, -Math.sin(bar * 0.9) * panRange);
    if (L >= M.hatAt || flow >= 0.92 || mp) { hat(t + SPB); hat(t + SPB * 3); }
    if (mp) {
      for (var q = 0; q < 8; q++) {
        var li = LEAD[(bar % 2) * 16 + q * 2] >= 0 ? LEAD[(bar % 2) * 16 + q * 2] : LEAD[(bar % 2) * 16 + q * 2 + 1];
        /* Loop 41: the masterpiece lead walks the lane at
           half width — present in the field, never so wide
           it leaves the ceremony behind. */
        if (li >= 0) tone(PENTA[li] * 2, t + q * SPB * 0.5, 1.1, 0.05, "sine", true, (q / 7 * 2 - 1) * panRange * 0.5);
      }
    }
  }
  function loop() {
    /* Loop 32: the flow tide ebbs a little on every scheduler
       pass (~0.02 per second), so stillness always settles
       the music back to its resting shape. */
    if (flow > 0) flow = Math.max(0, flow - 0.004);
    /* Loop 59 — the scheduler resync: this interval is the
       engine's heartbeat, and browsers throttle or pause
       timers in a hidden tab while the AudioContext clock
       keeps walking. Until now the while below repaid that
       debt literally: on the first tick back it scheduled
       EVERY missed bar at its long-past start time, and
       Web Audio plays a past-dated note immediately — so a
       minute in the background returned as dozens of bars
       (hundreds of oscillators) stacked into one blast,
       and even a one-second throttle smeared each bar's
       start a little into the past. The missed bars are
       now dropped, not repaid: barCount and nextBar skip
       forward by whole bars (so the chord cycle, the arp's
       direction and the swell's three-bar lane keep the
       phase they would have had), and scheduling resumes
       just ahead of the clock. Ordinary jitter — a tick
       landing a fraction of a bar late — is untouched: the
       resync only fires once a bar start is a real step
       (0.15 s) behind the clock. */
    var BAR = (60 / MOODS[mood].bpm) * 4;
    if (nextBar < AC.currentTime - 0.15) {
      barCount += Math.floor((AC.currentTime - nextBar) / BAR) + 1;
      nextBar = AC.currentTime + 0.1;
    }
    while (nextBar < AC.currentTime + 0.7) {
      scheduleBar(barCount, nextBar);
      nextBar += BAR; barCount++;
    }
  }
  function start() {
    /* One song at a time: the Library's picture music steps aside. */
    if (window.stopStageMusic) window.stopStageMusic();
    if (!AC) buildGraph();
    AC.resume();
    master.gain.cancelScheduledValues(AC.currentTime);
    master.gain.setTargetAtTime(0.5, AC.currentTime, 0.8);
    nextBar = AC.currentTime + 0.1; barCount = 0;
    timer = setInterval(loop, 200); loop();
  }
  function stop() {
    if (!AC) return;
    master.gain.setTargetAtTime(0, AC.currentTime, 0.3);
    clearInterval(timer); timer = null;
    /* The engine is shared with the typing sounds, so it is never
       suspended here: the master gain is already fading to silence. */
  }
  /* Finale glissando: the moment a track's mastery reaches 100%,
     one quiet sine climbs an octave through the current mood's
     scale over about 1.2 s — a small rising breath under the
     masterpiece bloom. Silent if the music was never started.
     Loop 37: a second sine now glides with it a perfect fifth
     above (×1.5, tracking the same octave climb at half the
     weight), so the arrival lands as a chord, not a solo line —
     the first harmony the masterpiece moment ever announced
     itself with, and a promise of the fanfare's fuller voicing. */
  function finaleGliss() {
    /* Loop 67: silent while the music is off, not only while it
       was never started — the off case used to resume the
       suspended context and schedule the glissando (and, 1.25 s
       later, the whole fanfare) into the zeroed master gain,
       which also armed the fanfare's replay guard and made a
       Relive pressed just after turning the music on no-op. */
    if (!AC || !master || !on) return;
    try { AC.resume(); } catch (e) {}
    var scale = MOODS[mood].scale;
    var from = scale[Math.min(4, scale.length - 1)];
    var t = AC.currentTime + 0.05;
    [[1, 0.05], [1.5, 0.026]].forEach(function (voice) {
      var o = AC.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(from * voice[0], t);
      o.frequency.exponentialRampToValueAtTime(from * voice[0] * 2, t + 1.2);
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(voice[1], t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 1.35);
      o.connect(g); g.connect(master);
      if (delayIn) g.connect(delayIn);
      o.start(t); o.stop(t + 1.45);
    });
    /* …and the glissando lands on the grand fanfare. */
    setTimeout(grandFanfare, 1250);
  }
  window.__finaleGliss = finaleGliss;
  /* A short filtered noise burst — the fanfare's snare-ish tick.
     Same noise-buffer recipe as hat(), voiced lower and louder
     through a bandpass so it reads as a soft drum, not a hiss. */
  function tick(t, vol) {
    var len = Math.floor(AC.sampleRate * 0.07);
    var buf = AC.createBuffer(1, len, AC.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = AC.createBufferSource(); src.buffer = buf;
    var f = AC.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.8;
    var g = AC.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }
  /* Loop 37 — the thump: the engine's seventh voice, and the
     fanfare's drum. One sine whose pitch falls from a sixth
     above the root down to the root itself over a third of a
     second while its gain blooms fast and decays on a long
     exponential tail — a soft timpani stroke, felt as much
     as heard. Dry (no delay): a drum that echoes is a drum
     in the wrong room. Used only by the grand fanfare — the
     herald's opening stroke and the climax's two beats — so
     the everyday generative loop stays exactly as calm as
     it always was. */
  function thump(freq, t, vol) {
    var o = AC.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(freq * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, freq), t + 0.32);
    var g = AC.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.85);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.95);
  }
  /* Grand fanfare (Loop 15, expanded Loops 36–37): the finale
     the glissando lands on — now a full ceremony in five
     movements through the current mood's own chord loop, in
     the original Calm the classic C-major-family procession.
     The Herald (one bar) opens it: a thump on the tonic, three
     unison chord stabs, and a tick roll that crescendos into
     a held scale-top — the doors opening. Phrase one (bars
     2–5) states the theme grand: swelling pads, a walking
     bass (root · fifth · octave · fifth), the composed LEAD
     phrase at twice its usual density, pluck sparkle, and
     snare-ish ticks on the off-beats. Phrase two (bars 6–9)
     answers it: the LEAD's second half leads, the sparkle
     doubles, ticks land on every beat, a swell breathes under
     bars 6 and 8 — and the LEAD now answers itself in canon,
     echoing one beat behind at whisper weight, so the theme
     sounds chased by its own success. The Procession (bars
     10–11) walks the loop's last two chords home: the bass
     climbs, ticks march (off-beats joining in the second
     bar), a thump underlines the final approach, and bell
     and swell trade places bar to bar — antiphony, the two
     signature voices calling across the hall. The Climax is
     a held tonic with real weight now: two thumps, a sub-
     octave under the root where the root is high enough to
     carry one, a two-tone swell stack, five slow bell tolls,
     and the scale climbing to its top note before a high
     sparkle descent rains back down. The Coda lets it land:
     one soft swell, the LEAD's opening gesture (5·4·3·1)
     stepping back down at fading weight, and a single last
     bell toll left ringing into the returning generative loop.
     A replay guard keeps fanfares from stacking: while one
     ceremony is sounding, further calls (the glissando's
     delayed landing, the ceremony's own button, the banner's
     Relive) politely no-op until it has finished. Everything
     is scheduled with the engine's own voices at modest
     volumes, and it stays silent if the music was never
     started. The ceremony overlay replays it through
     window.__grandFanfare. */
  var fanfareEnd = 0;
  function grandFanfare() {
    /* Loop 67: the same off-guard as the glissando — a fanfare
       requested while the music is off must not schedule forty
       seconds of silence that poisons the replay guard below. */
    if (!AC || !master || !on) return;
    try { AC.resume(); } catch (e) {}
    if (AC.currentTime < fanfareEnd) return;
    var M = MOODS[mood];
    var SPB = 60 / M.bpm, BAR = SPB * 4;
    var t0 = AC.currentTime + 0.06;
    var p0 = t0 + BAR;              /* phrases begin after the herald */
    var tf = p0 + 10 * BAR;         /* climax: 8 phrase bars + 2 procession bars */
    var tc = tf + BAR * 1.7;        /* coda */
    fanfareEnd = tc + BAR * 1.2 + 3.2;
    /* — Herald: one bar of doors opening. — */
    thump(M.roots[0], t0, 0.13);
    [0, 1.5, 3].forEach(function (beat) {
      M.chords[0].forEach(function (f) { tone(f * 2, t0 + beat * SPB, 0.7, 0.028, "triangle", true); });
    });
    for (var ht = 0; ht < 8; ht++) tick(t0 + ht * SPB * 0.5, 0.02 + ht * 0.004);
    tone(M.scale[Math.min(4, M.scale.length - 1)] * 2, t0 + SPB * 3, 1.2, 0.04, "sine", true);
    /* — Phrases one and two: the theme, stated and answered. — */
    for (var bar = 0; bar < 8; bar++) {
      var t = p0 + bar * BAR;
      var chord = M.chords[bar % 4], root = M.roots[bar % 4];
      var phrase2 = bar >= 4;
      chord.forEach(function (f) { pad(f, t, BAR * 1.05); });
      [1, 1.5, 2, 1.5].forEach(function (mult, s) {
        tone(root * mult, t + s * SPB, SPB * 0.95, phrase2 ? 0.12 : 0.11, "sine", false);
      });
      for (var q = 0; q < 8; q++) {
        var li = LEAD[(bar % 2) * 16 + q + (phrase2 ? 8 : 0)];
        if (li === undefined || li < 0) li = LEAD[(bar % 2) * 16 + q];
        if (li >= 0 && M.scale[li] !== undefined) tone(M.scale[li] * 2, t + q * SPB * 0.5, 1.15, phrase2 ? 0.06 : 0.055, "sine", true);
      }
      var sparkle = phrase2 ? 8 : 4;
      for (var s2 = 0; s2 < sparkle; s2++) {
        tone(chord[s2 % chord.length] * 2, t + s2 * SPB * (phrase2 ? 0.5 : 1) + SPB * 0.5, 0.8, M.arpVol || 0.014, M.arpType || "sine", true);
      }
      if (phrase2) {
        /* Call-and-response: phrase two answers phrase one's
           off-beat ticks with a tick on every beat, plus the
           swell voice breathing a chord tone under the bar.
           Loop 37 adds the canon: the bar's own LEAD line
           repeated one beat later at whisper weight. */
        for (var cq = 0; cq < 8; cq++) {
          var cli = LEAD[(bar % 2) * 16 + cq + 8];
          if (cli !== undefined && cli >= 0 && M.scale[cli] !== undefined) tone(M.scale[cli] * 2, t + cq * SPB * 0.5 + SPB, 0.9, 0.019, "sine", true);
        }
        for (var tk = 0; tk < 4; tk++) tick(t + tk * SPB, 0.045);
        if (bar === 4 || bar === 6) swell(chord[(bar + 2) % chord.length] * 2, t + SPB * 0.5, BAR * 0.9, 0.022);
      } else {
        if (bar >= 1) { tick(t + SPB, 0.05); tick(t + SPB * 3, 0.05); }
        if (bar === 3) { tick(t + SPB * 2, 0.04); tick(t + SPB * 3.5, 0.04); }
      }
      /* One bell toll crowns the end of each phrase. */
      if (bar === 3 || bar === 7) bell(chord[0] * 4, t + SPB * 3, 2.8, 0.018);
    }
    /* — Procession: two bars walking the last chords home,
       bell and swell answering each other across the hall. — */
    for (var pb = 0; pb < 2; pb++) {
      var pt = p0 + (8 + pb) * BAR;
      var pchord = M.chords[2 + pb], proot = M.roots[2 + pb];
      pchord.forEach(function (f) { pad(f, pt, BAR * 1.05); });
      [1, 1.5, 2, 1.5].forEach(function (mult, s) {
        tone(proot * mult, pt + s * SPB, SPB * 0.95, 0.12, "sine", false);
      });
      [0, 2, 4, 5].forEach(function (idx, s) {
        if (M.scale[idx] !== undefined) tone(M.scale[idx] * 2, pt + s * SPB, 1.1, 0.045, "sine", true);
      });
      for (var pk = 0; pk < 4; pk++) tick(pt + pk * SPB, 0.045);
      if (pb === 1) {
        for (var po = 0; po < 4; po++) tick(pt + po * SPB + SPB * 0.5, 0.03);
        thump(proot, pt, 0.11);
      }
      if (pb === 0) { bell(pchord[0] * 4, pt, 2.8, 0.016); swell(pchord[2] * 2, pt + SPB * 2, BAR * 0.45, 0.02); }
      else { swell(pchord[2] * 2, pt, BAR * 0.45, 0.02); bell(pchord[0] * 4, pt + SPB * 2, 2.8, 0.016); }
    }
    /* — Climax: the held tonic, with weight — two thumps, a
       sub-octave where the root can carry one, a two-tone
       swell stack, five bell tolls, the climb up and the
       sparkle raining back down to the top tonic. — */
    M.chords[0].forEach(function (f) { pad(f, tf, BAR * 2.0); });
    thump(M.roots[0], tf, 0.14);
    thump(M.roots[0], tf + SPB * 2, 0.10);
    tone(M.roots[0], tf, BAR * 1.4, 0.13, "sine", false);
    tone(M.roots[0] * 2, tf, BAR * 1.2, 0.07, "sine", false);
    if (M.roots[0] >= 55) tone(M.roots[0] * 0.5, tf, BAR * 1.6, 0.06, "sine", false);
    swell(M.chords[0][1] * 2, tf, BAR * 1.3, 0.024);
    swell(M.chords[0][3] * 2, tf + SPB * 0.5, BAR * 1.1, 0.018);
    for (var b = 0; b < 5; b++) bell(M.chords[0][0] * 4, tf + b * SPB * 1.25, 3.2, 0.02);
    var climb = Math.min(8, M.scale.length);
    for (var c = 0; c < climb; c++) {
      tone(M.scale[c] * 2, tf + c * SPB * 0.25, 1.3, 0.038, "sine", true);
    }
    tone(M.scale[Math.min(4, M.scale.length - 1)] * 2, tf, 1.6, 0.05, "sine", true);
    tone(M.scale[M.scale.length - 1] * 2, tf + climb * SPB * 0.25, 2.2, 0.045, "sine", true);
    var rain = tf + climb * SPB * 0.25 + 0.5;
    for (var d = climb - 1; d >= 0; d--) {
      tone(M.scale[d] * 4, rain + (climb - 1 - d) * SPB * 0.25, 1.0, 0.012, "sine", true);
    }
    /* — Coda: the landing — one soft swell, the theme's
       opening gesture stepping back down at fading weight,
       and a single last bell toll left ringing. — */
    swell(M.chords[0][0] * 2, tc, BAR * 1.1, 0.018);
    [4, 3, 2, 0].forEach(function (idx, s) {
      if (M.scale[idx] !== undefined) tone(M.scale[idx] * 2, tc + s * SPB * 0.75, 1.4, 0.034 - s * 0.005, "sine", true);
    });
    bell(M.chords[0][0] * 4, tc + SPB * 3, 3.4, 0.014);
  }
  window.__grandFanfare = grandFanfare;
  /* Loop 33 — the Bridge: changing moods mid-play used to be a
     hard retune at the next bar line. Now the switch is crossed
     on a short composed bridge — four soft sine notes climbing
     the NEW mood's own scale (root · third · fifth · top) at
     the new tempo, sent through the delay — so the ear walks
     from the old key into the new one instead of being cut
     across. The pads and bass retune at the bar as before; the
     bridge is the handrail over the join. Silent whenever the
     music is off, and it never fires on a re-tap of the mood
     already playing (the picker handler returns early there).
     Loop 39 — the Amen: crossing INTO a quiet mood (one
     carrying quiet: true — Hymn, Vespers) reverses the
     bridge. The four notes descend the new mood's scale
     (top · fifth · third · root), slower and softer, so
     arriving at the winding-down side feels like sitting
     down rather than setting out: an amen cadence, the
     day's last chord resolving home. Leaving a quiet mood
     for a bright one still climbs as before — you stand
     up to go back to work. Monsoon (Loop 40) carries no
     quiet flag on purpose — the rain-front is a working
     mood — so crossing into it climbs like any other.
     Night Drive (Loop 41) climbs too: a drive starts
     standing up, never sitting down. */
  function moodBridge() {
    if (!AC || !master || !on) return;
    var M = MOODS[mood];
    var SPB = 60 / M.bpm;
    var t = AC.currentTime + 0.04;
    if (M.quiet) {
      var down = [7, 4, 2, 0];
      for (var j = 0; j < down.length; j++) {
        var df = M.scale[Math.min(down[j], M.scale.length - 1)];
        if (df !== undefined) tone(df * 2, t + j * SPB * 0.75, 1.6, 0.02, "sine", true);
      }
      return;
    }
    var steps = [0, 2, 4, 7];
    for (var i = 0; i < steps.length; i++) {
      var f = M.scale[Math.min(steps[i], M.scale.length - 1)];
      if (f !== undefined) tone(f * 2, t + i * SPB * 0.5, 1.25, 0.026, "sine", true);
    }
  }
  /* Loop 32 — Echo, the receiving end. A refused letter never
     earns an ugly sound: the pad filter simply ducks for half
     a second, the music leaning in while the learner retries,
     then eases back to wherever the flow says it belongs. */
  function duck() {
    if (!AC || !padFilter) return;
    var M = MOODS[mood];
    padFilter.frequency.cancelScheduledValues(AC.currentTime);
    padFilter.frequency.setTargetAtTime(Math.max(180, flowFilter(M) * 0.45), AC.currentTime, 0.04);
    clearTimeout(duckTimer);
    duckTimer = setTimeout(function () {
      if (!AC || !padFilter) return;
      var M2 = MOODS[mood];
      padFilter.frequency.setTargetAtTime(isMasterpiece() ? M2.filterMp : flowFilter(M2), AC.currentTime, 0.5);
    }, 480);
  }
  /* The answer note: one soft sine from the mood's own scale,
     an octave up and sent through the delay. Consecutive
     perfect reps climb the ladder (third, fourth, fifth…);
     a mastered block lands with a gentle two-note chime. */
  function answerNote(big) {
    if (!AC || !master || !on) return;
    var P = MOODS[mood].scale;
    var idx = Math.min(P.length - 1, 2 + (streak % 5));
    var t = AC.currentTime + 0.03;
    tone(P[idx] * 2, t, 1.3, 0.03, "sine", true);
    if (big && P[idx + 2] !== undefined) tone(P[idx + 2] * 2, t + 0.09, 1.5, 0.024, "sine", true);
  }
  function musicEcho(kind) {
    if (kind === "key") { flow = Math.min(1, flow + 0.03); return; }
    if (kind === "slip") {
      flow = Math.max(0, flow - 0.13); streak = 0;
      if (on) duck();
      return;
    }
    if (kind === "rep") { flow = Math.min(1, flow + 0.16); answerNote(false); streak++; return; }
    if (kind === "master") { flow = 1; answerNote(true); streak++; }
  }
  window.__musicEcho = musicEcho;
  /* Typing FX asks before it plays a rep chord: while the music
     is on, the engine answers reps itself and key clicks go softer. */
  window.__musicIsOn = function () { return on; };
  btn.addEventListener("click", function () {
    on = !on;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", String(on));
    btnText.textContent = on ? "Music on" : "Music off";
    if (on) start(); else stop();
  });
  /* Let the Library's picture music hush this engine when it starts,
     so the two never play over each other. */
  window.__stopMainMusic = function () {
    if (!on) return;
    on = false;
    btn.classList.remove("on");
    btn.setAttribute("aria-pressed", "false");
    btnText.textContent = "Music off";
    stop();
  };
  /* Mood picker — switching moods retunes the engine from the next
     bar onward; the choice is remembered on this device. */
  var moodBtns = document.querySelectorAll(".mood-btn");
  function paintMoods() {
    Array.prototype.forEach.call(moodBtns, function (b) {
      var sel = b.getAttribute("data-mood") === mood;
      b.classList.toggle("active", sel);
      b.setAttribute("aria-pressed", String(sel));
    });
  }
  Array.prototype.forEach.call(moodBtns, function (b) {
    b.addEventListener("click", function () {
      var next = b.getAttribute("data-mood");
      if (!next || !MOODS[next] || next === mood) { paintMoods(); return; }
      mood = next;
      try { localStorage.setItem("code-block-music-mood-v1", mood); } catch (e) {}
      if (delayNode && AC) delayNode.delayTime.setTargetAtTime((60 / MOODS[mood].bpm) * 0.75, AC.currentTime, 0.2);
      /* Loop 33: cross into the new mood on its bridge phrase. */
      moodBridge();
      paintMoods();
      /* Loop 24 — every real mood switch announces itself
         through the app's polite live region, so the change
         is heard as well as seen. Loop 50 — speak through the
         app's one voice (cbAnnounce): writing the region
         directly raced its clear-then-write timer and could
         be wiped mid-sentence; the raw write stays only as a
         fallback for a click landing before it exists. */
      if (window.cbAnnounce) window.cbAnnounce("Music mood: " + b.textContent.trim());
      else { var sr = document.getElementById("srStatus"); if (sr) sr.textContent = "Music mood: " + b.textContent.trim(); }
    });
  });
  paintMoods();
})();
