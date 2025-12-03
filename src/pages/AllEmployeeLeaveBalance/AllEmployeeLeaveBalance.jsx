import React, { useState, useEffect } from "react";
import styles from "./AllEmployeeLeaveBalance.module.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import {
  getDepartments,
  getEmployeeCategories,
} from "../../services/settingsService";
import { getCompaniesByName } from "../../services/companyService";
import { getAllEmployeeLeaveBalances } from "../../services/leaveServices";

function AllEmployeeLeaveBalance() {
  const [companies, setCompanies] = useState([]);
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year] = useState(new Date().getFullYear());

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res?.success) {
        setCompanies(res.data || []);
      }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      if (!filterCompanyId) {
        setDepartments([]);
        setCategories([]);
        return;
      }
      const depRes = await getDepartments(filterCompanyId);
      setDepartments(depRes?.success ? depRes.data : []);
      const catRes = await getEmployeeCategories(filterCompanyId);
      setCategories(catRes?.success ? catRes.data : []);
    };
    fetchFilters();
  }, [filterCompanyId]);

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      const res = await getAllEmployeeLeaveBalances(year);
      if (res.success) {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      }
      setLoading(false);
    };
    fetchBalances();
  }, [year]);

  useEffect(() => {
    let filtered = [...employees];
    if (filterCompanyId)
      filtered = filtered.filter(
        (emp) => emp.employee.companyId === filterCompanyId
      );
    if (selectedDepartment)
      filtered = filtered.filter(
        (emp) => emp.employee.department?._id === selectedDepartment
      );
    if (selectedCategory)
      filtered = filtered.filter(
        (emp) => emp.employee.employeeCategory?._id === selectedCategory
      );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [filterCompanyId, selectedDepartment, selectedCategory, employees]);

  const handleClear = () => {
    setFilterCompanyId("");
    setSelectedDepartment("");
    setSelectedCategory("");
    setDepartments([]);
    setCategories([]);
    setFilteredEmployees(employees);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  return (
    <div className={styles.allEmployeeLeaveBalanceContainer}>
      {/* Filter Section */}
      <div className={styles.allEmployeeLeaveBalanceFilterSection}>
        <div className={styles.allEmployeeLeaveBalanceFilterGroup}>
          <label htmlFor="companyFilter">Filter by Company</label>
          <select
            id="companyFilter"
            className={styles.dropdown}
            value={filterCompanyId}
            onChange={(e) => {
              setFilterCompanyId(e.target.value);
              setSelectedDepartment("");
              setSelectedCategory("");
            }}
          >
            <option value="">-- Select Company --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.allEmployeeLeaveBalanceFilterGroup}>
          <label>
            <Icon icon="mdi:account-badge" /> Employee Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={!filterCompanyId && departments.length === 0}
          >
            <option value="">-- All Departments --</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.allEmployeeLeaveBalanceFilterGroup}>
          <label>
            <Icon icon="mdi:account" /> Employee Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!filterCompanyId && categories.length === 0}
          >
            <option value="">-- All Categories --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.allEmployeeLeaveBalanceFilterButtons}>
          <Button label="Clear" onClick={handleClear} type="button" />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className={styles.allEmployeeLeaveBalanceLoading}>
          Loading leave balances...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className={styles.allEmployeeLeaveBalanceNoData}>
          No records found.
        </div>
      ) : (
        <>
          <div className={styles.allEmployeeLeaveBalanceGrid}>
            {currentRecords.map((item) => (
              <div
                key={item.employee._id}
                className={styles.newLeaveBalanceCard}
              >
                <div className={styles.newLeaveBalanceHeader}>
                  <div className={styles.avatarCircle}>
                    {item.employee.fullName?.[0]?.toUpperCase() || "E"}
                  </div>
                  <div>
                    <h3>{item.employee.fullName}</h3>
                    <p>ID: {item.employee.employeeId}</p>
                  </div>
                </div>
                <div className={styles.newLeaveBalanceBody}>
                  {item.leaveBalance?.balances?.length ? (
                    item.leaveBalance.balances.map((bal) => (
                      <div
                        key={bal._id}
                        className={styles.newLeaveBalanceItem}
                      >
                        <span>{bal.leaveTypeId?.name || "N/A"}</span>
                        <strong>{bal.currentBalance ?? 0}</strong>
                      </div>
                    ))
                  ) : (
                    <div className={styles.newLeaveBalanceEmpty}>
                      No leave balance data
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.allEmployeeLeaveBalancePagination}>
            <div>
              <label>Show:</label>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>entries per page</span>
            </div>
            <div className={styles.allEmployeeLeaveBalancePaginationControls}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AllEmployeeLeaveBalance;
