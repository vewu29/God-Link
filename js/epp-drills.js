/* English++ drill extras — content added on top of the drills, never a
   change to how a drill works. Runs only when the loaded track carries a
   Chart, lessons, a path and Fix the Line exercises (today: English++),
   so every other track is untouched.
   Adds two things:
   - under each drill's typing box (#eppDrillMore): the line word by
     word, with the root's family and plain meaning from the frozen
     Chart; the C++ the line becomes; the other Chart words in it; one
     real Studio message for a common mistake with this kind of line;
     and links to the chapter's full lesson and its Mastery Path stage;
   - under the block grid (#eppFix): Fix the Line, a mistake drill. It
     shows a short program and the Studio's real message (from the Book,
     or roots.cpp's own text), and the learner types the fixed line.
     Its progress is its own key, so drill progress never moves.
   English++ is Vewu's language; this file only shows it. */
(function () {
  "use strict";
  var T = window.CB_T;
  if (!T || !T.chart || !T.lessons || !T.path || !T.fixline) return;
  var C = T.chart;
  var FIX_KEY = "code-block-epp-fixline-v1";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function words(line) { return String(line).trim().match(/(?:"(?:[^"\\]|\\.)*"|\S)+/g) || []; }

  var ROOT = {}, FAM = {}, WORD = {};
  C.families.forEach(function (f) { FAM[f.letter] = f; });
  C.roots.forEach(function (r) { ROOT[r.root] = r; });
  C.values.forEach(function (v) { WORD[v.word] = { w: v.word, tag: "value word", says: v.says, cpp: v.cpp, fam: v.fam }; });
  C.kinds.forEach(function (k) { WORD[k.kind] = { w: k.kind, tag: "kind", says: k.what, cpp: k.cpp }; });
  C.special.forEach(function (s) { WORD[s.word] = { w: s.word, tag: "special word", says: s.what, cpp: s.cpp || "(nothing)" }; });

  /* Lesson and path lookups, by Book chapter number. */
  var CHAP = {}, LESSON = {}, STAGE = {};
  T.chapters.forEach(function (c, i) { var m = /Ch\. (\d+)/.exec(c.chapter || ""); if (m) CHAP[+m[1]] = i; });
  T.lessons.forEach(function (L) { if (L) LESSON[L.num] = L; });
  T.path.forEach(function (st, n) { st.chapters.forEach(function (c) { STAGE[c] = n; }); });
  function chapNum(b) { var m = /Ch\. (\d+)/.exec(b.chapter || ""); return m ? +m[1] : null; }
  function mistakeOf(id) {
    var m = /^(\d+)\.(\d+)$/.exec(id || ""); if (!m) return null;
    var L = LESSON[+m[1]]; return L && L.mistakes ? L.mistakes[+m[2]] || null : null;
  }
  window.cbEppMistakeOf = mistakeOf;

  function cppBox(line) {
    var c = typeof window.cbEppCppOf === "function" ? window.cbEppCppOf(line) : null;
    if (!c) return "";
    return '<div class="epp-pair"><span>' + (c.exact ? "C++" : "C++ shape") + "</span><code>" + esc(c.cpp) + "</code></div>";
  }
  function code(s, cls) { return '<pre class="epp-dcode' + (cls ? " " + cls : "") + '"><code>' + esc(s) + "</code></pre>"; }

  /* ---------- Under each drill ---------- */
  function renderMore(i) {
    var box = $("eppDrillMore"), b = T.blocks[i];
    if (!box) return;
    if (!b) { box.hidden = true; box.innerHTML = ""; return; }
    var w = words(b.line), r = w[1], R = r === "is" ? { says: "make, then change", fam: "" } : ROOT[r], F = R && R.fam ? FAM[R.fam] : null;
    var h = '<div class="epp-dm-head"><span class="epp-kicker">Inside this line</span></div>';
    h += '<div class="epp-spots epp-dm-spots"><span><b>who</b><code>' + esc(w[0]) + "</code></span>" +
      "<span><b>root</b><code>" + esc(r) + "</code><i>" + esc(R ? R.says : "the name of a function or method") + "</i></span>" +
      "<span><b>what</b><code>" + esc(w[2]) + "</code></span></div>";
    if (F) h += '<p class="epp-dm-fam"><span class="epp-fam-badge">' + esc(F.letter) + "</span><span><b>" + esc(F.letter) + " · " + esc(F.name) + "</b> family — " + esc(F.does) + ".</span></p>";
    else if (r === "is") h += '<p class="epp-dm-fam"><span class="epp-fam-badge">is</span><span><b>is</b> — the one short word: the first time it makes the name, after that it changes it.</span></p>';
    else h += '<p class="epp-dm-fam"><span class="epp-fam-badge">fn</span><span>The middle word here is not a root: it is the name of a function or method, run with what comes after it.</span></p>';
    h += cppBox(b.line);
    /* Other Chart words in the line: value words, kinds, special words. */
    var seen = {}, extra = [];
    String(b.line).replace(/"(?:[^"\\]|\\.)*"/g, " ").replace(/[A-Za-z_][A-Za-z_0-9]*/g, function (t) {
      if (t !== r && WORD[t] && !seen[t]) { seen[t] = 1; extra.push(WORD[t]); }
      return t;
    });
    if (extra.length) {
      h += '<div class="epp-dm-words">' + extra.map(function (x) {
        return '<div class="epp-dm-word"><code>' + esc(x.w) + '</code><span class="epp-tag">' + esc(x.tag) + "</span><div>" + esc(x.says) + '</div><div class="epp-dim">C++: <code>' + esc(x.cpp) + "</code></div></div>";
      }).join("") + "</div>";
    }
    var m = mistakeOf(b.mk);
    if (m) {
      h += '<div class="epp-dm-mistake"><div class="epp-kicker">A common slip</div>' + code(m.code, "bad") +
        '<div class="epp-says-box"><span>The Studio says</span>' + esc(m.says) + '</div><div class="epp-fix"><b>Fix:</b> ' + esc(m.fix) + "</div></div>";
    }
    var n = chapNum(b), links = "";
    if (n != null && CHAP[n] != null && LESSON[n]) links += '<button type="button" class="epp-link" data-ch="' + CHAP[n] + '">Read the lesson: Ch. ' + n + " · " + esc(LESSON[n].title) + "</button>";
    if (n != null && STAGE[n] != null) links += '<button type="button" class="epp-link" data-path="1">Mastery Path stage ' + (STAGE[n] + 1) + " · " + esc(T.path[STAGE[n]].name) + "</button>";
    if (links) h += '<div class="epp-dm-links">' + links + "</div>";
    box.innerHTML = h; box.hidden = false;
  }
  function hookDrill() {
    var tc = $("typeCard"); if (!tc || $("eppDrillMore")) return;
    var box = el("section", "epp-drill-more"); box.id = "eppDrillMore"; box.hidden = true;
    box.setAttribute("aria-label", "Inside this line");
    tc.parentNode.insertBefore(box, tc.nextSibling);
    box.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.ch != null && typeof window.showView === "function") {
        window.showView("library");
        if (typeof window.openChapter === "function") window.openChapter(+t.dataset.ch);
        window.scrollTo(0, 0);
      } else if (t.dataset.path && typeof window.showView === "function") {
        window.showView("library");
        var p = $("eppPath"); if (p && p.scrollIntoView) p.scrollIntoView();
      }
    });
    var orig = window.openBlock;
    if (typeof orig !== "function") return;
    window.openBlock = function (i) {
      var r = orig.apply(this, arguments);
      try { renderMore(+i); } catch (e) { box.hidden = true; }
      return r;
    };
  }

  /* ---------- Fix the Line ---------- */
  var FX = T.fixline, fixAt = -1, tries = 0;
  function solved() { try { var s = JSON.parse(localStorage.getItem(FIX_KEY) || "[]"); return Array.isArray(s) ? s : []; } catch (e) { return []; } }
  function markSolved(id) { var s = solved(); if (s.indexOf(id) < 0) { s.push(id); try { localStorage.setItem(FIX_KEY, JSON.stringify(s)); } catch (e) {} } }
  function norm(s) { return String(s).replace(/[\u00A0\u202F]/g, " ").replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"').replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'").trim().replace(/\s+/g, " "); }
  function progText() { var s = solved(), n = 0; FX.forEach(function (x) { if (s.indexOf(x.id) >= 0) n++; }); return n + " of " + FX.length + " fixed"; }
  function programHTML(x) {
    return '<pre class="epp-dcode epp-fx-prog"><code>' + x.code.split("\n").map(function (l, k) {
      return '<span class="epp-fx-ln' + (k + 1 === x.line ? " bad" : "") + '"><i>' + (k + 1) + "</i>" + esc(l || " ") + "</span>";
    }).join("\n") + "</code></pre>";
  }
  function renderFix() {
    var box = $("eppFixBody"), x = FX[fixAt];
    if (!box) return;
    $("eppFixProg").textContent = progText();
    if (!x) { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false; tries = 0;
    var done = solved().indexOf(x.id) >= 0;
    box.innerHTML = '<div class="epp-fx-top"><span class="epp-kicker">Fix ' + (fixAt + 1) + " of " + FX.length + " · Book Ch. " + esc(x.ch) + " · " + esc(x.title) + "</span>" + (done ? '<span class="epp-fx-done">Fixed before</span>' : "") + "</div>" +
      programHTML(x) +
      '<div class="epp-says-box"><span>The Studio says</span>' + esc(x.says) + "</div>" +
      '<label class="epp-fx-label" for="eppFixInput">Type line ' + x.line + ", fixed</label>" +
      '<div class="console-input epp-fx-input"><span class="console-prompt" aria-hidden="true">›</span><input id="eppFixInput" aria-label="Type the fixed line" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" /></div>' +
      '<div class="epp-fx-btns"><button type="button" class="mp-btn" data-act="check">Check</button><button type="button" class="epp-fx-btn" data-act="hint">Show the fix</button><button type="button" class="epp-fx-btn" data-act="next">Next</button></div>' +
      '<div class="epp-fx-status" id="eppFixStatus" aria-live="polite"></div>';
    var inp = $("eppFixInput");
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check(); } });
  }
  function status(html, cls) { var s = $("eppFixStatus"); if (s) { s.innerHTML = html; s.className = "epp-fx-status" + (cls ? " " + cls : ""); } }
  function check() {
    var x = FX[fixAt], inp = $("eppFixInput"); if (!x || !inp) return;
    var got = norm(inp.value);
    if (!got) { status("Type the fixed line first."); return; }
    if (got === norm(x.good)) {
      markSolved(x.id); $("eppFixProg").textContent = progText(); renderChips();
      status("<b>Fixed.</b> " + esc(x.fix) + '<div class="epp-pair"><span>Line ' + x.line + "</span><code>" + esc(x.good) + "</code></div>", "good");
      return;
    }
    tries++;
    if (got === norm(x.bad)) status("That is still the line the Studio refused. Read its message again, then change what it points at.", "bad");
    else if (words(got).length !== 3 && !/^\s/.test(x.good)) status("Not yet. A line is exactly three words: who, the root and what. You typed " + words(got).length + ".", "bad");
    else status("Not yet. " + (tries >= 2 ? "Tap Show the fix if you want to see it." : "Look at what the Studio says, and try again."), "bad");
  }
  function renderChips() {
    var row = $("eppFixChips"); if (!row) return;
    var s = solved();
    row.innerHTML = FX.map(function (x, k) {
      return '<button type="button" class="vchip' + (k === fixAt ? " active" : "") + (s.indexOf(x.id) >= 0 ? " epp-fx-solved" : "") + '" data-k="' + k + '" aria-label="Fix ' + (k + 1) + (s.indexOf(x.id) >= 0 ? ", fixed" : "") + '">' + (k + 1) + "</button>";
    }).join("");
  }
  function openFix(k) { fixAt = Math.max(0, Math.min(FX.length - 1, k)); renderChips(); renderFix(); var i = $("eppFixInput"); if (i && i.focus) try { i.focus({ preventScroll: true }); } catch (e) {} }
  function buildFix() {
    var grid = $("blockGrid"); if (!grid || $("eppFix")) return;
    var box = el("section", "epp-fixline"); box.id = "eppFix"; box.setAttribute("aria-label", "Fix the Line");
    box.innerHTML = '<div class="epp-head"><h3>Fix the Line</h3><p>Real mistakes and the Studio\'s real messages, from the Book. Read what the Studio says, then type the line fixed. Practice here never changes your drill progress.</p></div>' +
      '<div class="epp-fx-bar"><span class="sec-chip" id="eppFixProg"></span><button type="button" class="mp-btn" id="eppFixStart">Start fixing</button></div>' +
      '<div class="vault-chips epp-fx-chips" id="eppFixChips" role="group" aria-label="Pick a mistake"></div>' +
      '<div class="epp-fx-body" id="eppFixBody" hidden></div>';
    var after = grid.nextSibling; grid.parentNode.insertBefore(box, after);
    $("eppFixProg").textContent = progText();
    renderChips();
    $("eppFixStart").addEventListener("click", function () {
      var s = solved(), k = 0; while (k < FX.length && s.indexOf(FX[k].id) >= 0) k++;
      openFix(k >= FX.length ? 0 : k);
    });
    $("eppFixChips").addEventListener("click", function (e) { var t = e.target.closest("button"); if (t) openFix(+t.dataset.k); });
    $("eppFixBody").addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.act === "check") check();
      else if (t.dataset.act === "next") openFix((fixAt + 1) % FX.length);
      else if (t.dataset.act === "hint") { var x = FX[fixAt]; status("<b>The fix:</b> " + esc(x.fix) + '<div class="epp-pair"><span>Line ' + x.line + "</span><code>" + esc(x.good) + "</code></div>Now type it yourself."); }
    });
  }

  function start() { try { hookDrill(); } catch (e) {} try { buildFix(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
