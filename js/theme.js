"use strict";
/* ================= Themes =================
   A palette button beside the track switcher opens a sheet of colour
   themes. Picking one recolours the whole app at once — no reload — and
   is remembered on this device. The default, Sky, follows the device's
   light or dark setting (and keeps following it if that changes while
   the page is open); the others choose their own mode.

   The theme's tokens live in css/themes.css (generated, contrast-checked
   by tools/build-themes.js); the first paint is set by the small script
   in index.html's head, which this file must agree with (THEMES below
   and its MODES map name the same themes). */
(function cbThemes() {
  var KEY = "code-block-theme-v1";
  var THEMES = [
    { id: "auto", name: "Sky", note: "Blue skies — follows your device's light or dark setting", mode: null },
    { id: "daylight", name: "Daylight", note: "Sky, always light", mode: "light" },
    { id: "night", name: "Night Sky", note: "Sky, always dark", mode: "dark" },
    { id: "forest", name: "Forest", note: "Calm greens on a light page", mode: "light" },
    { id: "ocean", name: "Ocean", note: "Deep teal, glowing cyan", mode: "dark" },
    { id: "sunset", name: "Sunset", note: "Warm oranges, plum console", mode: "light" },
    { id: "candy", name: "Candy", note: "Pinks and purples", mode: "light" },
    { id: "galaxy", name: "Galaxy", note: "Violet nebula, dark", mode: "dark" },
    { id: "terminal", name: "Terminal", note: "Green on black, like an old monitor", mode: "dark" },
    { id: "paper", name: "Paper", note: "Soft sepia, easy on the eyes", mode: "light" },
    { id: "contrast", name: "High Contrast", note: "Black, white and yellow — the boldest edges", mode: "dark" }
  ];
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function $(id) { return document.getElementById(id); }
  function find(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i]; return null; }
  function current() { return find(root.getAttribute("data-theme")) || THEMES[0]; }
  function deviceMode() { return mq && mq.matches ? "dark" : "light"; }
  function modeOf(t) { return t.mode || deviceMode(); }

  /* The browser's own toolbar colour follows the page. */
  function paintMeta() {
    var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (!bg) return;
    Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m) {
      m.removeAttribute("media");
      m.setAttribute("content", bg);
    });
  }
  function apply(id, save) {
    var t = find(id) || THEMES[0];
    root.setAttribute("data-theme", t.id);
    root.setAttribute("data-mode", modeOf(t));
    if (save) { try { localStorage.setItem(KEY, t.id); } catch (e) {} }
    paintMeta();
    paintButton();
    paintSheet();
    try { document.dispatchEvent(new CustomEvent("cb:theme", { detail: { theme: t.id, mode: modeOf(t) } })); } catch (e) {}
  }
  if (mq) {
    var follow = function () { if (current().id === "auto") apply("auto", false); };
    if (mq.addEventListener) mq.addEventListener("change", follow);
    else if (mq.addListener) mq.addListener(follow);
  }

  /* ---------- The palette button ---------- */
  var ICON = function (id) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  /* It sits on the music dock's row, at the left: theme and music are
     the two ambience settings, and the row has room to spare. */
  var dock = document.getElementById("bubbleDock");
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-btn";
  btn.id = "themeBtn";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-controls", "themeSheet");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = ICON("i-palette") + '<span>Theme</span><span class="theme-btn-name" id="themeBtnName"></span>';
  if (dock) { dock.classList.add("has-theme"); dock.insertBefore(btn, dock.firstChild); }
  else { var wrap = document.querySelector(".wrap"); if (wrap) wrap.insertBefore(btn, wrap.firstChild); }
  function paintButton() {
    var t = current();
    var name = $("themeBtnName");
    if (name) name.textContent = t.name;
    btn.setAttribute("aria-label", "Theme: " + t.name + ". Change the colours");
  }

  /* ---------- The sheet ---------- */
  var sheet = document.createElement("div");
  sheet.className = "track-sheet theme-sheet hidden";
  sheet.id = "themeSheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-labelledby", "themeSheetTitle");
  var tiles = THEMES.map(function (t) {
    return '<button type="button" class="theme-tile" data-theme-id="' + t.id + '" aria-pressed="false">' +
      '<span class="theme-prev" data-theme-preview="' + (t.id === "auto" ? "daylight" : t.id) + '" aria-hidden="true">' +
        '<span class="tp-card"><i class="tp-line"></i><i class="tp-line tp-short"></i><i class="tp-btn"></i></span>' +
        '<span class="tp-con"><i></i><i></i><i></i></span>' +
      "</span>" +
      '<span class="theme-tile-text"><span class="theme-tile-name">' + t.name + '</span><span class="theme-tile-note">' + t.note + "</span></span>" +
      '<span class="theme-tile-check">' + ICON("i-check") + "</span></button>";
  }).join("");
  sheet.innerHTML = '<div class="track-sheet-card">' +
    '<div class="track-sheet-head"><h2 id="themeSheetTitle">Choose your colours</h2>' +
    '<button type="button" class="track-close" id="themeClose" aria-label="Close the themes">' + ICON("i-x") + "</button></div>" +
    '<p class="track-sheet-sub">Every theme is checked for easy reading. Your pick is saved on this device and changes everything at once — the typing console too.</p>' +
    '<div class="theme-grid">' + tiles + "</div></div>";
  document.body.appendChild(sheet);
  function paintSheet() {
    var t = current();
    Array.prototype.forEach.call(sheet.querySelectorAll(".theme-tile"), function (b) {
      var on = b.getAttribute("data-theme-id") === t.id;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    /* Sky's preview shows whichever sky the device is under right now. */
    var auto = sheet.querySelector('[data-theme-id="auto"] .theme-prev');
    if (auto) auto.setAttribute("data-theme-preview", deviceMode() === "dark" ? "night" : "daylight");
  }
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    paintSheet();
    sheet.classList.remove("hidden");
    root.classList.add("track-sheet-open");
    btn.setAttribute("aria-expanded", "true");
    var here = sheet.querySelector(".theme-tile.on") || sheet.querySelector(".theme-tile");
    setTimeout(function () { try { here.focus({ preventScroll: false }); } catch (e) { here.focus(); } }, 30);
  }
  function close() {
    sheet.classList.add("hidden");
    root.classList.remove("track-sheet-open");
    btn.setAttribute("aria-expanded", "false");
    try { (lastFocus || btn).focus({ preventScroll: true }); } catch (e) { btn.focus(); }
  }
  btn.addEventListener("click", open);
  $("themeClose").addEventListener("click", close);
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) { close(); return; }
    var tile = e.target.closest ? e.target.closest("[data-theme-id]") : null;
    if (!tile) return;
    var id = tile.getAttribute("data-theme-id");
    apply(id, true);
    if (window.cbAnnounce) window.cbAnnounce("Theme: " + current().name);
  });
  /* Like the track sheet: Escape closes it, Tab stays inside it. */
  sheet.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = Array.prototype.filter.call(sheet.querySelectorAll("button"), function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  window.CBTheme = { list: function () { return THEMES.slice(); }, current: function () { return current().id; }, set: function (id) { apply(id, true); } };
  apply(current().id, false);
})();
