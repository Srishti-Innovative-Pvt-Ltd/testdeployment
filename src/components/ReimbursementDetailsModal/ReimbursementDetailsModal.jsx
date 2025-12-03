import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./ReimbursementDetailsModal.module.css";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { getReimbursementByApplicationId } from "../../services/settingsService";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import { getUserRole } from "../../utils/roleUtils";

function ReimbursementDetailsModal({ show, applicationId, onClose }) {
  useEscapeKey(onClose);

  const [data, setData] = useState(null);
  const userRole = getUserRole();

  useEffect(() => {
    if (show && applicationId) {
      (async () => {
        const res = await getReimbursementByApplicationId(applicationId);
        if (res.success) {
          setData(res.data);
        }
      })();
    }
  }, [show, applicationId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  if (!show || !applicationId) return null;

  const type = data?.reimbursementCategory?.name;

  // Condition for HR and Admin
  const canSeeReimbursementAmount = userRole === "admin" || userRole === "hr";

  return (
    <div className={styles.reimbursementDetailsModalBackdrop} onClick={onClose}>
      <div
        className={styles.reimbursementDetailsModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.reimbursementDetailsModalHeader}>
          <h3>Reimbursement Details</h3>
          <Icon
            icon="mdi:close"
            onClick={onClose}
            className={styles.reimbursementDetailsModalCloseIcon}
          />
        </div>

        {/* Body */}
        <div className={styles.reimbursementDetailsModalBody}>
          <h4 className={styles.reimbursementDetailsModalTitle}>
            {type} Reimbursement
          </h4>

          <div className={styles.reimbursementDetailsModalDetailsGrid}>
            <div>
              <p>Reimbursement Type</p>
              <span>{type}</span>
            </div>

            {type === "Travel" && data && (
              <>
                <div>
                  <p>Advance Amount</p>
                  <span>{data.advanceAmount}</span>
                </div>
                <div>
                  <p>Total Amount</p>
                  <span>{data.totalAmount}</span>
                </div>

                {/* HR & Admin only */}
                {canSeeReimbursementAmount && (
                  <div>
                    <p>Reimbursement Amount</p>
                    <span>{data.reimbursementAmount}</span>
                  </div>
                )}

                <div>
                  <p>From Date</p>
                  <span>{formatDate(data.details.fromDate)}</span>
                </div>
                <div>
                  <p>To Date</p>
                  <span>{formatDate(data.details.toDate)}</span>
                </div>

                <div>
                  <p>Mode of Travel</p>
                  <span>{data.details.modeOfTravel}</span>
                </div>
                <div>
                  <p>Total KM</p>
                  <span>{data.details.totalKm}</span>
                </div>
                <div>
                  <p>From</p>
                  <span>{data.details.fromLocation}</span>
                </div>
                <div>
                  <p>To</p>
                  <span>{data.details.toLocation}</span>
                </div>

                {/* Show Reason only if provided */}
                {data.purpose && data.purpose.trim() !== "" && (
                  <div>
                    <p>Reason</p>
                    <span>{data.purpose}</span>
                  </div>
                )}

                {data.attachments?.length > 0 && (
                  <div>
                    <p>Documents</p>
                    <span>
                      {data.attachments.map((file) => (
                        <a
                          key={file._id}
                          href={`${UPLOADS_PATH_BASE_URL}${file.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            styles.reimbursementDetailsModalDetailsLink
                          }
                        >
                          {file.fileName}
                        </a>
                      ))}
                    </span>
                  </div>
                )}
              </>
            )}

            {type === "Food" && data && (
              <>
                <div>
                  <p>Advance Amount</p>
                  <span>{data.advanceAmount}</span>
                </div>
                <div>
                  <p>Total Amount</p>
                  <span>{data.totalAmount}</span>
                </div>

                {/*  HR & Admin only */}
                {canSeeReimbursementAmount && (
                  <div>
                    <p>Reimbursement Amount</p>
                    <span>{data.reimbursementAmount}</span>
                  </div>
                )}

                <div>
                  <p>From Date</p>
                  <span>{formatDate(data.details.fromDate)}</span>
                </div>
                <div>
                  <p>To Date</p>
                  <span>{formatDate(data.details.toDate)}</span>
                </div>

                <div>
                  <p>Days</p>
                  <span>{data.details.days}</span>
                </div>

                {/*  Show Reason only if provided */}
                {data.purpose && data.purpose.trim() !== "" && (
                  <div>
                    <p>Reason</p>
                    <span>{data.purpose}</span>
                  </div>
                )}

                {data.attachments?.length > 0 && (
                  <div >
                    <p>Documents</p>
                    <span>
                      {data.attachments.map((file) => (
                        <a
                          key={file._id}
                          href={`${UPLOADS_PATH_BASE_URL}${file.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            styles.reimbursementDetailsModalDetailsLink
                          }
                        >
                          {file.fileName}
                        </a>
                      ))}
                    </span>
                  </div>
                )}
              </>
            )}

            {type === "Miscellaneous" && data && (
              <>
                <div>
                  <p>Advance Amount</p>
                  <span>{data.advanceAmount}</span>
                </div>
                <div>
                  <p>Total Amount</p>
                  <span>{data.totalAmount}</span>
                </div>

                {/*  HR & Admin only */}
                {canSeeReimbursementAmount && (
                  <div>
                    <p>Reimbursement Amount</p>
                    <span>{data.reimbursementAmount}</span>
                  </div>
                )}

                <div>
                  <p>Date</p>
                  <span>{formatDate(data.details.applicationDate)}</span>
                </div>

                {/*  Show Reason only if provided */}
                {data.purpose && data.purpose.trim() !== "" && (
                  <div>
                    <p>Reason</p>
                    <span>{data.purpose}</span>
                  </div>
                )}

                {data.attachments?.length > 0 && (
                  <div className={styles.reimbursementDetailsModalFullRow}>
                    <p>Documents</p>
                    <span>
                      {data.attachments.map((file) => (
                        <a
                          key={file._id}
                          href={`${UPLOADS_PATH_BASE_URL}${file.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            styles.reimbursementDetailsModalDetailsLink
                          }
                        >
                          {file.fileName}
                        </a>
                      ))}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReimbursementDetailsModal;
