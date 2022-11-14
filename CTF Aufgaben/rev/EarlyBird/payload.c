typedef unsigned int uint32_t;

void __attribute__ ((constructor)) monitor() {
    static const char *password = (char*)0xC0FFE0;
    static const uint32_t confusion[] = { 0x03090a06, 0x361d1b2b, 0x6f0d1314 };
    *(volatile uint32_t*)(password + 4) ^= __builtin_bswap32(confusion[1]);
    *(volatile uint32_t*)(password + 8) ^= __builtin_bswap32(confusion[2]);
    *(volatile uint32_t*)(password + 0) ^= __builtin_bswap32(confusion[0]);
}
