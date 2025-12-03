import React from "react";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import styles from "./UpdateOffDaysModal.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey";
import { UpdateOffDaysSchema } from "../../utils/ValidationSchema";

function UpdateOffDaysModal({ onClose, initialData, onSubmit }) {
  useEscapeKey(onClose);

  return (
    <div className={styles.updateOffDaysOverlay}>
      <div className={styles.updateOffDaysModal}>
        {/* Header */}
        <div className={styles.updateOffDaysHeader}>
          <span>{initialData ? "Edit Off Day" : "Add Off Day"}</span>
          <Icon
            icon="mdi:close"
            className={styles.updateOffDaysCloseIcon}
            onClick={onClose}
          />
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            type: initialData?.type || "",
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            duration: initialData?.duration || "",
            fromTime: initialData?.fromTime || "",
            toTime: initialData?.toTime || "",
            comments: initialData?.comments || "",
          }}
          validationSchema={UpdateOffDaysSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className={styles.updateOffDaysBody}>
                {/* Off Day Type */}
                <div className={styles.updateOffDaysGroup}>
                  <label>Off Day Type</label>
                  <Field as="select" name="type" className={styles.updateOffDaysInput}>
                    <option value="">Select</option>
                    <option value="Casual leave">Casual Leave</option>
                    <option value="Flexi leave">Flexi Leave</option>
                    <option value="Work from Home">Work from Home</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className={styles.updateOffDaysError}
                  />
                </div>

                {/* Date + Duration */}
                <div className={styles.updateOffDaysRow}>
                  <div className={styles.updateOffDaysGroup}>
                    <label>Date</label>
                    <DatePicker
                      selected={values.date}
                      onChange={(date) => setFieldValue("date", date)}
                      dateFormat="dd-MM-yyyy"
                      className={styles.updateOffDaysInput}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className={styles.updateOffDaysError}
                    />
                  </div>

                  <div className={styles.updateOffDaysGroup}>
                    <label>Duration</label>
                    <Field
                      as="select"
                      name="duration"
                      className={styles.updateOffDaysInput}
                    >
                      <option value="">Select</option>
                      <option value="Full day">Full Day</option>
                      <option value="Half day">Half Day</option>
                    </Field>
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className={styles.updateOffDaysError}
                    />
                  </div>
                </div>

                {/* From Time + To Time */}
                <div className={styles.updateOffDaysRow}>
                  <div className={styles.updateOffDaysGroup}>
                    <label>From Time</label>
                    <TimePicker
                      value={values.fromTime}
                      onChange={(val) => setFieldValue("fromTime", val)}
                      className={styles.updateOffDaysInput}
                      disableClock
                    />
                    <ErrorMessage
                      name="fromTime"
                      component="div"
                      className={styles.updateOffDaysError}
                    />
                  </div>

                  <div className={styles.updateOffDaysGroup}>
                    <label>To Time</label>
                    <TimePicker
                      value={values.toTime}
                      onChange={(val) => setFieldValue("toTime", val)}
                      className={styles.updateOffDaysInput}
                      disableClock
                    />
                    <ErrorMessage
                      name="toTime"
                      component="div"
                      className={styles.updateOffDaysError}
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className={styles.updateOffDaysGroup}>
                  <label>Comments</label>
                  <Field
                    as="textarea"
                    name="comments"
                    className={styles.updateOffDaysTextarea}
                    placeholder="Enter comments"
                  />
                  <ErrorMessage
                    name="comments"
                    component="div"
                    className={styles.updateOffDaysError}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className={styles.updateOffDaysFooter}>
                <PrimaryButton
                  label={initialData ? "Update" : "Submit"}
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

export default UpdateOffDaysModal;
