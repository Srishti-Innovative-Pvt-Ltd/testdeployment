import React, { useState } from 'react';
import styles from './AllEmployeeAttendanceReportTable.module.css';
import Table from '../Table/Table';
import { Icon } from '@iconify/react';
import NotUpdatedOffDayModal from '../../components/NotUpdatedOffDayModal/NotUpdatedOffDayModal'
import UpdatedOffDayModal from '../../components/UpdatedOffDayModal/UpdatedOffDayModal';
import MissingHoursModal from '../../components/MissingHoursModal/MissingHoursModal';


function AllEmployeeAttendanceReportTable({ data, currentPage, onPageChange, actions }) {
  const [showOffdayModal, setShowNotUpdatedModal] = useState(false);
    const [showUpdatedModal, setShowUpdatedModal] = useState(false);
    const [showMissingHoursModal, setShowMissingHoursModal] = useState(false);

  
  const rowsPerPage = 10;

  const modifiedData = data.map((item) => ({
    ...item,
    noPunchDays: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{item.noPunchDays}</span>
        <Icon icon="mdi:close-circle-outline" color="red" style={{ fontSize: '1.4rem', cursor: 'pointer' }}   onClick={() => setShowNotUpdatedModal(true)}/>
        <Icon icon="mdi:check-circle-outline" color="green" style={{ fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setShowUpdatedModal(true)}/>
      </div>
    ),
    missingHours: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{item.missingHours}</span>
        <Icon icon="mdi:eye-outline" color="#007bff" style={{ fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setShowMissingHoursModal(true)}/>
      </div>
    )
  }));


  const columns = [
    { header: "Personnel No", accessor: "personnelNo" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Reporting Person", accessor: "reportingPerson" },
    { header: "Employee Type", accessor: "employeeType" },
    { header: "Total Working Days", accessor: "totalWorkingDays" },
    { header: "No Punch Days", accessor: "noPunchDays" },
    { header: "Missing Hours", accessor: "missingHours" },
    { header: "LOP Due to Late Coming", accessor: "lopLateComing" },
    { header: "LOP Due to Leave", accessor: "lopLeave" },
  ];

  return (
    <div className={styles.tableContainer}>
      <Table
        className={styles.responsiveTable}
        columns={columns}
        data={modifiedData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        actions={actions}
        actionClassName={styles.actionColumn}
      />
      
        {showOffdayModal && (
  <NotUpdatedOffDayModal
    onClose={() => setShowNotUpdatedModal(false)}
    offDays={[
      '01-02-2025',
      '02-02-2025',
      '08-02-2025',
      '09-02-2025',
      '16-02-2025',
      '22-02-2025',
      '23-02-2025',
      '28-02-2025'
    ]}
  />
)}

{showUpdatedModal && (
  <UpdatedOffDayModal
    onClose={() => setShowUpdatedModal(false)}
    offDays={[
      { date: '01-06-2025', type: 'Work from Home', duration: 'Full day', status: 'Approved' },
      { date: '07-06-2025', type: 'Off Day', duration: 'Full day', status: 'Approved' },
      { date: '08-06-2025', type: 'Work from Home', duration: 'Full day', status: 'Approved' },
      { date: '14-06-2025', type: 'Off Day', duration: 'Full day', status: 'Approved' },
      { date: '15-06-2025', type: 'Work from Home', duration: 'Full day', status: 'Approved' },
      { date: '21-06-2025', type: 'Off Day', duration: 'Full day', status: 'Approved' },
      { date: '22-06-2025', type: 'Work from Home', duration: 'Full day', status: 'Pending' },
      { date: '23-06-2025', type: 'Extra Hours', duration: 'Full day', status: 'Rejected' },
      { date: '28-06-2025', type: 'Extra Hours', duration: 'Full day', status: 'Approved' },
    ]}
  />
)}

{showMissingHoursModal && (
  <MissingHoursModal
    onClose={() => setShowMissingHoursModal(false)}
    breakdown={[
      { date: '03-06-2025', punchIn: '9:38 AM', punchOut: '7:50 PM', workHours: '06:28 hrs', breakHours: '03:44 hrs' },
      { date: '06-06-2025', punchIn: '9:22 AM', punchOut: '5:56 PM', workHours: '03:09 hrs', breakHours: '05:25 hrs' },
      { date: '09-06-2025', punchIn: '9:38 AM', punchOut: '6:32 PM', workHours: '03:07 hrs', breakHours: '05:47 hrs' },
      { date: '09-06-2025', punchIn: '9:38 AM', punchOut: '6:32 PM', workHours: '03:07 hrs', breakHours: '05:47 hrs' },
      { date: '09-06-2025', punchIn: '9:38 AM', punchOut: '6:32 PM', workHours: '03:07 hrs', breakHours: '05:47 hrs' },
      { date: '09-06-2025', punchIn: '9:38 AM', punchOut: '6:32 PM', workHours: '03:07 hrs', breakHours: '05:47 hrs' },
    ]}
  />
)}



    </div>
  );
}

export default AllEmployeeAttendanceReportTable;
