import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const hasStoredAccessToken = (): boolean => Boolean(getAccessToken());

export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Confirms the session with the server by exchanging the saved refresh token.
// A transient network/server failure is thrown so callers can distinguish it
// from a confirmed signed-out session.
export const checkLoginStatus = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { reissueTokenApi } = await import("./authApi");
    await reissueTokenApi({ refreshToken });
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthTokens();
      return false;
    }

    throw error;
  }
};

// This asynchronous check confirms the session with the server.
export const isLoggedIn = checkLoginStatus;
