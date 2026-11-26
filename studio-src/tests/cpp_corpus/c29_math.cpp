#include <iostream>
#include <iomanip>
#include <cmath>
#include <numbers>
int main() {
    std::cout << std::fixed << std::setprecision(6);
    std::cout << std::sqrt(2.0) << " " << std::pow(2.0, 10) << " " << std::pow(2.0, 0.5) << " " << std::cbrt(27.0) << "\n";
    std::cout << std::sin(1.0) << " " << std::cos(1.0) << " " << std::tan(0.5) << " " << std::atan2(1.0, 1.0) << "\n";
    std::cout << std::exp(1.0) << " " << std::log(10.0) << " " << std::log10(1000.0) << " " << std::log2(1024.0) << "\n";
    std::cout << std::floor(-2.5) << " " << std::ceil(-2.5) << " " << std::round(2.5) << " " << std::trunc(-2.7) << " " << std::fmod(10.0, 3.0) << "\n";
    std::cout << std::abs(-3.5) << " " << std::hypot(3.0, 4.0) << " " << std::fmax(1.0, 2.0) << "\n";
    std::cout << std::numbers::pi << " " << std::numbers::e << "\n";
    std::cout << std::setprecision(3);
    for (int deg = 0; deg <= 90; deg += 30) {
        double r = deg * std::numbers::pi / 180.0;
        std::cout << deg << ": " << std::sin(r) << " " << std::cos(r) << "\n";
    }
    std::cout << std::isnan(std::sqrt(-1.0)) << " " << std::isinf(1.0 / 0.0) << "\n";
    double total = 0;
    for (int i = 1; i <= 1000; ++i) total += 1.0 / (double(i) * i);
    std::cout << std::setprecision(8) << total << " vs " << std::numbers::pi * std::numbers::pi / 6 << "\n";
    std::cout << std::setprecision(2) << 7 / 2 << " " << 7 / 2.0 << " " << -7 / 2 << " " << -7 % 3 << "\n";
    return 0;
}
