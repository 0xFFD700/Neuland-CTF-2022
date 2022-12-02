FROM node:16

WORKDIR /opt/next

COPY package.json package-lock.json ./
RUN npm install

COPY . .

USER node
EXPOSE 3000
CMD ["node", "app.mjs"]
