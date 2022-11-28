# docker build . -t h4ck3r
# docker run --name h4ck3r -p 8081:4000 --rm -it h4ck3r


FROM debian:bookworm-slim as build
RUN apt-get update && apt-get install -y gcc
COPY h4ck3r.c .
RUN sed -i 's/nland{dummy-flag}/nland{y0u_4r3_4_r34l_h4ck3r_n0w}/' h4ck3r.c
RUN gcc h4ck3r.c -o /h4ck3r

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y socat
COPY --from=build /h4ck3r .
EXPOSE 4000
CMD socat TCP-LISTEN:4000,reuseaddr,fork,nodelay EXEC:"./h4ck3r"
