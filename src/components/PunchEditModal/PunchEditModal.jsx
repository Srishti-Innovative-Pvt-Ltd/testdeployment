import React from "react";
import styles from "./PunchEditModal.module.css";
import { Icon } from "@iconify/react";
import { Formik, Form, Field } from "formik";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function PunchEditModal({ onClose, employeeData, onSave }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>Employee Punch Mapping</span>
          <Icon
            icon="mdi:close"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{
            name: employeeData?.name || "",
            empId: employeeData?.empId || "",
            head: employeeData?.head || "",
            north: employeeData?.north || "",
            south: employeeData?.south || "",
          }}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
        >
          {() => (
            <Form>
              <div className={styles.modalBody}>
                <label>EMPLOYEE NAME</label>
                <Field
                  name="name"
                  type="text"
                  className={styles.input}
                  readOnly
                />

                <label>EMPLOYEE ID</label>
                <Field
                  name="empId"
                  type="text"
                  className={styles.input}
                  readOnly
                />

                <label>HEAD OFFICE(1ST FLOOR)</label>
                <Field name="head" type="text" className={styles.input} />

                <label>NORTH BLOCK(2ND FLOOR)</label>
                <Field name="north" type="text" className={styles.input} />

                <label>SOUTH BLOCK(CAMPUS)</label>
                <Field name="south" type="text" className={styles.input} />
              </div>

              <div className={styles.modalFooter}>
                <PrimaryButton label="Save" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PunchEditModal;
