import React from 'react';
import styles from './UpdatedOffDayModal.module.css';
import { Icon } from '@iconify/react';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

function UpdatedOffDayModal({ onClose, offDays }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Icon icon="mdi:calendar-check" className={styles.titleIcon} />
            <span>Employee Updated OffDay Summary</span>
          </div>
          <Icon icon="mdi:close" onClick={onClose} className={styles.closeIcon} />
        </div>

        <div className={styles.cardContainer}>
          {offDays.length === 0 ? (
            <p className={styles.empty}>No off day records found.</p>
          ) : (
            offDays.map((item, index) => (
              <div className={styles.card} key={index}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIndex}>#{index + 1}</span>
                  <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
                    {item.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Duration:</strong> {item.duration}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatedOffDayModal;
