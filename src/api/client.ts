import axios, { type InternalAxiosRequestConfig } from "axios";

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

const isAllowedApiRequest = (config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined" || !config.url) {
    return false;
  }

  try {
    const pageOrigin = window.location.origin;

    const apiBaseUrl = new URL(
      config.baseURL ?? client.defaults.baseURL ?? pageOrigin,
      pageOrigin,
    );

    const requestUrl = new URL(client.getUri(config), pageOrigin);

    const apiPath = apiBaseUrl.pathname.replace(/\/$/, "");

    return (
      requestUrl.origin === apiBaseUrl.origin &&
      (apiPath === "" ||
        requestUrl.pathname === apiPath ||
        requestUrl.pathname.startsWith(`${apiPath}/`))
    );
  } catch {
    return false;
  }
};

client.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken && isAllowedApiRequest(config)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export { setAccessToken, clearAccessToken };
export default client;
