import React, { useState } from 'react';
import styles from './SelectedCandidates.module.css';
import JobDetailsHeader from '../../components/JobDetailsHeader/JobDetailsHeader';
import Table from '../../components/Table/Table';
import ScheduleInterviewModal from '../../components/ScheduleInterviewModal/ScheduleInterviewModal';

function SelectedCandidates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const headerProps = {
    title: "Senior UI/UX Designer",
    skills: "Figma, Adobe Cloud, HTML, CSS, JS",
    actions: [
      {
        label: 'Interview Schedule',
        onClick: () => setShowModal(true),
      },
    ],
  };

  const data = [
    { name: 'Priya', id: 'EMP001', email: 'Priya@gmail.com', phone: '1234567890', resume: 'priyaats.pdf', date: '01/06/2020', experience: '2 yrs' },
    { name: 'Rahul', id: 'AMP881', email: 'Rahul@gmail.com', phone: '1234567890', resume: 'rahulats.pdf', date: '29/02/2021', experience: '5 yrs' },
    { name: 'Pravin', id: 'QRS965', email: 'Pravin@gmail.com', phone: '1234567890', resume: 'pravinats.pdf', date: '01/08/2022', experience: '10 yrs' },
    { name: 'John', id: 'UTS674', email: 'John@gmail.com', phone: '1234567890', resume: 'johnats.pdf', date: '25/05/2023', experience: '6 yrs' },
    { name: 'Alice', id: 'EMP005', email: 'Alice@gmail.com', phone: '1234567890', resume: 'aliceats.pdf', date: '12/03/2021', experience: '3 yrs' },
    { name: 'Bob', id: 'EMP006', email: 'Bob@gmail.com', phone: '1234567890', resume: 'bobats.pdf', date: '18/07/2020', experience: '4 yrs' },
    { name: 'Carol', id: 'EMP007', email: 'Carol@gmail.com', phone: '1234567890', resume: 'carolats.pdf', date: '23/09/2019', experience: '5 yrs' },
    { name: 'David', id: 'EMP008', email: 'David@gmail.com', phone: '1234567890', resume: 'davidats.pdf', date: '03/11/2018', experience: '7 yrs' },
    { name: 'Emma', id: 'EMP009', email: 'Emma@gmail.com', phone: '1234567890', resume: 'emmaats.pdf', date: '17/02/2022', experience: '2 yrs' },
    { name: 'Frank', id: 'EMP010', email: 'Frank@gmail.com', phone: '1234567890', resume: 'frankats.pdf', date: '09/06/2021', experience: '6 yrs' },
  ];

  const columns = [
    { header: 'Applicant Name', accessor: 'name' },
    { header: 'Application ID', accessor: 'id' },
    { header: 'Email ID', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone' },
    {
      header: 'Resume',
      accessor: 'resume',
      render: (row) => (
        <a
          href={`/${row.resume}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          {row.resume}
        </a>
      ),
    },
    { header: 'Application Date', accessor: 'date' },
    { header: 'Experience', accessor: 'experience' },
  ];

  const handleModalSubmit = (formValues) => {
    console.log("Interview Scheduled:", formValues);
    setShowModal(false);
  };


  return (
    <div className={styles.selectedCandidatesWrapper}>
      <JobDetailsHeader
        title={headerProps.title}
        skills={headerProps.skills}
        actions={headerProps.actions}
      />

      <div className={styles.tableSection}>
        <Table
          columns={columns}
          data={data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      {showModal && (
        <ScheduleInterviewModal
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

    </div>
  );
}

export default SelectedCandidates;
