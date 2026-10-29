
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import profileApi from "../../api/profile/profile.api";
import getApiErrorMessage from "../../api/errorMessages";
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

  // 새로 선택한 프로필 이미지
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 사용자 프로필 불러오기
  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const profile = await profileApi.getMyProfile();

        if (!isActive) return;

        setUser(profile);

        // API 응답 필드명은 username으로 통일
        setUsername(profile.username ?? "");
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

  // 아이디 입력값 검사
  const trimmedUsername = (username ?? "").trim();

  const canSave =
    Boolean(user) &&
    trimmedUsername.length > 0 &&
    trimmedUsername.length <= 10 &&
    !isSaving;

  // 프로필 이미지 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 이전에 선택한 파일의 미리보기 URL 정리
    setPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return URL.createObjectURL(file);
    });

    setNewProfileImage(file);
  };

  // 아이디 및 프로필 이미지 저장
  const handleSave = async () => {
    const trimmedUsername = (username ?? "").trim();

    if (!trimmedUsername) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    if (trimmedUsername.length > 10) {
      toast.error("아이디는 1~10글자 이내로 입력해주세요.");
      return;
    }

    if (!user || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await profileApi.updateMyProfile({
        username: trimmedUsername,
        deleteProfileImage: false,
        ...(newProfileImage
          ? { profileImage: newProfileImage }
          : {}),
      });

      const updatedProfile = await profileApi.getMyProfile();

      setUser(updatedProfile);
      setUsername(updatedProfile.username ?? "");
      setNewProfileImage(null);

      setPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        return null;
      });

      // 같은 파일을 다시 선택할 수 있도록 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("변경사항이 저장되었습니다.");
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "프로필을 수정하지 못했습니다.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.ProfileLayout>
      {/* 왼쪽 메뉴 */}
      <S.Menu>
        <S.MenuItem
          type="button"
          data-active="false"
          onClick={() => navigate("/info")}>내 정보</S.MenuItem>

        <S.MenuItem
          type="button"
          data-active="false"
          onClick={() => navigate("/mypostsPage")}>내가 쓴 글</S.MenuItem>
        <S.MenuItem
          type="button"
          data-active="true">프로필 수정</S.MenuItem>
        <S.MenuItem
          type="button"
          data-active="false"
          onClick={handleLogout}>로그아웃</S.MenuItem>
      </S.Menu>

      {/* 프로필 수정 영역 */}
      <S.ProfileContainer>
        <S.ProfileTitle>프로필 수정</S.ProfileTitle>

        {isLoading && (
          <p>사용자 정보를 불러오는 중입니다...</p>
        )}

        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && user && (
          <>
            {/* 사용자 정보 */}
            <S.UserInfo>
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
                  <img
                    src={previewUrl}
                    alt="프로필 이미지 미리보기"
                  />
                ) : user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="프로필 이미지"
                  />
                ) : (
                  <span>프로필 이미지</span>
                )}
              </S.ProfileImage>

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

            {/* 아이디 수정 */}
            <div>
              <S.Id>아이디</S.Id>

              <S.NameInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="10글자 이내로 입력해 주세요"
                maxLength={10}
              />
            </div>

            {/* 저장 버튼 */}
            <S.SaveBtn
              type="button"
              onClick={() => void handleSave()}
              disabled={!canSave}
            >
              {isSaving ? "저장 중..." : "변경사항 저장"}
            </S.SaveBtn>
          </>
        )}
      </S.ProfileContainer>
    </S.ProfileLayout>
  );
};

export default Profile;
