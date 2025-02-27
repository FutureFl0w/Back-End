FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY . .

RUN npx tsc

EXPOSE $PORT

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
