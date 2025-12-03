import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import Card from '../../components/Card/Card';
import AllAppRoundFour from '../../pages/AllAppRoundFour/AllAppRoundFour';
import SelectedCandidRoundFour from '../../pages/SelectedCandidRoundFour/SelectedCandidRoundFour';

function InterviewRoundFour({ setActiveStep }) {
  const [activeTab, setActiveTab] = useState('allapplications');

  const tabs = [
    { id: 'allapplications', label: 'All Applications' },
    { id: 'selectedcandidates', label: 'Selected Candidates' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allapplications':
        return <AllAppRoundFour setActiveTab={setActiveTab}/>;
      case 'selectedcandidates':
        return <SelectedCandidRoundFour />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Card title="Schedule Round Four" icon="material-symbols:schedule-outline">
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

export default InterviewRoundFour;
