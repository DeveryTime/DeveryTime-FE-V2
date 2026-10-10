import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";
import { Link } from "react-router-dom";

const Signup3S = {
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
    gap: 28px;
    box-shadow: 6px 4px 12px 8px #00000040;
    border-radius: 15px;
  `,

  TopArea: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  `,

  BackButton: styled.button`
    position: absolute;
    left: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    background-color: transparent;
    font-size: 40px;
    cursor: pointer;
  `,

  Title: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000000;
    font-family: Pretendard;
    font-size: 36px;
    font-weight: 700;
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
  `,

  PasswordText: styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    width: 564px;
    margin-top: -15px;
    color: #606060;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
  `,

  Button: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 564px;
    height: 64px;
    margin-top: 20px;
    padding: 0;
    border: none;
    border-radius: 15px;
    background-color: ${colors.blue[400]};
    color: #ffffff;
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background-color: ${colors.blue[500]};
    }
  `,

  LinkText: styled(Link)`
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    font-family: Pretendard;
    text-decoration: underline;
    text-underline-offset: 6px;
  `,

  Qusetion: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    font-family: Pretendard;
  `,

  QuestionText: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  `,
};

export default Signup3S;
