# Agenda

Agenda will allow for more efficient meetings by estabilshing meeting topics in advance, establishing each topics value, and then deciding on the order and allocating time to the topics based on their value. In addition, agenda will simplify meeting notes avoiding TLDR through action items for each topic.

# Getting Started

1. Generate public and private keys and install dependencies:
```
npm run setup
```
2. Run the backend in docker containers and the frontend with node:
```
npm run dev
```
3. Run api tests with (testing while api is live is supported)
```
npm run test
```

All output will be be seen in the terminal that the commands are run in. 
Changes in the api and frontend are listened to seperately. The UI can be found
as `localhost:3000` while the api is at `localhost:5000`.

# Info
More information specific to the api and server containers can be found in the README.md files for the `api` and `www` directories.

# Tickets
The project Kanban can be found [here](https://thomashudsonnotes.notion.site/a1f3e7cd3bf74c62b06dbda78b2c9c7c?v=43d3f2b9730045f691cd254967c6949d)

# Technical Decisions

## Service Architecture
![image](https://user-images.githubusercontent.com/54583311/120655368-db876780-c43f-11eb-9ccc-5ea9deba79fe.png)
