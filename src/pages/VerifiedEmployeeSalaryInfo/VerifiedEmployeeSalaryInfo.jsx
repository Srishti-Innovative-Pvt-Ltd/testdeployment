import React, { useEffect, useState } from "react";
import styles from "./VerifiedEmployeeSalaryInfo.module.css";
import { getEmployeeSalaryStructure } from "../../services/addEmployeeService";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import PreviousSalaryHistoryModal from "../../components/PreviousSalaryHistoryModal/PreviousSalaryHistoryModal";

const VerifiedEmployeeSalaryInfo = ({ user_id }) => {
  const [salaryData, setSalaryData] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchSalary = async () => {
      if (!user_id) return;
      try {
        const res = await getEmployeeSalaryStructure(user_id);
        if (res.success) {
          setSalaryData(res.data);
        } else {
          console.error("Failed to fetch salary structure:", res.message);
          setSalaryData(null);
        }
      } catch (err) {
        console.error("Error loading salary structure:", err);
        setSalaryData(null);
      }
    };
    fetchSalary();
  }, [user_id]);

  // ✅ If salaryData is missing entirely
  if (!salaryData || Object.keys(salaryData).length === 0) {
    return <p className={styles.NoDataText}>No salary data available.</p>;
  }

  const {
    grossSalary,
    netSalary,
    basicSalary,
    allocatedComponents = [],
    salaryStructure,
  } = salaryData;

  // ✅ Check if ANY field (including inside allocatedComponents) actually has a non-empty value
  const hasSalaryData = [
    grossSalary,
    netSalary,
    basicSalary,
    ...(allocatedComponents?.map((item) => item?.calculatedValue) || []),
  ].some(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== 0 &&
      value !== "0"
  );

  if (!hasSalaryData) {
    return <p className={styles.NoDataText}>No salary data available.</p>;
  }

  return (
    <div className={styles.VerifiedEmployeeSalaryInfoWrapper}>
      <div className={styles.VerifiedEmployeeSalaryInfoHeader}>
        <PrimaryButton
          label="Salary History"
          onClick={() => setIsHistoryModalOpen(true)}
          className={styles.SalaryHistoryButton}
        />
      </div>
      <br />

      <div className={styles.VerifiedEmployeeSalaryInfoGrid}>
        {salaryStructure?.calcType === "GROSS" ? (
          <>
            <div>
              <p>Gross Salary</p>
              <h4>{grossSalary || "—"}</h4>
            </div>
            <div>
              <p>Basic Salary</p>
              <h4>{basicSalary || "—"}</h4>
            </div>
          </>
        ) : (
          <>
            <div>
              <p>Basic Salary</p>
              <h4>{basicSalary || "—"}</h4>
            </div>
            <div>
              <p>Gross Salary</p>
              <h4>{grossSalary || "—"}</h4>
            </div>
          </>
        )}

        {allocatedComponents.map((item) => (
          <div key={item._id}>
            <p>{item.label}</p>
            <h4>{item.calculatedValue || "—"}</h4>
          </div>
        ))}

        <div>
          <p>Net Salary</p>
          <h4>{netSalary || "—"}</h4>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryModalOpen && (
        <PreviousSalaryHistoryModal
          user_id={user_id}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VerifiedEmployeeSalaryInfo;
