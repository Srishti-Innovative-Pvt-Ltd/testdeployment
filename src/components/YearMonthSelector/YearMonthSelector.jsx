import React from 'react';
import buttonStyles from '../Button/Button.module.css'; 
import styles from './YearMonthSelector.module.css';

const years = Array.from({ length: 2035 - 2025 + 1 }, (_, i) => 2025 + i);
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const YearMonthSelector = ({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) => {
  return (
    <div className={styles.selectorWrapper}>
      <div className={styles.buttonGroup}>
        {years.map((year) => (
          <button
            key={year}
            className={`${buttonStyles.blueButton} ${styles.selectButton} ${selectedYear === year ? styles.active : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        {months.map((month) => (
          <button
            key={month}
            className={`${buttonStyles.blueButton} ${styles.selectButton} ${selectedMonth === month ? styles.active : ''}`}
            onClick={() => setSelectedMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearMonthSelector;
