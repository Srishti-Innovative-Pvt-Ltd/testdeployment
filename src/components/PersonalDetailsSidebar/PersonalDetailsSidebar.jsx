import React from 'react';
import styles from './PersonalDetailsSidebar.module.css';
import proPik from '../../assets/images/profile.jpg';

const menuItems = [
  "Personal Details",
  "Contact Details",
  "Emergency Contacts",
  "Dependents",
  "Immigration",
  "Job",
  "Salary",
  "Report-to",
  "Qualifications",
  "Memberships"
];

const PersonalDetailsSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.personalDetailsTitle}>
        <h4>Radhul R Pillai</h4>
        <div className="d-flex justify-content-center">
          <div className={styles.personalDetailsImageContainer}>
            <img src={proPik} alt="Profile" className={styles.profileImage} />
          </div>
        </div>
      </div>

      <ul className={styles.menuList}>
        {menuItems.map((label, index) => (
          <li
            key={index}
            className={`${styles.menuItem} ${activeTab === index ? styles.active : ""
              }`}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalDetailsSidebar;
