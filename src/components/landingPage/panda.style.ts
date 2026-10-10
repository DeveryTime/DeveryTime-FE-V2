import styled from "@emotion/styled";

export const S = {
  // 전체 배경
  Background: styled.div`
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
  `,

  // 별 위치
  Star: styled.div`
    position: absolute;
    top: 293px;
    left: 360px;
    transform: translateX(-50%);
  `,

  // 첫 번째 판다 위치
  Panda1: styled.div`
    position: absolute;
    top: 310px;
    left: 180px;
    z-index: 5;
  `,

  // 두 번째 판다 위치
  Panda2: styled.div`
    position: absolute;
    top: 1400px;
    left: 1200px;
    transform: translateX(-50%);
    z-index: 5;
  `,

  // 반짝이 위치
  Glitter: styled.div`
    position: absolute;
    top: 2780px;
    left: 520px;
    transform: translateX(-50%);
    z-index: 5;
  `,

  // 세 번째 판다 위치
  Panda3: styled.div`
    position: absolute;
    top: 2750px;
    left: 300px;
    transform: translateX(-50%);
    z-index: 5;
  `,

  // 두 번째 별 위치
  Star2: styled.div`
    position: absolute;
    top: 3990px;
    left: 1150px;
    transform: translateX(-50%);
  `,

  // 네 번째 판다 위치
  Panda4: styled.div`
    position: absolute;
    top: 4050px;
    left: 1140px;
    transform: translateX(-50%);
    z-index: 5;
  `,
};

export default S;
