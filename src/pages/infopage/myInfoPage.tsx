import { useEffect, useState } from "react";
import InfoContainer from "../../components/info/infoContainer";
import toast from "react-hot-toast";
import profileApi from "../../api/profile/profile.api";
import getApiErrorMessage from "../../api/errorMessages";
import type { ProfileData } from "../../api/profile/profile.types";
import S from "./myInfoPage.style";
import {useNavigate} from "react-router-dom";

const Info = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.warn("로그아웃 중 토큰 삭제에 실패했습니다.", error);
      toast.error("로그아웃하지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    toast.custom(<S.LogoutToast>로그아웃 되었습니다.</S.LogoutToast>);
    navigate("/login");
  };

  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const profile = await profileApi.getMyProfile();

        if (isActive) {
          setUser(profile);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getApiErrorMessage(
              requestError,
              "사용자 정보를 불러오지 못했습니다.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <S.InfoLayout>
      {/* 왼쪽 메뉴 */}
      <S.Menu>
        <p className="active">내 정보</p>
        <p>내가 쓴 글</p>
        <p>프로필 수정</p>
        <button onClick={handleLogout}>로그아웃</button>
      </S.Menu>

      {/* 오른쪽 내용 */}
      <S.RightContainer>
        <S.InfoContainer>
          <S.InfoTitle>내 정보</S.InfoTitle>

          {isLoading && <p>사용자 정보를 불러오는 중입니다...</p>}
          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && user && (
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
