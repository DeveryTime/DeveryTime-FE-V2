import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";
import { Link } from "react-router-dom";


const SignupS = {
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
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 660px;
    height: 700px;
    padding: 32px 48px;
    background-color: #ffffff;
    gap: 48px;
    box-sizing: border-box;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.12);
    border-radius: 15px;
  `,

  Title: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 48px;
    flex: 0 0 48px;
    color: #000000;
    font-family: Pretendard;
    font-style: Bold;
    font-size: 36px;
    font-weight: 700;
  `,

  Button: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 564px;
    height: 64px;
    background-color: ${colors.blue[400]};
    border-radius: 15px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 500;
    font-style: Medium;
    font-family: Pretendard;
  `,

  LinkText: styled(Link)`
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    font-style: Bold;
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
    font-style: Medium;
    font-family: Pretendard;
  `,

  QuestionText: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  `,
};

export default SignupS;
