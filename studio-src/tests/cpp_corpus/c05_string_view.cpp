#include <iostream>
#include <string_view>
#include <vector>
std::vector<std::string_view> split(std::string_view s, char d) {
    std::vector<std::string_view> out;
    size_t start = 0;
    while (true) {
        size_t p = s.find(d, start);
        if (p == std::string_view::npos) { out.push_back(s.substr(start)); break; }
        out.push_back(s.substr(start, p - start));
        start = p + 1;
    }
    return out;
}
int main() {
    std::string_view sv = "  the quick brown fox  ";
    sv.remove_prefix(2);
    sv.remove_suffix(2);
    std::cout << "[" << sv << "] " << sv.size() << "\n";
    for (auto w : split(sv, ' ')) std::cout << "<" << w << ">";
    std::cout << "\n";
    std::cout << sv.starts_with("the") << sv.ends_with("fox") << sv.starts_with("fox") << "\n";
    std::cout << sv.substr(4, 5) << " " << sv.find("brown") << "\n";
    constexpr std::string_view lit = "constexpr view";
    static_assert(lit.size() == 14);
    std::cout << lit << "\n";
    return 0;
}
