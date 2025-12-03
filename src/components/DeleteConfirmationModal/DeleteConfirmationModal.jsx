// DeleteConfirmationModal.jsx
import styles from "./DeleteConfirmationModal.module.css";
import { Icon } from "@iconify/react";
import Button from "../Button/Button";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function DeleteConfirmationModal({ onClose, onConfirm }) {
  useEscapeKey(onClose);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>Delete</span>
          <Icon
            icon="mdi:close"
            onClick={onClose}
            className={styles.closeIcon}
          />
        </div>
        <div className={styles.modalBody}>
          <p>Are you sure you want to delete?</p>
        </div>
        <div className={styles.modalFooter}>


          <Button
            label="No"
            type="button"
            className="px-4 mx-2"
            onClick={onClose}
            secondary
          />
          <Button
            label="Yes"
            onClick={onConfirm}
            className="px-4 mx-2"
            
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
