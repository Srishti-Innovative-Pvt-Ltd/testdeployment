import React, { useState } from "react";
import styles from "./WorkReportMoreInfo.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import DashboardLayout from "../../layouts/DashboardLayout";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-multi-date-picker";

const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
};

const WorkReportMoreInfo = () => {
    const allReports = Array.from({ length: 31 }, (_, i) => {
        const day = String(i + 1).padStart(2, "0");
        return {
            id: i + 1,
            date: `2025-07-${day}`,
            login: "09:00",
            logout: "18:00",
            workType: i % 6 === 0 ? "Half Day" : "Full Day",
            comments: i % 5 === 0 ? "Busy with client calls and meetings." : "",
            entries: [
                {
                    project: `Project ${String.fromCharCode(65 + (i % 5))}`,
                    task: "Development",
                    subtasks: ["feature", "UI", i % 2 === 0 ? "API" : "Testing"],
                    hours: i % 6 === 0 ? 4 : 8,
                    details: "Worked on frontend and API integration.",
                    status: i % 3 === 0 ? "Pending" : "Completed",
                    progress: i % 3 === 0 ? 30 + (i * 2) % 70 : 0,
                },
                {
                    project: `Project ${String.fromCharCode(70 - (i % 3))}`,
                    task: "Bug Fixing",
                    subtasks: ["UI Bugs", "Logic"],
                    hours: 2,
                    details: "Resolved display and logic issues.",
                    status: "Completed",
                    progress: 0,
                },
            ],
            approved: i % 4 === 0,
            status: i % 4 === 0 ? "Approved" : "Pending",
        };
    });

    const [data, setData] = useState(allReports);
    const [openIds, setOpenIds] = useState([]);
    const navigate = useNavigate();
    const [selectedDates, setSelectedDates] = useState([]);

    const toggleAccordion = (id) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleStatus = (rowId) => {
        setData((prev) =>
            prev.map((row) =>
                row.id === rowId
                    ? {
                        ...row,
                        approved: !row.approved,
                        status: !row.approved ? "Approved" : "Rejected",
                    }
                    : row
            )
        );
    };

    const filteredData =
        Array.isArray(selectedDates) && selectedDates.length > 0
            ? data.filter((d) =>
                selectedDates.some(
                    (selDate) => selDate?.format?.("YYYY-MM-DD") === d.date
                )
            )
            : data;


    return (
        <DashboardLayout>
            <div className={styles.pageContainer}>
                <Card title="Monthly Work Report - Detailed View">
                    {/* Day Filter */}
                    <div className={styles.filterGroup}>
                        <label>Filter by Date:</label>
                        <DatePicker
                            multiple
                            value={selectedDates}
                            onChange={setSelectedDates}
                            format="DD-MM-YYYY"
                            placeholder="Select multiple dates"
                            inputClass={styles.datePickerInput} // apply the proper style
                        />
                    </div>




                    {/* Filtered Reports */}
                    {filteredData.map((report) => {
                        const isOpen = openIds.includes(report.id);
                        return (
                            <div key={report.id} className={styles.dayBlock}>
                                <div
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion(report.id)}
                                >
                                    <div>
                                        <strong>{formatDate(report.date)}</strong> | {report.login} - {report.logout} | {report.workType}
                                    </div>
                                    <div
                                        className={`${styles.toggle3D} ${report.approved ? styles.activeGreen : styles.activeRed}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStatus(report.id);
                                        }}
                                    >
                                        <span className={styles.label}>
                                            {report.approved ? "Approve" : "Reject"}
                                        </span>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className={styles.dayDetails}>
                                        <div className={styles.statusLine}>
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={
                                                    report.status === "Approved"
                                                        ? styles.statusApproved
                                                        : report.status === "Rejected"
                                                            ? styles.statusRejected
                                                            : styles.statusPending
                                                }
                                            >
                                                {report.status}
                                            </span>
                                        </div>

                                        {report.entries.map((entry, idx) => (
                                            <div key={idx} className={styles.entryBlock}>
                                                <div className={styles.entryRow}>
                                                    <strong>Project:</strong> {entry.project}
                                                </div>
                                                <div className={styles.entryRow}>
                                                    <strong>Task:</strong> {entry.task}
                                                </div>
                                                <div className={styles.entryRow}>
                                                    <strong>Subtasks:</strong> {entry.subtasks?.join(", ") || "N/A"}
                                                </div>
                                                <div className={styles.entryRow}>
                                                    <strong>Work Hours:</strong> {entry.hours}
                                                </div>
                                                <div className={styles.entryRow}>
                                                    <strong>Status:</strong> {entry.status}
                                                </div>
                                                <div className={styles.entryRow}>
                                                    <strong>Details:</strong> {entry.details}
                                                </div>
                                                {entry.status === "Pending" && (
                                                    <div className={styles.entryRow}>
                                                        <strong>Progress:</strong> {entry.progress}%
                                                        <div className={styles.progressBarOuter}>
                                                            <div
                                                                className={styles.progressBarInner}
                                                                style={{ width: `${entry.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {report.comments && (
                                            <div className={styles.comments}>
                                                <strong>Additional Comments:</strong> {report.comments}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className={styles.footer}>
                        <Button label="Back" onClick={() => navigate(-1)} />
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default WorkReportMoreInfo;