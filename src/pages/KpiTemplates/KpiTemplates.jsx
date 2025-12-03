import React, { useState } from 'react';
import styles from './KpiTemplates.module.css';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import Button from '../../components/Button/Button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import KpiAddEditTemplateModal from '../../components/KpiAddEditTemplateModal/KpiAddEditTemplateModal';
import { Icon } from '@iconify/react';

function KpiTemplates() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleDelete = (kpi) => {
        setSelectedKPI(kpi);
        setIsDeleteModalOpen(true);
    };

    const kpiData = [
        { title: 'Calls (Number)', type: 'Monthly' },
        { title: 'Deals Closed (Percentage)', type: 'Monthly' },
        { title: 'Meetings (Percentage)', type: 'Monthly' },
        { title: 'Lead Follow-up (Percentage)', type: 'Monthly' },
        { title: 'Bug Fixes (Number)', type: 'Yearly' },
        { title: 'Content Created (Number)', type: 'Monthly' },
    ];

    return (
        <div className={styles.kpiTemplatesWrapper}>
            {/* Filter Section */}
            <div className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <label htmlFor="department">Department</label>
                    <select id="department">
                        <option value="">Select Department</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="designation">Designation</label>
                    <select id="designation">
                        <option value="">Select Designation</option>
                    </select>
                </div>
                <div className={styles.filterButtons}>
                    <Button label="Filter" onClick={() => { }} />
                    <Button label="Clear" onClick={() => { }} secondary />
                </div>
                <div className={styles.addButtonWrapper}>
                    <PrimaryButton label="Add"
                        onClick={() => {
                            setEditData(null);
                            setIsAddEditModalOpen(true);
                        }} />
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className={styles.kpiGrid}>
                {kpiData.map((kpi, index) => (
                    <div className={styles.kpiCard} key={index}>
                        <div>
                            <div className={styles.kpiTitle}>{kpi.title}</div>
                            <div className={styles.kpiType}>
                                <Icon icon="mdi:calendar-month-outline" />
                                {kpi.type}
                            </div>
                        </div>
                        <div className={styles.kpiActions}>
                            <Icon
                                icon="mdi:trash-can-outline"
                                className={styles.deleteIcon}
                                onClick={() => handleDelete(kpi)}
                            />
                            <Icon
                                icon="mdi:pencil-outline"
                                className={styles.editIcon}
                                onClick={() => {
                                    setEditData(kpi);
                                    setIsAddEditModalOpen(true);
                                }}
                            />

                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        console.log('Deleting', selectedKPI);
                        setIsDeleteModalOpen(false);
                    }}
                />
            )}

            {isAddEditModalOpen && (
                <KpiAddEditTemplateModal
                    onClose={() => setIsAddEditModalOpen(false)}
                    isEdit={!!editData}
                    initialData={editData} 
                />
            )}

        </div>
    );
}

export default KpiTemplates;
