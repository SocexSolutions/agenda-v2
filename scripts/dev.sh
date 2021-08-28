#!/bin/bash

cd ./www

npm run dev &

cd ../api

docker compose up &

wait