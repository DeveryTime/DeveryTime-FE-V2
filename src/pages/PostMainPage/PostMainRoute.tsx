import { useEffect, useState } from "react";
import PostMainPage from "./PostMainPage";
import profileApi from "../../api/profile/profile.api";

const PostMainRoute = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchCurrentUser = async () => {
      try {
        const profile = await profileApi.getMyProfile();
        if (isActive) {
          setCurrentUserId(profile.id);
        }
      } catch {
        if (isActive) {
          setError("사용자 정보를 불러오지 못했습니다.");
        }
      }
    };

    void fetchCurrentUser();

    return () => {
      isActive = false;
    };
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (currentUserId === null) {
    return <p role="status">사용자 정보를 불러오는 중입니다...</p>;
  }

  return <PostMainPage currentUserId={currentUserId} />;
};

export default PostMainRoute;
