import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import nameLogo from "../../assets/images/logoTitle_main.png";
import logo from "../../assets/images/logo_main.png";
import search from "../../assets/images/search.png";
import dashboard from "../../assets/images/dashboard.png";
import employees from "../../assets/images/employees.png";
import hiring from "../../assets/images/hiring.png";
import attendance from "../../assets/images/attendance.png";
import leave from "../../assets/images/leave.png";
import payroll from "../../assets/images/payroll.png";
import rolemanagement from "../../assets/images/rolemanagement.png";
import hrpolicy from "../../assets/images/hrpolicy.png";
import kpimanagement from "../../assets/images/kpimanagement.png";
import settings from "../../assets/images/settings.png";
import pim from "../../assets/images/pim.png";
import induction from "../../assets/images/Induction.png"
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserId, getUserRole, getVerificationStatus } from "../../utils/roleUtils";
import { checkReportingPerson } from "../../services/addEmployeeService";
import { useNavigate, useLocation } from "react-router-dom";
import ChangePassword from "../../pages/ChangePassword/ChangePassword";
import reimbursement from "../../assets/images/reimbursement.png"

const Sidebar = ({ isCollapsed, setIsCollapsed, setHeaderTitle }) => {
  const user_id = getUserId();
  const role = getUserRole();
  const verificationStatus = getVerificationStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isReportingPerson, setHasReportingPerson] = useState(false);

  useEffect(() => {
    const fetchReportingStatus = async () => {
      if (role !== "admin") {
        try {
          const res = await checkReportingPerson(user_id);
          setHasReportingPerson(res?.isReportingPerson === true);
        } catch (err) {
          console.error("Error fetching reporting person:", err);
          setHasReportingPerson(false);
        }
      } else {
        // admin always sees Leave Requests
        setHasReportingPerson(true);
      }
    };
    fetchReportingStatus();
  }, [role, user_id]);

  const menu = [
    { label: "Dashboard", icon: dashboard, path: "/dashboard", roles: ["admin", "hr", "employee", "manager"] },
    {
      label: "Employees",
      icon: employees,
      roles: ["admin"],
      children: [
        { label: "Add Employee", path: "/pages/AddEmployee" },
        { label: "Employee Data", path: "/pages/EmployeeData" },
        { label: "View Employees", path: "/pages/ViewEmployees" },
      ],
    },
    ...(isReportingPerson
      ? [
        {
          label: "My Team",
          icon: employees,
          path: "/employees/myTeam",
          roles: ["employee", "hr", "manager"],
        },
      ]
      : []),

    // {
    //   label: "Hiring",
    //   icon: hiring,
    //   roles: ["admin"],
    //   children: [
    //     { label: "Post Job Openings", path: "/hiring/postJobOpening" },
    //     { label: "View Jobs", path: "/hiring/viewJobs" },
    //     { label: "Interviews", path: "/hiring/interviews" },
    //     { label: "Onboarding", path: "/hiring/onboarding" },
    //   ],
    // },
    // {
    //   label: "Attendance",
    //   icon: attendance,
    //   roles: ["admin", "hr", "employee", "manager"],
    //   children: [
    //     { label: "Add Office", path: "/pages/AddOffice", roles: ["admin"] },
    //     { label: "Manage Employees Punch", path: "/pages/ManageEmployeesPunch", roles: ["admin"] },
    //     { label: "Attendance Upload", path: "/pages/AttendanceExcelUpload", roles: ["admin"] },
    //     { label: "Employee Punchlogs", path: "/pages/EmployeePunchlogs", roles: ["admin"] },
    //     { label: "All Employee MonthlyReport", path: "/pages/AllEmployeeAttendanceReport", roles: ["admin"] },
    //     { label: "Manage Employee OffDays", path: "/pages/ManageEmployeeOffDays", roles: ["admin"] },
    //     { label: "Update Monthly OffDays", path: "/attendance/UpdateMonthlyOffDays", roles: ["hr", "employee", "manager"] },
    //     { label: "Monthly Detailed Report", path: "/pages/MonthlyDetailedReport", roles: ["hr", "employee", "manager"] },

    //   ],
    // },
    {
      label: "Leave",
      icon: leave,
      roles: ["employee", "hr", "admin", "manager"],
      children: [
        { label: "Apply Leave", path: `/Leaves/ApplyLeave/${user_id}`, roles: ["hr", "manager", "employee"] },
        { label: "Leave History", path: `/Leaves/LeaveHistory/${user_id}`, roles: ["hr", "manager", "employee"] },

        ...(isReportingPerson
          ? [{ label: "Leave Requests", path: "/Leaves/LeaveRequests", roles: ["admin", "hr", "manager", "employee"] }]
          : []),
      ],
    },

    {
      label: "Payroll",
      icon: payroll,
      roles: ["admin"],
      children: [
        { label: "Monthly Payroll", path: "/payroll/MonthlyPayroll" },
        { label: "Salary Payroll", path: "/payroll/SalaryPayroll", roles: ["admin"] },
      ],
    },
    {
      label: "Reimbursement",
      icon: reimbursement,
      roles: [ "admin","hr", "employee", "manager"],
      children: [
        { label: "Reimbursement", path: "/pages/Reimbursement" , roles: [ "hr", "employee", "manager"]},
        { label: "Manage Reimbursement", path: "/Reimbursement/ManageReimbursement" , roles: ["admin","hr"]},
      ]
    },
    
    // { label: "Role Management", icon: rolemanagement, path: "/rolemanagement", roles: ["admin"] },
    // { label: "HR Policy", icon: hrpolicy, path: "/hrpolicy", roles: ["admin"] },
    // {
    //   label: "KPI Management",
    //   icon: kpimanagement,
    //   roles: ["admin"],
    //   children: [
    //     { label: "Performance", path: "/KpiManagement/Performance" },
    //     { label: "Settings", path: "/settings/KpiSettings" },
    //   ],
    // },
    
    // {
    //   label: "Induction",
    //   icon: induction,
    //   roles: ["admin"],
    //   children: [
    //     { label: "Track Progress", path: "/pages/InductionTrackProgress" },
    //     { label: "Settings", path: "/pages/InductionSettings" },
    //   ]
    // },
  
    {
      label: "Settings",
      icon: settings,
      roles: ["admin"],
      children: [
        { label: "Company Settings", path: "/pages/CompanySettings", roles: ["admin"] },
        { label: "Employee Settings", path: "/pages/EmployeeSettings", roles: ["admin"] },
        { label: "Leave Settings", path: "/pages/LeaveSettings", roles: ["admin"] },
        // { label: "Attendance Settings", path: "", roles: ["admin"] },
        { label: "Reimbursement", path: "/settings/ReimbursementSettings", roles: ["admin"] },
        { label: "Forms", path: "/Settings/Forms", roles: ["admin"] },
        // { label: "Change Password", isModal: true, roles: ["admin"] },

      ],
    },
    {
      label: "Account",
      icon: settings,
      roles: [ "hr", "employee", "manager"],
      children: [
        { label: "View Profile", path: `/pages/VerifiedEmployeeView/${user_id}`, roles: ["hr", "employee", "manager"] },
        // { label: "Change Password", isModal: true, roles: ["hr", "employee", "manager"] },

      ],
    },
  ];



  let filteredMenu = menu.filter((item) => item.roles.includes(role));

  // Restrict employee if verification is not completed
  if (role !== "admin" && verificationStatus !== "completed") {
    filteredMenu = []; // hide all menus for employee
  }

  const handleClick = (item) => {
    setHeaderTitle(item.label);
    if (item.children) {
      if (isCollapsed) {
        setIsCollapsed(false);
        setTimeout(() => setOpenSubmenu(item.label), 300);
      } else {
        setOpenSubmenu(openSubmenu === item.label ? null : item.label);
      }
    } else {
      if (item.label === "Change Password") {
        setShowChangePassword(true);
        return;
      }


      if (item.path) {
        navigate(item.path);
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    }
  };

  useEffect(() => {
    if (isCollapsed) {
      setOpenSubmenu(null);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const currentPath = location.pathname;

    // Special case for Leave Requests
    if (currentPath.startsWith("/Leaves/LeaveRequests")) {
      setHeaderTitle("Leave");
      setOpenSubmenu("Leave");
      return;
    }
    // Special case for My Team
    if (currentPath.startsWith("/employees/myTeam")) {
      setHeaderTitle("My Team");
      setOpenSubmenu("My Team");
      return;
    }
    for (const item of filteredMenu) {
      if (item.children) {
        const matchedChild = item.children.find((child) => child.path === currentPath);
        if (matchedChild) {
          setOpenSubmenu(item.label);
          setHeaderTitle(item.label); // Only main menu title
          break;
        }
      } else if (item.path === currentPath) {
        setHeaderTitle(item.label);
        break;
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Icon
        icon="material-symbols:menu-rounded"
        className={styles.menuToggle}
        onClick={() => setIsOpen(!isOpen)}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.mobileVisible : styles.mobileHidden} ${isCollapsed ? styles.collapsed : ""}`}>
        <div className={styles.logo}>
          {isCollapsed ? <img src={logo} alt="Logo" /> : <img src={nameLogo} alt="Logo" />}
        </div>

        <ul className={styles.sidebarToggleList}>
          <li className={styles.serachBar}>
            <img src={search} alt="" />
            <span className="mx-2">Search</span>
          </li>
          <li className={styles.sidebarToggleListIcon} onClick={() => setIsCollapsed(!isCollapsed)}>
            <Icon icon={isCollapsed ? "fe:arrow-right" : "fe:arrow-left"} />
          </li>
        </ul>
        <hr className="m-0" />

        <div className={styles.scrollableMenu}>
          <ul className={styles.sidebarList}>
            {role !== "admin" && verificationStatus !== "completed" && (
              <div
                className={`${styles.updateCard} ${isCollapsed ? styles.collapsedCard : ""}`}
                onClick={() => navigate(`/pages/EmployeeDataSection/${user_id}`)}
              >
                <div className={styles.alertIcon}>
                  <Icon icon="material-symbols:warning-outline-rounded" />
                </div>
                {!isCollapsed && (
                  <div className={styles.updateText}>
                    Update Personal Info
                    <Icon icon="ic:round-arrow-forward-ios" />
                  </div>
                )}
              </div>
            )}

            {filteredMenu.map((item) => {
              const isParentActive = item.children
                ? item.children.some((child) =>
                  child.isModal ? showChangePassword : location.pathname === child.path
                )
                : location.pathname === item.path;

              return (
                <React.Fragment key={item.label}>
                  <li
                    onClick={() => handleClick(item)}
                    className={`mt-3 d-flex align-items-center ${isParentActive ? styles.activeParentItem : ""}`}
                  >
                    <img src={item.icon} alt="" />
                    <span className="mx-2">{item.label}</span>
                    {item.children && !isCollapsed && (
                      <Icon
                        icon={openSubmenu === item.label ? "mdi:minus" : "mdi:plus"}
                        className="ms-auto"
                      />
                    )}
                  </li>

                  {item.children && openSubmenu === item.label && (
                    <ul className="ps-4 mt-2">
                      {item.children.filter((child) => !child.roles || child.roles.includes(role)).map((child) => {
                        const isChangePassword = child.label === "Change Password" && child.isModal;
                        const isActive = isChangePassword
                          ? showChangePassword
                          : location.pathname === child.path;

                        return (
                          <li
                            key={child.label}
                            onClick={() => {
                              setHeaderTitle(item.label);
                              if (child.label === "Change Password") {
                                setShowChangePassword(true);
                              } else if (child.label === "Logout") {
                                localStorage.removeItem("isAuthenticated");
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                localStorage.removeItem("user_id");
                                localStorage.removeItem("verificationStatus");
                                navigate("/", { replace: true });
                              } else if (child.path) {
                                navigate(child.path);
                              }
                            }}

                            className={`${styles.submenuItem} ${isActive ? styles.activeSubmenuItem : ""}`}
                          >
                            {isActive && <span className={styles.activeDot} />}
                            {child.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </aside>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Sidebar;
