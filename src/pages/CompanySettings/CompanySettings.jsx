import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import AddCompany from '../../pages/AddCompany/AddCompany'

function CompanySettings() {
  const [activeTab, setActiveTab] = useState('addCompany');

  const tabs = [
    { id: 'addCompany', label: 'Add Company' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'addCompany':
        return <AddCompany />;
      default:
        return null;
    }
  };

  return (
  <DashboardLayout>
      <div className="settings-page">
        <Card title="Company Settings" icon="mdi:cog-outline">
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

export default CompanySettings;
