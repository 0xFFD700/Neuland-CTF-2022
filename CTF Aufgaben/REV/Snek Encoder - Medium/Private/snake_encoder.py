import dis


def encode(flag):
    o = ''
    for i, b in enumerate(flag):
        b = ord(b)
        b = b + 7 - i
        a = chr(b)
        o += a
    return o


def decode(flag):
    f = ''
    for i, b in enumerate(flag):
        c = ord(b)
        c = c - 7 + i
        c = chr(c)
        f += c
    return f


with open("flag.txt") as f:
    lines = f.readlines()
    flag = lines[0].strip()
    encoded = encode(flag)
    print(encoded)
    decoded = decode(encoded)
    print(decoded)
    dis.dis(encode)
