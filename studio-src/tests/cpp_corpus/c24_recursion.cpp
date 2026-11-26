#include <iostream>
#include <vector>
#include <string>
#include <cstdint>
long long fib(int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }
std::uint64_t fib_memo(int n, std::vector<std::uint64_t>& memo) {
    if (n < 2) return n;
    if (memo[n]) return memo[n];
    return memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo);
}
int moves = 0;
void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);
    ++moves;
    if (n >= 3) std::cout << "move disk " << n << " " << from << "->" << to << "\n";
    hanoi(n - 1, via, to, from);
}
int ackermann(int m, int n) { return m == 0 ? n + 1 : n == 0 ? ackermann(m - 1, 1) : ackermann(m - 1, ackermann(m, n - 1)); }
void permute(std::string s, int k, std::vector<std::string>& out) {
    if (k == (int)s.size()) { out.push_back(s); return; }
    for (int i = k; i < (int)s.size(); ++i) { std::swap(s[k], s[i]); permute(s, k + 1, out); std::swap(s[k], s[i]); }
}
int depth(int n) { return n == 0 ? 0 : 1 + depth(n - 1); }
int main() {
    for (int i = 0; i <= 20; i += 5) std::cout << "fib(" << i << ")=" << fib(i) << "\n";
    std::vector<std::uint64_t> memo(91);
    std::cout << "fib(90)=" << fib_memo(90, memo) << "\n";
    hanoi(4, 'A', 'C', 'B');
    std::cout << "hanoi(4) moves " << moves << "\n";
    std::cout << "ackermann(2,3)=" << ackermann(2, 3) << "\n";
    std::vector<std::string> perms;
    permute("abc", 0, perms);
    for (auto& p : perms) std::cout << p << ' ';
    std::cout << "\n" << "depth " << depth(10000) << "\n";
    return 0;
}
