import React, { useState } from 'react';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import Card from '../../components/Card/Card';
import AllAppRoundOne from '../../pages/AllAppRoundOne/AllAppRoundOne';
import SelectedCandidRoundOne from '../../pages/SelectedCandidRoundOne/SelectedCandidRoundOne';


function InterviewRoundOne({setActiveStep }) {
  const [activeTab, setActiveTab] = useState('allapplications');

  const tabs = [
    { id: 'allapplications', label: 'All Applications' },
    { id: 'selectedcandidates', label: 'Selected Candidates' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allapplications':
        return <AllAppRoundOne setActiveTab={setActiveTab} />;
      case 'selectedcandidates':
        return <SelectedCandidRoundOne setActiveStep={setActiveStep}/>;
      default:
        return null;
    }
  };

  return (
    <div>
         <Card title="Schedule Round One" icon="material-symbols:schedule-outline">
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

export default InterviewRoundOne;
