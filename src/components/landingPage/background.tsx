import { useEffect, useRef } from "react";
import S from "./background.style";

type LineProps = {
  LineComponent: typeof S.Line1 | typeof S.Line2 | typeof S.Line3;
  d: string;
  stroke: string;
  width?: string;
  height?: string;
  duration?: number;
};

const Line = ({
  LineComponent,
  d,
  stroke,
  width = "1920",
  height = "335",
  duration = 5,
}: LineProps) => {
  const lineRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const svg = lineRef.current;
    if (!svg) return;

    const path = svg.querySelector("path");
    if (!path) return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = `stroke-dashoffset ${duration}s ease`;

    const startAnimation = () => {
      if (hasAnimated.current) return;

      const rect = svg.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        hasAnimated.current = true;

        requestAnimationFrame(() => {
          path.style.strokeDashoffset = "0";
        });

        window.removeEventListener("scroll", startAnimation);
      }
    };

    window.addEventListener("scroll", startAnimation);
    startAnimation();

    return () => {
      window.removeEventListener("scroll", startAnimation);
    };
  }, [duration]);

  return (
    <LineComponent
      ref={lineRef}
      width={width}
      height={height}
      viewBox={`0 0 1920 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={d} stroke={stroke} />
    </LineComponent>
  );
};

const Background = () => {
  return (
    <S.BackgroundLayout>
      <S.Obj1 />
      <S.Obj2 />
      <S.Obj3 />
      <S.Obj4 />
      <S.Obj5 />
      <S.Obj6 />

      <Line
        LineComponent={S.Line1}
        d="M-15 63.1419C28.8333 147.475 298.222 484.17 726 255.53C1026.5 94.918 1532.3 -163.57 1989.5 144.03"
        stroke="#013DE2"
        duration={20}
      />

      <Line
        LineComponent={S.Line2}
        d="M-100 350.189L2296.26 0.49442"
        stroke="#0130B0"
        duration={5}
      />

      <Line
        LineComponent={S.Line3}
        d="M-28 63.1419C15.8333 147.475 285.222 484.17 713 255.53C1013.5 94.918 1519.3 -163.57 1976.5 144.03"
        stroke="#013DE2"
        duration={5}
      />
    </S.BackgroundLayout>
  );
};

export default Background;
