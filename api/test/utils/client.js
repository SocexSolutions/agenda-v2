const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:5000'
});

module.exports = client;
