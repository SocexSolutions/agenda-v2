#!/bin/bash
set -e

# Create db container if not found
if [ ! "$( docker ps -q -f name=mongo )" ]; then

  printf "\nmongodb container required for tests not found\n";
  printf "\nattempting to start mongodb container\n";

  docker container start mongo
  P3=$!

  if [ ! "$P3" ]; then

    printf "\n creating new mongo container \n";

    docker container run -d -p 27017:27017 --name=mongo mongo:6.0

  fi

fi

# Start web server
cd ./www

npm run dev &
P1=$!

# Start api
cd ../api

NODE_ENV=dev npm run dev &
P2=$!

# Wait on end of both
wait $P1 $P2
