#pragma once
#include "epp.h"

namespace epp {

struct SrcLine {
  int number = 0;
  std::string file;
  std::string text;
  int indent = 0;
  bool blank = false, note = false;
  std::string who, root, what;
};

struct Program {
  std::vector<std::unique_ptr<Stmt>> stmts;
  std::vector<std::unique_ptr<FuncInfo>> funcStore;
  std::vector<std::unique_ptr<ClassInfo>> classStore;
  std::vector<std::unique_ptr<EnumInfo>> enumStore;
  std::vector<Stmt*> mainBody;       // what main runs, in order
  std::vector<Stmt*> globals;        // mgl / mtl, in order
  std::map<std::string, FuncInfo*> funcs;      // "area", "geo::area"
  std::map<std::string, ClassInfo*> classes;   // "Dog", "zoo::Bear"
  std::map<std::string, EnumInfo*> enums;
  std::map<std::string, const Type*> aliases;
  std::set<std::string> groups;
  std::set<std::string> callables;     // names that take & values: lambdas, fun names, objects with call
  std::set<std::string> methodNames;   // every method name of every class
  std::set<std::string> groupFuncNames;
  std::set<std::string> tparamsInScope;
  std::string curGroup;
  std::set<std::string> imported;
  bool usesRaylib = false, usesQt = false, usesSdl = false;
  std::function<const NativeType*(const std::string&)> nativeType;
  std::function<bool(const std::string&)> nativeCallable;
  bool IsCallableName(const std::string& n) const;
  bool IsMethodName(const std::string& n) const;
};
extern Program* g_prog;

bool IsRoot(const std::string& w);
bool IsValueWord(const std::string& w);
bool IsNoArgWord(const std::string& w);
bool IsPlainName(const std::string& s);
bool IsKindHead(const std::string& h);
bool IsCollectionHead(const std::string& h);
std::vector<std::string> SplitWords(const std::string& text);
std::vector<SrcLine> ReadLines(const std::string& src, const std::string& file);
ExprP ParseValue(const std::string& word);
void InitTypes();

// build.cpp
std::unique_ptr<Program> BuildProgram(const std::string& src);

}  // namespace epp
