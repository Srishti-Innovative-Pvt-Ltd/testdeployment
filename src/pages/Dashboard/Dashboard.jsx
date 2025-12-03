import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import styles from "./Dashboard.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import img from "../../assets/images/test.jpeg";
import noLeave from "../../assets/images/noLeave.png";
import EmployeeDistributionChart from "../../components/EmployeeDistributionChart/EmployeeDistributionChart";

const employeeDistributionData = [
  { name: "Engineering", value: 17 },
  { name: "Human Resources", value: 3 },
  { name: "Client Services", value: 6 },
  { name: "Unassigned", value: 80 }, 
  
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <Card title="Time at Work" icon="mdi:clock">
              <div className="d-flex align-items-center">
                <div className={styles.cardImageContainer}>
                  <img src={img} alt="Image" />
                </div>
                <div className={styles.card1Title}>
                  <p className="fw-bold">Punched out</p>
                  <p className={styles.cardSubTitle}>
                    Punched out : Mar 29th at 01:19 PM (GMT 7)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-2 ">
            <Card title="My Actions" icon="mdi:clock">
              <div className="d-flex align-items-center mb-2">
                <div className={styles.actionIconContainer1}>
                  <Icon icon="game-icons:inner-self" />
                </div>
                <div className={styles.card1Title}>
                  <p> (1) Pending Self Review</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className={styles.actionIconContainer2}>
                  <Icon icon="clarity:users-solid" />
                </div>
                <div className={styles.card1Title}>
                  <p> (1) Candidate to Interview</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <Card title="Quick Launch" icon="mdi:flash">
              <div className="row">
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="bi:person-check" />
                  </div>
                  <p>Assign Leave</p>
                </div>
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="fa6-solid:clipboard-list" />
                  </div>
                  <p>Leave List</p>
                </div>
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="fluent:document-bullet-list-clock-24-filled" />
                  </div>
                  <p>Timesheets</p>
                </div>
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="bi:person-fill-up" />
                  </div>
                  <p>Apply Leave</p>
                </div>
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="fluent:person-star-16-filled" />
                  </div>
                  <p>My Leave</p>
                </div>
                <div className="col-4 mb-2">
                  <div className={styles.launchContainer}>
                    <Icon icon="fluent:person-clock-16-filled" />
                  </div>
                  <p>My Timesheet</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <Card title="Buzz Latest Posts" icon="tabler:camera-filled">
              <div className={styles.buzzScrollContainer}>
                <div className={styles.buzzContainer}>
                  <div className="d-flex align-items-center">
                    <div className={styles.cardImageContainer}>
                      <img src={img} alt="Image" />
                    </div>
                    <div className={styles.card1Title}>
                      <p className="fw-bold">User 1</p>
                      <p className={styles.cardSubTitle}>
                        2025-19-05 04 :06 PM
                      </p>
                    </div>
                  </div>
                  <hr />
                  <p>Hi All...</p>
                </div>
                <div className={styles.buzzContainer}>
                  <div className="d-flex align-items-center">
                    <div className={styles.cardImageContainer}>
                      <img src={img} alt="Image" />
                    </div>
                    <div className={styles.card1Title}>
                      <p className="fw-bold">User 1</p>
                      <p className={styles.cardSubTitle}>
                        2025-19-05 04 :06 PM
                      </p>
                    </div>
                  </div>
                  <hr />
                  <p>Hi All...</p>
                </div>
                <div className={styles.buzzContainer}>
                  <div className="d-flex align-items-center">
                    <div className={styles.cardImageContainer}>
                      <img src={img} alt="Image" />
                    </div>
                    <div className={styles.card1Title}>
                      <p className="fw-bold">User 1</p>
                      <p className={styles.cardSubTitle}>
                        2025-19-05 04 :06 PM
                      </p>
                    </div>
                  </div>
                  <hr />
                  <p>Hi All...</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 ">
            <Card
              title="Employees on Leave Today"
              icon="pepicons-pop:leave-circle-filled"
            >
              <div className={styles.leaveCard}>
                <img src={noLeave} alt="No Leaves" />
              </div>
              <p className="text-center mt-4">
                No Employees are on Leave Today
              </p>
            </Card>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <Card
              title="Employee Distribution by Sub Unit"
              icon="mdi:graph-pie"
            >
              <EmployeeDistributionChart data={employeeDistributionData} />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
