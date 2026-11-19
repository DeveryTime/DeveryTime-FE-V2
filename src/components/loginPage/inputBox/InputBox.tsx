import type { ChangeEvent, FocusEvent, HTMLInputTypeAttribute } from "react";
import S from "./InputBoxStyle";

interface InputBoxProps {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  maxLength?: number;
}

const InputBox = ({
  placeholder,
  ariaLabel,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  maxLength,
}: InputBoxProps) => {
  return (
    <S.InputBoxWrapper>
      <S.Input
        type={type}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </S.InputBoxWrapper>
  );
};

export default InputBox;
