FROM node:16

WORKDIR /app

COPY . .

RUN npm install --production

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
