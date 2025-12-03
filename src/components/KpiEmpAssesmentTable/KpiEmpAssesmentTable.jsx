import React, { useState } from "react";
import styles from "./KpiEmpAssesmentTable.module.css";
import Card from "../Card/Card";
import Table from "../Table/Table";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import KpiEmpAssesmentEditModal from "../../components/KpiEmpAssesmentEditModal/KpiEmpAssesmentEditModal";

function KpiEmpAssesmentTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);


  const columns = [
    {
      header: "KPI",
      accessor: "kpi",
    },
    {
      header: "Target",
      accessor: "target",
    },
    {
      header: "Achieved",
      accessor: "achieved",
    },
    {
      header: "Score (%)",
      render: (row) => `${Math.round((row.achieved / row.target) * 100)}%`,
    },
  ];

  const data = [
    { kpi: "Calls", target: 100, achieved: 75 },
    { kpi: "Meetings", target: 80, achieved: 50 },
    { kpi: "Deals Closed", target: 30, achieved: 18 },
    { kpi: "Follow-ups", target: 50, achieved: 25 },
    { kpi: "New Leads", target: 70, achieved: 70 },
    { kpi: "Retention Rate", target: 90, achieved: 85 },
  ];

  return (
    <div className={styles.kpiTableContainer}>
      <Card title="KPI Assessment" icon="mdi:chart-line">
        <div className={styles.kpiTableActions}>
          <PrimaryButton label="Edit" onClick={() => setShowModal(true)} />
        </div>

        <div className={styles.kpiTableScroll}>
          <Table
            columns={columns}
            data={data}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className={styles.kpiTableActions}>
        </div>
      </Card>
      {showModal && <KpiEmpAssesmentEditModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default KpiEmpAssesmentTable;
