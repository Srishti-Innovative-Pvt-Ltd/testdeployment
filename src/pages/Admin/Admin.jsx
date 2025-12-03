import React from "react";
import styles from "./Admin.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../../components/Button/Button";

const Admin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { header: "Username", accessor: "username" },
    { header: "User Role", accessor: "role" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Status", accessor: "status" },
  ];

  const data = Array.from({ length: 37 }, (_, i) => ({
    username: "Admin",
    role: "Admin",
    employeeName: `User ${i + 1}`,
    status: "Enabled",
  }));

  return (
    <DashboardLayout>
      <Card title="System Users">
        <form action="">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <label className="mb-1">Username :</label>
              <div>
                <input type="text" className="inputFormStyle" />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <label className="mb-1">User Role :</label>
              <div>
                <select className="inputFormStyle">
                  <option>-- select --</option>
                  <option value="">Admin</option>
                  <option value="">ESS</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <label className="mb-1">Employee Name :</label>
              <div>
                <input
                  type="text"
                  className="inputFormStyle"
                  placeholder="Type of hints..."
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <label className="mb-1">Status :</label>
              <div>
                <select className="inputFormStyle">
                  <option>-- select --</option>
                  <option value="">Disabled</option>
                  <option value="">Enabled</option>
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div className={styles.adminActionContainer}>
            <Button
              label={"Reset"}
              type="button"
              className="px-4 mx-1"
              secondary
            />
            <Button label={"+ Search"} type="button" className="px-3" />
          </div>
        </form>
      </Card>
      <Card title={`(${data.length}) Records Found`}>
        <div>
          <Button label={"+ Add"} type="button" className="px-5 mb-3" />
        </div>
        <Table
          columns={columns}
          data={data}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          actions={[
            ({ row }) => (
              <button onClick={() => alert(`Delete ${row.employeeName}`)}>
                <Icon icon="material-symbols:delete-outline" />
              </button>
            ),
            ({ row }) => (
              <button onClick={() => alert(`Edit ${row.employeeName}`)}>
                <Icon icon="material-symbols:edit-outline" />
              </button> 
            ),
          ]}
        />
      </Card>
    </DashboardLayout>
  );
};

export default Admin;
