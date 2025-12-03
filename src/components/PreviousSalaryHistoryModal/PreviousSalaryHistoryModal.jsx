import React, { useEffect, useState } from "react";
import styles from "./PreviousSalaryHistoryModal.module.css";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEmployeeSalaryHistory } from "../../services/addEmployeeService";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import Button from "../../components/Button/Button";

const PreviousSalaryHistoryModal = ({ user_id, onClose }) => {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEscapeKey(onClose);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getEmployeeSalaryHistory(user_id);
        if (res.success) {
          setHistory(
            (res.data.history || []).sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        }
      } catch (err) {
        console.error("Error loading salary history:", err);
      }
    };
    fetchHistory();
  }, [user_id]);

  const filteredHistory = selectedDate
    ? history.filter(
        (h) =>
          new Date(h.createdAt).getMonth() === selectedDate.getMonth() &&
          new Date(h.createdAt).getFullYear() === selectedDate.getFullYear()
      )
    : history;

  const handleClear = () => setSelectedDate(new Date());

  return (
    <div className={styles.PreviousSalaryHistoryModalOverlay}>
      <div className={styles.PreviousSalaryHistoryModalContainer}>
        <div className={styles.PreviousSalaryHistoryModalHeader}>
          <span> Previous Salary History</span>
          <span
            className={styles.PreviousSalaryHistoryModalClose}
            onClick={onClose}
          >
            <Icon icon="mdi:close" />
          </span>
        </div>

        {/* Filter Section */}
      <div className={styles.monthlyPayrollFilterSection}>
  <div className={styles.monthlyPayrollFilterGroup}>
    <label>
      <Icon icon="mdi:calendar" /> Month / Year
    </label>
    <div className={styles.filterInline}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        className={styles.monthlyPayrollDatePicker}
      />
      <Button label="Clear" type="button" onClick={handleClear} />
    </div>
  </div>
</div>


        {/* Salary History */}
        <div className={styles.PreviousSalaryHistoryModalBody}>
          {filteredHistory.length === 0 ? (
            <p className={styles.NoDataText}>No salary history available.</p>
          ) : (
            filteredHistory.map((record) => (
              <div key={record._id} className={styles.SalaryHistoryCard}>
                <div className={styles.SalaryHeader}>
                  <h4>
                    🏢 {record.companyId?.companyName || "Company"} —{" "}
                    {new Date(record.createdAt).toLocaleDateString()}
                  </h4>
                </div>

                <div className={styles.SalaryGrid}>
                  <div className={styles.SalaryBlock}>
                    <p>Basic Salary</p>
                    <h4>₹ {record.basicSalary}</h4>
                  </div>
                  <div className={styles.SalaryBlock}>
                    <p>Gross Salary</p>
                    <h4>₹ {record.grossSalary}</h4>
                  </div>
                  <div className={styles.SalaryBlock}>
                    <p>Net Salary</p>
                    <h4>₹ {record.netSalary}</h4>
                  </div>
                </div>

                <div className={styles.SalaryComponents}>
                  {record.salaryComponents.map((comp) => (
                    <div key={comp._id} className={styles.SalaryComponent}>
                      <p>{comp.componentName}</p>
                      <h4>₹ {comp.calculatedValue}</h4>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousSalaryHistoryModal;
