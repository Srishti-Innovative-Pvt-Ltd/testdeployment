import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './HealthInfo.module.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { healthInfoSchema } from '../../utils/ValidationSchema';
import { addEmployeeHealthInfo, getEmployeeHealthInfo ,getHealthInfoRejectionReasons} from '../../services/addEmployeeService';
import { useSnackbar } from 'notistack';
import { getUserRole, getVerificationStatus } from "../../utils/roleUtils";
import RejectedReasonList from '../../components/RejectedReasonList/RejectedReasonList';

const initialValues = {
  bloodGroup: '',
  heightInCm: '',
  weightInKg: '',
  hasHealthIssue: false,
  takesMedication: false,
  isAllergic: false,
  healthIssueDetails: '',
  medicationDetails: '',
  allergyDetails: '',
};

function HealthInfo({ user_id, onNext }) {
  const { enqueueSnackbar } = useSnackbar();
  const [initialFormData, setInitialFormData] = useState(initialValues);
  const role = getUserRole();
  const verificationStatus = getVerificationStatus();
const [rejectedFields, setRejectedFields] = useState([]);

const fetchRejectionReasons = async () => {
  if (verificationStatus === "rejected" && role !== "admin") {
    const res = await getHealthInfoRejectionReasons(user_id);
    if (res.success && res.data?.rejectionReasons) {
      const staticLabels = {
        bloodGroup: "Blood Group",
        heightInCm: "Height (cm)",
        weightInKg: "Weight (kg)",
        healthIssueDetails: "Health Issue Details",
        medicationDetails: "Medication Details",
        allergyDetails: "Allergy Details"
      };

      const rejectedArray = Object.entries(res.data.rejectionReasons).map(
        ([field, reason]) => ({
          fieldName: staticLabels[field] || field,
          reason
        })
      );
      setRejectedFields(rejectedArray);
    }
  }
};

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEmployeeHealthInfo(user_id);
      if (result.success && result.data) {
        const info = result.data;
        setInitialFormData({
          bloodGroup: info.bloodGroup?.value || '',
          heightInCm: info.heightInCm?.value || '',
          weightInKg: info.weightInKg?.value || '',
          hasHealthIssue: Boolean(info.hasHealthIssue),
          takesMedication: Boolean(info.takesMedication),
          isAllergic: Boolean(info.isAllergic),
          healthIssueDetails: info.healthIssueDetails?.value || '',
          medicationDetails: info.medicationDetails?.value || '',
          allergyDetails: info.allergyDetails?.value || '',
        });
      } else {
        setInitialFormData(initialValues);
        if (!result.success) {
          enqueueSnackbar(result.message || 'Failed to load health info.', {
            variant: 'error',
          });
        }
      }
       if (verificationStatus === "rejected" && role !== "admin") {
      await fetchRejectionReasons();
    }
    };
    fetchData();
  }, [user_id, enqueueSnackbar]);

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={healthInfoSchema}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const response = await addEmployeeHealthInfo(user_id, values);
          if (response.success) {
            enqueueSnackbar('Health information saved successfully!', {
              variant: 'success',
              autoHideDuration: 3000
            });
            onNext();
          } else {
            enqueueSnackbar(response.message || 'Failed to save health information', {
              variant: 'error',
              autoHideDuration: 5000
            });
          }
        } catch (err) {
          enqueueSnackbar('Something went wrong. Please try again.', {
            variant: 'error',
            autoHideDuration: 5000
          });
          console.error("Unexpected error:", err);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className={styles.formContainer}>
           {rejectedFields.length > 0 && (
          <RejectedReasonList rejectedFields={rejectedFields} />
        )}
          <Card title="Health Info" icon="mdi:medical-bag">
            <div className={styles.formGrid}>
              {/* Blood Group */}
              <div className={styles.formField}>
                <label className={styles.label}>Blood Group<span className={styles.star}>*</span></label>
                <Field as="select" name="bloodGroup" className={styles.bloodGroupSelect}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Field>
                <ErrorMessage name="bloodGroup" component="div" className={styles.errorMessage} />
              </div>

              {/* Height */}
              <div className={styles.formField}>
                <label className={styles.label}>Height in CM<span className={styles.star}>*</span></label>
                <Field type="number" name="heightInCm" className={styles.input} min="0"/>
                <ErrorMessage name="heightInCm" component="div" className={styles.errorMessage} />
              </div>

              {/* Weight */}
              <div className={styles.formField}>
                <label className={styles.label}>Weight in KG<span className={styles.star}>*</span></label>
                <Field type="number" name="weightInKg" className={styles.input} min="0"/>
                <ErrorMessage name="weightInKg" component="div" className={styles.errorMessage} />
              </div>

              {/* Health Issue */}
              <div className={styles.formField}>
                <label className={styles.label}>Any Health Issues?<span className={styles.star}>*</span></label>
                <div className={styles.radioOptions}>
                  <label>
                    <Field
                      type="radio"
                      name="hasHealthIssue"
                      value={true}
                      checked={values.hasHealthIssue === true}
                      onChange={() => setFieldValue('hasHealthIssue', true)}
                    /> Yes
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="hasHealthIssue"
                      value={false}
                      checked={values.hasHealthIssue === false}
                      onChange={() => setFieldValue('hasHealthIssue', false)}
                    /> No
                  </label>
                </div>
                <ErrorMessage name="hasHealthIssue" component="div" className={styles.errorMessage} />
              </div>

              {values.hasHealthIssue && (
                <div className={styles.formField}>
                  <label className={styles.label}>Health Issues<span className={styles.star}>*</span></label>
                  <Field as="textarea" name="healthIssueDetails" className={styles.textarea} />
                  <ErrorMessage name="healthIssueDetails" component="div" className={styles.errorMessage} />
                </div>
              )}

              {/* Medication */}
              <div className={styles.formField}>
                <label className={styles.label}>Are you taking any medications?<span className={styles.star}>*</span></label>
                <div className={styles.radioOptions}>
                  <label>
                    <Field
                      type="radio"
                      name="takesMedication"
                      value={true}
                      checked={values.takesMedication === true}
                      onChange={() => setFieldValue('takesMedication', true)}
                    /> Yes
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="takesMedication"
                      value={false}
                      checked={values.takesMedication === false}
                      onChange={() => setFieldValue('takesMedication', false)}
                    /> No
                  </label>
                </div>
                <ErrorMessage name="takesMedication" component="div" className={styles.errorMessage} />
              </div>

              {values.takesMedication && (
                <div className={styles.formField}>
                  <label className={styles.label}>What medicine are you taking?<span className={styles.star}>*</span></label>
                  <Field as="textarea" name="medicationDetails" className={styles.textarea} />
                  <ErrorMessage name="medicationDetails" component="div" className={styles.errorMessage} />
                </div>
              )}

              {/* Allergy */}
              <div className={styles.formField}>
                <label className={styles.label}>Are you allergic to anything?<span className={styles.star}>*</span></label>
                <div className={styles.radioOptions}>
                  <label>
                    <Field
                      type="radio"
                      name="isAllergic"
                      value={true}
                      checked={values.isAllergic === true}
                      onChange={() => setFieldValue('isAllergic', true)}
                    /> Yes
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="isAllergic"
                      value={false}
                      checked={values.isAllergic === false}
                      onChange={() => setFieldValue('isAllergic', false)}
                    /> No
                  </label>
                </div>
                <ErrorMessage name="isAllergic" component="div" className={styles.errorMessage} />
              </div>

              {values.isAllergic && (
                <div className={styles.formField}>
                  <label className={styles.label}>What type of allergy do you have?<span className={styles.star}>*</span></label>
                  <Field as="textarea" name="allergyDetails" className={styles.textarea} />
                  <ErrorMessage name="allergyDetails" component="div" className={styles.errorMessage} />
                </div>
              )}

            </div>

            <div className={styles.formActions}>
              {role === "admin" && (
                <Button label="Skip" secondary type="button" onClick={onNext} />
              )}
              <Button label="Next" type="submit" />
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default HealthInfo;
