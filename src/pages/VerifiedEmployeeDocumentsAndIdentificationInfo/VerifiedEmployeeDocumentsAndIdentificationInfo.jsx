import React, { useState, useEffect } from "react";
import styles from "./VerifiedEmployeeDocumentsAndIdentificationInfo.module.css";
import { getEmployeeIDandDocDetails } from "../../services/addEmployeeService";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import { useParams } from "react-router-dom";

const VerifiedEmployeeDocumentsAndIdentificationInfo = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await getEmployeeIDandDocDetails(id);
        if (result.success) {
          setDocuments(result.data.idDocumentsInfo);
        } else {
          console.error("Failed to fetch ID documents", result.message);
        }
      } catch (error) {
        console.error("Error fetching ID documents:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocuments();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!documents) return <p>No document data found.</p>;

  return (
    <div className={styles.VerifiedEmployeeDocumentsAndIdentificationInfoWrapper}>
      <div className={styles.VerifiedEmployeeDocumentsAndIdentificationInfoGrid}>

        {/* Column 1 */}
        <div className={styles.VerifiedEmployeeDocumentsAndIdentificationInfoColumn}>
          {documents.hasPassport === "true" && (
            <div>
              <p>Do you have a passport?</p>
              <h4>Yes</h4>
            </div>
          )}
          {documents.aadhaarNumber?.value && (
            <div>
              <p>Aadhar Number</p>
              <h4>{documents.aadhaarNumber.value}</h4>
            </div>
          )}
          {documents.panCopy?.value && (
            <div>
              <p>PAN Card Copy</p>
              <a href={`${UPLOADS_PATH_BASE_URL}${documents.panCopy.value}`} target="_blank" rel="noopener noreferrer">PAN.pdf</a>
            </div>
          )}
          {documents.hasDrivingLicense === "true" && (
            <div>
              <p>Driving Licence Number</p>
              <h4>{documents.drivingLicenseNumber?.value || "N/A"}</h4>
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className={styles.VerifiedEmployeeDocumentsAndIdentificationInfoColumn}>
          {documents.passportNumber?.value && (
            <div>
              <p>Passport Number</p>
              <h4>{documents.passportNumber.value}</h4>
            </div>
          )}
          {documents.aadhaarCopy?.value && (
            <div>
              <p>Upload Copy of Aadhar Card</p>
              <a href={`${UPLOADS_PATH_BASE_URL}${documents.aadhaarCopy.value}`} target="_blank" rel="noopener noreferrer">Aadhar.pdf</a>
            </div>
          )}
          {documents.certificates?.length > 0 && documents.certificates.map((cert) => (
            <div key={cert._id}>
              <p>Certificate</p>
              <a href={`${UPLOADS_PATH_BASE_URL}${cert.copy.value}`} target="_blank" rel="noopener noreferrer">{cert.name.value}.pdf</a>
            </div>
          ))}
          {documents.drivingLicenseCopy?.value && documents.hasDrivingLicense === "true" && (
            <div>
              <p>Upload Copy of Driving Licence</p>
              <a href={`${UPLOADS_PATH_BASE_URL}${documents.drivingLicenseCopy.value}`} target="_blank" rel="noopener noreferrer">DL.pdf</a>
            </div>
          )}
        </div>

        {/* Column 3 */}
        <div className={styles.VerifiedEmployeeDocumentsAndIdentificationInfoColumn}>
          {documents.passportCopy?.value && documents.hasPassport === "true" && (
            <div>
              <p>Upload Copy of Passport</p>
              <a href={`${UPLOADS_PATH_BASE_URL}${documents.passportCopy.value}`} target="_blank" rel="noopener noreferrer">Passport.pdf</a>
            </div>
          )}
          {documents.panNumber?.value && (
            <div>
              <p>PAN No</p>
              <h4>{documents.panNumber.value}</h4>
            </div>
          )}
          {documents.hasDrivingLicense === "true" && (
            <div>
              <p>Do you have a Driving Licence?</p>
              <h4>Yes</h4>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VerifiedEmployeeDocumentsAndIdentificationInfo;
