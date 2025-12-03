import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab'
import DashboardLayout from "../../layouts/DashboardLayout";
import Department from '../Department/Department';
import Designation from '../Designation/Designation';
import EmployeeId from '../EmployeeId/EmployeeId';
import EmployeeCategories from '../EmployeeCategories/EmployeeCategories';
import EmployeeGrade from '../EmployeeGrade/EmployeeGrade';
import EmployeeShift from '../EmployeeShift/EmployeeShift';
import EmployeePayroll from '../EmployeePayroll/EmployeePayroll';
import Card from '../../components/Card/Card';

function EmployeeSettings() {
  const [activeTab, setActiveTab] = useState('department');

  const tabs = [
    { id: 'department', label: 'Department' },
    { id: 'designation', label: 'Designation' },
    { id: 'categories', label: 'Employee Categories' },
    // { id: 'grade', label: 'Employee Grade' },
    { id: 'shift', label: 'Employee Shift' },
    { id: 'payroll', label: 'Employee Payroll' },
    { id: 'employeeid', label: 'Employee ID Pattern' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'department':
        return <Department />;
      case 'designation':
        return <Designation />;
      case 'categories':
        return <EmployeeCategories />;
      case 'grade': 
        return <EmployeeGrade />;
      case 'shift':
        return <EmployeeShift />;
      case 'payroll':
        return <EmployeePayroll />;
      case 'employeeid':
        return <EmployeeId />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="settings-page">
        <Card title="Employee Settings" icon="mdi:cog-outline">
          <SettingsTab
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="tab-content">{renderTabContent()}</div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeSettings;
