import React, { useState } from "react";
import JobSchedule from "../JobSchedule/JobSchedule";
import Salary from "../Salary/Salary";
import DashboardLayout from "../../layouts/DashboardLayout";
import AddEmployeeTab from "../../components/AddEmployeeTab/AddEmployeeTab";
import { getUserRole } from "../../utils/roleUtils";
import { useParams } from "react-router-dom";

const steps = [
  { number: 1, label: "Job & Schedule", roles: ["admin"] },
  { number: 2, label: "Salary", roles: ["admin"] },
];

function EmpJobAndSalarySection() {
  const [activeStep, setActiveStep] = useState(1);
  const role = getUserRole();
    const {id, companyId}=useParams()

  const allowedSteps = steps
    .filter((step) => step.roles.includes(role))
    .map((s) => s.number);

  const handleNext = () => {
    const currentIndex = allowedSteps.indexOf(activeStep);
    if (currentIndex !== -1 && currentIndex < allowedSteps.length - 1) {
      setActiveStep(allowedSteps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = allowedSteps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(allowedSteps[currentIndex - 1]);
    }
  };

  const handleStepClick = (step) => {
    if (allowedSteps.includes(step)) {
      setActiveStep(step);
    }
  };

  const renderStepComponent = () => {
    switch (activeStep) {
      case 1:
        return <JobSchedule onNext={handleNext} onBack={handleBack} user_id={id} companyId={companyId}/>;
      case 2:
        return <Salary onBack={handleBack} user_id={id}/>;
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

export default EmpJobAndSalarySection;
