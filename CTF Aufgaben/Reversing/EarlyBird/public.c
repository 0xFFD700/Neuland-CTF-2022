#include <fcntl.h>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/sendfile.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <stdint.h>

#include "monocypher.h"


char password[16] = "ysae_oot_yaw";

void checksum(const char *filename) {
    struct stat statbuf;
    uint8_t hash[64];

    int fd = open(filename, O_RDONLY);
    fstat(fd, &statbuf);
    uint8_t *filebuf = mmap(0, statbuf.st_size, PROT_READ, MAP_SHARED, fd, 0);
    crypto_blake2b(hash, filebuf, statbuf.st_size);
    munmap(filebuf, statbuf.st_size);
    close(fd);

    printf("integrity: ");
    for(unsigned int i = 0; i < 64; i++) {
        printf("%02x", hash[i]);
    }
    putchar('\n');
}

void print_flag() {
    FILE* f = fopen("flag.txt", "r");
    char flag[1024] = { 0 };

    if (NULL == f) {
        printf("flag not found!\n");
        exit(EXIT_FAILURE);
    }

    if(fgets(flag, 1024-1, f) == NULL){
        printf("Flag could not be read.");
        exit(EXIT_FAILURE);
    }

    fclose(f);
    puts(flag);
}

void init() {
    alarm(60);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
}

char* strrev(char *str) {
	int i;
	int j;
	unsigned char a;
	unsigned len = strlen((const char *)str);
	for (i = 0, j = len - 1; i < j; i++, j--) {
		a = str[i];
		str[i] = str[j];
		str[j] = a;
	}
    return str;
}

int main(int argc, char* argv[]) {
    char buf[1024];

    init();
    checksum(argv[0]);

    printf("%s\n", password);

    printf("Enter password:\n🔒 ");
    fgets(buf, 1024, stdin);
    buf[strcspn(buf, "\r\n")] = 0;

    if (strcmp(strrev(password), buf) == 0) {
        print_flag();
    } else {
        printf("💣 Nice try!\n");
    }

    return EXIT_SUCCESS;
}
