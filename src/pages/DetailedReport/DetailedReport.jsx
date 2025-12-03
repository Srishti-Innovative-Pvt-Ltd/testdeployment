import React from 'react';
import Card from '../../components/Card/Card';
import WorkingHoursDisplay from '../../components/WorkingHoursDisplay/WorkingHoursDisplay';
import DashboardLayout from '../../layouts/DashboardLayout';
import SingleEmployeeView from '../../components/SingleEmployeeView/SingleEmployeeView';
import Button from '../../components/Button/Button'; 
import { useNavigate } from 'react-router-dom'; 

function DetailedReport() {
  const navigate = useNavigate(); 

  const employee = {
    personnelNo: "EMP001",
    firstName: "John",
    lastName: "Doe",
    departmentNo: "D01",
    department: "IT"
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '1rem 2rem' }}>
        <Button
          label="← Back"
          onClick={() => navigate(-1)}
          type="button"
          className="mb-3"
        />

        <Card title="Detailed Monthly Report" icon="tabler:report-analytics">
          <WorkingHoursDisplay />
          <SingleEmployeeView employee={employee} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DetailedReport;
