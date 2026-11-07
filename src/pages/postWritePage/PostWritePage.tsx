import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileApi from "../../api/profile/profile.api";
import PostEditor from "./PostEditor";

const PostWritePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [profileLoadAttempt, setProfileLoadAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    void profileApi.getMyProfile().then(
      (profile) => { if (isActive) setUserId(profile.id); },
      (error: unknown) => {
        if (!isActive) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setHasError(true);
      },
    );
    return () => { isActive = false; };
  }, [navigate, profileLoadAttempt]);

  if (hasError) {
    return (
      <div role="alert">
        <p>사용자 정보를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => {
            setHasError(false);
            setProfileLoadAttempt((attempt) => attempt + 1);
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }
  if (userId === null) return <p role="status">사용자 정보를 불러오는 중입니다...</p>;

  return <PostEditor userId={userId} onClose={() => navigate("/posts")} />;
};

export default PostWritePage;
