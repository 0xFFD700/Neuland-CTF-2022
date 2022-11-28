# docker build . -t log4flag
# docker run --name log4flag -p 8080:4000 --rm -it log4flag

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y default-jre-headless socat && \
	rm -rf /var/lib/apt/lists/

RUN useradd --create-home --shell /bin/bash log4flag
WORKDIR /home/log4flag
COPY Log4Flag.class run.sh *.xml *.jar /home/log4flag
RUN chmod 555 /home/log4flag && \
    chown -R root:root /home/log4flag && \
    chmod -R 000 /home/log4flag/* && \
    chmod 005 /home/log4flag/run.sh && \
    chmod 004 /home/log4flag/*.class /home/log4flag/*.jar /home/log4flag/*.xml

COPY flag.txt /home/log4flag
RUN chown root:1337 flag.txt && \
    chmod 040 flag.txt

EXPOSE 4000
CMD socat TCP-LISTEN:4000,reuseaddr,fork,nodelay EXEC:/home/log4flag/run.sh
