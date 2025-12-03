import React, { useState } from 'react';
import styles from './InductionAddCard.module.css';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import InductionCardEditModal from '../../components/InductionCardEditModal/InductionCardEditModal';
import { Icon } from '@iconify/react';

const InductionAddCard = ({ title, type, description, onClick, onTitleClick }) => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <>
            <div onClick={onClick} className={styles.InductionAddCard}>
                <div className={styles.InductionAddCardContent}>
                    <p
                        className={styles.InductionAddCardTitle}
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onTitleClick && onTitleClick();
                        }}
                    >
                        {title} <span className={styles.InductionAddCardType}>({type})</span>
                    </p>
                    <p className={styles.InductionAddCardDescription}>{description}</p>
                </div>
                <div className={styles.InductionAddCardActions}>
                    <Icon
                        icon="mdi:trash-can-outline"
                        className={`${styles.InductionAddCardIcon} ${styles.InductionAddCardDelete}`}
                        onClick={() => setShowModal(true)}
                    />
                    <Icon
                        icon="mdi:pencil-outline"
                        className={`${styles.InductionAddCardIcon}`}
                        onClick={() => setShowEditModal(true)}
                    />
                </div>
            </div>

            {showModal && (
                <DeleteConfirmationModal
                    onConfirm={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {showEditModal && (
                <InductionCardEditModal
                    onClose={() => setShowEditModal(false)}
                    mode="edit"
                />
            )}
        </>
    );
};

export default InductionAddCard;
