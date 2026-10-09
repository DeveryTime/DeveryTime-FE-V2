import type { ChangeEvent } from "react";
import S from "./InputBoxStyle";

interface InputBoxProps {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputBox = ({
  placeholder,
  ariaLabel,
  value,
  onChange,
}: InputBoxProps) => {
  return (
    <S.InputBoxWrapper>
      <S.Input
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
      />
    </S.InputBoxWrapper>
  );
};
