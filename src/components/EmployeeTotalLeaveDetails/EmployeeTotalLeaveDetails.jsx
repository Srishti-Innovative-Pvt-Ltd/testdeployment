import React, { useState, useEffect } from "react";
import styles from "./EmployeeTotalLeaveDetails.module.css";
import Table from "../../components/Table/Table";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import EmpLeaveRequestDetailsModal from "../EmpLeaveRequestDetailsModal/EmpLeaveRequestDetailsModal";
import { getLeaveDetailsByEmployeeId } from "../../services/leaveServices";

function EmployeeTotalLeaveDetails({ employeeDetails, onBack }) {
  const { employeeDbId, selectedDate, fullName } = employeeDetails;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");


  useEffect(() => {
    const fetchEmployeeLeaves = async () => {
      if (!employeeDbId) return;

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const res = await getLeaveDetailsByEmployeeId(employeeDbId, year, month);
      if (res.success) {
        setEmployeeLeaves(res.data || []);
      } else {
        setEmployeeLeaves([]);
      }
    };

    fetchEmployeeLeaves();
  }, [employeeDbId, selectedDate]);


  // Convert date to YYYY-MM-DD
  const formatDateForApi = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  // Table Columns
  const columns = [
    {
      header: "Employee ID",
      render: (row) => row.employee?.employeeId || "N/A",
    },
    {
      header: "Leave Type",
      render: (row) => row.leaveType?.name || "N/A",
    },
    {
      header: "From Date",
      render: (row) => new Date(row.fromDate).toLocaleDateString(),
    },
    {
      header: "To Date",
      render: (row) => new Date(row.toDate).toLocaleDateString(),
    },
    {
      header: "Leave Duration",
      render: (row) => (row.isHalfDay ? "Half Day" : "Full Day"),
    },
    { header: "No.of days", render: (row) => row.noOfDays },
    {
  header: "Status",
  render: (row) => {
    // Rejected: clickable button
    if (row.status === "rejected") {
      return (
        <button
          className={styles.employeeTotalLeaveDetails__rejectedButton}
          onClick={() => {
            setRejectReason(row.rejectionReason || "No reason provided.");
            setShowRejectModal(true);
          }}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </button>
      );
    }

    // Approved / Pending: styled span pills
    const statusClass =
      row.status === "approved"
        ? styles.employeeTotalLeaveDetails__approved
        : styles.employeeTotalLeaveDetails__pending;

    return (
      <span
        className={`${styles.employeeTotalLeaveDetails__status} ${statusClass}`}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    );
  },
},

    {
      header: "Details",
      render: (row) => (
        <Icon
          icon="mdi:eye"
          className={styles.employeeTotalLeaveDetails__detailsIcon}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={() => {
            setSelectedLeaveId(row._id);  
            setSelectedFromDate(formatDateForApi(row.fromDate));
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];



  return (
    <div className={styles.employeeTotalLeaveDetails}>
      {/* Header */}
      <div className={styles.employeeTotalLeaveDetails__header}>
        <div className={styles.employeeTotalLeaveDetails__center}>
          <h2>{fullName || "Employee"}’s Leave</h2>
          <span className={styles.employeeTotalLeaveDetails__monthYear}>
            {selectedDate.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className={styles.employeeTotalLeaveDetails__right}>
          <Button label="← Back" onClick={onBack} type="button" />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={employeeLeaves}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {isModalOpen && (
        <EmpLeaveRequestDetailsModal
          leaveId={selectedLeaveId}
          fromDate={selectedFromDate}
          onClose={() => setIsModalOpen(false)}
        />
      )}

        {/* Rejected Reason Modal */}
      {showRejectModal && (
        <div className={styles.employeeTotalLeaveDetails__modalOverlay}>
          <div className={styles.employeeTotalLeaveDetails__modalContent}>
            <h2 className={styles.employeeTotalLeaveDetails__modalTitle}>Rejection Reason</h2>
            <p className={styles.employeeTotalLeaveDetails__modalText}>{rejectReason}</p>
            <Button
              label="Close"
              className={styles.employeeTotalLeaveDetails__modalCloseBtn}
              onClick={() => setShowRejectModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTotalLeaveDetails;
