import { useLocation } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import SubHeader from "../components/SubHeader/SubHeader";
import { useState } from "react";


const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
 

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} setHeaderTitle={setHeaderTitle}/>
      <div className={styles.dashboardLayoutHeader}>
        <div>
          <Header title={headerTitle} isCollapsed={isCollapsed} />
          <SubHeader  isCollapsed={isCollapsed} />
          <main
            className={`${styles.dashboardLayoutChildren} ${
              isCollapsed ? styles.collapsed : ""
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
