#include <iostream>
#include <iomanip>
int main() {
    std::cout << "[" << std::setw(8) << 42 << "]\n";
    std::cout << "[" << std::left << std::setw(8) << 42 << "]\n" << std::right;
    std::cout << "[" << std::setfill('*') << std::setw(8) << 7 << "]\n" << std::setfill(' ');
    std::cout << std::fixed << std::setprecision(3) << 3.14159265 << "\n";
    std::cout << std::setprecision(0) << 2.5 << " " << 3.5 << "\n";
    std::cout << std::scientific << std::setprecision(2) << 12345.678 << "\n";
    std::cout << std::defaultfloat << std::setprecision(6) << 1.0 / 3.0 << "\n";
    std::cout << std::hex << 255 << " " << std::uppercase << 255 << std::nouppercase << " " << std::showbase << 255 << std::noshowbase << std::dec << "\n";
    std::cout << std::oct << 64 << std::dec << " " << 64 << "\n";
    std::cout << std::boolalpha << true << " " << false << std::noboolalpha << " " << true << "\n";
    std::cout << std::showpos << 5 << " " << -5 << std::noshowpos << "\n";
    std::cout << std::setw(10) << std::internal << -42 << "\n";
    for (int i = 1; i <= 3; ++i)
        std::cout << std::setw(4) << i << std::setw(6) << i * i << std::setw(8) << i * i * i << "\n";
    return 0;
}
