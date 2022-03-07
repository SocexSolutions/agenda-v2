import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 1000
});

client.interceptors.request.use( config => {
  const token = window.sessionStorage.getItem('agenda-auth');
  config.headers['authorization'] = token;

  return config;

  console.log('bacon');
});

export default client;
