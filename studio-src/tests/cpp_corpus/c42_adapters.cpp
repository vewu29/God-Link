#include <iostream>
#include <queue>
#include <stack>
#include <vector>
#include <string>
#include <functional>
int main() {
    std::stack<int> st;
    for (int i = 1; i <= 4; ++i) st.push(i * 10);
    while (!st.empty()) { std::cout << st.top() << ' '; st.pop(); }
    std::cout << "\n";
    std::queue<std::string> q;
    for (auto s : {"first", "second", "third"}) q.push(s);
    std::cout << q.front() << " " << q.back() << " " << q.size() << "\n";
    q.pop();
    std::cout << q.front() << "\n";
    std::priority_queue<int> maxh;
    for (int x : {5, 1, 8, 3, 9, 2}) maxh.push(x);
    while (!maxh.empty()) { std::cout << maxh.top() << ' '; maxh.pop(); }
    std::cout << "\n";
    std::priority_queue<int, std::vector<int>, std::greater<int>> minh;
    for (int x : {5, 1, 8, 3, 9, 2}) minh.push(x);
    while (!minh.empty()) { std::cout << minh.top() << ' '; minh.pop(); }
    std::cout << "\n";
    using Task = std::pair<int, std::string>;
    std::priority_queue<Task> tasks;
    tasks.push({2, "write"}); tasks.push({5, "deploy"}); tasks.push({1, "rest"}); tasks.push({5, "build"});
    while (!tasks.empty()) { std::cout << tasks.top().first << ":" << tasks.top().second << ' '; tasks.pop(); }
    std::cout << "\n";
    std::string expr = "{[()()]}([)]";
    std::stack<char> br; bool ok = true; size_t i = 0;
    for (; i < 8; ++i) { char c = expr[i]; if (c == '(' || c == '[' || c == '{') br.push(c); else { char o = br.top(); br.pop(); if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) ok = false; } }
    std::cout << "balanced " << (ok && br.empty()) << "\n";
    return 0;
}
