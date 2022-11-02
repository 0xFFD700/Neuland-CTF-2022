clang -c payload.c -Os -nostdlib -static \
    -fno-omit-frame-pointer -fno-asynchronous-unwind-tables
objcopy -O binary -j .text payload.o payload.bin
xortool-xor -f payload.bin -s "*" > payload-memfrob.bin

clang secret.c public.c monocypher.c rawdata.s -o earlybird \
    -Os -static -fvisibility=hidden -fno-omit-frame-pointer \
    -ffunction-sections -fdata-sections -fno-asynchronous-unwind-tables \
    -Wl,-O,-s,--gc-sections,-Map=output.map,-T earlybird.ld

strip -s \
    -K main -K init -K print_flag -K checksum -K crypto_blake2b \
    -K open -K close -K fclose -K fgets -K fstat -K printf -K puts -K putchar \
    -K mmap -K munmap -K exit -K alarm -K setvbuf -K strlen -K strcspn -K strcmp \
    --remove-section=.note.* --remove-section=.comment \
    earlybird
