#### Snek Encoder - Medium

*I encoded the flag with a custom script that I wrote. I lost the source code to it. I just found this odd file in the project folder. It seems to describe operations and commands in some way to encode the flag. Maybe this helps you to find a way to decode the flag.
This is the encoded flag: `urfrg}qy6f-jZ.e-'U]((QSi&!POf`.*

<br>

[encode](encode)

<br>

The contents or the structure of the `encode` file are probably unfamiliar for most people. After some research you will find out that this is Python bytecode. It describes your source code as a low-level platform-independent representation. The challenge description states that this script is used to encode the flag. After we get the hang of how Python bytecode looks we can recover the original encode funtion.

```python
def encode(flag):
    o = ''
    for i, b in enumerate(flag):
        b = ord(b)
        b = b + 7 - i
        a = chr(b)
        o += a
    return o
```

Now we know how the flag was encoded. However, we need to decode it. We are going to reverse the encode function to get the decode function. We end up with something like this.

```python
def decode(flag):
    f = ''
    for i, b in enumerate(flag):
        c = ord(b)
        c = c - 7 + i
        c = chr(c)
        f += c
    return f
```

If we input the encoded flag into our decode function, we can retrieve the flag.

The flag is `nland{py7h0n_4l50_h45_by73c0d3}`.
