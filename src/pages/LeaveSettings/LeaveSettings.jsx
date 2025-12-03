import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import AddLeave from '../AddLeave/AddLeave';
import AssignedLeave from '../AssignedLeave/AssignedLeave';

function LeaveSettings() {
  const [activeTab, setActiveTab] = useState('Leave');

  const tabs = [
    { id: 'Leave', label: 'Leave' },
    { id: 'assignedLeave', label: 'Assigned Leave' }, 
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Leave':
        return <AddLeave />;
      case 'assignedLeave':
        return <AssignedLeave/>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="settings-page">
        <Card title="Leave Settings" icon="mdi:calendar-month-outline">
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

export default LeaveSettings;
