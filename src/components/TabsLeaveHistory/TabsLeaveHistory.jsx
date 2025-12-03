import React, { useEffect, useState } from 'react';
import styles from './TabsLeaveHistory.module.css';
import { getEmployeeLeaves } from '../../services/leaveServices';

const LeaveCard = ({ type, count }) => {
  return (
    <div className={styles.leaveCard}>
      <div className={styles.leaveHeader}>
        <span className={styles.leaveType}>{type}</span>
        <span className={styles.leaveArrow}>↑</span>
      </div>
      <div className={styles.leaveCount}>{count}</div>
    </div>
  );
};

const TabsLeaveHistory = ({ employeeId }) => {
  const [leaves, setLeaves] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!employeeId) return;
      const response = await getEmployeeLeaves(employeeId);

      if (response.success) {
        setYear(response.data.year);
        const mappedLeaves = response.data.balances
          .filter((leave) => leave.leaveTypeId)
          .map((leave) => ({
            type: leave.leaveTypeId.name,
            count: leave.currentBalance,
          }));

        setLeaves(mappedLeaves);
      } else {
        console.error(response.message);
      }
    };

    fetchLeaves();
  }, [employeeId]);

  if (!leaves.length) return null;

  return (
    <div className={styles.leaveSummaryContainer}>
      <h3 className={styles.sectionTitle}>Remaining Leaves ({year})</h3>
      <div className={styles.leaveCardsWrapper}>
        {leaves.map((leave, index) => (
          <LeaveCard key={index} type={leave.type} count={leave.count} />
        ))}
      </div>
    </div>
  );
};

export default TabsLeaveHistory;
