import { Zoom } from "react-awesome-reveal";
import S from "./panda.style";

import panda1 from "../../assets/panda1.svg";
import panda2 from "../../assets/panda2.svg";
import panda3 from "../../assets/panda3.svg";
import panda4 from "../../assets/panda4.svg";
import glitter from "../../assets/glitter.svg";
import star from "../../assets/Star.svg";

const PandaMotion = () => {
  return (
    <S.Background>
      <S.Star>
        <Zoom triggerOnce duration={600} fraction={1}>
          <img src={star} alt="star" />
        </Zoom>
      </S.Star>

      <S.Panda1>
        <Zoom triggerOnce duration={600} fraction={1} delay={600}>
          <img src={panda1} alt="panda" />
        </Zoom>
      </S.Panda1>

      <S.Panda2>
        <Zoom triggerOnce duration={600} fraction={1}>
          <img src={panda2} alt="panda" />
        </Zoom>
      </S.Panda2>

      <S.Panda3>
        <Zoom triggerOnce duration={600} fraction={1}>
          <img src={panda3} alt="panda" />
        </Zoom>
      </S.Panda3>

      <S.Glitter>
        <Zoom triggerOnce duration={600} fraction={1} delay={700}>
          <img src={glitter} alt="glitter" />
        </Zoom>
      </S.Glitter>

      <S.Star2>
        <Zoom triggerOnce duration={600} fraction={1}>
          <img src={star} alt="star" />
        </Zoom>
      </S.Star2>

      <S.Panda4>
        <Zoom triggerOnce duration={600} fraction={1} delay={600}>
          <img src={panda4} alt="panda" />
        </Zoom>
      </S.Panda4>
    </S.Background>
  );
};

export default PandaMotion;
