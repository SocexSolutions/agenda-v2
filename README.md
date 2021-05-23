# Agenda

A meeting app for professionals.

# Getting Started

### Reference

- [Getting started with docker](https://www.youtube.com/watch?v=gAkwW2tuIqE&t=121s)
- [Express.js Apis](https://www.youtube.com/watch?v=-MTSQjw5DrM)

### Api Server Container

Build the docker image from the current directory (base image from [here](https://hub.docker.com/_/node))

```bash
docker build -t agenda/api:1.0 .
```

_In a seperate terminal_ run the container just built with

```
docker container run -p 5000:8080 --name agendapi agenda/api:1.0
```

In the terminal you should see `Agenda api listening on port 8080`. Logs from the api will appear there. This is the standard port for http. In the above command we mapped port 8080 on the container to the host system's port 5000. Thus, you can access the api through `http://localhost:5000` in the browser.

### MongoDb Container

Pull the mongodb image from dockerhub with (base image found [here](https://hub.docker.com/_/mongo))

```
docker image pull mongo
```

Run the run the prebuilt mongodb image with

```
docker container run -p 27017:27017 --name agendadb mongo
```

Since mongodb listens by default on 27017 and that is the standard port for mongo we map it to our machines port 27017. You should get an error message `It looks like you are trying to access MongoDB over HTTP on the native driver port.` if you go to `http://localhost:27017` in the browser.
