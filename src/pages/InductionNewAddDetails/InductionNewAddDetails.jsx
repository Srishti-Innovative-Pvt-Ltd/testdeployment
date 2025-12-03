import React from 'react';
import styles from './InductionNewAddDetails.module.css';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { inductionNewCardSchema } from "../../utils/ValidationSchema";

const formOptions = [
  { value: 'training-feedback', label: 'Training Feedback Form' },
  { value: 'appraisal-form', label: 'Appraisal Form' },
];

const initialForm = {
  title: '',
  file: null,
  audience: '',
  employeeDesignation: '',
  description: '',
  expectedCompletion: '',
};

const InductionNewAddDetails = () => {
  const nav = useNavigate();

  return (
    <DashboardLayout>
      <Formik
        initialValues={{
          forms: [initialForm],
          selectedForms: [],
        }}
        validationSchema={inductionNewCardSchema}
        onSubmit={(values) => {
          nav(-1);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.InductionNewAddDetailsContainer}>
            <FieldArray name="forms">
              {({ push }) => (
                <>
                  {values.forms.map((_, index) => (
                    <div key={index} className={styles.InductionNewAddDetailsMore}>
                      <h3 className={styles.InductionNewAddDetailsTitle}>Company Policies</h3>

                      <div className={styles.InductionNewAddDetailsFormRow}>
                        <div>
                          <label>Title</label>
                          <Field name={`forms[${index}].title`} placeholder="Introduction Video" />
                          <ErrorMessage name={`forms[${index}].title`} component="div" className={styles.error} />
                        </div>
                        <div>
                          <label>File Upload</label>
                          <input
                            type="file"
                            onChange={(e) =>
                              setFieldValue(`forms[${index}].file`, e.currentTarget.files[0])
                            }
                          />
                          <ErrorMessage name={`forms[${index}].file`} component="div" className={styles.error} />
                        </div>
                      </div>

                      <div className={styles.InductionNewAddDetailsFormRow}>
                        <div>
                          <label>Target Audience</label>
                          <div className={styles.InductionNewAddDetailsRadioGroup}>
                            <label>
                              <Field type="radio" name={`forms[${index}].audience`} value="all" />
                              All
                            </label>
                            <label>
                              <Field type="radio" name={`forms[${index}].audience`} value="custom" />
                              Custom
                            </label>
                          </div>
                          <ErrorMessage name={`forms[${index}].audience`} component="div" className={styles.error} />
                        </div>
                        <div>
                          <label>Employee Designation</label>
                          <Field
                            name={`forms[${index}].employeeDesignation`}
                            placeholder="Product Manager"
                          />
                          <ErrorMessage
                            name={`forms[${index}].employeeDesignation`}
                            component="div"
                            className={styles.error}
                          />
                        </div>
                      </div>

                      <div className={styles.InductionNewAddDetailsFormRow}>
                        <div>
                          <label>Description</label>
                          <Field
                            as="textarea"
                            name={`forms[${index}].description`}
                            placeholder="Description"
                          />
                          <ErrorMessage
                            name={`forms[${index}].description`}
                            component="div"
                            className={styles.error}
                          />
                        </div>
                        <div>
                          <label>Expected Completion Date</label>
                          <Field
                            name={`forms[${index}].expectedCompletion`}
                            placeholder="Eg. 5"
                          />
                          <ErrorMessage
                            name={`forms[${index}].expectedCompletion`}
                            component="div"
                            className={styles.error}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className={styles.InductionNewAddDetailsAddMore}
                    onClick={() => push(initialForm)}
                  >
                    + Add more content
                  </div>
                </>
              )}
            </FieldArray>

            <div className={styles.InductionNewAddDetailsFormDropdown}>
              <label>Form</label>
              <Select
                isMulti
                options={formOptions}
                name="selectedForms"
                value={values.selectedForms}
                onChange={(value) => setFieldValue('selectedForms', value)}
                placeholder="Select Forms"
              />
              <ErrorMessage name="selectedForms" component="div" className={styles.error} />
            </div>

            <div className={styles.InductionNewAddDetailsSaveButtonWrapper}>
              <PrimaryButton label="Save" type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export default InductionNewAddDetails;
