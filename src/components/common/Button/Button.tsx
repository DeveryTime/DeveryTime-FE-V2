import type { ButtonHTMLAttributes, ReactNode } from "react";
import S from "./Button.styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button = ({
  children,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <S.Button $variant={variant} {...props} type={type}>
      {children}
    </S.Button>
  );
};

export default Button;
