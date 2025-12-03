import React, { useState, useEffect } from "react";
import styles from "./MonthlyPayroll.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCompaniesByName } from "../../services/companyService";
import { getDepartments, getEmployeeCategories } from "../../services/settingsService";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

function MonthlyPayroll() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(tableData.map((row) => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Fetch companies initially
    useEffect(() => {
        const fetchCompanies = async () => {
            const compRes = await getCompaniesByName();
            if (compRes.success) setCompanies(compRes.data || []);
            else setCompanies([]);
        };
        fetchCompanies();
    }, []);

    // Fetch department & category filters (based on company)
    useEffect(() => {
        const fetchFilters = async () => {
            const depRes = await getDepartments(selectedCompany || null);
            if (depRes.success) setDepartments(depRes.data || []);

            const catRes = await getEmployeeCategories(selectedCompany || null);
            if (catRes.success) setCategories(catRes.data || []);
        };
        fetchFilters();
    }, [selectedCompany]);

    // Mock table data
    useEffect(() => {
        setTableData([
            {
                id: 1,
                name: "Priya",
                employeeId: "EMP001",
                designation: "Software Engineer",
                lopAmount: "₹ 2,461.54",
                incentives: "₹ 2,000",
                grossSalary: "₹ 32,000",
                status: "Paid",
            },
            {
                id: 2,
                name: "Rahul",
                employeeId: "AMP881",
                designation: "UI/UX Designer",
                lopAmount: "₹ 2,461.54",
                incentives: "₹ 2,000",
                grossSalary: "₹ 32,000",
                status: "Pending",
            },
        ]);
    }, []);

    const handleClear = () => {
        setSelectedDate(new Date());
        setSelectedCompany("");
        setSelectedDepartment("");
        setSelectedCategory("");
    };

    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                      style={{ width: "22px", height: "22px", cursor: "pointer",marginLeft:"11px" }}
                    checked={
                        selectedRows.length === tableData.length &&
                        tableData.length > 0
                    }
                    onChange={handleSelectAll}
                />
            ),
            render: (row) => (
                <input
                    type="checkbox"
                      style={{ width: "22px", height: "22px", cursor: "pointer" }}
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                />
            ),
        },
        { header: "Name", accessor: "name" },
        { header: "Employee ID", accessor: "employeeId" },
        { header: "Designation", accessor: "designation" },
        { header: "Gross Salary", accessor: "grossSalary" },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span
                    className={
                        row.status === "Paid"
                            ? styles.monthlyPayrollPaid
                            : styles.monthlyPayrollPending
                    }
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: "Details",
            render: () => (
                <div className={styles.monthlyPayrollActions}>
                    <Icon icon="mdi:eye" />
                </div>
            ),
        },
        {
            header: "Action",
            render: () => (
                <div className={styles.monthlyPayrollActions}>
                    <Icon icon="mdi:pencil-outline" />
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div className={styles.monthlyPayrollContainer}>
                <Card title="Monthly Payroll" icon="mdi:cash-multiple">

                    <div className={styles.monthlyPayrollTopBar}>
                        <PrimaryButton
                            label="Generate Payroll"
                            type="button"
                            className={styles.generatePayrollBtn}
                        />
                    </div>

                    {/* Filter Section */}
                    <div className={styles.monthlyPayrollFilterSection}>
                        <div className={styles.monthlyPayrollFilterGroup}>
                            <label>
                                <Icon icon="mdi:calendar" /> Month / Year
                            </label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className={styles.monthlyPayrollDatePicker}
                            />
                        </div>

                        <div className={styles.monthlyPayrollFilterGroup}>
                            <label>
                                <Icon icon="mdi:office-building" /> Company
                            </label>
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                <option value="">--All Companies--</option>
                                {companies.length > 0 ? (
                                    companies.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.companyName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No companies available</option>
                                )}
                            </select>
                        </div>

                        <div className={styles.monthlyPayrollFilterGroup}>
                            <label>
                                <Icon icon="mdi:account-badge" /> Department
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

                        <div className={styles.monthlyPayrollFilterGroup}>
                            <label>
                                <Icon icon="mdi:account" /> Category
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

                        <div className={styles.monthlyPayrollFilterButtons}>
                            <Button label="Clear" type="button" onClick={handleClear} />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        data={tableData}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />

                    <div className={styles.monthlyPayrollFooter}>
                        <PrimaryButton
                            type="button"
                            label={
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    <Icon
                                        icon="mdi:check"
                                        style={{ marginRight: "6px", fontSize: "20px" }}
                                    />
                                    Finalize Payroll
                                </span>
                            }
                        />

                        <PrimaryButton
                            type="button"
                            secondary
                            label={
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    <Icon
                                        icon="mdi:file-document-outline"
                                        style={{ marginRight: "6px", fontSize: "20px" }}
                                    />
                                    Bulk Generate Payslips
                                </span>
                            }
                        />

                        <PrimaryButton
                            type="button"
                            secondary
                            label={
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    <Icon
                                        icon="mdi:email-outline"
                                        style={{ marginRight: "6px", fontSize: "20px" }}
                                    />
                                    Send Payslips via Email
                                </span>
                            }
                        />
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default MonthlyPayroll;
