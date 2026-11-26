/* English++ Web Studio v4 — core layer: phone toolbar "More" menu, Project sheet (all files,
   imports between them, search across every file, export/import a project as a .zip). */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var S = null; // the Studio's hooks (set by init)

  /* ---------- toolbar: everything reachable without a sideways scroll ----------
     When the row of tools is wider than the screen, the least-used buttons move (as themselves, so
     their ids and handlers stay) into a "More" menu, from the end of the row backwards, until the row fits. */
  var KEEP = ["esRun", "esStop"]; // never move
  var ORDER = null, nav = null, pop = null, more = null, mo = null, fitting = false, refitLater = false, fitN = 0, navMo = null;
  function watch() { if (!mo) return; ORDER.forEach(function (id) { var b = $(id); if (b) mo.observe(b, { attributes: true, attributeFilter: ["class", "hidden"], childList: true, characterData: true, subtree: true }); }); }
  function setupToolbar() {
    if (nav) return; nav = document.querySelector(".es-tools"); if (!nav) return;
    more = document.createElement("button"); more.type = "button"; more.className = "es-btn es-more"; more.id = "esMore";
    more.setAttribute("aria-haspopup", "true"); more.setAttribute("aria-expanded", "false"); more.title = "More tools";
    more.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>More';
    pop = document.createElement("div"); pop.className = "es-more-pop"; pop.id = "esMorePop"; pop.setAttribute("role", "menu"); pop.setAttribute("aria-label", "More tools");
    nav.appendChild(more); document.querySelector(".es-head").appendChild(pop);
    ORDER = Array.prototype.filter.call(nav.children, function (b) { return b !== more && b.id; }).map(function (b) { return b.id; });
    more.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!pop.classList.contains("open")); });
    pop.addEventListener("click", function (e) { if (e.target.closest("button")) setTimeout(function () { setOpen(false); }, 0); });
    document.addEventListener("pointerdown", function (e) { if (pop.classList.contains("open") && !pop.contains(e.target) && e.target !== more && !more.contains(e.target)) setOpen(false); }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && pop.classList.contains("open")) { setOpen(false); more.focus(); } });
    var t = null; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(fit, 80); });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(fit, 80); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    // buttons that show/hide or change their label (C++ mode, Full build busy…) re-fit the row
    if (window.MutationObserver) {
      mo = new MutationObserver(function () { if (fitting) return; clearTimeout(t); t = setTimeout(fit, 30); });
      watch();
      navMo = new MutationObserver(function () { if (fitting) return; clearTimeout(t); t = setTimeout(fit, 30); }); navMo.observe(nav, { childList: true });
    }
    fit();
  }
  function setOpen(on) {
    pop.classList.toggle("open", !!on); more.setAttribute("aria-expanded", on ? "true" : "false");
    if (!on && refitLater) { refitLater = false; setTimeout(fit, 0); }
    if (on) {
      var r = more.getBoundingClientRect(), hr = document.querySelector(".es-head").getBoundingClientRect();
      pop.style.top = (r.bottom - hr.top + 6) + "px";
      var first = pop.querySelector("button:not(:disabled)"); if (first && !matchMedia("(pointer: coarse)").matches) first.focus();
    }
  }
  function fits() { return nav.scrollWidth <= nav.clientWidth + 1; }
  function fit() {
    if (!nav || nav.offsetParent === null) return; // hidden (keyboard up): try again on the next resize
    if (pop.classList.contains("open")) { refitLater = true; return; } // never pull the menu away under a finger
    fitN++; fitting = true; try { fit1(); } finally { if (mo) mo.takeRecords(); if (navMo) navMo.takeRecords(); fitting = false; }
  }
  // buttons other layers add later (Debug…) join the order at their place in the row
  function adopt() {
    var prev = null, added = false;
    Array.prototype.forEach.call(nav.children, function (b) {
      if (b === more || !b.id) return;
      if (ORDER.indexOf(b.id) < 0) { ORDER.splice(prev ? ORDER.indexOf(prev) + 1 : 0, 0, b.id); added = true; }
      prev = b.id;
    });
    if (added) watch();
  }
  function fit1() {
    adopt();
    // everything back in the row, in its first order
    ORDER.forEach(function (id) { var b = $(id); if (b) nav.insertBefore(b, more); });
    nav.classList.remove("es-compact"); more.hidden = true;
    if (fits()) return;
    more.hidden = false; nav.classList.add("es-compact");
    var movable = ORDER.filter(function (id) { return KEEP.indexOf(id) < 0; });
    for (var i = movable.length - 1; i >= 0 && !fits(); i--) {
      var b = $(movable[i]); if (!b) continue;
      pop.insertBefore(b, pop.firstChild);
    }
  }

  /* ---------- Project sheet ---------- */
  function sheetHTML() {
    return '<div class="es-sheet hidden" id="esPrjSheet" role="dialog" aria-modal="true" aria-labelledby="esPrjTitle"><div class="es-sheet-card es-prj-card">' +
      '<div class="es-sheet-head"><h2 id="esPrjTitle">Project <small id="esPrjCount"></small></h2><button type="button" class="es-icon es-sheet-x" id="esPrjClose" aria-label="Close">×</button></div>' +
      '<div class="es-prj-acts"><button type="button" class="es-btn es-sm" id="esPrjExport">Export .zip</button><button type="button" class="es-btn es-sm" id="esPrjImport">Import .zip</button><input type="file" id="esPrjFile" accept=".zip,application/zip" hidden></div>' +
      '<input type="search" id="esPrjSearch" class="es-input" placeholder="Search every file…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Search every file">' +
      '<div class="es-prj-list" id="esPrjList"></div></div></div>';
  }
  function files() { try { return S.files(); } catch (e) { return []; } }
  function imports(text) { var out = []; text.replace(/^\s*\S+\s+xim\s+"([^"]+)"/gm, function (_, n) { out.push(n); }); return out; }
  function renderFiles() {
    var fl = files(), h = "";
    $("esPrjCount").textContent = fl.length + (fl.length === 1 ? " file" : " files") + " · " + fl.reduce(function (a, f) { return a + f.text.split("\n").length; }, 0) + " lines";
    var usedBy = {};
    fl.forEach(function (f) { imports(f.text).forEach(function (n) { (usedBy[n] = usedBy[n] || []).push(f.name); }); });
    fl.forEach(function (f, i) {
      var im = imports(f.text), lines = f.text.split("\n").length;
      var missing = im.filter(function (n) { return !fl.some(function (g) { return g.name === n; }); });
      h += '<button type="button" class="es-prj-file" data-i="' + i + '"><b>' + esc(f.name) + (i === 0 ? ' <em>runs first</em>' : "") + "</b><span>" + lines + (lines === 1 ? " line" : " lines") +
        (im.length ? " · brings in " + esc(im.join(", ")) : "") + (usedBy[f.name] ? " · used by " + esc(usedBy[f.name].join(", ")) : "") + "</span>" +
        (missing.length ? '<span class="es-prj-miss">' + esc(missing.join(", ")) + " " + (missing.length === 1 ? "is" : "are") + " not in this project</span>" : "") + "</button>";
    });
    $("esPrjList").innerHTML = h;
  }
  function renderSearch(q) {
    var fl = files(), h = "", n = 0, ql = q.toLowerCase();
    fl.forEach(function (f, i) {
      var hits = [];
      f.text.split("\n").forEach(function (ln, k) { if (ln.toLowerCase().indexOf(ql) >= 0) hits.push([k + 1, ln]); });
      if (!hits.length) return;
      n += hits.length;
      h += '<div class="es-prj-group"><b>' + esc(f.name) + "</b> <span class=\"es-dim\">" + hits.length + "</span></div>";
      hits.slice(0, 60).forEach(function (x) {
        var t = x[1], j = t.toLowerCase().indexOf(ql);
        var shown = esc(t.slice(0, j)) + "<mark>" + esc(t.slice(j, j + q.length)) + "</mark>" + esc(t.slice(j + q.length));
        h += '<button type="button" class="es-prj-hit" data-i="' + i + '" data-line="' + x[0] + '"><span class="es-prj-ln">' + x[0] + "</span><code>" + shown + "</code></button>";
      });
      if (hits.length > 60) h += '<p class="es-dim">… and ' + (hits.length - 60) + " more in " + esc(f.name) + "</p>";
    });
    $("esPrjList").innerHTML = n ? h : '<p class="es-dim">No line has “' + esc(q) + "”.</p>";
    $("esPrjCount").textContent = n + (n === 1 ? " match" : " matches");
  }
  function openProject() {
    $("esPrjSearch").value = ""; renderFiles(); S.sheetOpen("esPrjSheet");
  }
  function openAt(i, line) {
    S.sheetClose("esPrjSheet");
    S.openTab(i);
    if (line) setTimeout(function () { try { S.editor.goToLine(line); } catch (e) {} }, 30);
  }

  /* ---------- .zip (stored files; reading also handles deflate) ---------- */
  var CRC = null;
  function crc32(u8) {
    if (!CRC) { CRC = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; } }
    var x = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) x = CRC[(x ^ u8[i]) & 255] ^ (x >>> 8); return (x ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(entries) { // [{name, text}] -> Blob
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    var d = new Date(), dt = ((d.getFullYear() - 1980) << 9 | (d.getMonth() + 1) << 5 | d.getDate()), tm = (d.getHours() << 11 | d.getMinutes() << 5 | (d.getSeconds() >> 1));
    entries.forEach(function (e) {
      var name = enc.encode(e.name), data = enc.encode(e.text), crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, tm, true); h.setUint16(12, dt, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, tm, true); c.setUint16(14, dt, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), name);
      off += 30 + name.length + data.length;
    });
    var csize = central.reduce(function (a, p) { return a + p.length; }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true); end.setUint32(12, csize, true); end.setUint32(16, off, true);
    return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]), { type: "application/zip" });
  }
  async function unzip(buf) { // ArrayBuffer -> [{name, text}]
    var u8 = new Uint8Array(buf), dv = new DataView(buf), e = -1;
    for (var i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
    if (e < 0) throw new Error("this is not a .zip file");
    var n = dv.getUint16(e + 10, true), p = dv.getUint32(e + 16, true), out = [], dec = new TextDecoder("utf-8", { fatal: false });
    for (var k = 0; k < n; k++) {
      if (dv.getUint32(p, true) !== 0x02014b50) throw new Error("the .zip's file list is damaged");
      var method = dv.getUint16(p + 10, true), csz = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
      var name = dec.decode(u8.subarray(p + 46, p + 46 + nl)); p += 46 + nl + xl + cl;
      if (/\/$/.test(name)) continue;
      var ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true), raw = u8.subarray(ds, ds + csz), data;
      if (method === 0) data = raw;
      else if (method === 8) {
        if (typeof DecompressionStream === "undefined") throw new Error("this browser can't unpack compressed .zip files; save it uncompressed");
        data = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
      } else { out.push({ name: name, skip: "packed in a way this can't read" }); continue; }
      out.push({ name: name, text: dec.decode(data) });
    }
    return out;
  }
  var OK_FILE = /\.(epp|cpp|cc|cxx|h|hpp|hh|hxx|txt|csv|json|md|dat)$/i;
  function exportZip() {
    var fl = files(); if (!fl.length) return;
    var title = (fl[0].text.match(/^\s*note\s+(.+)$/m) || [, "english-plus-plus-project"])[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "project";
    var blob = zip(fl.map(function (f) { return { name: f.name, text: f.text }; }));
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = title + ".zip";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    S.toast("Saved " + fl.length + (fl.length === 1 ? " file" : " files") + " as " + a.download);
    window.EppLastZip = blob; // for tests
  }
  async function importZip(file) {
    try {
      var list = await unzip(await file.arrayBuffer());
      var keep = [], skipped = [];
      list.forEach(function (f) {
        var base = f.name.split("/").pop();
        if (f.skip || !OK_FILE.test(base) || /^\._|^\.|__MACOSX/.test(f.name)) { skipped.push(base); return; }
        if (keep.some(function (g) { return g.name === base; })) { skipped.push(f.name + " (same name)"); return; }
        keep.push({ name: base, text: f.text.replace(/\r\n?/g, "\n") });
      });
      if (!keep.length) { S.toast("No English++ or C++ files in that .zip"); return; }
      // the file that runs first: main.epp, else the first .epp, else main.cpp / the first file
      var mi = keep.findIndex(function (f) { return f.name === "main.epp"; });
      if (mi < 0) mi = keep.findIndex(function (f) { return /\.epp$/i.test(f.name); });
      if (mi < 0) mi = keep.findIndex(function (f) { return /^main\.(cpp|cc|cxx)$/i.test(f.name); });
      if (mi > 0) keep.unshift(keep.splice(mi, 1)[0]);
      // the Studio runs main.epp: an English++ project whose first file has another name gets it renamed (unless another file brings it in by name)
      var renamed = "";
      if (/\.epp$/i.test(keep[0].name) && keep[0].name !== "main.epp" && !keep.some(function (f) { return imports(f.text).indexOf(keep[0].name) >= 0; })) { renamed = keep[0].name; keep[0].name = "main.epp"; }
      var cur = files();
      if (cur.some(function (f) { return f.text.trim(); }) && !confirm("Open the project from " + file.name + " (" + keep.length + (keep.length === 1 ? " file" : " files") + ")? It replaces what is open now — export first if you want to keep it.")) return;
      S.setFiles(keep);
      S.toast("Opened " + keep.length + (keep.length === 1 ? " file" : " files") + (renamed ? " · " + renamed + " runs first as main.epp" : "") + (skipped.length ? " · skipped " + skipped.length : ""));
      renderFiles();
    } catch (e) { S.toast("Couldn't open that .zip: " + (e && e.message || e)); }
  }

  function init(hooks) {
    S = hooks;
    setupToolbar();
    // Project button (sits with the other tools; moves into More on a phone)
    var b = document.createElement("button"); b.type = "button"; b.className = "es-btn"; b.id = "esProject"; b.textContent = "Project"; b.title = "All files, search every file, export or import a .zip";
    var save = $("esSave"); save.parentNode.insertBefore(b, save.nextSibling);
    if (ORDER) { ORDER.splice(ORDER.indexOf("esSave") + 1, 0, "esProject"); watch(); fit(); }
    document.body.insertAdjacentHTML("beforeend", sheetHTML());
    b.addEventListener("click", openProject);
    $("esPrjClose").addEventListener("click", function () { S.sheetClose("esPrjSheet"); });
    $("esPrjSheet").addEventListener("click", function (e) { if (e.target.id === "esPrjSheet") S.sheetClose("esPrjSheet"); });
    $("esPrjSearch").addEventListener("input", function () { var q = this.value; if (q.trim()) renderSearch(q); else renderFiles(); });
    $("esPrjList").addEventListener("click", function (e) {
      var f = e.target.closest(".es-prj-file, .es-prj-hit"); if (!f) return;
      openAt(+f.dataset.i, f.dataset.line ? +f.dataset.line : 0);
    });
    $("esPrjExport").addEventListener("click", exportZip);
    $("esPrjImport").addEventListener("click", function () { $("esPrjFile").click(); });
    $("esPrjFile").addEventListener("change", function () { var f = this.files && this.files[0]; this.value = ""; if (f) importZip(f); });
    // Ctrl+Shift+F on a keyboard: search every file
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "F" || e.key === "f")) { e.preventDefault(); openProject(); setTimeout(function () { $("esPrjSearch").focus(); }, 30); }
    });
  }
  window.EppCore = { fits: function () { return fitN; }, init: init, fit: function () { fit(); }, zip: zip, unzip: unzip, importZip: importZip, exportZip: exportZip, setupToolbar: setupToolbar };
  // the toolbar is plain HTML that exists before the Studio starts: lay it out at once (no flash of a too-wide row)
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupToolbar); else setupToolbar();
})();
