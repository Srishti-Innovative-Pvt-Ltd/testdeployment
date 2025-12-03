import React from 'react';
import styles from './JobDetails.module.css';
import DashboardLayout from '../../layouts/DashboardLayout';
import JobDetailsHeader from '../../components/JobDetailsHeader/JobDetailsHeader';
import Card from '../../components/Card/Card';
import JobDetailsSideBar from '../../components/JobDetailsSideBar/JobDetailsSideBar';
import { useNavigate } from 'react-router-dom';


function JobDetails() {
    const navigate = useNavigate();

    const jobDetailsData = {
        description:
            'As a Software Developer at Google, you will be part of a dynamic and innovative team responsible for creating and maintaining cutting-edge software solutions. This role involves collaborating with cross-functional teams to design, develop, and optimize scalable systems while ensuring high performance and security.',
        responsibilities: [
            'Develop, test, and deploy software solutions in Python, Java, SQL, and HTML.',
            'Collaborate with stakeholders to analyze business requirements and translate them into technical specifications.',
            'Debug and resolve software issues to ensure seamless user experiences.',
            'Optimize database performance using SQL and implement efficient queries.',
            'Stay updated on emerging technologies and best practices to ensure state-of-the-art development.'
        ],
        requiredSkills: [
            'Proficiency in Python, Java, SQL, and HTML.',
            'Strong problem-solving skills and the ability to write clean, maintainable code.',
            'Experience in building and managing scalable applications.',
            'Knowledge of software design patterns and best practices.'
        ],
        preferredSkills: [
            'Familiarity with cloud platforms like Google Cloud or AWS.',
            'Understanding of front-end frameworks such as React or Angular.'
        ],
        whyJoinUs: [
            'At Google, we believe in fostering innovation and empowering individuals to achieve their full potential.',
            'Joining our team means being part of a global leader in technology, where you will work on impactful projects and grow your career in a supportive environment.'
        ]

    };

    return (
        <DashboardLayout>
            <div className={styles.jobDetailsWrapper}>
                <Card title="Job Details" icon="mdi:briefcase-outline">
                    <JobDetailsHeader
                        title="Senior UI/UX Designer"
                        skills="Figma, Adobe Cloud, HTML, CSS, JS"
                        actions={[
                            {
                                label: 'Delete',
                                onClick: () => console.log('Delete clicked'),
                                className: styles.jobDetailsHeaderDeleteBtn,
                                secondary: true,
                            },
                            {
                                label: 'Edit',
                                onClick: () => console.log('Edit clicked'),
                                className: styles.jobDetailsHeaderEditBtn,
                            },
                            {
                                label: 'View Applications',
                               onClick: () => navigate('/Hiring/ViewApplications'),
                                className: styles.jobDetailsHeaderViewBtn,
                            },
                        ]}
                    />

                    <div className={styles.contentWrapper}>
                        <div className={styles.sidebar}>
                            <JobDetailsSideBar />
                        </div>
                        <div className={styles.jobContent}>
                            <h3>Description</h3>
                            <p>{jobDetailsData.description}</p>

                            <h3>Responsibilities</h3>
                            <ul>
                                {jobDetailsData.responsibilities.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            <h3>Required Skills</h3>
                            <ul>
                                {jobDetailsData.requiredSkills.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            <h3>Preferred Skills</h3>
                            <ul>
                                {jobDetailsData.preferredSkills.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h3>Why Join Us?</h3>
                            <ul>
                                {jobDetailsData.whyJoinUs.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default JobDetails;
