import React, { useEffect, useState } from "react";
import styles from "./EmployeeDataTablePage.module.css";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toggleEmployeeStatus, viewEmployeeData } from "../../services/addEmployeeService";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import { enqueueSnackbar } from "notistack";
import img from "../../assets/images/profile.jpg";


const EmployeeDataTablePage = () => {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);


  const fetchEmployees = async () => {
    const result = await viewEmployeeData();
    if (result.success) {
      setEmployees(result.data.reverse());
    } else {
      console.error(result.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleStatus = async (index) => {
    const employee = employees[index];
    const currentStatus = employee.accountStatus === true;
    const newStatus = !currentStatus;
    const result = await toggleEmployeeStatus(employee._id || employee._id, newStatus);
    
    if (result.success) {
      const updated = [...employees];
      updated[index].accountStatus = newStatus;
      setEmployees(updated);
      enqueueSnackbar(result.data.message || "Status updated successfully!", { variant: "success" });
    } else {
      console.error("Status update failed:", result.message);
      alert("Failed to update status.");
    }
  };


  const filteredEmployees = employees.filter((emp) =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Profile",
      render: (row) => (
        <img
          src={
            row.profileImage
              ? `${UPLOADS_PATH_BASE_URL}${row.profileImage?.value}`
              : img
          }
          alt="profile"
          className={styles.EmployeeDataTablePageProfileImage}
        />

      ),
    },

    {
      header: "Full Name",
      render: (row) => row.fullName?.trim() ||
        [row.personalInfo?.firstName, row.personalInfo?.middleName, row.personalInfo?.lastName]
          .filter(Boolean)
          .join(" ") || "-",
    },

    { header: "Employee ID", accessor: "employeeId" },
    {
      header: "Username",
      render: (row) => {
        const email = row?.userId?.email || "-";
        return (
          <span title={email}>
            {email}
          </span>
        );
      },
    },


   {
  header: "Profile Info",
  render: (row) => {
    // Convert status to string and replace underscores/hyphens with spaces
    let status = row.verificationStatus?.toString() || "";

    // Special case: handle "VerificationPending"
    if (status === "verificationPending") {
      status = "Verification Pending";
    } else {
      // For others: replace underscores/hyphens and capitalize
      status = status
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return (
      <span
        className={`${styles.EmployeeDataTablePageStatusDot} ${
          row.verificationStatus === "completed"
            ? styles.Completed
            : row.verificationStatus === "rejected"
            ? styles.Rejected
            : styles.Pending
        }`}
      >
        ● {status}
      </span>
    );
  },
},

    {
      header: "Action",
      render: (row) => (
        <div className={styles.EmployeeDataTablePageActionIcons}>
          <Icon
            icon="mdi:shield-check"
            className={styles.EmployeeDataTablePageIcon}
            onClick={() => navigate(`/pages/AppRejEmployeeData/${row._id}`)}
          />

          {row.verificationStatus === "completed" ? (
            <Icon
              icon="mdi:plus-circle-outline"
              className={styles.EmployeeDataTablePageIcon}
              onClick={() => navigate(`/EmployeeData/EmpJobAndSalarySection/${row._id}/${row.company}`)}
            />
          ) : (
            <Icon
              icon="mdi:pencil-outline"
              className={`${styles.EmployeeDataTablePageIcon} ${styles.disabledIcon}`}
              onClick={() => navigate(`/pages/EmployeeDataSection/${row._id}`)}
            />
          )}
        </div>
      ),
    },
    {
      header: "Status",
      render: (row, index) => (
        <div
          className={`${styles.EmployeeDataTablePageToggleWrapper} ${row.accountStatus ? styles.Active : styles.Inactive
            }`}
          onClick={() => toggleStatus(index)}
        >
          <div
            className={`${styles.EmployeeDataTablePageToggleIcon} ${row.accountStatus ? styles.ActiveIcon : styles.InactiveIcon
              }`}
          >
            <Icon
              icon={row.accountStatus ? "mdi:check-bold" : "mdi:close-circle-outline"}
            />
          </div>
          <span className={styles.EmployeeDataTablePageToggleText}>
            {row.accountStatus ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    }

  ];

  return (
    <DashboardLayout>
      <div className={styles.EmployeeDataTablePageContainer}>
        <div className={styles.EmployeeDataTablePageHeader}>
          <h3>Employee Data</h3>
          <div className={styles.EmployeeDataTablePageSearch}>
            <Icon icon="mdi:magnify" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.EmployeeDataTablePageTableWrapper}>
          <Table
            columns={columns}
            data={filteredEmployees}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDataTablePage;