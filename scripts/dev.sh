#!/bin/bash
set -e

# Create db container if not found
if [ ! "$( docker ps -q -f name=mongo )" ]; then

  printf "\nmongodb container required for tests not found\n";
  printf "\nattempting to start mongodb container\n";

  docker container start mongo || docker run -d --name mongo -p 27017:27017 mongo:6.0

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
