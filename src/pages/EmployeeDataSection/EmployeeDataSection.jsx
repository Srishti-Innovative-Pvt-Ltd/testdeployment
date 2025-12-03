import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmployeeTab from "../../components/AddEmployeeTab/AddEmployeeTab";
import { getUserRole } from "../../utils/roleUtils";
import PersonalDetailsEmp from "../AddEmployeeAdminSection/PersonalDetailsEmp";
import IdDocuments from "../AddEmployeeAdminSection/IdDocuments";
import HealthInfo from "../AddEmployeeAdminSection/HealthInfo";
import Dependents from "../AddEmployeeAdminSection/Dependents";
import JobSchedule from "../JobSchedule/JobSchedule";
import Salary from "../Salary/Salary";
import { useParams } from "react-router-dom";

// Define steps with role-based access
const steps = [
  { number: 1, label: "Personal Information", roles: ["admin", "employee"] },
  { number: 2, label: "ID & Documents", roles: ["admin", "employee"] },
  { number: 3, label: "Health Info", roles: ["admin", "employee"] },
  { number: 4, label: "Dependents", roles: ["admin", "employee"] },
  // { number: 5, label: "Job & Schedule", roles: ["admin"] },
  // { number: 6, label: "Salary", roles: ["admin"] },
];

function EmployeeDataSection() {

  const {id}=useParams()
  const [activeStep, setActiveStep] = useState(1);
  const role = getUserRole();

  // Get steps allowed for the current role
  const allowedSteps = steps
    .filter((step) => step.roles.includes(role))
    .map((s) => s.number);

  // Move to next allowed step
  const handleNext = () => {
    const currentIndex = allowedSteps.indexOf(activeStep);
    if (currentIndex !== -1 && currentIndex < allowedSteps.length - 1) {
      setActiveStep(allowedSteps[currentIndex + 1]);
    }
  };

  // Move to previous allowed step
  const handleBack = () => {
    const currentIndex = allowedSteps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(allowedSteps[currentIndex - 1]);
    }
  };

  // Click step directly if allowed
  const handleStepClick = (step) => {
    if (allowedSteps.includes(step)) {
      setActiveStep(step);
    }
  };

  // Render the appropriate component
  const renderStepComponent = () => {
    switch (activeStep) {
      case 1:
        return <PersonalDetailsEmp onNext={handleNext} user_id={id} />;
      case 2:
        return <IdDocuments onNext={handleNext} onBack={handleBack} user_id={id} />;
      case 3:
        return <HealthInfo onNext={handleNext} onBack={handleBack} user_id={id}/>;
      case 4:
        return <Dependents onNext={handleNext} onBack={handleBack} user_id={id} />;
      // case 5:
      //   return <JobSchedule onNext={handleNext} onBack={handleBack} />;
      // case 6:
      //   return <Salary onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <AddEmployeeTab
        activeStep={activeStep}
        onStepClick={handleStepClick}
        role={role}
        steps={steps}
      />
      {renderStepComponent()}
    </DashboardLayout>
  );
}

export default EmployeeDataSection;
