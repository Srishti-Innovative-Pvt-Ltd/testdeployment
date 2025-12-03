import React, { useState } from 'react';
import styles from './ViewApplications.module.css';
import SettingsTab from '../../components/SettingTab/SettingsTab';
import AllApplicationa from '../../pages/AllApplicationa/AllApplicationa';
import SelectedCandidates from '../../pages/SelectedCandidates/SelectedCandidates';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';


function ViewApplications() {
    const [activeTab, setActiveTab] = useState('viewApplications');

    const tabs = [
        { id: 'viewApplications', label: 'View Applications' },
        { id: 'selectedCandidates', label: 'Selected Candidates' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'viewApplications':
                return <AllApplicationa />;
            case 'selectedCandidates':
                return <SelectedCandidates />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.viewApplicationsContainer}>
                <Card title="Applications" icon="mdi:account-multiple">
                    <SettingsTab
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <div className="tab-content mt-3">
                        {renderTabContent()}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default ViewApplications;
