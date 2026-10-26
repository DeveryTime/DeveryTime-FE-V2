import client from "./client";
import type {
  CheckUsernameResponse,
  LoginRequest,
  LoginResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  SignupRequest,
  SignupResponse,
  TokenReissueRequest,
  TokenReissueResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types/auth";

const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const loginApi = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", request);
  saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data;
};

export const checkUsernameApi = async (
  username: string,
): Promise<CheckUsernameResponse> => {
  const response = await client.get<CheckUsernameResponse>(
    "/auth/check-username",
    { params: { username } },
  );
  return response.data;
};

export const sendEmailVerificationApi = async (
  request: SendEmailVerificationRequest,
): Promise<SendEmailVerificationResponse> => {
  const response = await client.post<SendEmailVerificationResponse>(
    "/auth/email-verifications",
    request,
  );
  return response.data;
};

export const verifyEmailApi = async (
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const response = await client.post<VerifyEmailResponse>(
    "/auth/email-verifications/verify",
    request,
  );
  return response.data;
};

export const signupApi = async (
  request: SignupRequest,
): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>("/auth/signup", request);
  return response.data;
};

export const reissueTokenApi = async (
  request: TokenReissueRequest,
): Promise<TokenReissueResponse> => {
  const response = await client.post<TokenReissueResponse>(
    "/auth/reissue",
    request,
  );
  saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data;
};