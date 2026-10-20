import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { IoMdLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import S from "../../BackgroundAct/BackgroundActStyle";
import Background from "../../BackgroundAct/BackgroundAct";
import Signup3S from "./signupPageStyle3";

const SignupPage3 = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  const handleSignup = () => {
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

    // TODO: 백엔드 회원가입 API 연결
    alert("회원가입이 완료되었습니다.");
    navigate("/main");
  };

  return (
    <Signup3S.SignupWrapper>
      <S.BackgroundLayer>
        <Background />
      </S.BackgroundLayer>

      <S.ContentLayer>
        <Signup3S.CardBox>
          <Signup3S.TopArea>
            <Signup3S.BackButton
              type="button"
              aria-label="이전 페이지"
              onClick={() => navigate(-1)}
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

          <Signup3S.Button type="button" onClick={handleSignup}>
            회원가입
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
