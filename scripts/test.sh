#!/bin/bash
set -e

printf "Running api tests...\n";

if [ ! "$( docker ps -q -f name=mongo )" ]; then

  printf "\nmongodb container required for tests not found\n";
  printf "\nattempting to start mongodb container\n";

  docker container start mongo

fi

cd ./api;

NODE_ENV=test npm run test;
