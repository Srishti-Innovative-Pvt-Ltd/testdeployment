import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Performance.module.css";
import DashboardLayout from '../../layouts/DashboardLayout';
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";


// Dummy data
const employeeData = [
  { name: "Priya", empId: "EMP001", department: "Human Resources", designation: "Product Manager", performance: "50%" },
  { name: "Rahul", empId: "AMP881", department: "Sales & Marketing", designation: "Project Manager", performance: "25%" },
  { name: "Pravin", empId: "QRS965", department: "UI/UX Design", designation: "Senior Designer", performance: "30%" },
  { name: "John", empId: "UTS674", department: "Sales $ Marketing", designation: "Sales Assistant", performance: "85%" },
];


function Performance() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleFilter = () => {
    console.log("Filtering with:", selectedDate, selectedType);
  };

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedType("");
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Employee ID", accessor: "empId" },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    { header: "Performance", accessor: "performance" },
  ];

  function ActionView({ row }) {
  return (
    <Icon icon="mdi:eye-outline"
     style={{ fontSize: "1.7rem", color: "#007bff", cursor: "pointer" }} 
    onClick={() => navigate("/Performance/PerformanceAction")}/>
  );
}


  return (
    <DashboardLayout>
    <div>
      <Card title="Employee Performance" icon="mdi:chart-line">
        <div className={styles.performanceFilterSection}>
          <div className={styles.performanceFilterGroup}>
            <label>Month / Year</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Select Month / Year"
              className={styles.performanceDatePickerInput}
            />
          </div>

          <div className={styles.performanceFilterGroup}>
            <label>Department</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Select Department</option>
              <option value="HR">Human Resources</option>
              <option value="Sales">Sales & Marketing</option>
              <option value="Design">UI/UX Design</option>
            </select>
          </div>

          <div className={styles.performanceFilterButtons}>
            <Button label="Filter" onClick={handleFilter} type="button" />
            <Button label="Clear" onClick={handleClear} type="button" secondary />
          </div>
        </div>

        <Table
          columns={columns}
          data={employeeData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actions={[ActionView]}
        />
      </Card>
    </div>
    </DashboardLayout>
  );
}

export default Performance;
