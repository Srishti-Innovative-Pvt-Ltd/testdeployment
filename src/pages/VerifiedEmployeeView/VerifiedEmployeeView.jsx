import React, { useEffect, useState } from 'react';
import styles from './VerifiedEmployeeView.module.css';
import { Icon } from '@iconify/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import Button from '../../components/Button/Button';
import VerifiedEmployeePersonalInfo from '../VerifiedEmployeePersonalInfo/VerifiedEmployeePersonalInfo';
import VerifiedEmployeeProfessionalInfo from '../VerifiedEmployeeProfessionalInfo/VerifiedEmployeeProfessionalInfo';
import VerifiedEmployeeJobAndScheduleInfo from '../VerifiedEmployeeJobAndScheduleInfo/VerifiedEmployeeJobAndScheduleInfo';
import VerifiedEmployeeHealthInfo from '../VerifiedEmployeeHealthInfo/VerifiedEmployeeHealthInfo';
import VerifiedEmployeeDocumentsAndIdentificationInfo from '../VerifiedEmployeeDocumentsAndIdentificationInfo/VerifiedEmployeeDocumentsAndIdentificationInfo';
import VerifiedEmployeeDependentInfo from '../VerifiedEmployeeDependentInfo/VerifiedEmployeeDependentInfo';
import VerifiedEmployeeSalaryInfo from '../VerifiedEmployeeSalaryInfo/VerifiedEmployeeSalaryInfo';
import VerifiedEmployeeBackgroundVerificationInfo from '../VerifiedEmployeeBackgroundVerificationInfo/VerifiedEmployeeBackgroundVerificationInfo';
import ExitModal from '../../components/ExitModal/ExitModal';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeePersonalAndProfessionalInfo, getEmployeeJoBAndSchedule } from "../../services/addEmployeeService";
import { getUserRole } from "../../utils/roleUtils";

const VerifiedEmployeeView = () => {
  const [openTab, setOpenTab] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employeeData,setEmployeeData]=useState();
  const [jobData, setJobData] = useState(null);
  const userRole = getUserRole();

  const { id } = useParams();
  const employeeId = id;

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  const navigate = useNavigate();

  const toEdit = () => {
    navigate(`/pages/EmployeeDataSection/${employeeId}`);
  };

  const toVerifyBackground = () => {
    navigate(`/pages/BackgroundVerification`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployeePersonalAndProfessionalInfo(employeeId);
      if (response.success) {
        setEmployeeData(response.data);
      }
    };
    const fetchJobData = async () => {
      const response = await getEmployeeJoBAndSchedule(employeeId);
      if (response.success && response.data) {
        setJobData(response.data); // 👈 only set if data exists
      }
    };
    if (employeeId) {
      fetchData();
      fetchJobData();
    }
  }, [employeeId]);

  const personal = employeeData?.personalInfo;
const fullName = personal
  ? `${personal.firstName?.value || ""} ${personal.middleName?.value || ""} ${personal.lastName?.value || ""}`.trim()
  : "";


  

  return (
    <DashboardLayout>
      <Card>
        <div className="row">
          <div className="col">
            <div> <h5 className={styles.VerifiedEmpH5}>{fullName || "Employee"}'s Details</h5></div>
          </div>
          <div className="col">
            
            <div className={styles.VerifiedEmployeeViewButtonGroup}>
              {(userRole === 'admin')  && (<>
              <PrimaryButton label="Edit" onClick={toEdit} />
              <PrimaryButton
                label="Background Verification"
                onClick={toVerifyBackground}
                className="mx-2"
              />
              <Button
                label="Exit Form"
                type="button"
                className="px-4 mx-2 py-2"
                secondary
                onClick={() => setShowModal(true)}
              /></>)}
            </div>
          </div>
        </div>
        <br />

        <div className={styles.VerifiedEmployeeViewWrapper}>
          {/* Personal */}
          
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('personal')}>
            <span className={styles.VerifiedEmpLabel}>Personal</span>
            <Icon icon={openTab === 'personal' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'personal' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeePersonalInfo user_id={employeeId} />
            </div>
          )}

          {/* Professional */}
          {/* <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('professional')}>
            <span>Professional Information</span>
            <Icon icon={openTab === 'professional' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'professional' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeProfessionalInfo />
            </div>
          )} */}

           {/* Documents */}
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('documents')}>
            <span className={styles.VerifiedEmpLabel}>Documents & Identification</span>
            <Icon icon={openTab === 'documents' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'documents' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeDocumentsAndIdentificationInfo user_id={employeeId} />
            </div>
          )}


           {/* Health Info */}
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('health')}>
            <span className={styles.VerifiedEmpLabel}>Health Info</span>
            <Icon icon={openTab === 'health' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'health' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeHealthInfo user_id={employeeId} />
            </div>
          )}

            {/* Dependent */}
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('dependent')}>
            <span className={styles.VerifiedEmpLabel}>Dependent</span>
            <Icon icon={openTab === 'dependent' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'dependent' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeDependentInfo user_id={employeeId} />
            </div>
          )}

          {/* Job & Schedule */}
         {jobData && (
          <>
            <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('job')}>
              <span className={styles.VerifiedEmpLabel}>Job & Schedule</span>
              <Icon icon={openTab === 'job' ? "mdi:minus" : "mdi:plus"} />
            </div>
            {openTab === 'job' && (
              <div className={styles.VerifiedEmployeeViewContent}>
                <VerifiedEmployeeJobAndScheduleInfo user_id={employeeId} data={jobData} />
              </div>
            )}
          </>
        )}

         {/* Salary */}
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('salary')}>
            <span className={styles.VerifiedEmpLabel}>Salary</span>
            <Icon icon={openTab === 'salary' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'salary' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeSalaryInfo  user_id={employeeId} />
            </div>
          )}

          {/* Background Verification */}
          <div className={styles.VerifiedEmployeeViewTab} onClick={() => toggleTab('backgroundVerification')}>
            <span className={styles.VerifiedEmpLabel}>Background Verification</span>
            <Icon icon={openTab === 'backgroundVerification' ? "mdi:minus" : "mdi:plus"} />
          </div>
          {openTab === 'backgroundVerification' && (
            <div className={styles.VerifiedEmployeeViewContent}>
              <VerifiedEmployeeBackgroundVerificationInfo />
            </div>
          )}
        </div>
      </Card>

      {showModal && (
        <ExitModal
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            console.log("Exit form sent");
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default VerifiedEmployeeView;