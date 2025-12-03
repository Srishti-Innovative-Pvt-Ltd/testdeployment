import React, { useState } from "react";
import SettingsTab from "../../components/SettingTab/SettingsTab"; 
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card"; 
import AllForms from "../../pages/AllForms/AllForms"; 


function Forms() {
  const [activeTab, setActiveTab] = useState("allForms");
  

  const tabs = [
    { id: "allForms", label: "All Forms" },
    { id: "draft", label: "Draft" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "allForms":
        return <AllForms />;
      case "draft":
        return <div>Draft Forms Content</div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Card title="Forms" icon="material-symbols:description-outline">
        <SettingsTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ marginTop: "1rem" }}>
          {renderTabContent()}
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default Forms;
