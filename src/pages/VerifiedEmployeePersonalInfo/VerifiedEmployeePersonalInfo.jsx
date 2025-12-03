import React, { useState, useEffect } from "react";
import styles from './VerifiedEmployeePersonalInfo.module.css';
import profileImage from '../../assets/images/profile.jpg';
import { getEmployeePersonalAndProfessionalInfo } from "../../services/addEmployeeService"
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import { useParams } from "react-router-dom";

const VerifiedEmployeePersonalInfo = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await getEmployeePersonalAndProfessionalInfo(id);
      if (result.success) {
        setEmployee(result.data);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    };

    if (id) fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>No data found.</p>;

  const personal = employee.personalInfo || {};
  const contact = employee.contactInfo || {};
  const professional = employee.professionalInfo || {};
  const fullName = `${personal.firstName?.value || ""} ${personal.middleName?.value || ""
    } ${personal.lastName?.value || ""}`.trim();


  return (
    <div className={styles.VerifiedEmployeePersonalInfoWrapper}>
      <div className={styles.VerifiedEmployeePersonalInfoImageSection}>
        <img
          src={employee.profileImage?.value ? `${UPLOADS_PATH_BASE_URL}${employee.profileImage.value}` : profileImage}
          alt="Profile"
          className={styles.VerifiedEmployeePersonalInfoImage}
        />

        <h3 className={styles.VerifiedEmployeePersonalInfoName}>{fullName}</h3>
      </div>

      <div className={styles.VerifiedEmployeePersonalInfoGrid}>
        {/* Column 1 */}
        <div>
          <p>Employee ID</p>
          <h4>{employee.employeeId}</h4>

          <p>Gender</p>
          <h4>{personal.gender?.value}</h4>

          <p>Address (Permanent)</p>
          <h4>{contact.permanentAddress?.value}</h4>

          <p>City</p>
          <h4>{contact.city?.value}</h4>

          <p>Email ID (Personal)</p>
          <h4>
            <a href={`mailto:${contact.personalEmail?.value}`}>
              {contact.personalEmail?.value}
            </a>
          </h4>

          <p>Contact No (Emergency)</p>
          <h4>{contact.emergencyContactNo?.value}</h4>

          <p>Technical Expertise</p>
          <h4>
            {professional.technicalExpertise?.length > 0
              ? professional.technicalExpertise.map((t) => t.value).join(", ")
              : "N/A"}
          </h4>
        </div>

        {/* Column 2 */}
        <div>
          <p>Full Name</p>
          <h4>{fullName}</h4>

          <p>Age</p>
          <h4>
            {personal.dateOfBirth?.value
              ? new Date().getFullYear() -
              new Date(personal.dateOfBirth.value).getFullYear()
              : "N/A"}{" "}
            yrs
          </h4>

          <p>Nationality</p>
          <h4>{personal.nationality?.value}</h4>

          <p>Place</p>
          <h4>{contact.place?.value}</h4>

          <p>Contact No (Primary)</p>
          <h4>{contact.primaryContactNo?.value}</h4>

          <p>Qualification</p>
          <h4>
            {professional.qualifications?.length > 0
              ? professional.qualifications.map((q) => q.value).join(", ")
              : "N/A"}
          </h4>
          <p>Date of Joining with Srishti</p>
          <h4>{professional.dateOfJoining?.value}</h4>        </div>

        {/* Column 3 */}
        <div>
          <p>Date of Birth</p>
          <h4>{personal.dateOfBirth?.value}</h4>

          <p>Address (Primary)</p>
          <h4>{contact.primaryAddress?.value}</h4>

          <p>State</p>
          <h4>{contact.state?.value}</h4>

          <p>Email ID (Official)</p>
          <h4>
            <a href={`mailto:${professional.officialEmail?.value}`}>
              {professional.officialEmail?.value}
            </a>
          </h4>

          <p>Contact No (Secondary)</p>
          <h4>{contact.secondaryContactNo?.value}</h4>

          <p>Years of Experience</p>
          <h4>{professional.previousExperience?.value || "N/A"}</h4>
        </div>
      </div>
    </div>
  );
};

export default VerifiedEmployeePersonalInfo;