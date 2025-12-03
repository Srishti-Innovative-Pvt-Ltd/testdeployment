import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import Card from '../../components/Card/Card';
import AllAppRoundThree from '../../pages/AllAppRoundThree/AllAppRoundThree';
import SelectedCandidRoundThree from '../../pages/SelectedCandidRoundThree/SelectedCandidRoundThree';

function InterviewRoundThree({ setActiveStep }) {
  const [activeTab, setActiveTab] = useState('allapplications');

  const tabs = [
    { id: 'allapplications', label: 'All Applications' },
    { id: 'selectedcandidates', label: 'Selected Candidates' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allapplications':
        return <AllAppRoundThree setActiveTab={setActiveTab}/>;
      case 'selectedcandidates':
        return <SelectedCandidRoundThree setActiveStep={setActiveStep} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Card title="Schedule Round Three" icon="material-symbols:schedule-outline">
        <SettingsTab
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}

export default InterviewRoundThree;
