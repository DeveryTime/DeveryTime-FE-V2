import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import S from "./profileChange.style";

type User = {
  name: string;
  schoolNumber: string;
  username: string;
  email: string;
  profileImageUrl: string;
};

const Profile = () => {
  const navigate = useNavigate();

  // 로그아웃
  const Logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    toast.success("로그아웃되었습니다.");
    navigate("/login");
  };

  // 임시 사용자 데이터
  const [user, setUser] = useState<User | null>({
    name: "대마",
    schoolNumber: "20241234",
    username: "dfs123",
    email: "1234@example.com",
    profileImageUrl: "",
  });

  // 수정할 아이디
  const [username, setUsername] = useState("hong123");

  // 아이디가 변경되었는지 확인
  const canSave =
    username.trim() !== user?.username &&
    Boolean(user) &&
    username.trim().length <= 10 &&
    username.trim().length > 0;

  // 새로 선택한 프로필 이미지
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 변경
  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewProfileImage(file);
    }
  };

  // 변경사항 저장
  const handleSave = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error("아이디를 입력해주세요");
      return;
    }

    if (trimmedUsername.length > 10) {
      toast.error("아이디는 1 ~ 10글자 이내로 입력해주세요");
      return;
    }

    if (!user) return;

    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      return {
        ...prevUser,
        username: trimmedUsername,
      };
    });

    setUsername(trimmedUsername);
    toast.success("변경사항이 저장되었습니다.");
  };

  return (
    <>
      {/* 전체 레이아웃 */}
      <S.ProfileLayout>
        {/* 왼쪽 메뉴 */}
        <S.Menu>
          <p>내 정보</p>
          <p>내가 쓴 글</p>
          <p className="active">프로필 수정</p>
          <p onClick={Logout}>로그아웃</p>
        </S.Menu>

        {/* 프로필 수정 영역 */}
        <S.ProfileContainer>
          <S.ProfileTitle>프로필 수정</S.ProfileTitle>

          {/* 사용자 정보 */}
          {user && (
            <S.UserInfo>
              {/* 프로필 이미지 */}
              <S.ProfileImage onClick={() => fileInputRef.current?.click()}>
                {newProfileImage ? (
                  <img
                    src={URL.createObjectURL(newProfileImage)}
                    alt="프로필 이미지"
                  />
                ) : user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="프로필 이미지" />
                ) : (
                  <span>프로필 이미지</span>
                )}
              </S.ProfileImage>
              {/* 숨겨진 이미지 선택 input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={imageChange}
              />

              <div>
                <S.UserName>
                  {user.name} | {user.schoolNumber}
                </S.UserName>
                <S.UserIdEmail>{user.username}</S.UserIdEmail>
                <S.UserIdEmail>{user.email}</S.UserIdEmail>
              </div>
            </S.UserInfo>
          )}

          {/* 아이디 수정 */}
          <div>
            <S.Id>아이디</S.Id>

            <S.NameInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="10글자 이내로 입력해 주세요"
            />
          </div>

          {/* 저장 버튼 */}
          <S.SaveBtn onClick={handleSave} disabled={!canSave}>
            변경사항 저장
          </S.SaveBtn>
        </S.ProfileContainer>
      </S.ProfileLayout>
    </>
  );
};

export default Profile;
