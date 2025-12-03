import React, { useState, useEffect, useCallback } from "react";
import styles from "./AssignedLeave.module.css";
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import AddAssignedLeaveModal from "../../components/AddAssignedLeaveModal/AddAssignedLeaveModal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Button from "../../components/Button/Button";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { getEmployeeCategories, createAssignedLeave, getAssignedLeaves, updateAssignedLeave } from "../../services/settingsService";
import { getCompaniesByName } from "../../services/companyService";
import { useSnackbar } from 'notistack';

const AssignedLeave = () => {
  const [modalType, setModalType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLeave, setDeletingLeave] = useState(null);

  // State for dropdowns
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingData, setEditingData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [leaveData, setLeaveData] = useState([]);

  // Fetch Companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      } else {
        console.error("Failed to fetch companies:", res.message);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch Categories when company changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedCompany) {
        setCategories([]);
        setSelectedCategory("");
        return;
      }
      const res = await getEmployeeCategories(selectedCompany);
      if (res.success) {
        setCategories(res.data || []);
        setSelectedCategory(""); // reset selection whenever company changes
      } else {
        console.error("Failed to fetch categories:", res.message);
        setCategories([]);
        setSelectedCategory(""); // also reset on failure
      }
    };
    fetchCategories();
  }, [selectedCompany]);

  // Define fetchLeaves with useCallback to prevent infinite re-renders
  const fetchLeaves = useCallback(async () => {
    const res = await getAssignedLeaves(selectedCompany, selectedCategory);
    if (res.success) {
      const formatted = (res.data || []).map((item) => ({
        leave: item.leaveTypeId?.name || "N/A",
        leaveType: item.leaveTypeId?._id || null,
        count: item.leaveCount,
        period: item.leavePeriod,
        type: item.leavePlanType
          ? item.leavePlanType.replace(/\b\w/g, (char) => char.toUpperCase())
          : "N/A",
        carry: item.carryForward ? "Yes" : "No",
        max: item.maxCount || "N/A",
        eligibility: item.leaveTypeId?.genderEligibility
          ? item.leaveTypeId.genderEligibility.replace(/\b\w/g, (char) => char.toUpperCase())
          : "N/A",
        employeeCategory: item.employeeCategoryId?._id || "N/A",
        company: item.companyId || "",
        _id: item._id,
      }));
      setLeaveData(formatted);
    } else {
      setLeaveData([]);
    }
  }, [selectedCompany, selectedCategory]);

  // Fetch leaves on initial load and when filters change
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Add Assigned Leave
  const handleAddAssignedLeave = async (payload) => {
    const res = await createAssignedLeave(payload);
    if (res.success) {
      enqueueSnackbar(res.message || "Leave assigned successfully", { variant: "success" });
      setModalType(null);
      setEditingData(null);
      await fetchLeaves(); // Refresh the table data
    } else {
      enqueueSnackbar(res.message || "Failed to assign leave", { variant: "error" });
    }
  };

  // Table columns
  const columns = [
    { header: "Leaves", accessor: "leave" },
    { header: "Leave Count", accessor: "count" },
    { header: "Leave Period", accessor: "period" },
    { header: "Leave Plan Type", accessor: "type" },
    { header: "Carry Forward", accessor: "carry" },
    { header: "Max Count", accessor: "max" },
    { header: "Eligibility", accessor: "eligibility" },
    {
      header: "Action",
      render: (row) => (
        <div className={styles.AssignedLeaveActionIcons}>
          <Icon
            icon="mdi:trash-can-outline"
            className={styles.AssignedLeaveDeleteIcon}
            onClick={() => {
              setDeletingLeave(row.leave);
              setIsDeleteModalOpen(true);
            }}
          />
          <Icon
            icon="mdi:pencil-outline"
            className={styles.AssignedLeaveEditIcon}
            onClick={() => {
              setEditingData(row);
              setModalType("edit");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.AssignedLeaveContainer}>
      {/* ADD MODAL */}
      {modalType === "add" && (
        <AddAssignedLeaveModal
          onClose={() => {
            setModalType(null);
            setEditingData(null);
          }}
          onSubmit={async (payloads) => {
            for (const p of payloads) {
              await handleAddAssignedLeave(p);  // call API for each row
            }
          }}
        />
      )}

      {/* EDIT MODAL*/}
      {modalType === "edit" && (
        <AddAssignedLeaveModal
          initialData={editingData}
          onClose={() => {
            setModalType(null);
            setEditingData(null);
          }}
          onSubmit={async (payloads) => {
            try {
              const payload = payloads[0]; // single row
              const res = await updateAssignedLeave(editingData._id, payload);
              if (res.success) {
                enqueueSnackbar(res.message || "Leave updated successfully", { variant: "success" });
                setModalType(null);
                setEditingData(null);
                await fetchLeaves(); // Refresh the table data
              } else {
                enqueueSnackbar(res.message || "Failed to update leave", { variant: "error" });
              }
            } catch (err) {
              enqueueSnackbar("Something went wrong while updating leave", { variant: "error" });
            }
          }}
        />
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            console.log("Deleted:", deletingLeave);
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {/* Header Row with Filters and Add button */}
      <div className={styles.AssignedLeaveHeader}>
        <div className={styles.AssignedLeaveHeaderRight}>
          {/* Company Filter */}
          <div className={styles.AssignedLeaveFilterGroup}>
            <label>Company</label>
            <select
              className={styles.AssignedLeaveSelect}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">--All Companies--</option>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))
              ) : (
                <option disabled>No companies available</option>
              )}
            </select>
          </div>

          {/* Employee Category Filter */}
          <div className={styles.AssignedLeaveFilterGroup}>
            <label>Employee Category</label>
            <select
              className={styles.AssignedLeaveSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={!selectedCompany}
            >
              <option value="">--All Categories--</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>

          <Button
            label="Clear"
            onClick={() => {
              setSelectedCompany("");
              setSelectedCategory("");
            }}
          />

          {/* Add button aligned to right */}
          <div className={styles.AssignedLeaveAddButton}>
            <PrimaryButton label="Add" onClick={() => setModalType("add")} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.AssignedLeaveTableWrapper}>
        <Table
          columns={columns}
          data={leaveData}
          currentPage={1}
          onPageChange={() => { }}
          rowsPerPage={4}
          totalCount={leaveData.length}
        />
      </div>
    </div>
  );
};

export default AssignedLeave;