clang secret.c public.c monocypher.c -o earlybird \
    -Os -fvisibility=hidden -fno-omit-frame-pointer \
    -ffunction-sections -fdata-sections -Wl,--gc-sections \
    -fuse-ld=lld
    
# -Wl,-Map=output.map,-T earlybird.ld
