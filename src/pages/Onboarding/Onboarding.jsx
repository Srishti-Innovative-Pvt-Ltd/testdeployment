import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Table from "../../components/Table/Table";
import CandidateSelectionModal from "../../components/CandidateSelectionModal/CandidateSelectionModal";
import style from './Onboarding.module.css';

const Onboarding = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();

  const [EmployeeDataTablePage, setEmployeeDataTablePage] = useState([
    { fullName: "Priya . S", department: "HR", email: "Priya@gmail.com", contact: "1234567890" },
    { fullName: "Rahul Ravi", department: "UI/UX", email: "Rahul@gmail.com", contact: "1234567890" },
    { fullName: "Pravin . A. V", department: "Sales", email: "Pravin@gmail.com", contact: "1234567890" },

  ]);

  const filteredEmployees = EmployeeDataTablePage.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = () => {
    setShowModal(false);
    navigate("/pages/BackgroundVerification");
  };

  const handleEnroll = () => {
    setShowModal(false);
    navigate("/pages/AddEmployee");
  };

  const handleIconClick = (row) => {
    setSelectedCandidate(row);
    setShowModal(true);
  };

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Department", accessor: "department" },
    { header: "Email ID", accessor: "email" },
    { header: "Phone Number", accessor: "contact" },
    {
      header: "Action",
      render: (row) => (
        <div>
          <Icon
            icon="solar:box-linear"
            width={25}
            color="#1B84FF"
            style={{ cursor: "pointer" }}
            onClick={() => handleIconClick(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card none>
        <div className="d-flex justify-content-between mb-3">
          <h3>Onboarding</h3>
          <div className={style.OnboardingPageSearch}>
            <Icon icon="mdi:magnify" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredEmployees}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>

      {showModal && (
        <CandidateSelectionModal
          onClose={() => setShowModal(false)}
          onVerify={handleVerify}
          onEnroll={handleEnroll}
          candidate={selectedCandidate}
        />
      )}
    </DashboardLayout>
  );
};

export default Onboarding;
