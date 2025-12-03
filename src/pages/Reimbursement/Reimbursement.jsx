import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import ReimbursementHistory from '../ReimbursementHistory/ReimbursementHistory';
import ApplyReimbursement from '../ApplyReimbursement/ApplyReimbursement';


function Reimbursement() {
  const [activeTab, setActiveTab] = useState('ApplyReimbursement');

  const tabs = [
    { id: 'ApplyReimbursement', label: 'Apply Reimbursement' },
    { id: 'ReimbursementHistory', label: 'Reimbursement History' }, 
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ApplyReimbursement':
        return <ApplyReimbursement setActiveTab={setActiveTab}/>;
      case 'ReimbursementHistory':
        return <ReimbursementHistory/>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="settings-page">
        <Card title="Reimbursement Settings" icon="mdi:calendar-month-outline">
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

export default Reimbursement;
