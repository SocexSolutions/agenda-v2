import axios from 'axios';
import { getCookie } from '../utils/cookie';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 1000
});

client.interceptors.request.use( ( config ) => {
  config.headers['authorization'] = getCookie('agenda-auth');

  return config;
});

export default client;
