import styled from "@emotion/styled";

const StatusMessage = styled.p`
  // 로딩·오류 상태 안내 문구
  padding: 24px 12px;
  background: transparent;
  color: #000000;
  font-size: clamp(12px, 1.18vw, 16px);
`;

const S = {
  PageContainer: styled.main`
    // 내가 쓴 글 페이지 전체 영역
    min-height: 100vh;
    width: min(1354px, 100%);
    margin: 0 auto;
    padding: 26px clamp(12px, 1.2vw, 32px) 38px
      clamp(16px, 2.4vw, 32px);
    color: #000000;
    background: transparent;
  `,

  PageHeader: styled.div`
    // 뒤로가기 버튼과 페이지 제목 배치
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: clamp(7px, 1.2vw, 16px);
  `,

  BackButton: styled.button`
    // 이전 페이지로 이동하는 버튼
    position: relative;
    left: -32px;
    padding: 0;
    color: #000000;
    background: transparent;
    font-size: 16px;
    line-height: 1.4;

    &:hover {
      color: #555555;
    }

    &:focus-visible {
      outline: 2px solid #000000;
      outline-offset: 2px;
    }
  `,

  Title: styled.h1`
    // 페이지 제목
    margin: 0;
    font-size: clamp(28px, 3.55vw, 48px);
    font-weight: 500;
    line-height: 1.25;
  `,

  StatusMessage,

  ErrorMessage: styled(StatusMessage)`
    color: #000000;
  `,
};

export default S;
