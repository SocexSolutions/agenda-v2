### Reference

- [Getting started with docker](https://www.youtube.com/watch?v=gAkwW2tuIqE&t=121s)
- [Express.js Apis](https://www.youtube.com/watch?v=-MTSQjw5DrM)

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

# Technical Decisions

## Service Architecture
![image](https://user-images.githubusercontent.com/54583311/120655368-db876780-c43f-11eb-9ccc-5ea9deba79fe.png)

### React and Next.js

- Component based architecture simplify development and allow for maximum code reusablity
- Style modules allow for the use of css which is faster then JSS but maintens scope
- Application state can be easily managed with hooks
- Next.js will simplify routing and elimnate the need for a complex browser router
- Next.js server side rendering will reduce the stress on clients, (this is required based on the computational requirements of virtual meetings)
- Previous experience with react
- Documentation and resources for react are unparalled
- Material ui allows for quick generation of high quality UIs

