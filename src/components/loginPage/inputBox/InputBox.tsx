import { type ChangeEvent } from "react";

import { Input, InputBoxWrapper } from "./InputBoxStyle";

interface InputBoxProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputBox = ({ placeholder, value, onChange }: InputBoxProps) => {
  return (
    <InputBoxWrapper>
      <Input placeholder={placeholder} value={value} onChange={onChange} />
    </InputBoxWrapper>
  );
};
