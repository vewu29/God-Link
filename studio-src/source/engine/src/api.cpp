// api.cpp — Check / RunProgram shared by the browser build and the terminal runner.
#include "eh.h"

namespace epp {


CheckResult Check(const std::string& src) {
  // the page checks the editor while a program may be running (between frames): keep the running program's globals
  Program* savedProg = g_prog; int savedLine = g_line; std::string savedFile = g_file;
  struct Back { Program* p; int l; std::string f; ~Back() { g_prog = p; g_line = l; g_file = f; } } back{savedProg, savedLine, savedFile};
  CheckResult r;
  std::unique_ptr<Program> keep;
  Caught c = Protect([&] { keep = BuildProgram(src); });
  if (c.k == CK_PROBLEM) r.errors.push_back(c.p);
  else if (c.k != CK_NONE) r.errors.push_back(Problem{"internal: check stopped", g_line, g_file});
  return r;
}

static std::unique_ptr<Program> g_running;

int RunProgram(const std::string& src, Problem* outErr) {
  g_line = 0; g_file.clear();
  g_running.reset();
  Caught c = Protect([&] { g_running = BuildProgram(src); });
  if (c.k == CK_PROBLEM) { if (outErr) *outErr = c.p; return -1; }
  if (c.k != CK_NONE) { if (outErr) *outErr = Problem{"internal: build stopped", g_line, g_file}; return -1; }
  static Interp* interp = nullptr;
  delete interp;
  interp = new Interp();
  int code = 0;
  Caught r = Protect([&] { code = interp->Run(g_running.get()); });
  interp->Flush();
  if (r.k == CK_NONE) return code;
  if (r.k == CK_EXIT) return r.code;
  if (r.k == CK_STOP) { if (outErr) *outErr = Problem{"Stopped.", 0, ""}; return -2; }
  if (r.k == CK_PROBLEM) { if (outErr) *outErr = r.p; return -1; }
  if (r.k == CK_THROWN) {
    std::string what = r.t.isStd ? r.t.v.s : KindWords(r.t.v);
    if (outErr) *outErr = Problem{"The program stopped with a problem nobody caught: " + what, g_line, g_file};
    return -1;
  }
  return -1;
}

}  // namespace epp
