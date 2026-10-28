import styled from "@emotion/styled";

const StatusMessage = styled.p`
  padding: 24px 12px;
  background: #c6c6c6;
  font-size: clamp(12px, 1.18vw, 16px);
`;

const S = {
  PageContainer: styled.main`
    min-height: 100vh;
    width: min(1354px, 100%);
    margin: 0 auto;
    padding: clamp(8px, 0.9vw, 12px) clamp(12px, 1.2vw, 32px) 38px
      clamp(16px, 2.4vw, 32px);
    color: #111111;
    background: #e9e9e9;
  `,

  Title: styled.h1`
    margin: 0 0 clamp(7px, 1.2vw, 16px);
    font-size: clamp(28px, 3.55vw, 48px);
    font-weight: 500;
    line-height: 1.25;
  `,

  StatusMessage,

  ErrorMessage: styled(StatusMessage)`
    color: #8b1e1e;
  `,
};

export default S;
