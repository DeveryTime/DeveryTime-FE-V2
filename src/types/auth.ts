export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  schoolNumber: string;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  // The API documentation has represented this value as both true and "true".
  success: boolean | "true";
  data: LoginData;
  message: string;
}

export interface SignupResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface CheckUsernameResponse {
  success: boolean;
  data: { available: null };
  message: string;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface SendEmailVerificationResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface TokenReissueRequest {
  refreshToken: string;
}

export interface TokenReissueResponse {
  success: boolean;
  data: LoginData;
  message?: string;
}

export type LoginErrorCode =
  | "INVALID_CREDENTIALS"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "INTERNAL_SERVER_ERR";

export type SignupErrorCode =
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_EXISTS"
  | "USERNAME_ALREADY_EXISTS"
  | "PASSWORD_MISMATCH"
  | "SCHOOL_NUMBER_ALREADY_EXISTS"
  | "EMAIL_VERIFICATION_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "INTERNAL_SERVER_ERR";

export type TokenErrorCode = "TOKEN_INVALID";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface AuthApiError {
  success: false;
  status?: number;
  error: {
    code: LoginErrorCode | SignupErrorCode | TokenErrorCode;
    message: string;
    details?: ValidationErrorDetail[];
  };
}