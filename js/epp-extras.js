/* English++ extras — content added on top of the Library, never a
   change to how the Library works. Runs only when the loaded track
   carries a Chart, lessons and a path (today: English++), so every
   other track is untouched.
   Adds three things:
   - the Mastery Path (#eppPath) under the Library intro: eight stages
     from the first line to Turbo, each with its chapters, a drill to
     start on and a checkpoint program;
   - the Root Finder (#eppFinder) above the reference shelves: every
     word in the frozen Chart, searchable, with its plain meaning, its
     C++ and an example — type a whole line and it reads it back;
   - a full lesson (#eppLesson) under each chapter's Text mode: the
     idea, the Book's programs and what they print, the key lines with
     the C++ each one becomes, the Studio's own messages for common
     mistakes, practice with answers, and a recap.
   English++ is Vewu's language; this file only shows it. */
(function () {
  "use strict";
  var T = window.CB_T;
  if (!T || !T.chart || !T.lessons || !T.path) return;
  var C = T.chart;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var ROOT = {}, KIND = {}, VALUE = {}, SPECIAL = {}, FAM = {};
  C.roots.forEach(function (r) { ROOT[r.root] = r; });
  C.kinds.forEach(function (k) { KIND[k.kind] = k; });
  C.values.forEach(function (v) { VALUE[v.word] = v; });
  C.special.forEach(function (s) { SPECIAL[s.word] = s; });
  C.families.forEach(function (f) { FAM[f.letter] = f; });

  /* ---------- The C++ a line becomes ---------- */
  function words(line) { return String(line).trim().match(/(?:"[^"]*"|\S)+/g) || []; }
  function val(x) {
    if (x == null) return null;
    if (/^"[^"]*"$/.test(x)) return /@\w/.test(x) ? null : x;
    if (/^'.'$/.test(x)) return x;
    if (SPECIAL[x]) return x === "now" ? "" : SPECIAL[x].cpp;
    if (VALUE[x] || KIND[x] || ROOT[x]) return null;
    if (/^[A-Za-z_0-9.+\-*\/%]+$/.test(x) && !/^[0-9]+[A-Za-z_]/.test(x)) return x;
    return null;
  }
  var LISTISH = /^(vec|lst|dqu|stk|que|hep|set|bag|opt|own|shr|atm|fut|gnr|chn)$/;
  function kind(k) {
    var parts = String(k).split("@");
    function go(i) {
      var p = parts[i]; if (p == null) return null;
      if (p === "now") return "void";
      var K = KIND[p];
      if (!K) { if (!/^[A-Z]\w*$/.test(p)) return null; if (parts[i + 1] == null) return p; var t = go(i + 1); return t && p + "<" + t + ">"; }
      if (p === "ref" || p === "see" || p === "tkn" || p === "ptr") { var inner = go(i + 1); return inner && (p === "see" ? "const " + inner + "&" : inner + K.cpp); }
      if (LISTISH.test(p) && parts[i + 1] != null && /^std::|^epp::/.test(K.cpp)) { var e = go(i + 1); return e && K.cpp + "<" + e + ">"; }
      if (p === "map" || p === "hsh" || p === "par") { var k1 = go(i + 1), k2 = go(i + 2); return k1 && k2 && K.cpp + "<" + k1 + ", " + k2 + ">"; }
      if (p === "arr") { var t1 = go(i + 1), sz = parts[i + 2]; return t1 && /^\d+$/.test(sz || "") ? K.cpp + "<" + t1 + ", " + sz + ">" : null; }
      if (p === "alt" || p === "tup") {
        var all = [];
        for (var j = i + 1; j < parts.length; j++) {
          var g = KIND[parts[j]] && !/^std::(vector|map)/.test(KIND[parts[j]].cpp) ? KIND[parts[j]].cpp : (/^[A-Z]\w*$/.test(parts[j]) ? parts[j] : null);
          if (!g) return null; all.push(g);
        }
        return all.length ? K.cpp + "<" + all.join(", ") + ">" : null;
      }
      if (parts[i + 1] != null) return null;
      return K.cpp;
    }
    return go(0);
  }
  function litKind(v) { return /^-?\d+$/.test(v) ? "int" : /^-?\d+\.\d+$/.test(v) ? "double" : /^"/.test(v) ? "std::string" : /^'/.test(v) ? "char" : v === "yes" || v === "nay" ? "bool" : "auto"; }
  var CMP = { eq: "==", ne: "!=", lt: "<", le: "<=", gt: ">", ge: ">=" };
  var OPS = { add: "+=", asb: "-=", aml: "*=", adv: "/=", amd: "%=", and: "&=", aor: "|=", axr: "^=", asl: "<<=", asr: ">>=" };
  /* Common shapes are written out with the line's own words (exact:
     true). Anything else shows the Chart's general C++ pattern. */
  function cppOf(line) {
    var w = words(line), a = w[0], r = w[1], b = w[2], vb = val(b), R = ROOT[r], exact = null;
    var name = /^[A-Za-z_]\w*$/.test(a || "");
    if (r === "is" && vb != null && name) exact = litKind(b) === "auto" ? a + " = " + vb + ";   (C++ gives it its kind the first time)" : litKind(b) + " " + a + " = " + vb + ";   then  " + a + " = " + vb + ";";
    else if (R && name && vb != null) {
      var pair = CMP[r.slice(1)], fam = r.charAt(0);
      if (OPS[r]) exact = a + " " + OPS[r] + " " + vb + ";";
      else if (pair && fam === "i") exact = "if (" + a + " " + pair + " " + vb + ") {";
      else if (pair && fam === "o") exact = "} else if (" + a + " " + pair + " " + vb + ") {";
      else if (pair && fam === "w") exact = "while (" + a + " " + pair + " " + vb + ") {";
      else if (pair && fam === "u") exact = "} while (!(" + a + " " + pair + " " + vb + "));";
      else if (r === "flt" || r === "fle") exact = "for (int " + a + " = 0; " + a + " " + CMP[r.slice(1)] + " " + vb + "; ++" + a + ") {";
      else if (r === "fea") exact = "for (auto& " + a + " : " + vb + ") {";
      else if ((r === "prn" || r === "put") && (a === "out" || a === "err")) exact = (a === "out" ? "std::cout" : "std::cerr") + " << " + vb + (r === "prn" ? " << std::endl;" : ";");
      else if (r === "ert") exact = vb === "" ? "return;" : "return " + vb + ";";
      else if (r === "mkn") exact = "const " + litKind(b) + " " + a + " = " + vb + ";";
    }
    if (!exact && R && name) {
      var kb = kind(b);
      if (r === "dfn" && kb) exact = kb + " " + a + "(...) {";
      else if (r === "dpm" && kb) exact = kb + " " + a + "   (one of the function's parameters)";
      else if (r === "dfd" && kb) exact = kb + " " + a + "{};";
      else if (r === "mak" && kb) exact = kb + " " + a + ";";
      else if (r === "oth" && a === "now") exact = "} else {";
      else if (r === "ebk" && a === "now" && b === "now") exact = "break;";
      else if (r === "dcl" && /^[A-Z]\w*$/.test(b || "")) exact = "class " + a + " : public " + b + " {";
    }
    if (exact) return { cpp: exact, exact: true };
    if ((r === "prn" || r === "put") && (a === "out" || a === "err")) return { cpp: (a === "out" ? "std::cout" : "std::cerr") + " << …" + (r === "prn" ? " << std::endl;" : ";") + "   (… is " + b + " in C++)", exact: false };
    if (r === "is") return { cpp: "int x = 6;   then  x = 6;", exact: false };
    return R ? { cpp: R.cpp, exact: false } : null;
  }
  window.cbEppCppOf = cppOf;
  function cppPair(c) { return c ? '<div class="epp-pair"><span>' + (c.exact ? "C++" : "C++ shape") + "</span><code>" + esc(c.cpp) + "</code></div>" : ""; }

  /* ---------- Mastery Path ---------- */
  var chapIndex = {};
  T.chapters.forEach(function (c, i) { var m = /Ch\. (\d+)/.exec(c.chapter || ""); if (m) chapIndex[+m[1]] = i; });
  function firstBlockFor(nums) {
    for (var i = 0; i < T.blocks.length; i++) { var m = /Ch\. (\d+)/.exec(T.blocks[i].chapter || ""); if (m && nums.indexOf(+m[1]) >= 0) return i; }
    return -1;
  }
  function projectIndex(name) { for (var i = 0; i < T.projects.length; i++) if (T.projects[i].name === name) return i; return -1; }
  function buildPath() {
    var intro = document.querySelector("#libHome .lib-intro");
    if (!intro || $("eppPath")) return;
    var box = el("section", "epp-path"); box.id = "eppPath"; box.setAttribute("aria-label", "Mastery path");
    var html = '<div class="epp-head"><h3>The Mastery Path</h3><p>Eight stages, from your first line to threads and Turbo. Read the chapters, drill their lines, then build the checkpoint program to prove the stage.</p></div>';
    T.path.forEach(function (st, n) {
      var chips = st.chapters.map(function (c) {
        var i = chapIndex[c]; if (i == null) return "";
        return '<button type="button" class="epp-chip" data-ch="' + i + '" title="' + esc(T.chapters[i].title) + '">Ch. ' + c + '<small>' + esc(T.chapters[i].title) + "</small></button>";
      }).join("");
      var b = firstBlockFor(st.chapters), cp = st.checkpoint || {}, pj = cp.project ? projectIndex(cp.project) : -1;
      html += '<div class="epp-stage"><div class="epp-stage-top"><span class="epp-stage-num">' + (n + 1) + '</span><div><div class="epp-stage-name">' + esc(st.name) + '</div><div class="epp-stage-goal">' + esc(st.goal) + "</div></div></div>" +
        '<div class="epp-stage-row"><span class="epp-stage-label">Read</span><div class="epp-chips">' + chips + "</div></div>" +
        (b >= 0 ? '<div class="epp-stage-row"><span class="epp-stage-label">Drill</span><button type="button" class="epp-link" data-block="' + b + '">Start at block ' + (b + 1) + ": " + esc(T.blocks[b].line) + "</button></div>" : "") +
        '<div class="epp-stage-row"><span class="epp-stage-label">Checkpoint</span><div class="epp-stage-text">' + esc(cp.can || "") +
        (pj >= 0 ? ' <button type="button" class="epp-link" data-project="' + pj + '">Build it: ' + esc(cp.project) + "</button>" : "") + "</div></div></div>";
    });
    box.innerHTML = html;
    intro.parentNode.insertBefore(box, intro.nextSibling);
    box.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.ch != null && typeof window.openChapter === "function") { window.openChapter(+t.dataset.ch); window.scrollTo(0, 0); }
      else if (t.dataset.block != null && typeof window.showView === "function") { window.showView("sandbox"); if (typeof window.openBlock === "function") window.openBlock(+t.dataset.block); }
      else if (t.dataset.project != null && typeof window.showView === "function") {
        window.showView("pc"); var pick = $("pcPick");
        if (pick) { pick.value = t.dataset.project; pick.dispatchEvent(new Event("change")); }
      }
    });
  }

  /* ---------- Root Finder ---------- */
  var ALL = [];
  C.roots.forEach(function (r) { ALL.push({ w: r.root, fam: r.fam, tag: "root", says: r.says, cpp: r.cpp, ex: r.ex, more: "first word: " + r.first + " · third word: " + r.third + (r.block ? " · opens a block" : "") }); });
  ALL.push({ w: "is", fam: "", tag: "root", says: "make, then change", cpp: "int x = 6;   then  x = 6;", ex: "x is 6", more: C.is || "" });
  C.values.forEach(function (v) { ALL.push({ w: v.word, fam: v.fam, tag: "value word", says: v.says, cpp: v.cpp, ex: v.ex, more: "" }); });
  C.kinds.forEach(function (k) { ALL.push({ w: k.kind, fam: "", tag: "kind", says: k.what, cpp: k.cpp, ex: "x mak " + k.kind, more: "" }); });
  C.special.forEach(function (s) { ALL.push({ w: s.word, fam: "", tag: "special word", says: s.what, cpp: s.cpp || "(nothing)", ex: "", more: "" }); });
  C.pairs.forEach(function (p) { ALL.push({ w: p.pair, fam: "", tag: "comparing pair", says: p.says, cpp: p.cpp, ex: "x i" + p.pair + " 3", more: "the last two letters of a root" }); });
  var SUMMARY = ALL.length + " words in the Chart (" + (C.roots.length + 1) + " roots counting is, " + C.values.length + " value words, " + C.kinds.length + " kinds, " + C.special.length + " special words, " + C.pairs.length + " comparing pairs).";
  var famPick = "all";
  function card(x) {
    var f = x.fam && FAM[x.fam];
    return '<div class="epp-word"><div class="epp-word-top"><code class="epp-w">' + esc(x.w) + '</code><span class="epp-tag">' + esc(x.tag + (f ? " · " + f.letter + " " + f.name : "")) + "</span></div>" +
      '<div class="epp-says">' + esc(x.says) + "</div>" + cppPair({ cpp: x.cpp, exact: false }).replace("C++ shape", "C++") +
      (x.ex ? '<div class="epp-pair"><span>Example</span><code>' + esc(x.ex) + "</code></div>" : "") +
      (x.more ? '<div class="epp-dim">' + esc(x.more) + "</div>" : "") + "</div>";
  }
  function readLine(q) {
    var w = words(q); if (w.length !== 3) return "";
    var R = w[1] === "is" ? { says: "make, then change" } : ROOT[w[1]];
    if (!R) return '<div class="epp-read"><strong>' + esc(w[1]) + "</strong> is not a root in the Chart, so this isn't an English++ line. The middle word is always a root.</div>";
    var c = cppOf(q);
    return '<div class="epp-read"><div class="epp-kicker">Reading your line</div><div class="epp-spots">' +
      '<span><b>who</b><code>' + esc(w[0]) + '</code></span><span><b>root</b><code>' + esc(w[1]) + '</code><i>' + esc(R.says) + '</i></span><span><b>what</b><code>' + esc(w[2]) + "</code></span></div>" +
      cppPair(c) + '<p class="epp-dim">Worked out from the frozen Chart. Where it says C++ shape, it is the Chart\'s general pattern. The Studio\'s C++ View shows the exact C++ for your own program.</p></div>';
  }
  function renderFinder() {
    var q = ($("eppFindSearch").value || "").trim(), ql = q.toLowerCase();
    var list = ALL.filter(function (x) {
      if (famPick !== "all" && x.fam !== famPick && !(famPick === "kinds" && x.tag === "kind") && !(famPick === "special" && (x.tag === "special word" || x.tag === "comparing pair"))) return false;
      if (!ql) return true;
      var wq = words(q);
      if (wq.length === 3) return x.w === wq[1];
      return x.w.toLowerCase().indexOf(ql) === 0 || String(x.says).toLowerCase().indexOf(ql) >= 0 || String(x.cpp).toLowerCase().indexOf(ql) >= 0;
    });
    $("eppFindRead").innerHTML = readLine(q);
    $("eppFindList").innerHTML = list.slice(0, 80).map(card).join("") || '<p class="epp-dim">No word matches. Try a C++ word like "sort" or "while", or a root like "fea".</p>';
    $("eppFindCount").textContent = "Showing " + Math.min(80, list.length) + " of " + list.length + " · " + SUMMARY;
  }
  function buildFinder() {
    var ref = document.querySelector("#libHome .ref-stack");
    if (!ref || $("eppFinder")) return;
    var box = el("section", "epp-finder"); box.id = "eppFinder"; box.setAttribute("aria-label", "Root Finder");
    var fams = '<button type="button" class="active" data-fam="all">All</button>' + C.families.map(function (f) { return '<button type="button" data-fam="' + f.letter + '" title="' + esc(f.name) + '">' + f.letter + " " + esc(f.name) + "</button>"; }).join("") +
      '<button type="button" data-fam="kinds">kinds</button><button type="button" data-fam="special">special + pairs</button>';
    box.innerHTML = '<div class="epp-head"><h3>The Root Finder — the Whole Chart</h3><p>Every word in the frozen Chart: roots, value words, kinds and special words, each with its plain meaning, its C++ and an example. Search a word, a C++ word, or type a whole line to have it read back.</p></div>' +
      '<input class="gloss-search" id="eppFindSearch" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Search the English++ Chart" placeholder="Search ' + ALL.length + ' words… try “igt”, “sort” or “score add 10”" />' +
      '<div class="epp-fam" role="group" aria-label="Filter by family">' + fams + "</div>" +
      '<div id="eppFindRead"></div><div id="eppFindList" class="epp-words"></div><p class="prof-msg" id="eppFindCount"></p>' +
      '<details class="epp-rules"><summary>The 9 rules of the line</summary><ol>' + C.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol></details>";
    ref.parentNode.insertBefore(box, ref);
    $("eppFindSearch").addEventListener("input", renderFinder);
    box.querySelector(".epp-fam").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      famPick = b.dataset.fam;
      Array.prototype.forEach.call(this.querySelectorAll("button"), function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      renderFinder();
    });
    renderFinder();
  }

  /* ---------- Full lesson under a chapter ---------- */
  function prog(code, out, label) {
    return '<div class="epp-prog"><div class="epp-prog-label">' + esc(label || "English++") + '</div><pre class="story-code epp-code">' + esc(code) + "</pre>" +
      (out != null && out !== "" ? '<div class="epp-prog-label">It prints</div><pre class="epp-out">' + esc(out) + "</pre>" : "") + "</div>";
  }
  function renderLesson(i) {
    var box = $("eppLesson"), L = T.lessons[i];
    if (!box) return;
    if (!L) { box.className = "epp-lesson hidden"; box.innerHTML = ""; return; }
    var h = '<div class="epp-lesson-head"><div class="epp-kicker">The full lesson · Book Ch. ' + esc(L.num) + "</div><h3>" + esc(L.title) + '</h3><p>' + esc(L.idea) + "</p></div>";
    (L.sections || []).forEach(function (s) {
      h += '<div class="epp-sec"><h4>' + esc(s.h) + "</h4>" + (s.text || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + (s.code ? prog(s.code, s.out, "From the Book") : "") + "</div>";
    });
    if (L.lines && L.lines.length) {
      h += '<div class="epp-sec"><h4>The lines, and the C++ they become</h4><div class="epp-lines">' + L.lines.map(function (x) {
        return '<div class="epp-line"><code class="epp-en">' + esc(x.line) + "</code><div>" + esc(x.say) + "</div>" + cppPair(cppOf(x.line)) + "</div>";
      }).join("") + '</div><p class="epp-dim">C++ is worked out from the frozen Chart; C++ shape is the Chart\'s general pattern. The Studio\'s C++ View shows the exact C++.</p></div>';
    }
    if (L.mistakes && L.mistakes.length) {
      h += '<div class="epp-sec"><h4>When the Studio stops you</h4>' + L.mistakes.map(function (m) {
        return '<div class="epp-mistake">' + prog(m.code, null, "This program") + '<div class="epp-says-box"><span>The Studio says</span>' + esc(m.says) + '</div><div class="epp-fix"><b>Fix:</b> ' + esc(m.fix) + "</div>" + (m.fix_code ? prog(m.fix_code, m.fix_out, "Fixed") : "") + "</div>";
      }).join("") + "</div>";
    }
    if (L.watch_out) h += '<div class="big-idea"><strong>Watch out</strong><span>' + esc(L.watch_out) + "</span></div>";
    if (L.practice && L.practice.length) {
      h += '<div class="epp-sec"><h4>Practice</h4>' + L.practice.map(function (p, n) {
        return '<details class="epp-practice"><summary><span class="epp-pnum">' + (n + 1) + "</span>" + esc(p.q) + '</summary><div class="epp-answer"><p>' + esc(p.answer) + "</p>" + (p.answer_code ? prog(p.answer_code, p.answer_out, "One answer") : "") + "</div></details>";
      }).join("") + "</div>";
    }
    if (L.recap) h += '<div class="big-idea"><strong>Recap</strong><span>' + esc(L.recap) + "</span></div>";
    box.innerHTML = h; box.className = "epp-lesson";
  }
  function hookReader() {
    var tm = $("textMode"); if (!tm || $("eppLesson")) return;
    var box = el("div", "epp-lesson hidden"); box.id = "eppLesson"; tm.appendChild(box);
    var orig = window.openEntry;
    if (typeof orig !== "function") return;
    window.openEntry = function (i) {
      orig.apply(this, arguments);
      try { if (typeof readerKind !== "undefined" && readerKind === "chapter") renderLesson(i); else renderLesson(-1); } catch (e) { renderLesson(-1); }
    };
  }

  function start() { try { buildPath(); } catch (e) {} try { buildFinder(); } catch (e) {} try { hookReader(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
