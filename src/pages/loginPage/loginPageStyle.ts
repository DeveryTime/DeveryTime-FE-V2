import styled from "@emotion/styled";
import colors from "../../styles/tokens/colors";
import { Link } from "react-router-dom";

const LoginS = {
  SignupWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background-color: ${colors.blue[50]};
  `,

  CardBox: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 660px;
    height: 700px;
    background-color: #ffffff;
    gap: 64px;
    box-shadow: 6px 4px 12px 8px #00000040;
    border-radius: 15px;
  `,

  Title: styled.h1`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000000;
    font-family: Pretendard;
    font-size: 36px;
    font-weight: 700;
  `,

  Button: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 564px;
    height: 64px;
    padding: 0;
    border: none;
    background-color: ${colors.blue[400]};
    border-radius: 15px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 500;
    font-family: Pretendard;
    cursor: pointer;

    &:hover {
      background-color: ${colors.blue[500]};
    }
  `,

  LinkText: styled(Link)`
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    font-family: Pretendard;
    text-decoration: underline;
    text-underline-offset: 6px;
  `,

  Qusetion: styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    font-family: Pretendard;
  `,

  QuestionText: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  `,

  QuestionPasswordText: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    margin-top: 10px;
    width: 564px;
    color: #333333;
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
  `,

  PasswordArea: styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 564px;
    height: 64px;
    border-bottom: 2px solid #6f6f6f;
  `,

  PasswordInput: styled.input`
    width: 100%;
    height: 64px;
    padding: 0;
    padding-right: 45px;
    border: none;
    outline: none;
    color: #333333;
    font-family: Pretendard;
    font-size: 24px;

    &::placeholder {
      color: #6f6f6f;
    }
  `,

  EyeButton: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 5px;
    padding: 0;
    border: none;
    background-color: transparent;
    color: #6f6f6f;
    font-size: 24px;
    cursor: pointer;

    &:hover {
      color: #333333;
    }
  `,

  PasswordWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
  `,
};

export default LoginS;