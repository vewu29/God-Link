// debug.cpp — the Web Studio debugger (v4). It only LOOKS at a running program: it never changes a value,
// a kind, the output, or what any English++ line means. When no debugger is attached the only cost is one
// test of g_dbg.on per line (see Interp::Exec).
#include "eh.h"
#include "debug.h"
#include <unordered_set>

namespace epp {

DebugState g_dbg;

void DebugReset() {
  g_dbg.on = false; g_dbg.mode = DBG_RUN; g_dbg.depth = 0; g_dbg.where.clear(); g_dbg.paused = false;
}
void DebugSetBreakpoints(const std::string& spec) {
  // spec: one "file<TAB>line" per line; file "" = the main file
  g_dbg.bps.clear();
  size_t a = 0;
  while (a < spec.size()) {
    size_t e = spec.find('\n', a); if (e == std::string::npos) e = spec.size();
    std::string row = spec.substr(a, e - a); a = e + 1;
    size_t t = row.find('\t'); if (t == std::string::npos) continue;
    int line = atoi(row.c_str() + t + 1);
    if (line > 0) g_dbg.bps[row.substr(0, t)].insert(line);
  }
  g_dbg.anyBp = !g_dbg.bps.empty();
}

// ---------------------------------------------------------------- the snapshot (JSON)
static void J(std::string& o, const std::string& s) {
  o += '"';
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
  o += '"';
}
// keep a shown value short, without cutting a UTF-8 letter in half
static std::string Cut(const std::string& s, size_t n) {
  if (s.size() <= n) return s;
  size_t k = n; while (k > 0 && ((unsigned char)s[k] & 0xC0) == 0x80) --k;
  return s.substr(0, k) + "…";
}
// Show() refuses some values (a raylib Camera3D "can't be printed as it is"): the panel then says so instead of stopping the program
static std::string SafeShow(const Value& v) {
  try { return Show(v); }
  catch (const Problem& p) { return "(can't be printed as it is)"; }
  catch (...) { return "(can't be shown)"; }
}
static const size_t kItems = 100;   // first N items of a list / map / set
static const int kDepth = 3;        // how deep the panel can open things
struct Budget { int nodes = 3000; };

static std::unordered_set<const Value*> g_live;   // every slot the program can still reach (for raw pointers)

static void Node(std::string& o, const std::string& name, const Value& v0, int depth, Budget& b);
static void Kids(std::string& o, const Value& v, int depth, Budget& b, size_t& count) {
  o += ",\"kids\":[";
  bool first = true;
  auto add = [&](const std::string& n, const Value& x) { if (!first) o += ','; first = false; Node(o, n, x, depth + 1, b); };
  switch (v.k) {
    case K::Coll: {
      auto* c = static_cast<Coll*>(v.h.get());
      std::string h = v.t ? v.t->head : "vec";
      if (h == "map" || h == "hsh") {
        count = c->m.size(); size_t k = 0;
        if (h == "hsh") { for (auto& key : c->order) { if (k++ >= kItems || b.nodes <= 0) break; auto it = c->m.find(key); if (it != c->m.end()) add(SafeShow(key), it->second); } }
        else for (auto& kv : c->m) { if (k++ >= kItems || b.nodes <= 0) break; add(SafeShow(kv.first), kv.second); }
      } else if (h == "set" || h == "bag") {
        size_t k = 0;
        if (h == "bag") { count = c->order.size(); for (auto& key : c->order) { if (k++ >= kItems || b.nodes <= 0) break; add("", key); } }
        else { count = c->m.size(); for (auto& kv : c->m) { if (k++ >= kItems || b.nodes <= 0) break; add("", kv.first); } }
      } else {
        count = c->items.size();
        for (size_t k = 0; k < c->items.size() && k < kItems && b.nodes > 0; ++k) add(std::to_string(k), c->items[k]);
      }
      break;
    }
    case K::Tup: {
      auto* t = static_cast<TupObj*>(v.h.get()); count = t->items.size();
      for (size_t k = 0; k < t->items.size() && b.nodes > 0; ++k) add(std::to_string(k), t->items[k]);
      break;
    }
    case K::Obj: {
      auto* ob = static_cast<Obj*>(v.h.get()); count = ob->cls->all.size();
      for (size_t k = 0; k < ob->cls->all.size() && k < ob->f.size() && b.nodes > 0; ++k) {
        auto& fi = ob->cls->all[k].first->own[ob->cls->all[k].second];
        add(fi.name, ob->f[k]);
      }
      break;
    }
    default: break;
  }
  o += "]";
}
static bool Openable(const Value& v) { return v.k == K::Coll || v.k == K::Tup || v.k == K::Obj; }
static void Node(std::string& o, const std::string& name, const Value& v0, int depth, Budget& b) {
  --b.nodes;
  const Value* vp = &v0;
  std::string pre;
  if (v0.k == K::Ptr) {   // show what a pointer points at, but only when that place is still alive
    if (v0.ik == PK_REF && v0.tgt && g_live.count(v0.tgt)) vp = v0.tgt;
    else if ((v0.ik == PK_OWN || v0.ik == PK_SHR) && v0.h) { auto* bx = static_cast<BoxObj*>(v0.h.get()); if (!bx->dead) { vp = &bx->v; pre = "→ "; } }
    else if (v0.ik == PK_RAW && v0.tgt && g_live.count(v0.tgt)) { vp = v0.tgt; pre = "→ "; }
  }
  const Value& v = *vp;
  o += "{\"n\":"; J(o, name);
  o += ",\"k\":"; J(o, KindWords(v0));
  std::string shown = v.k == K::Void ? "" : (v.k == K::Nil ? "nil" : SafeShow(v));
  o += ",\"v\":"; J(o, pre + Cut(shown, 400));
  if (v.k == K::Str) o += ",\"t\":1";   // text (the panel shows it as printed, with a quiet marker for empty text)
  if (Openable(v)) {
    size_t count = 0;
    if (depth < kDepth && b.nodes > 0) Kids(o, v, depth, b, count);
    else {
      if (v.k == K::Coll) { auto* c = static_cast<Coll*>(v.h.get()); std::string h = v.t ? v.t->head : "vec"; count = (h == "map" || h == "hsh" || h == "set") ? c->m.size() : h == "bag" ? c->order.size() : c->items.size(); }
      else if (v.k == K::Tup) count = static_cast<TupObj*>(v.h.get())->items.size();
      else count = static_cast<Obj*>(v.h.get())->cls->all.size();
      o += ",\"more\":1";
    }
    o += ",\"count\":" + std::to_string(count);
  }
  o += "}";
}
static bool Shown(int id) {
  if (id < 0) return false;
  const std::string& n = NameOf(id);
  return !n.empty() && (isalpha((unsigned char)n[0]) || n[0] == '_');
}
static std::string FrameName(Interp& I, size_t k) {
  if (k == 0) return "main";
  FuncInfo* f = I.frames[k].fn;
  if (!f) return "?";
  if (f->isLambda) return "a lambda";
  return f->cls ? f->cls->name + "@" + f->name : f->name;
}
static void LiveSet(Interp& I) {
  g_live.clear();
  for (auto& s : I.stack) g_live.insert(s.p);
  for (auto& s : I.globals) g_live.insert(s.p);
}
// one frame's names (latest of each name wins, in the order they were made) + slf
static void FrameVars(Interp& I, size_t fi, std::string& o, Budget& b) {
  size_t base = I.frames[fi].base, end = fi + 1 < I.frames.size() ? I.frames[fi + 1].base : I.stack.size();
  if (end > I.stack.size()) end = I.stack.size();
  std::vector<size_t> pick;
  std::unordered_map<int, size_t> at;
  for (size_t k = base; k < end; ++k) {
    int id = I.stack[k].id; if (!Shown(id)) continue;
    auto it = at.find(id);
    if (it == at.end()) { at[id] = pick.size(); pick.push_back(k); } else pick[it->second] = k;
  }
  o += "[";
  bool first = true;
  if (I.frames[fi].self) {
    Value* sv = I.frames[fi].self; while (sv && sv->k == K::Ptr && sv->tgt && sv->ik != PK_OWN && sv->ik != PK_SHR) sv = sv->tgt;
    if (sv) { Node(o, "slf", *sv, 0, b); first = false; }
  }
  for (size_t k : pick) { if (b.nodes <= 0) break; if (!first) o += ','; first = false; Node(o, NameOf(I.stack[k].id), *I.stack[k].p, 0, b); }
  o += "]";
}
std::string DebugFrameJson(Interp& I, int fi) {
  if (fi < 0 || (size_t)fi >= I.frames.size()) return "[]";
  LiveSet(I);
  std::string o; Budget b; FrameVars(I, (size_t)fi, o, b);
  return o;
}
std::string DebugSnapshot(Interp& I, Stmt* s, const char* why) {
  LiveSet(I);
  std::string o = "{\"line\":" + std::to_string(s->line) + ",\"file\":";
  J(o, s->file);
  o += ",\"why\":\""; o += why; o += "\",\"stack\":[";
  for (size_t k = 0; k < I.frames.size(); ++k) {
    if (k) o += ',';
    int line = k < g_dbg.where.size() ? g_dbg.where[k].line : 0;
    const std::string* file = k < g_dbg.where.size() ? g_dbg.where[k].file : nullptr;
    o += "{\"name\":"; J(o, FrameName(I, k)); o += ",\"line\":" + std::to_string(line) + ",\"file\":"; J(o, file ? *file : std::string());
    o += "}";
  }
  Budget b;
  o += "],\"locals\":";
  FrameVars(I, I.frames.size() - 1, o, b);
  o += ",\"globals\":[";
  bool first = true;
  for (auto& g : I.globals) { if (!Shown(g.id) || b.nodes <= 0) continue; if (!first) o += ','; first = false; Node(o, NameOf(g.id), *g.p, 0, b); }
  o += "]}";
  return o;
}

// ---------------------------------------------------------------- the per-line point
void DebugAt(Interp& I, Stmt* s) {
  size_t d = I.frames.size();
  if (g_dbg.where.size() < d) g_dbg.where.resize(d);
  g_dbg.where[d - 1] = DebugWhere{s->line, &s->file};
  const char* why = nullptr;
  switch (g_dbg.mode) {
    case DBG_INTO: why = "step"; break;
    case DBG_OVER: if (d <= g_dbg.depth) why = "step"; break;
    case DBG_OUT: if (d < g_dbg.depth) why = "step"; break;
    default: break;
  }
  if (!why && g_dbg.anyBp) {
    auto it = g_dbg.bps.find(s->file);
    if (it != g_dbg.bps.end() && it->second.count(s->line)) why = "breakpoint";
  }
  if (!why || !g_host.debugPause) return;
  I.Flush();
  g_dbg.paused = true;
  int a = g_host.debugPause(DebugSnapshot(I, s, why));
  g_dbg.paused = false;
  switch (a) {
    case 1: g_dbg.mode = DBG_INTO; break;
    case 2: g_dbg.mode = DBG_OVER; g_dbg.depth = d; break;
    case 3: g_dbg.mode = DBG_OUT; g_dbg.depth = d; break;
    case 5: I.Flush(); ThrowStop();
    default: g_dbg.mode = DBG_RUN; break;
  }
}

}  // namespace epp
