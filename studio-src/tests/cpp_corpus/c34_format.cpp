#include <format>
#include <iostream>
#include <string>
int main() {
    std::cout << std::format("Hello, {}!\n", "format");
    std::cout << std::format("{} + {} = {}\n", 2, 3, 2 + 3);
    std::cout << std::format("[{:>8}] [{:<8}] [{:^8}]\n", "r", "l", "c");
    std::cout << std::format("[{:08.3f}] [{:+d}] [{:x}] [{:#X}] [{:b}]\n", 3.14159, 42, 255, 255, 10);
    std::cout << std::format("{1} {0} {1}\n", "a", "b");
    std::cout << std::format("{:*^20}\n", " mid ");
    std::cout << std::format("{:.2e} {:g} {}\n", 12345.678, 0.5, 1.5);
    std::cout << std::format("{} {}\n", true, 'z');
    std::string s = std::format("{:>{}}", 7, 5);
    std::cout << "[" << s << "] len " << s.size() << "\n";
    return 0;
}
