#pragma once
// debug.h — the Web Studio debugger (v4); see debug.cpp and ENGINE_API_V4.md
#include "interp.h"
#include <unordered_map>
#include <unordered_set>

namespace epp {
enum DbgMode { DBG_RUN = 0, DBG_INTO, DBG_OVER, DBG_OUT };
struct DebugWhere { int line = 0; const std::string* file = nullptr; };
struct DebugState {
  bool on = false;          // a debugger is attached to this run (the only thing Exec tests when it isn't)
  bool anyBp = false;
  bool paused = false;
  int mode = DBG_RUN;
  size_t depth = 0;         // frames.size() when Step over / Step out was pressed
  std::unordered_map<std::string, std::unordered_set<int>> bps;   // file ("" = main) -> lines
  std::vector<DebugWhere> where;                                  // the line each frame is on
};
extern DebugState g_dbg;
void DebugReset();
void DebugSetBreakpoints(const std::string& spec);
void DebugAt(Interp& I, Stmt* s);
std::string DebugFrameJson(Interp& I, int frame);
}  // namespace epp
