import React from 'react';
import { Icon } from "@iconify/react";
import styles from './RejectedReasonList.module.css';

function RejectedReasonList({ rejectedFields = [] }) {
  return (
    <div className={styles.rejectedReasonContainer}>
      <div className={styles.header}>
        <Icon icon="mdi:alert-circle-outline" className={styles.alertIcon} />
        <h3 className={styles.rejectedReasonTitle}>Rejected Fields</h3>
      </div>
      
      <div className={styles.rejectedItemsWrapper}>
        {rejectedFields.length > 0 ? (
          rejectedFields.map((item, index) => (
            <div key={index} className={styles.rejectedItem}>
              <span className={styles.fieldName}>{item.fieldName}</span>
              <span className={styles.separator}> - </span>
              <span className={styles.reasonText}>{item.reason}</span>
              {index < rejectedFields.length - 1 && (
                <span className={styles.commaSeparator}>, </span>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noRejections}>All fields are approved</div>
        )}
      </div>
    </div>
  );
}

export default RejectedReasonList;