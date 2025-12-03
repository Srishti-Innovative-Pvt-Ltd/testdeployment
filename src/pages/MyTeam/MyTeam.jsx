import React, { useState, useEffect } from "react";
import styles from "./MyTeam.module.css";
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import {
  getDepartments,
  getEmployeeCategories,
  getDesignations,
} from "../../services/settingsService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCompanyId, getUserId } from "../../utils/roleUtils";
import Card from "../../components/Card/Card";
import { getReportingEmployees } from "../../services/leaveServices";

function MyTeam() {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  // Options from backend
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Table state
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const companyId = getCompanyId();

        const depRes = await getDepartments(companyId);
        if (depRes.success) setDepartments(depRes.data || []);

        const catRes = await getEmployeeCategories(companyId);
        if (catRes.success) setCategories(catRes.data || []);

        const desigRes = await getDesignations(companyId);
        if (desigRes.success) setDesignations(desigRes.data || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilters();
  }, []);

  // Fetch my team (reporting employees)
  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const userId = getUserId();
        const res = await getReportingEmployees(userId);

        if (res.success) {
          const mappedData = res.data.map((emp) => ({
            id: emp._id,
            name: emp.fullName || "N/A",
            officialEmail: emp.officialEmail || "N/A",
            empId: emp.employeeId || "N/A",
            categoryId: emp.employeeCategoryId || "",
            category: emp.employeeCategory || "N/A",
            departmentId: emp.departmentId || "",
            department: emp.department || "N/A",
            designationId: emp.designationId || "",
            designation: emp.designation || "N/A",
          }));


          setAllEmployees(mappedData);
        } else {
          console.error("Failed to fetch team:", res.message);
        }
      } catch (err) {
        console.error("Error fetching my team:", err);
      }
    };

    fetchMyTeam();
  }, []);

  const filteredData = allEmployees.filter((emp) => {
    const matchesCategory = !selectedCategory || emp.categoryId === selectedCategory;
    const matchesDepartment = !selectedDepartment || emp.departmentId === selectedDepartment;
    const matchesDesignation = !selectedDesignation || emp.designationId === selectedDesignation;
    return matchesCategory && matchesDepartment && matchesDesignation;
  });
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Official Email", accessor: "officialEmail" }, // fixed typo
    { header: "Employee ID", accessor: "empId" },
    { header: "Employee Category", accessor: "category" },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
  ];

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedDepartment("");
    setSelectedDesignation("");
  };

  return (
    <DashboardLayout>
      <Card title="My Team" icon="mdi:account-group">
        {/* Filter Section */}
        <div className={styles.myTeamFilterSection}>
          {/* Category */}
          <div className={styles.myTeamFilterGroup}>
            <label>
              <Icon icon="mdi:account-group" /> Employee Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">--Categories--</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className={styles.myTeamFilterGroup}>
            <label>
              <Icon icon="mdi:account-badge" /> Employee Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">--Departments--</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div className={styles.myTeamFilterGroup}>
            <label>
              <Icon icon="mdi:account" /> Designation
            </label>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
            >
              <option value="">--Designations--</option>
              {designations.map((desig) => (
                <option key={desig._id} value={desig._id}>
                  {desig.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          <div className={styles.myTeamFilterButtons}>
            <Button label="Clear" onClick={handleClear} type="button" />
          </div>
        </div>

        {/* Table Section */}
        <Table
          columns={columns}
          data={filteredData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </DashboardLayout>
  );
}

export default MyTeam;
