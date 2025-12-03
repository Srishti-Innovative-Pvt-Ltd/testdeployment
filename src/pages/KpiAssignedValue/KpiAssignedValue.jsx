import React, { useState } from 'react';
import styles from './KpiAssignedValue.module.css';
import { Icon } from '@iconify/react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import KpiAssignedValueModal from '../../components/KpiAssignedValueModal/KpiAssignedValueModal';
import Button from '../../components/Button/Button';


const kpiData = [
  { id: 1, label: 'Calls (Number)', frequency: 'Monthly' },
  { id: 2, label: 'Deals Closed (Percentage)', frequency: 'Monthly' },
  { id: 3, label: 'Meetings (Percentage)', frequency: 'Monthly' },
  { id: 4, label: 'Lead Follow-up (Percentage)', frequency: 'Monthly' },
  { id: 5, label: 'Bug Fixes (Number)', frequency: 'Yearly' },
  { id: 6, label: 'Content Created (Number)', frequency: 'Monthly' },
  { id: 7, label: 'Customer Tickets (Number)', frequency: 'Monthly' },
  { id: 8, label: 'Code Commits (Percentage)', frequency: 'Yearly' },
];

function KpiAssignedValue() {
  const [selectedKPIs, setSelectedKPIs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedKPIs((prev) =>
      prev.includes(id) ? prev.filter((kpi) => kpi !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.KpiAssignedValueWrapper}>
      <div className={styles.KpiAssignedValueHeader}>
        {/* <h2 className={styles.KpiAssignedValueTitle}>KPI Parameter</h2> */}
        <div className={styles.KpiAssignedValueDropdowns}>
          <div className={styles.KpiAssignedValueSelectWrapper}>
            <label className={styles.KpiAssignedValueSelectLabel}>Department</label>
            <div className={styles.KpiAssignedValueSelectContainer}>
              <select className={styles.KpiAssignedValueSelect}>
                <option>Select Department</option>
                <option>Human Resources</option>
                <option>Sales & Marketing</option>
                <option>Finance</option>
                <option>Administration</option>
                <option>Research & Development</option>
                <option>Analytics</option>
                <option>IT Procurement</option>
                <option>Network Administration</option>
                <option>Application Management</option>
                <option>Cloud Computing</option>
              </select>
            </div>
          </div>

          <div className={styles.KpiAssignedValueSelectWrapper}>
            <label className={styles.KpiAssignedValueSelectLabel}>Designation</label>
            <div className={styles.KpiAssignedValueSelectContainer}>
              <select className={styles.KpiAssignedValueSelect}>
                <option>Select Designation</option>
                <option>Product Manager</option>
                <option>Project Manager</option>
                <option>Senior Designer</option>
                <option>Software Developer</option>
                <option>Directors</option>
                <option>Team Leaders</option>
                <option>Specialists / Engineers</option>
                <option>Analysts</option>
                <option>Technicians</option>
                <option>Associates / Entry-Level</option>
              </select>
            </div>
          </div>
          <div className={styles.filterButtons}>
            <Button label="Filter" onClick={() => { }} /> &nbsp;
            <Button label="Clear" onClick={() => { }} secondary />
          </div>
        </div>
      </div>

      <div className={styles.KpiAssignedValueGrid}>
        {kpiData.map((kpi) => (
          <div key={kpi.id} className={styles.KpiAssignedValueCard}>
            <div className={styles.KpiAssignedValueLeft}>
              <input
                type="checkbox"
                checked={selectedKPIs.includes(kpi.id)}
                onChange={() => handleCheckboxChange(kpi.id)}
              />
              <div className={styles.KpiAssignedValueInfo}>
                <span className={styles.KpiAssignedValueLabel}>{kpi.label}</span>
                <span className={styles.KpiAssignedValueFrequency}>
                  <Icon icon="uil:calendar-alt" className={styles.KpiAssignedValueCalendarIcon} />
                  {kpi.frequency}
                </span>
              </div>
            </div>
            <div className={styles.KpiAssignedValueValue}>10</div>
          </div>
        ))}
      </div>

      <div className={styles.KpiAssignedValueFooter}>
        <PrimaryButton
          label="Edit"
          className={styles.KpiAssignedValueEditButton}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <KpiAssignedValueModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default KpiAssignedValue;
