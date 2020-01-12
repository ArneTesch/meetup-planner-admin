import React from "react";
import styles from "./modal.module.scss";

type ModalProps = {
  title: string;
  canCancel?: boolean;
  canConfirm?: boolean;
  confirmText?: string;
  onCancel(): void;
  onConfirm?: void;
  onClickOutsideModal(): void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = props => {
  const { title, children, onClickOutsideModal } = props;

  return (
    <React.Fragment>
      <div className={styles["modal"]}>
        <div className={styles["modal__header"]}>
          <h1>{title}</h1>
          <section className={styles["modal__content"]}>{children}</section>
        </div>
      </div>
      <div
        className={styles.backdrop}
        onClick={() => onClickOutsideModal()}
      ></div>
    </React.Fragment>
  );
};

Modal.defaultProps = {
  canCancel: true,
  canConfirm: true,
  confirmText: "Confirm"
};

export default Modal;
