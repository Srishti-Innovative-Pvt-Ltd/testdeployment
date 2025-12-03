import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "../../components/Button/Button";
import styles from "./AppRejConfModal.module.css";
import { appRejectionReasonSchema } from "../../utils/ValidationSchema";

function AppRejConfModal({ isOpen, actionType, onCancel, onProceed }) {
  if (!isOpen) return null;

  const message =
    actionType === "approve"
      ? "Are you sure you want to approve?"
      : "Please provide a reason for rejection:";

  return (
    <div className={styles.AppRejConfModal_backdrop}>
      <div className={styles.AppRejConfModal_container}>
        <h2 className={styles.AppRejConfModal_title}>Confirmation</h2>
        <p className={styles.AppRejConfModal_message}>{message}</p>

        {/* ✅ Formik handles validation and submission */}
        <Formik
          initialValues={{ reason: "" }}
          validationSchema={
            actionType === "reject" ? appRejectionReasonSchema : null
          }
          onSubmit={(values) => {
            if (actionType === "reject") {
              onProceed(values.reason);
            } else {
              onProceed();
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {actionType === "reject" && (
                <div className={styles.AppRejConfModal_inputGroup}>
                  <Field
                    as="textarea"
                    name="reason"
                    placeholder="Enter rejection reason..."
                    className={`${styles.AppRejConfModal_textarea} ${
                      errors.reason && touched.reason
                        ? styles.AppRejConfModal_errorBorder
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="reason"
                    component="span"
                    className={styles.AppRejConfModal_errorMsg}
                  />
                </div>
              )}

              <div className={styles.AppRejConfModal_actions}>
                <Button
                  label="Cancel"
                  secondary
                  onClick={onCancel}
                  type="button"
                  className={styles.AppRejConfModal_cancel}
                />
                <Button
                  label="Proceed"
                  type="submit"
                  className={styles.AppRejConfModal_proceed}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AppRejConfModal;
