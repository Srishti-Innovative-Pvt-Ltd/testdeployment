import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "./RejectedFieldsModal.module.css";
import Button from "../../components/Button/Button";
import { Icon } from "@iconify/react";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

// Validation schema generator
export const RejectedFieldsValidation = (fields) =>
  Yup.object().shape(
    fields.reduce((acc, field) => {
      acc[field] = Yup.string()
        .trim()
        .required(`Reason for rejecting "${field}" is required`);
      return acc;
    }, {})
  );

function RejectedFieldsModal({ fields, onCancel, onProceed, initialComments = {} }) {
  const [comments, setComments] = useState(initialComments);
  const [errors, setErrors] = useState({});

  useEffect(()=> {
    setComments(initialComments);
  },[initialComments]);

  useEscapeKey(onCancel);

  const handleCommentChange = (field, value) => {
    setComments((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleProceed = async () => {
    try {
      // Validate
      await RejectedFieldsValidation(fields).validate(comments, {
        abortEarly: false
      });

      // No errors → Proceed
      onProceed(comments);
    } catch (validationError) {
      // Collect all validation errors
      const errorObj = {};
      validationError.inner.forEach((err) => {
        errorObj[err.path] = err.message;
      });
      setErrors(errorObj);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <Icon icon="mdi:alert-circle-outline" width={28} color="#d9534f" />
          <h2>Some Fields Are Unchecked</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>
            The following fields will not be approved:
          </p>
          <ul className={styles.fieldList}>
            {fields.map((field, index) => (
              <li key={index} className={styles.fieldItem}>
                <div className={styles.fieldLabel}>• {field}</div>
                <textarea
                  className={styles.commentInput}
                  placeholder={`Reason for rejecting "${field}"`}
                  rows={2}
                  value={comments[field] || ""}
                  onChange={(e) =>
                    handleCommentChange(field, e.target.value)
                  }
                ></textarea>
                {errors[field] && (
                  <div className={styles.errorText}>{errors[field]}</div>
                )}
              </li>
            ))}
          </ul>
          <p className={styles.confirmText}>Do you want to proceed?</p>
        </div>

        <div className={styles.modalFooter}>
          <Button label="Cancel" onClick={onCancel} secondary />
          <Button label="Proceed" onClick={handleProceed} />
        </div>
      </div>
    </div>
  );
}

export default RejectedFieldsModal;