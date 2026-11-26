// A tiny stack-language + expression interpreter: tokenizer, recursive-descent parser, variables.
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <cctype>
#include <stdexcept>
#include <memory>
struct Tok { char kind; std::string text; long long num; };
std::vector<Tok> lex(const std::string& s) {
    std::vector<Tok> out;
    for (size_t i = 0; i < s.size();) {
        char c = s[i];
        if (std::isspace((unsigned char)c)) { ++i; continue; }
        if (std::isdigit((unsigned char)c)) { long long v = 0; while (i < s.size() && std::isdigit((unsigned char)s[i])) v = v * 10 + (s[i++] - '0'); out.push_back({'n', "", v}); }
        else if (std::isalpha((unsigned char)c)) { std::string id; while (i < s.size() && std::isalnum((unsigned char)s[i])) id += s[i++]; out.push_back({'i', id, 0}); }
        else { out.push_back({c, std::string(1, c), 0}); ++i; }
    }
    out.push_back({'$', "", 0});
    return out;
}
struct Interp {
    std::map<std::string, long long> vars;
    std::vector<Tok> t; size_t p = 0;
    const Tok& peek() { return t[p]; }
    bool eat(char k) { if (t[p].kind == k) { ++p; return true; } return false; }
    long long primary() {
        if (peek().kind == 'n') return t[p++].num;
        if (peek().kind == 'i') {
            std::string name = t[p++].text;
            auto it = vars.find(name);
            if (it == vars.end()) throw std::runtime_error("undefined variable '" + name + "'");
            return it->second;
        }
        if (eat('(')) { long long v = expr(); if (!eat(')')) throw std::runtime_error("expected )"); return v; }
        if (eat('-')) return -primary();
        throw std::runtime_error("unexpected token '" + peek().text + "'");
    }
    long long power() { long long b = primary(); if (eat('^')) { long long e = power(), r = 1; while (e-- > 0) r *= b; return r; } return b; }
    long long term() {
        long long v = power();
        for (;;) {
            if (eat('*')) v *= power();
            else if (eat('/')) { long long d = power(); if (d == 0) throw std::runtime_error("division by zero"); v /= d; }
            else if (eat('%')) { long long d = power(); if (d == 0) throw std::runtime_error("division by zero"); v %= d; }
            else return v;
        }
    }
    long long expr() { long long v = term(); for (;;) { if (eat('+')) v += term(); else if (eat('-')) v -= term(); else return v; } }
    std::string run(const std::string& line) {
        t = lex(line); p = 0;
        if (t[0].kind == 'i' && t[1].kind == '=') { std::string n = t[0].text; p = 2; long long v = expr(); if (peek().kind != '$') throw std::runtime_error("trailing input"); vars[n] = v; return n + " = " + std::to_string(v); }
        long long v = expr();
        if (peek().kind != '$') throw std::runtime_error("trailing input");
        return std::to_string(v);
    }
};
int main() {
    Interp in;
    const char* program[] = {"1 + 2 * 3", "(1 + 2) * 3", "x = 10", "y = x * x - 1", "y / 3", "y % 7", "2 ^ 3 ^ 2", "-x + 4",
                             "z + 1", "10 / (x - 10)", "3 +", "total = x + y + 2^10", "total"};
    for (const char* line : program) {
        try { std::cout << "> " << line << "\n" << in.run(line) << "\n"; }
        catch (const std::exception& e) { std::cout << "error: " << e.what() << "\n"; }
    }
    // stack machine
    std::vector<std::string> code{"push 5", "push 7", "add", "dup", "mul", "push 4", "sub", "print"};
    std::vector<long long> st;
    for (auto& ins : code) {
        if (ins.rfind("push ", 0) == 0) st.push_back(std::stoll(ins.substr(5)));
        else if (ins == "dup") st.push_back(st.back());
        else if (ins == "print") std::cout << "stack top " << st.back() << "\n";
        else { long long b = st.back(); st.pop_back(); long long a = st.back(); st.pop_back(); st.push_back(ins == "add" ? a + b : ins == "sub" ? a - b : a * b); }
    }
    return 0;
}
