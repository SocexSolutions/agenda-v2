import axios from "axios";
import { getCookie } from "../utils/cookie";

const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;
const path = `api`;

const client = axios.create({
  baseURL: `${hostname}/${path}`,
  timeout: 1000,
});

client.interceptors.request.use((config) => {
  config.headers["authorization"] = getCookie("agenda-auth");

  return config;
});

export default client;
