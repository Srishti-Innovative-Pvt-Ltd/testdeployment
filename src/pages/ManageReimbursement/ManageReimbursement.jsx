import React, { useState, useEffect } from "react";
import styles from "./ManageReimbursement.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useSnackbar } from "notistack";
import {
  getDepartments,
  getEmployeeCategories,
  updateReimbursementStatus,
  getReimbursements
} from "../../services/settingsService";
import { getCompanyId, getUserRole, getUserId } from "../../utils/roleUtils";
import ReimbursementDetailsModal from "../../components/ReimbursementDetailsModal/ReimbursementDetailsModal";
import ReimbursmentAmountEdit from "../../components/ReimbursmentAmountEdit/ReimbursmentAmountEdit";
import AppRejConfModal from "../../components/AppRejConfModal/AppRejConfModal";



function ManageReimbursement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

   const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Edit settlement modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rowBeingEdited, setRowBeingEdited] = useState(null);

  // Modal for Approve/Reject Confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rowPendingAction, setRowPendingAction] = useState(null);
  // User info
  const userRole = getUserRole();
  const companyId = getCompanyId();
  const userId = getUserId();

  // Table data
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]); // Keep raw data for filtering

  // Fetch reimbursements based on role
  useEffect(() => {
    const fetchReimbursements = async () => {
      let employeeIdParam = null;
      let companyParam = null;

      if (userRole === "admin") {
        employeeIdParam = null;
        companyParam = null;
      } else if (userRole === "hr") {
        employeeIdParam = null;
        companyParam = companyId;
      } else {
        employeeIdParam = userId;
        companyParam = companyId;
      }

      const res = await getReimbursements({
        employeeId: employeeIdParam,
        company: companyParam,
      });

      if (res.success) {
        const mappedData = res.data.map((item) => ({
          id: item.applicationId,
          name: item.employeeName,
          employeeId: item.employeeAppId,
          reimbursementType: item.categoryType,
          dateOfTravel: new Date(item.applicationDate),
          advanceAmount: item.advanceAmount,
          totalAmount: item.totalAmount,
          settlementAmount: item.reimbursementAmount,
          status: item.status,
          departmentId: item.employeeDepartmentId,
          categoryId: item.employeeCategoryId,
           rejectedReason: item.rejectedReason || "",
        }));
        setAllData(mappedData);
        setTableData(mappedData);
      }
    };

    fetchReimbursements();
  }, [userRole, companyId, userId]);

  // Fetch departments & categories
  useEffect(() => {
    const fetchFilters = async () => {
      const depRes = await getDepartments(companyId);
      if (depRes.success) setDepartments(depRes.data || []);

      const catRes = await getEmployeeCategories(companyId);
      if (catRes.success) setCategories(catRes.data || []);
    };

    fetchFilters();
  }, [companyId]);

  // Apply filters 
  const filteredData = allData.filter((item) => {
    const dateOfTravel = item.dateOfTravel ? new Date(item.dateOfTravel) : null;
    if (!dateOfTravel) return false;

    const matchesMonthYear =
      dateOfTravel.getFullYear() === selectedDate.getFullYear() &&
      dateOfTravel.getMonth() === selectedDate.getMonth();

    const matchesDepartment =
      !selectedDepartment ||
      String(item.departmentId) === String(selectedDepartment);

    const matchesCategory =
      !selectedCategory || String(item.categoryId) === String(selectedCategory);

    const matchesStatus =
      !selectedStatus || item.status === selectedStatus;

    return matchesMonthYear && matchesDepartment && matchesCategory && matchesStatus;
  });

  // update table data when filters or allData change
  useEffect(() => {
    setTableData(filteredData);
  }, [selectedDate, selectedDepartment, selectedCategory, selectedStatus, allData]);


  // Table columns
  const columns = [
    { header: "Employee Name", accessor: "name" },
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Category", accessor: "reimbursementType" },
    {
      header: "Date",
      accessor: "dateOfTravel",
      render: (row) => row.dateOfTravel.toLocaleDateString(),
    },
    { header: "Advance Amount", accessor: "advanceAmount" },
    { header: "Total Amount", accessor: "totalAmount" },
    {
      header: "Settlement Amount",
      accessor: "settlementAmount",
      render: (row) => (
        <div className={styles.manageReimbursementSettlement}>
          <span>{row.settlementAmount}</span>
          {(userRole === "admin" || (userRole === "hr" && row.status === "Pending")) && (
            <Icon
              icon="mdi:pencil-outline"
              className={styles.manageReimbursementEditIcon}
              onClick={() => {
                setRowBeingEdited(row);
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        if (row.status === "Rejected") {
          return (
            <button
              className={styles.manageReimbursementRejectedButton}
              onClick={() => {
                setRejectReason(row.rejectedReason || "No reason provided.");
                setShowRejectModal(true);
              }}
            >
              {row.status}
            </button>
          );
        }

        const color =
          row.status === "Approved"
            ? "green"
            : row.status === "Pending"
            ? "orange"
            : "red";

        return (
          <span style={{ color, fontWeight: 600 }}>{row.status}</span>
        );
      },
    },
    {
      header: "Details",
      render: (row) => (
        <Icon
          icon="mdi:eye"
          className={styles.manageReimbursementDetailsIcon}
          onClick={() => {
            setSelectedRow(row);
            setIsModalOpen(true);
          }}
        />
      ),
    },
    {
      header: "Action",
      render: (row) => {
        // Admin can see buttons for all statuses
        if (userRole === "admin") {
          return (
            <div className={styles.manageReimbursementActionIcons}>
              <Icon
                icon="mdi:check-circle"
                className={styles.manageReimbursementApproveIcon}
                onClick={() => {
                  setActionType("approve");
                  setRowPendingAction(row);
                  setIsConfirmModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:close-circle"
                className={styles.manageReimbursementRejectIcon}
                onClick={() => {
                  setActionType("reject");
                  setRowPendingAction(row);
                  setIsConfirmModalOpen(true);
                }}
              />
            </div>
          );
        }

        // HR can only see buttons if status is Pending. (change hr to !admin if needed)
        if (userRole === "hr" && row.status === "Pending") {
          return (
            <div className={styles.manageReimbursementActionIcons}>
              <Icon
                icon="mdi:check-circle"
                className={styles.manageReimbursementApproveIcon}
                onClick={() => {
                  setActionType("approve");
                  setRowPendingAction(row);
                  setIsConfirmModalOpen(true);
                }}
              />
              <Icon
                icon="mdi:close-circle"
                className={styles.manageReimbursementRejectIcon}
                onClick={() => {
                  setActionType("reject");
                  setRowPendingAction(row);
                  setIsConfirmModalOpen(true);
                }}
              />
            </div>
          );
        }

        // Others or HR with non-pending → show nothing
        return null;
      },
    }


  ];

  const handleClear = () => {
    setSelectedDate(new Date());
    setSelectedDepartment("");
    setSelectedCategory("");
    setSelectedStatus("Pending");
  };

  return (
    <DashboardLayout>
      <div className={styles.manageReimbursementContainer}>
        <Card title="Manage Reimbursements" icon="mdi:cash-multiple">
          {/* Filter Section */}
          <div className={styles.manageReimbursementFilterSection}>
            <div className={styles.manageReimbursementFilterGroup}>
              <label>
                <Icon icon="mdi:calendar" /> Month / Year
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className={styles.manageReimbursementDatePicker}
              />
            </div>

            <div className={styles.manageReimbursementFilterGroup}>
              <label>
                <Icon icon="mdi:account-badge" /> Employee Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">--All Departments--</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.manageReimbursementFilterGroup}>
              <label>
                <Icon icon="mdi:account" /> Employee Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">--All Categories--</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.manageReimbursementFilterGroup}>
              <label>
                <Icon icon="mdi:checkbox-multiple-marked-circle-outline" /> Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">--All Status--</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>


            <div className={styles.manageReimbursementFilterButtons}>
              <Button label="Clear" onClick={handleClear} type="button" />
            </div>
          </div>

          {/* Table Section */}
          <Table
            columns={columns}
            data={tableData}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>

       {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className={styles.manageReimbursementModalOverlay}>
          <div className={styles.manageReimbursementModalContent}>
            <h2 className={styles.manageReimbursementModalTitle}>
              Rejection Reason
            </h2>
            <p className={styles.manageReimbursementModalText}>
              {rejectReason}
            </p>
            <Button
              label="Close"
              className={styles.manageReimbursementModalCloseBtn}
              onClick={() => setShowRejectModal(false)}
            />
          </div>
        </div>
      )}

      {/* Reimbursement Details Modal */}
      <ReimbursementDetailsModal
        show={isModalOpen}
        applicationId={selectedRow?.id}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Settlement Amount Edit Modal */}
      <ReimbursmentAmountEdit
        isOpen={isEditModalOpen}
        initialData={rowBeingEdited}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updated) => {
          // Update both tableData and allData
          setTableData((prev) =>
            prev.map((item) =>
              item.id === rowBeingEdited.id
                ? { ...item, settlementAmount: updated.settlementAmount }
                : item
            )
          );
          setAllData((prev) =>
            prev.map((item) =>
              item.id === rowBeingEdited.id
                ? { ...item, settlementAmount: updated.settlementAmount }
                : item
            )
          );
          setIsEditModalOpen(false);
        }}
      />


<AppRejConfModal
  isOpen={isConfirmModalOpen}
  actionType={actionType}
  onCancel={() => setIsConfirmModalOpen(false)}
  onProceed={async (rejectionReason) => {
    if (!rowPendingAction) return;

    const newStatus =
      actionType === "approve"
        ? "Approved"
        : actionType === "reject"
          ? "Rejected"
          : "";

    if (!newStatus) return;

    const res = await updateReimbursementStatus(
      rowPendingAction.id,
      newStatus,
      rejectionReason // pass reason only if reject
    );

    if (res.success) {
      enqueueSnackbar(res.message, { variant: "success" });

      // Update tableData locally
      setTableData((prev) =>
        prev.map((item) =>
          item.id === rowPendingAction.id
            ? {
            ...item,
            status: newStatus,
            rejectedReason: rejectionReason || "", 
          }
            : item
        )
      );
      setAllData((prev) =>
        prev.map((item) =>
          item.id === rowPendingAction.id
            ?  {
            ...item,
            status: newStatus,
            rejectedReason: rejectionReason || "", 
          }
            : item
        )
      );
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }

    setIsConfirmModalOpen(false);
  }}
/>

    </DashboardLayout>
  );
}

export default ManageReimbursement;
