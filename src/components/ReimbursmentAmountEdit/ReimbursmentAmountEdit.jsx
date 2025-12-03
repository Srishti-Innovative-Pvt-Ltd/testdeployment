import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./ReimbursmentAmountEdit.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

import { updateReimbursementAmount } from "../../services/settingsService"; // import API
import { useSnackbar } from "notistack";

const ReimbursmentAmountEdit = ({ isOpen, onClose, initialData, onSubmit }) => {
  useEscapeKey(onClose);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    totalAmount: 0,
    advanceAmount: 0,
    settlementAmount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        totalAmount: initialData.totalAmount || 0,
        advanceAmount: initialData.advanceAmount || 0,
        settlementAmount: initialData.settlementAmount || 0,
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "settlementAmount") {
      if (value && (isNaN(value) || value < 0)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    if (!initialData?.id) return;

    // Call API
    const res = await updateReimbursementAmount(
      initialData.id,
      Number(formData.settlementAmount)
    );

    if (res.success) {
      enqueueSnackbar(res.message, { variant: "success" });
      onSubmit({ settlementAmount: formData.settlementAmount }); // update parent table
      onClose();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  return (
    <div className={styles.ReimbursmentAmountEdit_overlay}>
      <div className={styles.ReimbursmentAmountEdit_modal}>
        <div className={styles.ReimbursmentAmountEdit_header}>
          <h2>Edit Reimbursement Amount</h2>
          <button
            className={styles.ReimbursmentAmountEdit_closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.ReimbursmentAmountEdit_content}>
          <div className={styles.fullWidth}>
            <label>Total Amount</label>
            <input type="number" name="totalAmount" value={formData.totalAmount} readOnly />
          </div>

          <div className={styles.fullWidth}>
            <label>Advance Amount</label>
            <input type="number" name="advanceAmount" value={formData.advanceAmount} readOnly />
          </div>

          <div className={styles.fullWidth}>
            <label>Settlement Amount</label>
            <input
              type="number"
              name="settlementAmount"
              value={formData.settlementAmount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.ReimbursmentAmountEdit_footer}>
          <PrimaryButton label="Submit" onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
  
};

export default ReimbursmentAmountEdit;
