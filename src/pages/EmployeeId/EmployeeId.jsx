import React, { useEffect, useState } from "react";
import styles from "./EmployeeId.module.css";
import { Icon } from "@iconify/react";
import EmployeeIdPatternModal from "../../components/EmployeeIdPatternModal/EmployeeIdPatternModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { getEmployeeIdPattern } from "../../services/settingsService";
import { useSnackbar } from "notistack";

function EmployeeId() {
  const { enqueueSnackbar } = useSnackbar();
  const [patterns, setPatterns] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deletingData, setDeletingData] = useState(null);

  const fetchPatterns = async () => {
    const res = await getEmployeeIdPattern();
    if (res.success) {
      setPatterns(res.data);
    } else {
      enqueueSnackbar(res.message || "Failed to fetch patterns", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, []);

  const handleEditClick = (data) => {
    setEditingData(data);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = (data) => {
    setDeletingData(data);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted:", deletingData);
    setIsDeleteModalOpen(false);
    // You may want to re-fetch here if actual delete is implemented
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h2>Employee ID Pattern</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsAddEditModalOpen(true)}
        >
          Add
        </button>
      </div>

      <div className={styles.grid}>
        {patterns.map((item) => {
          const companyName = item.companyId?.companyName || "Unknown Company";
          const prefix = item.employeeIdPattern?.prefix || "";
          const nextSequence = item.employeeIdPattern?.nextSequence || "";

          return (
            <div className={styles.card} key={item._id}>
              <span className={styles.title}>
                {companyName} - <strong>{prefix}{nextSequence}</strong>
              </span>

              <div className={styles.actions}>
                <Icon
                  icon="mdi:trash-can-outline"
                  className={styles.deleteIcon}
                  title="Delete"
                  onClick={() => handleDeleteClick(item)}
                />
                <Icon
                  icon="mdi:pencil-outline"
                  className={styles.editIcon}
                  title="Edit"
                  onClick={() => handleEditClick(item)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isAddEditModalOpen && (
        <EmployeeIdPatternModal
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingData(null);
            fetchPatterns(); 
          }}
          initialData={editingData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default EmployeeId;
