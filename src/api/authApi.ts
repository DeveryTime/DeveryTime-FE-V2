import client from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenReissueRequest,
  TokenReissueResponse,
} from "../types/auth";

const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const loginApi = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", request);
  saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data;
};

export const signupApi = async (request: SignupRequest): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>("/auth/signup", request);
  return response.data;
};

export const reissueTokenApi = async (
  request: TokenReissueRequest,
): Promise<TokenReissueResponse> => {
  const response = await client.post<TokenReissueResponse>("/auth/reissue", request);
  saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data;
};
