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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: min(660px, calc(100% - 32px));
    min-height: 700px;
    height: auto;
    box-sizing: border-box;
    padding: 32px 24px;
    background-color: #ffffff;
    gap: clamp(24px, 5vw, 64px);
    box-shadow: 6px 4px 12px 8px #00000040;
    border-radius: 15px;
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

  Button: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(564px, 100%);
    box-sizing: border-box;
    height: 64px;
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
    max-width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 8px;
    text-align: center;
  `,
};

export default SignupS;