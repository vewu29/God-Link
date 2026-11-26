#include <iostream>
#include <optional>
#include <variant>
#include <string>
#include <vector>
std::optional<int> parse(const std::string& s) {
    if (s.empty() || s.find_first_not_of("0123456789") != std::string::npos) return std::nullopt;
    return std::stoi(s);
}
struct Visitor {
    void operator()(int i) const { std::cout << "int " << i << "\n"; }
    void operator()(double d) const { std::cout << "double " << d << "\n"; }
    void operator()(const std::string& s) const { std::cout << "string " << s << "\n"; }
};
template <class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template <class... Ts> overloaded(Ts...) -> overloaded<Ts...>;
int main() {
    for (std::string s : {"42", "x1", "", "007"}) {
        auto v = parse(s);
        std::cout << "'" << s << "' -> " << (v ? std::to_string(*v) : "none") << " or " << v.value_or(-1) << "\n";
    }
    std::optional<std::string> o;
    std::cout << o.has_value() << "\n";
    o = "now";
    std::cout << o.has_value() << " " << *o << " " << o->size() << "\n";
    o.reset();
    try { (void)o.value(); } catch (const std::bad_optional_access&) { std::cout << "bad_optional_access\n"; }
    std::vector<std::variant<int, double, std::string>> vs{1, 2.5, std::string("hi")};
    for (auto& v : vs) std::visit(Visitor{}, v);
    for (auto& v : vs) std::visit(overloaded{[](int) { std::cout << "I"; }, [](double) { std::cout << "D"; }, [](const std::string&) { std::cout << "S"; }}, v);
    std::cout << "\n";
    std::variant<int, std::string> x = 5;
    std::cout << x.index() << " " << std::holds_alternative<int>(x) << " " << std::get<int>(x) << "\n";
    x = std::string("five");
    std::cout << x.index() << " " << *std::get_if<std::string>(&x) << " " << (std::get_if<int>(&x) == nullptr) << "\n";
    try { (void)std::get<int>(x); } catch (const std::bad_variant_access&) { std::cout << "bad_variant_access\n"; }
    return 0;
}
