import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import S from "./PostTable.styles";

const SKELETON_ROW_COUNT = 10;
const skeletonRows = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => index,
);

const PostTableSkeleton = () => (
  <S.Table aria-busy="true" aria-label="게시글 목록">
    <thead>
      <tr>
        <S.TableHeader>번호</S.TableHeader>
        <S.TableHeader>카테고리</S.TableHeader>
        <S.TableHeader>제목</S.TableHeader>
        <S.TableHeader>작성일</S.TableHeader>
      </tr>
    </thead>
    <tbody>
      <S.TableSpacerRow aria-hidden="true">
        <S.TableSpacerCell colSpan={4} />
      </S.TableSpacerRow>
      {skeletonRows.map((row) => (
        <tr key={row} aria-hidden="true">
          <S.TableCell>
            <Skeleton width={28} height="1em" borderRadius={4} />
          </S.TableCell>
          <S.TableCell>
            <Skeleton width={64} height="1em" borderRadius={4} />
          </S.TableCell>
          <S.TableCell>
            <Skeleton width="72%" height="1em" borderRadius={4} />
          </S.TableCell>
          <S.TableCell>
            <Skeleton width={76} height="1em" borderRadius={4} />
          </S.TableCell>
        </tr>
      ))}
    </tbody>
  </S.Table>
);

export default PostTableSkeleton;
