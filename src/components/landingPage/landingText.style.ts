import styled from "@emotion/styled";

export const S = {
  Text: styled.div`
    font-size: 56px;
    font-weight: 700;
  `,

  Text1: styled.div`
    position: absolute;
    top: 451px;
    left: 768px;
  `,

  Text2: styled.div`
    position: absolute;
    top: 1600px;
    left: 100px;
  `,

  Text3: styled.div`
    position: absolute;
    top: 2843px;
    left: 707px;
  `,

  Text4: styled.div`
    position: absolute;
    top: 4163px;
    left: 224px;
  `,

  StartBtn: styled.button`
    position: absolute;
    top: 4650px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    font-weight: 700;
    border: none;
    border-radius: 75px;
    background-color: #3469f9;
    padding: 32px 121px 33px 121px;
    cursor: pointer;
    color: #fff;

    &:hover {
      background: #2855d9;
    }
  `,
};

export default S;
