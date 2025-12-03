import React, { useState, useEffect } from "react";
import styles from "./Designation.module.css";
import { Icon } from "@iconify/react";
import AddEditSettingsModal from "../../components/AddEditSettingsModal/AddEditSettingsModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Button from "../../components/Button/Button";
import { getCompaniesByName } from "../../services/companyService";
import { useSnackbar } from "notistack";
import { createDesignation, getDesignations ,updateDesignation} from "../../services/settingsService";

function Designation() {
  const { enqueueSnackbar } = useSnackbar();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDesignation, setDeletingDesignation] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [designations, setDesignations] = useState([]);


  // Fetch company list for dropdown
  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      } 
    }
    fetchCompanies();
  }, [enqueueSnackbar]);

useEffect(() => {
  async function fetchDesignations() {
    try {
      const res = await getDesignations(filterCompanyId);

      if (res.success) {
        // If backend returns empty array
        if (!res.data || res.data.length === 0) {
          enqueueSnackbar(res.message || "No designations found for this company", { variant: "info" });
          setDesignations([]); // clear the grid
        } else {
          setDesignations(res.data);
        }
      } else {
        // Backend returned fail (like 404)
        enqueueSnackbar(res.message || "No designations found for this company", { variant: "info" });
        setDesignations([]); // clear the grid
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Something went wrong", { variant: "error" });
      setDesignations([]); // clear the grid
    }
  }

  fetchDesignations();
}, [filterCompanyId, enqueueSnackbar]);

  const handleAddSubmit = async (newDes) => {
    const payload = {
      name: newDes.name,
      companyId: newDes.companyId,
    };

    const res = await createDesignation(payload);
    if (res.success) {
      enqueueSnackbar("Designation added successfully", { variant: "success" });
      // Refresh list after add
      const refreshed = await getDesignations(filterCompanyId);
      if (refreshed.success) {
        setDesignations(refreshed.data);
      }
      setIsAddModalOpen(false);
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

const handleEditSubmit = async (updatedDes) => {
  if (!editingDesignation?._id) {
    enqueueSnackbar("Invalid designation to update", { variant: "error" });
    return;
  }

  const payload = {
    name: updatedDes.name,
    companyId: updatedDes.companyId,
  };

  const res = await updateDesignation(editingDesignation._id, payload);
  
  if (res.success) {
    enqueueSnackbar("Designation updated successfully", { variant: "success" });

    // Check if the company was changed to a different one than the current filter
    const companyChanged = updatedDes.companyId !== editingDesignation.companyId;
    
    if (filterCompanyId && companyChanged) {
      // If we're filtering and the company changed, remove the designation from local state
      setDesignations(prev => prev.filter(des => des._id !== editingDesignation._id));
    } else {
      // Otherwise, refresh the list while maintaining the current filter
      const refreshed = await getDesignations(filterCompanyId);
      if (refreshed.success) {
        setDesignations(refreshed.data);
      }
    }

    setIsEditModalOpen(false);
    setEditingDesignation(null);
  } else {
    enqueueSnackbar(res.message, { variant: "error" });
  }
};


 const handleEditClick = (designation) => {
    // Normalize companyId to string if it is an object
    const normalizedDesignation = {
      ...designation,
      companyId:
        typeof designation.companyId === "object" && designation.companyId !== null
          ? designation.companyId._id
          : String(designation.companyId),
    };
    setEditingDesignation(normalizedDesignation);
    setIsEditModalOpen(true);
  };
  const clearFilter = () => setFilterCompanyId("");

  return (
    <div className={styles.designationWrapper}>
      <div className={styles.header}>
        <h2>Designations</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      {/* Filter Section (same as Department) */}
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

      {/* Designation cards */}
      <div className={styles.grid}>
        {designations.map((des, index) => (
          <div className={styles.card} key={des._id}>
            <span className={styles.title}>{des.name}</span>
            <div className={styles.actions}>
              <Icon
                icon="mdi:trash-can-outline"
                className={styles.deleteIcon}
                title="Delete"
                onClick={() => {
                  setDeletingDesignation(des);
                  setIsDeleteModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:pencil-outline"
                className={styles.editIcon}
                title="Edit"
                onClick={() => handleEditClick(des)}
              />
            </div>
          </div>
        ))}
      </div>

       {/* add */}
      {isAddModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsAddModalOpen(false)}
           onSubmit={handleAddSubmit}
           initialData={null}
          companies={companies}
          label="Designation"
        />
      )}
    {/* edit */}
      {isEditModalOpen && (
        <AddEditSettingsModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={editingDesignation}
          companies={companies}
          label="Designation"
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            console.log("Deleted:", deletingDesignation);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Designation;
