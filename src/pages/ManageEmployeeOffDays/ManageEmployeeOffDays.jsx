import React, { useState } from "react";
import styles from './ManageEmployeeOffDays.module.css';
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import DashboardLayout from '../../layouts/DashboardLayout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ManageEmployeeOffDays() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const data = []; // Replace with fetched data

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Off Day Type", accessor: "offDayType" },
    { header: "Duration", accessor: "duration" },
    { header: "From Time", accessor: "fromTime" },
    { header: "To Time", accessor: "toTime" },
    { header: "Comments", accessor: "comments" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const handleFilter = () => {
    const selectedYear = selectedDate ? selectedDate.getFullYear() : "";
    const selectedMonth = selectedDate ? String(selectedDate.getMonth() + 1).padStart(2, '0') : "";

    console.log("Filtering with:", {
      selectedYear,
      selectedMonth,
      selectedType,
      selectedEmployee,
    });
  };

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedType("");
    setSelectedEmployee("");
  };

  return (
    <DashboardLayout>
      <Card title="Manage Employee OffDays" icon="mdi:calendar-remove-outline">
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Month / Year</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Select Month / Year"
              className={styles.datePickerInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Employee Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Select Employee Type</option>
              <option value="Trainer">Trainer</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Employee Name</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              <option value="John">John</option>
              <option value="Jane">Jane</option>
            </select>
          </div>

          <div className={styles.filterButtons}>
            <Button label="Filter" onClick={handleFilter} type="button" />
            <Button label="Clear" onClick={handleClear} type="button" secondary />
          </div>
        </div>

        <Table
          columns={columns}
          data={data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </DashboardLayout>
  );
}

export default ManageEmployeeOffDays;
