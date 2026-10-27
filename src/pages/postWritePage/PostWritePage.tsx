import { useNavigate } from "react-router-dom";
import PostEditor from "./PostEditor";

const PostWritePage = () => {
  const navigate = useNavigate();

  return <PostEditor onClose={() => navigate("/posts")} />;
};

export default PostWritePage;
