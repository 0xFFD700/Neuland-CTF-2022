docker build . -t scavenger_hunt
docker run --name scavenger_hunt -p 8000:80 --rm -it scavenger_hunt
