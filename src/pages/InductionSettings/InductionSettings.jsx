import React, { useState } from 'react';
import styles from './InductionSettings.module.css';
import { Icon } from '@iconify/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import InductionAddCard from '../../pages/InductionAddCard/InductionAddCard';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import InductionCardEditModal from '../../components/InductionCardEditModal/InductionCardEditModal';
import InductionAddNewCardModal from '../../components/InductionAddNewCardModal/InductionAddNewCardModal';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';

const InductionSettings = () => {
  
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const items = [
    { id: 1, title: 'Introduction' },
    { id: 2, title: 'Company Overview' },
    { id: 3, title: 'HR Policies' },
  ];

  const handleExpandClick = (id) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const navigate = useNavigate();

  const toNav = () => {
    navigate('/pages/InductionVideoPage');
  };

  return (
    <DashboardLayout>
      <Card title="Settings">
      <div className={styles.InductionSettingsContainer}>
        <div className={styles.InductionSettingsHeader}>
          <div className={styles.InductionSettingsTitle}>Induction</div>
          <PrimaryButton
            className={styles.InductionSettingsAddButton}
            label="Add"
            onClick={() => setShowAddModal(true)}
          />
        </div>

        {items.map((item) => (
          <div key={item.id} className={styles.InductionSettingsItemWrapper}>
            <div
              className={styles.InductionSettingsItemHeader}
              onClick={() => handleExpandClick(item.id)}
            >
              <div className={styles.InductionSettingsItemTitle}>
                {item.title}
              </div>

              <div
                className={styles.InductionSettingsItemActions}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon
                  icon="mdi:trash-can-outline"
                  className={styles.IconDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                /> 
                <Icon
                  icon="mdi:plus"
                  className={styles.IconAdd}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                  }}
                />
                <Icon
                  icon={
                    expandedItemId === item.id
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  }
                  className={styles.IconToggle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpandClick(item.id);
                  }}
                />
              </div>
            </div>

            {item.title === 'Introduction' && expandedItemId === item.id && (
              <div className={styles.InductionSettingsCardsRow}>
                <InductionAddCard
                  title="Company history and journey"
                  type="Video"
                  description="Overview of the organization's background, values, mission, and vision."
                  onTitleClick={toNav}
                />
                <InductionAddCard
                  title="Policies & Procedures"
                  type="Video"
                  description="Health, safety, and security guidelines."
                />
                
              </div>
            )}
          </div>
        ))}

        {showModal && (
          <DeleteConfirmationModal
            onConfirm={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            onClose={() => setShowModal(false)}
          />
        )}

        {showAddModal && (
          <InductionAddNewCardModal onClose={() => setShowAddModal(false)} />
        )}

        {showEditModal && (
          <InductionCardEditModal onClose={() => setShowEditModal(false)} mode="add" />
        )}
      </div>
      </Card>
    </DashboardLayout>
  );
};

export default InductionSettings;
