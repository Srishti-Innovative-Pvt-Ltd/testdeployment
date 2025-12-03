import React, { useState, useEffect } from "react";
import styles from "./ReimbursementHistory.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import ReimbursementDetailsModal from "../../components/ReimbursementDetailsModal/ReimbursementDetailsModal";
import { getUserId } from "../../utils/roleUtils";
import { getReimbursements, deleteReimbursement } from "../../services/settingsService";
import { useSnackbar } from "notistack";

function ReimbursementHistory() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const employeeId = getUserId();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reimbursements, setReimbursements] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");


  // Fetch reimbursements
  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;

      const res = await getReimbursements({ employeeId });
      if (res.success) {
        // Map API response to table-friendly format
        const mapped = res.data.map((item) => ({
          id: item.applicationId,
          reimbursementType: item.categoryType,
          dateOfTravel: new Date(item.applicationDate).toLocaleDateString(
            "en-GB"
          ), // DD/MM/YYYY format
          advanceAmount: item.advanceAmount,
          totalAmount: item.totalAmount,
          status: item.status,
          applicationId: item.applicationId,
          rejectedReason: item.rejectedReason || "",
        }));
        setReimbursements(mapped);
      }
    };

    fetchData();
  }, [employeeId]);

  //  Filter by selected month/year
  const filteredData = selectedDate
    ? reimbursements.filter((item) => {
      const travelDate = new Date(
        item.dateOfTravel.split("/").reverse().join("-") // parse DD/MM/YYYY
      );
      return (
        travelDate.getFullYear() === selectedDate.getFullYear() &&
        travelDate.getMonth() === selectedDate.getMonth()
      );
    })
    : reimbursements;

  const handleClear = () => {
    setSelectedDate(new Date());
  };

  const columns = [
    { header: "Date", accessor: "dateOfTravel" },
    { header: "Category", accessor: "reimbursementType" },
    { header: "Advance Amount", accessor: "advanceAmount" },
    { header: "Total Amount", accessor: "totalAmount" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        let color = "";
        if (row.status === "Approved") color = "green";
        else if (row.status === "Rejected") color = "red";
        else if (row.status === "Pending") color = "orange";

        if (row.status === "Rejected") {
          return (
            <button
             className={styles.reimbursementHistoryRejectedButton}
              
              onClick={() => {
                setRejectReason(row.rejectedReason || "No reason provided.");
                setShowRejectModal(true);
              }}
            >
              {row.status}
            </button>
          );
        }

        return <span style={{ color, fontWeight: 600 }}>{row.status}</span>;
      },
    },

    {
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Icon
            icon="mdi:eye"
            style={{ fontSize: "1.5rem", cursor: "pointer", color: "#1976d2" }}
            onClick={() => {
              setSelectedRow(row);
              setIsDetailsModalOpen(true);
            }}
          />
          {row.status === "Pending" && (
            <Icon
              icon="mdi:trash-can-outline"
              style={{ fontSize: "1.5rem", cursor: "pointer", color: "red" }}
              onClick={() => {
                setDeletingItem(row);
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.reimbursementHistoryContainer}>
      {/*  Date Filter Section */}
      <div className={styles.reimbursementHistoryFilterSection}>
        <div className={styles.reimbursementHistoryFilterGroup}>
          <label>
            <Icon icon="mdi:calendar" /> Month / Year
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Select Month / Year"
            className={styles.reimbursementHistoryDatePickerInput}
          />
        </div>

        <div className={styles.reimbursementHistoryFilterButtons}>
          <Button label="Clear" onClick={handleClear} type="button" />
        </div>
      </div>

      {/*  Table */}
      <Table
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/*  Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            if (!deletingItem) return;

            const res = await deleteReimbursement(deletingItem.applicationId);
            if (res.success) {
              setReimbursements((prev) =>
                prev.filter((item) => item.applicationId !== deletingItem.applicationId)
              );
              enqueueSnackbar("Reimbursement deleted successfully", {
                variant: "success",
              });
            } else {
              enqueueSnackbar(res.message, { variant: "error" });
            }

            setIsDeleteModalOpen(false);
            setDeletingItem(null);
          }}
        />
      )}
      {/* Rejected reason modal */}
      {showRejectModal && (
        <div className={styles.reimbursementHistoryModalOverlay}>
          <div className={styles.reimbursementHistoryModalContent}>
            <h2 className={styles.reimbursementHistoryModalTitle}>Rejection Reason</h2>
            <p className={styles.reimbursementHistoryModalText}>{rejectReason}</p>
            <Button
              label="Close"
              className={styles.reimbursementHistoryModalCloseBtn}
              onClick={() => setShowRejectModal(false)}
            />
          </div>
        </div>
      )}


      {/*  Reimbursement Details Modal */}
      {isDetailsModalOpen && (
        <ReimbursementDetailsModal
          show={isDetailsModalOpen}
          applicationId={selectedRow?.applicationId}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ReimbursementHistory;
