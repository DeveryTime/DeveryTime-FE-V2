import { useEffect, useRef } from "react";
import type {
  DialogHTMLAttributes,
  ReactNode,
} from "react";
import S from "./Modal.styles";

interface ModalProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "children" | "onClose"> {
  children: ReactNode;
  onClose: () => void;
  closeButtonLabel?: string;
  closeIcon?: ReactNode;
}

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
