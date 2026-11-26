// main_native.cpp — run an .epp file in the terminal (for the Book corpus test).
#include "eh.h"
#include <cstdio>
#include <fstream>
#include <sstream>
#include <iostream>
#include <thread>
#include <chrono>
using namespace epp;
int main(int argc, char** argv) {
  if (argc < 2) { std::fprintf(stderr, "usage: epp_run file.epp [diskfile ...]\n"); return 2; }
  std::ifstream f(argv[1]); std::stringstream ss; ss << f.rdbuf();
  for (int k = 2; k < argc; ++k) { std::ifstream g(argv[k]); std::stringstream s2; s2 << g.rdbuf(); std::string n = argv[k]; size_t sl = n.rfind('/'); g_disk.files[sl == std::string::npos ? n : n.substr(sl + 1)] = s2.str(); }
  g_host.out = [](const std::string& s) { std::fwrite(s.data(), 1, s.size(), stdout); };
  g_host.err = [](const std::string& s) { std::fwrite(s.data(), 1, s.size(), stdout); };
  g_host.readLine = [](const std::string&, std::string& line) { return (bool)std::getline(std::cin, line); };
  g_host.sleep = [](int ms) { std::this_thread::sleep_for(std::chrono::milliseconds(ms)); };
  Problem p{"", 0, ""};
  int code = RunProgram(ss.str(), &p);
  std::fflush(stdout);
  if (code == -1 || code == -2) { std::fprintf(stderr, "EPP_ERROR line %d: %s\n", p.line, p.msg.c_str()); return 1; }
  return code;
}
