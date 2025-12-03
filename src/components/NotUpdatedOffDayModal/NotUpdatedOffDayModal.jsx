import React from 'react';
import styles from './NotUpdatedOffDayModal.module.css';
import { Icon } from '@iconify/react';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

function NotUpdatedOffDayModal({ onClose, offDays = [] }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.notUpdatedOffDayModal__overlay}>
      <div className={styles.notUpdatedOffDayModal__container}>
        <div className={styles.notUpdatedOffDayModal__header}>
          <span>⚠️ Not Updated OffDays</span>
          <Icon
            icon="mdi:close"
            className={styles.notUpdatedOffDayModal__closeIcon}
            onClick={onClose}
          />
        </div>

        <div className={styles.notUpdatedOffDayModal__body}>
          {offDays.length === 0 ? (
            <p className={styles.notUpdatedOffDayModal__empty}>
               All days are updated!
            </p>
          ) : (
            <div className={styles.notUpdatedOffDayModal__list}>
              {offDays.map((date, index) => (
                <div className={styles.notUpdatedOffDayModal__card} key={index}>
                  <div className={styles.notUpdatedOffDayModal__index}>{index + 1}</div>
                  <div className={styles.notUpdatedOffDayModal__dateInfo}>
                    <span className={styles.notUpdatedOffDayModal__label}>Off Day</span>
                    <span className={styles.notUpdatedOffDayModal__date}>{date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotUpdatedOffDayModal;
