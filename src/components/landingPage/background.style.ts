import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// 배경 요소가 위아래로 이동하는 애니메이션
const move1 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(40vw, -1200px, 0); }
  50% { transform: translate3d(-40vw, -2400px, 0); }
  75% { transform: translate3d(40vw, -3600px, 0); }
  100% { transform: translate3d(-40vw, -6000px, 0); }
`;

const move2 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(-40vw, -1200px, 0); }
  50% { transform: translate3d(40vw, -2400px, 0); }
  75% { transform: translate3d(-40vw, -3600px, 0); }
  100% { transform: translate3d(40vw, -6000px, 0); }
`;

const move3 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(40vw, -1200px, 0); }
  50% { transform: translate3d(-40vw, -2400px, 0); }
  75% { transform: translate3d(40vw, -3600px, 0); }
  100% { transform: translate3d(-40vw, -6000px, 0); }
`;

const move4 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(-40vw, -1200px, 0); }
  50% { transform: translate3d(40vw, -2400px, 0); }
  75% { transform: translate3d(-40vw, -3600px, 0); }
  100% { transform: translate3d(40vw, -6000px, 0); }
`;

const move5 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(40vw, -1200px, 0); }
  50% { transform: translate3d(-40vw, -2400px, 0); }
  75% { transform: translate3d(40vw, -3600px, 0); }
  100% { transform: translate3d(-40vw, -6000px, 0); }
`;

const move6 = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(-40vw, -1200px, 0); }
  50% { transform: translate3d(40vw, -2400px, 0); }
  75% { transform: translate3d(-40vw, -3600px, 0); }
  100% { transform: translate3d(40vw, -6000px, 0); }
`;

export const S = {
  // 전체 배경 레이아웃
  BackgroundLayout: styled.div`
    position: relative;
    width: 100%;
    min-height: 4874px;
    background: #fff;
    overflow-x: hidden;
  `,

  // 흐릿한 배경 장식 요소
  Obj1: styled.div`
    position: absolute;
    width: 1572px;
    height: 1432px;
    border-radius: 50%;
    top: -807px;
    left: 1045px;
    background: #b0c5fdcc;
    filter: blur(194.4px);
    animation: ${move1} 20s ease-in-out infinite alternate;
  `,

  Obj2: styled.div`
    position: absolute;
    width: 1160px;
    height: 1123px;
    border-radius: 50%;
    top: 377px;
    left: -880px;
    background: #8aa8fe;
    filter: blur(186.6px);
    animation: ${move2} 22s ease-in-out infinite alternate;
  `,

  Obj3: styled.div`
    position: absolute;
    width: 1136px;
    height: 849px;
    border-radius: 50%;
    top: 1296px;
    left: 739px;
    background: #b0c5fd80;
    filter: blur(194.4px);
    animation: ${move3} 24s ease-in-out infinite alternate;
  `,

  Obj4: styled.div`
    position: absolute;
    width: 539px;
    height: 512px;
    border-radius: 50%;
    top: 2481px;
    left: 95px;
    background: #8aa8fe;
    filter: blur(194.4px);
    animation: ${move4} 21s ease-in-out infinite alternate;
  `,

  Obj5: styled.div`
    position: absolute;
    width: 962px;
    height: 939px;
    border-radius: 50%;
    top: 3332px;
    left: 858px;
    background: #b0c5fd66;
    filter: blur(186.6px);
    animation: ${move5} 23s ease-in-out infinite alternate;
  `,

  Obj6: styled.div`
    position: absolute;
    width: 962px;
    height: 939px;
    border-radius: 50%;
    top: 4330px;
    left: -257px;
    background: #b0c5fd66;
    filter: blur(186.6px);
    animation: ${move6} 25s ease-in-out infinite alternate;
  `,

  // 배경 선 위치
  Line1: styled.svg`
    position: absolute;
    top: 848px;
    left: 0;
  `,

  Line2: styled.svg`
    position: absolute;
    top: 1983px;
    left: 0;
  `,

  Line3: styled.svg`
    position: absolute;
    top: 3405px;
    left: 0;
  `,
};

export default S;
