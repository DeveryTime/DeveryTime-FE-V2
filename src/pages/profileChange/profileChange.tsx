import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import getApiErrorMessage from "../../api/errorMessages";
import profileApi from "../../api/profile/profile.api";
import type { ProfileData } from "../../api/profile/profile.types";
import S from "./profileChange.style";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 수정할 아이디
  const [username, setUsername] = useState("");

  // 이미지 미리보기 URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  // 파일 input에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrlRef = useRef<string | null>(null);

  // 컴포넌트가 사라질 때 현재 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const profile = await profileApi.getMyProfile();

        if (isActive) {
          setUser(profile);
          setUsername(profile.userName);
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

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    toast.success("로그아웃되었습니다.");
    navigate("/login");
  };

  const trimmedUsername = username.trim();
  const isUsernameValid =
    trimmedUsername.length > 0 && trimmedUsername.length <= 10;
  const hasUsernameChanged = trimmedUsername !== user?.userName;
  const canSave =
    Boolean(user) &&
    !isLoading &&
    !isSaving &&
    isUsernameValid &&
    (hasUsernameChanged || Boolean(newProfileImage));

  // 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      previewUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      setNewProfileImage(file);
    }
  };

  // 프로필 변경사항 저장
  const handleSave = async () => {
    if (!trimmedUsername) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    if (trimmedUsername.length > 10) {
      toast.error("아이디는 1~10글자 이내로 입력해주세요.");
      return;
    }

    if (!user) return;

    setIsSaving(true);

    try {
      await profileApi.updateMyProfile({
        username: trimmedUsername,
        deleteProfileImage: false,
        ...(newProfileImage ? { profileImage: newProfileImage } : {}),
      });

      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              userName: trimmedUsername,
              profileImageUrl: previewUrl ?? currentUser.profileImageUrl,
            }
          : currentUser,
      );
      setUsername(trimmedUsername);
      setNewProfileImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("변경사항이 저장되었습니다.");
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(requestError, "변경사항 저장에 실패했습니다."),
      );
    } finally {
      setIsSaving(false);
    }
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

        {isLoading && <p>사용자 정보를 불러오는 중입니다...</p>}
        {error && <p role="alert">{error}</p>}

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

              <S.UserIdEmail>{user.userName}</S.UserIdEmail>
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
          {isSaving ? "저장 중..." : "변경사항 저장"}
        </S.SaveBtn>
      </S.ProfileContainer>
    </S.ProfileLayout>
  );
};

export default Profile;
