import React from 'react';
import styles from './TechnicalRoundModal.module.css';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey";

function TechnicalRoundModal({ onClose, data }) {
    useEscapeKey(onClose);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <h2 className={styles.modalTitle}>Technical Round</h2>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Questions Asked:</h3>
                    <ol className={styles.questionsList}>
                        {data.questions.map((question, index) => (
                            <li key={index} className={styles.questionItem}>{question}</li>
                        ))}
                    </ol>
                </div>

                <div className={styles.scoreSection}>
                    <h3 className={styles.sectionTitle}>Overall Score:</h3>
                    <p className={styles.scoreValue}>{data.score} out of 10</p>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Remarks:</h3>
                    <p className={styles.remarksText}>{data.remarks}</p>
                </div>

                <div className={styles.buttonWrapper}>
                    <PrimaryButton 
                        label="Confirm" 
                        onClick={onClose} 
                        className={styles.confirmButton}
                    />
                </div>
            </div>
        </div>
    );
}

export default TechnicalRoundModal;