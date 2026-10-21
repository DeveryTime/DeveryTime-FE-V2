import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";

const client = axios.create({
  baseURL: "/api",
});

const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

client.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export { setAccessToken, clearAccessToken };
export default client;
