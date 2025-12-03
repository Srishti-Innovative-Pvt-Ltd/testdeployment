import React from "react";
import styles from "./HRpoliciesModal.module.css";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { HRpolicyModalSchema } from "../../utils/ValidationSchema";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

const HRpoliciesModal = ({ onClose, onSubmit, initialData, mode }) => {
    useEscapeKey(onClose); 

  const initialValues = {
    title: initialData?.title || "",
    file: null,
  };

  return (
    <div className={styles["hrPolicyModal-overlay"]}>
      <div className={styles["hrPolicyModal-modal"]}>
        <div className={styles["hrPolicyModal-header"]}>
          <h3>{mode === "edit" ? "Edit Policy" : "Add Policy"}</h3>
          <Icon
            icon="mdi:close"
            className={styles["hrPolicyModal-closeIcon"]}
            onClick={onClose}
          />
        </div>

        <hr className={styles["hrPolicyModal-hrLine"]} />

        <Formik
          initialValues={initialValues}
          validationSchema={HRpolicyModalSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ setFieldValue, touched, errors }) => (
            <Form>
              <div className={styles["hrPolicyModal-formGroup"]}>
                <label>Policy Title</label>
                <Field
                  type="text"
                  name="title"
                  className={styles["hrPolicyModal-input"]}
                  placeholder="Enter Policy Title"
                />

                <ErrorMessage
                  name="title"
                  component="div"
                  className={styles["hrPolicyModal-error"]}
                />
              </div>

              <div className={styles["hrPolicyModal-formGroup"]}>
                <label>Upload File</label>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    setFieldValue("file", file);
                  }}
                  className={styles["hrPolicyModal-input"]}
                />
                {touched.file && errors.file && (
                  <div className={styles["hrPolicyModal-error"]}>
                    {errors.file}
                  </div>
                )}
              </div>

              <hr className={styles["hrPolicyModal-hrLine"]} />

              <div className={styles["hrPolicyModal-buttonWrapper"]}>
                <PrimaryButton
                  label="Save"
                  onClick={() => setIsDeptAddModalOpen(true)}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default HRpoliciesModal;
