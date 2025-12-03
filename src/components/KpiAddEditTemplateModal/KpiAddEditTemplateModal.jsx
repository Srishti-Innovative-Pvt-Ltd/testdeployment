import React from 'react';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './KpiAddEditTemplateModal.module.css';
import { Icon } from '@iconify/react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { kpiAddEditTemplateModalSchema } from '../../utils/ValidationSchema';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

const departmentOptions = [
  { label: 'HR', value: 'hr' },
  { label: 'Engineering', value: 'eng' },
];

const designationOptions = [
  { label: 'Manager', value: 'mgr' },
  { label: 'Developer', value: 'dev' },
];

const targetTypeOptions = [
  { label: 'Value', value: 'value' },
];

const frequencyOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
];

function KpiAddEditTemplateModal({ onClose, isEdit = false }) {
  useEscapeKey(onClose);

  const initialValues = {
    department: '',
    designation: '',
    kpiParam: '',
    targetType: '',
    frequency: '',
  };

  const handleSubmit = (values) => {
    console.log('Submitted:', values);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>{isEdit ? 'Edit KPI Template Creations' : 'KPI Template Creations'}</span>
          <Icon icon="mdi:close" className={styles.closeIcon} onClick={onClose} />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={kpiAddEditTemplateModalSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  {/* Department */}
                  <div className={styles.formGroup}>
                    <label htmlFor="department" className={styles.label}>Department</label>
                    <Select
                      id="department"
                      options={departmentOptions}
                      value={departmentOptions.find(option => option.value === values.department)}
                      onChange={(option) => setFieldValue('department', option.value)}
                      className={styles.selectContainer}
                      classNamePrefix="customSelect"
                    />
                    <ErrorMessage name="department" component="div" className={styles.errorMessage} />
                  </div>

                  {/* Designation */}
                  <div className={styles.formGroup}>
                    <label htmlFor="designation" className={styles.label}>Designation</label>
                    <Select
                      id="designation"
                      options={designationOptions}
                      value={designationOptions.find(option => option.value === values.designation)}
                      onChange={(option) => setFieldValue('designation', option.value)}
                      className={styles.selectContainer}
                      classNamePrefix="customSelect"
                    />
                    <ErrorMessage name="designation" component="div" className={styles.errorMessage} />
                  </div>

                  {/* KPI Param */}
                  <div className={styles.formGroup}>
                    <label htmlFor="kpiParam" className={styles.label}>KPI Parameter</label>
                    <Field
                      name="kpiParam"
                      id="kpiParam"
                      placeholder="Text"
                      className={styles.input}
                    />
                    <ErrorMessage name="kpiParam" component="div" className={styles.errorMessage} />
                  </div>

                  {/* Target Type */}
                  <div className={styles.formGroup}>
                    <label htmlFor="targetType" className={styles.label}>Target Type</label>
                    <Select
                      id="targetType"
                      options={targetTypeOptions}
                      value={targetTypeOptions.find(option => option.value === values.targetType)}
                      onChange={(option) => setFieldValue('targetType', option.value)}
                      className={styles.selectContainer}
                      classNamePrefix="customSelect"
                    />
                    <ErrorMessage name="targetType" component="div" className={styles.errorMessage} />
                  </div>

                  {/* Frequency */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="frequency" className={styles.label}>Frequency</label>
                    <Select
                      id="frequency"
                      options={frequencyOptions}
                      value={frequencyOptions.find(option => option.value === values.frequency)}
                      onChange={(option) => setFieldValue('frequency', option.value)}
                      className={styles.selectContainer}
                      classNamePrefix="customSelect"
                    />
                    <ErrorMessage name="frequency" component="div" className={styles.errorMessage} />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <PrimaryButton label="Save" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default KpiAddEditTemplateModal;
