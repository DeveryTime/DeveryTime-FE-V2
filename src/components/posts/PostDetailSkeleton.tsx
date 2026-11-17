import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PostDetailSkeleton = () => (
  <div aria-busy="true">
    <Skeleton width={240} height={24} borderRadius={4} />
  </div>
);

export default PostDetailSkeleton;
