import React from 'react';
import styles from './AddEmployeeTab.module.css';

function AddEmployeeTab({ activeStep = 1, onStepClick, role, steps = [] }) {
  const visibleSteps = steps.filter(step => step.roles.includes(role));

  return (
    <div className={styles.tabContainer}>
      {visibleSteps.map((step, index) => {
        const isActive = activeStep === step.number;
        const isCompleted = activeStep > step.number;

        return (
          <div
            className={styles.stepWrapper}
            key={step.number}
            onClick={() => onStepClick(step.number)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className={`${styles.circle} ${
                isActive || isCompleted ? styles.active : ''
              }`}
            >
              {step.number}
            </div>
            <div
              className={`${styles.label} ${
                isActive || isCompleted ? styles.activeText : ''
              }`}
            >
              {step.label}
            </div>

            {index < visibleSteps.length - 1 && (
              <div
                className={`${styles.line} ${
                  isCompleted ? styles.progressLine : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AddEmployeeTab;
