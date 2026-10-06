import { useEffect, useRef } from "react";
import type { DialogHTMLAttributes, ReactNode } from "react";
import S from "./Modal.styles";

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

type ModalProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  "children" | "onClose" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    children: ReactNode;
    onClose: () => void;
    closeButtonLabel?: string;
    closeIcon?: ReactNode;
  };

const Modal = ({
  children,
  onClose,
  closeButtonLabel = "모달 닫기",
  closeIcon = "×",
  ...props
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <S.Dialog ref={dialogRef} onClose={onClose} {...props}>
      <S.CloseButton
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label={closeButtonLabel}
      >
        {closeIcon}
      </S.CloseButton>
      {children}
    </S.Dialog>
  );
};

export default Modal;
