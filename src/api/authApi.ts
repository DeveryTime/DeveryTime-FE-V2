import client from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/auth";

export const loginApi = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", request);
  const { accessToken, refreshToken } = response.data.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
};

export const signupApi = async (request: SignupRequest): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>("/auth/signup", request);
  return response.data;
};
