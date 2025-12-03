import React from 'react';
import styles from './WorkingHoursDisplay.module.css';

function WorkingHoursDisplay() {
  const hoursData = [
    { label: "REQUIRED WORKING HOURS", value: "144:00 hrs" },
    { label: "TOTAL WORKING HOURS", value: "146:18 hrs" },
    { label: "EXTRA WORKING HOURS", value: "33:15 hrs" },
    { label: "PENDING WORKING HOURS", value: "00:00 hrs" }
  ];

  return (
    <div className={styles.WorkingHoursDisplayContainer}>
      {hoursData.map((item, index) => (
        <div key={index} className={styles.WorkingHoursDisplayCard}>
          <p className={styles.WorkingHoursDisplayLabel}>{item.label}</p>
          <h4 className={styles.WorkingHoursDisplayValue}>{item.value}</h4>
        </div>
      ))}
    </div>
  );
}

export default WorkingHoursDisplay;
