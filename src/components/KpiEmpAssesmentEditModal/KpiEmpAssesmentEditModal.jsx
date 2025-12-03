import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./KpiEmpAssesmentEditModal.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { kpiEmpAssesmentEditSchema } from "../../utils/ValidationSchema";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function KpiEmpAssesmentEditModal({ onClose }) {
    useEscapeKey(onClose); 

  const initialValues = {
    callsMonthly: "",
    dealsClosedYearly: "",
    meetingsHeldMonthly: "",
    newLeadsGeneratedYearly: "",
    dealsClosedYearlyPercentage: "",
    followUpsDoneYearly: "",
  };

  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit KPI Employee’s Assessment</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={kpiEmpAssesmentEditSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className={styles.formGrid}>
              {/* Input fields */}
              {[
                {
                  name: "callsMonthly",
                  label: "Calls (Monthly)",
                  placeholder: "4%",
                  suffix: "percentage",
                },
                {
                  name: "dealsClosedYearly",
                  label: "Deals Closed (Yearly)",
                  placeholder: "8",
                  suffix: "Number",
                },
                {
                  name: "meetingsHeldMonthly",
                  label: "Meetings Held (Monthly)",
                  placeholder: "10",
                  suffix: "Number",
                },
                {
                  name: "newLeadsGeneratedYearly",
                  label: "New Leads Generated (Yearly)",
                  placeholder: "7",
                  suffix: "Number",
                },
                {
                  name: "dealsClosedYearlyPercentage",
                  label: "Deals Closed (Yearly)",
                  placeholder: "2%",
                  suffix: "Percentage",
                },
                {
                  name: "followUpsDoneYearly",
                  label: "Follow-ups Done (Yearly)",
                  placeholder: "5",
                  suffix: "Number",
                },
              ].map(({ name, label, placeholder, suffix }, index) => (
                <div className={styles.inputGroup} key={index}>
                  <label htmlFor={name}>{label}</label>
                  <div className={styles.inputWithSuffix}>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      placeholder={placeholder}
                      value={values[name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors[name] && touched[name] ? styles.errorInput : ""
                      }
                    />
                    <span>{suffix}</span>
                  </div>

                  <ErrorMessage
                    name={name}
                    component="div"
                    className={styles.errorText}
                  />
                </div>
              ))}

              <div className={styles.submitButtonWrapper}>
                <PrimaryButton label="Submit" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default KpiEmpAssesmentEditModal;
