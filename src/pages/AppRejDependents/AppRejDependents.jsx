import React, { useState, useEffect } from 'react';
import styles from './AppRejDependents.module.css';
import Button from '../../components/Button/Button';
import RejectedFieldsModal from '../../components/RejectedFieldsModal/RejectedFieldsModal';
import { getEmployeeDependanceInfo, verifyEmployeeDependents } from '../../services/addEmployeeService';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function AppRejDependents({ user_id }) {
  const [showModal, setShowModal] = useState(false);
  const [rejectedFields, setRejectedFields] = useState([]);
  const [redHighlight, setRedHighlight] = useState([]);
  const [dependentData, setDependentData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isVerifiedCompleted, setIsVerifiedCompleted] = useState(false);



  // Field label -> backend key mapping
  const fieldNameMap = {
    "Father Name": "fatherName",
    "Father Contact Number": "fatherContactNumber",
    "Father Occupation": "fatherOccupation",
    "Mother Name": "motherName",
    "Mother Contact Number": "motherContactNumber",
    "Mother Occupation": "motherOccupation",
    "Spouse Name": "spouseName",
    "Spouse Occupation": "spouseOccupation",
    "Spouse Contact Number": "spouseContactNumber",
    "Spouse Qualification": "spouseQualification",
    "Number of Kids": "numberOfKids",
    "Kids Ages": "kidsAges",
    "Kids Activities": "kidsActivities"
  };

  // Load data and initialize verificationStatus from isVerified values
  useEffect(() => {
    const fetchData = async () => {
      if (!user_id) return;
      const res = await getEmployeeDependanceInfo(user_id);
      if (res.success && res.data) {
        setDependentData(res.data);

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

        // Initial red highlight for fields that are NOT verified
        const unverifiedLabels = Object.entries(fieldNameMap)
          .filter(([label, key]) => !initialVerification[key] && res.data[key]?.value != null)
          .map(([label]) => label);
        setRedHighlight(unverifiedLabels);

        const hasAnyValue = Object.values(res.data).some(f => f?.value != null);
      const allVerified =
        hasAnyValue &&
        Object.entries(fieldNameMap).every(([label, key]) => {
          const field = res.data[key];
          return field?.value == null || initialVerification[key] === true;
        });

      if (allVerified) {
        setIsVerifiedCompleted(true);
      }
      }
    };
    fetchData();
  }, [user_id]);

  // When Approve button clicked
  const handleApprove = async () => {
    // Collect labels of unchecked (not verified) fields
    const uncheckedLabels = Object.entries(fieldNameMap)
      .filter(([label, key]) => !verificationStatus[key] && dependentData[key]?.value != null)
      .map(([label]) => label);

    if (uncheckedLabels.length > 0) {
      setRejectedFields(uncheckedLabels);
      setRedHighlight(uncheckedLabels);
      // Collect rejection reasons for unchecked fields
    const initialReasons = {};
    uncheckedLabels.forEach(label => {
      const key = fieldNameMap[label];
      if (dependentData[key]?.rejectionReason) {
        initialReasons[label] = dependentData[key].rejectionReason;
      }
    });

    setShowModal({ visible: true, initialReasons });
    } else {
      // All verified, build payload with all true for verified fields that have values
      const payload = {};
      Object.entries(fieldNameMap).forEach(([label, key]) => {
        if (dependentData[key]?.value != null) {
          payload[key] = { isVerified: true, rejectionReason: "" };
        }
      });

      try {
        const res = await verifyEmployeeDependents(user_id, payload);
        if (res.success) {
          setRedHighlight([]);
          setIsVerifiedCompleted(true);
          enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
           navigate("/pages/EmployeeData");
        } else {
          enqueueSnackbar(`Submission failed: ${res.message || "Unknown error"}`, { variant: "error" });
        }
      } catch (error) {
        console.error("Unexpected error during verification:", error);
        enqueueSnackbar(`Unexpected error: ${error.message || "Something went wrong"}`, { variant: "error" });
      }
    }
  };

  // After modal proceed, send rejected reasons + verification status
  const handleProceed = async (rejectionReasons = {}) => {
    setShowModal(false);

    // Build payload only for fields that have values (avoid null issues)
    const payload = {};
    Object.entries(fieldNameMap).forEach(([label, key]) => {
      if (dependentData[key]?.value != null) {
        const isVerified = verificationStatus[key] || false;
        payload[key] = {
          isVerified,
          rejectionReason: isVerified ? "" : (rejectionReasons[label] || "")
        };
      }
    });

    try {
      const res = await verifyEmployeeDependents(user_id, payload);
      if (res.success) {
        enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
         navigate("/pages/EmployeeData");

        // Update red highlight to fields still unchecked
        const uncheckedLabels = Object.entries(fieldNameMap)
          .filter(([label, key]) => !verificationStatus[key] && dependentData[key]?.value != null)
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



  if (!dependentData) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataMessage}>No Dependent information updated so far.</div>
      </div>
    );
  }

  // Destructure data fields
  const {
    fatherName,
    fatherContactNumber,
    fatherOccupation,
    motherName,
    motherContactNumber,
    motherOccupation,
    isMarried,
    spouseName,
    spouseOccupation,
    spouseContactNumber,
    spouseQualification,
    hasKids,
    kidsAges,
    kidsActivities,
    numberOfKids,
  } = dependentData;

  // Check if all relevant data fields are empty or missing
  const isAllDataEmpty =
    !fatherName?.value &&
    !fatherContactNumber?.value &&
    !fatherOccupation?.value &&
    !motherName?.value &&
    !motherContactNumber?.value &&
    !motherOccupation?.value &&
    (!isMarried || !spouseName?.value) &&
    (!hasKids || !numberOfKids?.value);

  if (isAllDataEmpty) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataMessage}>No dependent information updated so far.</div>
      </div>
    );
  }

  // Helper to render a field with controlled checkbox
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
  
// Compute unchecked fields count
const uncheckedFieldsCount = Object.entries(fieldNameMap)
  .filter(([label, key]) => !verificationStatus[key] && dependentData[key]?.value != null)
  .length;

  return (
    <div className={styles.ardp_container}>
      <div className={styles.ardp_grid}>
        {/* Father */}
        {renderField("Father Name", fatherName)}
        {renderField("Father Contact Number", fatherContactNumber)}
        {renderField("Father Occupation", fatherOccupation)}

        {/* Mother */}
        {renderField("Mother Name", motherName)}
        {renderField("Mother Contact Number", motherContactNumber)}
        {renderField("Mother Occupation", motherOccupation)}

        {/* Spouse */}
        {isMarried && (
          <>
            {renderField("Spouse Name", spouseName)}
            {renderField("Spouse Occupation", spouseOccupation)}
            {renderField("Spouse Contact Number", spouseContactNumber)}
            {renderField("Spouse Qualification", spouseQualification)}
          </>
        )}

        {/* Kids */}
        {hasKids && (
          <>
            {renderField("Number of Kids", numberOfKids)}
            {renderField("Kids Ages", kidsAges)}
            {renderField("Kids Activities", kidsActivities)}
          </>
        )}
      </div>

     <div className={styles.ardp_buttonRow}>
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
    <div className={`${styles.ardp_fieldGroup} ${redHighlight ? styles.redBorder : ''}`}>
      <div className={styles.ardp_checkboxWrap}>
        <input
          type="checkbox"
          className={styles.ardp_checkbox}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
      </div>
      <div className={styles.ardp_fieldContent}>
        <div className={styles.ardp_label}>{label}</div>
        <div className={styles.ardp_value}>{value}</div>
      </div>
    </div>
  );
};

export default AppRejDependents;
