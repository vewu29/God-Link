#include <iostream>
#include <map>
#include <string>
#include <cctype>
int main() {
    std::map<std::string, int> freq;
    std::string line;
    int lines = 0, words = 0;
    while (std::getline(std::cin, line)) {
        ++lines;
        std::string w;
        for (char c : line + " ") {
            if (std::isalpha((unsigned char)c)) w += char(std::tolower((unsigned char)c));
            else if (!w.empty()) { ++freq[w]; ++words; w.clear(); }
        }
    }
    std::cout << lines << " lines, " << words << " words, " << freq.size() << " distinct\n";
    for (auto& [w, n] : freq) if (n > 1) std::cout << w << " " << n << "\n";
    return 0;
}
