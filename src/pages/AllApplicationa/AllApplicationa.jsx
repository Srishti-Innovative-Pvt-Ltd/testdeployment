import React, { useState } from 'react';
import styles from './AllApplicationa.module.css';
import JobDetailsHeader from '../../components/JobDetailsHeader/JobDetailsHeader';
import Table from '../../components/Table/Table';

function AllApplicationa() {
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const headerProps = {
        title: "Senior UI/UX Designer",
        skills: "Figma, Adobe Cloud, HTML, CSS, JS",
        actions: [
            {
                label: 'Reject Selected',
                onClick: () => {
                    alert(`Rejected: ${[...selectedRows].join(', ') || 'None selected'}`);
                },
                secondary: true,
            },
            {
                label: 'Accept Selected',
                onClick: () => {
                    alert(`Accepted: ${[...selectedRows].join(', ') || 'None selected'}`);
                },
            },
        ],
    };

    const data = [
        { name: 'Priya', id: 'EMP001', email: 'Priya@gmail.com', phone: '1234567890', resume: 'priyaats.pdf', date: '01/06/2020', experience: '2 yrs' },
        { name: 'Rahul', id: 'AMP881', email: 'Rahul@gmail.com', phone: '1234567890', resume: 'rahulats.pdf', date: '29/02/2021', experience: '5 yrs' },
        { name: 'Pravin', id: 'QRS965', email: 'Pravin@gmail.com', phone: '1234567890', resume: 'pravinats.pdf', date: '01/08/2022', experience: '10 yrs' },
        { name: 'John', id: 'UTS674', email: 'John@gmail.com', phone: '1234567890', resume: 'johnats.pdf', date: '25/05/2023', experience: '6 yrs' },
        { name: 'Extra1', id: 'EMP005', email: 'x1@gmail.com', phone: '1234567890', resume: 'x1.pdf', date: '01/01/2023', experience: '3 yrs' },
        { name: 'Extra2', id: 'EMP006', email: 'x2@gmail.com', phone: '1234567890', resume: 'x2.pdf', date: '01/01/2023', experience: '4 yrs' },
        { name: 'Extra3', id: 'EMP007', email: 'x3@gmail.com', phone: '1234567890', resume: 'x3.pdf', date: '01/01/2023', experience: '1 yr' },
        { name: 'Extra4', id: 'EMP008', email: 'x4@gmail.com', phone: '1234567890', resume: 'x4.pdf', date: '01/01/2023', experience: '2 yrs' },
        { name: 'Extra5', id: 'EMP009', email: 'x5@gmail.com', phone: '1234567890', resume: 'x5.pdf', date: '01/01/2023', experience: '8 yrs' },
        { name: 'Extra6', id: 'EMP010', email: 'x6@gmail.com', phone: '1234567890', resume: 'x6.pdf', date: '01/01/2023', experience: '6 yrs' },
    ];

    // Checkbox column logic
    const checkboxColumn = {
        header: (
            <input
                type="checkbox"
                style={{ transform: 'scale(1.3)', marginLeft: '6px' }}
                onChange={(e) => {
                    const checked = e.target.checked;
                    const newSet = new Set();
                    if (checked) {
                        data.forEach((_, index) => newSet.add(index));
                    }
                    setSelectedRows(checked ? newSet : new Set());
                }}
            />
        ),

        render: (_, index) => (
            <input
                type="checkbox"
                checked={selectedRows.has(index)}
                onChange={(e) => {
                    const newSet = new Set(selectedRows);
                    if (e.target.checked) {
                        newSet.add(index);
                    } else {
                        newSet.delete(index);
                    }
                    setSelectedRows(newSet);
                }}
            />
        )
    };

    const columns = [
        checkboxColumn,
        { header: 'Applicant Name', accessor: 'name' },
        { header: 'Application ID', accessor: 'id' },
        { header: 'Email ID', accessor: 'email' },
        { header: 'Phone Number', accessor: 'phone' },
        {
            header: 'Resume',
            accessor: 'resume',
            render: (row) => (
                <a href={`/${row.resume}`} target="_blank" rel="noopener noreferrer">
                    {row.resume}
                </a>
            )
        },
        { header: 'Application Date', accessor: 'date' },
        { header: 'Experience', accessor: 'experience' },
    ];

    return (
        <div className={styles.allApplicationsWrapper}>
            <JobDetailsHeader
                title={headerProps.title}
                skills={headerProps.skills}
                actions={headerProps.actions}
            />

            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    data={data}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>

        </div>
    );
}

export default AllApplicationa;
