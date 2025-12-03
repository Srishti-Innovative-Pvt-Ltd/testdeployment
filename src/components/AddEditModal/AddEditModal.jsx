import React, { useEffect } from "react";
import styles from "./AddEditModal.module.css";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddEditModalSchema } from "../../utils/ValidationSchema";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey"

function AddEditModal({ onClose, initialData, label, onSubmit }) {
  useEscapeKey(onClose); 
    return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>{initialData ? `Edit ${label}` : `Add ${label}`}</span>
          <Icon
            icon="mdi:close"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{ name: initialData || "" }}
          validationSchema={AddEditModalSchema}
          onSubmit={(values) => {
            onSubmit(values.name);
            onClose();
          }}
        >
          {() => (
            <Form>
              <div className={styles.modalBody}>
                <label>{label}</label>
                <Field
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder={`Enter ${label}`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.modalFooter}>
                <PrimaryButton
                  label={initialData ? "Update" : "Save"}
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddEditModal;
