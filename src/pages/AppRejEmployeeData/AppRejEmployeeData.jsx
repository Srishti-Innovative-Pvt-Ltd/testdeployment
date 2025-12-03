import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import Card from '../../components/Card/Card';
import DashboardLayout from "../../layouts/DashboardLayout";
import AppRejPersonalInfo from '../../pages/AppRejPersonalInfo/AppRejPersonalInfo';
import AppRejIdDocuments from '../../pages/AppRejIdDocuments/AppRejIdDocuments';
import AppRejHealthInfo from '../../pages/AppRejHealthInfo/AppRejHealthInfo';
import AppRejDependents from '../../pages/AppRejDependents/AppRejDependents';
import { useParams } from 'react-router-dom';


function AppRejEmployeeData() {
    const {id}=useParams()

  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'documents', label: 'ID & Documents' },
    { id: 'health', label: 'Health Info' },
    { id: 'dependents', label: 'Dependents' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <AppRejPersonalInfo user_id={id} setActiveTab={setActiveTab}  />;
      case 'documents':
        return <AppRejIdDocuments user_id={id} setActiveTab={setActiveTab}  />;
      case 'health':
        return <AppRejHealthInfo user_id={id} setActiveTab={setActiveTab}  />;
      case 'dependents':
        return <AppRejDependents user_id={id} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
    <div >
      <Card title="Employee Profile" icon="mdi:account-circle-outline">
        <SettingsTab
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div>{renderTabContent()}</div>
      </Card>
    </div>
    </DashboardLayout>
  );
}

export default AppRejEmployeeData;