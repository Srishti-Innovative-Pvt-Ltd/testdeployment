import React, { useState, useEffect } from "react";
import styles from "./AddCompany.module.css";
import { Icon } from "@iconify/react";
import AddEditCompanyModal from "../../components/AddEditCompanyModal/AddEditCompanyModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import DummyLogo from "../../assets/images/CompanyLogo.png";
import { useSnackbar } from "notistack";
import { getCompanies, addCompany, updateCompany } from "../../services/companyService";
import ViewCompanyModal from "../../components/ViewCompanyModal/ViewCompanyModal";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";



function AddCompany() {
  const { enqueueSnackbar } = useSnackbar();

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const result = await getCompanies();
      if (result.success) {
        setCompanies(result.data);

      } else {
        enqueueSnackbar(result.message || "Failed to load companies", {
          variant: "error",
        });
      }
      setIsLoading(false);
    };

    fetchCompanies();
  }, [enqueueSnackbar]);

  const handleEditClick = (company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (company) => {
    setSelectedCompany(company);
    setIsViewModalOpen(true);
  };


  // Handles add company
  const handleAddSubmit = async (formValues) => {
    const result = await addCompany(formValues);
    
    if (result.success) {
      enqueueSnackbar("Company added successfully!", { variant: "success" });
      setIsAddModalOpen(false);

      // Refresh company list
      const refreshed = await getCompanies();
      if (refreshed.success) setCompanies(refreshed.data);
    } else {
      enqueueSnackbar(result.message || "Failed to add company", {
        variant: "error",
      });
    }
  };
  //Handles Edit Company
  const handleEditSubmit = async (formValues) => {
    const formData = new FormData();
    formData.append("companyName", formValues.companyName);
    formData.append("address", formValues.address);
    formData.append("logo", formValues.logo || "");
    formData.append("letterHead", formValues.header || "");
    formData.append("letterFooter", formValues.footer || "");
    formData.append("parentCompany", formValues.parentCompany || "");
     formData.append("probationPeriod", formValues.probationPeriod || "");

    const result = await updateCompany(editingCompany._id, formData);

    if (result.success) {
      enqueueSnackbar("Company updated successfully!", { variant: "success" });
      setIsEditModalOpen(false);
      setEditingCompany(null);

      const refreshed = await getCompanies();
      if (refreshed.success) setCompanies(refreshed.data);
    } else {
      enqueueSnackbar(result.message || "Failed to update company", {
        variant: "error",
      });
    }
  };

  return (
    <div className={styles.addCompanyWrapper}>
      <div className={styles.addCompanyHeader}>
        <h2>Companies</h2>
        <PrimaryButton label="Add" onClick={() => setIsAddModalOpen(true)} />
      </div>

      {isLoading ? (
        <p>Loading companies...</p>
      ) : (
        <div className={styles.addCompanyGrid}>
          {companies.length ? companies.map((company) => (
            <div className={styles.addCompanyCard}
              key={company._id}
              onClick={() => handleViewClick(company)}

            >
              <img
                src={company.logo ? `${UPLOADS_PATH_BASE_URL}${company.logo}` : DummyLogo}
                alt={company.companyName}
                className={styles.addCompanyLogo}
              />
              <div className={styles.addCompanyName}>{company.companyName}</div>
              <div className={styles.addCompanyActions}>
                <Icon
                  icon="mdi:trash-can-outline"
                  className={styles.addCompanyDeleteIcon}
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingCompany(company);
                    setIsDeleteModalOpen(true);
                  }}
                />
                <Icon
                  icon="mdi:pencil-outline"
                  className={styles.addCompanyEditIcon}
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(company);
                  }}
                />
              </div>
            </div>
          )) : <h5  >No Companies Found</h5>}
        </div>
      )}

      {isAddModalOpen && (
        <AddEditCompanyModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          parentOptions={companies}
        />
      )}


      {isEditModalOpen && (
        <AddEditCompanyModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingCompany}
          onSubmit={handleEditSubmit}
          parentOptions={companies}
        />
      )}


      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            console.log("Deleted:", deletingCompany);
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {isViewModalOpen && (
        <ViewCompanyModal
          companyId={selectedCompany?._id}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AddCompany;
