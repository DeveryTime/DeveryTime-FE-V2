import type { ChangeEvent } from "react";

import { Input, InputBoxWrapper } from "./InputBoxStyle";

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
    <InputBoxWrapper>
      <Input
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
      />
    </InputBoxWrapper>
  );
};
