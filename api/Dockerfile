FROM node:16

WORKDIR /app

COPY . .

RUN npm install --production

EXPOSE 4000

CMD [ "node", "./lib/index.js" ]
