FROM --platform=linux/x86_64 node:18

WORKDIR /app

COPY . .

RUN npm install --production

RUN npm run keygen

EXPOSE 8080

CMD [ "node", "./lib/index.js" ]
