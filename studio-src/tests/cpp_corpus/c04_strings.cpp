#include <iostream>
#include <string>
#include <algorithm>
int main() {
    std::string s = "Hello";
    s += ", World";
    s.push_back('!');
    std::cout << s << " len=" << s.size() << "\n";
    std::cout << s.substr(7, 5) << "\n";
    std::cout << s.find("World") << " " << (s.find("xyz") == std::string::npos) << "\n";
    std::string t = s;
    std::reverse(t.begin(), t.end());
    std::cout << t << "\n";
    std::transform(t.begin(), t.end(), t.begin(), ::toupper);
    std::cout << t << "\n";
    s.replace(0, 5, "Goodbye");
    std::cout << s << "\n";
    s.insert(0, ">> ");
    s.erase(s.size() - 1);
    std::cout << s << "\n";
    std::cout << std::to_string(123) + std::to_string(456) << " " << std::stoi("789") + 1 << " " << std::stod("2.5") * 2 << "\n";
    std::cout << (std::string("apple") < std::string("banana")) << " " << std::string("abc").compare("abd") << "\n";
    std::string r(5, '=');
    std::cout << r << " " << r.empty() << " " << std::string().empty() << "\n";
    std::cout << s.front() << s.back() << " " << s.rfind('o') << "\n";
    return 0;
}
