#include <iostream>
#include <cctype>
#include <string>
int main() {
    std::string s = "Hello, World 42! tab\there";
    int alpha = 0, digit = 0, space = 0, punct = 0, upper = 0;
    for (unsigned char c : s) {
        alpha += std::isalpha(c) != 0;
        digit += std::isdigit(c) != 0;
        space += std::isspace(c) != 0;
        punct += std::ispunct(c) != 0;
        upper += std::isupper(c) != 0;
    }
    std::cout << alpha << " " << digit << " " << space << " " << punct << " " << upper << "\n";
    std::string up, low;
    for (unsigned char c : s) { up += char(std::toupper(c)); low += char(std::tolower(c)); }
    std::cout << up << "\n" << low << "\n";
    for (char c = 'a'; c <= 'e'; ++c) std::cout << c << int(c) << ' ';
    std::cout << "\n" << char('A' + 25) << " " << ('7' - '0') * 3 << " " << std::isxdigit('f') * 0 + (std::isxdigit('f') != 0) << "\n";
    std::string caesar = "attack at dawn";
    for (char& c : caesar) if (std::islower((unsigned char)c)) c = char('a' + (c - 'a' + 3) % 26);
    std::cout << caesar << "\n";
    return 0;
}
