#!/bin/bash

npm i

node ./scripts/keygen.js

cd ./api

npm i

cd ../www

npm i
