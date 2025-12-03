import React, { useState } from "react";
import AddEmployeeTab from "../../components/AddEmployeeTab/AddEmployeeTab";
import DashboardLayout from "../../layouts/DashboardLayout";
import InterviewRoundOne from "../../pages/InterviewRoundOne/InterviewRoundOne";
import InterviewRoundTwo from "../../pages/InterviewRoundTwo/InterviewRoundTwo";
import InterviewRoundThree from "../../pages/InterviewRoundThree/InterviewRoundThree";
import InterviewRoundFour from "../../pages/InterviewRoundFour/InterviewRoundFour";


const steps = [
  { number: 1, label: "Round 1" },
  { number: 2, label: "Round 2" },
  { number: 3, label: "Round 3" },
  { number: 4, label: "Round 4" },
];

function ScheduleInterviewsRounds() {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return <InterviewRoundOne setActiveStep={setActiveStep}/>;
      case 2:
        return <InterviewRoundTwo setActiveStep={setActiveStep}/>;
      case 3:
        return <InterviewRoundThree setActiveStep={setActiveStep}/>;
      case 4:
        return <InterviewRoundFour />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
    <div>
      <AddEmployeeTab
        activeStep={activeStep}
        onStepClick={handleStepClick}
        steps={steps.map(step => ({ ...step, roles: ["any"] }))}
        role="any"
      />
      {renderStepContent()}
    </div>
    </DashboardLayout>
  );
}

export default ScheduleInterviewsRounds;
