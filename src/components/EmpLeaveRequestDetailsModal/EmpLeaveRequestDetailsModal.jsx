import React, { useEffect, useState } from "react";
import styles from "./EmpLeaveRequestDetailsModal.module.css";
import { Icon } from "@iconify/react";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { getLeaveDetailsByLeaveId } from "../../services/leaveServices";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";


const EmpLeaveRequestDetailsModal = ({ leaveId, fromDate, onClose }) => {
  const [leaveDetails, setLeaveDetails] = useState(null);
  useEscapeKey(onClose);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!leaveId || !fromDate) return;
      const res = await getLeaveDetailsByLeaveId(leaveId, fromDate);
      if (res.success) {
        setLeaveDetails(res.data[0]);
      }
    };
    fetchDetails();
  }, [leaveId, fromDate]);

  if (!leaveDetails) {
    return (
      <div className={styles.EmpLeaveRequestDetailsModal__overlay}>
        <div className={styles.EmpLeaveRequestDetailsModal__container}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // supporting document handling
  const docUrl = leaveDetails.supportingDocument;
  const isPdf = docUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(docUrl || "");

  return (
    <div className={styles.EmpLeaveRequestDetailsModal__overlay}>
      <div className={styles.EmpLeaveRequestDetailsModal__container}>
        {/* Close Button */}
        <span
          className={styles.EmpLeaveRequestDetailsModal__close}
          onClick={onClose}
        >
          <Icon icon="mdi:close" />
        </span>

        {/* Header */}
        <div className={styles.EmpLeaveRequestDetailsModal__header}>
          Leave Request Details
        </div>

        {/* Title */}
        <div className={styles.EmpLeaveRequestDetailsModal__title}>
          {leaveDetails.employee?.fullName || "N/A"}
        </div>

        {/* Details Grid */}
        <div className={styles.EmpLeaveRequestDetailsModal__grid}>
          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Full Name
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.employee?.fullName || "N/A"}
            </span>
          </div>

          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Employee ID
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.employee?.employeeId || "N/A"}
            </span>
          </div>

          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Leave Type
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.leaveType?.name || "N/A"}
            </span>
          </div>

          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              From Date
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.fromDate
                ? new Date(leaveDetails.fromDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              To Date
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.toDate
                ? new Date(leaveDetails.toDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Leave Duration
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.isHalfDay ? "Half Day" : "Full Day"}
            </span>
          </div>

{leaveDetails.supportingDocuments?.length > 0 && (
  <div className={styles.EmpLeaveRequestDetailsModal__item}>
    <span className={styles.EmpLeaveRequestDetailsModal__label}>
      Supporting Documents
    </span>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {leaveDetails.supportingDocuments.map((doc) => {
        const fileUrl = `${UPLOADS_PATH_BASE_URL.replace(/\/$/, "")}/${doc.filePath.replace(/^\/+/, "")}`;

        return (
          <a
            key={doc._id}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.EmpLeaveRequestDetailsModal__link}
          >
            {doc.fileName || "View Document"}
          </a>
        );
      })}
    </div>
  </div>
)}




          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Reason Provided
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.reason || "N/A"}
            </span>
          </div>

          {/* Leave Balance */}
          <div className={styles.EmpLeaveRequestDetailsModal__item}>
            <span className={styles.EmpLeaveRequestDetailsModal__label}>
              Leave Balance
            </span>
            <span className={styles.EmpLeaveRequestDetailsModal__value}>
              {leaveDetails.leaveBalance ?? "N/A"}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className={styles.EmpLeaveRequestDetailsModal__footer}>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default EmpLeaveRequestDetailsModal;
