import React from "react";
import styles from "./ComparisonStats.module.css";

const metrics = [
  "Calls",
  "Meetings",
  "Deals Closed",
  "Follow-ups Done",
  "New Leads Generated",
  "Client Retention Rate",
];

const employeeData = [5, 7, 8, 4, 10, 5];
const managerData = [5, 7, 8, 4, 10, 5];

function ProgressBar({ value }) {
  return (
    <div className={styles.comparisonProgressWrapper}>
      <div
        className={`${styles.comparisonProgressBar} ${styles.animateProgress}`}
        style={{ "--progress-width": `${(value / 10) * 100}%` }}
      ></div>
    </div>
  );
}

function ComparisonStats() {
  return (
    <div className={styles.comparisonStatsContainer}>
      <div className={styles.comparisonColumn}>
        <h4 className={styles.comparisonTitle}>Employee’s</h4>
        {metrics.map((label, i) => (
          <div key={i} className={styles.comparisonMetricRow}>
            <span>{label}</span>
            <ProgressBar value={employeeData[i]} />
            <span>{employeeData[i]}</span>
          </div>
        ))}
      </div>

      <div className={styles.comparisonColumn}>
        <h4 className={styles.comparisonTitle}>Manager’s</h4>
        {metrics.map((label, i) => (
          <div key={i} className={styles.comparisonMetricRow}>
            <span>{label}</span>
            <ProgressBar value={managerData[i]} />
            <span>{managerData[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparisonStats;
