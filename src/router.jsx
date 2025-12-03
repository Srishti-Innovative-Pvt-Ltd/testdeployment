import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "remixicon/fonts/remixicon.css";
import Admin from "./pages/Admin/Admin";
import "./styles/variables.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Pim from "./pages/Pim/Pim";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import NotFound from "./pages/NotFound/NotFound";
import SearchedEmployeeDeatails from "./pages/SearchedEmployeeDeatails/SearchedEmployeeDeatails";
import AttendanceExcelUpload from "./pages/AttendanceExcelUpload/AttendanceExcelUpload";
import EmployeeDataSection from "./pages/EmployeeDataSection/EmployeeDataSection";
import NotAuthorized from "./pages/NotAuthorized/NotAuthorized";
import EmployeeSettings from "./pages/EmployeeSettings/EmployeeSettings";
import CompanySettings from "./pages/CompanySettings/CompanySettings";
import ManageEmployeesPunch from './pages/ManageEmployeesPunch/ManageEmployeesPunch';
import AddOffice from './pages/AddOffice/AddOffice';
import EmployeePunchlogs from './pages/EmployeePunchlogs/EmployeePunchlogs';
import DetailedReport from "./pages/DetailedReport/DetailedReport";
import AllEmployeeAttendanceReport from "./pages/AllEmployeeAttendanceReport/AllEmployeeAttendanceReport";
import ViewEmployees from "./pages/ViewEmployees/ViewEmployees";
import EmployeeDataTablePage from "./pages/EmployeeDataTablePage/EmployeeDataTablePage";
import HRpolicies from "./pages/HRPolicies/HRpolicies";
import ManageEmployeeOffDays from "./pages/ManageEmployeeOffDays/ManageEmployeeOffDays";
import PostJobOpening from "./pages/PostJobOpening/PostJobOpening";
import ViewJobs from "./pages/ViewJobs/ViewJobs";
import Onboarding from "./pages/Onboarding/Onboarding";
import LeaveSettings from "./pages/LeaveSettings/LeaveSettings";
import Performance from "./pages/Performance/Performance";
import WorKReport from "./pages/WorKReport/WorKReport";
import ManageReports from "./pages/ManageReports/ManageReports";
import WorkReportMoreInfo from "./pages/WorkReportMoreInfo/WorkReportMoreInfo";
import Forms from "./pages/Forms/Forms";
import CustomFormBuilder from "./pages/CustomFormBuilder/CustomFormBuilder";
import JobDetails from "./pages/JobDetails/JobDetails";
import ViewApplications from "./pages/ViewApplications/ViewApplications";
import Interviews from "./pages/Interviews/Interviews";
import AppRejEmployeeData from "./pages/AppRejEmployeeData/AppRejEmployeeData";
import ScheduleInterviewsRounds from "./pages/ScheduleInterviewsRounds/ScheduleInterviewsRounds";
import VerifiedEmployeeView from "./pages/VerifiedEmployeeView/VerifiedEmployeeView";
import BackgroundVerification from "./pages/BackgroundVerification/BackgroundVerification";
import PerformanceAction from "./pages/PerformanceAction/PerformanceAction";
import KpiSettings from "./pages/KpiSettings/KpiSettings";
import InductionTrackProgress from "./pages/InductionTrackProgress/InductionTrackProgress";
import InductionSettings from "./pages/InductionSettings/InductionSettings";
import InductionNewAddDetails from "./pages/InductionNewAddDetails/InductionNewAddDetails";
import InductionVideoPage from "./pages/InductionVideoPage/InductionVideoPage";
import EmpJobAndSalarySection from "./pages/EmpJobAndSalarySection/EmpJobAndSalarySection";
import VerificationProgressDashboard from "./pages/VerificationProgressDashboard/VerificationProgressDashboard";
import UpdateMonthlyOffDays from "./pages/UpdateMonthlyOffDays/UpdateMonthlyOffDays";
import MonthlyDetailedReport from "./pages/MonthlyDetailedReport/MonthlyDetailedReport";
import LeaveHistory from "./pages/LeaveHistory/LeaveHistory";
import ApplyLeave from "./pages/ApplyLeave/ApplyLeave";
import AdminLeaveSection from "./pages/AdminLeaveSection/AdminLeaveSection";
import MyTeam from "./pages/MyTeam/MyTeam";
import ReimbursementHistory from "./pages/ReimbursementHistory/ReimbursementHistory";
import Reimbursement from "./pages/Reimbursement/Reimbursement";
import ReimbursementSettings from "./pages/ReimbursementSettings/ReimbursementSettings";
import ManageReimbursement from "./pages/ManageReimbursement/ManageReimbursement";
import SalaryPayroll from "./pages/SalaryPayroll/SalaryPayroll";
import MonthlyPayroll from "./pages/MonthlyPayroll/MonthlyPayroll";

const AppRoutes = () => (
  <BrowserRouter >
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["super_admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim"
        element={
          <ProtectedRoute>
            <Pim />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/searchedEmployeeDetails"
        element={
          <ProtectedRoute roles={["super_admin"]}>
            <SearchedEmployeeDeatails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/AttendanceExcelUpload"
        element={
          <ProtectedRoute>
            <AttendanceExcelUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/DetailedReport"
        element={
          <ProtectedRoute>
            <DetailedReport />
          </ProtectedRoute>} />


      <Route
        path="/pages/AllEmployeeAttendanceReport"
        element={
          <ProtectedRoute>
            <AllEmployeeAttendanceReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/AddEmployee"
        element={
          <ProtectedRoute>
            <AddEmployee />

          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/EmployeeDataSection/:id"
        element={
          <ProtectedRoute>
            <EmployeeDataSection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/ViewEmployees"
        element={
          <ProtectedRoute>
            <ViewEmployees />

          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/EmployeeData/"
        element={
          <ProtectedRoute>
            <EmployeeDataTablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/EmployeeSettings"
        element={
          <ProtectedRoute>
            <EmployeeSettings />

          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/CompanySettings"
        element={
          <ProtectedRoute>
            <CompanySettings />

          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/ManageEmployeesPunch"
        element={
          <ProtectedRoute>
            <ManageEmployeesPunch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/AllEmployeeAttendanceReport"
        element={
          <ProtectedRoute>
            <AllEmployeeAttendanceReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/LeaveSettings"
        element={
          <ProtectedRoute>
            <LeaveSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/AddOffice"
        element={
          <ProtectedRoute>
            <AddOffice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hrpolicy"
        element={
          <ProtectedRoute>
            <HRpolicies />
          </ProtectedRoute>

        } />
      <Route
        path="/pages/EmployeePunchlogs"
        element={
          <ProtectedRoute>
            <EmployeePunchlogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/ManageEmployeeOffDays"
        element={
          <ProtectedRoute>
            <ManageEmployeeOffDays />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring/postJobOpening"
        element={
          <ProtectedRoute>
            <PostJobOpening />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring/viewJobs"
        element={
          <ProtectedRoute>
            <ViewJobs title={'View Jobs'} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring/interviews"
        element={
          <ProtectedRoute>
            <Interviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hiring/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/AppRejEmployeeData/:id"
        element={
          <ProtectedRoute>
            <AppRejEmployeeData />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages/VerifiedEmployeeView/:id"
        element={
          <ProtectedRoute>
            <VerifiedEmployeeView />

          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/BackgroundVerification"
        element={
          <ProtectedRoute>
            <BackgroundVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/KpiManagement/Performance"
        element={
          <ProtectedRoute>
            <Performance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Performance/PerformanceAction"
        element={
          <ProtectedRoute>
            <PerformanceAction />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/KpiSettings"
        element={
          <ProtectedRoute>
            <KpiSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/pages/InductionTrackProgress"
        element={
          <ProtectedRoute>
            <InductionTrackProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/InductionSettings"
        element={
          <ProtectedRoute>
            <InductionSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/InductionNewAddDetails"
        element={
          <ProtectedRoute>
            <InductionNewAddDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/InductionVideoPage"
        element={
          <ProtectedRoute>
            <InductionVideoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/WorKReport/AddReport"
        element={
          <ProtectedRoute>
            <WorKReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/WorKReport/ManageReports"
        element={
          <ProtectedRoute>
            <ManageReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ManageReports/WorkReportMoreInfo"
        element={
          <ProtectedRoute>
            <WorkReportMoreInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Settings/Forms"
        element={
          <ProtectedRoute>
            <Forms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/CustomFormBuilder"
        element={
          <ProtectedRoute>
            <CustomFormBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ViewJobs/JobDetails"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Hiring/ViewApplications"
        element={
          <ProtectedRoute>
            <ViewApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Interviews/ScheduleInterviewsRounds"
        element={
          <ProtectedRoute>
            <ScheduleInterviewsRounds />
          </ProtectedRoute>
        }
      />
      <Route
        path="/EmployeeData/EmpJobAndSalarySection/:id/:companyId"
        element={
          <ProtectedRoute>
            <EmpJobAndSalarySection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/VerificationProgressDashboard"
        element={
          <ProtectedRoute>
            <VerificationProgressDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance/UpdateMonthlyOffDays"
        element={
          <ProtectedRoute>
            <UpdateMonthlyOffDays />
          </ProtectedRoute>} />
      <Route
        path="/pages/MonthlyDetailedReport"
        element={
          <ProtectedRoute>
            <MonthlyDetailedReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Leaves/LeaveHistory/:id"
        element={
          <ProtectedRoute>
            <LeaveHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Leaves/ApplyLeave/:id"
        element={
          <ProtectedRoute>
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Leaves/LeaveRequests"
        element={
          <ProtectedRoute>
            <AdminLeaveSection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/ReimbursementSettings"
        element={
          <ProtectedRoute>
            <ReimbursementSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/employees/myTeam" 
      element={<ProtectedRoute>
        <MyTeam />
      </ProtectedRoute>
    } 
    />
    <Route
        path="/pages/Reimbursement"
        element={
          <ProtectedRoute>
            <Reimbursement/>
          </ProtectedRoute>
        }
      />
    <Route
        path="/pages/ReimbursementHistory"
        element={
          <ProtectedRoute>
            <ReimbursementHistory/>
          </ProtectedRoute>
        }
      />
    <Route
        path="/Reimbursement/ManageReimbursement"
        element={
          <ProtectedRoute>
            <ManageReimbursement/>
          </ProtectedRoute>
        }
      />
    <Route
        path="/payroll/SalaryPayroll"
        element={
          <ProtectedRoute>
            <SalaryPayroll/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll/MonthlyPayroll"
        element={
          <ProtectedRoute>
            <MonthlyPayroll/>
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<NotFound />} />
      {/* <Route path="/not-authorized" element={<NotAuthorized />} /> */}
    </Routes>
  </BrowserRouter>

);

export default AppRoutes;
