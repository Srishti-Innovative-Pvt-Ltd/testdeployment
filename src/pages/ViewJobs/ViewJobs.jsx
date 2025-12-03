import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import styles from "./ViewJobs.module.css"
import { Icon } from "@iconify/react";
import ViewJobActiveListing from "../ViewJobActiveListing/ViewJobActiveListing";
import ViewJobExpiredListing from "../ViewJobExpiredListing/ViewJobExpiredListing";
import SettingsTab from "../../components/SettingTab/SettingsTab"; 

const ViewJobs = ({ title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("activeListing");

  const tabs = [
    { id: "activeListing", label: "Active Listing" },
    { id: "expiredListing", label: "Expired Listing" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "activeListing":
        return <ViewJobActiveListing />;
      case "expiredListing":
        return <ViewJobExpiredListing />;
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

        <div className="tab-content">{renderTabContent()}</div>
      </Card>
    </DashboardLayout>
  );
};

export default ViewJobs;
