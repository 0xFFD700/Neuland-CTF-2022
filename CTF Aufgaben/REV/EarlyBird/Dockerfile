FROM docker.io/alpine/socat
EXPOSE 1337
COPY earlybird /earlybird
COPY flag.txt /flag.txt
CMD ["tcp-l:1337,reuseaddr,fork", "EXEC:/earlybird"]
