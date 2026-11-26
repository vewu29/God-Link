#include <cstdio>
int main() {
    printf("%d %5d|%-5d|%05d\n", 1, 2, 3, 4);
    printf("%x %X %#x %o\n", 255, 255, 255, 8);
    printf("%.2f %8.3f %e %g %g\n", 3.14159, 2.71828, 12345.678, 0.0001, 100000000.0);
    printf("%s|%10s|%-10s|\n", "abc", "right", "left");
    printf("%c%c%c\n", 'x', 'y', 'z');
    printf("%lld %llu\n", -9000000000LL, 18000000000ULL);
    printf("%%literal%%\n");
    int n = printf("count me\n");
    printf("printed %d chars\n", n);
    char buf[64];
    snprintf(buf, sizeof buf, "%s-%03d", "id", 7);
    puts(buf);
    return 0;
}
