import React from 'react';
import styles from './VerifiedEmployeeBackgroundVerificationInfo.module.css';

const VerifiedEmployeeBackgroundVerificationInfo = () => {
  return (
    <div className={styles.VerifiedEmployeeBackgroundVerificationInfoWrapper}>
      <div className={styles.VerifiedEmployeeBackgroundVerificationInfoGrid}>

        <div>
          <p>Is this verification done by an external agency?</p>
          <h4>Yes</h4>

          <p>Agency Contact Number</p>
          <h4>9876543210</h4>

          <p>Institution / University Name</p>
          <h4>MSU</h4>

          <p>Previous Company Name</p>
          <h4>Turbo Tech</h4>

          <p>If Yes, Details</p>
          <h4>No Records</h4>
        </div>

        <div>
          <p>Agency Name</p>
          <h4>Srishti Innovative</h4>

          <p>Verification Report Upload</p>
          <a href="#">doc.pdf</a>

          <p>Year of Passing</p>
          <h4>2024</h4>

          <p>Upload Relieving/Experience Letter</p>
          <a href="#">doc.pdf</a>
        </div>

        <div>
          <p>Contact Person</p>
          <h4>Vimal</h4>

          <p>Highest Qualification</p>
          <h4>MBA</h4>

          <p>Upload Degree Certificate</p>
          <a href="#">doc.pdf</a>

          <p>Any Criminal Record?</p>
          <h4>No</h4>
        </div>

      </div>
    </div>
  );
};

export default VerifiedEmployeeBackgroundVerificationInfo;
