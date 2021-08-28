import axios from 'axios';

const client = axios.create({
  baseURL: 'localhost:5000',
  timeout: 1000
})

export default client;