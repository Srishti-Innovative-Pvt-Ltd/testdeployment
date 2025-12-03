import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import Card from '../../components/Card/Card';
import AllAppRoundTwo from '../../pages/AllAppRoundTwo/AllAppRoundTwo';
import SelectedCandidRoundTwo from '../../pages/SelectedCandidRoundTwo/SelectedCandidRoundTwo';

function InterviewRoundTwo({ setActiveStep }) {
  const [activeTab, setActiveTab] = useState('allapplications');

  const tabs = [
    { id: 'allapplications', label: 'All Applications' },
    { id: 'selectedcandidates', label: 'Selected Candidates' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allapplications':
        return <AllAppRoundTwo setActiveTab={setActiveTab}/>;
      case 'selectedcandidates':
        return <SelectedCandidRoundTwo setActiveStep={setActiveStep} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Card title="Schedule Round Two" icon="material-symbols:schedule-outline">
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

export default InterviewRoundTwo;
