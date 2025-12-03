import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import styles from "./JobSchedule.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import DatePicker from "react-datepicker";
import { jobScheduleSchema } from "../../utils/ValidationSchema";
import {
  submitEmployeeJobSchedule,
  getEmployeesByCompany,
  getEmployeeJoBAndSchedule,
  updateEmployeeJobSchedule,
  getEmployeeProbationDate
} from "../../services/addEmployeeService";
import { useSnackbar } from "notistack";
import Select from "react-select";
import {
  getDesignations,
  getAllShifts,
  getDepartments,
  getEmployeeCategories,
} from "../../services/settingsService";

function JobSchedule({ onNext, onBack, user_id, companyId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reportingPersons, setReportingPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "1.1rem",
      color: state.data.isDisabled ? "#000000ff" : provided.color,
      cursor: state.data.isDisabled ? "not-allowed" : "default",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "1.1rem",
      fontWeight: "normal",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "1.1rem",

    }),
    input: (provided) => ({
      ...provided,
      fontSize: "1.1rem",
    }),
    menuList: (provided) => ({
      ...provided,
      fontSize: "1.1rem",
    }),
  };
  const [initialValues, setInitialValues] = useState({
    employeeCategory: "",
    designation: "",
    reportingPerson: "",
    department: "",
    employeeGrade: "",
    shift: "",
    probationPeriod: null,
  });

  const requiresProbation = (categoryId, categories) => {
    const selectedCategory = categories.find(c => c._id === categoryId);
    if (!selectedCategory) return false;
    const name = selectedCategory.name?.toLowerCase();
    return !(name === "permanent");
  };

  useEffect(() => {
    setLoading(true);

    getEmployeeCategories(companyId).then(res => {
      if (res.success) setCategories(res.data);
    });

    getDesignations(companyId).then(res => {
      if (res.success) setDesignations(res.data);
    });

    getAllShifts(companyId).then(res => {
      if (res.success) setShifts(res.data);
    });

    getDepartments(companyId).then(res => {
      if (res.success) setDepartments(res.data);
    });

    getEmployeesByCompany(companyId).then(res => {
      if (res.success) {
        setReportingPersons(res.data.filter(emp => emp._id !== user_id));
      }
    });

    Promise.all([
      getEmployeeJoBAndSchedule(user_id),
      getEmployeeProbationDate(user_id)
    ]).then(([jobRes, probationRes]) => {
      setInitialValues({
        employeeCategory: jobRes.success ? jobRes.data.employeeCategory?._id : "",
        designation: jobRes.success ? jobRes.data.employeeDesignation?._id : "",
        reportingPerson: jobRes.success ? jobRes.data.reportingPerson?._id : "",
        department: jobRes.success ? jobRes.data.employeeDepartment?._id : "",
        employeeGrade: jobRes.success ? jobRes.data.employeeGrade : "",
        shift: jobRes.success ? jobRes.data.employeeShift?._id : "",
        probationPeriod: probationRes.success && probationRes.data?.probationEndDate
          ? new Date(probationRes.data.probationEndDate)
          : null,
      });
    }).finally(() => setLoading(false));
  }, [companyId, user_id]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={jobScheduleSchema}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          // Format the probationEndDate to YYYY-MM-DD
          const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          const probationEndDate = requiresProbation(values.employeeCategory, categories)
            ? formatDate(values.probationPeriod)
            : null;

          const payload = {
            employeeCategory: values.employeeCategory,
            employeeDesignation: values.designation,
            reportingPerson: values.reportingPerson,
            employeeDepartment: values.department,
            employeeShift: values.shift,
            employeeGrade: values.employeeGrade,
            probationEndDate,
          };

          let response;
          if (
            initialValues.employeeCategory ||
            initialValues.designation ||
            initialValues.department
          ) {
            response = await updateEmployeeJobSchedule(user_id, payload);
          } else {
            response = await submitEmployeeJobSchedule(user_id, payload);
          }

          if (response.success) {
            enqueueSnackbar(response.message || "Job Schedule saved successfully!", {
              variant: "success",
              autoHideDuration: 3000,
            });
            onNext();
          } else {
            enqueueSnackbar(response.message || "Submission failed", {
              variant: "error",
              autoHideDuration: 4000,
            });
          }
        } catch (error) {
          enqueueSnackbar("An unexpected error occurred.", {
            variant: "error",
            autoHideDuration: 4000,
          });
          console.error("Submission error:", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <Card title="Job Schedule" icon="mdi:calendar-clock">
            {loading ? (
              <div className={styles.loading}>Loading dropdown data...</div>
            ) : (
              <>
                <div className={styles.grid}>
                  {/* Employee Category */}
                  <div className={styles.field}>
                    <label>
                      Employee Category<span className={styles.star}>*</span>
                    </label>
                    <Select
                      name="employeeCategory"
                      options={[
                        { value: "", label: "Select Employee Category", isDisabled: true },
                        ...categories.map((c) => ({
                          value: c._id,
                          label: c.name,
                        })),
                      ]}
                      value={
                        values.employeeCategory
                          ? {
                            value: values.employeeCategory,
                            label:
                              categories.find((c) => c._id === values.employeeCategory)
                                ?.name || "",
                          }
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue("employeeCategory", opt ? opt.value : "")
                      }
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Category"
                    />
                    <ErrorMessage
                      name="employeeCategory"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Designation */}
                  <div className={styles.field}>
                    <label>
                      Designation<span className={styles.star}>*</span>
                    </label>
                    <Select
                      name="designation"
                      options={[
                        { value: "", label: "Select Designation", isDisabled: true },
                        ...designations.map((d) => ({ value: d._id, label: d.name })),
                      ]}

                      value={
                        values.designation
                          ? {
                            value: values.designation,
                            label:
                              designations.find((d) => d._id === values.designation)
                                ?.name || "",
                          }
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue("designation", opt ? opt.value : "")
                      }
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Designation"
                    />
                    <ErrorMessage
                      name="designation"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Reporting Person */}
                  <div className={styles.field}>
                    <label>
                      Reporting Person
                    </label>
                    <Select
                      name="reportingPerson"
                      options={[
                        { value: "", label: "Select Reporting Person", isDisabled: true },
                        ...reportingPersons.map((p) => ({ value: p._id, label: p.fullName })),
                      ]}

                      value={
                        values.reportingPerson
                          ? {
                            value: values.reportingPerson,
                            label:
                              reportingPersons.find(
                                (p) => p._id === values.reportingPerson
                              )?.fullName || "",
                          }
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue("reportingPerson", opt ? opt.value : "")
                      }
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Reporting Person"
                    />
                    <ErrorMessage
                      name="reportingPerson"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Department */}
                  <div className={styles.field}>
                    <label>
                      Department<span className={styles.star}>*</span>
                    </label>
                    <Select
                      name="department"
                      options={[
                        { value: "", label: "Select Department", isDisabled: true },
                        ...departments.map((d) => ({ value: d._id, label: d.name })),
                      ]}

                      value={
                        values.department
                          ? {
                            value: values.department,
                            label:
                              departments.find((d) => d._id === values.department)
                                ?.name || "",
                          }
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue("department", opt ? opt.value : "")
                      }
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Department"
                    />
                    <ErrorMessage
                      name="department"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Shift */}
                  <div className={styles.field}>
                    <label>
                      Shift<span className={styles.star}>*</span>
                    </label>
                    <Select
                      name="shift"
                      options={[
                        { value: "", label: "Select Shift", isDisabled: true },
                        ...shifts.map((s) => ({
                          value: s._id,
                          label: `${s.shiftName} (${s.startTime} - ${s.endTime})`,
                        })),
                      ]}

                      value={
                        values.shift
                          ? {
                            value: values.shift,
                            label:
                              shifts.find((s) => s._id === values.shift)
                                ? `${shifts.find((s) => s._id === values.shift)
                                  .shiftName} (${shifts.find((s) => s._id === values.shift)
                                    .startTime
                                } - ${shifts.find((s) => s._id === values.shift)
                                  .endTime
                                })`
                                : "",
                          }
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue("shift", opt ? opt.value : "")
                      }
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Shift"
                    />
                    <ErrorMessage
                      name="shift"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Probation Period */}
                  {requiresProbation(values.employeeCategory, categories) && (
                    <div className={styles.field}>
                      <label>
                        {
                          categories.find(c => c._id === values.employeeCategory)?.name?.toLowerCase() === "contract"
                            ? "Contract End Date"
                            : "Probation Period"
                        }
                        <span className={styles.star}>*</span>
                      </label>
                      <DatePicker
                        selected={
                          values.probationPeriod
                            ? new Date(values.probationPeriod)
                            : null
                        }
                        onChange={(date) => setFieldValue("probationPeriod", date)}
                        dateFormat="dd/MM/yyyy"
                        className={styles.datePickerInput}
                      />
                      <ErrorMessage
                        name="probationPeriod"
                        component="div"
                        className={styles.error}
                      />
                    </div>
                  )}

                </div>

                <div className={styles.buttonGroup}>
                  <Button label="Skip" type="button" onClick={onNext} secondary />
                  <Button
                    label={isSubmitting ? "Submitting..." : "Next"}
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default JobSchedule;
