import React, { useEffect, useState } from "react";
import styles from "./ViewCompanyModal.module.css";
import DummyLogo from "../../assets/images/CompanyLogo.png";
import { getCompanyById } from "../../services/companyService";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";


const ViewCompanyModal = ({ companyId, onClose }) => {
  useEscapeKey(onClose);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(companyId);
        setCompany(data.company);
      } catch (error) {
        console.error("Failed to fetch company:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : company ? (
          <>
            <img
              src={company.logo ? `${UPLOADS_PATH_BASE_URL}${company.logo}` : DummyLogo}
              alt={company.companyName}
              className={styles.logo}
            />
            <h2>{company.companyName}</h2>
            <p>{company.address}</p>
          </>
        ) : (
          <p>Company not found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewCompanyModal;