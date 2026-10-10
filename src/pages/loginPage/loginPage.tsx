import { useState } from "react";
import  InputBox  from "../../components/loginPage/inputBox/InputBox";
import S from "../BackgroundAct/BackgroundActStyle";
import Background from "../BackgroundAct/BackgroundAct";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import LoginS from "./loginPageStyle";

const LoginPage = () => {
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
    <LoginS.SignupWrapper>
      <S.BackgroundLayer>
        <Background />
      </S.BackgroundLayer>

      <S.ContentLayer>
        <LoginS.CardBox>
          <LoginS.Title>로그인</LoginS.Title>

          <InputBox
            placeholder="이메일"
            ariaLabel="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <LoginS.PasswordWrapper>
            <LoginS.PasswordArea>
              <LoginS.PasswordInput
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                aria-label="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <LoginS.EyeButton
                type="button"
                aria-label={
                  showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </LoginS.EyeButton>
            </LoginS.PasswordArea>

            <LoginS.QuestionPasswordText>
              <LoginS.Qusetion>비밀번호를 잊으셨나요?</LoginS.Qusetion>
              <LoginS.LinkText to="/FindPassword">여기</LoginS.LinkText>
            </LoginS.QuestionPasswordText>
          </LoginS.PasswordWrapper>

          <LoginS.Button type="button" onClick={handleNext}>
            다음
          </LoginS.Button>

          <LoginS.QuestionText>
            <LoginS.Qusetion>계정이 없으신가요?</LoginS.Qusetion>
            <LoginS.LinkText to="/signup/1">회원가입</LoginS.LinkText>
          </LoginS.QuestionText>
        </LoginS.CardBox>
      </S.ContentLayer>
    </LoginS.SignupWrapper>
  );
};
