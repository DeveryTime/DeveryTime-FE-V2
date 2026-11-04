import axios from "axios";
import { getAccessToken } from "./authSession";

const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use((config) => {
  const requestPath = config.url?.split("?")[0].replace(/\/$/, "");

  // 로그인은 토큰을 발급받기 전의 공개 요청이므로 기존 토큰을 보내지 않는다.
  if (requestPath === "/auth/login") {
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
