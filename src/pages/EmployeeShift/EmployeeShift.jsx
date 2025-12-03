import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./EmployeeShift.module.css";
import Table from "../../components/Table/Table";
import AddEmployeeShiftModal from "../../components/AddEmployeeShiftModal/AddEmployeeShiftModal";
import Button from "../../components/Button/Button";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useSnackbar } from "notistack";
import { createShift, getShifts, updateShift, getAllShifts } from "../../services/settingsService";
import { getCompaniesByName } from "../../services/companyService";

const EmployeeShift = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [companies, setCompanies] = useState([]);
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [shifts, setShifts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  // Fetch companies
  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      } else {
        enqueueSnackbar(res.message || "Failed to load companies", { variant: "info" });
      }
    }
    fetchCompanies();
  }, [enqueueSnackbar]);

  // Fetch shifts
  const fetchShifts = async () => {
    let res;
    if (filterCompanyId) {
      res = await getShifts(filterCompanyId);
    } else {
      res = await getAllShifts(); // New API to fetch all shifts
    }

    if (res.success) {
      setShifts(res.data);
    } else {
        setShifts([]); 
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [filterCompanyId]);

  // Add
  const handleAddClick = () => {
    setEditingShift(null);
    setIsModalOpen(true);
  };

  // Edit
  const handleEditClick = (shift) => {
    setEditingShift(shift);
    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = async (formData) => {
    const payload = {
      companyId: formData.companyId,
      shiftName: formData.shiftName,
      startTime: formData.startTime,
      endTime: formData.endTime,
      breakDuration: formData.breakDuration,
      workingHours: formData.workingHours,
    };

    let res;
    if (editingShift?._id) {
      res = await updateShift(editingShift._id, payload);
    } else {
      res = await createShift(payload);
    }

    if (res.success) {
      enqueueSnackbar(res.message, { variant: "success" });
      await fetchShifts();
      setIsModalOpen(false);
      setEditingShift(null);
    } else {
      enqueueSnackbar(res.message || "Error saving shift", { variant: "error" });
    }
  };

  const columns = [
    { header: "Shift", accessor: "shiftName" },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Break Time", accessor: "breakDuration" },
    { header: "Working Hours", accessor: "workingHours" },
    {
      header: "Action",
      render: (row) => (
        <Icon
          icon="mdi:pencil-outline"
          className={styles.EmployeeShiftEditIcon}
          onClick={() => handleEditClick(row)}
        />
      ),
    },
  ];

  return (
    <div className={styles.EmployeeShiftContainer}>
      <div className={styles.EmployeeShiftHeader}>
        <h2>Employee Shift</h2>
        <PrimaryButton label="Add" onClick={handleAddClick} />
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

      {/* Shifts Table */}
      <div className={styles.EmployeeShiftTableWrapper}>
        <Table
          columns={columns}
          data={shifts}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <AddEmployeeShiftModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShift(null);
          }}
          initialData={editingShift}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeShift;
