import axios from "axios";
import { getAccessToken } from "./authSession";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  // Login is a public endpoint. A stale token left in localStorage must not
  // be sent with the credentials used to establish a new session.
  if (config.url === "/auth/login") {
    delete config.headers.Authorization;
    return config;
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default client;