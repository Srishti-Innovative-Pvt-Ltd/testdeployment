import React, { useState } from "react";
import styles from "./HRpolicies.module.css";
import { Icon } from "@iconify/react";
import HRpoliciesModal from "../../components/HRpoliciesModal/HRpoliciesModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import DashboardLayout from "../../layouts/DashboardLayout";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

function HRpolicies() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const policyTitles = [
    "Recruitment and Hiring Policy",
    "Attendance and Leave Policy",
    "Code of conduct / Employee Behaviour Policy",
    "Compensation and Benefits Policy",
    "Performance Management Policy",
    "Remote Work / Work from Home Policy",
  ];

  const handleEditClick = (policyTitle) => {
    setEditingCategory(policyTitle);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.categoryWrapper}>
        <div className={styles.header}>
          <h2>HR Policies</h2>
          <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
        </div>

        <div className={styles.grid}>
          {policyTitles.map((policyTitle, index) => (
            <div className={styles.card} key={index}>
              <a href="#" className={styles.title}>
                {policyTitle}
              </a>
              <div className={styles.actions}>
                <Icon
                  icon="mdi:eye-outline"
                  className={styles.eyeIcon}
                  title="View"
                  onClick={() => console.log("View:", policyTitle)}
                />
                <Icon
                  icon="mdi:trash-can-outline"
                  className={styles.deleteIcon}
                  title="Delete"
                  onClick={() => {
                    setDeletingCategory(policyTitle);
                    setIsDeleteModalOpen(true);
                  }}
                />
                <Icon
                  icon="mdi:pencil-outline"
                  className={styles.editIcon}
                  title="Edit"
                  onClick={() => handleEditClick(policyTitle)}
                />
              </div>
            </div>
          ))}
        </div>

        {isAddModalOpen && (
          <HRpoliciesModal
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={(data) => {
              console.log("Added:", data);
              setIsAddModalOpen(false);
            }}
            mode="add"
          />
        )}

        {isEditModalOpen && (
          <HRpoliciesModal
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={(data) => {
              console.log("Edited:", data);
              setIsEditModalOpen(false);
            }}
            initialData={{ title: editingCategory }}
            mode="edit"
          />
        )}

        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              console.log("Deleted:", deletingCategory);
              setIsDeleteModalOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default HRpolicies;
