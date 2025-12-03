import React, { useEffect, useState } from "react";
import styles from "./VerifiedEmployeeJobAndScheduleInfo.module.css";
import { useParams } from "react-router-dom";
import { getEmployeeJoBAndSchedule } from "../../services/addEmployeeService";

const VerifiedEmployeeJobAndScheduleInfo = () => {
  const { id } = useParams(); 
  const [jobInfo, setJobInfo] = useState(null);

  useEffect(() => {
    const fetchJobInfo = async () => {
      const result = await getEmployeeJoBAndSchedule(id);
      if (result.success) {
        setJobInfo(result.data);
      } else {
        console.error(result.message);
      }
    };

    if (id) fetchJobInfo();
  }, [id]);

  if (!jobInfo) {
    return <p>Loading job & schedule info...</p>;
  }

  return (
    <div className={styles.VerifiedEmployeeJobAndScheduleInfoWrapper}>
      <div className={styles.VerifiedEmployeeJobAndScheduleInfoGrid}>
        <div>
          <p>Designation</p>
          <h4>{jobInfo.employeeDesignation?.name || "-"}</h4>
        </div>

        <div>
          <p>Department</p>
          <h4>{jobInfo.employeeDepartment?.name || "-"}</h4>
        </div>

        <div>
          <p>Employee Category</p>
          <h4>{jobInfo.employeeCategory?.name || "-"}</h4>
        </div>

        <div>
          <p>Reporting Person</p>
          <h4>{jobInfo.reportingPerson?.fullName || jobInfo.reportingPerson?.employeeId || "-"}</h4>
        </div>

        <div>
          <p>Shift</p>
          <h4>
            {jobInfo.employeeShift?.shiftName
              ? `${jobInfo.employeeShift.shiftName} (${jobInfo.employeeShift.startTime} - ${jobInfo.employeeShift.endTime})`
              : "-"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default VerifiedEmployeeJobAndScheduleInfo;
