import styled from "@emotion/styled";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
`;

const Dialog = styled.div`
  width: min(875px, calc(100vw - 32px));
  height: calc(100vh - 48px);
  max-height: 1028px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 40px;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 40px;
`;

const Reactions = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 40px;
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const PostDetailSkeleton = () => (
  <Overlay role="dialog" aria-modal="true" aria-busy="true" aria-label="게시글 불러오는 중">
    <Dialog>
      <Header>
        <Skeleton circle width={60} height={60} />
        <div>
          <Skeleton width={140} height={18} />
          <Skeleton width={180} height={14} />
        </div>
      </Header>

      <Content>
        <Skeleton width="48%" height={32} />
        <Skeleton count={8} height={20} />
      </Content>

      <Reactions>
        <Skeleton width={56} height={24} />
        <Skeleton width={56} height={24} />
      </Reactions>

      <Comments>
        <Skeleton height={68} />
        <Skeleton height={68} />
      </Comments>
    </Dialog>
  </Overlay>
);

export default PostDetailSkeleton;
