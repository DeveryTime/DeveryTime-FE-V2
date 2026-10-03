import type { InputHTMLAttributes } from "react";
import S from "./Input.styles";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  return <S.Input {...props} />;
};

export default Input;
