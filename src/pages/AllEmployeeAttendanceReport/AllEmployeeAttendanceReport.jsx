import React, { useState } from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import AllEmployeeAttendanceReportTable from '../../components/AllEmployeeAttendanceReportTable/AllEmployeeAttendanceReportTable';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import styles from '../ManageEmployeeOffDays/ManageEmployeeOffDays.module.css'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function AllEmployeeAttendanceReport() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handleFilter = () => {
    const selectedYear = selectedDate ? selectedDate.getFullYear() : '';
    const selectedMonth = selectedDate ? String(selectedDate.getMonth() + 1).padStart(2, '0') : '';

    console.log({
      selectedYear,
      selectedMonth,
      selectedType
    });
  };

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedType('');
  };

  const dummyData = [
    {
      "Personnel No": "EMP001",
      "First Name": "John",
      "Last Name": "Doe",
      "Reporting Person": "David Manager",
      "Department": "Engineering",
      "Date": "2024-07-01",
      "First Checkin": "09:00",
      "Last Checkout": "17:00",
      "Total Work Hours without Break": "8:00",
      "Total Break Hours": "1:00",
    },
    {
      "Personnel No": "EMP002",
      "First Name": "Jane",
      "Last Name": "Smith",
      "Reporting Person": "Linda HR",
      "Department": "HR",
      "Date": "2024-07-01",
      "First Checkin": "09:30",
      "Last Checkout": "18:00",
      "Total Work Hours without Break": "7:30",
      "Total Break Hours": "0:30",
    },
  ];

  const data = dummyData.map((item) => ({
    personnelNo: item["Personnel No"],
    employeeName: `${item["First Name"]} ${item["Last Name"]}`,
    reportingPerson: item["Reporting Person"],
    employeeType: item["Department"],
    totalWorkingDays: 22,
    noPunchDays: 2,
    missingHours: "01:30",
    lopLateComing: 0.5,
    lopLeave: 1,
  }));

  const DetailButton = ({ row }) => (
    <Button
      label="View"
      onClick={() => navigate('/pages/DetailedReport')}
      type="button"
    />
  );

  return (
    <DashboardLayout>
      
      <div style={{ padding: '1rem 2rem' }}>
                <Card title="All Employee Monthly Report" icon="fluent:people-community-24-regular">

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
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className={styles.filterButtons}>
            <Button label="Filter" onClick={handleFilter} type="button" />
            <Button label="Clear" onClick={handleClear} type="button" secondary />
          </div>
        </div>

          <AllEmployeeAttendanceReportTable
            data={data}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            actions={[DetailButton]}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AllEmployeeAttendanceReport;
