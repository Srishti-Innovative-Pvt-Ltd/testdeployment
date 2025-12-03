import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./ViewEmployees.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import { getVerifiedEmployees } from "../../services/addEmployeeService";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";

const ViewEmployees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [allEmployees, setAllEmployees] = useState([]);
  const [oldEmployees, setOldEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search term

  const navigate = useNavigate();

  const viewDetails = (id) => {
    navigate(`/pages/VerifiedEmployeeView/${id}`);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const result = await getVerifiedEmployees();
      if (result.success) {
        setAllEmployees(result.data.reverse());
        setOldEmployees([]); // keep oldEmployees empty as in original
      } else {
        console.error(result.message);
      }
    };
    fetchEmployees();
  }, []);

  //  Filter employees by search
  const filterBySearch = (employees) =>
    employees.filter((emp) => {
      const name = emp.fullName || "";
      const email = emp.professionalInfo?.officialEmail?.value || "";
      const phone = emp.contactInfo?.primaryContactNo?.value || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const columns = [
    {
      header: "Profile",
      render: (row) => (
        <img
          src={`${UPLOADS_PATH_BASE_URL}${row.profileImage?.value}`}
          alt="profile"
          className={styles.ViewEmployeesProfileImage}
        />
      ),
    },
    {
      header: "Name",
      render: (row) => row.fullName || "",
    },
    {
      header: "Phone Number",
      render: (row) => row.contactInfo?.primaryContactNo?.value || "",
    },
    {
      header: "Email ID",
      render: (row) => {
        const email = row.professionalInfo?.officialEmail?.value || "";
        return <span title={email}>{email}</span>;
      },
    },
    {
      header: "Joining Date",
      render: (row) => row.professionalInfo?.dateOfJoining?.value || "",
    },
    {
      header: "Action",
      render: (row) => (
        <Icon
          icon="mdi:eye-outline"
          className={styles.ViewEmployeesIcon}
          onClick={() => viewDetails(row.id)}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.ViewEmployeesContainer}>
        {/* Tabs */}
        <div className={styles.ViewEmployeesTabs}>
          <span
            className={`${styles.ViewEmployeesTab} ${
              activeTab === "all" ? styles.ActiveTab : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Employees
          </span>
          <span
            className={`${styles.ViewEmployeesTab} ${
              activeTab === "old" ? styles.ActiveTab : ""
            }`}
            onClick={() => setActiveTab("old")}
          >
            Old Employees
          </span>
        </div>

        {/* Heading + Search */}
        <div className={styles.ViewEmployeesTopRow}>
          <h3 className={styles.ViewEmployeesSubheading}>
            {activeTab === "all" ? "All Employees" : "Old Employees"}
          </h3>
          <div className={styles.ViewEmployeesSearch}>
            <Icon icon="mdi:magnify" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} //  search input
            />
          </div>
        </div>

        {/* Table */}
        <div className={styles.ViewEmployeesTableWrapper}>
          <Table
            columns={columns}
            data={
              activeTab === "all"
                ? filterBySearch(allEmployees)
                : filterBySearch(oldEmployees)
            } // filtered data
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewEmployees;
