import type { ButtonHTMLAttributes, ReactNode } from "react";
import S from "./Button.styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button = ({
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <S.Button $variant={variant} {...props}>
      {children}
    </S.Button>
  );
};

export default Button;
