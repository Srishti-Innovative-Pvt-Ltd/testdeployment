import React from "react";
import styles from "./AddLeaveModal.module.css";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddLeaveModalSchema } from "../../utils/ValidationSchema";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { createLeave } from "../../services/settingsService";
import { useSnackbar } from "notistack";

const AddLeaveModal = ({ onClose, onSave, initialData }) => {
  useEscapeKey(onClose);

  return (
    <div className={styles.AddLeaveModalOverlay}>
      <div className={styles.AddLeaveModalContainer}>
        <div className={styles.AddLeaveModalHeader}>
          <span>{initialData ? "Edit Leave" : "Add Leave"}</span>
          <Icon
            icon="mdi:close"
            className={styles.AddLeaveModalCloseIcon}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{
            name: initialData?.name || "",
            gender: initialData?.genderEligibility  || "all",
          }}
          validationSchema={AddLeaveModalSchema}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
        >
          {() => (
            <Form> 
              <div className={styles.AddLeaveModalBody}>
                <label className={styles.AddLeaveModalLabel}>Leave Name<span className={styles.star}>*</span></label>
                <Field
                  type="text"
                  name="name"
                  className={styles.AddLeaveModalInput}
                  placeholder="Enter Leave"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.AddLeaveModalError}
                />

                <label className={styles.AddLeaveModalLabel}>
                  Gender Eligibility
                </label>
                <div className={styles.AddLeaveModalRadioGroup}>
                  <label className={styles.AddLeaveModalRadioOption}>
                    <Field type="radio" name="gender" value="all"  />
                    All
                  </label>
                  <label className={styles.AddLeaveModalRadioOption}>
                    <Field type="radio" name="gender" value="male" />
                    Male
                  </label>
                  <label className={styles.AddLeaveModalRadioOption}>
                    <Field type="radio" name="gender" value="female" />
                    Female
                  </label>
                </div>

                <ErrorMessage
                  name="gender"
                  component="div"
                  className={styles.AddLeaveModalError}
                />

                <hr className={styles.AddLeaveModalDivider} />

                <div className={styles.AddLeaveModalFooter}>
                  <PrimaryButton
                    label={initialData ? "Update" : "Save"}
                    type="submit"
                    className={styles.AddLeaveModalSaveButton}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddLeaveModal;
