import React, { useState } from "react";
import styles from "./AllForms.module.css";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import AddFormTitleModal from "../../components/AddFormTitleModal/AddFormTitleModal";

function AllForms() {
  const [forms, setForms] = useState([
    "Exit Form",
    "Induction Feedback Form",
    "Training Feedback Form",
    "Appraisal Form",
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingForm, setDeletingForm] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (form) => {
    setForms(forms.filter((f) => f !== form));
    setIsDeleteModalOpen(false);
  };

  const handleEdit = (form) => {
     navigate("/forms/CustomFormBuilder")
  };

const handleAddForm = (newFormTitle) => {
  setForms([...forms, newFormTitle]);
  navigate("/forms/CustomFormBuilder");
};

  return (
    <div className={styles["allForms-wrapper"]}>
      <div className={styles["allForms-header"]}>
        <h2 className={styles["allForms-heading"]}>Forms</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className={styles["allForms-grid"]}>
        {forms.map((form, index) => (
          <div className={styles["allForms-card"]} key={index}>
            <span className={styles["allForms-title"]}>{form}</span>
            <div className={styles["allForms-actions"]}>
              <Icon
                icon="mdi:trash-can-outline"
                className={styles["allForms-deleteIcon"]}
                title="Delete"
                onClick={() => {
                  setDeletingForm(form);
                  setIsDeleteModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:pencil-outline"
                className={styles["allForms-editIcon"]}
                title="Edit"
                onClick={() => handleEdit(form)}
              />
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <AddFormTitleModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddForm}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDelete(deletingForm)}
        />
      )}
    </div>
  );
}

export default AllForms;
