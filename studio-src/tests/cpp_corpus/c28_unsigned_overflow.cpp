#include <iostream>
#include <cstdint>
#include <limits>
#include <string_view>
int main() {
    std::uint8_t u8 = 250; u8 += 10;
    std::uint16_t u16 = 65535; ++u16;
    std::uint32_t u32 = 0; --u32;
    std::uint64_t u64 = std::numeric_limits<std::uint64_t>::max(); u64 += 2;
    std::cout << int(u8) << " " << u16 << " " << u32 << " " << u64 << "\n";
    std::uint32_t h = 2166136261u;
    for (char c : std::string_view("hello")) { h ^= std::uint8_t(c); h *= 16777619u; }
    std::cout << "fnv1a(hello) " << h << "\n";
    std::uint32_t lcg = 1;
    for (int i = 0; i < 5; ++i) { lcg = lcg * 1664525u + 1013904223u; std::cout << lcg << ' '; }
    std::cout << "\n";
    std::cout << std::numeric_limits<std::int32_t>::max() << " " << std::numeric_limits<std::int32_t>::min() << " "
              << std::numeric_limits<std::int64_t>::max() << " " << std::numeric_limits<std::uint16_t>::max() << "\n";
    unsigned a = 3, b = 5;
    std::cout << a - b << " " << (a - b > 0) << "\n";
    std::int64_t big = 1;
    for (int i = 0; i < 62; ++i) big *= 2;
    std::cout << big << "\n";
    return 0;
}
