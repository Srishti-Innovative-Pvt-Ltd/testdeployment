import React, { useState, useEffect } from "react";
import styles from "./EmployeePayroll.module.css";
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import EmployeePayrollModal from "../../components/EmployeePayrollModal/EmployeePayrollModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Button from "../../components/Button/Button";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {  getCompaniesWithStructures } from "../../services/companyService";
import { useSnackbar } from "notistack";
import { createSalaryStructure, getSalaryStructures, updateSalaryComponent, deleteSalaryComponent } from "../../services/salaryService";

const EmployeePayroll = () => {
  const { enqueueSnackbar } = useSnackbar();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [salaryStructures, setSalaryStructures] = useState([]);
  // Editing/Deleting data
  const [editingData, setEditingData] = useState(null);
  const [deletingData, setDeletingData] = useState(null);
  // Filter and companies
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);


  // Fetch companies
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await getCompaniesWithStructures();
        if (res.success) {
          setCompanies(res.data);
        } else {
          enqueueSnackbar(res.message || "Failed to load companies", { variant: "info" });
        }
      } catch (error) {
        enqueueSnackbar("Error fetching companies", { variant: "error" });
      }
    }
    fetchCompanies();
  }, []);

  // Fetch salary structures 
  const fetchSalaryStructures = async (companyId = "") => {
    try {
      const res = await getSalaryStructures(companyId);

      if (res.success) {
        const structuresArray = Array.isArray(res.data)
          ? res.data
          : res.data
            ? [res.data]
            : [];

        setSalaryStructures(structuresArray);
      } 
    } catch (error) {
      enqueueSnackbar("Error fetching salary structures", { variant: "error" });
    }
  };

  // Fetch on initial load & when filter changes
  useEffect(() => {
    fetchSalaryStructures(filterCompanyId);
  }, [filterCompanyId]);

  const formatValueType = (valueType) => {
    if (!valueType) return "-";
    return valueType
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  // Filtered salary data based on selected company
  const filteredSalaryData = salaryStructures
    .filter((structure) => {
      if (!filterCompanyId) return true;
      return structure.company === filterCompanyId;
    })
    .flatMap((structure) =>
      (structure.entries || []).map((entry) => ({
        companyId: structure.company || "N/A",
        name: entry.label,
        entryType: entry.entryType,
        valueType: formatValueType(entry.valueType),
        percentage: entry.percentage || "-",
        amount: entry.amount || "-",
        _id: entry._id,
      }))
    );



  // Handlers
 const handleAdd = async () => {
  try {
    // Fetch the latest companies with their salary structures
    const res = await getCompaniesWithStructures();
    if (res.success) {
      setCompanies(res.data); // update local companies state
    }
  } catch (error) {
    enqueueSnackbar("Error fetching companies", { variant: "error" });
  }

  setEditingData(null);
  setIsAddModalOpen(true);
};


  const handleEdit = (row) => {
    const structure = salaryStructures.find((s) =>
      s.entries.some((entry) => entry._id === row._id)
    );

    if (!structure) {
      enqueueSnackbar("Parent salary structure not found", { variant: "error" });
      return;
    }
    const selectedEntry = structure.entries.find((entry) => entry._id === row._id);


    setEditingData({
      componentId: selectedEntry._id,
      structureId: structure._id,
      company: structure.company,
      calcType: structure.calcType || "",
      percentValue: structure.percentValue || "",
      entries: [
        {
          label: selectedEntry.label || "",
          entryType: selectedEntry.entryType || "",
          valueType: selectedEntry.valueType || "",
          percentage: selectedEntry.percentage || "",
          amount: selectedEntry.amount || "",
        }
      ]
    });

    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setDeletingData(row);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (data) => {
    try {
      const res = await createSalaryStructure(data);
      if (res.success) {
        enqueueSnackbar("Salary structure created successfully", { variant: "success" });
        await fetchSalaryStructures();
      } else {
        enqueueSnackbar(res.message || "Failed to create salary structure", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong while creating salary structure", { variant: "error" });
    } finally {
      setIsAddModalOpen(false);
    }
  };
 const handleEditSubmit = async (data) => {
  if (!data.structureId || !data.componentId) {
    enqueueSnackbar("Invalid salary component data", { variant: "error" });
    return;
  }

  const res = await updateSalaryComponent(data.company, data.componentId, {
    calcType: data.calcType,
    percentValue: data.percentValue,
    updatedEntry: {
      label: data.entries[0].label,
      entryType: data.entries[0].entryType,
      valueType: data.entries[0].valueType,
      percentage: data.entries[0].percentage,
      amount: data.entries[0].amount,
    },
  });

  if (res.success) {
    enqueueSnackbar("Salary component updated successfully", { variant: "success" });
    await fetchSalaryStructures(); 
    setCompanies(prev =>
      prev.map(c =>
        c._id === data.company
          ? { 
              ...c, 
              salaryStructure: { 
                ...c.salaryStructure, 
                calcType: data.calcType, 
                percentValue: data.percentValue 
              } 
            }
          : c
      )
    );

    setIsEditModalOpen(false);
  } else {
    enqueueSnackbar(res.message || "Failed to update salary component", { variant: "error" });
  }
};





  const handleDeleteConfirm = async () => {
    if (!deletingData) return;

    try {
      const res = await deleteSalaryComponent(deletingData.companyId, deletingData._id);

      if (res.success) {
        enqueueSnackbar("Salary component deleted successfully", { variant: "success" });
        await fetchSalaryStructures(filterCompanyId);

      } else {
        enqueueSnackbar(res.message || "Failed to delete salary component", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong while deleting salary component", { variant: "error" });
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingData(null);
    }
  };



  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Entry Type", accessor: "entryType" },
    { header: "Value Type", accessor: "valueType" },
    {
      header: "Action",
      render: (row) => (
        <div className={styles.actionIcons}>
          <Icon
            icon="mdi:pencil-outline"
            className={styles.EmployeePayrollEditIcon}
            title="Edit"
            onClick={() => handleEdit(row)}
          />
          <Icon
            icon="mdi:trash-can-outline"
            className={styles.deleteIcon}
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.EmployeePayrollContainer}>
      <div className={styles.EmployeePayrollHeader}>
        <h2>Salary Structure</h2>
        <PrimaryButton label="Add" onClick={handleAdd} />
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
            <option value="">-- Select Companies --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterButtons}>
          <Button
            className={styles.clearButton}
            onClick={() => setFilterCompanyId("")}
            label="Clear"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className={styles.EmployeePayrollTableWrapper}>
        <Table
          columns={columns}
          data={filteredSalaryData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <EmployeePayrollModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          initialData={{}}
          companies={companies}

        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EmployeePayrollModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={editingData}
          companies={companies}
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
};

export default EmployeePayroll;
