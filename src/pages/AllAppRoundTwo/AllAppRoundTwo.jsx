import React, { useState } from 'react';
import styles from './AllAppRoundTwo.module.css';
import JobDetailsHeader from '../../components/JobDetailsHeader/JobDetailsHeader';
import Table from '../../components/Table/Table';
import { Icon } from '@iconify/react';
import InterviewResultModal from '../../components/InterviewResultModal/InterviewResultModal';

function AllAppRoundTwo({ setActiveTab }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewResults, setInterviewResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const jobData = {
    title: 'Senior UI/UX Designer',
    skills: 'Figma, Adobe Cloud, HTML, CSS, JS',
  };

  const data = [
    {
      name: 'Priya',
      id: 'EMP001',
      email: 'Priya@gmail.com',
      phone: '1234567890',
      resume: 'priyaats.pdf',
      experience: '2 yrs',
      score: 8,
    },
    {
      name: 'Rahul',
      id: 'AMP881',
      email: 'Rahul@gmail.com',
      phone: '1234567890',
      resume: 'rahulats.pdf',
      experience: '5 yrs',
      score: 9,
    },
    {
      name: 'Pravin',
      id: 'QRS965',
      email: 'Pravin@gmail.com',
      phone: '1234567890',
      resume: 'pravinats.pdf',
      experience: '10 yrs',
      score: 6,
    },
    {
      name: 'John',
      id: 'UTS674',
      email: 'John@gmail.com',
      phone: '1234567890',
      resume: 'johnats.pdf',
      experience: '6 yrs',
      score: 7,
    },
  ];

  const toggleCheckbox = (index) => {
    const newSelection = [...selectedRows];
    const idx = newSelection.indexOf(index);
    if (idx > -1) newSelection.splice(idx, 1);
    else newSelection.push(index);
    setSelectedRows(newSelection);
  };

  const handleSubmitInterviewResult = (resultData) => {
    const newResult = {
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      ...resultData,
    };

    setInterviewResults([...interviewResults, newResult]);
    console.log('Interview result saved (Round 2):', newResult);
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(data.map((_, i) => i));
            } else {
              setSelectedRows([]);
            }
          }}
          checked={selectedRows.length === data.length}
          className={styles.masterCheckbox}
        />
      ),
      render: (_, index) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(index)}
          onChange={() => toggleCheckbox(index)}
        />
      ),
    },
    { header: 'Applicant Name', accessor: 'name' },
    { header: 'Application ID', accessor: 'id' },
    { header: 'Email ID', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone' },
    {
      header: 'Resume',
      render: (row) => (
        <a href={`/${row.resume}`} target="_blank" rel="noopener noreferrer">
          {row.resume}
        </a>
      ),
    },
    { header: 'Experience', accessor: 'experience' },
    { header: 'Score', accessor: 'score' },
  ];

  const actions = [
    ({ row }) => (
      <Icon
        icon="mdi:clipboard-edit-outline"
        style={{ fontSize: '1.7rem', cursor: 'pointer', color: '#007BFF' }}
        onClick={() => {
          setSelectedCandidate(row);
          setShowModal(true);
        }}
      />
    ),
  ];

  return (
    <div className={styles.AllAppRoundTwo__wrapper}>
      <JobDetailsHeader
        title={jobData.title}
        skills={jobData.skills}
        actions={[
          {
            label: 'Select',
            className: styles.AllAppRoundTwo__selectBtn,
             onClick: () => setActiveTab('selectedcandidates'),
          },
        ]}
      />
      <div className={styles.tableSpacing}>
        <Table
          columns={columns}
          data={data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actions={actions}
        />
      </div>

      {showModal && (
        <InterviewResultModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitInterviewResult}
          initialScore={selectedCandidate?.score}
        />
      )}
    </div>
  );
}

export default AllAppRoundTwo;
