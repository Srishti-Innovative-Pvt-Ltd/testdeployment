import React from 'react';
import styles from './InductionCardEditModal.module.css';
import { Icon } from '@iconify/react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import Select from 'react-select'; 
import { useFormik } from 'formik';
import { inductionCardSchema } from '../../utils/ValidationSchema';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

const InductionCardEditModal = ({ onClose, mode }) => {
    useEscapeKey(onClose); 

  const options = [
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Designer', label: 'Designer' },
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      file: null,
      audience: '',
      employeeDesignation: [],
      description: '',
      expectedCompletion: '',
    },
    validationSchema: inductionCardSchema,
    onSubmit: (values) => {
      console.log('Form data:', values);
    },
  });

  const handleSelectChange = (selected) => {
    formik.setFieldValue('employeeDesignation', selected || []);
  };

  const handleFileChange = (e) => {
    formik.setFieldValue('file', e.currentTarget.files[0]);
  };

  return (
    <div className={styles.InductionCardEditModal__Overlay}>
      <div className={styles.InductionCardEditModal__Modal}>
        <div className={styles.InductionCardEditModal__Header}>
          <h5>{mode === 'add' ? 'Add' : 'Edit'}</h5>
          <Icon
            icon="mdi:close"
            className={styles.InductionCardEditModal__CloseIcon}
            onClick={onClose}
          />
        </div>
        <hr />

        <form onSubmit={formik.handleSubmit} className={styles.InductionCardEditModal__Content}>
          <div className={styles.InductionCardEditModal__Row}>
            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Introduction Video"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <span className={styles.errorText}>{formik.errors.title}</span>
              )}
            </div>

            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>File Upload</label>
              <input type="file" name="file" onChange={handleFileChange} />
              {formik.touched.file && formik.errors.file && (
                <span className={styles.errorText}>{formik.errors.file}</span>
              )}
            </div>
          </div>

          <div className={styles.InductionCardEditModal__Row}>
            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>Target Audience</label>
              <div className={styles.InductionCardEditModal__RadioGroup}>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="All"
                    checked={formik.values.audience === 'All'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  All
                </label>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="Custom"
                    checked={formik.values.audience === 'Custom'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  Custom
                </label>
              </div>
              {formik.touched.audience && formik.errors.audience && (
                <span className={styles.errorText}>{formik.errors.audience}</span>
              )}
            </div>

            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>Employee Designation</label>
              <Select
                options={options}
                isMulti
                name="employeeDesignation"
                value={formik.values.employeeDesignation}
                onChange={handleSelectChange}
                onBlur={() => formik.setFieldTouched('employeeDesignation', true)}
                placeholder="Select roles"
              />
              {formik.touched.employeeDesignation && formik.errors.employeeDesignation && (
                <span className={styles.errorText}>{formik.errors.employeeDesignation}</span>
              )}
            </div>
          </div>

          <div className={styles.InductionCardEditModal__Row}>
            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Introduction Video"
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <span className={styles.errorText}>{formik.errors.description}</span>
              )}
            </div>

            <div className={styles.InductionCardEditModal__InputGroup}>
              <label>Expected Completion Date</label>
              <input
                type="text"
                name="expectedCompletion"
                placeholder="Eg, 5"
                value={formik.values.expectedCompletion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.expectedCompletion && formik.errors.expectedCompletion && (
                <span className={styles.errorText}>{formik.errors.expectedCompletion}</span>
              )}
            </div>
          </div>

          <div className={styles.InductionCardEditModal__ButtonContainer}>
            <PrimaryButton type="submit" label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InductionCardEditModal;
