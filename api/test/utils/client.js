const axios = require("axios");

const client = axios.create({
  baseURL: "http://localhost:5000/api",
});

module.exports = client;
