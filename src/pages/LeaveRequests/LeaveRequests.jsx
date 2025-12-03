import React, { useState, useEffect } from "react";
import styles from "./LeaveRequests.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import EmpLeaveRequestDetailsModal from "../../components/EmpLeaveRequestDetailsModal/EmpLeaveRequestDetailsModal";
import AppRejEmpLeaveRequest from "../../components/AppRejEmpLeaveRequest/AppRejEmpLeaveRequest";
import { getLeaveApplications, approveLeave, rejectLeave } from "../../services/leaveServices";
import { getDepartments, getEmployeeCategories } from "../../services/settingsService";
import { useSnackbar } from "notistack";
import { getUserRole, getUserId, getCompanyId } from "../../utils/roleUtils";




function LeaveRequests() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);


  const { enqueueSnackbar } = useSnackbar();

  // Fetch leave applications
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const role = getUserRole();
    const userId = getUserId();

    let employeeIdParam = null;
    if (role !== "admin") {
      employeeIdParam = userId; // only pass if not admin
    }
    const res = await getLeaveApplications("pending", employeeIdParam);
    if (res.success) {
      setLeaveData(res.data || []);
    }
  };

  // Fetch departments and categories
useEffect(() => {
  const fetchFilters = async () => {
    const companyId = getCompanyId(); // get current company ID

    const depRes = await getDepartments(companyId);
    if (depRes.success) setDepartments(depRes.data || []);

    const catRes = await getEmployeeCategories(companyId);
    if (catRes.success) setCategories(catRes.data || []);
  };
  fetchFilters();
}, []);


  // Filter data
  const filteredData = leaveData.filter((item) => {
    const fromDate = item.fromDate ? new Date(item.fromDate) : null;
    if (!fromDate) return false;

    const matchesMonthYear =
      fromDate.getFullYear() === selectedDate.getFullYear() &&
      fromDate.getMonth() === selectedDate.getMonth();

    const matchesDepartment =
      !selectedDepartment ||
      item.employee?.ShiftandSchedule?.employeeDepartment?._id ===
      selectedDepartment;

    const matchesCategory =
      !selectedCategory ||
      item.employee?.employeeCategoryId?._id === selectedCategory;

    return matchesMonthYear && matchesDepartment && matchesCategory;
  });

  // Format data for table
  // Format data for table
  const data =
    filteredData.map((item) => ({
      id: item._id,
      name: item.employee?.fullName || "N/A",
      empId: item.employee?.employeeId || "N/A",
      leaveType: item.leaveType?.name || "N/A",

      // store raw ISO dates for logic
      fromRaw: item.fromDate,
      toRaw: item.toDate,

      // API expects YYYY-MM-DD format
      fromDateApi: item.fromDate
        ? new Date(item.fromDate).toISOString().split("T")[0]
        : null,

      // store pretty strings separately for table display
      from: item.fromDate
        ? new Date(item.fromDate).toLocaleDateString()
        : "N/A",
      to: item.toDate ? new Date(item.toDate).toLocaleDateString() : "N/A",

      duration: item.isHalfDay ? "Half Day" : "Full Day",
    })) || [];

  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Employee ID", accessor: "empId" },
    { header: "Leave Type", accessor: "leaveType" },
    { header: "From Date", accessor: "from" },
    { header: "To Date", accessor: "to" },
    { header: "Leave Duration", accessor: "duration" },
    {
      header: "Details",
      render: (row) => (
        <Icon
          icon="mdi:eye"
          className={styles.detailsIcon}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={() => {
            setSelectedLeaveId(row.id);
            setSelectedFromDate(row.fromDateApi);
            setIsModalOpen(true);
          }}
        />
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className={styles.actionIcons}>
          <Icon
            icon="mdi:check-circle"
            className={styles.approveIcon}
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={() => {
              setSelectedLeaveId(row.id);

              const fromDate = new Date(row.fromRaw);
              const toDate = new Date(row.toRaw);

              const hasWeekend = (start, end) => {
                let current = new Date(start);
                while (current <= end) {
                  const day = current.getDay();
                  if (day === 0 || day === 6) return true; // Sunday = 0, Saturday = 6
                  current.setDate(current.getDate() + 1);
                }
                return false;
              };

              if (hasWeekend(fromDate, toDate)) {
                setModalType("weekend");
              } else {
                setModalType("approve");
              }
            }}

          />

          <Icon
            icon="mdi:close-circle"
            className={styles.rejectIcon}
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={() => {
              setSelectedLeaveId(row.id);
              setModalType("reject");
            }}
          />
        </div>
      ),
    },
  ];

  //  Confirm handler with correct payload
  const handleModalConfirm = async ({ type, options, reason }) => {
    if (!selectedLeaveId) return;

    let res;
    if (type === "approve") {
      res = await approveLeave(selectedLeaveId, { saturday: false, sunday: false });
    } else if (type === "weekend") {
      let weekendPayload = { saturday: false, sunday: false };
      if (options === "continuous") {
        weekendPayload = { saturday: true, sunday: true };
      } else if (options === "saturday") {
        weekendPayload = { saturday: true, sunday: false };
      } else if (options === "sunday") {
        weekendPayload = { saturday: false, sunday: true };
      } else if (options === "none") {
        weekendPayload = { saturday: false, sunday: false };
      }
      res = await approveLeave(selectedLeaveId, weekendPayload);
    } else if (type === "reject") {
      res = await rejectLeave(selectedLeaveId, { rejectionReason: reason });
    }

    if (res.success) {
      enqueueSnackbar(res.message, { variant: "success" });
      fetchLeaves();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }

    setModalType(null);
    setSelectedLeaveId(null);
  };

  const handleClear = () => {
    setSelectedDate(new Date());
    setSelectedDepartment("");
    setSelectedCategory("");
  };

  return (
    <div className={styles.leaveRequestsContainer}>
      {/* Filter Section */}
      <div className={styles.leaveRequestsFilterSection}>
        <div className={styles.leaveRequestsFilterGroup}>
          <label>
            <Icon icon="mdi:calendar" /> Month / Year
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Select Month / Year"
            className={styles.leaveRequestsDatePickerInput}
          />
        </div>

        <div className={styles.leaveRequestsFilterGroup}>
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

        <div className={styles.leaveRequestsFilterGroup}>
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

        <div className={styles.leaveRequestsFilterButtons}>
          <Button label="Clear" onClick={handleClear} type="button" />
        </div>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Details Modal */}
      {isModalOpen && (
        <EmpLeaveRequestDetailsModal
          leaveId={selectedLeaveId}
          fromDate={selectedFromDate}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Approve/Reject Modal */}
      {modalType && (
        <AppRejEmpLeaveRequest
          type={modalType}
          onConfirm={handleModalConfirm}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
}

export default LeaveRequests;