import React, { useState } from "react";
import styles from "./EmployeeGrade.module.css";
import { Icon } from "@iconify/react";
import AddEditModal from "../../components/AddEditModal/AddEditModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

function EmployeeGrade() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingGrade, setDeletingGrade] = useState(null);

  const grades = [
    "Employee Level 1",
    "Employee Level 2",
    "Employee Level 3",
    "Employee Level 4",
    "Employee Level 5",
    "Employee Level 6",
  ];

  const handleEditClick = (grade) => {
    setEditingGrade(grade);
    setIsEditModalOpen(true);
  };

  return (
    <div className={styles.gradeWrapper}>
      <div className={styles.header}>
        <h2>Employee Grades</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className={styles.grid}>
        {grades.map((grade, index) => (
          <div className={styles.card} key={index}>
            <span className={styles.title}>{grade}</span>
            <div className={styles.actions}>
              <Icon
                icon="mdi:trash-can-outline"
                className={styles.deleteIcon}
                title="Delete"
                onClick={() => {
                  setDeletingGrade(grade);
                  setIsDeleteModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:pencil-outline"
                className={styles.editIcon}
                title="Edit"
                onClick={() => handleEditClick(grade)}
              />
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <AddEditModal
          onClose={() => setIsAddModalOpen(false)}
          label="Employee Grade"
        />
      )}

      {isEditModalOpen && (
        <AddEditModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingGrade}
          label="Employee Grade"
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            console.log("Deleted:", deletingGrade);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default EmployeeGrade;
