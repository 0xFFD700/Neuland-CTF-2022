# docker build . -t password_guessing
# docker run --name password_guessing -p 8080:4000 --rm -it password_guessing


FROM debian:bookworm-slim as build
RUN apt-get update && apt-get install -y gcc
COPY password_guessing.c .
RUN sed -i 's/nland{dummy-flag}/nland{51mpl3_45_7h47}/' password_guessing.c
RUN gcc password_guessing.c -o /password_guessing

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y socat
COPY --from=build /password_guessing .
EXPOSE 4000
CMD socat TCP-LISTEN:4000,reuseaddr,fork,nodelay EXEC:"./password_guessing"
