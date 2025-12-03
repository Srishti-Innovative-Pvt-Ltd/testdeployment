import React, { useState, useEffect } from "react";
import styles from "./AddLeave.module.css";
import { Icon } from "@iconify/react";
import AddLeaveModal from "../../components/AddLeaveModal/AddLeaveModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { createLeave, getAllLeaves, updateLeave, deleteLeave } from "../../services/settingsService";
import { useSnackbar } from "notistack";

function AddLeave() {
  const { enqueueSnackbar } = useSnackbar();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLeave, setDeletingLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);

  //  Fetch leaves
const fetchLeaves = async () => {
  const res = await getAllLeaves();
  if (res.success && Array.isArray(res.data) && res.data.length > 0) {
    setLeaves(res.data);
  } else {
    setLeaves([]); // clear if no data
    enqueueSnackbar("No leaves available", { variant: "info" });
  }
};

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleEditClick = (leave) => {
    setEditingLeave(leave);
    setIsEditModalOpen(true);
  };

  // ADD leave handler
  const handleAddLeave = async (values) => {
    try {
      const payload = {
        name: values.name,
        genderEligibility: values.gender, 
      };

      const res = await createLeave(payload);

      if (res.success) {
        enqueueSnackbar(res.message, { variant: "success" });
        setIsAddModalOpen(false);
        fetchLeaves(); 
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  //  EDIT leave handler
  const handleEditLeave = async (values) => {
    try {
      const payload = {
        name: values.name,
        genderEligibility: values.gender,
      };

      const res = await updateLeave(editingLeave._id, payload);

      if (res.success) {
        enqueueSnackbar(res.message, { variant: "success" });
        setIsEditModalOpen(false);
        fetchLeaves(); // refresh after update
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };
  return (
    <div className={styles.AddLeaveWrapper}>
      <div className={styles.AddLeaveHeader}>
        <h2>Leave Structure</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className={styles.AddLeaveGrid}>
        {leaves.map((leave) => (
          <div className={styles.AddLeaveCard} key={leave._id}>
            <span className={styles.AddLeaveTitle}>
              {leave.name} - {leave.genderEligibility.charAt(0).toUpperCase() + leave.genderEligibility.slice(1)}
            </span>
            <div className={styles.AddLeaveActions}>
              <Icon
                icon="mdi:trash-can-outline"
                className={styles.AddLeaveDeleteIcon}
                title="Delete"
                onClick={() => {
                  setDeletingLeave(leave);
                  setIsDeleteModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:pencil-outline"
                className={styles.AddLeaveEditIcon}
                title="Edit"
                onClick={() => handleEditClick(leave)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddLeaveModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddLeave}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AddLeaveModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingLeave}
          onSave={handleEditLeave}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            try {
              const res = await deleteLeave(deletingLeave._id);

              if (res.success) {
                enqueueSnackbar(res.message, { variant: "success" });
                fetchLeaves(); 
              } else {
                enqueueSnackbar(res.message, { variant: "error" });
              }
            } catch (error) {
              enqueueSnackbar("Something went wrong", { variant: "error" });
            } finally {
              setIsDeleteModalOpen(false);
            }
          }}
        />
      )}

    </div>
  );
}

export default AddLeave;
