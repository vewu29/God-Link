#!/usr/bin/env node
// Builds css/themes.css from the palettes below.
//
// Each theme names its mode (light or dark) and a handful of colours; the
// rest of the token set — the eleven-step ramp, glows, shadows, wells,
// tints — is mixed from them, the same way the default Sky palette is
// built in css/app.css. Every theme is checked for contrast before the
// file is written (WCAG 2.1 ratios): page text and accent text on each
// surface, button text on every stop of the button gradient, the
// console's text on the console, and white text on the fixed-colour
// furniture. A theme that fails stops the build.
//
// The same token blocks also colour the theme picker's preview cards
// ([data-theme-preview]), so a preview can never drift from its theme.
// Usage: node tools/build-themes.js
"use strict";
const fs = require("fs");
const path = require("path");

/* The default Sky palette, light and dark — used only to colour the
   picker's previews of "Daylight" and "Night Sky" (on the page itself
   those two are css/app.css's own tokens in a fixed mode). */
const SKY_LIGHT = {
  mode: "light", bg: "#dbeafe", surface: "#ffffff", surface2: "#dbeafe", ink: "#071f3d", muted: "#2f4d75", line: "#a8c6ee",
  accent: "#1d4ed8", accentBright: "#2f7fe0", accentDeep: "#1e3a8a", sky: "#38bdf8", ice: "#eaf4ff", onAccent: "#ffffff",
  good: "#0369a1", goodSoft: "#d6eafd", bad: "#b3382e", worldBg: "#081f3a",
  bAccent: "#1d4ed8", bAccentDeep: "#1e3a8a", bAccentMid: "#1f6ccf", bAccentStrong: "#1a63c2", bGood: "#0369a1", bSelect: "#1e40af",
  conTop: "#0d3060", conMid: "#0a2547", conDeep: "#081a30", conHi: "#14406f", conBorder: "#2b5285",
  conInk: "#eaf4ff", conInk2: "#cfe6ff", conMuted: "#a9c8ee", conDim: "#7d9dbd", conGlow: "#8fd0ff"
};
const SKY_DARK = Object.assign({}, SKY_LIGHT, {
  mode: "dark", bg: "#050f1f", surface: "#0d2242", surface2: "#16335c", ink: "#f0f7ff", muted: "#b9d4f5", line: "#2b5285",
  accent: "#4da3ff", accentBright: "#7cc4ff", accentDeep: "#1e40af", ice: "#0d2242", onAccent: "#041e3a",
  good: "#7cc4ff", goodSoft: "#0e2f52", bad: "#ff9a8a", worldBg: "#050f1f"
});

const THEMES = {
  forest: {
    mode: "light", bg: "#dcfce7", surface: "#ffffff", surface2: "#dcfce7", ink: "#052e16", muted: "#3b5b46", line: "#a7d8b8",
    accent: "#166534", accentBright: "#16a34a", accentDeep: "#14532d", sky: "#4ade80", ice: "#f0fdf4", onAccent: "#ffffff",
    good: "#15803d", goodSoft: "#dcfce7", bad: "#b91c1c", worldBg: "#052e16",
    bAccent: "#166534", bAccentDeep: "#14532d", bAccentMid: "#15803d", bAccentStrong: "#166534", bGood: "#0f766e", bSelect: "#166534",
    conTop: "#0f3d24", conMid: "#0b2e1b", conDeep: "#072414", conHi: "#155e36", conBorder: "#2f6b47",
    conInk: "#ecfdf3", conInk2: "#d1fae5", conMuted: "#a7d8b8", conDim: "#86b89a", conGlow: "#86efac"
  },
  ocean: {
    mode: "dark", bg: "#021a20", surface: "#06303a", surface2: "#0b4250", ink: "#e6fbff", muted: "#a5d8e3", line: "#1f6475",
    accent: "#22d3ee", accentBright: "#67e8f9", accentDeep: "#0e7490", sky: "#22d3ee", ice: "#06303a", onAccent: "#042f38",
    good: "#5eead4", goodSoft: "#0b4250", bad: "#fca5a5", worldBg: "#01141a",
    bAccent: "#0e7490", bAccentDeep: "#155e75", bAccentMid: "#0e7490", bAccentStrong: "#0e6680", bGood: "#0f766e", bSelect: "#155e75",
    conTop: "#0a3a47", conMid: "#072e38", conDeep: "#04212a", conHi: "#0f4c5c", conBorder: "#1f6475",
    conInk: "#e6fbff", conInk2: "#c5f3fb", conMuted: "#9fd4df", conDim: "#7bb5c2", conGlow: "#67e8f9"
  },
  sunset: {
    mode: "light", bg: "#ffedd5", surface: "#fffaf5", surface2: "#ffedd5", ink: "#431407", muted: "#7c2d12", line: "#f5c6a5",
    accent: "#b53b0b", accentBright: "#ea580c", accentDeep: "#9a3412", sky: "#fb923c", ice: "#fff7ed", onAccent: "#ffffff",
    good: "#be185d", goodSoft: "#ffedd5", bad: "#b91c1c", worldBg: "#2a0e1a",
    bAccent: "#b53b0b", bAccentDeep: "#9a3412", bAccentMid: "#b53b0b", bAccentStrong: "#a8370a", bGood: "#be185d", bSelect: "#9a3412",
    conTop: "#4a1d2e", conMid: "#3b1424", conDeep: "#2a0e1a", conHi: "#5c2639", conBorder: "#7a3b52",
    conInk: "#fff1ec", conInk2: "#ffd9cc", conMuted: "#f0b8a8", conDim: "#d1958f", conGlow: "#fdba74"
  },
  candy: {
    mode: "light", bg: "#fce7f3", surface: "#ffffff", surface2: "#fce7f3", ink: "#3b0a2a", muted: "#6b2a55", line: "#f5b8da",
    accent: "#be185d", accentBright: "#db2777", accentDeep: "#9d174d", sky: "#f472b6", ice: "#fdf2f8", onAccent: "#ffffff",
    good: "#7e22ce", goodSoft: "#f3e8ff", bad: "#b91c1c", worldBg: "#200a33",
    bAccent: "#be185d", bAccentDeep: "#9d174d", bAccentMid: "#be185d", bAccentStrong: "#a3154f", bGood: "#7e22ce", bSelect: "#9d174d",
    conTop: "#3d1458", conMid: "#2e0f45", conDeep: "#200a33", conHi: "#4f1d70", conBorder: "#6d3a91",
    conInk: "#fdf4ff", conInk2: "#f5d0fe", conMuted: "#d8b4fe", conDim: "#b892dd", conGlow: "#f9a8d4"
  },
  galaxy: {
    mode: "dark", bg: "#0b0820", surface: "#161236", surface2: "#221c4d", ink: "#f3f0ff", muted: "#c4b5fd", line: "#3b3270",
    accent: "#a78bfa", accentBright: "#c4b5fd", accentDeep: "#6d28d9", sky: "#a585ff", ice: "#161236", onAccent: "#1a1033",
    good: "#f0abfc", goodSoft: "#2a1f5c", bad: "#fda4af", worldBg: "#07051a",
    bAccent: "#6d28d9", bAccentDeep: "#4c1d95", bAccentMid: "#6d28d9", bAccentStrong: "#5b21b6", bGood: "#a21caf", bSelect: "#5b21b6",
    conTop: "#1f1747", conMid: "#181238", conDeep: "#100c27", conHi: "#2b2160", conBorder: "#4b3d8f",
    conInk: "#f3f0ff", conInk2: "#ddd6fe", conMuted: "#b7a8f0", conDim: "#9a8bd6", conGlow: "#c4b5fd"
  },
  terminal: {
    mode: "dark", bg: "#050a05", surface: "#0b140b", surface2: "#122012", ink: "#d8ffd8", muted: "#8fd18f", line: "#1f3a1f",
    accent: "#4ade80", accentBright: "#86efac", accentDeep: "#15803d", sky: "#22c55e", ice: "#0b140b", onAccent: "#031a09",
    good: "#a3e635", goodSoft: "#142614", bad: "#fca5a5", worldBg: "#020602",
    bAccent: "#15803d", bAccentDeep: "#14532d", bAccentMid: "#15803d", bAccentStrong: "#166534", bGood: "#4d7c0f", bSelect: "#166534",
    conTop: "#0a1a0a", conMid: "#071307", conDeep: "#040c04", conHi: "#0f260f", conBorder: "#1f4d1f",
    conInk: "#d8ffd8", conInk2: "#b8f5b8", conMuted: "#8fd18f", conDim: "#74b874", conGlow: "#86efac"
  },
  paper: {
    mode: "light", bg: "#f4ecd8", surface: "#fbf6ea", surface2: "#efe4cc", ink: "#2b2116", muted: "#5e4b35", line: "#d8c7a4",
    accent: "#8a4b12", accentBright: "#b45f19", accentDeep: "#6b3a0e", sky: "#d49a5c", ice: "#fbf6ea", onAccent: "#ffffff",
    good: "#3f6212", goodSoft: "#ece5c9", bad: "#9b2c2c", worldBg: "#241d14",
    bAccent: "#8a4b12", bAccentDeep: "#6b3a0e", bAccentMid: "#8a4b12", bAccentStrong: "#7a420f", bGood: "#3f6212", bSelect: "#6b3a0e",
    conTop: "#3a2f22", conMid: "#2f261b", conDeep: "#241d14", conHi: "#4a3c2b", conBorder: "#6b5a42",
    conInk: "#fbf6ea", conInk2: "#efe4cc", conMuted: "#d6c3a0", conDim: "#b8a27f", conGlow: "#f2c48d"
  },
  contrast: {
    mode: "dark", bg: "#000000", surface: "#0a0a0a", surface2: "#1a1a1a", ink: "#ffffff", muted: "#e6e6e6", line: "#b3b3b3",
    accent: "#ffd60a", accentBright: "#ffe55c", accentDeep: "#b38f00", sky: "#ffd60a", ice: "#0a0a0a", onAccent: "#000000",
    good: "#7dff9b", goodSoft: "#142b14", bad: "#ff8a8a", worldBg: "#000000",
    bAccent: "#1a1a1a", bAccentDeep: "#000000", bAccentMid: "#1a1a1a", bAccentStrong: "#000000", bGood: "#0a2e14", bSelect: "#5c4d00",
    conTop: "#000000", conMid: "#000000", conDeep: "#000000", conHi: "#1a1a1a", conBorder: "#ffffff",
    conInk: "#ffffff", conInk2: "#ffffff", conMuted: "#e6e6e6", conDim: "#cccccc", conGlow: "#ffd60a"
  }
};

/* ---------- colour arithmetic ---------- */
function rgb(hex) { const h = hex.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function hex(c) { return "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""); }
function mix(a, b, t) { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); }
function trip(h) { return rgb(h).join(", "); }
function lum(h) { return rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); }
function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

/* ---------- the contrast promises every theme keeps ---------- */
function check(name, t) {
  const fails = [];
  const need = (fg, bg, min, what) => { const r = ratio(t[fg] || fg, t[bg] || bg); if (r < min) fails.push(`${what}: ${fg} on ${bg} is ${r.toFixed(2)}, needs ${min}`); };
  ["bg", "surface", "surface2"].forEach((s) => { need("ink", s, 7, "page text"); need("muted", s, 4.5, "quiet text"); need("accent", s, 4.5, "accent text"); });
  need("good", "surface", 4.5, "good news text");
  need("bad", "surface", 4.5, "error text");
  need("accent", "goodSoft", 4.5, "accent label on its soft chip");
  need("onAccent", "accent", 4.5, "button text");
  // The button gradient: light mode runs strong → mid → accent, dark mode sky → bright → accent.
  (t.mode === "light" ? ["bAccentStrong", "bAccentMid", "accent"] : ["sky", "accentBright", "accent"]).forEach((s) => need("onAccent", s, 4.5, "button text on the gradient"));
  ["conTop", "conMid", "conDeep"].forEach((s) => ["conInk", "conInk2", "conMuted", "conDim", "conGlow"].forEach((f) => need(f, s, 4.5, "console text")));
  ["bAccent", "bAccentDeep", "bGood"].forEach((s) => need("#ffffff", s, 4.5, "white text on fixed furniture"));
  need("conInk", "bSelect", 4.5, "selected text");
  // The console's own gradient starts at ramp step 800.
  const top = rampOf(t)[8];
  ["conInk", "conMuted", "conGlow"].forEach((f) => need(f, top, 4.5, "console text on the console gradient"));
  if (fails.length) throw new Error(`theme "${name}" fails contrast:\n  ` + fails.join("\n  "));
}

/* The eleven-step ramp, --blue-50 to --blue-950. Step 800 tops the
   console's gradient (it fades to 950), so in a light theme it is the
   accent's deep shade sunk toward the console, dark enough for the
   console's pale text. */
function rampOf(t) {
  return t.mode === "dark"
    ? [t.ink, mix(t.ink, t.accent, 0.1), t.muted, t.accentBright, t.accent, t.sky, mix(t.accent, t.accentDeep, 0.4), t.accentDeep, t.surface2, t.surface, t.bg]
    : [t.ice, t.bg, mix(t.bg, t.accent, 0.18), t.line, mix(t.sky, "#ffffff", 0.3), t.sky, t.accentBright, t.accent, mix(t.accentDeep, t.conDeep, 0.35), t.accentDeep, t.worldBg];
}

/* ---------- one theme's full token block ---------- */
function tokens(t) {
  const dark = t.mode === "dark";
  const ramp = rampOf(t);
  const shade = mix(t.conDeep, "#000000", 0.3), shade2 = t.conTop;
  const brand = mix(t.accent, t.accentBright, 0.5);
  const out = {
    "--bg": t.bg, "--surface": t.surface, "--surface-2": t.surface2, "--ink": t.ink, "--muted": t.muted, "--line": t.line,
    "--accent": t.accent, "--accent-bright": t.accentBright, "--accent-deep": t.accentDeep, "--sky": t.sky, "--ice": t.ice,
    "--on-accent": t.onAccent, "--good": t.good, "--good-soft": t.goodSoft, "--bad": t.bad, "--world-bg": t.worldBg,
    "--accent-glow": "var(--sky)",
    "--glow-soft": `rgba(${trip(t.sky)}, ${dark ? 0.22 : 0.18})`,
    "--glow-med": `rgba(${trip(t.sky)}, ${dark ? 0.38 : 0.32})`,
    "--glow-strong": `rgba(${trip(t.sky)}, ${dark ? 0.55 : 0.5})`,
    "--shadow": dark ? "0 16px 38px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.35)" : `0 14px 34px rgba(${trip(shade2)}, 0.16), 0 3px 10px rgba(${trip(shade2)}, 0.08)`,
    "--shadow-sm": dark ? "0 6px 18px rgba(0, 0, 0, 0.42), 0 2px 6px rgba(0, 0, 0, 0.3)" : `0 5px 16px rgba(${trip(shade2)}, 0.12), 0 1px 4px rgba(${trip(shade2)}, 0.06)`,
    "--edge-light": dark ? `inset 0 1px 0 rgba(${trip(t.conGlow)}, 0.16)` : "inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    "--edge-light-soft": dark ? `inset 0 1px 0 rgba(${trip(t.conGlow)}, 0.09)` : "inset 0 1px 0 rgba(255, 255, 255, 0.28)",
    "--well-shadow": dark ? `inset 0 2px 6px rgba(0, 0, 0, 0.42), inset 0 -1px 0 rgba(${trip(t.conGlow)}, 0.12)` : `inset 0 2px 6px rgba(${trip(shade2)}, 0.16), inset 0 -1px 0 rgba(255, 255, 255, 0.35)`,
    "--reader-bar": `rgba(${trip(t.surface)}, 0.94)`,
    "--reader-paper": dark ? `rgba(${trip(t.surface2)}, 0.45)` : `rgba(${trip(t.surface)}, 0.62)`,
    "--sky-rgb": trip(t.sky), "--brand-rgb": trip(brand), "--tint-rgb": trip(t.conGlow),
    "--shade-rgb": trip(shade), "--shade-2-rgb": trip(shade2), "--con-border-rgb": trip(t.conBorder),
    "--b-accent": t.bAccent, "--b-accent-deep": t.bAccentDeep, "--b-accent-mid": t.bAccentMid,
    "--b-accent-strong": t.bAccentStrong, "--b-good": t.bGood, "--b-select": t.bSelect,
    "--con-top": t.conTop, "--con-mid": t.conMid, "--con-deep": t.conDeep, "--con-hi": t.conHi, "--con-border": t.conBorder,
    "--con-ink": t.conInk, "--con-ink-2": t.conInk2, "--con-muted": t.conMuted, "--con-dim": t.conDim, "--con-glow": t.conGlow
  };
  ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"].forEach((k, i) => { out["--blue-" + k] = ramp[i]; });
  return out;
}
function block(selector, t) {
  const tk = tokens(t);
  return selector + " {\n" + Object.keys(tk).map((k) => `  ${k}: ${tk[k]};`).join("\n") + "\n}\n";
}

let css = `/* Code Block themes — generated by tools/build-themes.js; edit the palettes
   there and rebuild. Each block sets a theme's whole token set. On the page
   the theme is chosen by <html data-theme> (the mode by data-mode, set by
   the theme script in index.html's head); the picker's preview cards wear
   the same blocks through [data-theme-preview]. Screen only: printing keeps
   the light paper palette from css/app.css. */
@media screen {
`;
for (const [name, t] of Object.entries(THEMES)) {
  check(name, t);
  css += block(`:root[data-theme="${name}"], [data-theme-preview="${name}"]`, t).replace(/^/gm, "  ").replace(/^  $/gm, "") + "\n";
}
check("daylight", SKY_LIGHT);
check("night", SKY_DARK);
css += block('[data-theme-preview="daylight"]', SKY_LIGHT).replace(/^/gm, "  ").replace(/^  $/gm, "") + "\n";
css += block('[data-theme-preview="night"]', SKY_DARK).replace(/^/gm, "  ").replace(/^  $/gm, "");
css += "}\n";
fs.writeFileSync(path.join(__dirname, "..", "css", "themes.css"), css);
console.log("wrote css/themes.css —", Object.keys(THEMES).length, "themes, all contrast checks passed");
