# MeetingMinder
 [![License](https://img.shields.io/static/v1?label=license&message=MIT&color=brightgreen)](https://github.com/airbytehq/airbyte/tree/a9b1c6c0420550ad5069aca66c295223e0d05e27/LICENSE/README.md) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

MeetingMinder will allow for more efficient meetings by establishing meeting topics in advance, determining each topics value, and then deciding on the order and allocating time to the topics based on their value. In addition, agenda will simplify meeting notes avoiding TLDR through action items for each topic.

# Getting Started

## Setup

Generate public and private keys, install dependencies, and add fake data to
local mongo:

```
npm run setup
```

## Containerized

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
at `localhost:3000` while the api is at `localhost:4000/api`. You can adjust the
log level using the `NODE_DEBUG` environment variable. See 
[jobi](https://github.com/StarryInternet/jobi) for more details.

# Testing

Meeting Minder's API has 100% test coverage. This coverage is checked on each build. 
PR's that do not have full coverage will not pass automated testing.

To run the unit tests use.

```
npm run test
```

Check full test coverage using nyc with the command:

```
npm run coverage
```

# Deployment

Meeting Minder is continuously deployed using GCP on each merge to `master`. 
However, builds can be pushed to GCR with the following scripts.

The www container image can be pushed to GCR using the `push-www-to-gcr` script
with a specified semver version:

```bash
bash scripts/push-www-to-gcr.sh
```

The api container image can be pushed to GCR using the `push-api-to-gcr` script
with a specified semver version:

```bash
bash scripts/push-api-to-gcr.sh
```

The image version will then need to updated in cloud run.

# Info

More information specific to the api and server containers can be found in the README.md files for the `api` and `www` directories.

# Useful Links

- [Project Kanban](https://thomashudsonnotes.notion.site/a1f3e7cd3bf74c62b06dbda78b2c9c7c?v=43d3f2b9730045f691cd254967c6949d)
- [Icons](https://v4.mui.com/components/material-icons/)
