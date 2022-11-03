FROM node:16

WORKDIR /app

COPY . .

RUN npm install --production

RUN npm run keygen

EXPOSE 80

CMD [ "node", "./lib/index.js" ]
