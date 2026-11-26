#include <iostream>
#include <vector>
#include <string>
int main() {
    const int W = 12, H = 10;
    std::vector<std::string> g(H, std::string(W, '.'));
    // glider + blinker
    g[1][2] = '#'; g[2][3] = '#'; g[3][1] = '#'; g[3][2] = '#'; g[3][3] = '#';
    g[6][8] = '#'; g[6][9] = '#'; g[6][10] = '#';
    auto alive = [&](int r, int c) { r = (r + H) % H; c = (c + W) % W; return g[r][c] == '#'; };
    for (int gen = 0; gen <= 4; ++gen) {
        int pop = 0;
        for (auto& row : g) for (char ch : row) pop += ch == '#';
        std::cout << "gen " << gen << " pop " << pop << "\n";
        if (gen % 2 == 0) for (auto& row : g) std::cout << row << "\n";
        std::vector<std::string> next = g;
        for (int r = 0; r < H; ++r)
            for (int c = 0; c < W; ++c) {
                int n = 0;
                for (int dr = -1; dr <= 1; ++dr) for (int dc = -1; dc <= 1; ++dc) if (dr || dc) n += alive(r + dr, c + dc);
                next[r][c] = (n == 3 || (n == 2 && g[r][c] == '#')) ? '#' : '.';
            }
        g = next;
    }
    for (int gen = 5; gen < 40; ++gen) {
        std::vector<std::string> next = g;
        for (int r = 0; r < H; ++r)
            for (int c = 0; c < W; ++c) {
                int n = 0;
                for (int dr = -1; dr <= 1; ++dr) for (int dc = -1; dc <= 1; ++dc) if (dr || dc) n += alive(r + dr, c + dc);
                next[r][c] = (n == 3 || (n == 2 && g[r][c] == '#')) ? '#' : '.';
            }
        g = next;
    }
    std::cout << "after 40 generations:\n";
    for (auto& row : g) std::cout << row << "\n";
    return 0;
}
