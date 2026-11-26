// native.cpp — raylib 5.5 inside the Web Studio engine.
// Every raylib struct is kept as its real bytes (NativeObj), so a Vector3 or Camera3D handed to raylib is the
// exact C struct; fields are read and written at their real offsets. Function thunks come from raylib's own
// API description (gen/gen_raylib.py -> raylib_gen.inc). Only a few calls are hand-written so a game loop can
// share the phone's browser: WindowShouldClose, EndDrawing (waits for the next screen frame), SetTargetFPS.
#include "../src/eh.h"
#include "raylib.h"
#include "raymath.h"
#include "rlgl.h"
#include <emscripten.h>
#include <cstddef>
#include <cstring>
#include <map>
#include <unordered_map>

namespace epp {

enum FieldKind { FK_F32, FK_I32, FK_U32, FK_U8, FK_BOOL, FK_STRUCT, FK_OTHER };
struct NativeType;
struct NField { const char* name; int off; int kind; NativeType* nt; const char* ctype = nullptr; };
struct NativeType { std::string name; int size; std::vector<NField> fields; mutable const Type* ty = nullptr; };

static std::unordered_map<std::string, NativeType*> g_types;
static std::unordered_map<std::string, Value> g_consts;
using Thunk = Value (*)(std::vector<Value>&, std::vector<Value*>&);
static std::unordered_map<std::string, Thunk> g_funcs;
static std::unordered_map<std::string, std::string> g_refused;

// hooks into the page (wasm_api.cpp)
void WebEvent(const std::string& json);
void WebWaitFrame(double targetFps);
bool WebStopRequested();

static bool Active() { return g_prog && g_prog->usesRaylib; }

static const Type* TypeOfNative(const NativeType* nt) {
  if (!nt->ty) {
    Type* t = new Type();
    t->text = nt->name; t->head = nt->name; t->nat = nt;
    nt->ty = t;
  }
  return nt->ty;
}
static Value MakeNativeBytes(const NativeType* nt, const void* p) {
  Value v; v.k = K::Native;
  auto o = std::make_shared<NativeObj>();
  o->nt = nt; o->bytes.assign((const unsigned char*)p, (const unsigned char*)p + nt->size);
  v.h = o; v.t = TypeOfNative(nt);
  return v;
}
template <class T> static Value MakeNative(const NativeType* nt, const T& x) { return MakeNativeBytes(nt, &x); }
static Value MakeColor(int r, int g, int b, int a) { Color c{(unsigned char)r, (unsigned char)g, (unsigned char)b, (unsigned char)a}; return MakeNative(&*g_types.at("Color"), c); }

// ---- English++ values -> C values (like C++'s own conversions at a call)
static double Num(const Value& v, const char* want) {
  switch (v.k) {
    case K::Int: case K::Enum: return (double)v.i;
    case K::Dbl: return v.d;
    case K::Bool: return v.i ? 1 : 0;
    case K::Chr: return (double)(unsigned char)v.i;
    case K::Ptr: if (v.ik == PK_REF && v.tgt) return Num(*v.tgt, want); break;
    default: break;
  }
  Bad(std::string("raylib wants ") + want + " here, but this is " + KindWords(v) + ".");
}
static int I32(const Value& v) { return (int)(int64_t)Num(v, "a whole number"); }
static unsigned U32(const Value& v) { return (unsigned)(int64_t)Num(v, "a whole number"); }
static long I64(const Value& v) { return (long)(int64_t)Num(v, "a whole number"); }
static unsigned short U16(const Value& v) { return (unsigned short)(int64_t)Num(v, "a whole number"); }
static unsigned char U8(const Value& v) { return (unsigned char)(int64_t)Num(v, "a whole number"); }
static char CHR(const Value& v) { return (char)(int64_t)Num(v, "a letter"); }
static bool BOOL(const Value& v) { return Num(v, "yes or nay") != 0; }
static float F32(const Value& v) { return (float)Num(v, "a number"); }
static double F64(const Value& v) { return Num(v, "a number"); }
static std::string TXT(const Value& v) {
  if (v.k == K::Str) return v.s;
  if (v.k == K::Ptr && v.ik == PK_REF && v.tgt) return TXT(*v.tgt);
  if (v.k == K::Chr) return std::string(1, (char)v.i);
  Bad("raylib wants a text here, but this is " + KindWords(v) + ".");
}
static const Value& Real(const Value& v) { return (v.k == K::Ptr && v.ik == PK_REF && v.tgt) ? *v.tgt : v; }
static NativeObj* AsNative(const Value& v0, const NativeType* nt) {
  const Value& v = Real(v0);
  if (v.k != K::Native) Bad("raylib wants a " + nt->name + " here, but this is " + KindWords(v) + ".");
  auto* o = static_cast<NativeObj*>(v.h.get());
  if (o->nt != nt) Bad("raylib wants a " + nt->name + " here, but this is a " + o->nt->name + ".");
  return o;
}
template <class T> static T ST(const Value& v, const NativeType* nt) { T x; std::memcpy(&x, AsNative(v, nt)->bytes.data(), sizeof(T)); return x; }
// a pointer parameter: one struct (changed in place) or a list of them
template <class T> static T* ARR(Value& v0, const NativeType* nt, std::vector<T>& store) {
  Value& v = (v0.k == K::Ptr && v0.ik == PK_REF && v0.tgt) ? *v0.tgt : v0;
  if (v.k == K::Native) return reinterpret_cast<T*>(AsNative(v, nt)->bytes.data());
  if (v.k == K::Coll) {
    auto* c = static_cast<Coll*>(v.h.get());
    store.resize(c->items.size());
    for (size_t k = 0; k < c->items.size(); ++k) std::memcpy(&store[k], AsNative(c->items[k], nt)->bytes.data(), sizeof(T));
    return store.data();
  }
  Bad("raylib wants a " + nt->name + " (or a list of them) here, but this is " + KindWords(v) + ".");
}
template <class T> static void ArrBack(Value& v0, const NativeType* nt, std::vector<T>& store) {
  Value& v = (v0.k == K::Ptr && v0.ik == PK_REF && v0.tgt) ? *v0.tgt : v0;
  if (v.k != K::Coll) return;
  auto* c = static_cast<Coll*>(v.h.get());
  for (size_t k = 0; k < c->items.size() && k < store.size(); ++k)
    std::memcpy(static_cast<NativeObj*>(c->items[k].h.get())->bytes.data(), &store[k], sizeof(T));
}
template <class T> static void OutBack(Value* place, T x) {
  if (!place) return;
  Value* p = (place->k == K::Ptr && place->ik == PK_REF && place->tgt) ? place->tgt : place;
  if (p->k == K::Int) p->i = (int64_t)x;
  else if (p->k == K::Dbl) p->d = (double)x;
  else if (p->k == K::Bool) p->i = x ? 1 : 0;
}
static void Need(const std::vector<Value>& a, size_t n, const char* name) {
  if (a.size() != n) Bad(std::string(name) + " takes " + std::to_string(n) + (n == 1 ? " value" : " values") + ", but it was given " + std::to_string(a.size()) + ".");
}
// files a program loads (LoadTexture "car.png") come from the Web Studio's disk
static void SyncFile(const std::string& name) {
  auto it = g_disk.files.find(name);
  if (it == g_disk.files.end()) return;
  FILE* f = fopen(name.c_str(), "wb");
  if (!f) return;
  fwrite(it->second.data(), 1, it->second.size(), f);
  fclose(f);
}

// ---- the hand-written calls
static double g_targetFps = 60;
static bool g_windowOpen = false;
static Value fn_custom_InitWindow(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 3, "InitWindow");
  int w = I32(a[0]), h = I32(a[1]); std::string t = TXT(a[2]);
  if (g_windowOpen) Bad("The window is already open. Call InitWindow once.");
  std::string esc;
  for (char c : t) { if (c == '"' || c == '\\') esc += '\\'; if ((unsigned char)c >= 32) esc += c; }
  WebEvent("{\"type\":\"window\",\"width\":" + std::to_string(w) + ",\"height\":" + std::to_string(h) + ",\"title\":\"" + esc + "\"}");
  SetTraceLogLevel(LOG_WARNING);
  ::InitWindow(w, h, t.c_str());
  ::SetTargetFPS(0);            // the screen's own frame clock paces the game (see EndDrawing)
  g_windowOpen = true;
  return VVoid();
}
static Value fn_custom_CloseWindow(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 0, "CloseWindow");
  if (g_windowOpen) { ::CloseWindow(); g_windowOpen = false; }
  return VVoid();
}
static Value fn_custom_WindowShouldClose(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 0, "WindowShouldClose");
  return VBool(WebStopRequested());
}
static Value fn_custom_EndDrawing(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 0, "EndDrawing");
  ::EndDrawing();
  WebWaitFrame(g_targetFps);
  return VVoid();
}
static Value fn_custom_SetTargetFPS(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 1, "SetTargetFPS");
  int f = I32(a[0]);
  g_targetFps = f <= 0 ? 0 : f;
  return VVoid();
}
static Value fn_custom_GetFPS(std::vector<Value>& a, std::vector<Value*>&) { Need(a, 0, "GetFPS"); return VInt(::GetFPS()); }
static Value fn_custom_WaitTime(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 1, "WaitTime");
  double s = F64(a[0]);
  if (s > 0) emscripten_sleep((unsigned)(s * 1000));
  return VVoid();
}
#define REFUSE_FN(N, WHY) static Value fn_custom_##N(std::vector<Value>&, std::vector<Value*>&) { NotYet(std::string(#N) + " (" WHY ")"); }
REFUSE_FN(OpenURL, "opening other pages")
REFUSE_FN(TakeScreenshot, "saving screenshots")
REFUSE_FN(ToggleFullscreen, "use the Full screen button")
REFUSE_FN(ToggleBorderlessWindowed, "use the Full screen button")
REFUSE_FN(MaximizeWindow, "a phone page can't resize its window")
REFUSE_FN(MinimizeWindow, "a phone page can't resize its window")
REFUSE_FN(SetWindowSize, "a phone page can't resize its window")
REFUSE_FN(EnableEventWaiting, "event waiting")
REFUSE_FN(DisableEventWaiting, "event waiting")
static Value fn_custom_SetTraceLogLevel(std::vector<Value>& a, std::vector<Value*>&) { Need(a, 1, "SetTraceLogLevel"); ::SetTraceLogLevel(I32(a[0])); return VVoid(); }
static Value fn_custom_SetWindowTitle(std::vector<Value>& a, std::vector<Value*>&) {
  Need(a, 1, "SetWindowTitle");
  std::string t = TXT(a[0]), esc;
  for (char c : t) { if (c == '"' || c == '\\') esc += '\\'; if ((unsigned char)c >= 32) esc += c; }
  WebEvent("{\"type\":\"title\",\"title\":\"" + esc + "\"}");
  return VVoid();
}

#include "raylib_gen.inc"

static bool g_ready = false;
static void Ready() {
  if (g_ready) return;
  g_ready = true;
  RegisterTypes(); RegisterConstants(); RegisterFunctions();
}

// ---- the engine's side (declared in interp.h)
std::string NativeShow(const Value& v) {
  auto* o = static_cast<NativeObj*>(v.h.get());
  Bad("A raylib " + o->nt->name + " can't be printed as it is (C++ can't print it either). Print its parts, like v@x.");
}
Value NativeDefault(const NativeType* nt) {
  std::vector<unsigned char> z(nt->size, 0);
  return MakeNativeBytes(nt, z.data());
}
Value NativeConvert(const Value& v0, const NativeType* nt) {
  const Value& v = Real(v0);
  if (v.k == K::Native && static_cast<NativeObj*>(v.h.get())->nt == nt) {
    Value r = v; r.h = std::make_shared<NativeObj>(*static_cast<NativeObj*>(v.h.get())); return r;
  }
  Bad("A " + nt->name + " can only hold a " + nt->name + ", but this is " + KindWords(v) + ".");
}
const NativeType* FindNativeType(const std::string& n) {
  if (!Active()) return nullptr;
  Ready();
  auto it = g_types.find(n);
  return it == g_types.end() ? nullptr : it->second;
}
bool IsNativeFunction(const std::string& n) {
  if (!Active()) return false;
  Ready();
  return g_funcs.count(n) || g_refused.count(n) || g_types.count(n);
}
bool IsNativeConstant(const std::string& n) {
  if (!Active()) return false;
  Ready();
  return g_consts.count(n) > 0;
}
Value NativeConstant(const std::string& n) {
  Ready();
  Value v = g_consts.at(n);
  if (v.k == K::Native) { v.h = std::make_shared<NativeObj>(*static_cast<NativeObj*>(v.h.get())); }
  return v;
}
// a struct made like C++ makes one: Vector3&0.0&1.0&0.0 fills the fields in order
static Value BuildStruct(const NativeType* nt, std::vector<Value>& args) {
  if (args.size() > nt->fields.size()) Bad(nt->name + " has " + std::to_string(nt->fields.size()) + " parts, but it was given " + std::to_string(args.size()) + ".");
  Value v = NativeDefault(nt);
  auto* o = static_cast<NativeObj*>(v.h.get());
  for (size_t k = 0; k < args.size(); ++k) {
    const NField& f = nt->fields[k];
    unsigned char* p = o->bytes.data() + f.off;
    switch (f.kind) {
      case FK_F32: { float x = F32(args[k]); std::memcpy(p, &x, 4); break; }
      case FK_I32: { int x = I32(args[k]); std::memcpy(p, &x, 4); break; }
      case FK_U32: { unsigned x = U32(args[k]); std::memcpy(p, &x, 4); break; }
      case FK_U8: { *p = U8(args[k]); break; }
      case FK_BOOL: { *p = BOOL(args[k]) ? 1 : 0; break; }
      case FK_STRUCT: { auto* s = AsNative(args[k], f.nt); std::memcpy(p, s->bytes.data(), f.nt->size); break; }
      default: NotYet(nt->name + "'s part " + f.name + " (" + (f.ctype ? f.ctype : "?") + ")");
    }
  }
  return v;
}
Value CallNative(const std::string& n, std::vector<Value>& args, std::vector<Value*>& refs) {
  Ready();
  auto t = g_types.find(n);
  if (t != g_types.end()) return BuildStruct(t->second, args);
  auto f = g_funcs.find(n);
  if (f != g_funcs.end()) {
    refs.resize(args.size(), nullptr);
    return f->second(args, refs);
  }
  auto r = g_refused.find(n);
  if (r != g_refused.end()) NotYet("raylib's " + n + " (it uses " + r->second + ")");
  Bad("raylib has no " + n + ".");
}
static const NField* FindField(const NativeType* nt, const std::string& name) {
  for (auto& f : nt->fields) if (name == f.name) return &f;
  return nullptr;
}
static std::string FieldList(const NativeType* nt) {
  std::string s;
  for (auto& f : nt->fields) { if (!s.empty()) s += ", "; s += f.name; }
  return s;
}
static Value ReadField(const unsigned char* p, const NField& f, const NativeType* owner) {
  switch (f.kind) {
    case FK_F32: { float x; std::memcpy(&x, p, 4); return VDbl(x, 1); }
    case FK_I32: { int x; std::memcpy(&x, p, 4); return VInt(x); }
    case FK_U32: { unsigned x; std::memcpy(&x, p, 4); return VInt(x); }
    case FK_U8: return VInt(*p);
    case FK_BOOL: return VBool(*p != 0);
    case FK_STRUCT: return MakeNativeBytes(f.nt, p);
    default: NotYet(owner->name + "'s part " + f.name + " (" + (f.ctype ? f.ctype : "?") + ")");
  }
}
bool NativeHasField(const Value& v, const std::string& field) {
  auto* o = static_cast<NativeObj*>(Real(v).h.get());
  return FindField(o->nt, field) != nullptr;
}
Value NativeGetField(const Value& v0, const std::string& field) {
  const Value& v = Real(v0);
  auto* o = static_cast<NativeObj*>(v.h.get());
  const NField* f = FindField(o->nt, field);
  if (!f) Bad(o->nt->name + " has no " + field + ". It has: " + FieldList(o->nt) + ".");
  return ReadField(o->bytes.data() + f->off, *f, o->nt);
}
Value* NativeField(Value&, const std::string&) { return nullptr; }
// path is "fovy" or "position.x"
void NativeStore(Value& sv, const std::string& path, const Value& val) {
  Value& v = (sv.k == K::Ptr && sv.ik == PK_REF && sv.tgt) ? *sv.tgt : sv;
  auto* o = static_cast<NativeObj*>(v.h.get());
  const NativeType* nt = o->nt;
  unsigned char* p = o->bytes.data();
  size_t start = 0;
  for (;;) {
    size_t dot = path.find('.', start);
    std::string part = path.substr(start, dot == std::string::npos ? std::string::npos : dot - start);
    const NField* f = FindField(nt, part);
    if (!f) Bad(nt->name + " has no " + part + ". It has: " + FieldList(nt) + ".");
    p += f->off;
    if (dot == std::string::npos) {
      switch (f->kind) {
        case FK_F32: { float x = F32(val); std::memcpy(p, &x, 4); return; }
        case FK_I32: { int x = I32(val); std::memcpy(p, &x, 4); return; }
        case FK_U32: { unsigned x = U32(val); std::memcpy(p, &x, 4); return; }
        case FK_U8: { *p = U8(val); return; }
        case FK_BOOL: { *p = BOOL(val) ? 1 : 0; return; }
        case FK_STRUCT: { auto* s = AsNative(val, f->nt); std::memcpy(p, s->bytes.data(), f->nt->size); return; }
        default: NotYet(nt->name + "'s part " + f->name + " (" + (f->ctype ? f->ctype : "?") + ")");
      }
    }
    if (f->kind != FK_STRUCT) Bad(nt->name + "@" + part + " is a number, so it has no parts.");
    nt = f->nt;
    start = dot + 1;
  }
}
void NativeReset() {
  if (g_windowOpen) { ::CloseWindow(); g_windowOpen = false; }
  g_targetFps = 60;
}

}  // namespace epp
