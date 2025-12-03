import React from 'react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import styles from './JobDetailsHeader.module.css';

function JobDetailsHeader({ title, skills, actions = [] }) {
  return (
    <div className={styles.jobDetailsHeaderContainer}>
      <div className={styles.jobDetailsHeaderInfo}>
        <h4 className={styles.jobDetailsHeaderTitle}>{title}</h4>
        <p className={styles.jobDetailsHeaderSkills}>{skills}</p>
      </div>
      <div className={styles.jobDetailsHeaderActions}>
        {actions.map((action, index) => (
          <PrimaryButton
            key={index}
            label={action.label}
            onClick={action.onClick}
            className={action.className}
            secondary={action.secondary}
          />
        ))}
      </div>
    </div>
  );
}

export default JobDetailsHeader;
