import React, { useState, useEffect } from "react";
import styles from "./AllLeaves.module.css";
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmployeeTotalLeaveDetails from "../../components/EmployeeTotalLeaveDetails/EmployeeTotalLeaveDetails";
import { getDepartments, getEmployeeCategories } from "../../services/settingsService";
import { getMonthlyEmployees } from "../../services/leaveServices";
import { getUserRole, getUserId } from "../../utils/roleUtils";
import { getCompanyId } from "../../utils/roleUtils";



function AllLeaves() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [allLeaves, setAllLeaves] = useState([]);

  // Fetch departments, categories, and leaves dynamically

  useEffect(() => {
    const fetchFiltersAndLeaves = async () => {
      const companyId = getCompanyId(); 
      const depRes = await getDepartments(companyId);
      if (depRes.success) setDepartments(depRes.data || []);

      const catRes = await getEmployeeCategories(companyId);
      if (catRes.success) setCategories(catRes.data || []);

      // Role-based employee filter
      const role = getUserRole();
      const userId = getUserId();
      let employeeIdParam = null;
      if (role !== "admin") employeeIdParam = userId;
      // Call new API with selectedDate 
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; // months are 0-based
      const empRes = await getMonthlyEmployees(year, month, employeeIdParam);

      if (empRes.success) {
        const mappedData = empRes.data.map((emp) => ({
          id: emp.employeeDbId,
          name: emp.fullName || "-",
          empId: emp.employeeId || "-",
          category: emp.category || "-",
          department: emp.department || "-",
          designation: emp.designation || "-",
          raw: emp,
        }));
        setAllLeaves(mappedData);
      }
    };

    fetchFiltersAndLeaves();
  }, [selectedDate]);




  // Filter data by selected department and category
  const filteredData = allLeaves.filter((item) => {
    // Department filter
    const matchesDepartment =
      !selectedType || item.department === departments.find((dep) => dep._id === selectedType)?.name;
    // Category filter
    const matchesCategory =
      !selectedEmployee || item.category === categories.find((cat) => cat._id === selectedEmployee)?.name;

    return matchesDepartment && matchesCategory;
  });


  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Employee ID", accessor: "empId" },
    { header: "Employee Category", accessor: "category" },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    {
      header: "Action",
      render: (row) => (
        <Icon
          icon="mdi:eye"
          className={styles.allLeavesActionIcon}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={() =>
            setSelectedEmployeeDetails({
              employeeDbId: row.id,
              selectedDate: selectedDate,
              fullName: row.name,
            })
          }

        />
      ),
    },
  ];

  const handleClear = () => {
    setSelectedDate(new Date());
    setSelectedType("");
    setSelectedEmployee("");
  };

  return (
    <div className={styles.allLeavesContainer}>
      {selectedEmployeeDetails ? (
        <EmployeeTotalLeaveDetails
          employeeDetails={selectedEmployeeDetails}
          onBack={() => setSelectedEmployeeDetails(null)}
        />
      ) : (
        <>
          {/* Filter Section */}
          <div className={styles.allLeavesFilterSection}>
            <div className={styles.allLeavesFilterGroup}>
              <label>
                <Icon icon="mdi:calendar" /> Month / Year
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date || new Date())}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Select Month / Year"
                className={styles.allLeavesDatePickerInput}
              />
            </div>

            <div className={styles.allLeavesFilterGroup}>
              <label>
                <Icon icon="mdi:account-badge" /> Employee Department
              </label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">--All Departments--</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.allLeavesFilterGroup}>
              <label>
                <Icon icon="mdi:account" /> Employee Category
              </label>
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">--All Categories--</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.allLeavesFilterButtons}>
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
        </>
      )}
    </div>
  );
}

export default AllLeaves;
