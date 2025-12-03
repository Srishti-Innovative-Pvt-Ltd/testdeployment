import React, { useState, useEffect } from "react";
import styles from "./AddAssignedLeaveModal.module.css";
import { FieldArray, Formik, Form, Field, ErrorMessage } from "formik";
import { Icon } from "@iconify/react";
import { assignedLeaveValidationSchema } from "../../utils/ValidationSchema";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Button from "../Button/Button";
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey";
import { getEmployeeCategories, getAllLeaves } from "../../services/settingsService";
import { getCompaniesByName } from "../../services/companyService";

function AddAssignedLeaveModal({ onClose, initialData, onSubmit }) {
  useEscapeKey(onClose);

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(
    initialData?.company?._id || initialData?.company || ""
  );

  // Fetch Companies
  useEffect(() => {
    async function fetchCompanies() {
      const res = await getCompaniesByName();
      if (res.success) setCompanies(res.data);
    }
    fetchCompanies();
  }, []);

  // Fetch Categories based on selectedCompany
  useEffect(() => {
    async function fetchCategories() {
      if (!selectedCompany) {
        setCategories([]);
        return;
      }
      const res = await getEmployeeCategories(selectedCompany);
      if (res.success) {
        setCategories(res.data || []);
      } else {
        setCategories([]);
      }
    }
    fetchCategories();
  }, [selectedCompany]);

  // Fetch Leaves from API
  useEffect(() => {
    async function fetchLeaves() {
      const res = await getAllLeaves();
      if (res.success) {
        setLeaves(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setLeaves([]);
      }
    }
    fetchLeaves();
  }, []);

  const initialLeave = {
    employeeCategory: "",
    leaveType: "",
    leaveCount: "",
    leavePeriod: 365,
    leavePlanType: "",
    carryForward: false,
    maxCount: "",
  };

  return (
    <div className={styles.addAssignedLeave__modalOverlay}>
      <div className={styles.addAssignedLeave__modal}>
        {/* Header */}
        <div className={styles.addAssignedLeave__modalHeader}>
          <span>{initialData ? "Edit Assigned Leave" : "Assign Leave"}</span>
          <span className={styles.addAssignedLeave__infotooltipText}>
            <Icon
              icon="bi:info-circle-fill"
              className={styles.addAssignedLeave__info}
            />
            <span className={styles.addAssignedLeave__tooltip}>
              If a leave is credited after 45 working days, the leave count = 1,
              leave paid = 45, leave plan type = working days.
            </span>
          </span>

          <Icon
            icon="mdi:close"
            className={styles.addAssignedLeave__closeIcon}
            onClick={onClose}
          />
        </div>

        {/* Formik Form */}
        <Formik
          enableReinitialize
          initialValues={{
            leaves: initialData
              ? [
                  {
                    employeeCategory: initialData.employeeCategory || "",
                    leaveType: initialData.leaveType || initialData.leaveId || "",
                    leaveCount: initialData.count,
                    leavePeriod: initialData.period,
                    leavePlanType: initialData.type?.toLowerCase() || "",
                    carryForward: initialData.carry === "Yes",
                    maxCount:
                      initialData.max !== "N/A" ? initialData.max : "",
                  },
                ]
              : [initialLeave],
          }}
          validationSchema={assignedLeaveValidationSchema}
          onSubmit={(values) => {
            const payloads = values.leaves.map((lv) => ({
              companyId: selectedCompany || undefined,
              employeeCategoryId: lv.employeeCategory,
              leaveTypeId: lv.leaveType,
              leaveCount: Number(lv.leaveCount),
              leavePeriod: Number(lv.leavePeriod),
              leavePlanType: lv.leavePlanType,
              carryForward: lv.carryForward,
              maxCount: lv.carryForward ? Number(lv.maxCount) : 0,
            }));

            if (onSubmit) onSubmit(payloads);
            onClose();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Company Dropdown moved inside Formik */}
              <div className={styles.AssignedLeaveFilterGroup}>
                <label>Company</label>
                <Field
                  as="select"
                  name="companyId"
                  className={styles.AssignedLeaveSelect}
                  value={selectedCompany}
                  onChange={(e) => {
                    const newCompanyId = e.target.value;
                    setSelectedCompany(newCompanyId);

                    // Clear Employee Categories when company changes
                    setCategories([]);
                    values.leaves.forEach((_, idx) =>
                      setFieldValue(`leaves[${idx}].employeeCategory`, "")
                    );
                  }}
                >
                  <option value="">--Select Company--</option>
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.companyName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No companies available</option>
                  )}
                </Field>
              </div>

              <div className={styles.addAssignedLeave__tableWrapper}>
                <FieldArray name="leaves">
                  {({ push, remove }) => (
                    <>
                      {values.leaves.map((leave, index) => (
                        <div
                          className={styles.addAssignedLeave__row}
                          key={index}
                        >
                          {/* Employee Category */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div className={styles.labelWithTooltip}>
                              <label>Employee Category<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                Select the Employee Category here.
                              </span>
                            </div>
                            <Field
                              as="select"
                              name={`leaves[${index}].employeeCategory`}
                              className={styles.addAssignedLeave__field}
                              value={leave.employeeCategory || ""}
                              onChange={(e) =>
                                setFieldValue(
                                  `leaves[${index}].employeeCategory`,
                                  e.target.value
                                )
                              }
                              disabled={!selectedCompany}
                            >
                              <option value="">--Select Category--</option>
                              {categories.length > 0 ? (
                                categories.map((cat) => (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled value="">
                                  No categories available
                                </option>
                              )}
                            </Field>
                            <ErrorMessage
                              name={`leaves[${index}].employeeCategory`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Leave Type */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div className={styles.labelWithTooltip}>
                              <label>Leave Type<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                Select the Leave Type here.
                              </span>
                            </div>
                            <Field
                              as="select"
                              name={`leaves[${index}].leaveType`}
                              className={styles.addAssignedLeave__field}
                            >
                              <option value="">--Select Leave--</option>
                              {leaves.map((lv) => (
                                <option key={lv._id} value={lv._id}>
                                  {lv.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name={`leaves[${index}].leaveType`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Leave Count */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div className={styles.labelWithTooltip}>
                              <label>Leave Count<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                eg: If he has 5 leaves for 365 days then give '5'
                                here.
                              </span>
                            </div>
                            <Field
                              name={`leaves[${index}].leaveCount`}
                              type="number"
                              min="0"
                              className={styles.addAssignedLeave__field}
                            />
                            <ErrorMessage
                              name={`leaves[${index}].leaveCount`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Leave Period */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div className={styles.labelWithTooltip}>
                              <label>Leave Period<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                eg: If he has 5 leaves for 365 days then give 365
                                here.
                              </span>
                            </div>
                            <Field
                              name={`leaves[${index}].leavePeriod`}
                              type="number"
                              min="0"
                              className={styles.addAssignedLeave__field}
                            />
                            <ErrorMessage
                              name={`leaves[${index}].leavePeriod`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Leave Plan Type */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div className={styles.labelWithTooltip}>
                              <label>Leave Plan Type<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                Choose how leave is calculated.
                              </span>
                            </div>
                            <Field
                              as="select"
                              name={`leaves[${index}].leavePlanType`}
                              className={styles.addAssignedLeave__field}
                            >
                              <option value="">Select</option>
                              <option value="working days">Working Days</option>
                              <option value="continuous days">
                                Continuous Days
                              </option>
                            </Field>
                            <ErrorMessage
                              name={`leaves[${index}].leavePlanType`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Carry Forward */}
                          <div className={styles.addAssignedLeave__fieldGroup}>
                            <div
                              className={styles.labelWithTooltip}
                            >
                              <label>Carry Forward<span className={styles.star}>*</span></label>
                              <span className={styles.labelTooltip}>
                                Choose “Yes” if unused leaves can be carried
                                forward to the next period.
                              </span>
                            </div>
                            <div className={styles.formGroupCheckbox}>
                              <label className={styles.checkboxLabel}>
                                <input
                                  type="radio"
                                  name={`leaves[${index}].carryForward`}
                                  checked={leave.carryForward === true}
                                  onChange={() =>
                                    setFieldValue(
                                      `leaves[${index}].carryForward`,
                                      true
                                    )
                                  }
                                  className={styles.checkboxInput}
                                />
                                <span className={styles.addAssignedLeave__YESNO}>
                                  {" "}
                                  Yes
                                </span>
                              </label>
                              <label className={styles.checkboxLabel}>
                                <input
                                  type="radio"
                                  name={`leaves[${index}].carryForward`}
                                  checked={leave.carryForward === false}
                                  onChange={() =>
                                    setFieldValue(
                                      `leaves[${index}].carryForward`,
                                      false
                                    )
                                  }
                                  className={styles.checkboxInput}
                                />
                                <span className={styles.addAssignedLeave__YESNO}>
                                  {" "}
                                  No
                                </span>
                              </label>
                            </div>
                            <ErrorMessage
                              name={`leaves[${index}].carryForward`}
                              component="div"
                              className={styles.addAssignedLeave__error}
                            />
                          </div>

                          {/* Max Count (only if carryForward = true) */}
                          {leave.carryForward === true && (
                            <div
                              className={styles.addAssignedLeave__fieldGroup}
                            >
                              <div
                                className={styles.labelWithTooltip}
                              >
                                <label>Max Count<span className={styles.star}>*</span></label>
                                <span className={styles.labelTooltip}>
                                  Maximum leave count that can be carried forward.
                                </span>
                              </div>
                              <Field
                                name={`leaves[${index}].maxCount`}
                                type="number"
                                min="0"
                                className={styles.addAssignedLeave__field}
                              />
                              <ErrorMessage
                                name={`leaves[${index}].maxCount`}
                                component="div"
                                className={styles.addAssignedLeave__error}
                              />
                            </div>
                          )}

                          {/* Delete Row */}
                          {values.leaves.length > 1 && (
                            <Icon
                              icon="mdi:delete"
                              className={styles.addAssignedLeave__deleteIcon}
                              onClick={() => remove(index)}
                            />
                          )}
                        </div>
                      ))}

                      {/* Add More Button */}
                      <div className={styles.addAssignedLeave__addMoreWrapper}>
                        <Button
                          type="button"
                          onClick={() => push(initialLeave)}
                          className={styles.addAssignedLeave__addMoreButton}
                          label={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Icon icon="mdi:plus" />
                              Add more Leave
                            </span>
                          }
                        />
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Footer */}
              <div className={styles.addAssignedLeave__modalFooter}>
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

export default AddAssignedLeaveModal;
