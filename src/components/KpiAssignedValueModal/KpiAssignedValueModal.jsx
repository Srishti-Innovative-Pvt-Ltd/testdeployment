import React from 'react';
import styles from './KpiAssignedValueModal.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { kpiAssignedValueSchema } from '../../utils/ValidationSchema';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

const kpiFields = [
  { name: 'calls', label: 'Calls (Monthly)' },
  { name: 'dealsClosed', label: 'Deals Closed (Monthly)' },
  { name: 'meetings', label: 'Meetings (Monthly)' },
  { name: 'leadFollowUp', label: 'Lead Follow-up (Monthly)' },
  { name: 'bugFixes', label: 'Bug Fixes (Yearly)' },
  { name: 'contentCreated', label: 'Content Created (Monthly)' },
  { name: 'customerTickets', label: 'Customer Tickets (Monthly)' },
  { name: 'codeCommits', label: 'Code Commits (Yearly)' },
];

const initialValues = {
  calls: '',
  dealsClosed: '',
  meetings: '',
  leadFollowUp: '',
  bugFixes: '',
  contentCreated: '',
  customerTickets: '',
  codeCommits: '',
};

function KpiAssignedValueModal({ onClose }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles.KpiAssignedValueModalOverlay}>
      <div className={styles.KpiAssignedValueModalContainer}>
        <div className={styles.KpiAssignedValueModalHeader}>
          <h3>Edit KPI Values</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={kpiAssignedValueSchema}
          onSubmit={(values) => {
            console.log('Submitted KPI Values:', values);
            onClose(); 
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className={styles.KpiAssignedValueModalForm}>
                {kpiFields.map((field) => (
                  <div key={field.name} className={styles.KpiAssignedValueModalField}>
                    <label>{field.label}</label>
                    <div className={styles.inputWrapper}>
                      <Field type="number" name={field.name} />
                      <span>Number</span>
                    </div>
                    <ErrorMessage name={field.name} component="div" className={styles.error} />
                  </div>
                ))}
              </div>

              <div className={styles.KpiAssignedValueModalFooter}>
                <PrimaryButton
                  label="Submit"
                  type="submit"
                  className={styles.submitButton}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default KpiAssignedValueModal;
