import React, { useState,useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import PersonalDetailsSidebar from "../../components/PersonalDetailsSidebar/PersonalDetailsSidebar";

import PersonalDetails from "../../pages/PersonalDetails/PersonalDetails";
import ContactDetails from "../../pages/ContactDetails/ContactDetails";

const SearchedEmployeeDetails = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem("activeTab");
    return storedTab !== null ? parseInt(storedTab, 10) : 0;
  });
  
   useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderComponent = () => {
    switch (activeTab) {
      case 0:
        return <PersonalDetails />;
      case 1:
        return <ContactDetails />;
     
      default:
        return <div><b>Coming Soon...</b>.</div>;
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <div className="row">
          <div className="col-lg-3 col-md-12">
            <PersonalDetailsSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="col-lg-9 col-md-12">
            {renderComponent()}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default SearchedEmployeeDetails;
