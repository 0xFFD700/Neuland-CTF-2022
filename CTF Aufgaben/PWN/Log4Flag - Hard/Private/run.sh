#!/bin/bash
export FLAG=$(cat flag.txt)
set -euo pipefail
exec java -cp ".:log4flag-api.jar:log4flag-core.jar" Log4Flag
