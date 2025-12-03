import React from "react";
import styles from "./EmployeePayrollAllocationModal.module.css";
import { Formik, Form, Field } from "formik";
import { Icon } from "@iconify/react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { employeePayrollAllocationModalSchema } from "../../utils/ValidationSchema";

function EmployeePayrollAllocationModal({ onClose, initialData = {}, onSubmit = () => { } }) {
  useEscapeKey(onClose);

  const availableComponents = initialData.available || [];
  const allocatedIds = (initialData.allocated || []).map((item) => item._id);

  const initialValues = {
    allocations: availableComponents.reduce((acc, comp) => {
      acc[comp._id] = allocatedIds.includes(comp._id);
      return acc;
    }, {}),
  };

  return (
    <div className={styles.employeePayrollAllocationModalOverlay}>
      <div className={styles.employeePayrollAllocationModalContent}>
        {/* Header */}
        <div className={styles.employeePayrollAllocationModalHeader}>
          <h2>Employee Payroll Allocation</h2>
          <Icon
            icon="mdi:close"
            className={styles.employeePayrollAllocationModalCloseButton}
            onClick={onClose}
          />
        </div>

        {/* Formik Form */}
       <Formik
  initialValues={initialValues}
  validationSchema={employeePayrollAllocationModalSchema}
  enableReinitialize={true}
  onSubmit={async (values, actions) => {
    const selectedIds = Object.keys(values.allocations).filter(
      (key) => values.allocations[key]
    );

    // Send array of IDs directly
    await onSubmit(initialData.id, selectedIds);

    actions.setSubmitting(false);
  }}
>

          {({ values, setFieldValue, errors, touched }) => (
            <Form className={styles.employeePayrollAllocationModalForm}>
              <div className={styles.employeePayrollAllocationModalSubHeading}>
                Salary Allocation
                <span className={styles.employeePayrollAllocationModalStar}>*</span>
              </div>

              {/* Scrollable checkboxes container */}
              <div className={styles.employeePayrollAllocationModalCheckboxesWrap}>
                {availableComponents.length > 0 ? (
                  <div className={styles.employeePayrollAllocationModalGrid}>
                    {availableComponents.map((comp) => (
                      <div
                        key={comp._id}
                        className={styles.employeePayrollAllocationModalItem}
                      >
                        <Field name={`allocations.${comp._id}`}>
                          {({ field }) => (
                            <input
                              type="checkbox"
                              {...field}
                              checked={values.allocations[comp._id]}
                              onChange={() =>
                                setFieldValue(
                                  `allocations.${comp._id}`,
                                  !values.allocations[comp._id]
                                )
                              }
                            />
                          )}
                        </Field>
                        <label className={styles.employeePayrollAllocationModalItemLabel}>
                          {comp.label}
                          </label>
                          <span className={styles.employeePayrollAllocationModalValue}>{comp.percentage
                            ? `  ${comp.percentage}%`
                            : comp.amount
                              ? `  ₹${comp.amount}`
                              : ""}
                              </span>   
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No components available</p>
                )}

                {errors.allocations && touched.allocations && (
                  <div className={styles.employeePayrollAllocationModalErrorText}>
                    {errors.allocations}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className={styles.employeePayrollAllocationModalSubmitRow}>
                <PrimaryButton label="Update" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EmployeePayrollAllocationModal;
