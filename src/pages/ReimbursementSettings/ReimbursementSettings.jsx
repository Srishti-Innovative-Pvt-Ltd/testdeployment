import React, { useState, useEffect } from "react";
import styles from "./ReimbursementSettings.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { Icon } from "@iconify/react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import ReimbursementCategoryModal from "../../components/ReimbursementCategoryModal/ReimbursementCategoryModal";
import { createReimbursementCategory, getReimbursementCategories, updateReimbursementCategory, deleteReimbursementCategory } from "../../services/settingsService";
import { useSnackbar } from "notistack";

function ReimbursementSettings() {
  const [categories, setCategories] = useState([]);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  //  Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getReimbursementCategories();
      if (result.success) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  //  Handle Add
  const handleAddCategory = async (formData) => {
    try {
      let payload = {};

      if (formData.category === "Food") {
        payload = {
          type: "Food",
          config: {
            days: Number(formData.food.days),
            amount: Number(formData.food.amount),
          },
        };
      } else if (formData.category === "Travel") {
        payload = {
          type: "Travel",
          config: {
            modes: formData.travelEntries.map((entry) => ({
              modeOfTravel: entry.mode,
              kilometers: Number(entry.km),
              amount: Number(entry.amount),
            })),
          },
        };
      } else if (formData.category === "Miscellaneous") {
        payload = {
          type: "Miscellaneous",
          config: {}, // backend expects empty object
        };
      }

      const result = await createReimbursementCategory(payload);

      if (result.success) {
        setCategories((prev) => [...prev, result.data]); // append new
        enqueueSnackbar("Reimbursement category created successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      enqueueSnackbar("Something went wrong while creating category", {
        variant: "error",
      });
    }
  };

  // Handle Edit
  const handleEditCategory = async (formData) => {
    try {
      let payload = {};

      if (formData.category === "Food") {
        payload = {
          config: {
            days: Number(formData.food.days),
            amount: Number(formData.food.amount),
          },
        };
      } else if (formData.category === "Travel") {
        payload = {
          config: {
            modes: formData.travelEntries.map((entry) => ({
              modeOfTravel: entry.mode,
              kilometers: Number(entry.km),
              amount: Number(entry.amount),
            })),
          },
        };
      } else if (formData.category === "Miscellaneous") {
        payload = {
          config: {}, // backend expects empty object
        };
      }

      const result = await updateReimbursementCategory(editingCategory.type, payload);

      if (result.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? result.data : cat
          )
        );
        enqueueSnackbar("Reimbursement category updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      enqueueSnackbar("Something went wrong while updating category", {
        variant: "error",
      });
    } finally {
      setIsEditModalOpen(false);
      setEditingCategory(null);
    }
  };
  //  Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    const result = await deleteReimbursementCategory(deletingCategory.type);

    if (result.success) {
      setCategories((prev) =>
        prev.filter((cat) => cat.type !== deletingCategory.type)
      );
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }

    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  return (
    <DashboardLayout>
      <div className={styles.reimbursementWrapper}>
        {/* Header */}
        <div className={styles.reimbursementHeader}>
          <h2>Reimbursement Category</h2>
          <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
        </div>

        {/* Listing Grid */}
        <div className={styles.reimbursementGrid}>
          {categories.length ? (
            categories.map((cat) => (
              <div className={styles.reimbursementCard} key={cat._id}>
                <span className={styles.reimbursementName}>{cat.type}</span>
                <div className={styles.reimbursementActions}>
                  <Icon
                    icon="mdi:trash-can-outline"
                    className={styles.deleteIcon}
                    title="Delete"
                    onClick={() => {
                      setDeletingCategory(cat);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                  <Icon
                    icon="mdi:pencil-outline"
                    className={styles.editIcon}
                    title="Edit"
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <h5>No Categories Found</h5>
          )}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <ReimbursementCategoryModal
            onClose={() => setIsAddModalOpen(false)}
            initialData={null}
            label="Reimbursement Category"
            onSubmit={handleAddCategory}
          />
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <ReimbursementCategoryModal
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
            }}
            initialData={editingCategory}
            label="Reimbursement Category"
            onSubmit={handleEditCategory}
          />
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default ReimbursementSettings;
