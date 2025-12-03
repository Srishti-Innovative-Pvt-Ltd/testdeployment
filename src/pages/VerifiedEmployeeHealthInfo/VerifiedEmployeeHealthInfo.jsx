import React, { useState, useEffect } from "react";
import styles from "./VerifiedEmployeeHealthInfo.module.css";
import { getEmployeeHealthInfo } from "../../services/addEmployeeService";
import { useParams } from "react-router-dom";

const VerifiedEmployeeHealthInfo = () => {
  const { id } = useParams();

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const result = await getEmployeeHealthInfo(id);
        console.log("API Response:", result);
        if (result.success) {
          setHealth(result.data);
        } else {
          console.error("Failed to fetch health info", result.message);
        }
      } catch (error) {
        console.error("Error fetching health info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHealth();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!health) return <p>No health data found.</p>;

  return (
    <div className={styles.VerifiedEmployeeHealthInfoWrapper}>
      <div className={styles.VerifiedEmployeeHealthInfoGrid}>
        <div>
          <p>Blood Group</p>
          <h4>{health.bloodGroup?.value || "N/A"}</h4>
        </div>

        <div>
          <p>Height in CM</p>
          <h4>{health.heightInCm?.value || "N/A"}</h4>
        </div>

        <div>
          <p>Weight in KG</p>
          <h4>{health.weightInKg?.value || "N/A"}</h4>
        </div>

        {health.hasHealthIssue && (
          <div>
            <p>Any Health Issues?</p>
            <h4>{health.healthIssueDetails?.value || "Yes"}</h4>
          </div>
        )}

        {health.takesMedication && (
          <div>
            <p>Are you taking any medications?</p>
            <h4>{health.medicationDetails?.value || "Yes"}</h4>
          </div>
        )}

        {health.isAllergic && (
          <div>
            <p>Are you allergic to anything?</p>
            <h4>{health.allergyDetails?.value || "Yes"}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedEmployeeHealthInfo;
