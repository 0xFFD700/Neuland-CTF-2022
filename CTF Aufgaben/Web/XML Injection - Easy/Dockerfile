FROM node:16-bullseye

WORKDIR /opt/next

COPY package.json package-lock.json ./
RUN apt update && apt install -y build-essential
RUN npm install

COPY . .

USER node
EXPOSE 3000
CMD ["node", "app.mjs"]

