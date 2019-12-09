import React from "react";
import styles from "./modal.module.scss";

type ModalProps = {
  title: string;
  canCancel?: boolean;
  canConfirm?: boolean;
  confirmText?: string;
  onCancel(): void;
  onConfirm?: void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = props => {
  const { title, children } = props;

  return (
    <React.Fragment>
      <div className={styles["modal"]}>
        <div className={styles["modal__header"]}>
          <h1>{title}</h1>
          <section className={styles["modal__content"]}>{children}</section>
          {/* <section className={styles["modal__actions"]}>
            {canCancel && (
              <button
                className={`button ${styles["modal__button--cancel"]} ${styles["modal__button"]}`}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            {canConfirm && onConfirm && (
              <button
                className={`button ${styles["modal__button--confirm"]} ${styles["modal__button"]}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </section> */}
        </div>
      </div>
      <div className={styles.backdrop}></div>
    </React.Fragment>
  );
};

Modal.defaultProps = {
  canCancel: true,
  canConfirm: true,
  confirmText: "Confirm"
};

export default Modal;
