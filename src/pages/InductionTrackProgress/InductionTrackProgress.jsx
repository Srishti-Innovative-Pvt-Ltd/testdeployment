import React, { useState } from "react";
import styles from "./InductionTrackProgress.module.css";
import ProfileImage from "../../assets/images/profile.jpg"
import { Icon } from "@iconify/react";
import Table from "../../components/Table/Table";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";

const InductionTrackProgress = () => {
    const [currentPage, setCurrentPage] = useState(2);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 4;

    const inductionData = [
        {
            profile: <img src={ProfileImage} alt="Profile Pc" className={styles.InductionTrackProgressAvatar} />,
            name: "Priya",
            empId: "EMP001",
            phone: "1234567890",
            email: "Priya@gmail.com",
            joining: "01/06/2020",
            status: "3/7",
        },
        {
            profile: <img src={ProfileImage} alt="Profile Pc" className={styles.InductionTrackProgressAvatar} />,
            name: "Rahul",
            empId: "AMP881",
            phone: "1234567890",
            email: "Rahul@gmail.com",
            joining: "29/02/2021",
            status: "3/7",
        },
        {
            profile: <img src={ProfileImage} alt="Profile Pc" className={styles.InductionTrackProgressAvatar} />,
            name: "Pravin",
            empId: "QRS965",
            phone: "1234567890",
            email: "Pravin@gmail.com",
            joining: "01/08/2022",
            status: "5/7",
        },
        {
            profile: <img src={ProfileImage} alt="Profile Pc" className={styles.InductionTrackProgressAvatar} />,
            name: "John",
            empId: "UTS674",
            phone: "1234567890",
            email: "John@gmail.com",
            joining: "25/05/2023",
            status: "3/7",
        },
    ];

    const filteredData = inductionData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: "Profile", accessor: "profile" },
        { header: "Name", accessor: "name" },
        { header: "Employee ID", accessor: "empId" },
        { header: "Phone Number", accessor: "phone" },
        { header: "Email ID", accessor: "email" },
        { header: "Joining Date", accessor: "joining" },
        {
            header: "Status",
            render: (row) => (
                <div className={styles.InductionTrackProgressStatusWrapper}>
                    <span>{row.status}</span>
                    <div className={styles.InductionTrackProgressBarWrapper}>
                        <div
                            className={styles.InductionTrackProgressBarFill}
                            style={{ width: `${(parseInt(row.status) / 7) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ),
        },
        {
            header: "Action",
            render: () => (
                <Icon icon="mdi:eye-outline" className={styles.InductionTrackProgressViewIcon} />
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Card title="Induction Progress">
            <div className={styles.InductionTrackProgressContainer}>

                <div className={styles.InductionTrackProgressHeader}>
                    <h2 className={styles.InductionTrackProgressTitle}>Induction Progress</h2>
                    <div className={styles.InductionTrackProgressSearchWrapper}>
                        <Icon icon="mdi:magnify" className={styles.InductionTrackProgressSearchIcon} />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className={styles.InductionTrackProgressSearchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div> <br />

                <Table
                    columns={columns}
                    data={filteredData}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    totalCount={10}
                />
            </div>
            </Card>
        </DashboardLayout>
    );
};

export default InductionTrackProgress;
