import React, { useState, useEffect } from "react";
import HiringCard from "../../components/HiringCard/HiringCard";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button/Button";
import styles from "./ViewJobActiveListing.module.css";

const ViewJobActiveListing = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(5);

  const jobDetails = [
    { jobName: "Frontend Engineer", skills: ["Javascript", "CSS", "React", "Node.js"], date: "10-11-2025", applicationCount: 200, yearOfExp: 3 },
    { jobName: "Backend Developer", skills: ["Ruby", "Go", "PostgreSQL", "Docker"], date: "15-11-2025", applicationCount: 180, yearOfExp: 4 },
    { jobName: "Data Scientist", skills: ["Python", "SQL", "Tableau"], date: "12-10-2025", applicationCount: 220, yearOfExp: 3 },
    { jobName: "DevOps Engineer", skills: ["AWS", "Terraform", "Kubernetes", "Bash"], date: "02-12-2025", applicationCount: 150, yearOfExp: 5 },
    { jobName: "Game Developer", skills: ["Unity", "C#", "Unreal Engine"], date: "10-11-2025", applicationCount: 110, yearOfExp: 5 },
    { jobName: "Cloud Engineer", skills: ["Azure", "Docker", "Kubernetes", "Python"], date: "10-11-2025", applicationCount: 130, yearOfExp: 4 },
    { jobName: "Network Engineer", skills: ["Cisco", "Juniper", "Network Security"], date: "10-11-2025", applicationCount: 120, yearOfExp: 3 },
    { jobName: "Mobile Developer", skills: ["Flutter", "Dart", "Firebase"], date: "01-10-2025", applicationCount: 90, yearOfExp: 2 },
    { jobName: "Security Analyst", skills: ["SIEM", "Firewalls", "Threat Detection"], date: "03-09-2025", applicationCount: 160, yearOfExp: 4 },
    { jobName: "UI/UX Designer", skills: ["Figma", "Sketch", "Adobe XD"], date: "20-08-2025", applicationCount: 140, yearOfExp: 3 },
  ];

  const formatMonthYear = (month, year) =>
    new Date(year, month).toLocaleDateString("default", { month: "short", year: "numeric" });

  const groupJobsByMonthYear = (jobs) => {
    const groups = {};

    jobs.forEach((job) => {
      const [day, month, year] = job.date.split("-").map(Number);
      const key = `${year}-${month - 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(job);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, jobs]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: formatMonthYear(month, year),
          jobs,
        };
      });
  };

  const handleCardClick = (job) => {
    navigate("/ViewJobs/JobDetails", { state: { job } });
  };

  const handleFilter = () => {
    if (selectedDate) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      const filtered = jobDetails.filter((job) => {
        const [day, month, year] = job.date.split("-").map(Number);
        return month - 1 === selectedMonth && year === selectedYear;
      });
      const grouped = groupJobsByMonthYear(filtered);
      setFilteredGroups(grouped);
      setCurrentPage(1);
    }
  };

  const handleClear = () => {
    const grouped = groupJobsByMonthYear(jobDetails);
    setFilteredGroups(grouped);
    setSelectedDate(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleClear();
  }, []);

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * groupsPerPage,
    currentPage * groupsPerPage
  );

  return (
    <div className={styles.viewJobContainer}>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label>Select Month / Year</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Select Month / Year"
            className={styles.datePickerInput}
          />
        </div>

        <div className={styles.filterButtons}>
          <Button label="Filter" onClick={handleFilter} />
          <Button label="Clear" onClick={handleClear} secondary />
        </div>
      </div>

      {/* Job Groups */}
      {paginatedGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className={styles.monthLabel}>{group.label}</div>
          <div className="row">
            {group.jobs.map((job, index) => (
              <div
                className="col-lg-4"
                key={index}
                onClick={() => handleCardClick(job)}
                style={{ cursor: "pointer" }}
              >
                <HiringCard
                  jobName={job.jobName}
                  skills={job.skills}
                  date={job.date}
                  applicationCount={job.applicationCount}
                  yearOfExp={job.yearOfExp}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className={styles.paginationControls}>
        <div className={styles.perPage}>
          Show{" "}
          <select
            value={groupsPerPage}
            onChange={(e) => setGroupsPerPage(Number(e.target.value))}
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>{" "}
          group(s) per page
        </div>

        <div className={styles.pagination}>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ""}`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ""}`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJobActiveListing;
