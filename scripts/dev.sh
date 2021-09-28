#!/bin/bash

cd ./www

npm run dev &
P1=$!

cd ../api

docker compose up &
P2=$!

mongo mongodb://host.docker.internal:27017/agenda ./lib/utils/autoPopulate.js

wait $P1 $P2
