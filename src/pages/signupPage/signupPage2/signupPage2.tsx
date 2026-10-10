import { useEffect, useState, type ChangeEvent } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import S from "../../BackgroundAct/BackgroundActStyle";
import Background from "../../BackgroundAct/BackgroundAct";
import Signup2S from "../signupPage2/signupPageStyle2";

const SignupPage2 = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [time, setTime] = useState<number>(0);

  // 인증번호 받기
  const handleSendCode = () => {
    if (email.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!email.endsWith("@dsm.hs.kr")) {
      alert("학교 이메일(@dsm.hs.kr)을 입력해주세요.");
      return;
    }

    setVerificationCode("");
    setTime(300);

    // TODO: 백엔드 인증번호 API 연결
    alert("인증번호가 전송되었습니다.");
  };

  // 타이머
  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setVerificationCode("");
          alert("인증번호가 만료되었습니다. 이메일 인증을 다시 해주세요.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  // 인증번호 입력
  const handleVerificationCode = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d{0,6}$/.test(value)) return;

    setVerificationCode(value);
  };

  // 회원가입 버튼
  const handleSignup = () => {
    if (email.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!email.endsWith("@dsm.hs.kr")) {
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

    if (time === 0) {
      alert("인증번호가 만료되었습니다. 이메일 인증을 다시 해주세요.");
      return;
    }

    // TODO: 실제 인증번호 검증 API 연결
    navigate("/signup/3");
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
              onClick={() => navigate(-1)}
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
              onChange={(e) => setEmail(e.target.value)}
            />

            <Signup2S.VerifyButton type="button" onClick={handleSendCode}>
              인증번호 받기
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
                ? handleSignup
                : handleSendCode
            }
          >
            {verificationCode.length === 6
              ? "회원가입"
              : "이메일 인증 다시하기"}
          </Signup2S.Button>

          <Signup2S.QuestionText>
            <Signup2S.Qusetion>
              이미 계정을 가지고 계신가요?
            </Signup2S.Qusetion>

            <Signup2S.LinkText to="/login">로그인</Signup2S.LinkText>
          </Signup2S.QuestionText>
        </Signup2S.CardBox>
      </S.ContentLayer>
    </Signup2S.SignupWrapper>
  );
};

export default SignupPage2;
