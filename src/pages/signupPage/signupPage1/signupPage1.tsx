import { useState } from "react";
import { useNavigate } from "react-router-dom";
import S from "../../BackgroundAct/BackgroundActStyle";
import Background from "../../BackgroundAct/BackgroundAct";
import  InputBox  from "../../../components/loginPage/inputBox/InputBox";
import SignupS from "./signupPageStyle1";
import { readSignupDraft, saveSignupDraft } from "../signupDraft";

const SignupPage1 = () => {
  const navigate = useNavigate();

  const [schoolNumber, setSchoolNumber] = useState<string>(() => readSignupDraft().schoolNumber ?? "");
  const [name, setName] = useState<string>(() => readSignupDraft().name ?? "");
  const [username, setUsername] = useState<string>(() => readSignupDraft().username ?? "");

  const handleNext = (): void => {
    // 학번 검사
    if (schoolNumber.trim() === "") {
      alert("학번을 입력해주세요.");
      return;
    }

    if (!/^\d{4}$/.test(schoolNumber)) {
      alert("자신의 현재 4자리 학번을 입력해주세요.");
      return;
    }

    // 이름 검사
    if (name.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!/^[가-힣]+$/.test(name)) {
      alert("이름은 한글로 입력해주세요.");
      return;
    }

    if (name.length > 30) {
      alert("이름은 30자 이하로 입력해주세요.");
      return;
    }

    // 아이디 검사
    if (username.trim() === "") {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (username.length > 10) {
      alert("아이디는 10자 이하로 입력해주세요.");
      return;
    }

    // 회원가입 단계 연결: 1단계 입력을 저장한 뒤 이메일 인증 단계로 이동합니다.
    saveSignupDraft({
      schoolNumber: schoolNumber.trim(),
      name: name.trim(),
      username: username.trim(),
    });
    navigate("/signup/2");
  };

  return (
    <SignupS.SignupWrapper>
      <S.BackgroundLayer>
        <Background />
      </S.BackgroundLayer>

      <S.ContentLayer>
        <SignupS.CardBox>
          <SignupS.Title>회원가입</SignupS.Title>

          <InputBox
            placeholder="학번"
            ariaLabel="학번"
            value={schoolNumber}
            onChange={(e) => {
              const value = e.target.value;
              setSchoolNumber(value);
              // 회원가입 단계 연결: 입력 중에도 1단계 정보를 임시 저장합니다.
              saveSignupDraft({ schoolNumber: value });
            }}
          />

          <InputBox
            placeholder="이름"
            ariaLabel="이름"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              saveSignupDraft({ name: value });
            }}
          />

          <InputBox
            placeholder="아이디"
            ariaLabel="아이디"
            value={username}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
              saveSignupDraft({ username: value });
            }}
          />

          <SignupS.Button type="button" onClick={handleNext}>
            다음
          </SignupS.Button>

          <SignupS.QuestionText>
            <SignupS.Qusetion>
              이미 계정을 가지고 계신가요?
            </SignupS.Qusetion>
            <SignupS.LinkText to="/login">
              로그인
            </SignupS.LinkText>
          </SignupS.QuestionText>
        </SignupS.CardBox>
      </S.ContentLayer>
    </SignupS.SignupWrapper>
  );
};

export default SignupPage1;
