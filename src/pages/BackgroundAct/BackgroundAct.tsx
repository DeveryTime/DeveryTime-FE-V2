import {
  MovingCircleleft,
  BackgroundWrapper,
  MovingCircleright,
} from "./BackgroundActStyle";

export const Background = () => {
  return (
    <BackgroundWrapper>
      <MovingCircleleft
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [0, 120, 280, 420, 300, 820, 0],
          y: [0, -40, -100, -40, 80, 120, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <MovingCircleright
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [0, -80, -180, -100, 40, 120, 0],
          y: [0, 70, 140, 220, 160, 60, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </BackgroundWrapper>
  );
};
