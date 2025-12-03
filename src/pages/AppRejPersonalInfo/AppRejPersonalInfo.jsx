import React, { useState, useEffect } from "react";
import styles from "./AppRejPersonalInfo.module.css";
import img from "../../assets/images/profile.jpg";
import Button from "../../components/Button/Button";
import RejectedFieldsModal from "../../components/RejectedFieldsModal/RejectedFieldsModal";
import { getEmployeePersonalAndProfessionalInfo, verifyEmployeePersonalInfo } from "../../services/addEmployeeService";
import { useSnackbar } from "notistack";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";


function AppRejPersonalInfo({ user_id , setActiveTab} ) {
  const [showModal, setShowModal] = useState(false);
  const [rejectedFields, setRejectedFields] = useState([]);
  const [redHighlight, setRedHighlight] = useState([]);
  const [age, setAge] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifiedCompleted, setIsVerifiedCompleted] = useState(false);


  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const dob = new Date(dobString);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }
    if (today.getDate() < dob.getDate()) {
      months--;
    }
    return `${years}y ${months}m`;
  };

  const fieldNameMap = {
    "Profile Image": "profileImage",
    "First Name": "firstName",
    "Middle Name": "middleName",
    "Last Name": "lastName",
    "Date of Birth": "dateOfBirth",
    "Gender": "gender",
    "Address (Primary)": "primaryAddress",
    "Address (Permanent)": "permanentAddress",
    "Nationality": "nationality",
    "State": "state",
    "City": "city",
    "Place": "place",
    "Email (Personal)": "personalEmail",
    "Email (Official)": "officialEmail",
    "Contact (Primary)": "primaryContactNo",
    "Contact (Secondary)": "secondaryContactNo",
    "Contact (Emergency)": "emergencyContactNo",
    "Date of Joining": "dateOfJoining",
    "Previous Experience": "previousExperience",
    "Qualifications": "qualifications",
    "Technical Expertise": "technicalExpertise"
  };

  // Initialize employeeData and verificationStatus on load
  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeePersonalAndProfessionalInfo(user_id);
      if (response.success) {
        setEmployeeData(response.data);

        // Calculate age
        const dob = response.data.personalInfo?.dateOfBirth?.value;
        if (dob) setAge(calculateAge(dob));

        // Initialize verification status from isVerified flags
        const initialVerification = {};
        Object.entries(fieldNameMap).forEach(([label, key]) => {
          let isVerified = false;

          if (key === "qualifications") {
            // For arrays, consider verified if ALL are verified (or default false)
            const quals = response.data.professionalInfo?.qualifications || [];
            isVerified = quals.length > 0 && quals.every(q => q.isVerified === true);
          } else if (key === "technicalExpertise") {
            const techs = response.data.professionalInfo?.technicalExpertise || [];
            isVerified = techs.length > 0 && techs.every(t => t.isVerified === true);
          } else {
            // Single field isVerified
            const val = key.includes('.') ? getNested(response.data, key) : response.data[key];
            if (key in response.data) {
              isVerified = response.data[key]?.isVerified ?? false;
            }
            // For nested fields personalInfo, professionalInfo, contactInfo, etc
            else if (response.data.personalInfo && response.data.personalInfo[key]?.isVerified !== undefined) {
              isVerified = response.data.personalInfo[key]?.isVerified;
            } else if (response.data.contactInfo && response.data.contactInfo[key]?.isVerified !== undefined) {
              isVerified = response.data.contactInfo[key]?.isVerified;
            } else if (response.data.professionalInfo && response.data.professionalInfo[key]?.isVerified !== undefined) {
              isVerified = response.data.professionalInfo[key]?.isVerified;
            }
          }

          initialVerification[key] = isVerified || false;
        });
        setVerificationStatus(initialVerification);

        const allVerified = Object.entries(fieldNameMap).every(([label, key]) => {
  let hasValue = false;
  if (key === "profileImage") hasValue = true;
  else if (key === "qualifications") hasValue = (response.data.professionalInfo?.qualifications?.length || 0) > 0;
  else if (key === "technicalExpertise") hasValue = (response.data.professionalInfo?.technicalExpertise?.length || 0) > 0;
  else hasValue =
    (response.data.personalInfo?.[key]?.value ?? null) !== null ||
    (response.data.contactInfo?.[key]?.value ?? null) !== null ||
    (response.data.professionalInfo?.[key]?.value ?? null) !== null ||
    (response.data[key]?.value ?? null) !== null;

   return !hasValue || initialVerification[key] === true;
});
setIsVerifiedCompleted(allVerified);


        // Initial red highlight: fields with value and NOT verified
        const unverifiedLabels = Object.entries(fieldNameMap).filter(([label, key]) => {
          let hasValue = false;
          if (key === "profileImage") {
            hasValue = true;
          } else if (key === "qualifications") {
            hasValue = (response.data.professionalInfo?.qualifications?.length || 0) > 0;
          } else if (key === "technicalExpertise") {
            hasValue = (response.data.professionalInfo?.technicalExpertise?.length || 0) > 0;
          } else {
            hasValue =
              (response.data.personalInfo?.[key]?.value ?? null) !== null ||
              (response.data.contactInfo?.[key]?.value ?? null) !== null ||
              (response.data.professionalInfo?.[key]?.value ?? null) !== null ||
              (response.data[key]?.value ?? null) !== null;
          }

          return hasValue && !initialVerification[key];
        }).map(([label]) => label);
        setRedHighlight(unverifiedLabels);
      } else {
        console.error(response.message);
        setEmployeeData(null);
        setVerificationStatus({});
        setRedHighlight([]);
      }
    };
    fetchData();
  }, [user_id]);

  const handleCheckboxChange = (key, checked) => {
    setVerificationStatus(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleApprove = async () => {
    // Gather unchecked labels where there is value
    const uncheckedLabels = Object.entries(fieldNameMap).filter(([label, key]) => {
      let hasValue = false;
      if (key === "profileImage") {
        hasValue = true;
      } else if (key === "qualifications") {
        hasValue = (employeeData.professionalInfo?.qualifications?.length || 0) > 0;
      } else if (key === "technicalExpertise") {
        hasValue = (employeeData.professionalInfo?.technicalExpertise?.length || 0) > 0;
      } else {
        hasValue =
          (employeeData.personalInfo?.[key]?.value ?? null) !== null ||
          (employeeData.contactInfo?.[key]?.value ?? null) !== null ||
          (employeeData.professionalInfo?.[key]?.value ?? null) !== null ||
          (employeeData[key]?.value ?? null) !== null;
      }

      return hasValue && !verificationStatus[key];
    }).map(([label]) => label);

if (uncheckedLabels.length > 0) {
  setRejectedFields(uncheckedLabels);
  setRedHighlight(uncheckedLabels);

  const initialReasons = {};
  uncheckedLabels.forEach(label => {
    const key = fieldNameMap[label];

    if (key === "qualifications") {
      const quals = employeeData.professionalInfo?.qualifications || [];
      const firstReason = quals.find(q => q.rejectionReason)?.rejectionReason;
      if (firstReason) {
        initialReasons[label] = firstReason;
      }
    } else if (key === "technicalExpertise") {
      const techs = employeeData.professionalInfo?.technicalExpertise || [];
      const firstReason = techs.find(t => t.rejectionReason)?.rejectionReason;
      if (firstReason) {
        initialReasons[label] = firstReason;
      }
    } else {
      const reason =
        employeeData.personalInfo?.[key]?.rejectionReason ??
        employeeData.contactInfo?.[key]?.rejectionReason ??
        employeeData.professionalInfo?.[key]?.rejectionReason ??
        employeeData[key]?.rejectionReason ??
        "";
      if (reason) {
        initialReasons[label] = reason;
      }
    }
  });

  setShowModal({ visible: true, initialReasons });
}
else {
      // Build payload for all fields with value
      const payload = {};
      Object.entries(fieldNameMap).forEach(([label, key]) => {
        if (key === "qualifications") {
          const quals = employeeData.professionalInfo?.qualifications || [];
          payload[key] = quals.map(() => ({ isVerified: true, rejectionReason: "" }));
        } else if (key === "technicalExpertise") {
          const techs = employeeData.professionalInfo?.technicalExpertise || [];
          payload[key] = techs.map(() => ({ isVerified: true, rejectionReason: "" }));
        } else {
          // Only add if value exists in any section
          const val =
            employeeData.personalInfo?.[key]?.value ??
            employeeData.contactInfo?.[key]?.value ??
            employeeData.professionalInfo?.[key]?.value ??
            employeeData[key]?.value ??
            null;
          if (val !== null) {
            payload[key] = { isVerified: true, rejectionReason: "" };
          }
        }
      });

      try {
        const res = await verifyEmployeePersonalInfo(user_id, payload);
        if (res.success) {
          setRedHighlight([]);
          setIsVerifiedCompleted(true);
          enqueueSnackbar("Verification submitted successfully.", { variant: "success" });

          
  if (setActiveTab) {
    setActiveTab("documents"); // move to next tab
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

    const payload = {};
    Object.entries(fieldNameMap).forEach(([label, key]) => {
      const isChecked = verificationStatus[key] || false;
      if (key === "qualifications") {
        const quals = employeeData.professionalInfo?.qualifications || [];
        payload[key] = quals.map(() => ({
          isVerified: isChecked,
          rejectionReason: isChecked ? "" : String(rejectionReasons[label] || "")
        }));
      } else if (key === "technicalExpertise") {
        const techs = employeeData.professionalInfo?.technicalExpertise || [];
        payload[key] = techs.map(() => ({
          isVerified: isChecked,
          rejectionReason: isChecked ? "" : String(rejectionReasons[label] || "")
        }));
      } else {
        payload[key] = {
          isVerified: isChecked,
          rejectionReason: isChecked ? "" : String(rejectionReasons[label] || "")
        };
      }
    });

    try {
      const res = await verifyEmployeePersonalInfo(user_id, payload);
      if (res.success) {
        enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
        if (setActiveTab) setActiveTab("documents");
        // Update red highlight for still unchecked fields with value
        const uncheckedLabels = Object.entries(fieldNameMap).filter(([label, key]) => {
          let hasValue = false;
          if (key === "qualifications") {
            hasValue = (employeeData.professionalInfo?.qualifications?.length || 0) > 0;
          } else if (key === "technicalExpertise") {
            hasValue = (employeeData.professionalInfo?.technicalExpertise?.length || 0) > 0;
          } else {
            hasValue =
              (employeeData.personalInfo?.[key]?.value ?? null) !== null ||
              (employeeData.contactInfo?.[key]?.value ?? null) !== null ||
              (employeeData.professionalInfo?.[key]?.value ?? null) !== null ||
              (employeeData[key]?.value ?? null) !== null;
          }
          return hasValue && !verificationStatus[key];
        }).map(([label]) => label);
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

  // Helper to render each field with checkbox
const renderField = (label, value, fullWidth = false, isProfileImage = false) => {
  const key = fieldNameMap[label];
  const checked = verificationStatus[key] || false;
  const isRed = redHighlight.includes(label);

  if (isProfileImage) {
    return (
      <div
        key={label}
        className={`${styles.arpi_profileBlock} ${isRed ? styles.redBorder : ""}`}
      >
        <div className={styles.arpi_checkboxWrap}>
          <input
            type="checkbox"
            className={styles.arpi_checkbox}
            checked={checked}
            onChange={(e) => handleCheckboxChange(key, e.target.checked)}
          />
        </div>
        <img
          src={value || img}
          alt="Profile"
          className={styles.arpi_imageLarge}
        />
      </div>
    );
  }

  return (
    <div
      key={label}
      className={`${styles.arpi_fieldGroup} ${isRed ? styles.redBorder : ""} ${fullWidth ? styles.fullWidth : ""}`}
    >
      <div className={styles.arpi_checkboxWrap}>
        <input
          type="checkbox"
          className={styles.arpi_checkbox}
          checked={checked}
          onChange={(e) => handleCheckboxChange(key, e.target.checked)}
        />
      </div>
      <div className={styles.arpi_fieldContent}>
        <div className={styles.arpi_label}>{label}</div>
        <div className={styles.arpi_value}>
          {value && value.trim() ? value : "-"}
        </div>
      </div>
    </div>
  );
};

  if (!employeeData) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataMessage}>No dependent information updated so far.</div>
      </div>
    );
  }

  return (
    <div className={styles.arpi_container}>
      <div className={styles.arpi_card}>
        <div className={styles.arpi_row}>
          {renderField(
            "Profile Image",
            employeeData.profileImage?.value
              ? `${UPLOADS_PATH_BASE_URL}${employeeData.profileImage.value}`
              : null, // Pass null so verification logic knows it's empty
            false,
            true
          )}


          <div className={styles.arpi_profileFields}>
            <div className={styles.arpi_row}>
              {renderField("First Name", employeeData.personalInfo?.firstName?.value)}
              {renderField("Middle Name", employeeData.personalInfo?.middleName?.value)}
              {renderField("Last Name", employeeData.personalInfo?.lastName?.value)}
            </div>
            <div className={styles.arpi_row}>
              {renderField("Date of Birth", employeeData.personalInfo?.dateOfBirth?.value)}
              {renderField("Gender", employeeData.personalInfo?.gender?.value)}

            </div>
          </div>
        </div>

        <div className={styles.arpi_row}>
          {renderField("Address (Primary)", employeeData.contactInfo?.primaryAddress?.value)}
          {renderField("Address (Permanent)", employeeData.contactInfo?.permanentAddress?.value)}

        </div>

        <div className={styles.arpi_row}>
          {renderField("Nationality", employeeData.personalInfo?.nationality?.value)}
          {renderField("State", employeeData.contactInfo?.state?.value)}
        </div>

        <div className={styles.arpi_row}>
          {renderField("City", employeeData.contactInfo?.city?.value)}
          {renderField("Place", employeeData.contactInfo?.place?.value)}
        </div>

        <div className={styles.arpi_row}>
          {renderField("Email (Personal)", employeeData.contactInfo?.personalEmail?.value)}
          {renderField("Email (Official)", employeeData.professionalInfo?.officialEmail?.value)}
          {renderField("Contact (Primary)", employeeData.contactInfo?.primaryContactNo?.value)}
        </div>

        <div className={styles.arpi_row}>
          {renderField("Contact (Secondary)", employeeData.contactInfo?.secondaryContactNo?.value)}
          {renderField("Contact (Emergency)", employeeData.contactInfo?.emergencyContactNo?.value)}
        </div>

        <div className={styles.arpi_row}>
          {renderField("Date of Joining", employeeData.professionalInfo?.dateOfJoining?.value)}
          {renderField("Previous Experience", employeeData.professionalInfo?.previousExperience?.value)}
        </div>

        <div className={styles.arpi_row}>
          {renderField(
            "Qualifications",
            employeeData.professionalInfo?.qualifications?.map((q) => q.value).join(", "),
            true
          )}
        </div>

        <div className={styles.arpi_row}>
          {renderField(
            "Technical Expertise",
            employeeData.professionalInfo?.technicalExpertise?.map((te) => te.value).join(", "),
            true
          )}
        </div>

        <div className={styles.arpi_buttonRow}>
  {isVerifiedCompleted ? (
    <div className={styles.verifiedMessage}>✅ Verification Completed</div>
  ) : (
    <Button label="Approve" onClick={handleApprove} />
  )}
</div>

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

export default AppRejPersonalInfo;