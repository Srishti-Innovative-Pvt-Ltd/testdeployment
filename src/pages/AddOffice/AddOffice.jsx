import React, { useState } from "react";
import styles from "./AddOffice.module.css";
import { Icon } from "@iconify/react";
import AddEditModal from "../../components/AddEditModal/AddEditModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

function AddOffice() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOffice, setDeletingOffice] = useState(null);

  const [offices, setOffices] = useState([
    "Head Office",
    "Branch Office",
    "Remote Hub",
  ]);

  const handleEditClick = (office) => {
    setEditingOffice(office);
    setIsEditModalOpen(true);
  };

  const handleAddOrUpdate = (newOffice) => {
    if (editingOffice) {
      // Update existing
      setOffices(offices.map((o) => (o === editingOffice ? newOffice : o)));
    } else {
      // Add new
      setOffices([...offices, newOffice]);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.departmentWrapper}>
        <Card title="Add Office" icon="mdi:office-building-outline">
          <div className={styles.header}>
            <h2>Add Office</h2>
            <PrimaryButton
              label="Add"
              onClick={() => {
                setEditingOffice(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>

          <div className={styles.grid}>
            {offices.map((office, index) => (
              <div className={styles.card} key={index}>
                <span className={styles.title}>{office}</span>
                <div className={styles.actions}>
                  <Icon
                    icon="mdi:trash-can-outline"
                    className={styles.deleteIcon}
                    title="Delete"
                    onClick={() => {
                      setDeletingOffice(office);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                  <Icon
                    icon="mdi:pencil-outline"
                    className={styles.editIcon}
                    title="Edit"
                    onClick={() => handleEditClick(office)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Modal */}
          {isAddModalOpen && (
            <AddEditModal
              onClose={() => setIsAddModalOpen(false)}
              label="Office"
              onSubmit={handleAddOrUpdate}
            />
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <AddEditModal
              onClose={() => setIsEditModalOpen(false)}
              initialData={editingOffice}
              label="Office"
              onSubmit={handleAddOrUpdate}
            />
          )}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
            <DeleteConfirmationModal
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => {
                setOffices(offices.filter((o) => o !== deletingOffice));
                setIsDeleteModalOpen(false);
              }}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AddOffice;
