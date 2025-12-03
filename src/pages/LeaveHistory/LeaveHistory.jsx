import React, { useState, useEffect } from "react";
import Table from "../../components/Table/Table";
import styles from "./LeaveHistory.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import TabsLeaveHistory from "../../components/TabsLeaveHistory/TabsLeaveHistory";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getMyLeaveApplications } from "../../services/leaveServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button/Button";
import { Icon } from "@iconify/react";
import useEscapeKey from '../../components/UseEscapeKey/useEscapeKey';


function LeaveHistory() {
useEscapeKey(() => setShowModal(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveData, setLeaveData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState("");


  useEffect(() => {
    const fetchLeaveApplications = async () => {
      const result = await getMyLeaveApplications();
      if (result.success) {
        let data = result.data;

        // Filter by month/year if selected
        if (selectedDate) {
          const selectedMonth = selectedDate.getMonth();
          const selectedYear = selectedDate.getFullYear();
          data = data.filter((leave) => {
            const fromDate = new Date(leave.fromDate);
            return (
              fromDate.getMonth() === selectedMonth &&
              fromDate.getFullYear() === selectedYear
            );
          });
        }

        const formattedData = data.map((leave) => ({
          leaveType: leave.leaveType?.name || "N/A",
          fromDate: new Date(leave.fromDate).toLocaleDateString(),
          toDate: new Date(leave.toDate).toLocaleDateString(),
          noOfDays: leave.isHalfDay ? "Half Day" : "Full Day",
          reason: leave.reason || "-",
          status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
          rejectionReason: leave.rejectionReason || null,
        }));
        setLeaveData(formattedData);
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    };

    fetchLeaveApplications();
  }, [enqueueSnackbar, selectedDate]);

  const handleClearFilter = () => {
    setSelectedDate(new Date());
  };

  const columns = [
    { header: "Leave type", accessor: "leaveType" },
    { header: "From Date", accessor: "fromDate" },
    { header: "To Date", accessor: "toDate" },
    { header: "No.of days", accessor: "noOfDays" },
    { header: "Reason", accessor: "reason" },
    {
      header: "Status",
      render: (row) => {
        let statusClass = "";
        switch (row.status) {
          case "Approved":
            statusClass = styles.leaveHistoryApproved;
            break;
          case "Pending":
            statusClass = styles.leaveHistoryPending;
            break;
          case "Rejected":
            statusClass = styles.leaveHistoryRejected;
            break;
          default:
            statusClass = "";
        }

        return (
       <span
  className={`${styles.leaveHistoryStatus} ${statusClass} ${
    row.status === "Rejected" && row.rejectionReason ? styles.rejectedButton : ""
  }`}
  onClick={() => {
    if (row.status === "Rejected" && row.rejectionReason) {
      setModalReason(row.rejectionReason);
      setShowModal(true);
    }
  }}
>
  {row.status}
</span>


        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <TabsLeaveHistory employeeId={id} />

      <Card title="Leave History" icon="mdi:calendar-clock">
        {/* Filter Section */}
        <div className={styles.leaveRequestsFilterSection}>
          <div className={styles.leaveRequestsFilterGroup}>
            <label>
              <Icon icon="mdi:calendar" /> Month / Year
            </label>
            <div className={styles.leaveRequestsInputRow}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Select Month / Year"
                className={styles.leaveRequestsDatePickerInput}
              />
              <Button
                className={styles.clearButton}
                onClick={handleClearFilter}
                label={"Clear"}
              />

            </div>
          </div>
          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Rejection Reason</h2>
                <p className={styles.modalText}>{modalReason}</p>
                <Button
                  label="Close"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowModal(false)}
                />
              </div>
            </div>
          )}

        </div>

        <Table
          columns={columns}
          data={leaveData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </DashboardLayout>
  );
}

export default LeaveHistory;
