import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import styles from "./EmployeePayrollModal.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { payrollSchema } from "../../utils/ValidationSchema";
import { useSnackbar } from "notistack";

const EmployeePayrollModal = ({
  onClose,
  initialData = {},
  onSubmit = () => { },
  companies: parentCompanies = [],
}) => {
  useEscapeKey(onClose);
  const { enqueueSnackbar } = useSnackbar();

  const [companies, setCompanies] = useState(parentCompanies);
  const [step1Locked, setStep1Locked] = useState(!!initialData.company);

  useEffect(() => {
    if (parentCompanies?.length) {
      setCompanies(parentCompanies);
    } else {
      console.warn("No company list passed to EmployeePayrollModal");
    }
  }, [parentCompanies]);

  return (
    <div className={styles.EmployeePayrollOverlay}>
      <div className={styles.EmployeePayrollModal}>
        <div className={styles.EmployeePayrollModalHeader}>
          <h3>
            {initialData?.company ? "Edit Salary Structure" : "Add Salary Structure"}
          </h3>
          <Icon
            icon="mdi:close"
            className={styles.EmployeePayrollCloseIcon}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{
            componentId: initialData.componentId || "",
            structureId: initialData.structureId || "",
            company: initialData.company || "",
            calcType: initialData.calcType || "",
            percentValue: initialData.percentValue || "",
            entries: initialData.entries || [
              { label: "", entryType: "", valueType: "", percentage: "", amount: "" },
            ],
          }}
          enableReinitialize
          validationSchema={payrollSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ values, setFieldValue }) => {
          const handleCompanySelect = (e) => {
  const selectedCompanyId = e.target.value;
  setFieldValue("company", selectedCompanyId);

  // Find selected company in updated companies list
  const selectedCompany = companies.find(c => c._id === selectedCompanyId);

  if (selectedCompany?.salaryStructure) {
    const structure = selectedCompany.salaryStructure;
    setFieldValue("calcType", structure.calcType || "");
    setFieldValue("percentValue", structure.percentValue || "");
    setStep1Locked(true);

    enqueueSnackbar(
      `Salary structure already exists for ${selectedCompany.companyName}. Step 1 prefilled.`,
      { variant: "info" }
    );
  } else {
    setFieldValue("calcType", "");
    setFieldValue("percentValue", "");
    setStep1Locked(false);
  }
};



            const step1Valid =
              values.company && values.calcType && values.percentValue;

            return (
              <Form>
                {/* STEP 1 */}
                <div className={styles.section}>
                  <h4>Step 1: Company & Calculation</h4>

                  <div className={styles.EmployeePayrollFormRow}>
                    <div className={styles.EmployeePayrollInputGroup}>
                      <label>
                        Company <span className={styles.star}>*</span>
                      </label>
                      <Field
                        as="select"
                        name="company"
                        onChange={handleCompanySelect}
                        disabled={step1Locked}
                      >
                        <option value="">-- Select Company --</option>
                        {companies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.companyName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="company"
                        component="div"
                        className={styles.errorText}
                      />
                    </div>
                  </div>

                  <div className={styles.EmployeePayrollFormRow}>
                    <div className={styles.EmployeePayrollInputGroup}>
                      <label>
                        From where you want to calculate the salary?{" "}
                        <span className={styles.star}>*</span>
                      </label>
                      <Field
                        as="select"
                        name="calcType"
                        disabled={step1Locked}
                      >
                        <option value="">Select</option>
                        <option value="BASIC">Basic</option>
                        <option value="GROSS">Gross</option>
                      </Field>
                      <ErrorMessage
                        name="calcType"
                        component="div"
                        className={styles.errorText}
                      />
                    </div>
                  </div>

                  {values.calcType && (
                    <p className={styles.reimbursementInfoText}>
                      {values.calcType === "GROSS" ? "Basic = " : "Gross = "}
                      <Field
                        type="number"
                        name="percentValue"
                        placeholder="0"
                        min="0"
                        max="100"
                        className={styles.percentInput}
                        disabled={step1Locked}
                      />
                      %
                      {values.calcType === "GROSS" ? " of Gross" : " of Basic"}
                      <span className={styles.star}>*</span>
                      <ErrorMessage
                        name="percentValue"
                        component="div"
                        className={styles.errorText}
                      />
                    </p>
                  )}

                  {!step1Locked && step1Valid && (
                    <div className={styles.EmployeePayrollFormFooter}>
                      <PrimaryButton
                        type="button"
                        label="Save Step 1"
                        onClick={() => setStep1Locked(true)}
                      />
                    </div>
                  )}
                  {step1Locked && (
                    <div className={styles.EmployeePayrollFormFooter}>
                      <PrimaryButton
                        type="button"
                        label="Edit Step 1"
                        onClick={() => setStep1Locked(false)}
                      />
                    </div>
                  )}
                </div>

                {/* STEP 2 */}
                {step1Locked && (
                  <div className={styles.section}>
                    <h4>Step 2: Salary Components</h4>

                    <FieldArray name="entries">
                      {({ push, remove }) => (
                        <>
                          {values.entries.map((entry, index) => (
                            <div key={index} className={styles.salaryEntry}>
                              {/* Label + Entry Type */}
                              <div className={styles.EmployeePayrollFormRow}>
                                <div className={styles.EmployeePayrollInputGroup}>
                                  <label>
                                 Allowance Name <span className={styles.star}>*</span>
                                  </label>
                                  <Field
                                    type="text"
                                    name={`entries[${index}].label`}
                                  />
                                  <ErrorMessage
                                    name={`entries[${index}].label`}
                                    component="div"
                                    className={styles.errorText}
                                  />
                                </div>

                                <div className={styles.EmployeePayrollInputGroup}>
                                  <label>
                                    Entry Type <span className={styles.star}>*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    name={`entries[${index}].entryType`}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="BENEFIT">Benefit</option>
                                    <option value="CREDIT">Credit</option>
                                    <option value="DEDUCTION">Deduction</option>
                                  </Field>
                                  <ErrorMessage
                                    name={`entries[${index}].entryType`}
                                    component="div"
                                    className={styles.errorText}
                                  />
                                </div>
                              </div>

                              {/* Value Type */}
                              <div className={styles.EmployeePayrollFormRow}>
                                <div className={styles.EmployeePayrollInputGroup}>
                                  <label>
                                    Value Type <span className={styles.star}>*</span>
                                  </label>
                                  <div className={styles.EmployeePayrollRadioGroup}>
                                    <label>
                                      <Field
                                        type="radio"
                                        name={`entries[${index}].valueType`}
                                        value="PERCENTAGE"
                                      />
                                      Percentage
                                    </label>
                                    <label>
                                      <Field
                                        type="radio"
                                        name={`entries[${index}].valueType`}
                                        value="FIXED_AMOUNT"
                                      />
                                      Fixed Amount
                                    </label>
                                  </div>
                                  <ErrorMessage
                                    name={`entries[${index}].valueType`}
                                    component="div"
                                    className={styles.errorText}
                                  />
                                </div>

                                {entry.valueType === "PERCENTAGE" && (
                                  <div className={styles.EmployeePayrollInputGroup}>
                                    <label>
                                      Percentage Value{" "}
                                      <span className={styles.star}>*</span>
                                    </label>
                                    <Field
                                      type="number"
                                      name={`entries[${index}].percentage`}
                                      min="0"
                                    />
                                    <ErrorMessage
                                      name={`entries[${index}].percentage`}
                                      component="div"
                                      className={styles.errorText}
                                    />
                                  </div>
                                )}

                                {entry.valueType === "FIXED_AMOUNT" && (
                                  <div className={styles.EmployeePayrollInputGroup}>
                                    <label>
                                      Amount <span className={styles.star}>*</span>
                                    </label>
                                    <Field
                                      type="number"
                                      name={`entries[${index}].amount`}
                                      min="0"
                                    />
                                    <ErrorMessage
                                      name={`entries[${index}].amount`}
                                      component="div"
                                      className={styles.errorText}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Add/Remove Buttons */}
                              <div className={styles.reimbursementBtnGroup}>
                                <button
                                  type="button"
                                  className={`${styles.reimbursementAddBtn} ${styles.blueBtn}`}
                                  onClick={() =>
                                    push({
                                      label: "",
                                      entryType: "",
                                      valueType: "",
                                      percentage: "",
                                      amount: "",
                                    })
                                  }
                                >
                                  +
                                </button>
                                {values.entries.length > 1 && (
                                  <button
                                    type="button"
                                    className={`${styles.reimbursementRemoveBtn} ${styles.redBtn}`}
                                    onClick={() => remove(index)}
                                  >
                                    -
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )} 
                    </FieldArray>

                    <div className={styles.reimbursementModalFooter}>
                      <PrimaryButton label="Save Structure" type="submit" />
                    </div>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeePayrollModal;