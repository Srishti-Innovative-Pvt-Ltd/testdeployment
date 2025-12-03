import React, { useState, useEffect } from 'react';
import styles from './AppRejIdDocuments.module.css';
import { Icon } from '@iconify/react';
import Button from '../../components/Button/Button';
import RejectedFieldsModal from '../../components/RejectedFieldsModal/RejectedFieldsModal';
import { getEmployeeIDandDocDetails, verifyEmployeeIdAndDocuments } from "../../services/addEmployeeService";
import { useSnackbar } from "notistack";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";

function AppRejIdDocuments({ user_id , setActiveTab }) {
  const [documentData, setDocumentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectedFields, setRejectedFields] = useState([]);
  const [redHighlight, setRedHighlight] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifiedCompleted, setIsVerifiedCompleted] = useState(false);

  // Field label -> backend key mapping
  const fieldNameMap = {
    "Passport Number": "passportNumber",
    "Passport Copy": "passportCopy",
    "Aadhar Number": "aadhaarNumber",
    "Aadhar Card Copy": "aadhaarCopy",
    "PAN Number": "panNumber",
    "PAN Card Copy": "panCopy",
    "Driving License Number": "drivingLicenseNumber",
    "Driving License Copy": "drivingLicenseCopy"
  };

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await getEmployeeIDandDocDetails(user_id);
        if (response.success && response.data?.idDocumentsInfo) {
          const raw = response.data.idDocumentsInfo;
          // Normalize booleans from string/boolean mix
          const hasPassport = String(raw.hasPassport?.value ?? raw.hasPassport)
            .toLowerCase() === "true";
          const hasDrivingLicense = String(raw.hasDrivingLicense?.value ?? raw.hasDrivingLicense)
            .toLowerCase() === "true";

          const data = {
            ...raw,
            hasPassport,
            hasDrivingLicense
          };
          setDocumentData(data);

          // Initialize verificationStatus from backend data's isVerified flags
          const initialVerification = {};
          const initialRedHighlight = [];


          // Process main fields
          Object.entries(fieldNameMap).forEach(([label, key]) => {
            const field = data[key];
            if (field) {
              initialVerification[key] = field.isVerified || false;
              if (field.value && !field.isVerified) {
                initialRedHighlight.push(label);
              }
            }
          });

          // Process certificates
          if (data.certificates) {
            data.certificates.forEach((cert, idx) => {
              if (cert.name) {
                const nameKey = `certificateName_${idx}`;
                initialVerification[nameKey] = cert.name.isVerified || false;
                if (cert.name.value && !cert.name.isVerified) {
                  initialRedHighlight.push(`Certificate ${idx + 1} Name`);
                }
              }
              if (cert.copy) {
                const copyKey = `certificateCopy_${idx}`;
                initialVerification[copyKey] = cert.copy.isVerified || false;
                if (cert.copy.value && !cert.copy.isVerified) {
                  initialRedHighlight.push(`Certificate ${idx + 1} File`);
                }
              }
            });
          }

          setVerificationStatus(initialVerification);
          setRedHighlight(initialRedHighlight);
          // Check if all fields with values are verified
          const allVerified = Object.entries(fieldNameMap).every(([label, key]) => {
            const field = data[key];
            return !field?.value || initialVerification[key] === true;
          }) && (!data.certificates || data.certificates.every((cert, idx) => {
            const nameVerified = !cert.name?.value || initialVerification[`certificateName_${idx}`] === true;
            const copyVerified = !cert.copy?.value || initialVerification[`certificateCopy_${idx}`] === true;
            return nameVerified && copyVerified;
          }));

          setIsVerifiedCompleted(allVerified);


        }
      } catch (error) {
        enqueueSnackbar('Failed to load document details', { variant: 'error' });
        console.error('Error loading document details:', error);
      }
    };
    fetchDocumentDetails();
  }, [user_id, enqueueSnackbar]);

  const handlePreview = (filePath) => {
    if (!filePath) return;
    const fullPath = filePath.startsWith("http") ? filePath : `${UPLOADS_PATH_BASE_URL}${filePath}`;
    setPreviewFile({ url: fullPath, name: filePath.split("/").pop() });
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const handleApprove = async () => {
    // Collect labels of unchecked (not verified) fields
    const uncheckedLabels = [];

    // Check main fields
    Object.entries(fieldNameMap).forEach(([label, key]) => {
      if (documentData[key]?.value && !verificationStatus[key]) {
        uncheckedLabels.push(label);
      }
    });

    // Check certificates
    if (documentData.certificates) {
      documentData.certificates.forEach((cert, idx) => {
        if (cert.name?.value && !verificationStatus[`certificateName_${idx}`]) {
          uncheckedLabels.push(`Certificate ${idx + 1} Name`);
        }
        if (cert.copy?.value && !verificationStatus[`certificateCopy_${idx}`]) {
          uncheckedLabels.push(`Certificate ${idx + 1} File`);
        }
      });
    }

    if (uncheckedLabels.length > 0) {
      setRejectedFields(uncheckedLabels);
      setRedHighlight(uncheckedLabels);
      //Build initial rejection reasons for unchecked fields
    const initialReasons = {};
    uncheckedLabels.forEach(label => {
      const key = fieldNameMap[label];
      if (key && documentData[key]?.rejectionReason) {
        initialReasons[label] = documentData[key].rejectionReason;
      }

      if (label.startsWith("Certificate")) {
        const idx = parseInt(label.split(" ")[1]) - 1;
        const type = label.includes("Name") ? "name" : "copy";
        if (documentData.certificates[idx]?.[type]?.rejectionReason) {
          initialReasons[label] = documentData.certificates[idx][type].rejectionReason;
        }
      }
    });

    setShowModal({ visible: true, initialReasons });
    } else {
      // All verified, build payload
      const payload = buildVerificationPayload();
      try {
        const res = await verifyEmployeeIdAndDocuments(user_id, payload);
        if (res.success) {
          setRedHighlight([]);
          setIsVerifiedCompleted(true);
          enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
          if (setActiveTab) {
  setActiveTab("health"); // move to Health Info
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

  const buildVerificationPayload = () => {
    const payload = {};

    // Process main fields
    Object.entries(fieldNameMap).forEach(([label, key]) => {
      if (documentData[key]?.value != null) {
        payload[key] = {
          isVerified: verificationStatus[key] || false,
          rejectionReason: verificationStatus[key] ? "" : "Not verified"
        };
      }
    });

    // Process certificates
    if (documentData.certificates) {
      payload.certificates = documentData.certificates.map((cert, idx) => ({
        name: {
          value: cert.name?.value,
          isVerified: verificationStatus[`certificateName_${idx}`] || false,
          rejectionReason: verificationStatus[`certificateName_${idx}`] ? "" : "Not verified"
        },
        copy: {
          value: cert.copy?.value,
          isVerified: verificationStatus[`certificateCopy_${idx}`] || false,
          rejectionReason: verificationStatus[`certificateCopy_${idx}`] ? "" : "Not verified"
        },
        _id: cert._id
      }));
    }

    return payload;
  };

  const handleProceed = async (rejectionReasons = {}) => {
    setShowModal(false);

    const payload = buildVerificationPayload();

    // Update rejection reasons from modal if provided
    Object.entries(rejectionReasons).forEach(([label, reason]) => {
      // Find the field in the payload and update its rejection reason
      const fieldKey = Object.entries(fieldNameMap).find(([l, key]) => l === label)?.[1];
      if (fieldKey && payload[fieldKey]) {
        payload[fieldKey].rejectionReason = reason;
      }

      // Handle certificate fields
      if (label.startsWith("Certificate")) {
        const idx = parseInt(label.split(" ")[1]) - 1;
        const type = label.includes("Name") ? "name" : "copy";
        if (payload.certificates && payload.certificates[idx]) {
          payload.certificates[idx][type].rejectionReason = reason;
        }
      }
    });

    try {
      const res = await verifyEmployeeIdAndDocuments(user_id, payload);
      if (res.success) {
        enqueueSnackbar("Verification submitted successfully.", { variant: "success" });
        if (setActiveTab) setActiveTab("health");

        // Update red highlight to fields still unchecked
        const uncheckedLabels = [];
        Object.entries(fieldNameMap).forEach(([label, key]) => {
          if (documentData[key]?.value && !verificationStatus[key]) {
            uncheckedLabels.push(label);
          }
        });

        if (documentData.certificates) {
          documentData.certificates.forEach((cert, idx) => {
            if (cert.name?.value && !verificationStatus[`certificateName_${idx}`]) {
              uncheckedLabels.push(`Certificate ${idx + 1} Name`);
            }
            if (cert.copy?.value && !verificationStatus[`certificateCopy_${idx}`]) {
              uncheckedLabels.push(`Certificate ${idx + 1} File`);
            }
          });
        }

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

  // Certificate checkbox change handler
  const handleCertificateCheckboxChange = (type, index, checked) => {
    const key = `certificate${type}_${index}`;
    setVerificationStatus(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  if (!documentData) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataMessage}>No ID & Documents Available</div>
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

  // Helper to render a file field with controlled checkbox
  const renderFileField = (label, filePath) => {
    const key = fieldNameMap[label];
    if (!filePath) return null;
    return (
      <FileBlock
        key={label}
        label={label}
        filePath={filePath}
        checked={verificationStatus[key] || false}
        onChange={checked => handleCheckboxChange(key, checked)}
        redHighlight={redHighlight.includes(label)}
        onPreview={handlePreview}
      />
    );
  };

  return (
    <div className={styles.arid_container}>
      <div className={styles.arid_card}>

        {/* Row 1 - Passport (only if hasPassport) */}
        {documentData.hasPassport && (
          <div className={styles.arid_row}>
            {renderField("Passport Number", documentData.passportNumber)}
            {renderFileField("Passport Copy", documentData.passportCopy?.value)}
          </div>
        )}

        {/* Row 2 - Aadhar */}
        <div className={styles.arid_row}>
          {renderField("Aadhar Number", documentData.aadhaarNumber)}
          {renderFileField("Aadhar Card Copy", documentData.aadhaarCopy?.value)}
        </div>

        {/* Row 3 - PAN */}
        <div className={styles.arid_row}>
          {renderField("PAN Number", documentData.panNumber)}
          {renderFileField("PAN Card Copy", documentData.panCopy?.value)}
        </div>

        {/* Row 4 - Driving License (only if hasDrivingLicense) */}
        {documentData.hasDrivingLicense && (
          <div className={styles.arid_row}>
            {renderField("Driving License Number", documentData.drivingLicenseNumber)}
            {renderFileField("Driving License Copy", documentData.drivingLicenseCopy?.value)}
          </div>
        )}

        {/* Certificates */}
        {documentData.certificates?.map((cert, idx) => (
          <div key={idx} className={styles.arid_row}>
            <FieldBlock
              label={`Certificate ${idx + 1} Name`}
              value={cert.name?.value || 'N/A'}
              checked={verificationStatus[`certificateName_${idx}`] || false}
              onChange={checked => handleCertificateCheckboxChange("Name", idx, checked)}
              redHighlight={redHighlight.includes(`Certificate ${idx + 1} Name`)}
            />
            <FileBlock
              label={`Certificate ${idx + 1} File`}
              filePath={cert.copy?.value}
              checked={verificationStatus[`certificateCopy_${idx}`] || false}
              onChange={checked => handleCertificateCheckboxChange("Copy", idx, checked)}
              redHighlight={redHighlight.includes(`Certificate ${idx + 1} File`)}
              onPreview={handlePreview}
            />
          </div>
        ))}

        {/* Buttons */}
        <div className={styles.arid_buttonRow}>
          {isVerifiedCompleted ? (
            <div className={styles.verifiedMessage}>✅ Verification Completed</div>
          ) : (
            <Button label="Approve" type="button" onClick={handleApprove} />
          )}
        </div>

      </div>

      {showModal && (
        <RejectedFieldsModal
          fields={rejectedFields}
          onCancel={handleCancel}
           initialComments={showModal.initialReasons || {}}
          onProceed={handleProceed}
        />
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className={styles.previewOverlay} onClick={closePreview}>
          <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>{previewFile.name}</span>
              <button className={styles.previewClose} onClick={closePreview}>
                <Icon icon="mdi:close" width={24} height={24} />
              </button>
            </div>
            <div className={styles.previewBody}>
              {previewFile.url.toLowerCase().endsWith('.pdf') ? (
                <object
                  data={`${previewFile.url}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className={styles.pdfPreview}
                >
                  <p className={styles.pdfPreviewMessage}>PDF viewer not available. <a target="_blank"
                    rel="noopener noreferrer"
                    href={previewFile.url} download>Download PDF</a> instead.</p>
                </object>
              ) : (
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={previewFile.url}
                    className={styles.imagePreview}
                    alt="Document Preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FieldBlock = ({ label, value, checked, onChange, redHighlight }) => {
  return (
    <div className={`${styles.arid_fieldGroup} ${redHighlight ? styles.redBorder : ""}`}>
      <div className={styles.arid_checkboxWrap}>
        <input
          type="checkbox"
          className={styles.arid_checkbox}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <div className={styles.arid_fieldContent}>
        <div className={styles.arid_label}>{label}</div>
        <div className={styles.arid_value}>{value}</div>
      </div>
    </div>
  );
};

const FileBlock = ({ label, filePath, checked, onChange, redHighlight, onPreview }) => {
  if (!filePath) {
    return (
      <div className={`${styles.arid_fieldGroup} ${redHighlight ? styles.redBorder : ""}`}>
        <div className={styles.arid_checkboxWrap}>
          <input
            type="checkbox"
            className={styles.arid_checkbox}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
        </div>
        <div className={styles.arid_fieldContent}>
          <div className={styles.arid_label}>{label}</div>
          <div className={styles.arid_value}>No file uploaded</div>
        </div>
      </div>
    );
  }

  const fileName = filePath.split("/").pop();
  const fullPath = filePath.startsWith("http") ? filePath : `${UPLOADS_PATH_BASE_URL}${filePath}`;
  const isPDF = filePath.toLowerCase().endsWith('.pdf');

  const handleClick = () => {
    if (isPDF) {
      // Open PDF in a new tab
      window.open(fullPath, "_blank");
    } else {
      // Open image in modal preview
      onPreview(fullPath);
    }
  };

  return (
    <div className={`${styles.arid_fieldGroup} ${redHighlight ? styles.redBorder : ""}`}>
      <div className={styles.arid_checkboxWrap}>
        <input
          type="checkbox"
          className={styles.arid_checkbox}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      <div className={styles.arid_fieldContent}>
        <div className={styles.arid_label}>{label}</div>
        <div className={styles.arid_file}>
          <span>{fileName}</span>
          <button
            type="button"
            className={styles.previewButton}
            onClick={handleClick}
          >
            <Icon icon="mdi:eye-outline" color="#007bff" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default AppRejIdDocuments;