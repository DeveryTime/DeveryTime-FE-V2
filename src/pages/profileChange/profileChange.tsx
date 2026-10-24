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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 수정할 아이디
  const [username, setUsername] = useState("");

  // 새 프로필 이미지
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteProfileImage, setDeleteProfileImage] = useState(false);

  // 파일 input에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 미리보기 URL을 컴포넌트가 사라질 때 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
          setLoadError(
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

  // 아이디가 변경되었는지 확인
  const canSave =
    Boolean(user) &&
    (username.trim() !== user?.userName ||
      Boolean(newProfileImage) ||
      deleteProfileImage) &&
    username.trim().length > 0 &&
    username.trim().length <= 10 &&
    !isSaving;

  // 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewProfileImage(file);
      setDeleteProfileImage(false);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 아이디 변경사항 저장
  const handleSave = async () => {
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

    setIsSaving(true);
    setSaveError(null);

    try {
      await profileApi.updateMyProfile({
        username: trimmedUsername,
        deleteProfileImage,
        ...(newProfileImage ? { profileImage: newProfileImage } : {}),
      });

      const updatedProfile = await profileApi.getMyProfile();
      setUser(updatedProfile);
      setUsername(updatedProfile.userName);
      setNewProfileImage(null);
      setPreviewUrl(null);
      setDeleteProfileImage(false);
      toast.success("변경사항이 저장되었습니다.");
    } catch (requestError) {
      setSaveError(
        getApiErrorMessage(requestError, "프로필을 수정하지 못했습니다."),
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
        {loadError && <p role="alert">{loadError}</p>}
        {saveError && <p role="alert">{saveError}</p>}

        {/* 사용자 정보 */}
        {!isLoading && !loadError && user && (
          <S.UserInfo>
            {/* 프로필 이미지 */}
            <S.ProfileImageActions>
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
                ) : user.profileImageUrl && !deleteProfileImage ? (
                  <img src={user.profileImageUrl} alt="프로필 이미지" />
                ) : (
                  <span>프로필 이미지</span>
                )}
              </S.ProfileImage>
              {user.profileImageUrl && !newProfileImage && (
                <S.RemoveProfileImageBtn
                  type="button"
                  onClick={() =>
                    setDeleteProfileImage((isDeleting) => !isDeleting)
                  }
                >
                  {deleteProfileImage
                    ? "이미지 삭제 취소"
                    : "프로필 이미지 삭제"}
                </S.RemoveProfileImageBtn>
              )}
            </S.ProfileImageActions>

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
        {!isLoading && !loadError && user && (
          <div>
            <S.Id>아이디</S.Id>

            <S.NameInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="10글자 이내로 입력해 주세요"
            />
          </div>
        )}

        {/* 저장 버튼 */}
        <S.SaveBtn
          type="button"
          onClick={() => void handleSave()}
          disabled={!canSave}
        >
          변경사항 저장
        </S.SaveBtn>
      </S.ProfileContainer>
    </S.ProfileLayout>
  );
};

export default Profile;
