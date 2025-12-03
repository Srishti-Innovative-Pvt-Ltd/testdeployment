import React from 'react';
import styles from './MissingHoursModal.module.css';
import { Icon } from '@iconify/react';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

function MissingHoursModal({ onClose, breakdown = [] }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>Incomplete Work Hours - Daily Breakdown</span>
          <Icon icon="mdi:close" className={styles.closeIcon} onClick={onClose} />
        </div>

        <div className={styles.cardContainer}>
          {breakdown.map((entry, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardRow}>
                <span className={styles.label}>Date:</span>
                <span>{entry.date}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Punch In:</span>
                <span>{entry.punchIn}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Punch Out:</span>
                <span>{entry.punchOut}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Total Work Hours:</span>
                <span>{entry.workHours}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Total Break Hours:</span>
                <span>{entry.breakHours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MissingHoursModal;
