FROM --platform=linux/x86_64 node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm i @next/swc-linux-x64-gnu

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
