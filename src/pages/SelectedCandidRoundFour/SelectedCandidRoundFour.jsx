import React, { useState } from 'react';
import styles from './SelectedCandidRoundFour.module.css';
import JobDetailsHeader from '../../components/JobDetailsHeader/JobDetailsHeader';
import TechnicalRoundModal from '../../components/TechnicalRoundModal/TechnicalRoundModal';
import Table from '../../components/Table/Table';
import { Icon } from '@iconify/react';

function SelectedCandidRoundFour() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showTechnicalModal, setShowTechnicalModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const jobData = {
    title: 'Senior UI/UX Designer',
    skills: 'Figma, Adobe Cloud, HTML, CSS, JS',
  };

  const handleViewTechnicalRound = (candidate) => {
    const technicalRoundData = {
      questions: [
        "Describe a challenging UI problem and how you solved it.",
        "What metrics do you consider for UX success?",
        "Explain your experience collaborating with developers.",
        "How do you balance aesthetics and functionality?",
        "What tools or processes do you use for user testing?",
      ],
      score: candidate.score === '-' ? 'Not evaluated' : candidate.score,
      remarks: candidate.score === '-'
        ? 'Technical round not completed yet.'
        : 'Strong practical approach with clear design thinking.',
    };

    setSelectedCandidate({
      name: candidate.name,
      data: technicalRoundData,
    });
    setShowTechnicalModal(true);
  };

  const data = [
    {
      name: 'Priya',
      id: 'EMP001',
      email: 'Priya@gmail.com',
      phone: '1234567890',
      resume: 'priyaats.pdf',
      experience: '2 yrs',
      score: 9,
    },
    {
      name: 'Rahul',
      id: 'AMP881',
      email: 'Rahul@gmail.com',
      phone: '1234567890',
      resume: 'rahulats.pdf',
      experience: '5 yrs',
      score: 8,
    },
    {
      name: 'Pravin',
      id: 'QRS965',
      email: 'Pravin@gmail.com',
      phone: '1234567890',
      resume: 'pravinats.pdf',
      experience: '10 yrs',
      score: '-',
    },
    {
      name: 'John',
      id: 'UTS674',
      email: 'John@gmail.com',
      phone: '1234567890',
      resume: 'johnats.pdf',
      experience: '6 yrs',
      score: '-',
    },
  ];

  const columns = [
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
    {
      header: 'Result',
      render: (row) => (
        <Icon
          icon="mdi:eye-outline"
          style={{ fontSize: '1.7rem', cursor: 'pointer', color: '#007BFF' }}
          onClick={() => handleViewTechnicalRound(row)}
        />
      ),
    },
  ];

  return (
    <div className={styles.SelectedCandidRoundFour__wrapper}>
      <JobDetailsHeader
        title={jobData.title}
        skills={jobData.skills}
      />
      <div className={styles.tableSpacing}>
        <Table
          columns={columns}
          data={data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showTechnicalModal && (
        <TechnicalRoundModal
          onClose={() => setShowTechnicalModal(false)}
          data={selectedCandidate.data}
          candidateName={selectedCandidate.name}
        />
      )}
    </div>
  );
}

export default SelectedCandidRoundFour;
