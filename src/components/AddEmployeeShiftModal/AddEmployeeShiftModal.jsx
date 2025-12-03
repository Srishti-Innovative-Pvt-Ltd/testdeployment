import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./AddEmployeeShiftModal.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { EmployeeShiftModalSchema } from "../../utils/ValidationSchema";
import { getCompaniesByName } from "../../services/companyService";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

const AddEmployeeShiftModal = ({ isOpen, onClose, initialData, onSubmit, }) => {
  useEscapeKey(onClose);

  const [formData, setFormData] = useState({
    companyId: "",
    shiftName: "",
    startHour: "",
    startMinute: "",
    startPeriod: "AM",
    endHour: "",
    endMinute: "",
    endPeriod: "AM",
    breakDuration: "",
    workingHours: "",
  });

  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch companies for dropdown
  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      }
    }
    fetchCompanies();
  }, []);

  // Populate if editing
  useEffect(() => {
    if (initialData) {
      const [startHour, startMinuteWithPeriod] = (initialData.startTime || "09:00 AM").split(":");
      const [startMinute, startPeriod] = startMinuteWithPeriod.split(" ");
      const [endHour, endMinuteWithPeriod] = (initialData.endTime || "05:00 PM").split(":");
      const [endMinute, endPeriod] = endMinuteWithPeriod.split(" ");

      setFormData((prev) => ({
        ...prev,
        companyId:
          typeof initialData.companyId === "object"
            ? initialData.companyId._id
            : initialData.companyId || "",
        shiftName: initialData.shiftName || "",
        startHour: startHour || "",
        startMinute: startMinute || "",
        startPeriod: startPeriod || "AM",
        endHour: endHour || "",
        endMinute: endMinute || "",
        endPeriod: endPeriod || "PM",
        breakDuration: initialData.breakDuration || "",
        workingHours: initialData.workingHours || "",
      }));
    }
  }, [initialData]);


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["startHour", "startMinute", "endHour", "endMinute"].includes(name) &&
      value.length > 2
    ) {
      return;
    }

    if (["startHour", "endHour"].includes(name)) {
      if (value && (isNaN(value) || value < 1 || value > 12)) {
        return;
      }
    }

    if (["startMinute", "endMinute"].includes(name)) {
      if (value && (isNaN(value) || value < 0 || value > 59)) {
        return;
      }
    }

    if (name === "breakDuration") {
      if (value.length > 3 || (value && (isNaN(value) || value < 0 || value > 480))) {
        return;
      }
    }

    if (name === "workingHours") {
      if (value.length > 2 || (value && (isNaN(value) || value < 0 || value > 24))) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleConfirm = async () => {
    try {
      await EmployeeShiftModalSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const startTime = `${formData.startHour.padStart(2, "0")}:${formData.startMinute.padStart(2, "0")} ${formData.startPeriod}`;
      const endTime = `${formData.endHour.padStart(2, "0")}:${formData.endMinute.padStart(2, "0")} ${formData.endPeriod}`;

      const payload = {
        companyId: formData.companyId,
        shiftName: formData.shiftName,
        startTime,
        endTime,
        breakDuration: formData.breakDuration,
        workingHours: formData.workingHours
      };

      onSubmit(payload);
    } catch (err) {
      if (err.inner) {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.AddEmployeeShiftModal_overlay}>
      <div className={styles.AddEmployeeShiftModal_modal}>
        <div className={styles.AddEmployeeShiftModal_header}>
          <h2>{initialData ? "Edit Shift" : "Add Shift"}</h2>
          <button
            className={styles.AddEmployeeShiftModal_closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.AddEmployeeShiftModal_content}>
          {/* Company Selection */}
          <div className={styles.fullWidth}>
            <label>Select Company<span className={styles.star}>*</span></label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
            >
              <option value="">-- Select Company --</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
            {errors.companyId && <span className={styles.error}>{errors.companyId}</span>}
          </div>

          {/* Shift Name */}
          <div className={styles.fullWidth}>
            <label>Shift Name<span className={styles.star}>*</span></label>
            <input
              type="text"
              name="shiftName"
              value={formData.shiftName}
              onChange={handleChange}
            />
            {errors.shiftName && <span className={styles.error}>{errors.shiftName}</span>}
          </div>

          {/* Start Time & End Time */}
          <div className={styles.rowTwo}>
            <div>
              <label>Start Time<span className={styles.star}>*</span></label>
              <div className={styles.AddEmployeeShiftModal_timeRow}>
                <input
                  type="number"
                  placeholder="HH"
                  name="startHour"
                  value={formData.startHour}
                  onChange={handleChange}
                  min="1"
                  max="12"
                />
                :
                <input
                  type="number"
                  placeholder="MM"
                  name="startMinute"
                  value={formData.startMinute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                />
                <select
                  name="startPeriod"
                  value={formData.startPeriod}
                  onChange={handleChange}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              {errors.startHour && <span className={styles.error}>{errors.startHour}</span>}
              {errors.startMinute && <span className={styles.error}>{errors.startMinute}</span>}
            </div>

            <div>
              <label>End Time<span className={styles.star}>*</span></label>
              <div className={styles.AddEmployeeShiftModal_timeRow}>
                <input
                  type="number"
                  placeholder="HH"
                  name="endHour"
                  value={formData.endHour}
                  onChange={handleChange}
                  min="1"
                  max="12"
                />
                :
                <input
                  type="number"
                  placeholder="MM"
                  name="endMinute"
                  value={formData.endMinute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                />
                <select
                  name="endPeriod"
                  value={formData.endPeriod}
                  onChange={handleChange}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
              {errors.endHour && <span className={styles.error}>{errors.endHour}</span>}
              {errors.endMinute && <span className={styles.error}>{errors.endMinute}</span>}
            </div>
          </div>

          {/* Break Duration & Working Hours */}
          <div className={styles.rowTwo}>
            <div>
              <label>Break Duration (minutes)<span className={styles.star}>*</span></label>
              <input
                type="number"
                name="breakDuration"
                value={formData.breakDuration}
                onChange={handleChange}
              />
              {errors.breakDuration && <span className={styles.error}>{errors.breakDuration}</span>}
            </div>

            <div>
              <label>Working Hours<span className={styles.star}>*</span></label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
              />
              {errors.workingHours && <span className={styles.error}>{errors.workingHours}</span>}
            </div>
          </div>
        </div>

        <div className={styles.AddEmployeeShiftModal_footer}>
          <PrimaryButton
            label={initialData ? "Update" : "Confirm"}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddEmployeeShiftModal;
