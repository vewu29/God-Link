#include <iostream>
#include <array>
constexpr int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }
constexpr bool is_prime(int n) { if (n < 2) return false; for (int i = 2; i * i <= n; ++i) if (n % i == 0) return false; return true; }
constexpr auto primes_below_50() {
    std::array<int, 15> out{}; int k = 0;
    for (int i = 2; i < 50; ++i) if (is_prime(i)) out[k++] = i;
    return out;
}
consteval int square(int x) { return x * x; }
struct Point { int x, y; constexpr int manhattan() const { return (x < 0 ? -x : x) + (y < 0 ? -y : y); } };
int main() {
    constexpr int f10 = factorial(10);
    static_assert(f10 == 3628800);
    constexpr auto ps = primes_below_50();
    static_assert(ps[14] == 47);
    std::cout << f10 << "\n";
    for (int p : ps) std::cout << p << ' ';
    std::cout << "\n";
    constexpr Point p{-3, 4};
    static_assert(p.manhattan() == 7);
    std::cout << p.manhattan() << " " << square(12) << "\n";
    int runtime = 6;
    std::cout << factorial(runtime) << "\n";
    if constexpr (sizeof(int) == 4) std::cout << "int is 32-bit\n";
    return 0;
}
