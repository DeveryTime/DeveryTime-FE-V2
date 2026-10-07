import { useState, type ChangeEvent } from "react";
import { InputBox } from "../../components/loginPage/inputBox/InputBox";
import {
  BackgroundLayer,
  ContentLayer,
} from "../BackgroundAct/BackgroundActStyle";
import { Background } from "../BackgroundAct/BackgroundAct";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

import {
  SignupWrapper,
  CardBox,
  Title,
  Button,
  Qusetion,
  LinkText,
  QuestionText,
  PasswordArea,
  EyeButton,
  PasswordInput,
  PasswordWrapper,
  QuestionPasswordText,
} from "./loginPageStyle";

export const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleNext = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!trimmedEmail.endsWith("@dsm.hs.kr")) {
      alert("학교 이메일(@dsm.hs.kr)을 입력해주세요.");
      return;
    }

    if (trimmedPassword === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // API 연동 후 로그인 성공 시 페이지 이동
  };

  return (
    <SignupWrapper>
      <BackgroundLayer>
        <Background />
      </BackgroundLayer>

      <ContentLayer>
        <CardBox>
          <Title>로그인</Title>

          <InputBox
            placeholder="이메일"
            ariaLabel="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordWrapper>
            <PasswordArea>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                aria-label="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <EyeButton
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </EyeButton>
            </PasswordArea>

            <QuestionPasswordText>
              <Qusetion>비밀번호를 잊으셨나요?</Qusetion>
              <LinkText to="/FindPassword">여기</LinkText>
            </QuestionPasswordText>
          </PasswordWrapper>

          <Button type="button" onClick={handleNext}>
            다음
          </Button>

          <QuestionText>
            <Qusetion>계정이 없으신가요?</Qusetion>
            <LinkText to="/signup/1">회원가입</LinkText>
          </QuestionText>
        </CardBox>
      </ContentLayer>
    </SignupWrapper>
  );
};
