// qtlayer.cpp — the Web Studio's Qt-compatible layer. NOT real Qt: the Qt phrases of English++ (QtMakeWindow,
// QtAddButton, ...) are drawn as HTML widgets by the page. Real Qt for WebAssembly was not used: its smallest
// app is tens of megabytes of wasm and it needs SharedArrayBuffer/threads headers that the site's static
// hosting can't promise, which is too heavy for a phone tab. The phrases and their meaning are the same.
#include "../src/eh.h"
#include "../src/interp.h"
#include <emscripten.h>
#include <map>
#include <set>

EM_JS(char*, js_qt, (const char* op, const char* id, const char* text, int a, int b), {
  var cmd = { op: UTF8ToString(op), id: UTF8ToString(id), text: UTF8ToString(text) };
  if (cmd.op === "window") { cmd.title = cmd.text; cmd.width = a; cmd.height = b; }
  if (cmd.op === "slider") { cmd.min = a; cmd.max = b; }
  var r = (Module.eppQt ? Module.eppQt(cmd) : null);
  if (r === undefined || r === null) r = "";
  if (r === true) r = "1";
  if (r === false) r = "0";
  return stringToNewUTF8(String(r));
});
EM_ASYNC_JS(char*, js_qt_next, (), {
  var id = Module.eppQtNextEvent ? await Module.eppQtNextEvent() : "";
  if (id === undefined || id === null) id = "";
  return stringToNewUTF8(String(id));
});

namespace epp {
bool WebStopRequested();

static const std::set<std::string> kQt = {"QtMakeWindow","QtAddLabel","QtAddButton","QtAddTextBox","QtAddSlider","QtAddCheckBox",
  "QtTextIn","QtSetLabel","QtSliderValue","QtTicked","QtMessage","QtStart","QtConnectButton"};
static std::map<std::string, Value> g_connected;
static bool g_qtWindow = false;

bool IsQtFunction(const std::string& n) { return g_prog && g_prog->usesQt && kQt.count(n) > 0; }

static std::string Ask(const char* op, const std::string& id = "", const std::string& text = "", int a = 0, int b = 0) {
  char* r = js_qt(op, id.c_str(), text.c_str(), a, b);
  std::string s = r ? r : "";
  free(r);
  return s;
}
static std::string T(const Value& v, const char* fn) {
  const Value& x = (v.k == K::Ptr && v.ik == PK_REF && v.tgt) ? *v.tgt : v;
  if (x.k == K::Str) return x.s;
  if (x.k == K::Chr) return std::string(1, (char)x.i);
  Bad(std::string(fn) + " wants a text here, but this is " + KindWords(x) + ".");
}
static int N(const Value& v, const char* fn) {
  const Value& x = (v.k == K::Ptr && v.ik == PK_REF && v.tgt) ? *v.tgt : v;
  if (x.k == K::Int) return (int)x.i;
  if (x.k == K::Dbl) return (int)x.d;
  Bad(std::string(fn) + " wants a number here, but this is " + KindWords(x) + ".");
}
static void Count(const std::vector<Value>& a, size_t n, const std::string& fn) {
  if (a.size() != n) Bad(fn + " takes " + std::to_string(n) + (n == 1 ? " value" : " values") + ", but it was given " + std::to_string(a.size()) + ".");
}
static void NeedWindow(const std::string& fn) { if (!g_qtWindow) Bad(fn + " needs the window first: now QtMakeWindow \"title\"&480&300."); }

Value CallQt(const std::string& n, std::vector<Value>& a) {
  const char* fn = n.c_str();
  if (n == "QtMakeWindow") { Count(a, 3, n); Ask("window", "", T(a[0], fn), N(a[1], fn), N(a[2], fn)); g_qtWindow = true; g_connected.clear(); return VVoid(); }
  if (n == "QtAddLabel") { Count(a, 2, n); NeedWindow(n); Ask("label", T(a[0], fn), T(a[1], fn)); return VVoid(); }
  if (n == "QtAddButton") { Count(a, 2, n); NeedWindow(n); Ask("button", T(a[0], fn), T(a[1], fn)); return VVoid(); }
  if (n == "QtAddTextBox") { Count(a, 1, n); NeedWindow(n); Ask("textbox", T(a[0], fn)); return VVoid(); }
  if (n == "QtAddSlider") { Count(a, 3, n); NeedWindow(n); Ask("slider", T(a[0], fn), "", N(a[1], fn), N(a[2], fn)); return VVoid(); }
  if (n == "QtAddCheckBox") { Count(a, 2, n); NeedWindow(n); Ask("checkbox", T(a[0], fn), T(a[1], fn)); return VVoid(); }
  if (n == "QtSetLabel") { Count(a, 2, n); NeedWindow(n); Ask("setLabel", T(a[0], fn), T(a[1], fn)); return VVoid(); }
  if (n == "QtMessage") { Count(a, 1, n); Ask("message", "", T(a[0], fn)); return VVoid(); }
  if (n == "QtTextIn") { Count(a, 1, n); NeedWindow(n); return VStr(Ask("getText", T(a[0], fn))); }
  if (n == "QtSliderValue") { Count(a, 1, n); NeedWindow(n); return VInt(std::atoi(Ask("getSlider", T(a[0], fn)).c_str())); }
  if (n == "QtTicked") { Count(a, 1, n); NeedWindow(n); std::string r = Ask("getTicked", T(a[0], fn)); return VBool(r == "1" || r == "true"); }
  if (n == "QtConnectButton") {
    Count(a, 2, n); NeedWindow(n);
    const Value& f = a[1];
    if (f.k != K::Func) Bad("QtConnectButton wants a function as its second value (make one with dlm), but this is " + KindWords(f) + ".");
    g_connected[T(a[0], fn)] = f;
    return VVoid();
  }
  if (n == "QtStart") {
    NeedWindow(n);
    Ask("show");
    g_interp->Flush();
    for (;;) {
      char* r = js_qt_next();
      std::string id = r ? r : "";
      free(r);
      if (id.empty() || WebStopRequested()) break;
      auto it = g_connected.find(id);
      if (it != g_connected.end()) {
        std::vector<Value> none;
        g_interp->CallValue(it->second, none);
        g_interp->Flush();
      }
    }
    Ask("close");
    g_qtWindow = false;
    return VInt(0);
  }
  Bad("Qt has no " + n + " in the Web Studio.");
}
void QtReset() { g_connected.clear(); g_qtWindow = false; }
}  // namespace epp
