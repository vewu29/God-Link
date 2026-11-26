/* English++ Web Studio v4 — "Fix it": a concrete corrected line for common mistakes.
   A fix is offered ONLY when the corrected line is certain from the message and the line itself
   (the Book's mistake patterns, Fix the Line drills, and the engine's own messages). Otherwise the
   message just explains, as before. English++ itself is unchanged: a fix is a suggestion the user taps.
   API: EppFixIt.fixesFor({line, message, lineText, file?}) -> [{name, text, line?}] (line = which line to
   replace, when it is not the one the message points at), EppFixIt.offerRun(error) (console button). */
(function () {
  "use strict";
  var D = null, loading = null;
  function data() {
    if (D || loading) return loading || Promise.resolve(D);
    loading = Promise.all([
      fetch("data/epp-studio/roots.json").then(function (r) { return r.json(); }),
      fetch("data/epp-studio/raylib.json").then(function (r) { return r.json(); }).catch(function () { return []; })
    ]).then(function (a) {
      var j = a[0];
      D = { roots: j.words.filter(function (w) { return w.type === "root"; }).map(function (w) { return w.word; }),
            kinds: (j.kinds || []).map(function (k) { return k.word; }),
            special: (j.special || []).map(function (k) { return k.word; }),
            rlFuncs: new Set(a[1].filter(function (x) { return x.kind === "function"; }).map(function (x) { return x.name; })) };
      return D;
    });
    return loading;
  }
  data();

  // ---------- small helpers ----------
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // swapped letters
    }
    return d[m][n];
  }
  // the one nearest word, only when it is clearly the one meant (unique, close for its length)
  function nearest(w, cands) {
    var lim = w.length <= 3 ? 1 : w.length <= 6 ? 2 : 3, best = null, bd = 99, tie = false;
    cands.forEach(function (c) {
      if (c === w || !c) return;
      var dd = lev(w, c);
      if (dd < bd) { bd = dd; best = c; tie = false; } else if (dd === bd && c !== best) tie = true;
    });
    return best && bd <= lim && !tie ? best : null;
  }
  // split a line into its words, keeping quoted text whole; returns {lead, words}
  function words(line) {
    var lead = line.match(/^\s*/)[0], s = line.slice(lead.length), out = [], cur = "", q = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === '"' && s[i - 1] !== "\\") q = !q;
      if (!q && /\s/.test(ch)) { if (cur) { out.push(cur); cur = ""; } continue; }
      cur += ch;
    }
    if (cur) out.push(cur);
    return { lead: lead, words: out };
  }
  // apply f to the parts of s that are outside "quotes" and 'letters'
  function outsideQuotes(s, f) {
    return s.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([^"']+)/g, function (m, q, plain) { return q ? q : f(plain); });
  }
  function allFiles() { try { return window.EppStudio.files(); } catch (e) { return []; } }
  function fileText(name) { var f = allFiles(); for (var i = 0; i < f.length; i++) if (!name || f[i].name === name) return f[i].text; return (f[0] && f[0].text) || ""; }
  // every name the program makes (first word of a line, function/class names, loop counters, choices)
  function madeNames() {
    var s = new Set();
    allFiles().forEach(function (f) {
      f.text.split("\n").forEach(function (ln) {
        var w = words(ln).words; if (w.length !== 3 || w[0] === "note") return;
        if (/^[A-Za-z_]\w*$/.test(w[0]) && D && D.special.indexOf(w[0]) < 0) s.add(w[0]);
        if (w[1] === "den") w[2].split("&").forEach(function (c) { if (/^\w+$/.test(c)) s.add(c); });
      });
    });
    return s;
  }
  var CMP = { "==": "eq", "!=": "ne", "<": "lt", "<=": "le", ">": "gt", ">=": "ge" };

  // ---------- the rules (each returns a list of {name, text[, line]} or nothing) ----------
  var RULES = [
    // x is 6;  ->  x is 6
    function semicolon(d, L) {
      if (!/no semicolons/.test(d.message)) return;
      var t = outsideQuotes(L.text, function (p) { return p.replace(/;+\s*$/, "").replace(/;/g, ""); });
      if (t !== L.text && words(t).words.length === 3) return [{ name: "Take out the semicolon", text: t.replace(/\s+$/, "") }];
    },
    // out prn(x) -> out prn x ;  x is add(1,2) -> x is add&1&2 ;  now ClearBackground(RED) -> now ClearBackground RED
    function brackets(d, L) {
      if (!/no round brackets/.test(d.message)) return;
      var b = L.text.slice(L.lead.length), m;
      if ((m = b.match(/^(\S+) (\S+?)\(([^()\s"]*)\)$/))) {                     // who root(arg)
        var arg = m[3].split(",").join("&");
        if (arg && m[3].split(",").every(function (a) { return /^[\w.@+\-*/]+$/.test(a); })) return [{ name: "Put the value in the third spot", text: L.lead + m[1] + " " + m[2] + " " + arg }];
      }
      if ((m = b.match(/^(\S+) (\S+) ([A-Za-z_]\w*)\(([^()\s"]*)\)$/))) {       // who root f(a,b)
        var args = m[4].split(",");
        if (args.every(function (a) { return /^[\w.@+\-*/]+$/.test(a); })) return [{ name: "Call it with &", text: L.lead + m[1] + " " + m[2] + " " + m[3] + (m[4] ? "&" + args.join("&") : "&") }];
      }
    },
    // x is a + b -> x is a+b   (the extra words are math pieces)
    function mathSpaces(d, L) {
      if (!/Write math with no spaces/.test(d.message)) return;
      var w = L.words; if (w.length < 5) return;
      var rest = w.slice(2);
      var ok = rest.every(function (t, i) { return i % 2 ? /^([+\-*/%]|&&|\|\||[<>]=?|==|!=)$/.test(t) : /^[\w.@&"']+$/.test(t) && !/^([+\-*/%])$/.test(t); }) && rest.length % 2 === 1;
      if (ok) return [{ name: "Write the math as one word", text: L.lead + w[0] + " " + w[1] + " " + rest.join("") }];
    },
    // x is 1,2 -> x is 1&2
    function commas(d, L) {
      if (!/no commas/.test(d.message) || L.words.length !== 3) return;
      var t = outsideQuotes(L.text, function (p) { return p.replace(/,/g, "&"); });
      if (t !== L.text && words(t).words.length === 3) return [{ name: "Use & between the values", text: t }];
    },
    // scores[0] -> scores@0
    function squares(d, L) {
      if (!/no square brackets/.test(d.message)) return;
      var t = outsideQuotes(L.text, function (p) { return p.replace(/([A-Za-z_]\w*)\[([\w+\-*]+)\]/g, "$1@$2"); });
      if (t !== L.text && !/[\[\]]/.test(outsideQuotes(t, function (p) { return p; }).replace(/"[^"]*"/g, "")) && words(t).words.length === 3) return [{ name: "Use @ for the position", text: t }];
    },
    // rex.age -> rex@age (not numbers like 2.5, not inside quotes)
    function dots(d, L) {
      if (!/no dots/.test(d.message)) return;
      var t = outsideQuotes(L.text, function (p) { return p.replace(/([A-Za-z_]\w*)\.([A-Za-z_]\w*)/g, "$1@$2"); });
      if (t !== L.text && words(t).words.length === 3) return [{ name: "Use @ to reach inside", text: t }];
    },
    // ok is 1<x<5 -> ok is 1<x&&x<5
    function chained(d, L) {
      if (!/Compare one pair at a time/.test(d.message) || L.words.length !== 3) return;
      var m = L.words[2].match(/^([\w.@]+)(<=|>=|<|>)([\w.@]+)(<=|>=|<|>)([\w.@]+)$/);
      if (m) return [{ name: "Compare one pair at a time", text: L.lead + L.words[0] + " " + L.words[1] + " " + m[1] + m[2] + m[3] + "&&" + m[3] + m[4] + m[5] }];
    },
    // a tab at the start -> two spaces per tab
    function tabs(d, L) {
      if (!/not a tab/.test(d.message)) return;
      var lead = L.lead.replace(/\t/g, "  ");
      return [{ name: "Indent with two spaces", text: lead + L.text.slice(L.lead.length) }];
    },
    // x = 5 -> x is 5 ;  if x == 5 -> x ieq 5 ;  while x < 3 -> x wlt 3
    function cStyle(d, L) {
      var w = L.words;
      if (w.length === 3 && w[1] === "=" && /isn't a root/.test(d.message)) return [{ name: "Give it a value with is", text: L.lead + w[0] + " is " + w[2] }];
      if (w.length === 4 && /^(if|while)$/.test(w[0]) && CMP[w[2]] && /has 4 words/.test(d.message))
        return [{ name: (w[0] === "if" ? "An if is one root: " : "A while is one root: ") + (w[0] === "if" ? "i" : "w") + CMP[w[2]], text: L.lead + w[1] + " " + (w[0] === "if" ? "i" : "w") + CMP[w[2]] + " " + w[3] }];
    },
    // now BeginDrawing  /  now BeginDrawing&  ->  now BeginDrawing now   (a call with no values)
    function noArgCall(d, L) {
      if (!/has 2 words/.test(d.message) || L.words.length !== 2 || L.words[0] !== "now") return;
      var f = L.words[1].replace(/&$/, "");
      if (!/^[A-Za-z_]\w*$/.test(f)) return;
      var isFn = (D && D.rlFuncs.has(f)) || allFiles().some(function (fl) { return new RegExp("^\\s*" + f + " (dfn|dkn|dvf|dov|dst|dmb) ", "m").test(fl.text); });
      if (isFn) return [{ name: "A call with no values ends in now", text: L.lead + "now " + f + " now" }];
    },
    // the middle word isn't a root: x ad 1 -> x add 1 (only one root is that close)
    function badRoot(d, L) {
      var m = d.message.match(/and (\S+) isn't a root or a function's name/) || d.message.match(/I don't know (\S+)\. The middle word/);
      if (!m || L.words.length !== 3 || L.words[1] !== m[1] || !D) return;
      var fnames = []; allFiles().forEach(function (f) { f.text.replace(/^\s*(\w+) (dfn|dkn|dvf|dov) /gm, function (_, n) { fnames.push(n); }); });
      var near = nearest(m[1], D.roots.concat(fnames));
      if (near) return [{ name: "Did you mean " + near + "?", text: L.lead + L.words[0] + " " + near + " " + L.words[2] }];
    },
    // I don't know totl yet. -> total (the one name you made that is that close)
    function unknownName(d, L) {
      var m = d.message.match(/I don't know (\w+) yet/); if (!m) return;
      var near = nearest(m[1], Array.from(madeNames()));
      if (near) return replaceToken(L, m[1], near, "Did you mean " + near + "?");
    },
    // Mood has no choice hapy. -> happy ;  D has no agee. It has: age. -> age
    function badMember(d, L) {
      var m = d.message.match(/^(\w+) has no choice (\w+)\./), cands = [];
      if (m) {
        var den = fileText().match(new RegExp("^\\s*" + m[1] + " den (\\S+)", "m"));
        if (den) cands = den[1].split("&");
      } else if ((m = d.message.match(/^(\w+) has no (\w+)\. It has: ([\w, &]+)\./))) cands = m[3].split(/[,\s&]+/).filter(Boolean);
      if (!m || !cands.length) return;
      var near = nearest(m[2], cands);
      if (near) return replaceToken(L, m[2], near, "Did you mean " + near + "?", true);
    },
    // "n is "+1 -> "n is "+txt&1  (only when exactly one non-text piece is joined)
    function textJoin(d, L) {
      if (!/A text can be joined with a text or a letter/.test(d.message) || L.words.length !== 3) return;
      var e = L.words[2]; if (/&&|\|\|/.test(e)) return;
      var parts = e.match(/("(?:[^"\\]|\\.)*"|[^+"]+)/g); if (!parts || parts.join("+") !== e) return;
      var bad = parts.filter(function (p) { return p[0] !== '"' && !/^txt&/.test(p); });
      if (bad.length !== 1 || !/^[\w@.]+$/.test(bad[0]) || /[*/\-%]/.test(bad[0])) return;
      var fixed = parts.map(function (p) { return p === bad[0] ? "txt&" + p : p; }).join("+");
      return [{ name: "Turn " + bad[0] + " into text first", text: L.lead + L.words[0] + " " + L.words[1] + " " + fixed }];
    },
    // I don't know the kind nmu. Did you mean num?
    function badKind(d, L) {
      var m = d.message.match(/I don't know the kind (\S+?)\.? Did you mean (\S+?)\?/) || d.message.match(/I don't know the kind (\S+?)\./);
      if (!m || !D) return;
      var near = m[2] || nearest(m[1], D.kinds);
      if (near) return replaceToken(L, m[1], near, "Did you mean " + near + "?", true);
    }
  ];
  // replace one whole word-piece (between separators) in the line, outside quotes; only if it occurs exactly once
  function replaceToken(L, from, to, name, inside) {
    var re = new RegExp((inside ? "(^|[\\s&@*+\\-/<>=!(,])" : "(^|[\\s&@*+\\-/<>=!(,])") + from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w])", "g");
    var count = 0; outsideQuotes(L.text, function (p) { p.replace(re, function () { count++; }); return p; });
    if (count !== 1) return;
    var t = outsideQuotes(L.text, function (p) { return p.replace(re, function (_, pre) { return pre + to; }); });
    return [{ name: name, text: t }];
  }

  function fixesFor(d) {
    if (!d || !d.message || d.lineText == null) return null;
    var L = words(d.lineText); L.text = d.lineText;
    var out = [];
    for (var i = 0; i < RULES.length; i++) {
      var r = null; try { r = RULES[i](d, L); } catch (e) { r = null; }
      if (r && r.length) { r.forEach(function (x) { if (x.text !== d.lineText && !out.some(function (o) { return o.text === x.text; })) out.push({ name: "Fix it: " + x.text.trim(), why: x.name, text: x.text, line: x.line }); }); break; }
    }
    return out.length ? out : null;
  }

  // ---------- console: after Run stops on a mistake, offer the fix there too ----------
  function lineOf(n) { try { var v = window.EppStudio.editor.view; return v.state.doc.line(n).text; } catch (e) { return null; } }
  function replaceLine(n, text) {
    var ed = window.EppStudio.editor, v = ed.view, ln = v.state.doc.line(n);
    v.dispatch({ changes: { from: ln.from, to: ln.to, insert: text }, selection: { anchor: ln.from + text.length }, scrollIntoView: true });
    try { if (ed.relint) ed.relint(); } catch (e) {}
  }
  function offerRun(err) {
    if (!err || !err.line) return;
    var t = lineOf(err.line); if (t == null) return;
    var fx = fixesFor({ line: err.line, message: err.message, lineText: t });
    if (!fx) return;
    var con = document.getElementById("esConsole");
    fx.forEach(function (f) {
      var box = document.createElement("div"); box.className = "es-fix";
      var code = document.createElement("code"); code.textContent = f.text.trim();
      var b = document.createElement("button"); b.type = "button"; b.className = "es-btn es-sm es-fix-btn"; b.textContent = "Fix it";
      var lab = document.createElement("span"); lab.className = "es-fix-lab"; lab.textContent = f.why + " — line " + (f.line || err.line) + " becomes";
      b.addEventListener("click", function () {
        var n = f.line || err.line;
        if (lineOf(n) !== t && !f.line) { box.classList.add("done"); b.textContent = "Line changed"; b.disabled = true; return; }
        replaceLine(n, f.text); b.textContent = "Fixed"; b.disabled = true; box.classList.add("done");
      });
      box.appendChild(lab); box.appendChild(code); box.appendChild(b); con.appendChild(box); con.scrollTop = con.scrollHeight;
    });
  }
  window.EppFixIt = { fixesFor: fixesFor, offerRun: offerRun, ready: data, _rules: RULES.length };
})();
