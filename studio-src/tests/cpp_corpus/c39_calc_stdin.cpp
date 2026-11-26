#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>
int main() {
    std::string line;
    std::cout << std::fixed << std::setprecision(2);
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        if (line == "quit") { std::cout << "bye\n"; break; }
        std::istringstream in(line);
        double a, b; char op;
        if (!(in >> a >> op >> b)) { std::cout << "bad input: " << line << "\n"; continue; }
        switch (op) {
            case '+': std::cout << a + b << "\n"; break;
            case '-': std::cout << a - b << "\n"; break;
            case '*': std::cout << a * b << "\n"; break;
            case '/': if (b == 0) std::cout << "div by zero\n"; else std::cout << a / b << "\n"; break;
            default: std::cout << "unknown op " << op << "\n";
        }
    }
    return 0;
}
