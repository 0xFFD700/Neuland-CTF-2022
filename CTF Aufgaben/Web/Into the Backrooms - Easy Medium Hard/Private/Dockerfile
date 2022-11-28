FROM node:latest

WORKDIR /app
COPY index.js /app
COPY package.json /app
COPY flag.txt /
RUN npm install 
RUN chmod +x /app/index.js
RUN useradd -m app
USER app
ENV NODE_ENV=production
CMD ["/app/index.js"]
