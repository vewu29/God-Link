// wasm_api.cpp — the engine's face to the Web Studio page (see ENGINE_API.md).
#include "../src/eh.h"
#include "../src/interp.h"
#include "../src/debug.h"
#include <emscripten.h>
#include <emscripten/html5.h>
#include <string>

EM_JS(void, js_print, (const char* s, int len, int isErr), {
  var t = UTF8ToString(s, len);
  if (isErr) { if (Module.printErr) Module.printErr(t); }
  else if (Module.print) Module.print(t);
});
EM_JS(void, js_event, (const char* json), {
  if (Module.eppEvent) { try { Module.eppEvent(JSON.parse(UTF8ToString(json))); } catch (e) { console.error(e); } }
});
EM_ASYNC_JS(char*, js_read_line, (const char* prompt), {
  var r = Module.eppReadLine ? await Module.eppReadLine(UTF8ToString(prompt)) : null;
  if (r === null || r === undefined) return 0;
  return stringToNewUTF8(String(r));
});
EM_ASYNC_JS(void, js_sleep, (int ms), {
  await new Promise(function (res) { setTimeout(res, ms); });
});
// wait for the next screen frame (or more, when the game asked for a lower frame rate)
EM_ASYNC_JS(void, js_wait_frame, (double minMs), {
  var start = Module.__eppLastFrame || 0;
  await new Promise(function (res) {
    function tick(t) {
      if (Module.__eppStop || !start || t - start >= minMs - 2) { Module.__eppLastFrame = t; res(); }
      else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
});
EM_ASYNC_JS(void, js_yield, (), {
  await new Promise(function (res) { setTimeout(res, 0); });
});
// v4 debugger: the program stopped on a line (a breakpoint or a step). The page answers what to do next.
EM_ASYNC_JS(int, js_debug_pause, (const char* json), {
  var info = JSON.parse(UTF8ToString(json));
  if (Module.__eppStop) return 5;
  var a = Module.__eppDbgPause ? await Module.__eppDbgPause(info) : "continue";
  if (Module.__eppStop) return 5;
  return ({ step: 1, into: 1, over: 2, out: 3, "continue": 0, stop: 5 })[a] || 0;
});
EM_JS(int, js_stop_flag, (), { return Module.__eppStop ? 1 : 0; });
EM_JS(double, js_now, (), { return performance.now(); });

namespace epp {
void QtReset();
void WebEvent(const std::string& json) { js_event(json.c_str()); }
bool WebStopRequested() { return js_stop_flag() != 0; }
static double g_lastYield = 0;
static bool g_frames = false;   // a raylib window is drawing frames: the frame wait already lets the page breathe
void WebWaitFrame(double fps) {
  if (g_interp) g_interp->Flush();
  js_wait_frame(fps > 0 ? 1000.0 / fps : 0);
  g_frames = true;
  g_lastYield = js_now();        // a fresh frame just started: never break it up halfway (that was the canvas blink)
}

__attribute__((weak)) std::string ToCpp(const std::string&) { return "// The C++ View is not in this build yet.\n"; }

static std::string Json(const std::string& s) {
  std::string o = "\"";
  for (unsigned char c : s) {
    switch (c) {
      case '"': o += "\\\""; break;
      case '\\': o += "\\\\"; break;
      case '\n': o += "\\n"; break;
      case '\r': o += "\\r"; break;
      case '\t': o += "\\t"; break;
      default:
        if (c < 32) { char b[8]; snprintf(b, sizeof b, "\\u%04x", c); o += b; }
        else o += (char)c;
    }
  }
  return o + "\"";
}
static std::string g_ret;
static bool g_busy = false;   // a program is running: checks wait, so they can't disturb its kinds and classes

static void SetupHost() {
  g_host.out = [](const std::string& s) { js_print(s.data(), (int)s.size(), 0); };
  g_host.err = [](const std::string& s) { js_print(s.data(), (int)s.size(), 1); };
  g_host.readLine = [](const std::string& prompt, std::string& line) {
    char* r = js_read_line(prompt.c_str());
    if (!r) return false;
    line = r; free(r);
    if (!line.empty() && line.back() == '\n') line.pop_back();
    return true;
  };
  g_host.sleep = [](int ms) { if (g_interp) g_interp->Flush(); js_sleep(ms < 0 ? 0 : ms); g_lastYield = js_now(); };
  g_host.stopRequested = [] { return js_stop_flag() != 0; };
  g_host.yield = [] {
    double t = js_now();
    if (t - g_lastYield > (g_frames ? 1000 : 40)) {      // keep the page alive during long loops; mid-frame only if a frame is stuck for a second
      if (g_interp) g_interp->Flush();
      js_yield();
      g_lastYield = js_now();
    }
  };
  g_host.event = [](const std::string& j) { js_event(j.c_str()); };
  g_host.debugPause = [](const std::string& j) {
    int a = js_debug_pause(j.c_str());
    g_lastYield = js_now();       // the pause was the page's turn: the line after it starts fresh (no extra mid-frame yield)
    return a;
  };
}
}  // namespace epp

using namespace epp;
extern "C" {
EMSCRIPTEN_KEEPALIVE const char* epp_check(const char* src) {
  if (g_busy) { g_ret = "{\"ok\":true,\"errors\":[],\"busy\":true}"; return g_ret.c_str(); }
  CheckResult r = Check(src);
  std::string o = "{\"ok\":" + std::string(r.errors.empty() ? "true" : "false") + ",\"errors\":[";
  for (size_t k = 0; k < r.errors.size(); ++k) {
    if (k) o += ",";
    o += "{\"line\":" + std::to_string(r.errors[k].line) + ",\"message\":" + Json(r.errors[k].msg) + ",\"file\":" + Json(r.errors[k].file) + "}";
  }
  g_ret = o + "]}";
  return g_ret.c_str();
}
EMSCRIPTEN_KEEPALIVE const char* epp_cpp(const char* src) {
  if (g_busy) { g_ret = "// The C++ View is made when the program isn't running. Press Stop, then look again.\n"; return g_ret.c_str(); }
  std::string out;
  Caught c = Protect([&] { out = ToCpp(src); });
  if (c.k == CK_PROBLEM) out = "// line " + std::to_string(c.p.line) + ": " + c.p.msg + "\n";
  else if (c.k != CK_NONE) out = "// The C++ View stopped on this program.\n";
  g_ret = out;
  return g_ret.c_str();
}
EMSCRIPTEN_KEEPALIVE const char* epp_run(const char* src) {
  SetupHost();
  g_lastYield = js_now(); g_frames = false;
  std::string s = src;
  Problem p{"", 0, ""};
  QtReset();
  // the page shows the right pane before the program starts
  {
    bool rl = s.find("xlb raylib") != std::string::npos || s.find("\"raylib.h\"") != std::string::npos;
    bool qt = s.find("xlb qt") != std::string::npos;
    if (rl) WebEvent("{\"type\":\"library\",\"name\":\"raylib\"}");
    if (qt) WebEvent("{\"type\":\"library\",\"name\":\"qt\"}");
  }
  g_busy = true;
  int code = RunProgram(s, &p);
  g_busy = false;
  DebugReset();
  NativeReset();
  if (code == -1 || code == -2) {
    if (code == -1) { std::string m = "line " + std::to_string(p.line) + ": " + p.msg + "\n"; js_print(m.c_str(), (int)m.size(), 1); }
    g_ret = "{\"exitCode\":1,\"error\":{\"line\":" + std::to_string(p.line) + ",\"message\":" + Json(p.msg) + ",\"stopped\":" + (code == -2 ? "true" : "false") + "}}";
  } else {
    g_ret = "{\"exitCode\":" + std::to_string(code) + "}";
  }
  WebEvent("{\"type\":\"done\",\"exitCode\":" + std::to_string(code < 0 ? 1 : code) + "}");
  return g_ret.c_str();
}
// v4 debugger (ENGINE_API_V4.md)
EMSCRIPTEN_KEEPALIVE void epp_dbg_breakpoints(const char* spec) { DebugSetBreakpoints(spec); }
EMSCRIPTEN_KEEPALIVE void epp_dbg_attach(int on, int pauseAtStart) {
  g_dbg.on = on != 0; g_dbg.mode = on && pauseAtStart ? DBG_INTO : DBG_RUN; g_dbg.depth = 0; g_dbg.where.clear();
}
EMSCRIPTEN_KEEPALIVE const char* epp_dbg_frame(int frame) {
  g_ret = (g_interp && g_dbg.paused) ? DebugFrameJson(*g_interp, frame) : std::string("[]");
  return g_ret.c_str();
}
EMSCRIPTEN_KEEPALIVE void epp_fs_write(const char* path, const char* text) { g_disk.files[path] = text; }
EMSCRIPTEN_KEEPALIVE const char* epp_fs_read(const char* path) {
  auto it = g_disk.files.find(path);
  if (it == g_disk.files.end()) return nullptr;
  g_ret = it->second;
  return g_ret.c_str();
}
EMSCRIPTEN_KEEPALIVE const char* epp_fs_list() {
  std::string o = "[";
  bool first = true;
  for (auto& f : g_disk.files) { if (!first) o += ","; first = false; o += Json(f.first); }
  g_ret = o + "]";
  return g_ret.c_str();
}
EMSCRIPTEN_KEEPALIVE void epp_fs_remove(const char* path) { g_disk.files.erase(path); }
}
