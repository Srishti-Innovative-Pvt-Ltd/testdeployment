import React from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ScheduleInterviewModal.module.css";
import { scheduleInterviewSchema } from "../../utils/ValidationSchema";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function ScheduleInterviewModal({ onClose, onSubmit }) {
  useEscapeKey(onClose);

  const formik = useFormik({
    initialValues: {
      totalRound: "",
      interviewName: "",
      interviewerName: "",
      interviewMode: "",
      interviewDate: null,
      startHour: "",
      startMinute: "",
      startMeridian: "AM",
      endHour: "",
      endMinute: "",
      endMeridian: "AM",
    },
    validationSchema: scheduleInterviewSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Schedule Interview</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.modalForm}>

          <div className={styles.formGroup}>
            <label>Total Round</label>
            <select
              name="totalRound"
              value={formik.values.totalRound}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select round</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {formik.touched.totalRound && formik.errors.totalRound && (
              <span className={styles.errorText}>
                {formik.errors.totalRound}
              </span>
            )}
          </div>


          <div className={styles.formGroup}>
            <label>Interview Name</label>
            <select
              name="interviewName"
              value={formik.values.interviewName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select</option>
              <option value="Technical Round">Technical Round</option>
              <option value="HR Round">HR Round</option>
            </select>
            {formik.touched.interviewName && formik.errors.interviewName && (
              <span className={styles.errorText}>
                {formik.errors.interviewName}
              </span>
            )}
          </div>


          <div className={styles.formGroup}>
            <label>Interviewer Name</label>
            <select
              name="interviewerName"
              value={formik.values.interviewerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select</option>
              <option value="John">John</option>
              <option value="Jane">Jane</option>
            </select>
            {formik.touched.interviewerName &&
              formik.errors.interviewerName && (
                <span className={styles.errorText}>
                  {formik.errors.interviewerName}
                </span>
              )}
          </div>


          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Interview Mode</label>
              <select
                name="interviewMode"
                value={formik.values.interviewMode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              {formik.touched.interviewMode && formik.errors.interviewMode && (
                <span className={styles.errorText}>
                  {formik.errors.interviewMode}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Interview Date</label>
              <DatePicker
                selected={formik.values.interviewDate}
                onChange={(date) =>
                  formik.setFieldValue("interviewDate", date)
                }
                onBlur={() => formik.setFieldTouched("interviewDate", true)}
                placeholderText="DD/MM/YYYY"
                dateFormat="dd/MM/yyyy"
                className={styles.datePickerInput}
              />
              {formik.touched.interviewDate &&
                formik.errors.interviewDate && (
                  <span className={styles.errorText}>
                    {formik.errors.interviewDate}
                  </span>
                )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.timeGroup}>
              <label>Start Time</label>
              <div className={styles.timeFields}>
                <input
                  type="text"
                  name="startHour"
                  placeholder="HH"
                  maxLength="2"
                  value={formik.values.startHour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span>:</span>
                <input
                  type="text"
                  name="startMinute"
                  placeholder="MM"
                  maxLength="2"
                  value={formik.values.startMinute}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <select
                  name="startMeridian"
                  value={formik.values.startMeridian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              {formik.touched.startHour && formik.errors.startHour && (
                <span className={styles.errorText}>
                  {formik.errors.startHour}
                </span>
              )}
              {formik.touched.startMinute && formik.errors.startMinute && (
                <span className={styles.errorText}>
                  {formik.errors.startMinute}
                </span>
              )}
            </div>


            <div className={styles.timeGroup}>
              <label>End Time</label>
              <div className={styles.timeFields}>
                <input
                  type="text"
                  name="endHour"
                  placeholder="HH"
                  maxLength="2"
                  value={formik.values.endHour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span>:</span>
                <input
                  type="text"
                  name="endMinute"
                  placeholder="MM"
                  maxLength="2"
                  value={formik.values.endMinute}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <select
                  name="endMeridian"
                  value={formik.values.endMeridian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              {formik.touched.endHour && formik.errors.endHour && (
                <span className={styles.errorText}>
                  {formik.errors.endHour}
                </span>
              )}
              {formik.touched.endMinute && formik.errors.endMinute && (
                <span className={styles.errorText}>
                  {formik.errors.endMinute}
                </span>
              )}
            </div>
          </div>


          <div className={styles.buttonContainer}>
            <PrimaryButton type="submit" label="Confirm" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleInterviewModal;
