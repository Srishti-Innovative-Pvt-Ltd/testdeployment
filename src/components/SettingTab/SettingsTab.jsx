import React from 'react';
import styles from './SettingsTab.module.css';

function SettingsTab({ tabs, activeTab, setActiveTab }) {
  return (
    <div className={styles.SettingsTabCompanyTabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${styles.SettingsTabCompanyTabButton} ${activeTab === tab.id ? styles.active : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default SettingsTab;
