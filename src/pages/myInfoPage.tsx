import { useState } from "react";
import {useNavigate} from "react-router-dom";
import InfoContainer from "../components/info/infoContainer";
import toast from "react-hot-toast";
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
  const navigate = useNavigate();
  // 사용자 정보
  const [user] = useState<User>({
    name: "대마",
    schoolNumber: 1206,
    userName: "dkfjslej",
    email: "1234@example.com",
    profileImageUrl: "",
  });

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    try {
          localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
          } catch (error) {
            console.warn("로그아웃 중 토큰 삭제에 실패했습니다.", error);
            toast.error("로그아웃하지 못했습니다. 다시 시도해 주세요.");
         return;
          }

    toast.success("로그아웃되었습니다.");
    navigate("/login");
  };


  return (
    <S.InfoLayout>
      {/* 왼쪽 메뉴 */}
      <S.Menu>
        <p className="active">내 정보</p>
        <p>내가 쓴 글</p>
        <p>프로필 수정</p>
        <button type="button" onClick={handleLogout}>로그아웃</button>
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
