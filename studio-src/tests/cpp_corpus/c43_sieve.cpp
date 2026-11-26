#include <iostream>
#include <vector>
int main() {
    const int N = 100000;
    std::vector<bool> composite(N + 1, false);
    std::vector<int> primes;
    for (int i = 2; i <= N; ++i) {
        if (!composite[i]) { primes.push_back(i); for (long long j = (long long)i * i; j <= N; j += i) composite[j] = true; }
    }
    std::cout << "primes <= " << N << ": " << primes.size() << "\n";
    for (int i = 0; i < 15; ++i) std::cout << primes[i] << ' ';
    std::cout << "\nlast " << primes.back() << "\n";
    int twins = 0;
    for (size_t i = 1; i < primes.size(); ++i) twins += primes[i] - primes[i - 1] == 2;
    std::cout << "twin pairs " << twins << "\n";
    long long sum = 0;
    for (int p : primes) sum += p;
    std::cout << "sum " << sum << "\n";
    int n = 360360; std::cout << n << " =";
    for (int p : primes) { if ((long long)p * p > n) break; while (n % p == 0) { std::cout << ' ' << p; n /= p; } }
    if (n > 1) std::cout << ' ' << n;
    std::cout << "\n";
    return 0;
}
