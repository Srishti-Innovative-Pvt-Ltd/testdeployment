import React, { useState } from 'react';
import styles from './InductionVideoPage.module.css';
import DashboardLayout from '../../layouts/DashboardLayout';

const videoList = [
  { title: 'Company history and journey', type: 'Video' },
  { title: 'Policies & Procedures', type: 'Video' },
  { title: 'Role & Department Orientation', type: 'Document' },
  { title: 'Team Introduction & Workplace tour', type: 'Video' },
  { title: 'Training & Development Overview', type: 'Document' },
];

function InductionVideoPage() {
  const [selected, setSelected] = useState(videoList[0]);

  return (
    <DashboardLayout>
      <div className={styles.InductionVideoPage_title}>
        <h4>Introduction</h4>
      </div>

      <div className={styles.InductionVideoPage__container}>
        <div className={styles.InductionVideoPage__videoSection}>
          <video className={styles.InductionVideoPage__video} controls>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className={styles.InductionVideoPage__videoDetails}>
            <h3>{selected.title}</h3>
            <p>
              Overview of the organization’s background, values, mission, and vision.
            </p>
          </div>
        </div>

        <div className={styles.InductionVideoPage__sidebar}>
          {videoList.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.InductionVideoPage__sidebarItem} ${
                selected.title === item.title ? styles.InductionVideoPage__active : ''
              }`}
              onClick={() => setSelected(item)}
            >
              <div className={styles.InductionVideoPage__itemTitle}>{item.title}</div>
              <div className={styles.InductionVideoPage__itemType}>{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InductionVideoPage;
