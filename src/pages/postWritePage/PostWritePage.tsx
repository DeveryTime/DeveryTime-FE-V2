import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileApi from "../../api/profile/profile.api";
import PostEditor from "./PostEditor";

const PostWritePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;
    void profileApi.getMyProfile().then(
      (profile) => { if (isActive) setUserId(profile.id); },
      () => { if (isActive) setHasError(true); },
    );
    return () => { isActive = false; };
  }, []);

  if (hasError) return <p role="alert">사용자 정보를 불러오지 못했습니다.</p>;
  if (userId === null) return <p role="status">사용자 정보를 불러오는 중입니다...</p>;

  return <PostEditor userId={userId} onClose={() => navigate("/posts")} />;
};

export default PostWritePage;
