import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from '../../components/Card/Card';
import KpiTemplates from '../../pages/KpiTemplates/KpiTemplates';
import KpiAssignedValue from '../KpiAssignedValue/KpiAssignedValue';

function KpiSettings() {
  const [activeTab, setActiveTab] = useState('kpitampLates');

  const tabs = [
    { id: 'kpitampLates', label: 'KPI Template' },
    { id: 'assignedValues', label: 'Assigned Values' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kpitampLates':
        return <KpiTemplates />;
      case 'assignedValues':
        return <KpiAssignedValue />;
      default:
        return null;
    }
  };

  return (
  <DashboardLayout>
      <div className="settings-page">
        <Card title="KPI Settings" icon="mdi:cog-outline">
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

export default KpiSettings;
