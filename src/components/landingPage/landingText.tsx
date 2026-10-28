import { Slide } from "react-awesome-reveal";
import S from "./landingText.style";

const Text = () => {
  return (
    <>
      {/* 랜딩페이지 소개 문구 */}
      <S.Text>
        <S.Text1>
          <Slide triggerOnce direction="right" duration={700} fraction={0.5}>
            <div>
              DSM 소통의 길 <br />
              데브리타임에 온걸 환영해요!
            </div>
          </Slide>
        </S.Text1>

        <S.Text2>
          <Slide triggerOnce direction="right" duration={700} fraction={1}>
            <div>
              데브리타임은 DSM 학생들을 위한
              <br />
              교내 커뮤니티 서비스예요.
            </div>
          </Slide>
        </S.Text2>

        <S.Text3>
          <Slide triggerOnce direction="right" duration={700} fraction={1}>
            <div>
              전공, 일상, 분실물 등 카테고리
              <br />
              별로 글을 읽고 쓸 수 있어요.
            </div>
          </Slide>
        </S.Text3>

        <S.Text4>
          <Slide triggerOnce direction="right" duration={700} fraction={1}>
            <div>
              데브리타임,
              <br />
              그럼 시작해볼까요?
            </div>
          </Slide>
        </S.Text4>
      </S.Text>

      {/* 서비스 시작 버튼 */}
      <S.StartBtn>시작하기</S.StartBtn>
    </>
  );
};

export default Text;
