import React, { useState } from "react";
import styles from "./EmployeePunchlogs.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import { Icon } from "@iconify/react";
import DashboardLayout from '../../layouts/DashboardLayout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function EmployeePunchlogs() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const data = [];

    const columns = [
  { header: "Personnel No", accessor: "personnelNo" },
  { header: "First Name", accessor: "firstName" },
  { header: "Last Name", accessor: "lastName" },
  { header: "Department No.", accessor: "departmentNo" },
  { header: "Department", accessor: "department" },
  { header: "Date", accessor: "date" },
  { header: "Punch In", accessor: "punchIn" },
  { header: "Punch Out", accessor: "punchOut" },
  { header: "Total Work Hours", accessor: "workHours" },
  { header: "Total Break Hours", accessor: "breakHours" },
];


   const handleFilter = () => {
  const selectedYear = selectedDate ? selectedDate.getFullYear() : "";
  const selectedMonth = selectedDate ? String(selectedDate.getMonth() + 1).padStart(2, '0') : "";

  console.log("Filtering with:", {
    selectedYear,
    selectedMonth,
    selectedLocation,
    selectedType,
    selectedEmployee,
  });

};

    const handleClear = () => {
        setSelectedDate(null);
        setSelectedLocation("");
        setSelectedType("");
        setSelectedEmployee("");
    };

    return (
        <DashboardLayout>
            <Card title="Employee Punchlogs" icon="mdi:clock-outline">
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
                        <label>Location</label>
                        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                            <option value="">Select Location</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Bangalore">Bangalore</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Employee Type</label>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select Employee Type</option>
                            <option value="Trainers">Trainers</option>
                            <option value="Sales">Staff</option>
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

export default EmployeePunchlogs;
