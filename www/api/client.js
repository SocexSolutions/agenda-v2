import axios         from 'axios';
import { getCookie } from '../utils/cookie';

const baseURL = process.env.NODE_ENV === 'development' ?
  'http://localhost:4000/api' :
  'https://meetingminder.com/api';

const client = axios.create({
  baseURL,
  timeout: 1000
});

client.interceptors.request.use( ( config ) => {
  config.headers['authorization'] = getCookie('agenda-auth');

  return config;
});

export default client;
