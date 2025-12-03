import React from 'react';
import styles from './VerifiedEmployeeProfessionalInfo.module.css';

const VerifiedEmployeeProfessionalInfo = () => {
  return (
    <div className={styles.VerifiedEmployeeProfessionalInfoWrapper}>
      <div className={styles.VerifiedEmployeeProfessionalInfoGrid}>
        <div>
          <p>Qualification</p>
          <h4>M.Tech</h4>
        </div>

        <div>
          <p>Years of Experience</p>
          <h4>10</h4>
        </div>

        <div>
          <p>Technical Expertise</p>
          <h4>UI/UX, HTML, CSS, JS</h4>
        </div>

        <div>
          <p>Date of Joining with Srishti</p>
          <h4>2020-06-01</h4>
        </div>
      </div>
    </div>
  );
};

export default VerifiedEmployeeProfessionalInfo;
