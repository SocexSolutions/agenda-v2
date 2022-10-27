const axios = require("axios");

const client = axios.create({
  baseURL: "http://localhost:5555/api",
});

module.exports = client;
