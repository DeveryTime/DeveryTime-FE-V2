import { useEffect, useState, type ChangeEvent } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import S from "../../BackgroundAct/BackgroundActStyle";
import Background from "../../BackgroundAct/BackgroundAct";
import Signup2S from "../signupPage2/signupPageStyle2";
import {
  sendEmailVerificationApi,
  verifyEmailApi,
} from "../../../api/authApi";
import type { AuthApiError } from "../../../types/auth";
import { readSignupDraft, saveSignupDraft } from "../signupDraft";

const VERIFICATION_DURATION_SECONDS = 3 * 60;

const isValidSchoolEmail = (value: string) => {
  const [localPart, domain, ...extraParts] = value.trim().split("@");

  return Boolean(
    localPart &&
      /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart) &&
      !localPart.startsWith(".") &&
      !localPart.endsWith(".") &&
      !localPart.includes("..") &&
      domain?.toLowerCase() === "dsm.hs.kr" &&
      extraParts.length === 0,
  );
};

const SignupPage2 = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>(
    () => readSignupDraft().email ?? "",
  );
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 인증번호 받기
  const handleSendCode = async () => {
    if (isSending) return;

    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!isValidSchoolEmail(trimmedEmail)) {
      alert("학교 이메일(@dsm.hs.kr)을 입력해주세요.");
      return;
    }

    setIsSending(true);

    try {
      await sendEmailVerificationApi({ email: trimmedEmail });

      saveSignupDraft({
        email: trimmedEmail,
        emailVerified: false,
      });

      setVerificationCode("");
      // 인증번호 발송 API가 성공한 뒤 3분(180초) 타이머를 시작합니다.
      setTime(VERIFICATION_DURATION_SECONDS);
      alert("인증번호가 전송되었습니다.");
    } catch (error: unknown) {
      const message = axios.isAxiosError<AuthApiError>(error)
        ? error.response?.data.error.message
        : undefined;

      alert(message ?? "인증번호 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  // 타이머: 인증번호 발급 성공 후 매초 남은 시간을 줄입니다.
  useEffect(() => {
    if (time <= 0) return;

    const timer = window.setTimeout(() => {
      setTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [time]);

  // 인증번호 만료 처리
  useEffect(() => {
    if (time !== 0) return;

    setVerificationCode("");
  }, [time]);

  // 남은 시간 표시
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  // 인증번호 입력: 숫자 6자리
  const handleVerificationCode = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d{0,6}$/.test(value)) return;

    setVerificationCode(value);
  };

  // 이메일 인증
  const handleVerifyEmail = async () => {
    if (isVerifying) return;

    if (email.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!isValidSchoolEmail(email)) {
      alert("학교 이메일(@dsm.hs.kr)을 입력해주세요.");
      return;
    }

    if (verificationCode === "") {
      alert("인증번호를 입력해주세요.");
      return;
    }

    if (verificationCode.length !== 6) {
      alert("인증번호 6자리를 입력해주세요.");
      return;
    }

    if (time <= 0) {
      alert("인증번호가 만료되었습니다. 이메일 인증을 다시 해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyEmailApi({
        email: email.trim(),
        code: verificationCode,
      });

      saveSignupDraft({
        email: email.trim(),
        emailVerified: true,
      });

      setTime(0);
      navigate("/signup/3");
    } catch (error: unknown) {
      const message = axios.isAxiosError<AuthApiError>(error)
        ? error.response?.data.error.message
        : undefined;

      alert(message ?? "이메일 인증에 실패했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Signup2S.SignupWrapper>
      <S.BackgroundLayer>
        <Background />
      </S.BackgroundLayer>

      <S.ContentLayer>
        <Signup2S.CardBox>
          <Signup2S.TopArea>
            <Signup2S.BackButton
              type="button"
              aria-label="이전 페이지"
              onClick={() => navigate("/signup")}
            >
              <IoIosArrowBack />
            </Signup2S.BackButton>

            <Signup2S.Title>회원가입</Signup2S.Title>
          </Signup2S.TopArea>

          <Signup2S.EmailArea>
            <Signup2S.EmailInput
              type="email"
              placeholder="이메일"
              aria-label="이메일"
              value={email}
              onChange={(e) => {
                const nextEmail = e.target.value;

                setEmail(nextEmail);
                setVerificationCode("");
                setTime(0);

                saveSignupDraft({
                  email: nextEmail.trim(),
                  emailVerified: false,
                });
              }}
            />

            <Signup2S.VerifyButton
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
            >
              {isSending ? "전송 중..." : "인증번호 받기"}
            </Signup2S.VerifyButton>
          </Signup2S.EmailArea>

          <Signup2S.VerificationArea>
            <Signup2S.VerificationInput
              type="text"
              inputMode="numeric"
              placeholder="인증번호 입력"
              aria-label="인증번호"
              value={verificationCode}
              onChange={handleVerificationCode}
              maxLength={6}
            />

            <Signup2S.Timer>{formattedTime}</Signup2S.Timer>
          </Signup2S.VerificationArea>

          <Signup2S.VerificationText>
            인증번호 6자리를 입력하세요
          </Signup2S.VerificationText>

          <Signup2S.Button
            type="button"
            onClick={
              verificationCode.length === 6
                ? handleVerifyEmail
                : handleSendCode
            }
            disabled={isSending || isVerifying}
          >
            {verificationCode.length === 6
              ? isVerifying
                ? "확인 중..."
                : "인증하기"
              : "이메일 인증 다시하기"}
          </Signup2S.Button>

          <Signup2S.QuestionText>
            <Signup2S.Qusetion>
              이미 계정을 가지고 계신가요?
            </Signup2S.Qusetion>

            <Signup2S.LinkText to="/login">
              로그인
            </Signup2S.LinkText>
          </Signup2S.QuestionText>
        </Signup2S.CardBox>
      </S.ContentLayer>
    </Signup2S.SignupWrapper>
  );
};

export default SignupPage2;
