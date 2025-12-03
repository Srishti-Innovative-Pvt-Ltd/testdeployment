import React from "react";
import styles from "./PerformanceAction.module.css";
import EarningsChart from "../../components/EarningsChart/EarningsChart";
import ComparisonStats from "../../components/ComparisonStats/ComparisonStats";
import KpiEmpAssesmentTable from "../../components/KpiEmpAssesmentTable/KpiEmpAssesmentTable";
import DashboardLayout from '../../layouts/DashboardLayout';

function PerformanceAction() {
  return (
    <DashboardLayout>
      <div className={styles.chartStatsWrapper}>
        <div className={styles.chartWrapper}>
          <EarningsChart />
        </div>
        <div className={styles.statsWrapper}>
          <ComparisonStats />
        </div>
      </div>

      {/* Table Below Charts */}
      <div className={styles.tableWrapper}>
        <KpiEmpAssesmentTable />
      </div>
    </DashboardLayout>
  );
}

export default PerformanceAction;
