FROM node:16

WORKDIR /app

COPY . .

RUN npm install --production

EXPOSE 80

CMD [ "node", "./lib/index.js" ]
