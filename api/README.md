

# Getting Started

### Local API

For quicker dev we can just `nodemon` to quick restart the api when changes
are saved to `.js` files (after installing nodemon with `npm i -g nodemon`) with
the following:

```
LOCAL=true nodemon lib/index.js
```

Then start mongo in docker desktop (this will not need to be restarted).

### Dockerized

With the use of docker compose, you can now use the following to setup agenda-api
as a docker swarm.

```shell
docker-compose build
```

To build the mongo and api containers.

```shell
docker-compose up
```

To run the two containers. The mongodb container will be available through
`port 27017` and the api will be running on port 5000. (We will need to change
this for production).


### Reference

- [Getting started with docker](https://www.youtube.com/watch?v=gAkwW2tuIqE&t=121s)
- [Express.js Apis](https://www.youtube.com/watch?v=-MTSQjw5DrM)

