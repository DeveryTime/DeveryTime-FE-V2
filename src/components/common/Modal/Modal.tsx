import { useEffect, useRef } from "react";
import type { DialogHTMLAttributes, ReactNode } from "react";
import S from "./Modal.styles";

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

type ModalProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  "children" | "onClose" | "open" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    children: ReactNode;
    onClose: () => void;
    closeButtonLabel?: string;
    closeIcon?: ReactNode;
  closeButtonClassName?: string;
  };

const Modal = ({
  children,
  onClose,
  closeButtonLabel = "모달 닫기",
  closeIcon = "×",
  closeButtonClassName,
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
    <S.Dialog
      ref={dialogRef}
      onClose={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      {...props}
    >
      <S.CloseButton
        className={closeButtonClassName}
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
