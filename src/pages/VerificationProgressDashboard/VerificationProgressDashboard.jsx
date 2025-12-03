import React from 'react';
import styles from './VerificationProgressDashboard.module.css';
import DashboardLayout from "../../layouts/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";

function VerificationProgressDashboard() { 
  return (
    <DashboardLayout>
      <div className={styles.verificationDashboardContainer}>
        <div className={styles.verificationCard}>
          <div className={styles.verificationIconWrapper}>
            <div className={styles.verificationIconCircle}>
              <Icon
                icon="material-symbols:warning-outline-rounded"
                className={styles.verificationIcon}
              />
            </div>
          </div>
          <h2 className={styles.verificationTitle}>
            Verification is in progress
          </h2>
          <p className={styles.verificationSubtitle}>
            Please wait until the process is complete to access the dashboard.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default VerificationProgressDashboard;
