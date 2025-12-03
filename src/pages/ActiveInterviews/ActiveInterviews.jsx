import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HiringCard from "../../components/HiringCard/HiringCard";
import Button from "../../components/Button/Button";
import styles from "./ActiveInterviews.module.css";

const ActiveInterviews = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(5);

  const interviewData = [
    { jobName: "React Developer", skills: ["React", "JSX", "Hooks"], date: "10-11-2025", applicationCount: 45, yearOfExp: 2 },
    { jobName: "Node.js Engineer", skills: ["Node.js", "Express"], date: "15-11-2025", applicationCount: 35, yearOfExp: 3 },
    { jobName: "Data Analyst", skills: ["Excel", "PowerBI"], date: "10-10-2025", applicationCount: 50, yearOfExp: 2 },
    { jobName: "ML Engineer", skills: ["Python", "Pandas"], date: "02-12-2025", applicationCount: 40, yearOfExp: 3 },
    { jobName: "Tester", skills: ["Selenium", "JMeter"], date: "10-11-2025", applicationCount: 20, yearOfExp: 2 },
  ];

  const formatMonthYear = (month, year) =>
    new Date(year, month).toLocaleDateString("default", { month: "short", year: "numeric" });

  const groupByMonthYear = (data) => {
    const groups = {};

    data.forEach((item) => {
      const [day, month, year] = item.date.split("-").map(Number);
      const key = `${year}-${month - 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, items]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: formatMonthYear(month, year),
          jobs: items,
        };
      });
  };

  const handleFilter = () => {
    if (selectedDate) {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      const filtered = interviewData.filter((item) => {
        const [day, m, y] = item.date.split("-").map(Number);
        return m - 1 === month && y === year;
      });
      setFilteredGroups(groupByMonthYear(filtered));
      setCurrentPage(1);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setFilteredGroups(groupByMonthYear(interviewData));
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

  const handleCardClick = (job) => {
    navigate("/Interviews/ScheduleInterviewsRounds", { state: { job } });
  };

  return (
    <div className={styles.activeInterviewContainer}>
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

      {paginatedGroups.map((group, i) => (
        <div key={i}>
          <div className={styles.monthLabel}>{group.label}</div>
          <div className="row">
            {group.jobs.map((job, idx) => (
              <div
                key={idx}
                className="col-lg-4"
                onClick={() => handleCardClick(job)}
                style={{ cursor: "pointer" }}
              >
                <HiringCard {...job} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.paginationControls}>
        <div className={styles.perPage}>
          Show{" "}
          <select value={groupsPerPage} onChange={(e) => setGroupsPerPage(+e.target.value)}>
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>{" "}
          group(s) per page
        </div>
        <div className={styles.pagination}>
          <span>{currentPage} of {totalPages}</span>
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

export default ActiveInterviews;
