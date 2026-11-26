#include <chrono>
#include <iostream>
int main() {
    using namespace std::chrono;
    using namespace std::chrono_literals;
    auto total = 2h + 45min + 30s;
    std::cout << duration_cast<seconds>(total).count() << " s\n";
    std::cout << duration_cast<minutes>(total).count() << " min\n";
    auto ms = 1500ms;
    std::cout << duration_cast<seconds>(ms).count() << " " << duration<double>(ms).count() << "\n";
    hours h = duration_cast<hours>(total);
    minutes m = duration_cast<minutes>(total - h);
    seconds s = duration_cast<seconds>(total - h - m);
    std::cout << h.count() << ":" << m.count() << ":" << s.count() << "\n";
    auto lap = 90s * 3 + 250ms;
    std::cout << lap.count() << " ms\n";
    std::cout << (1min > 59s) << " " << (milliseconds(1000) == 1s) << "\n";
    duration<int, std::ratio<60 * 60 * 24>> days3(3);
    std::cout << duration_cast<hours>(days3).count() << " h\n";
    auto per = 10s / 4;
    std::cout << per.count() << " " << (10s % 4s).count() << " " << duration_cast<microseconds>(1.5ms).count() << "\n";
    return 0;
}
