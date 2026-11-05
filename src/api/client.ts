import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
} from "./authSession";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const client = axios.create({
  baseURL: "/api",
});

let refreshInFlight: Promise<string> | null = null;

const getRequestPath = (url?: string): string =>
  (url?.split("?")[0] ?? "")
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/api(?=\/)/, "")
    .replace(/\/$/, "");

const isPublicAuthRequest = (url?: string): boolean => {
  const requestPath = getRequestPath(url);
  return requestPath === "/auth/login" || requestPath === "/auth/reissue";
};

client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  // 로그인과 재발급은 공개 API다. 특히 재발급은 refreshToken을 body로 보낸다.
  if (isPublicAuthRequest(config.url)) {
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

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;
    if (
      !originalRequest ||
      originalRequest._retry ||
      isPublicAuthRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        try {
          const { reissueTokenApi } = await import("./authApi");
          const response = await reissueTokenApi({ refreshToken });
          return response.data.accessToken;
        } catch (refreshError: unknown) {
          if (
            axios.isAxiosError(refreshError) &&
            refreshError.response?.status === 401
          ) {
            clearAuthTokens();
          }
          throw refreshError;
        } finally {
          refreshInFlight = null;
        }
      })();
    }

    try {
      const accessToken = await refreshInFlight;

      // 로그아웃 또는 다른 계정 로그인 도중 끝난 재발급으로 세션을 되살리지 않는다.
      if (getRefreshToken() !== refreshToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return await client(originalRequest);
    } catch (refreshError: unknown) {
      return Promise.reject(refreshError);
    }
  },
);

export default client;
