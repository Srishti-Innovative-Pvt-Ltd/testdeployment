import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../../components/Table/Table";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "./UpdateMonthlyOffDays.module.css";
import UpdateOffDaysModal from "../../components/UpdateOffDaysModal/UpdateOffDaysModal";

function UpdateMonthlyOffDays() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      date: "15-07-2025",
      type: "Casual leave",
      duration: "Full day",
      from: "09:00 AM",
      to: "06:00 PM",
      comments: "ipj",
      status: "Approved",
    },
    {
      id: 2,
      date: "18-07-2025",
      type: "Flexi leave",
      duration: "Half day",
      from: "09:00 AM",
      to: "10:00 PM",
      comments: "DF",
      status: "Pending",
    },
    {
      id: 3,
      date: "23-07-2025",
      type: "Work from Home",
      duration: "Full day",
      from: "04:56 AM",
      to: "07:51 PM",
      comments: "ssth",
      status: "Rejected",
    },
  ]);

  // Open Add Modal
  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (row) => {
    setEditingData({
      ...row,
      date: new Date(row.date.split("-").reverse().join("-")),
      fromTime: row.from,
      toTime: row.to,
    });
    setIsModalOpen(true);
  };

  // Submit for Add
  const handleAddSubmit = (values) => {
    const newRow = {
      id: Date.now(),
      date: values.date.toLocaleDateString("en-GB"), // dd-MM-yyyy
      type: values.type,
      duration: values.duration,
      from: values.fromTime,
      to: values.toTime,
      comments: values.comments,
      status: "Pending",
    };
    setData((prev) => [...prev, newRow]);
    setIsModalOpen(false);
  };

  // Submit for Edit
  const handleEditSubmit = (values) => {
    const updatedRow = {
      ...editingData,
      date: values.date.toLocaleDateString("en-GB"),
      type: values.type,
      duration: values.duration,
      from: values.fromTime,
      to: values.toTime,
      comments: values.comments,
    };
    setData((prev) =>
      prev.map((r) => (r.id === editingData.id ? updatedRow : r))
    );
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Off Day Type", accessor: "type" },
    { header: "Duration", accessor: "duration" },
    { header: "From Time", accessor: "from" },
    { header: "To Time", accessor: "to" },
    { header: "Comments", accessor: "comments" },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`${styles.umodStatus} ${
            row.status === "Approved"
              ? styles.umodApproved
              : row.status === "Pending"
              ? styles.umodPending
              : styles.umodRejected
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    ({ row }) => (
      <PrimaryButton
        key={row.id}
        label="Edit"
        className={styles.umodEditBtn}
        onClick={() => handleEdit(row)}
      />
    ),
  ];

  return (
    <DashboardLayout>
      <Card title="Update Monthly Off Days" icon="mdi:calendar-month">
        <div className={styles.umodWrapper}>
          {/* Top Bar */}
          <div className={styles.umodTopBar}>
            <div className={styles.umodFilterSection}>
              <div className={styles.umodFilterGroup}>
                <label>Year & Month</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showMonthYearPicker
                  dateFormat="MMMM yyyy"
                  className={styles.umodDatePickerInput}
                />
              </div>
              <div className={styles.umodFilterButtons}>
                <Button label="Filter" type="button" onClick={() => {}} />
                <Button
                  label="Clear"
                  type="button"
                  secondary
                  onClick={() => setSelectedDate(new Date())}
                />
              </div>
            </div>

            {/* Add Button */}
            <PrimaryButton
              label="Add"
              onClick={handleAdd}
              className={styles.umodAddBtn}
            />
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={data}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            actions={actions}
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <UpdateOffDaysModal
            initialData={editingData}
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingData ? handleEditSubmit : handleAddSubmit}
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default UpdateMonthlyOffDays;
