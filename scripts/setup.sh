#!/bin/bash

npm i

node ./scripts/keygen.js

NODE_ENV=dev node ./scripts/autoPopulate.js
