# Password

The program asks for a password. The challenge is to get the password through reversing the binary. There is some string stacking implemented within the binary.

The solution requires to reverse the binary and check which variables are used to fulfill the last `if`. Another solution requires to check what the last `print` prints. This is the flag, if the user provided the correct password. However, the printed variable (`v4`) is stacked too, which requires some work to determine which strings are used to build the flag.

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
    "bytes"
)

func main() {
    s1 := "nland{th1s_1s_d3f1n3tly_n0t_th3_fl4g"
    s2 := "nland{w0w_y0u_f0und_"
    s3 := "th3_fl4g!}"
    s4 := "nland{"
    s5 := "s0_m3ny_"
    s6 := "4w3s0m3_fl4gs_"
    s7 := "1n_th1s_b1n4ry}"
    s8 := "nland{1t_1s_"
    s9 := "th3_fl4g_"
    s10 := "1_w4s_"
    s11 := "l00k1ng_for!}"

    var b bytes.Buffer
    b.WriteString(s4)
    b.WriteString(s5) 
    b.WriteString(s6)
    b.WriteString(s7)

    var sb strings.Builder
    sb.WriteString(s8)
    sb.WriteString(s9)
    sb.WriteString(s10)
    sb.WriteString(s11)

    fmt.Println("Welcome to NEULAND CTF!")
    fmt.Println("Please enter the password:")
    inp, _, err := bufio.NewReader(os.Stdin).ReadLine()
    if err != nil {
            fmt.Println("Uhm, something went wrong!", err)
            fmt.Println("nland{th1s_1s_d3f1n3tly_n0t_th3_fl4g")
    }

    v1 := s1
    _ = v1
    v2 := fmt.Sprintf("%s%s", s2, s3)
    _ = v2
    v3 := b.String()
    _ = v3
    v4 := sb.String()
    _ = v4

    if string(inp) == s6 + s9 + s11 {
        fmt.Println("You got it!")
        fmt.Println(v4)
    } else {
        fmt.Println("Don't Worry, Relax, Chill and Try harder")
    }
}
```

The password is: `4w3s0m3_fl4gs_th3_fl4g_l00k1ng_for!}`

Flag: `nland{1t_1s_th3_fl4g_1_w4s_l00k1ng_for!}`
