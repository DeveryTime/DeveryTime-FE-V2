import { useEffect } from "react";
import Background from "../../components/landingPage/background";
import Text from "../../components/landingPage/landingText";
import PandaMotion from "../../components/landingPage/panda";

const Landing = () => {
  useEffect(() => {
    // 페이지 진입 시 스크롤 위치 초기화
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {/* 배경 요소 */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <Background />
      </div>

      {/* 판다와 소개 문구 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
        <PandaMotion />
        <Text />
      </div>
    </div>
  );
};

export default Landing;
