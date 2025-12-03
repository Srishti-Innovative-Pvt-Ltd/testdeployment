import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import LeaveRequests from '../../pages/LeaveRequests/LeaveRequests'
import AllLeaves from '../../pages/AllLeaves/AllLeaves'
import AllEmployeeLeaveBalance from '../AllEmployeeLeaveBalance/AllEmployeeLeaveBalance';

function AdminLeaveSection() {
  const [activeTab, setActiveTab] = useState('leaveRequest');

  const tabs = [
    { id: 'leaveRequest', label: 'Leave Request' },
    { id: 'allLeave', label: 'All Leave' },
    { id: 'leaveBalance', label: 'Leave Balance' },


  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leaveRequest':
        return <LeaveRequests />;
      case 'allLeave':
        return <AllLeaves/>;
         case 'leaveBalance':
        return <AllEmployeeLeaveBalance/>;
      default:
        return null;
    }
  };

  return (
  <DashboardLayout>
      <div className="settings-page">
        <Card title="Leave Requests" icon="mdi:cog-outline">
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

export default AdminLeaveSection;
