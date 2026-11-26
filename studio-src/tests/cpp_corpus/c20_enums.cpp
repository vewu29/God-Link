#include <iostream>
#include <string>
enum Color { Red, Green = 5, Blue };
enum class Dir : unsigned char { North, East, South, West };
enum class Flags : unsigned { None = 0, Read = 1, Write = 2, Exec = 4 };
constexpr Flags operator|(Flags a, Flags b) { return Flags(unsigned(a) | unsigned(b)); }
constexpr bool has(Flags a, Flags b) { return (unsigned(a) & unsigned(b)) != 0; }
std::string to_string(Dir d) {
    switch (d) {
        case Dir::North: return "North";
        case Dir::East: return "East";
        case Dir::South: return "South";
        case Dir::West: return "West";
    }
    return "?";
}
Dir turn_right(Dir d) { return Dir((static_cast<int>(d) + 1) % 4); }
int main() {
    std::cout << Red << " " << Green << " " << Blue << "\n";
    Color c = Blue;
    int ci = c;
    std::cout << ci + 1 << "\n";
    Dir d = Dir::North;
    for (int i = 0; i < 5; ++i) { std::cout << to_string(d) << ' '; d = turn_right(d); }
    std::cout << "\n" << static_cast<int>(Dir::West) << " " << sizeof(Dir) << "\n";
    Flags f = Flags::Read | Flags::Exec;
    std::cout << has(f, Flags::Read) << has(f, Flags::Write) << has(f, Flags::Exec) << " " << unsigned(f) << "\n";
    return 0;
}
