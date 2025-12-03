import React from 'react';
import styles from './InductionAddNewCardModal.module.css';
import { Icon } from '@iconify/react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { inductionAddCardSchema } from '../../utils/ValidationSchema';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

const InductionAddNewCardModal = ({ onClose }) => {
    useEscapeKey(onClose); 

     
  const navigate=useNavigate();
  

  const formik = useFormik({
    initialValues: {
      title: 'Company Policies',
    },
    validationSchema: inductionAddCardSchema,
    onSubmit: (values) => {
      navigate('/pages/InductionNewAddDetails', { state: { title: values.title } });
    },
  });

  return (
    <div className={styles.InductionAddNewCardModal__Overlay}>
      <div className={styles.InductionAddNewCardModal__Modal}>
        <div className={styles.InductionAddNewCardModal__Header}>
          <h5 className={styles.InductionAddNewCardModal__Title}>Title</h5>
          <Icon
            icon="mdi:close"
            className={styles.InductionAddNewCardModal__CloseIcon}
            onClick={onClose}
          />
        </div>

        <hr />

        <form onSubmit={formik.handleSubmit} className={styles.InductionAddNewCardModal__Body}>
          <label className={styles.InductionAddNewCardModal__Label}>Title</label>
          <input
            className={styles.InductionAddNewCardModal__Input}
            type="text"
            placeholder='Add Title'
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <span className={styles.errorText}>{formik.errors.title}</span>
          )}

          <div className={styles.InductionAddNewCardModal__ButtonWrapper}>
            <PrimaryButton type="submit" label="Save"  />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InductionAddNewCardModal;
