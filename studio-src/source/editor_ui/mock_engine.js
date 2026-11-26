/* MOCK English++ engine — for building and testing the Web Studio UI only.
   Same API as ENGINE_API.md (createEppEngine). It is NOT the real engine:
   check = the three-word check only; run = echoes `out prn` lines, keeps
   simple `x is 6` names, asks for `get inp`, fakes a raylib window (2D) and
   a tiny Qt-layer app so the panes can be tested. */
(function () {
  "use strict";
  function words(line) { return line.trim().match(/(?:"(?:[^"\\]|\\.)*"?|[^\s"])+/g) || []; }
  function createEppEngine(o) {
    var stopped = false, fs = {};
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function val(x, vars) {
      if (/^".*"$/.test(x)) return x.slice(1, -1);
      if (/^-?\d+(\.\d+)?$/.test(x)) return x;
      if (x === "yes") return "true"; if (x === "nay") return "false";
      if (Object.prototype.hasOwnProperty.call(vars, x)) return vars[x];
      return x;
    }
    var M = {
      version: "mock-0.1 (UI test only)",
      check: function (src) {
        var errors = [];
        src.split("\n").forEach(function (l, i) {
          var t = l.trim(); if (!t || /^note(\s|$)/.test(t)) return;
          var n = words(l).length;
          if (n !== 3) errors.push({ line: i + 1, message: "A line is exactly three words: who, root, what. (mock check)" });
        });
        return { ok: !errors.length, errors: errors };
      },
      cpp: function (src) {
        return "// Web Studio's C++ view (MOCK)\n#include <iostream>\nint main() {\n" + src.split("\n").map(function (l, i) {
          var w = words(l); if (!w.length) return "";
          if (w[0] === "note") return "  // line " + (i + 1) + "\n  // " + l.trim().slice(5);
          if (w[0] === "out" && w[1] === "prn") return "  // line " + (i + 1) + "\n  std::cout << " + w[2] + " << '\\n';";
          return "  // line " + (i + 1) + "\n  /* " + l.trim() + " */";
        }).filter(Boolean).join("\n") + "\n}\n";
      },
      stop: function () { stopped = true; },
      fsWrite: function (p, t) { fs[p] = String(t); },
      fsRead: function (p) { return Object.prototype.hasOwnProperty.call(fs, p) ? fs[p] : null; },
      fsList: function () { return Object.keys(fs); },
      fsRemove: function (p) { delete fs[p]; },
      run: async function (src) {
        stopped = false;
        var lines = src.split("\n"), vars = {}, raylib = false, qt = false;
        if (/^\s*now\s+xlb\s+raylib/m.test(src)) { raylib = true; o.eppEvent && o.eppEvent({ type: "library", name: "raylib" }); }
        if (/^\s*now\s+xlb\s+qt/mi.test(src)) { qt = true; o.eppEvent && o.eppEvent({ type: "library", name: "qt" }); }
        for (var i = 0; i < lines.length; i++) {
          if (stopped) { o.printErr("Stopped.\n"); o.eppEvent && o.eppEvent({ type: "done", exitCode: 1 }); return { exitCode: 1 }; }
          var w = words(lines[i]); if (!w.length || w[0] === "note") continue;
          o.eppEvent && o.eppEvent({ type: "line", line: i + 1 });
          if (w.length !== 3) { var e = { line: i + 1, message: "A line is exactly three words: who, root, what." }; o.printErr("Line " + (i + 1) + ": " + e.message + "\n"); return { exitCode: 1, error: e }; }
          if (w[1] === "prn") { (w[0] === "err" ? o.printErr : o.print)(w[2].split("&").map(function (x) { return val(x, vars); }).join("") + "\n"); }
          else if (w[1] === "is") vars[w[0]] = val(w[2], vars);
          else if (w[1] === "get" && w[2] === "inp") { var s = await o.eppReadLine(w[0]); if (s == null) { o.printErr("Stopped.\n"); return { exitCode: 1 }; } vars[w[0]] = s; }
          else if (w[1] === "ert" && w[2] === "boom") { var er = { line: i + 1, message: "Something went wrong here (mock runtime error)." }; o.printErr("Line " + (i + 1) + ": " + er.message + "\n"); o.eppEvent && o.eppEvent({ type: "done", exitCode: 1 }); return { exitCode: 1, error: er }; }
          else if (w[1] === "xim") { var f = val(w[2], vars); if (fs[f] == null) { var e2 = { line: i + 1, message: "There is no file called " + f + "." }; o.printErr(e2.message + "\n"); return { exitCode: 1, error: e2 }; } o.print("(mock) included " + f + ", " + fs[f].split("\n").length + " lines\n"); }
          else if (raylib && w[1] === "InitWindow") {
            var a = w[2].split("&"), W = +a[0] || 800, Hh = +a[1] || 450;
            o.eppEvent && o.eppEvent({ type: "window", width: W, height: Hh, title: (a[2] || "").replace(/"/g, "") });
            var c = o.canvas; c.width = W; c.height = Hh; var g = c.getContext("2d"), x = W / 2, y = Hh / 2, keys = {};
            var kd = function (e) { keys[e.keyCode] = 1; }, ku = function (e) { keys[e.keyCode] = 0; };
            window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
            for (var f2 = 0; f2 < 60 * 30 && !stopped && !keys[27]; f2++) {
              if (keys[37] || keys[65]) x -= 4; if (keys[39] || keys[68]) x += 4; if (keys[38] || keys[87]) y -= 4; if (keys[40] || keys[83]) y += 4;
              g.fillStyle = "#081a30"; g.fillRect(0, 0, W, Hh); g.fillStyle = keys[32] ? "#facc15" : "#38bdf8"; g.beginPath(); g.arc(x, y, 30, 0, 7); g.fill();
              g.fillStyle = "#eaf4ff"; g.font = "20px sans-serif"; g.fillText("MOCK raylib window — arrows/WASD move, Space colours, Esc ends", 12, 28);
              await sleep(16);
            }
            window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku);
            o.print("(mock) window closed\n");
          }
          else if (qt && /^Qt/.test(w[1])) {
            var q = w[2].split("&").map(function (x) { return val(x, vars); });
            var map = { QtMakeWindow: { op: "window", title: q[0], width: +q[1], height: +q[2] }, QtAddLabel: { op: "label", id: q[0], text: q[1] }, QtAddButton: { op: "button", id: q[0], text: q[1] },
              QtAddTextBox: { op: "textbox", id: q[0] }, QtAddSlider: { op: "slider", id: q[0], min: +q[1], max: +q[2] }, QtAddCheckBox: { op: "checkbox", id: q[0], text: q[1] }, QtMessage: { op: "message", text: q[0] }, QtSetLabel: { op: "setLabel", id: q[0], text: q[1] } };
            if (map[w[1]]) o.eppQt(map[w[1]]);
            if (w[1] === "QtStart") {
              o.eppQt({ op: "show" });
              while (!stopped) {
                var id = await o.eppQtNextEvent(); if (!id) break;
                o.eppQt({ op: "setLabel", id: "out", text: "You clicked " + id + "; text box says: " + o.eppQt({ op: "getText", id: "name" }) + "; slider " + o.eppQt({ op: "getSlider", id: "s" }) + "; ticked " + o.eppQt({ op: "getTicked", id: "c" }) });
                o.print("(mock) clicked " + id + "\n");
              }
              o.eppQt({ op: "close" });
            }
          }
          await sleep(0);
        }
        o.eppEvent && o.eppEvent({ type: "done", exitCode: 0 });
        return { exitCode: 0 };
      }
    };
    return new Promise(function (r) { setTimeout(function () { r(M); }, 300); });
  }
  window.createEppEngine = createEppEngine;
})();
