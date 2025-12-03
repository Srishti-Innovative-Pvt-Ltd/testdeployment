import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./ApplyLeave.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { applyLeaveSchema } from "../../utils/ValidationSchema";
import DashboardLayout from "../../layouts/DashboardLayout";
import { applyLeave, getEmployeeLeaves } from "../../services/leaveServices";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { id: user_id } = useParams();
  const fileInputRef = useRef(null);

  // Helper to reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const result = await getEmployeeLeaves(user_id);
        if (result.success && result.data?.balances) {
          const availableLeaves = result.data.balances.filter(
            (lt) => lt.currentBalance > 0
          );
          setLeaveTypes(availableLeaves);
        } else {
          enqueueSnackbar(result.message, { variant: "info" });
        }
      } catch (error) {
        enqueueSnackbar("Failed to load leave types", { variant: "error" });
      }
    };
    fetchLeaveTypes();
  }, [user_id, enqueueSnackbar]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("employee", user_id);
      formData.append("leaveType", values.leaveType);
      formData.append("fromDate", values.fromDate);
      formData.append("toDate", values.toDate);
      formData.append("reason", values.reason);

      const isHalfDay = values.leaveDuration === "half";
      formData.append("isHalfDay", isHalfDay);

      if (values.document) {
        formData.append("documents", values.document);
      }

      const response = await applyLeave(formData);
      if (response.success) {
        enqueueSnackbar("Leave applied successfully", { variant: "success" });
        resetForm();
        resetFileInput(); // <-- reset document input after submit
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to apply leave", { variant: "error" });
      console.error("Error applying leave:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.applyLeaveContainer}>
        <Card title="Apply Leave" icon="mdi:calendar">
          <Formik
            initialValues={{
              leaveType: "",
              fromDate: "",
              toDate: "",
              leaveDuration: "full",
              reason: "",
              document: null,
            }}
            validationSchema={applyLeaveSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, resetForm, values }) => {
              const isMultiDay =
                values.fromDate && values.toDate && values.fromDate !== values.toDate;

              return (
                <Form className={styles.leaveForm}>
                  {/* Row 1 */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="leaveType">
                        Leave Type <span className={styles.star}>*</span>
                      </label>
                      <Field
                        as="select"
                        id="leaveType"
                        name="leaveType"
                        className={styles.inputField}
                      >
                        <option value="" disabled hidden>
                          -- Select Leave Type --
                        </option>
                        {leaveTypes.length > 0 ? (
                          leaveTypes.map((lt) =>
                            lt.leaveTypeId ? (
                              <option key={lt.leaveTypeId._id} value={lt.leaveTypeId._id}>
                                {lt.leaveTypeId.name} ({lt.currentBalance} left)
                              </option>
                            ) : null
                          )
                        ) : (
                          <option value="" disabled>
                            No leave types available
                          </option>
                        )}
                      </Field>
                      <ErrorMessage
                        name="leaveType"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="fromDate">
                        From Date<span className={styles.star}>*</span>
                      </label>
                      <Field
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        className={styles.inputField}
                      />
                      <ErrorMessage
                        name="fromDate"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="toDate">
                        To Date<span className={styles.star}>*</span>
                      </label>
                      <Field
                        type="date"
                        id="toDate"
                        name="toDate"
                        min={values.fromDate || undefined}
                        className={styles.inputField}
                      />
                      <ErrorMessage
                        name="toDate"
                        component="div"
                        className={styles.error}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="leaveDuration">
                        Leave Duration<span className={styles.star}>*</span>
                      </label>
                      <Field
                        as="select"
                        id="leaveDuration"
                        name="leaveDuration"
                        className={styles.inputField}
                      >
                        <option value="full">Full Day</option>
                        <option value="half" disabled={isMultiDay}>
                          Half Day
                        </option>
                      </Field>
                      <ErrorMessage
                        name="leaveDuration"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="document">Document</label>
                      <input
                        type="file"
                        id="document"
                        className={styles.inputField}
                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                        ref={fileInputRef}
                        onChange={(event) => {
                          setFieldValue("document", event.currentTarget.files[0]);
                        }}
                      />
                      <ErrorMessage
                        name="document"
                        component="div"
                        className={styles.error}
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="reason">
                      Reason for Leave<span className={styles.star}>*</span>
                    </label>
                    <Field
                      as="textarea"
                      id="reason"
                      name="reason"
                      rows="4"
                      placeholder="Reason"
                      className={styles.textArea}
                    />
                    <ErrorMessage
                      name="reason"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Buttons */}
                  <div className={styles.buttonRow}>
                    <Button
                      label="Reset"
                      type="button"
                      secondary
                      onClick={() => {
                        resetForm();
                        resetFileInput();
                      }}
                    />
                    <Button label="Apply" type="submit" />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default ApplyLeave;
