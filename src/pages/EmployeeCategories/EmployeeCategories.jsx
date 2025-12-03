import React, { useState, useEffect } from "react";
import styles from "./EmployeeCategories.module.css";
import { Icon } from "@iconify/react";
import AddEditSettingsModal from "../../components/AddEditSettingsModal/AddEditSettingsModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Button from "../../components/Button/Button";
import { useSnackbar } from "notistack";
import { getCompaniesByName } from "../../services/companyService";
import {
  createEmployeeCategory,
  getEmployeeCategories,
  updateEmployeeCategory,
} from "../../services/settingsService";

function EmployeeCategories() {
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filterCompanyId, setFilterCompanyId] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Fetch companies for filter dropdown
  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      }
    }
    fetchCompanies();
  }, [enqueueSnackbar]);

  // Fetch categories initially and when filterCompanyId changes
  useEffect(() => {


    async function fetchCategories() {
      try {
        const res = await getEmployeeCategories(filterCompanyId);

        if (res.success) {
          // No categories returned
          if (!res.data || res.data.length === 0) {
            enqueueSnackbar(res.message || "No categories found for this company", { variant: "info" });
            setCategories([]); // clear the grid
          } else {
            setCategories(res.data);
          }
        } else {
          // Backend returned fail (like 404)
          enqueueSnackbar(res.message || "No categhis company", { variant: "info" });
          setCategories([]); // clear the grid
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Something went wrong", { variant: "error" });
        setCategories([]); // clear the grid
      }
    }

    fetchCategories();
  }, [filterCompanyId, enqueueSnackbar]);

  const handleEditClick = (category) => {
    // Normalize companyId if needed
    const normalizedCategory = {
      ...category,
      companyId:
        typeof category.companyId === "object" && category.companyId !== null
          ? category.companyId._id
          : String(category.companyId),
    };
    setEditingCategory(normalizedCategory);
    setIsEditModalOpen(true);
  };

  // Add new category
  const handleAddSubmit = async (newCategory) => {
    const payload = {
      name: newCategory.name,
      companyId: newCategory.companyId,
    };

    const res = await createEmployeeCategory(payload);
    if (res.success) {
      enqueueSnackbar("Employee category added successfully", {
        variant: "success",
      });
      const refreshed = await getEmployeeCategories(filterCompanyId);
      if (refreshed.success) setCategories(refreshed.data);
      setIsAddModalOpen(false);
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  // Update category
  const handleEditSubmit = async (updatedCategory) => {
    if (!editingCategory?._id) {
      enqueueSnackbar("Invalid category to update", { variant: "error" });
      return;
    }

    const payload = {
      name: updatedCategory.name,
      companyId: updatedCategory.companyId,
    };

    const res = await updateEmployeeCategory(editingCategory._id, payload);
    if (res.success) {
      enqueueSnackbar("Employee category updated successfully", {
        variant: "success",
      });

      const companyChanged =
        updatedCategory.companyId !== editingCategory.companyId;

      if (filterCompanyId && companyChanged) {
        setCategories((prev) =>
          prev.filter((cat) => cat._id !== editingCategory._id)
        );
      } else {
        const refreshed = await getEmployeeCategories(filterCompanyId);
        if (refreshed.success) setCategories(refreshed.data);
      }

      setIsEditModalOpen(false);
      setEditingCategory(null);
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  const handleDeleteConfirm = () => {
    setCategories(categories.filter((c) => c !== deletingCategory));
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const clearFilter = () => setFilterCompanyId("");

  return (
    <div className={styles.categoryWrapper}>
      <div className={styles.header}>
        <h2>Employee Categories</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="companyFilter">Filter by Company</label>
          <select
            id="companyFilter"
            className={styles.dropdown}
            value={filterCompanyId}
            onChange={(e) => setFilterCompanyId(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterButtons}>
          <Button label="Clear" onClick={clearFilter} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className={styles.grid}>
        {categories.map((cat) => (
          <div className={styles.card} key={cat._id || cat.name}>
            <span className={styles.title}>{cat.name}</span>
            <div className={styles.actions}>
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
                onClick={() => handleEditClick(cat)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsAddModalOpen(false)}
          initialData={null}
          onSubmit={handleAddSubmit}
          companies={companies}
          label="Employee Category"
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingCategory}
          onSubmit={handleEditSubmit}
          companies={companies}
          label="Employee Category"
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
  );
}

export default EmployeeCategories;
