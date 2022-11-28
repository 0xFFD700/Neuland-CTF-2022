docker build . -t into_the_backrooms
docker run --name into_the_backrooms -p 8000:8000 --env-file env.list --rm -it into_the_backrooms
