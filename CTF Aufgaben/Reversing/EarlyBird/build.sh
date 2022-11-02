clang -Os -nostdlib -static -c payload.c
objcopy -O binary -j .text payload.o payload.bin
xortool-xor -f payload.bin -s "*" > payload-memfrob.bin
clang secret.c public.c monocypher.c rawdata.s -o earlybird \
    -Os -static -fvisibility=hidden -fno-omit-frame-pointer \
    -fno-rtti -ffunction-sections -fdata-sections  \
    -Wl,-O,-s,--gc-sections,-Map=output.map,-T earlybird.ld
strip -s -K main earlybird
