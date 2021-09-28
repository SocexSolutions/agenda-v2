#!/bin/bash

cd ./www

npm run dev &
P1=$!

cd ../api

docker compose up &
P2=$!


wait $P1 $P2
