import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { IoMdLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import S from "../../BackgroundAct/BackgroundActStyle";
import Background from "../../BackgroundAct/BackgroundAct";
import Signup3S from "./signupPageStyle3";
import axios from "axios";
import { signupApi } from "../../../api/authApi";
import type { AuthApiError, SignupRequest } from "../../../types/auth";
import { clearSignupDraft, readSignupDraft } from "../signupDraft";

const SignupPage3 = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (password === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      alert("비밀번호는 8~20자리여야 합니다.");
      return;
    }

    if (passwordConfirm === "") {
      alert("비밀번호 재확인을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 단계 연결: 앞 단계의 임시 데이터와 현재 비밀번호를 합쳐 한 번에 가입 요청합니다.
    const draft = readSignupDraft();
    if (!draft.schoolNumber || !draft.name || !draft.username || !draft.email || !draft.emailVerified) {
      alert("회원가입 정보 또는 이메일 인증이 누락되었습니다. 처음부터 다시 진행해주세요.");
      navigate("/signup");
      return;
    }

    const signupData: SignupRequest = {
      schoolNumber: draft.schoolNumber,
      name: draft.name,
      username: draft.username,
      email: draft.email,
      password,
      passwordConfirm,
    };

    setIsSubmitting(true);
    try {
      await signupApi(signupData);
      clearSignupDraft();
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError<AuthApiError>(error)
        ? error.response?.data.error.message
        : undefined;
      alert(message ?? "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Signup3S.SignupWrapper>
      <S.BackgroundLayer>
        <Background />
      </S.BackgroundLayer>

      <S.ContentLayer>
        <Signup3S.CardBox>
          <Signup3S.TopArea>
            {/* 회원가입 단계 연결: 비밀번호 수정 후에도 이전 입력 단계로 돌아갈 수 있습니다. */}
            <Signup3S.BackButton
              type="button"
              aria-label="이전 페이지"
              onClick={() => navigate("/signup/2")}
            >
              <IoIosArrowBack />
            </Signup3S.BackButton>

            <Signup3S.Title>회원가입</Signup3S.Title>
          </Signup3S.TopArea>

          <Signup3S.PasswordArea>
            <Signup3S.PasswordInput
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              aria-label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Signup3S.EyeButton
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </Signup3S.EyeButton>
          </Signup3S.PasswordArea>

          <Signup3S.PasswordText>
            <IoMdLock />
            비밀번호는 최소 8자리 이상이어야 합니다.
          </Signup3S.PasswordText>

          <Signup3S.PasswordArea>
            <Signup3S.PasswordInput
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호 재확인"
              aria-label="비밀번호 재확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <Signup3S.EyeButton
              type="button"
              aria-label={
                showPasswordConfirm
                  ? "비밀번호 재확인 숨기기"
                  : "비밀번호 재확인 표시"
              }
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
            >
              {showPasswordConfirm ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </Signup3S.EyeButton>
          </Signup3S.PasswordArea>

          <Signup3S.Button type="button" onClick={handleSignup} disabled={isSubmitting}>
            {isSubmitting ? "가입 중..." : "회원가입"}
          </Signup3S.Button>

          <Signup3S.QuestionText>
            <Signup3S.Qusetion>
              이미 계정을 가지고 계신가요?
            </Signup3S.Qusetion>

            <Signup3S.LinkText to="/login">로그인</Signup3S.LinkText>
          </Signup3S.QuestionText>
        </Signup3S.CardBox>
      </S.ContentLayer>
    </Signup3S.SignupWrapper>
  );
};

export default SignupPage3;
