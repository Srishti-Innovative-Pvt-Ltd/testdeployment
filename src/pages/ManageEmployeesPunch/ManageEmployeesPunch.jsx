import React, { useState } from "react";
import styles from "./ManageEmployeesPunch.module.css";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import Card from '../../components/Card/Card';

import { Icon } from "@iconify/react";
import PunchEditModal from '../../components/PunchEditModal/PunchEditModal'
import DashboardLayout from '../../layouts/DashboardLayout';


function ManageEmployeesPunch() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employees, setEmployees] = useState([
    { name: "Megha Suresh", empId: "EMP784", head: "201", north: "305", south: "409", isActive: true },
    { name: "Nihal M K", empId: "EMP102", head: "", north: "", south: "", isActive: false },
    { name: "Anjali Varma", empId: "EMP998", head: "101", north: "202", south: "", isActive: true },
    { name: "Rakesh Menon", empId: "EMP404", head: "", north: "222", south: "333", isActive: false },
  ]);

  const toggleStatus = (index) => {
    const updated = [...employees];
    updated[index].isActive = !updated[index].isActive;
    setEmployees(updated);
  };

  const columns = [
    { header: "NAME", accessor: "name" },
    { header: "EMPLOYEE ID", accessor: "empId" },
    { header: "HEAD OFFICE", accessor: "head" },
    { header: "NORTH BLOCK", accessor: "north" },
    { header: "SOUTH BLOCK", accessor: "south" },
    {
      header: "STATUS",
      render: (row, index) => (
        <div
          className={`${styles.EmployeeDataTablePageToggleWrapper} ${
            row.isActive ? styles.Active : styles.Inactive
          }`}
          onClick={() => toggleStatus(index)}
        >
          <div
            className={`${styles.EmployeeDataTablePageToggleIcon} ${
              row.isActive ? styles.ActiveIcon : styles.InactiveIcon
            }`}
          >
            <Icon
              icon={
                row.isActive
                  ? "mdi:check-bold"
                  : "mdi:close-circle-outline"
              }
            />
          </div>
          <span className={styles.EmployeeDataTablePageToggleText}>
            {row.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    ({ row }) => (
      <Icon
        icon="mdi:pencil-outline"
        className={styles.editIcon}
        onClick={() => setSelectedEmployee(row)}
      />
    ),
  ];

  return (
    <DashboardLayout>
    <div className={styles.EmployeeDataTablePageContainer}>
      <Card title="Manage Employees Punch" icon="mdi:clock-edit-outline">
<div className={styles.filterSection}>
  <div className={styles.filterGroup}>
    <label htmlFor="type">Employee Type</label>
    <select id="type" className={styles.dropdown}>
      <option value="">Select Employee Type</option>
      <option value="sales">Sales</option>
      <option value="hr">HR</option>
      <option value="it">IT</option>
      <option value="operations">Operations</option>
      <option value="marketing">Marketing</option>
      <option value="admin">Admin</option>
    </select>
  </div>

  <div className={styles.filterButtons}>
    <Button label="Filter" />
    <Button label="Clear" secondary />
  </div>
</div>
      <div className={styles.EmployeeDataTablePageTableWrapper}>
        <Table
          columns={columns}
          data={employees}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actions={actions}
        />
      </div>
       {selectedEmployee && (
  <PunchEditModal
    employeeData={selectedEmployee}
    onClose={() => setSelectedEmployee(null)}
    onSave={(updatedData) => {
      const updatedList = employees.map((emp) =>
        emp.empId === updatedData.empId ? { ...emp, ...updatedData } : emp
      );
      setEmployees(updatedList);
    }}
  />
)}
</Card>
    </div>
    </DashboardLayout>
   

  );
  
}

export default ManageEmployeesPunch;
