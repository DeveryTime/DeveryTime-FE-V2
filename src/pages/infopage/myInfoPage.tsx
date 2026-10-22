import { useState } from "react";
import InfoContainer from "../components/info/infoContainer";
import S from "./myInfoPage.style";

// 사용자 정보 타입
type User = {
  profileImageUrl: string;
  name: string;
  schoolNumber: number;
  userName: string;
  email: string;
};

const Info = () => {
  // 사용자 정보
  const [user] = useState<User>({
    name: "대마",
    schoolNumber: 1206,
    userName: "dkfjslej",
    email: "1234@example.com",
    profileImageUrl: "",
  });

  return (
    <S.InfoLayout>
      {/* 왼쪽 메뉴 */}
      <S.Menu>
        <p className="active">내 정보</p>
        <p>내가 쓴 글</p>
        <p>프로필 수정</p>
        <p>로그아웃</p>
      </S.Menu>

      {/* 오른쪽 내용 */}
      <S.RightContainer>
        <S.InfoContainer>
          <S.InfoTitle>내 정보</S.InfoTitle>

          {/* 사용자 정보가 있을 때 표시 */}
          {user && (
            <S.UserInfo>
              <S.ProfileImage>
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="프로필 사진" />
                ) : (
                  <span>프로필 사진</span>
                )}
              </S.ProfileImage>

              <div>
                <S.UserName>
                  {user.name} | {user.schoolNumber}
                </S.UserName>

                <S.UserIdEmail>{user.userName}</S.UserIdEmail>
                <S.UserIdEmail>{user.email}</S.UserIdEmail>
              </div>
            </S.UserInfo>
          )}
        </S.InfoContainer>

        {/* 내가 쓴 글 */}
        <InfoContainer />
      </S.RightContainer>
    </S.InfoLayout>
  );
};

export default Info;
