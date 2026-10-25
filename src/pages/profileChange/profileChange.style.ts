import styled from "@emotion/styled";

const S = {
  ProfileLayout: styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 26px;
  `,

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

  ProfileContainer: styled.div`
    position: relative;
    width: 918px;
    min-height: 700px;
    padding: 12px 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  `,

  ProfileTitle: styled.p`
    font-size: 24px;
    font-weight: 500;
  `,

  UserInfo: styled.div`
    display: flex;
    gap: 26px;
    padding: 62px 0 32px;
    align-items: center;
  `,

  UserName: styled.p`
    font-size: 16px;
    font-weight: 500;
  `,

  UserIdEmail: styled.p`
    font-size: 13px;
    font-weight: 500;
    color: #999999;
  `,
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

  NameInput: styled.input`
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid #999999;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    color: #999999;

    &:focus {
      outline: none;
      border-color: #111;
    }
  `,

  Id: styled.p`
    font-size: 17px;
    font-weight: 500;
    padding: 0 0 8px;
    color: #999999;
  `,

  SaveBtn: styled.button`
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    width: 210px;
    padding: 11px 55px;
    box-sizing: border-box;
    border: none;
    border-radius: 25px;
    background: #3469f9;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      background: #2855d9;
    }

    &:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
    }
  `,
};

export default S;
