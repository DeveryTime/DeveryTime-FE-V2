import React, { useState, useRef, useEffect } from "react";
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

  // 임시 사용자 데이터
  const [user, setUser] = useState<User | null>({
    name: "대마",
    schoolNumber: "20241234",
    username: "dfs123",
    email: "1234@example.com",
    profileImageUrl: "",
  });

  // 수정할 아이디
  const [username, setUsername] = useState(user?.username ?? "");

  // 새로 선택한 프로필 이미지 파일
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  // 이미지 미리보기 URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 파일 input에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 파일이 변경될 때 미리보기 URL 생성 및 해제
  useEffect(() => {
    if (!newProfileImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(newProfileImage);
    setPreviewUrl(objectUrl);

    // 이미지가 변경되거나 컴포넌트가 사라질 때 URL 해제
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [newProfileImage]);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    toast.success("로그아웃되었습니다.");
    navigate("/login");
  };

  // 아이디가 변경되었는지 확인
  const canSave =
    Boolean(user) &&
    username.trim() !== user?.username &&
    username.trim().length > 0 &&
    username.trim().length <= 10;

  // 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewProfileImage(file);
    }
  };

  // 아이디 변경사항 저장
  const handleSave = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    if (trimmedUsername.length > 10) {
      toast.error("아이디는 1~10글자 이내로 입력해주세요.");
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
    <S.ProfileLayout>
      {/* 왼쪽 메뉴 */}
      <S.Menu>
        <p>내 정보</p>
        <p>내가 쓴 글</p>
        <p className="active">프로필 수정</p>

        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </S.Menu>

      {/* 프로필 수정 영역 */}
      <S.ProfileContainer>
        <S.ProfileTitle>프로필 수정</S.ProfileTitle>

        {/* 사용자 정보 */}
        {user && (
          <S.UserInfo>
            {/* 프로필 이미지 */}
            <S.ProfileImage
              role="button"
              tabIndex={0}
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="프로필 이미지 미리보기" />
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
              aria-label="프로필 이미지 파일 선택"
              style={{ display: "none" }}
              onChange={handleImageChange}
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
  );
};

export default Profile;
