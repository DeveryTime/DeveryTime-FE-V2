import client from "./client";

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  CheckUsernameResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types/auth";

// 로그인
export const loginApi = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", data);

  localStorage.setItem("accessToken", response.data.data.accessToken);
  localStorage.setItem("refreshToken", response.data.data.refreshToken);

  return response.data;
};

// 아이디 중복 확인
export const checkUsernameApi = async (
  username: string,
): Promise<CheckUsernameResponse> => {
  const response = await client.get<CheckUsernameResponse>(
    "/auth/check-username",
    { params: { username } },
  );

  return response.data;
};

// 이메일 인증번호 발송
export const sendEmailVerificationApi = async (
  data: SendEmailVerificationRequest,
): Promise<SendEmailVerificationResponse> => {
  const response =
    await client.post<SendEmailVerificationResponse>(
      "/auth/email-verifications",
      data,
    );

  return response.data;
};

// 이메일 인증번호 확인
export const verifyEmailApi = async (
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const response = await client.post<VerifyEmailResponse>(
    "/auth/email-verifications/verify",
    data,
  );

  return response.data;
};

// 회원가입
export const signupApi = async (
  data: SignupRequest,
): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>("/auth/signup", data);

  return response.data;
};
