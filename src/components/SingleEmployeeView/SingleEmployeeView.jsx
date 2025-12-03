import React from 'react';
import styles from './SingleEmployeeView.module.css';
import Table from '../Table/Table'; 

const SingleEmployeeView = () => {
const columns = [
  { header: 'Date', accessor: 'date' },
  { header: 'Total Work Hours', accessor: 'totalWork' },
  { header: 'Total Break Hours', accessor: 'breakTime' },
  { header: 'Extra Work Hours', accessor: 'extraWork' },
  { header: 'Pending Work Hours', accessor: 'pendingWork' },
];

   const data = [
  {
    date: '	02-06-2025',
    totalWork: '08:00',
    breakTime: '01:00',
    extraWork: '00:30',
    pendingWork: '00:00',
  },
  {
    date: '03-06-2025',
    totalWork: '08:00',
    breakTime: '00:45',
    extraWork: '00:15',
    pendingWork: '00:10',
  }
];


    

    return (
        <div>
            <div>

            <h5 className={styles.SingleEmployeeViewSectionTitle}>Attendance Logs</h5>

            <Table
                columns={columns}
                data={data}
                currentPage={1}
                rowsPerPage={5}
                onPageChange={() => { }}
            />
        </div>
        </div>
    );
};

export default SingleEmployeeView;
