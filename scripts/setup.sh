#!/bin/bash

cd ./api

npm i

node ./lib/utils/keygen.js

cd ../www

npm i