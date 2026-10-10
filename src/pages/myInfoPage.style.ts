import styled from "@emotion/styled";

export const S = {
  // 전체 정보 페이지 레이아웃
  InfoLayout: styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 26px;
  `,

  // 왼쪽 메뉴
  Menu: styled.div`
    border: 1px solid #cbcbcb;
    padding: 7px 5px 10px 8px;
    width: 168px;
    height: 200px;

    p {
      margin: 0;
      padding: 11px 5px;

      font-size: 16px;
      font-weight: 500;
      border-bottom: 2px solid #dddddd;
      cursor: pointer;

      &:hover {
        color: #666;
      }

      &.active {
        color: #555;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  `,

  // 내 정보 영역
  InfoContainer: styled.div`
    position: relative;
    width: min(918px, 100%);
    min-height: 300px;
    padding: 12px 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  `,

  // 제목
  InfoTitle: styled.div`
    font-size: 24px;
    font-weight: 500;
  `,

  // 사용자 정보 영역
  UserInfo: styled.div`
    display: flex;
    gap: 26px;
    padding: 62px 0 32px 0;
    align-items: center;
  `,

  // 프로필 이미지
  ProfileImage: styled.div`
    width: 143px;
    height: 143px;
    border-radius: 50%;
    background-color: #b0c5fd;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      font-size: 14px;
      font-weight: 500;
    }
  `,

  // 사용자 이름과 학번
  UserName: styled.div`
    font-size: 16px;
    font-weight: 500;
  `,

  // 아이디와 이메일
  UserIdEmail: styled.div`
    font-size: 13px;
    font-weight: 500;
    color: #999999;
  `,

  // 오른쪽 영역
  RightContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 28px;
    width: min(918px, 100%);
    min-width: 0;
  `,
};

export default S;
