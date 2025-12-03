import React, { useState, useEffect } from "react";
import styles from "./AppRejHealthInfo.module.css";
import Button from "../../components/Button/Button";
import RejectedFieldsModal from "../../components/RejectedFieldsModal/RejectedFieldsModal";
import { getEmployeeHealthInfo, verifyEmployeeHealthInfo } from "../../services/addEmployeeService";
import { useSnackbar } from "notistack";

function AppRejHealthInfo({ user_id , setActiveTab}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectedFields, setRejectedFields] = useState([]);
  const [redHighlight, setRedHighlight] = useState([]);
  const [healthInfo, setHealthInfo] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifiedCompleted, setIsVerifiedCompleted] = useState(false);


  // Field label -> backend key mapping
  const fieldNameMap = {
    "Blood Group": "bloodGroup",
    "Height (CM)": "heightInCm",
    "Weight (KG)": "weightInKg",
    "Health Issues Details": "healthIssueDetails",
    "Medication Details": "medicationDetails",
    "Allergy Details": "allergyDetails"
  };

  // Load data and initialize verificationStatus from isVerified values
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployeeHealthInfo(user_id);
        if (res.success && res.data) {
          setHealthInfo(res.data);

          // Initialize verificationStatus from backend data's isVerified flags
          const initialVerification = {};
          Object.entries(fieldNameMap).forEach(([label, key]) => {
            const field = res.data[key];
            if (field && typeof field.isVerified === "boolean") {
              initialVerification[key] = field.isVerified;
            } else {
              initialVerification[key] = false; // default unchecked
            }
          });
          setVerificationStatus(initialVerification);

          // Initial red highlight for fields that are NOT verified and have values
          const unverifiedLabels = Object.entries(fieldNameMap)
            .filter(([label, key]) => !initialVerification[key] && res.data[key]?.value != null)
            .map(([label]) => label);
          setRedHighlight(unverifiedLabels);
          // Check if all fields with values are verified
          const hasAnyValue = Object.values(res.data).some(f => f?.value != null);
          const allVerified = hasAnyValue && Object.entries(fieldNameMap).every(([label, key]) => {
            const field = res.data[key];
            return field?.value == null || initialVerification[key] === true;
          });

          if (allVerified) {
            setIsVerifiedCompleted(true);
          }


        } else {
          setHealthInfo(null);
          setVerificationStatus({});
          setRedHighlight([]);
        }
      } catch (error) {
        console.error("Error fetching health info:", error);
        setHealthInfo(null);
        setVerificationStatus({});
        setRedHighlight([]);
      }
    };
    fetchData();
  }, [user_id]);

  const handleApprove = async () => {
    // Collect labels of unchecked (not verified) fields that have value
    const uncheckedLabels = Object.entries(fieldNameMap)
      .filter(([label, key]) => !verificationStatus[key] && healthInfo[key]?.value != null)
      .map(([label]) => label);

    if (uncheckedLabels.length > 0) {
      setRejectedFields(uncheckedLabels);
      setRedHighlight(uncheckedLabels);
      const initialReasons = {};
    uncheckedLabels.forEach(label => {
      const key = fieldNameMap[label];
      if (key && healthInfo[key]?.rejectionReason) {
        initialReasons[label] = healthInfo[key].rejectionReason;
      }
    });

    setShowModal({ visible: true, initialReasons });
    } else {
      // All verified, build payload for fields that have values
      const payload = {};
      Object.entries(fieldNameMap).forEach(([label, key]) => {
        if (healthInfo[key]?.value != null) {
          payload[key] = { isVerified: true, rejectionReason: "" };
        }
      });

      try {
        const res = await verifyEmployeeHealthInfo(user_id, payload);
        if (res.success) {
          setRedHighlight([]);
          setIsVerifiedCompleted(true);
          enqueueSnackbar("Verification submitted successfully.", { variant: "success" });

          if (setActiveTab) {
  setActiveTab("dependents"); // move to Dependents Info
}
        } else {
          enqueueSnackbar(`Submission failed: ${res.message || "Unknown error"}`, { variant: "error" });
        }
      } catch (error) {
        console.error("Unexpected error during verification:", error);
        enqueueSnackbar(`Unexpected error: ${error.message || "Something went wrong"}`, { variant: "error" });
      }
    }
  };

  const handleProceed = async (rejectionReasons = {}) => {
    setShowModal(false);

    // Build payload only for fields that have values
    const payload = {};
    Object.entries(fieldNameMap).forEach(([label, key]) => {
      if (healthInfo[key]?.value != null) {
        const isVerified = verificationStatus[key] || false;
        payload[key] = {
          isVerified,
          rejectionReason: isVerified ? "" : String(rejectionReasons[label] || "")
        };
      }
    });

    try {
      const res = await verifyEmployeeHealthInfo(user_id, payload);
      if (res.success) {
        enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
        if (setActiveTab) setActiveTab("dependents");

        // Update red highlight for still unchecked fields
        const uncheckedLabels = Object.entries(fieldNameMap)
          .filter(([label, key]) => !verificationStatus[key] && healthInfo[key]?.value != null)
          .map(([label]) => label);
        setRedHighlight(uncheckedLabels);
        setRejectedFields([]);
      } else {
        enqueueSnackbar(`Submission failed: ${res.message || "Unknown error"}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Unexpected error during verification:", error);
      enqueueSnackbar(`Unexpected error: ${error.message || "Something went wrong"}`, { variant: "error" });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // Checkbox change handler to update controlled state
  const handleCheckboxChange = (key, checked) => {
    setVerificationStatus(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // No data fallback
  if (!healthInfo || Object.keys(healthInfo).length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataMessage}>No Health Info Available</div>
      </div>
    );
  }

  // Helper to render each field with controlled checkbox
  const renderField = (label, fieldData) => {
    const key = fieldNameMap[label];
    if (!fieldData?.value) return null;
    return (
      <FieldBlock
        key={label}
        label={label}
        value={fieldData.value.toString()}
        checked={verificationStatus[key] || false}
        onChange={checked => handleCheckboxChange(key, checked)}
        redHighlight={redHighlight.includes(label)}
      />
    );
  };

  return (
    <div className={styles.arhi_container}>
      <div className={styles.arhi_grid}>
        {/* Blood Group - Always show */}
        {renderField("Blood Group", healthInfo.bloodGroup)}

        {/* Height - Always show */}
        {renderField("Height (CM)", healthInfo.heightInCm)}

        {/* Weight - Always show */}
        {renderField("Weight (KG)", healthInfo.weightInKg)}

        {/* Health Issues - conditional */}
        {healthInfo.hasHealthIssue && renderField("Health Issues Details", healthInfo.healthIssueDetails)}

        {/* Medication Details - conditional */}
        {healthInfo.takesMedication && renderField("Medication Details", healthInfo.medicationDetails)}

        {/* Allergy Details - conditional */}
        {healthInfo.isAllergic && renderField("Allergy Details", healthInfo.allergyDetails)}
      </div>

      <div className={styles.arhi_actions}>
        {isVerifiedCompleted ? (
          <div className={styles.verifiedMessage}>✅ Verification Completed</div>
        ) : ( 
          <Button label="Approve" type="button" onClick={handleApprove} />
        )}
      </div>

      {showModal && (
        <RejectedFieldsModal
          fields={rejectedFields}
           initialComments={showModal.initialReasons || {}}
          onCancel={handleCancel}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
}

const FieldBlock = ({ label, value, checked, onChange, redHighlight }) => {
  return (
    <div className={`${styles.arhi_fieldGroup} ${redHighlight ? styles.redBorder : ""}`}>
      <div className={styles.arhi_checkboxWrap}>
        <input
          type="checkbox"
          className={styles.arhi_checkbox}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
      </div>
      <div className={styles.arhi_fieldContent}>
        <div className={styles.arhi_label}>{label}</div>
        <div className={styles.arhi_value}>{value}</div>
      </div>
    </div>
  );
};

export default AppRejHealthInfo;
