import React, { useState, useEffect } from "react";
import styles from "./Department.module.css";
import { Icon } from "@iconify/react";
import AddEditSettingsModal from "../../components/AddEditSettingsModal/AddEditSettingsModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import Button from "../../components/Button/Button";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { getCompaniesByName } from "../../services/companyService";
import { getDepartments, createDepartment, updateDepartment } from "../../services/settingsService";
import { useSnackbar } from "notistack";

function Department() {
  const { enqueueSnackbar } = useSnackbar();

  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filterCompanyId, setFilterCompanyId] = useState("");

  const [isDeptAddModalOpen, setIsDeptAddModalOpen] = useState(false);
  const [isDeptEditModalOpen, setIsDeptEditModalOpen] = useState(false);

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  // Fetch departments initially and when filterCompanyId changes
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await getDepartments(filterCompanyId);

        if (res.success) {
          // Normal success with data
          setDepartments(res.data || []);
        } else {
          // Backend returned a fail (e.g., 404)
          enqueueSnackbar(res.message || "No departments found for this company", { variant: "info" });
          setDepartments([]); // clear the grid
        }
      } catch (error) {
        // Network or unexpected error
        enqueueSnackbar(error.message || "Something went wrong", { variant: "error" });
        setDepartments([]); // clear the grid
      }
    }

    fetchDepartments();
  }, [filterCompanyId, enqueueSnackbar]);


  const handleEditClick = (dept) => {
    // Normalize companyId to string if it is an object
    const normalizedDept = {
      ...dept,
      companyId:
        typeof dept.companyId === "object" && dept.companyId !== null
          ? dept.companyId._id
          : String(dept.companyId),
    };
    setEditingDepartment(normalizedDept);
    setIsDeptEditModalOpen(true);
  };
  // Add department with API
  const handleAddSubmit = async (newDept) => {
    const payload = {
      name: newDept.name,
      companyId: newDept.companyId,
    };

    const res = await createDepartment(payload);
    if (res.success) {
      enqueueSnackbar("Department added successfully", { variant: "success" });
      // Refresh departments list after add
      const refreshed = await getDepartments(filterCompanyId);
      if (refreshed.success) {
        setDepartments(refreshed.data);
      }
      setIsDeptAddModalOpen(false);
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  // Edit department with API
  const handleEditSubmit = async (updatedDept) => {
    if (!editingDepartment?._id) {
      enqueueSnackbar("Invalid department to update", { variant: "error" });
      return;
    }

    const payload = {
      name: updatedDept.name,
      companyId: updatedDept.companyId,
    };

    const res = await updateDepartment(editingDepartment._id, payload);
    if (res.success) {
      enqueueSnackbar("Department updated successfully", { variant: "success" });

      // Check if the company was changed to a different one than the current filter
      const companyChanged = updatedDept.companyId !== editingDepartment.companyId;

      if (filterCompanyId && companyChanged) {
        // If we're filtering and the company changed, remove the department from local state
        setDepartments(prev => prev.filter(dept => dept._id !== editingDepartment._id));
      } else {
        // Otherwise, refresh the list while maintaining the current filter
        const refreshed = await getDepartments(filterCompanyId);
        if (refreshed.success) {
          setDepartments(refreshed.data);
        }
      }

      setIsDeptEditModalOpen(false);
      setEditingDepartment(null);
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };
  const handleDeleteConfirm = () => {
    setDepartments(departments.filter((d) => d !== deletingDepartment));
    setIsDeleteModalOpen(false);
    setDeletingDepartment(null);
  };

  const clearFilter = () => setFilterCompanyId("");

  return (
    <div className={styles.departmentWrapper}>
      <div className={styles.header}>
        <h2>Departments</h2>
        <PrimaryButton label="Add" onClick={() => setIsDeptAddModalOpen(true)} />
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

      {/* Departments grid */}
      <div className={styles.grid}>
        {departments.map((dept) => (
          <div className={styles.card} key={dept._id || dept.name}>
            <span className={styles.title}>{dept.name}</span>
            <div className={styles.actions}>
              <Icon
                icon="mdi:trash-can-outline"
                className={styles.deleteIcon}
                title="Delete"
                onClick={() => {
                  setDeletingDepartment(dept);
                  setIsDeleteModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:pencil-outline"
                className={styles.editIcon}
                title="Edit"
                onClick={() => handleEditClick(dept)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isDeptAddModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsDeptAddModalOpen(false)}
          initialData={null}
          onSubmit={handleAddSubmit}
          companies={companies}
          label="Department"
        />
      )}

      {/* Edit Modal */}
      {isDeptEditModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsDeptEditModalOpen(false)}
          initialData={editingDepartment}
          onSubmit={handleEditSubmit}
          companies={companies}
          label="Department"
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

export default Department;
