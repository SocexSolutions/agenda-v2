# Agenda

Agenda will allow for more efficient meetings by estabilshing meeting topics in advance, establishing each topics value, and then deciding on the order and allocating time to the topics based on their value. In addition, agenda will simplify meeting notes avoiding TLDR through action items for each topic.

# Getting Started

## Setup
Generate public and private keys and install dependencies:
```
npm run setup
```

## Containerized (Recommended)

To run the frontend, backend, and database in separate containers use:
```
docker compose up --build
```

## Local
Run the frontend and backend using local node and create or use a container
called `mongo` for the database.
```
npm run dev
```
All output will be be seen in the terminal that the commands are run in.
Changes in the api and frontend are listened to separately. The UI can be found
as `localhost:3000` while the api is at `localhost:4000`.


# Testing

To run the tests use:
```
npm run test
```

# Info
More information specific to the api and server containers can be found in the README.md files for the `api` and `www` directories.

# Tickets
The project Kanban can be found [here](https://thomashudsonnotes.notion.site/a1f3e7cd3bf74c62b06dbda78b2c9c7c?v=43d3f2b9730045f691cd254967c6949d)

# Technical Decisions

## Service Architecture
![image](https://user-images.githubusercontent.com/54583311/120655368-db876780-c43f-11eb-9ccc-5ea9deba79fe.png)
