// native_none.cpp — the terminal runner has no window, so library calls say so.
#include "eh.h"
namespace epp {
struct NativeType { std::string name; };
std::string NativeShow(const Value&) { return "(a raylib value)"; }
Value NativeDefault(const NativeType*) { NotYet("raylib in the terminal runner"); }
Value NativeConvert(const Value&, const NativeType*) { NotYet("raylib in the terminal runner"); }
const NativeType* FindNativeType(const std::string&) { return nullptr; }
bool IsNativeFunction(const std::string&) { return false; }
bool IsNativeConstant(const std::string&) { return false; }
Value NativeConstant(const std::string& n) { NotYet("raylib's " + n + " in the terminal runner"); }
Value CallNative(const std::string& n, std::vector<Value>&, std::vector<Value*>&) { NotYet("raylib's " + n + " in the terminal runner"); }
Value* NativeField(Value&, const std::string&) { return nullptr; }
void NativeStore(Value&, const std::string& f, const Value&) { NotYet("raylib field " + f); }
bool NativeHasField(const Value&, const std::string&) { return false; }
Value NativeGetField(const Value&, const std::string& f) { NotYet("raylib field " + f); }
void NativeReset() {}
bool IsQtFunction(const std::string&) { return false; }
Value CallQt(const std::string& n, std::vector<Value>&) { NotYet("Qt's " + n + " in the terminal runner"); }
}
