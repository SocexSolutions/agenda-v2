import axios       from 'axios';
import parseCookie from '../utils/parseCookie';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 1000
});

client.interceptors.request.use( config => {
  config.headers['authorization'] = parseCookie(
    document.cookie,
    'agenda-auth'
  );

  return config;
});

export default client;
