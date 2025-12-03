import React from "react";
import styles from "./CandidateSelectionModal.module.css";
import Button from "../../components/Button/Button";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function CandidateSelectionModal({ onClose, onVerify, onEnroll }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.candidateModal__overlay}>
      <div className={styles.candidateModal__container}>
        <div className={styles.candidateModal__header}>
          <h2 className={styles.candidateModal__title}>Candidate Selection</h2>
          <span className={styles.candidateModal__close} onClick={onClose}>
            &times;
          </span>
        </div>
        <p className={styles.candidateModal__message}>
          Would you like to proceed with background verification or continue with employee enrollment?
        </p>
        <div className={styles.candidateModal__buttonGroup}>
          <Button
            label="Background Verification"
            onClick={onVerify}
            secondary
            className={styles.candidateModal__button}
          />
          <Button
            label="Continue with Enrollment"
            onClick={onEnroll}
            className={styles.candidateModal__button}
          />
        </div>
      </div>
    </div>
  );
}

export default CandidateSelectionModal;
