import React from "react";
import styles from "./AppRejEmpLeaveRequest.module.css";
import Button from "../Button/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { rejectSchema, weekendSchema } from "../../utils/ValidationSchema";

function AppRejEmpLeaveRequest({ type, onConfirm, onCancel }) {
  // Pick schema based on modal type
  const getSchema = () => {
    switch (type) {
      case "reject":
        return rejectSchema;
      case "weekend":
        return weekendSchema;
      case "approve":
      default:
        return null; // ✅ approve has no schema
    }
  };

  // Modal content config
  const getContent = () => {
    switch (type) {
      case "approve":
        return {
          title: "Approve Leave Request",
          message: "Are you sure you want to approve this leave request?",
          showOptions: false,
          showReason: false,
        };
      case "reject":
        return {
          title: "Reject Leave Request",
          message: "Please provide a reason for rejecting this leave request:",
          showOptions: false,
          showReason: true,
        };
      case "weekend":
        return {
          title: "Weekend Leave Handling",
          message:
            "This leave request spans across the weekend. Please choose how to handle it:",
          showOptions: true,
          showReason: false,
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const initialValues = {
    option: "",
    reason: "",
  };

  return (
    <div className={styles.AppRejEmpLeaveRequestOverlay}>
      <div className={styles.AppRejEmpLeaveRequestModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={getSchema()}
          onSubmit={(values) => {
            onConfirm({
              type,
              options: values.option, // pass string, not object
              reason: values.reason,
            });
          }}
        >
          {() => (
            <Form>
              <h2 className={styles.AppRejEmpLeaveRequestTitle}>
                {content.title}
              </h2>
              <p className={styles.AppRejEmpLeaveRequestMessage}>
                {content.message}
              </p>

              {/* Weekend Options */}
              {content.showOptions && (
                <div className={styles.AppRejEmpLeaveRequestRadioOptions}>
                  <label>
                    <Field type="radio" name="option" value="continuous" />
                    Continuous Days
                  </label>
                  <label>
                    <Field type="radio" name="option" value="saturday" />
                    Include Saturday
                  </label>
                  <label>
                    <Field type="radio" name="option" value="sunday" />
                    Include Sunday
                  </label>
                  <label>
                    <Field type="radio" name="option" value="none" />
                    Exclude Both
                  </label>
                  <ErrorMessage
                    name="option"
                    component="div"
                    className={styles.errorText}
                  />
                </div>
              )}

              {/* Reject Reason */}
              {content.showReason && (
                <div className={styles.AppRejEmpLeaveRequestReason}>
                  <Field
                    as="textarea"
                    name="reason"
                    placeholder="Enter rejection reason..."
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className={styles.errorText}
                  />
                </div>
              )}

              <div className={styles.AppRejEmpLeaveRequestButtons}>
               
                <Button
                  label="Cancel"
                  type="button"
                  secondary
                  onClick={onCancel}
                />
                 <Button label="Confirm" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AppRejEmpLeaveRequest;
