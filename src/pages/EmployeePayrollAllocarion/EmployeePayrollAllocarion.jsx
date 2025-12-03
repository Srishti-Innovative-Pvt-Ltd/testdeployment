import React, { useState, useEffect } from "react";
import styles from "./EmployeePayrollAllocarion.module.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import { getCompaniesByName } from "../../services/companyService";
import {
  getDepartments,
  getEmployeeCategories,
} from "../../services/settingsService";
import { getEmployeePayrollAllocations, saveEmployeePayrollAllocations } from "../../services/salaryService";
import { useSnackbar } from "notistack";
import EmployeePayrollAllocationModal from "../../components/EmployeePayrollAllocationModal/EmployeePayrollAllocationModal";

function EmployeePayrollAllocarion() {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      const compRes = await getCompaniesByName();
      if (compRes.success) {
        setCompanies(compRes.data || []);
      } else {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch departments & categories based on selected company
  useEffect(() => {
    const fetchFilters = async () => {
      if (!selectedCompany) {
        // Fetch all departments & categories (no company filter)
        const depRes = await getDepartments();
        setDepartments(depRes.success ? depRes.data || [] : []);

        const catRes = await getEmployeeCategories();
        setCategories(catRes.success ? catRes.data || [] : []);
        return;
      }

      // Fetch specific departments & categories for selected company
      const depRes = await getDepartments(selectedCompany);
      setDepartments(depRes.success ? depRes.data || [] : []);

      const catRes = await getEmployeeCategories(selectedCompany);
      setCategories(catRes.success ? catRes.data || [] : []);
    };

    fetchFilters();
  }, [selectedCompany]);

  // Fetch Employee Payroll Allocations
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const res = await getEmployeePayrollAllocations();
      if (res.success) {
        const formattedData = res.data.map((emp) => ({
          id: emp.employeeId,
          empId: emp.employee?.employeeId || "",
          name: emp.employee?.fullName || "N/A",
          companyId: emp.company?._id || "",
          company: emp.company?.name || "N/A",
          departmentId: emp.department?._id || "",
          department: emp.department?.name || "N/A",
          categoryId: emp.category?._id || "",
          category: emp.category?.name || "N/A",
          allocated: emp.allocated || [],
          available: emp.available || [],
          allocationSource: emp.allocationSource || "N/A",
          hasEmployeeAllocation: emp.hasEmployeeAllocation,
          hasCategoryAllocation: emp.hasCategoryAllocation,
        }));

        setEmployeeData(formattedData);
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    };

    fetchEmployeeData();
  }, []);



  const filteredData = employeeData.filter((emp) => {
    const matchesCompany =
      !selectedCompany || emp.companyId === selectedCompany || emp.company === selectedCompany;
    const matchesDepartment =
      !selectedDepartment || emp.departmentId === selectedDepartment;
    const matchesCategory =
      !selectedCategory || emp.categoryId === selectedCategory || emp.category === selectedCategory;

    return matchesCompany && matchesDepartment && matchesCategory;
  });

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    setSelectedDepartment("");
    setSelectedCategory("");
  };

  const handleClear = () => {
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedCategory("");
    setDepartments([]);
    setCategories([]);
  };

  const columns = [
    { header: "Employee ID", accessor: "empId" },
    { header: "Employee Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Action",
      render: (row) => (
        <Icon
          icon="mdi:pencil-outline"
          className={styles.employeeListEditIcon}
          title="Edit"
          onClick={() => handleEditClick(row)}
        />
      ),
    },
  ];

  const handleEditClick = (row) => {
    setEditingData(row);
    setShowModal(true);
  };

  const handleAllocationSubmit = async (employeeId, selectedIds) => {
    const res = await saveEmployeePayrollAllocations(employeeId, selectedIds);
    if (res.success) {
      enqueueSnackbar("Payroll Allocation saved successfully!", { variant: "success" });
      setShowModal(false);

      // Re-fetch employee data to update table
      const refreshed = await getEmployeePayrollAllocations();
      if (refreshed.success) {
        const formatted = refreshed.data.map((emp) => ({
          id: emp.employeeId,
          empId: emp.employee?.employeeId || "",
          name: emp.employee?.fullName || "N/A",
          companyId: emp.company?._id || "",
          company: emp.company?.name || "N/A",
          departmentId: emp.department?._id || "",
          categoryId: emp.category?._id || "",
          category: emp.category?.name || "N/A",
          allocated: emp.allocated || [],
          available: emp.available || [],
          allocationSource: emp.allocationSource || "N/A",
          hasEmployeeAllocation: emp.hasEmployeeAllocation,
          hasCategoryAllocation: emp.hasCategoryAllocation,
        }));
        setEmployeeData(formatted);
      }
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };


  return (
    <div className={styles.employeeListContainer}>
      {/* Filter Section */}
      <div className={styles.employeeListFilterSection}>
        {/* Company Filter */}
        <div className={styles.employeeListFilterGroup}>
          <label>
            <Icon icon="mdi:office-building" /> Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => handleCompanyChange(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {companies.length > 0 ? (
              companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName}
                </option>
              ))
            ) : (
              <option disabled>No companies available</option>
            )}
          </select>
        </div>

        {/* Department Filter */}
        <div className={styles.employeeListFilterGroup}>
          <label>
            <Icon icon="mdi:account-badge" /> Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">-- All Departments --</option>
            {departments.length > 0 ? (
              departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))
            ) : (
              <option disabled>No departments available</option>
            )}
          </select>
        </div>

        {/* Category Filter */}
        <div className={styles.employeeListFilterGroup}>
          <label>
            <Icon icon="mdi:account" /> Employee Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- All Categories --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Clear Button */}
        <div className={styles.employeeListFilterButtons}>
          <Button label="Clear" onClick={handleClear} type="button" />
        </div>
      </div>

      {/* Employee Table */}
      <Table
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Payroll Allocation Modal */}
      {showModal && (
        <EmployeePayrollAllocationModal
          isEdit={!!editingData}
          initialData={editingData || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleAllocationSubmit}
        />

      )}
    </div>
  );
}

export default EmployeePayrollAllocarion;
