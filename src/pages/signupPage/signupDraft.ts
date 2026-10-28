import type { SignupRequest } from "../../types/auth";

export type SignupDraft = Pick<
  SignupRequest,
  "schoolNumber" | "name" | "username" | "email"
> & { emailVerified?: boolean };

const SIGNUP_DRAFT_KEY = "signupDraft";

// 회원가입 단계 연결: 단계 이동 사이에 입력값을 보관합니다. 흐름을 제거할 때 이 파일도 함께 제거하세요.
export const readSignupDraft = (): Partial<SignupDraft> => {
  try {
    return JSON.parse(sessionStorage.getItem(SIGNUP_DRAFT_KEY) ?? "{}") as Partial<SignupDraft>;
  } catch {
    return {};
  }
};

export const saveSignupDraft = (draft: Partial<SignupDraft>) => {
  sessionStorage.setItem(
    SIGNUP_DRAFT_KEY,
    JSON.stringify({ ...readSignupDraft(), ...draft }),
  );
};

export const clearSignupDraft = () => {
  sessionStorage.removeItem(SIGNUP_DRAFT_KEY);
};
