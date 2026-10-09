import type { PostTableItem } from "../../../types/posts.types";
import S from "./PostTable.styles";

interface PostTableProps {
  posts: PostTableItem[];
  onPostClick: (postId: number) => void;
}

const PostTable = ({ posts, onPostClick }: PostTableProps) => {
  return (
    // 게시글 번호, 카테고리, 제목, 작성일을 표 형태로 표시한다.
    <S.Table>
      <thead>
        <tr>
          <S.TableHeader> 번호 </S.TableHeader>
          <S.TableHeader> 카테고리 </S.TableHeader>
          <S.TableHeader> 제목 </S.TableHeader>
          <S.TableHeader> 작성일</S.TableHeader>
        </tr>
      </thead>

      <tbody>
        {posts.map((post) => (
          // 행을 클릭하면 선택한 게시글의 ID를 부모 컴포넌트에 전달한다.
          <S.TableRow
            key={post.id}
            onClick={() => onPostClick(post.id)}
            tabIndex={0}
            role="button"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key == "") {
                event.preventDefault();
                onPostClick(post.id);
              }
            }}
          >
            <S.TableCell> {post.number} </S.TableCell>
            <S.TableCell> {post.category} </S.TableCell>
            <S.TableCell> {post.title} </S.TableCell>
            <S.TableCell> {post.createdAt} </S.TableCell>
          </S.TableRow>
        ))}
      </tbody>
    </S.Table>
  );
};

export default PostTable;
