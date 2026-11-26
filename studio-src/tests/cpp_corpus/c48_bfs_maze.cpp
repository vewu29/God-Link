#include <iostream>
#include <queue>
#include <string>
#include <vector>
int main() {
    std::vector<std::string> maze{
        "##########",
        "#S.....#.#",
        "#.##.#.#.#",
        "#.#..#...#",
        "#.#.####.#",
        "#...#..#.#",
        "###.#.##.#",
        "#.....#.E#",
        "##########"};
    int R = maze.size(), C = maze[0].size(), sr = 0, sc = 0, er = 0, ec = 0;
    for (int r = 0; r < R; ++r) for (int c = 0; c < C; ++c) { if (maze[r][c] == 'S') sr = r, sc = c; if (maze[r][c] == 'E') er = r, ec = c; }
    std::vector<std::vector<int>> dist(R, std::vector<int>(C, -1));
    std::vector<std::vector<std::pair<int, int>>> parent(R, std::vector<std::pair<int, int>>(C, {-1, -1}));
    std::queue<std::pair<int, int>> q;
    q.push({sr, sc}); dist[sr][sc] = 0;
    const int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int k = 0; k < 4; ++k) {
            int nr = r + dr[k], nc = c + dc[k];
            if (maze[nr][nc] != '#' && dist[nr][nc] < 0) { dist[nr][nc] = dist[r][c] + 1; parent[nr][nc] = {r, c}; q.push({nr, nc}); }
        }
    }
    std::cout << "shortest path length " << dist[er][ec] << "\n";
    for (auto p = parent[er][ec]; p != std::make_pair(sr, sc); p = parent[p.first][p.second]) maze[p.first][p.second] = '*';
    for (auto& row : maze) std::cout << row << "\n";
    int reachable = 0;
    for (auto& row : dist) for (int d : row) reachable += d >= 0;
    std::cout << "reachable cells " << reachable << "\n";
    return 0;
}
