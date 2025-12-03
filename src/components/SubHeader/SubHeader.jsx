import React from "react";
import styles from "./SubHeader.module.css";
import HelpContainer from "../HepContainer/HelpContainer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SubHeader = ({ route, isCollapsed  }) => {
   const navigate = useNavigate();
  const renderContent = () => {

    switch (route) {
      case "dashboard":
        return (
          <div className={`${styles.subHeader} ${isCollapsed ? styles.collapsedSubHeader : ""}`}>
            <div className="d-flex justify-content-between subHdr">
              <div>
              </div>
            </div>
          </div>
        );
      case "admin":
             

  const handleDropdownChange = (e) => {
    const selected = e.target.value;

    switch (selected) {
      case "/pages/AttendanceExcelUpload":
        navigate(selected);
        break;
      case "/pages/AllEmployeeAttendanceReport":
        navigate(selected);
        break;
     
      default:
        break;
    }
  };        return (
         <div className={`${styles.subHeader} ${isCollapsed ? styles.collapsedSubHeader : ""}`}>
           <div className="d-flex justify-content-between">
              <div>
                <select className={styles.subHeaderDropdown}>
                  <option>User Management</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>HR</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>Organization</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>Qualifications</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>Nationalities</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>co-operate Branding</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications</option>
                </select>
                <select className={styles.subHeaderDropdown}>
                  <option>Configuration</option>
                  <option>Job</option>
                  <option>Organization</option>
                  <option>Qualifications sds dsd </option>
                </select>

               <select className={styles.subHeaderDropdown} onChange={handleDropdownChange}>
            <option value="">Attendance</option>
            <option value="/pages/AttendanceExcelUpload">Formatt Attendance Excel</option>
            <option value="/pages/AllEmployeeAttendanceReport">All Employee AttendanceReport</option>
          </select>
              </div>
            </div>
          </div>
        );
      case "pim":
        case "searchedEmployeeDetails":
        return (
         <div className={`${styles.subHeader} ${isCollapsed ? styles.collapsedSubHeader : ""}`}>
            <Link className={styles.subHeaderDropdown} >Add Employee</Link>
          </div>
        );

      default:
        return (
         <div className={`${styles.subHeader} ${isCollapsed ? styles.collapsedSubHeader : ""}`}>
            {/* <h3>{route.charAt(0).toUpperCase() + route.slice(1)}</h3> */}
          </div>
        );
    }
  };

  return renderContent();
};

export default SubHeader;
