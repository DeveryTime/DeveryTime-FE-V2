import styled from "@emotion/styled";
import { motion } from "framer-motion";
import colors from "../../styles/tokens/colors";

const S = {
  BackgroundWrapper: styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
  `,

  BackgroundLayer: styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  `,

  ContentLayer: styled.div`
    position: relative;
    z-index: 1;
  `,

  MovingCircleleft: styled(motion.div)`
    position: absolute;
    width: 900px;
    height: 800px;
    border-radius: 50%;
    left: 80px;
    top: 200px;

    background-color: ${colors.blue[100]};
    background: radial-gradient(
      circle,
      rgba(176, 197, 253, 1) 0%,
      rgba(176, 197, 253, 0.9) 30%,
      rgba(176, 197, 253, 0.6) 65%,
      rgba(176, 197, 253, 0.2) 100%
    );

    backdrop-filter: blur(12px) saturate(151%);
    -webkit-backdrop-filter: blur(12px) saturate(151%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,

  MovingCircleright: styled(motion.div)`
    position: absolute;
    width: 610px;
    height: 610px;
    border-radius: 50%;

    background: radial-gradient(
      circle,
      rgba(176, 197, 253, 1) 0%,
      rgba(176, 197, 253, 0.9) 30%,
      rgba(176, 197, 253, 0.6) 65%,
      rgba(176, 197, 253, 0.2) 100%
    );

    backdrop-filter: blur(12px) saturate(151%);
    -webkit-backdrop-filter: blur(18px) saturate(151%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,

  LoginWrapper: styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background-color: ${colors.blue[50]};
  `,
};

export default S;
