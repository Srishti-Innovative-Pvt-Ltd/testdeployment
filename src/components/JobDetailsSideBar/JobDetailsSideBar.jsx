import React from 'react';
import styles from './JobDetailsSideBar.module.css';
import { Icon } from '@iconify/react';

function JobDetailsSideBar() {
  return (
    <div className={styles.jobDetailsSideBarContainer}>
      <div className={styles.jobDetailsSideBarSection}>
        <h3 className={styles.jobDetailsSideBarHeading}>Job Overview</h3>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:map-marker" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Location</p>
            <p className={styles.jobDetailsSideBarValue}>Trivandrum, India</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:chip" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Industry Type</p>
            <p className={styles.jobDetailsSideBarValue}>Information Technology</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:clock-outline" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Date Posted</p>
            <p className={styles.jobDetailsSideBarValue}>5 Nov | 150 Applications</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:timer-sand" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Deadline</p>
            <p className={styles.jobDetailsSideBarValue}>01/08/2025</p>
          </div>
        </div>
      </div>

      <div className={styles.jobDetailsSideBarSection}>
        <h3 className={styles.jobDetailsSideBarHeading}>Job Info</h3>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:briefcase-outline" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Experience</p>
            <p className={styles.jobDetailsSideBarValue}>5+ Years</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:clipboard-text-outline" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Vacancy count</p>
            <p className={styles.jobDetailsSideBarValue}>2</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:brain" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Skills</p>
            <p className={styles.jobDetailsSideBarValue}>
              Strong technical skills, Strategic thinking and Leadership Abilities
            </p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:currency-inr" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Salary</p>
            <p className={styles.jobDetailsSideBarValue}>3–5 LPA</p>
          </div>
        </div>

        <div className={styles.jobDetailsSideBarItem}>
          <Icon icon="mdi:calendar-account-outline" className={styles.jobDetailsSideBarIcon} />
          <div>
            <p className={styles.jobDetailsSideBarLabel}>Job Type</p>
            <p className={styles.jobDetailsSideBarValue}>Full Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsSideBar;
