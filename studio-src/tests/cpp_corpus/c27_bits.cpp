#include <iostream>
#include <bitset>
#include <cstdint>
#include <bit>
int main() {
    unsigned a = 0b1100, b = 0b1010;
    std::cout << (a & b) << " " << (a | b) << " " << (a ^ b) << " " << (~a & 0xF) << " " << (a << 2) << " " << (a >> 2) << "\n";
    std::cout << std::bitset<8>(a) << " " << std::bitset<8>(200) << " " << std::bitset<16>(0xBEEF) << "\n";
    std::bitset<8> bs("10110001");
    std::cout << bs.count() << " " << bs.test(0) << " " << bs.flip(1) << " " << bs.to_ulong() << "\n";
    std::uint32_t x = 0xDEADBEEF;
    std::cout << std::hex << x << " " << (x >> 16) << " " << (x & 0xFFFF) << std::dec << "\n";
    std::cout << std::popcount(x) << " " << std::countl_zero(std::uint32_t(1)) << " " << std::countr_zero(std::uint32_t(8)) << " " << std::has_single_bit(64u) << " " << std::bit_ceil(100u) << "\n";
    std::cout << std::rotl(std::uint8_t(0b10010001), 1) + 0 << "\n";
    int n = 37, bits = 0;
    while (n) { bits += n & 1; n >>= 1; }
    std::cout << "bits in 37: " << bits << "\n";
    std::uint32_t flags = 0;
    flags |= 1u << 3; flags |= 1u << 5; flags &= ~(1u << 3);
    std::cout << flags << " " << ((flags >> 5) & 1) << "\n";
    std::int32_t neg = -16;
    std::cout << (neg >> 2) << " " << (std::uint32_t(neg) >> 28) << "\n";
    return 0;
}
