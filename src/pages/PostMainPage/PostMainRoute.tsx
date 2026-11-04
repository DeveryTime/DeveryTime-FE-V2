import { useEffect, useState } from "react";
import PostMainPage from "./PostMainPage";
import profileApi from "../../api/profile/profile.api";
import { hasStoredAccessToken } from "../../api/authSession";

const PostMainRoute = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(hasStoredAccessToken);

  useEffect(() => {
    let isActive = true;
    if (!hasStoredAccessToken()) return;

    const fetchCurrentUser = async () => {
      try {
        const profile = await profileApi.getMyProfile();
        if (isActive) {
          setCurrentUserId(profile.id);
        }
      } catch {
        // 프로필 조회에 실패해도 공개 목록은 계속 보여준다.
      } finally {
        if (isActive) setIsProfileLoading(false);
      }
    };

    void fetchCurrentUser();

    return () => {
      isActive = false;
    };
  }, []);

  return <PostMainPage currentUserId={currentUserId} isProfileLoading={isProfileLoading} />;
};

export default PostMainRoute;
