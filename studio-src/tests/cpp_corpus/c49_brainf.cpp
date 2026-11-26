// Mini interpreter #2: a Brainf*ck VM with precomputed jump table.
#include <iostream>
#include <string>
#include <vector>
#include <stack>
std::string run(const std::string& prog) {
    std::vector<int> jump(prog.size(), -1);
    std::stack<int> st;
    for (int i = 0; i < (int)prog.size(); ++i) {
        if (prog[i] == '[') st.push(i);
        else if (prog[i] == ']') { int j = st.top(); st.pop(); jump[i] = j; jump[j] = i; }
    }
    std::vector<unsigned char> tape(30000, 0);
    size_t ptr = 0; std::string out; long steps = 0;
    for (int pc = 0; pc < (int)prog.size(); ++pc, ++steps) {
        switch (prog[pc]) {
            case '>': ++ptr; break;
            case '<': --ptr; break;
            case '+': ++tape[ptr]; break;
            case '-': --tape[ptr]; break;
            case '.': out += char(tape[ptr]); break;
            case '[': if (!tape[ptr]) pc = jump[pc]; break;
            case ']': if (tape[ptr]) pc = jump[pc]; break;
        }
    }
    std::cout << "(" << steps << " steps) ";
    return out;
}
int main() {
    std::cout << run("++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.");
    std::cout << run("++++++[>++++++++<-]>+.+.+.>++++++++++.");
    return 0;
}
