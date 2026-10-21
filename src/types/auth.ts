export interface SignupRequest {
  schoolNumber: string;
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export interface SignupResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  // Login API documentation represents this value as the string "true".
  success: boolean | "true";
  data: LoginData;
  message: string;
}

export type LoginErrorCode =
  | "INVALID_CREDENTIALS"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERR";

export type SignupErrorCode =
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_EXISTS"
  | "USERNAME_ALREADY_EXISTS"
  | "PASSWORD_MISMATCH"
  | "SCHOOL_NUMBER_ALREADY_EXISTS"
  | "EMAIL_VERIFICATION_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERR";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface AuthApiError {
  success: false;
  status?: number;
  error: {
    code: LoginErrorCode | SignupErrorCode;
    message: string;
    details?: ValidationErrorDetail[];
  };
}
