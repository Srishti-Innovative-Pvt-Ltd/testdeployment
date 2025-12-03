import React, { useEffect, useState } from "react";
import styles from "./PayrollAllocationModal.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Icon } from "@iconify/react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import Select from "react-select";
import { payrollAllocationModalSchema } from "../../utils/ValidationSchema";
import { getCompaniesByName } from "../../services/companyService";
import { getEmployeeCategories } from "../../services/settingsService";
import { getSalaryStructures } from "../../services/salaryService";    

function PayrollAllocationModal({
  onClose,
  initialData = {}, 
  onSubmit = () => {},   
  isEdit = false,
}) {
  useEscapeKey(onClose);

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payrollItems, setPayrollItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all companies initially
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompaniesByName();
        if (res.success) {
          const formattedCompanies = res.data.map((c) => ({
            value: c._id,
            label: c.companyName,
          }));
          setCompanies(formattedCompanies);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Load initial data for edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      loadEditData();
    }
  }, [isEdit, initialData]);

  const loadEditData = async () => {
    if (!initialData.companyId) return;

    setIsLoading(true);
    try {
      // Set company and categories for edit mode
      const categoryRes = await getEmployeeCategories(initialData.companyId);
      if (categoryRes.success) {
        const formatted = categoryRes.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategories(formatted);
      }

      // Use the allComponents from initialData for edit mode
      if (initialData.allComponents && initialData.allComponents.length > 0) {
        const formattedItems = initialData.allComponents.map((component) => ({
          key: component._id,
          label: component.label,
          type: component.valueType,
          value:
            component.valueType === "FIXED_AMOUNT"
              ? `₹ ${component.amount}`
              : `${component.percentage}%`,
        }));
        setPayrollItems(formattedItems);
      } else {
        // Fallback: fetch salary structure if allComponents is not available
        const salaryRes = await getSalaryStructures(initialData.companyId);
        if (salaryRes.success && salaryRes.data) {
          const salaryData = Array.isArray(salaryRes.data)
            ? salaryRes.data[0]
            : salaryRes.data;

          if (salaryData?.entries?.length) {
            const formattedItems = salaryData.entries.map((entry) => ({
              key: entry._id,
              label: entry.label,
              type: entry.valueType,
              value:
                entry.valueType === "FIXED_AMOUNT"
                  ? `₹ ${entry.amount}`
                  : `${entry.percentage}%`,
            }));
            setPayrollItems(formattedItems);
          }
        }
      }
    } catch (err) {
      console.error("Error loading edit data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and salary structure when company changes (for add mode)
  const handleCompanyChange = async (companyId, setFieldValue) => {
    setFieldValue("company", companyId);
    setFieldValue("employeeCategory", []);
    setPayrollItems([]);

    if (!companyId) {
      const res = await getEmployeeCategories();
      if (res.success) {
        const formatted = res.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategories(formatted);
      }
      return;
    }

    // Fetch categories for selected company
    const categoryRes = await getEmployeeCategories(companyId);
    if (categoryRes.success) {
      const formatted = categoryRes.data.map((cat) => ({ 
        value: cat._id,
        label: cat.name,
      }));
      setCategories(formatted);
    }

    // Fetch salary structure for the selected company
    const salaryRes = await getSalaryStructures(companyId);
    if (salaryRes.success && salaryRes.data) {
      const salaryData = Array.isArray(salaryRes.data)
        ? salaryRes.data[0]
        : salaryRes.data;

      if (salaryData?.entries?.length) {
        const formattedItems = salaryData.entries.map((entry) => ({
          key: entry._id,
          label: entry.label,
          type: entry.valueType,
          value:
            entry.valueType === "FIXED_AMOUNT"
              ? `₹ ${entry.amount}`
              : `${entry.percentage}%`,
        }));
        setPayrollItems(formattedItems);
      }
    }
  };

  // Build initial allocations object for edit mode
  const buildInitialAllocations = () => {
    if (!isEdit || !initialData.allocatedComponents) return {};
    
    const allocations = {};
    initialData.allocatedComponents.forEach(component => {
      allocations[component._id] = true;
    });
    return allocations;
  };

  const initialValues = {
    company: isEdit ? initialData.companyId : "",
    employeeCategory: isEdit
      ? [{ value: initialData.categoryId, label: initialData.categoryName }]
      : [],
    allocations: buildInitialAllocations(),
  };

  return (
    <div className={styles.payrollModalOverlay} role="dialog" aria-modal="true">
      <div className={styles.payrollModalContent}>
        <div className={styles.payrollModalHeader}>
          <h2>{isEdit ? "Edit Payroll Allocation" : "Add Payroll Allocation"}</h2>
          <Icon icon="mdi:close" className={styles.payrollCloseButton} onClick={onClose} />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={payrollAllocationModalSchema}
          onSubmit={async (values, actions) => {
            const payload = {
              ...values,
              employeeCategory: Array.isArray(values.employeeCategory)
                ? values.employeeCategory.map((opt) => opt.value)
                : [],
            };

            try {
              await onSubmit(payload);
            } catch (err) {
              console.error(err);
            } finally {
              actions.setSubmitting(false);
            }
          }}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, errors, touched, isSubmitting }) => (
            <Form className={styles.payrollForm} onSubmit={handleSubmit}>
              {/* Filters */}
              <div className={styles.filtersRow}>
                {/* Company Filter */}
                <div className={styles.filterControl}>
                  <label className={styles.filterLabel}>
                    Company<span className={styles.star}>*</span>
                  </label>
                  <Select
                    name="company"
                    options={companies}
                    value={companies.find((c) => c.value === values.company) || null}
                    onChange={(option) =>
                      handleCompanyChange(option ? option.value : "", setFieldValue)
                    }
                    placeholder="Select company..."
                    isClearable
                    isDisabled={isEdit} 
                    classNamePrefix="react-select"
                  />
                  <div className={styles.errorText}>
                    <ErrorMessage name="company" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className={styles.filterControl}>
                  <label className={styles.filterLabel}>
                    Employee Category<span className={styles.star}>*</span>
                  </label>
                  <Select
                    name="employeeCategory"
                    options={categories}
                    value={values.employeeCategory}
                    onChange={(selected) => setFieldValue("employeeCategory", selected || [])}
                    placeholder="Select category..."
                    isMulti
                    isDisabled={isEdit} 
                    classNamePrefix="react-select"
                  />
                  <div className={styles.errorText}>
                    <ErrorMessage name="employeeCategory" />
                  </div>
                </div>
              </div>

              {/* Salary allocation checkboxes */}
              <div className={styles.payrollsubHeadingSa}>
                Salary Allocation<span className={styles.star}>*</span>
              </div>

              <div className={styles.checkboxesWrap}>
                {isLoading ? (
                  <p>Loading salary components...</p>
                ) : (
                  <>
                    <div className={styles.payrollGrid}>
                      {payrollItems.length > 0 ? (
                        payrollItems.map((item) => (
                          <div key={item.key} className={styles.payrollItem}>
                            <Field name={`allocations.${item.key}`}>
                              {({ field }) => (
                                <input
                                  type="checkbox"
                                  {...field}
                                  id={`allocations.${item.key}`}
                                  checked={!!values.allocations[item.key]}
                                  onChange={(e) =>
                                    setFieldValue(`allocations.${item.key}`, e.target.checked)
                                  }
                                />
                              )}
                            </Field>  
                            <label 
                              htmlFor={`allocations.${item.key}`} 
                              className={styles.itemLabel}
                            >
                              {item.label}
                            </label>
                            <span className={styles.payrollValue}>{item.value}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{ gridColumn: "1 / -1", color: "#999" }}>
                          {isEdit 
                            ? "No salary components available" 
                            : "Select a company to view salary allocations"
                          }
                        </p>
                      )}
                    </div>

                    <div className={styles.errorText}>
                      {errors.allocations && touched.allocations ? errors.allocations : null}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.payrollSubmitRow}>
                <PrimaryButton 
                  label={isEdit ? "Update" : "Submit"} 
                  type="submit" 
                  disabled={isSubmitting || isLoading} 
                />
              </div> 
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PayrollAllocationModal;  

  