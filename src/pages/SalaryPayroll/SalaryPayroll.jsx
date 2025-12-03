import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import CategoryPayrollAllocarion from '../CategoryPayrollAllocarion/CategoryPayrollAllocarion';
import EmployeePayrollAllocarion from '../EmployeePayrollAllocarion/EmployeePayrollAllocarion';


function SalaryPayroll() {
      const [activeTab, setActiveTab] = useState('CategoryPayrollAllocarion');

       const tabs = [
    { id: 'CategoryPayrollAllocarion', label: 'Category Payroll Allocation' },
    { id: 'EmployeePayrollAllocarion', label: 'Employee Payroll Allocation' },
  ];

      const renderTabContent = () => {
    switch (activeTab) {
      case 'CategoryPayrollAllocarion':
        return <CategoryPayrollAllocarion />;
      case 'EmployeePayrollAllocarion':
        return <EmployeePayrollAllocarion />;
      default:
        return null;
    }
  };
    
  return (
     <DashboardLayout>
      <div className="settings-page">
      <Card title="Payroll Allocation" icon="mdi:account-cash-outline">
          <SettingsTab
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="tab-content">{renderTabContent()}</div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default SalaryPayroll
