import React, { useState } from 'react';
import styles from './Interviews.module.css';
import SettingsTab from "../../components/SettingTab/SettingsTab"; 
import DashboardLayout from "../../layouts/DashboardLayout";
import ActiveInterviews from "../../pages/ActiveInterviews/ActiveInterviews";
import Card from "../../components/Card/Card";
import { Icon } from "@iconify/react";

// Dummy components (replace with your real components)
const PastInterviews = () => <div>Past Interviews Content</div>;

const Interviews = () => {
  const [activeTab, setActiveTab] = useState("active");

  const tabs = [
    { id: "active", label: "Active Interviews" },
    { id: "past", label: "Expired Interviews" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return <ActiveInterviews />;
      case "past":
        return <PastInterviews />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Card none>
        <SettingsTab
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          variant="job"
        />

        <div className="tab-content mt-4">
          {renderTabContent()}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Interviews;
