#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <iomanip>
int main() {
    std::istringstream in("10 20 30 abc 40");
    int x, sum = 0;
    while (in >> x) sum += x;
    std::cout << "sum before failure " << sum << " fail " << in.fail() << "\n";
    in.clear();
    std::string word;
    in >> word;
    std::cout << "word " << word << "\n";
    std::ostringstream out;
    out << "pi~" << std::fixed << std::setprecision(2) << 3.14159 << " n=" << std::setw(4) << std::setfill('0') << 7;
    std::cout << out.str() << "\n";
    std::string csv = "name,age,city\nAnn,30,Oslo\nBob,25,Rome";
    std::istringstream lines(csv);
    std::string line;
    while (std::getline(lines, line)) {
        std::istringstream cells(line);
        std::string cell;
        std::vector<std::string> row;
        while (std::getline(cells, cell, ',')) row.push_back(cell);
        std::cout << row.size() << ":" << row[0] << "|" << row[2] << "\n";
    }
    std::stringstream ss;
    ss << 255;
    int back;
    ss >> back;
    std::cout << back * 2 << "\n";
    std::stringstream hx;
    hx << std::hex << "ff";
    int h;
    hx >> h;
    std::cout << h << "\n";
    double dd;
    std::istringstream("2.5e3") >> dd;
    std::cout << dd << "\n";
    return 0;
}
