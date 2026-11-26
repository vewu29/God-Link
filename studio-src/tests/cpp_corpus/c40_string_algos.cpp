#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <map>
#include <cctype>
bool is_palindrome(const std::string& s) {
    std::string t;
    for (char c : s) if (std::isalnum((unsigned char)c)) t += char(std::tolower((unsigned char)c));
    return std::equal(t.begin(), t.begin() + t.size() / 2, t.rbegin());
}
bool anagrams(std::string a, std::string b) { std::sort(a.begin(), a.end()); std::sort(b.begin(), b.end()); return a == b; }
std::string rle(const std::string& s) {
    std::string out;
    for (size_t i = 0; i < s.size();) { size_t j = i; while (j < s.size() && s[j] == s[i]) ++j; out += std::to_string(j - i) + s[i]; i = j; }
    return out;
}
std::string join(const std::vector<std::string>& v, const std::string& sep) { std::string r; for (size_t i = 0; i < v.size(); ++i) r += (i ? sep : "") + v[i]; return r; }
std::string trim(const std::string& s) { auto b = s.find_first_not_of(" \t"); if (b == std::string::npos) return ""; auto e = s.find_last_not_of(" \t"); return s.substr(b, e - b + 1); }
int lcs(const std::string& a, const std::string& b) {
    std::vector<std::vector<int>> dp(a.size() + 1, std::vector<int>(b.size() + 1));
    for (size_t i = 1; i <= a.size(); ++i) for (size_t j = 1; j <= b.size(); ++j)
        dp[i][j] = a[i - 1] == b[j - 1] ? dp[i - 1][j - 1] + 1 : std::max(dp[i - 1][j], dp[i][j - 1]);
    return dp[a.size()][b.size()];
}
int main() {
    for (std::string s : {"A man, a plan, a canal: Panama", "hello", "No lemon, no melon"}) std::cout << is_palindrome(s);
    std::cout << "\n" << anagrams("listen", "silent") << anagrams("abc", "abd") << "\n";
    std::cout << rle("aaabccddddde") << "\n";
    std::cout << join({"a", "b", "c"}, ", ") << "\n";
    std::cout << "[" << trim("   padded text \t ") << "]\n";
    std::cout << lcs("ABCBDAB", "BDCABA") << "\n";
    std::map<char, int> counts;
    for (char c : std::string("mississippi")) ++counts[c];
    for (auto [c, n] : counts) std::cout << c << n;
    std::cout << "\n";
    std::string text = "one two three two one two";
    size_t pos = 0; int hits = 0;
    while ((pos = text.find("two", pos)) != std::string::npos) { ++hits; pos += 3; }
    std::cout << "two x" << hits << "\n";
    return 0;
}
