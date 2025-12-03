import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageReports.module.css";
import { Icon } from "@iconify/react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

// Mock data with department and employee
const mockData = [
    {
        date: "2025-07-01",
        login: "09:00",
        logout: "18:00",
        break: "1:00",
        work: "8:00",
        status: "Approved",
        department: "Engineering",
        employee: "John",
    },
    {
        date: "2025-07-02",
        login: "09:10",
        logout: "18:05",
        break: "0:50",
        work: "8:05",
        status: "Pending",
        department: "Engineering",
        employee: "John",
    },
    {
        date: "2025-06-15",
        login: "08:50",
        logout: "17:30",
        break: "1:00",
        work: "7:40",
        status: "Rejected",
        department: "Engineering",
        employee: "John",
    },
    {
        date: "2025-07-03",
        login: "09:30",
        logout: "18:30",
        break: "1:00",
        work: "8:00",
        status: "Approved",
        department: "HR",
        employee: "Jane",
    },
];


const handleViewClick = (month) => {
    navigate("/ManageReports/WorkReportMoreInfo", { state: { month } });
};


const monthYear = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
};

const formatTimeToMinutes = (str) => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
};

const formatMinutesToTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const groupByMonth = (entries) => {
    const grouped = {};
    entries.forEach((entry) => {
        const key = monthYear(entry.date);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(entry);
    });
    return grouped;
};

const ManageReports = () => {
    const [data] = useState(mockData);
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedEmp, setSelectedEmp] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();


    const handleFilter = () => {
        const filtered = data.filter(
            (d) =>
                (!selectedDept || d.department === selectedDept) &&
                (!selectedEmp || d.employee === selectedEmp)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSelectedDept("");
        setSelectedEmp("");
        setFilteredData([]);
        setCurrentPage(1);
    };

const handleViewClick = (month) => {
  navigate("/ManageReports/WorkReportMoreInfo", {
    state: {
      month,
      department: selectedDept,
      employee: selectedEmp,
    },
  });
};

    const grouped = groupByMonth(filteredData);

    const columns = [
        { header: "Month", accessor: "month" },
        { header: "Total Work (hrs)", accessor: "totalWork" },
        { header: "Avg Login", accessor: "avgLogin" },
        { header: "Avg Logout", accessor: "avgLogout" },
        { header: "Approved", accessor: "approved" },
        { header: "Pending", accessor: "pending" },
        { header: "Rejected", accessor: "rejected" },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    const tableData = Object.entries(grouped).map(([month, entries]) => {
        const totalWorkMins = entries.reduce((sum, e) => sum + formatTimeToMinutes(e.work), 0);
        const avgLoginMins =
            entries.reduce((sum, e) => sum + formatTimeToMinutes(e.login), 0) / entries.length;
        const avgLogoutMins =
            entries.reduce((sum, e) => sum + formatTimeToMinutes(e.logout), 0) / entries.length;
        const statusCount = {
            Approved: 0,
            Pending: 0,
            Rejected: 0,
        };
        entries.forEach((e) => statusCount[e.status]++);

        return {
            month,
            totalWork: formatMinutesToTime(totalWorkMins),
            avgLogin: formatMinutesToTime(avgLoginMins),
            avgLogout: formatMinutesToTime(avgLogoutMins),
            approved: statusCount["Approved"],
            pending: statusCount["Pending"],
            rejected: statusCount["Rejected"],
            action: (
                <Icon
                    icon="mdi:eye-outline"
                    style={{ fontSize: "1.7rem", cursor: "pointer", color: "#104eb1" }}
                    onClick={() => handleViewClick(month)}
                />

            ),
        };
    });

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <Card title="Manage Reports by Month" icon="mdi:file-document-outline">
                    {/* Filters */}
                    <div className={styles.filterSection}>
                        <div className={styles.filterGroup}>
                            <label>Department</label>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                            >
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="HR">HR</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Employee Name</label>
                            <select
                                value={selectedEmp}
                                onChange={(e) => setSelectedEmp(e.target.value)}
                            >
                                <option value="">Select Employee</option>
                                <option value="John">John</option>
                                <option value="Jane">Jane</option>
                            </select>
                        </div>

                        <div className={styles.filterButtons}>
                            <Button label="Filter" onClick={handleFilter} />
                            <Button label="Clear" onClick={handleClear} secondary />
                        </div>
                    </div>

                    {/* Monthly Table */}
                    <Table
                        columns={columns}
                        data={tableData}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ManageReports;
