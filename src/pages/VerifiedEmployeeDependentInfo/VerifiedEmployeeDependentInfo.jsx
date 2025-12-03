import React, { useState, useEffect } from "react";
import styles from "./VerifiedEmployeeDependentInfo.module.css";
import { getEmployeeDependanceInfo } from "../../services/addEmployeeService";
import { useParams } from "react-router-dom";

const VerifiedEmployeeDependentInfo = () => {
  const { id } = useParams();

  const [dependent, setDependent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDependentInfo = async () => {
      try {
        const result = await getEmployeeDependanceInfo(id);
        console.log("API Dependent Response:", result);
        if (result.success) {
          setDependent(result.data);
        } else {
          console.error("Failed to fetch dependent info", result.message);
        }
      } catch (error) {
        console.error("Error fetching dependent info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDependentInfo();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!dependent) return <p>No dependent data found.</p>;

  return (
    <div className={styles.VerifiedEmployeeDependentInfoWrapper}>
      <div className={styles.VerifiedEmployeeDependentInfoGrid}>
        {/* Column 1 */}
        <div className={styles.VerifiedEmployeeDependentInfoColumn}>
          <div>
            <p>Father Name</p>
            <h4>{dependent.fatherName?.value || "N/A"}</h4>
          </div>
          <div>
            <p>Mother Name</p>
            <h4>{dependent.motherName?.value || "N/A"}</h4>
          </div>

          {/* Married Section */}
          {dependent.isMarried && (
            <>
              <div>
                <p>Are you Married?</p>
                <h4>Yes</h4>
              </div>
              <div>
                <p>Spouse Occupation</p>
                <h4>{dependent.spouseOccupation?.value || "N/A"}</h4>
              </div>
            </>
          )}

          {/* Kids Section */}
          {dependent.hasKids && (
            <div>
              <p>How old are your kids?</p>
              <h4>{dependent.kidsAges?.value || "N/A"}</h4>
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className={styles.VerifiedEmployeeDependentInfoColumn}>
          <div>
            <p>Father Occupation</p>
            <h4>{dependent.fatherOccupation?.value || "N/A"}</h4>
          </div>
          <div>
            <p>Mother Occupation</p>
            <h4>{dependent.motherOccupation?.value || "N/A"}</h4>
          </div>

          {dependent.isMarried && (
            <>
              <div>
                <p>Spouse Name</p>
                <h4>{dependent.spouseName?.value || "N/A"}</h4>
              </div>
            </>
          )}

          {dependent.hasKids && (
            <>
              <div>
                <p>Are you having kids?</p>
                <h4>Yes</h4>
              </div>
              <div>
                <p>What is your kid(s) doing?</p>
                <h4>{dependent.kidsActivities?.value || "N/A"}</h4>
              </div>
            </>
          )}
        </div>

        {/* Column 3 */}
        <div className={styles.VerifiedEmployeeDependentInfoColumn}>
          <div>
            <p>Father Contact Number</p>
            <h4>{dependent.fatherContactNumber?.value || "N/A"}</h4>
          </div>
          <div>
            <p>Mother Contact Number</p>
            <h4>{dependent.motherContactNumber?.value || "N/A"}</h4>
          </div>

          {dependent.isMarried && (
            <div>
              <p>Spouse Qualification</p>
              <h4>{dependent.spouseQualification?.value || "N/A"}</h4>
            </div>
          )}

          {dependent.hasKids && (
            <div>
              <p>How Many Kids?</p>
              <h4>{dependent.numberOfKids?.value || "0"}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedEmployeeDependentInfo;
