import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './Dependents.module.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { dependentsSchema } from '../../utils/ValidationSchema';
import { addEmployeeDependents, getEmployeeDependanceInfo, getDependentsRejectionReasons } from '../../services/addEmployeeService';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { getUserRole, getVerificationStatus } from "../../utils/roleUtils";
import RejectedReasonList from '../../components/RejectedReasonList/RejectedReasonList';

const initialValues = {
  fatherContactNumber: '',
  fatherName: '',
  fatherOccupation: '',
  motherContactNumber: '',
  motherName: '',
  motherOccupation: '',
  isMarried: false,
  spouseName: '',
  spouseOccupation: '',
  spouseContactNumber: '',
  spouseQualification: '',
  hasKids: false,
  numberOfKids: '',
  kidsAges: '',
  kidsActivities: ''
};

function Dependents({ onNext, user_id, onBack }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState(initialValues);
  const role = getUserRole();
  const verificationStatus = getVerificationStatus();
  const [rejectedFields, setRejectedFields] = useState([]);

  const fetchRejectionReasons = async () => {
    if (verificationStatus === "rejected" && role !== "admin") {
      const res = await getDependentsRejectionReasons(user_id);
      if (res.success && res.data?.rejectionReasons) {
        const staticLabels = {
          fatherName: "Father Name",
          fatherContactNumber: "Father Contact Number",
          fatherOccupation: "Father Occupation",
          motherName: "Mother Name",
          motherContactNumber: "Mother Contact Number",
          motherOccupation: "Mother Occupation",
          spouseName: "Spouse Name",
          spouseOccupation: "Spouse Occupation",
          spouseContactNumber: "Spouse Contact Number",
          spouseQualification: "Spouse Qualification"
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
    const fetchDependents = async () => {
      const res = await getEmployeeDependanceInfo(user_id);

      if (res.success && res.data) {
        const info = res.data;
        setInitialFormData({
          fatherContactNumber: info.fatherContactNumber?.value || '',
          fatherName: info.fatherName?.value || '',
          fatherOccupation: info.fatherOccupation?.value || '',
          motherContactNumber: info.motherContactNumber?.value || '',
          motherName: info.motherName?.value || '',
          motherOccupation: info.motherOccupation?.value || '',
          isMarried: Boolean(info.isMarried ?? false),
          spouseName: info.spouseName?.value || '',
          spouseOccupation: info.spouseOccupation?.value || '',
          spouseContactNumber: info.spouseContactNumber?.value || '',
          spouseQualification: info.spouseQualification?.value || '',
          hasKids: Boolean(info.hasKids ?? false),
          numberOfKids: info.numberOfKids?.value?.toString() || '',
          kidsAges: info.kidsAges?.value || '',
          kidsActivities: info.kidsActivities?.value || ''
        });
      }
      if (verificationStatus === "rejected" && role !== "admin") {
        await fetchRejectionReasons();
      }
    };

    if (user_id) fetchDependents();
  }, [user_id]);

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={dependentsSchema}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await addEmployeeDependents(user_id, values);
          console.log('Dependents Submitted:', response);
          if (response.success) {
            enqueueSnackbar('Dependents saved successfully!', {
              variant: 'success',
              autoHideDuration: 3000
            });
            if (role === "admin") {
              navigate("/pages/EmployeeData");
            } else {
              navigate("/VerificationProgressDashboard");
            }
          } else {
            enqueueSnackbar(response.message || "Submission failed", {
              variant: 'error',
              autoHideDuration: 4000
            });
          }
        } catch (error) {
          enqueueSnackbar("An unexpected error occurred.", {
            variant: 'error',
            autoHideDuration: 4000
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          {rejectedFields.length > 0 && (
            <RejectedReasonList rejectedFields={rejectedFields} />
          )}
          <Card title="Dependents" icon="mdi:account-group">
            <div className={styles.grid}>

              {/* Father Info */}
              <div className={styles.field}>
                <label>Father Name<span className={styles.star}>*</span> </label>
                <Field type="text" name="fatherName" />
                <ErrorMessage name="fatherName" component="div" className={styles.error} />
              </div>
              <div className={styles.field}>
                <label>Father Contact Number<span className={styles.star}>*</span></label>
                <Field type="text" name="fatherContactNumber"
                  onInput={(e) => {
                     e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }} />
                <ErrorMessage name="fatherContactNumber" component="div" className={styles.error} />
              </div>
              <div className={styles.field}>
                <label>Father Occupation<span className={styles.star}>*</span></label>
                <Field type="text" name="fatherOccupation" />
                <ErrorMessage name="fatherOccupation" component="div" className={styles.error} />
              </div>

              {/* Mother Info */}
              <div className={styles.field}>
                <label>Mother Name<span className={styles.star}>*</span> </label>
                <Field type="text" name="motherName" />
                <ErrorMessage name="motherName" component="div" className={styles.error} />
              </div>
              <div className={styles.field}>
                <label>Mother Contact Number<span className={styles.star}>*</span></label>
                <Field type="text" name="motherContactNumber"
                  onInput={(e) => {
                     e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }} />
                <ErrorMessage name="motherContactNumber" component="div" className={styles.error} />
              </div>
              <div className={styles.field}>
                <label>Mother Occupation<span className={styles.star}>*</span></label>
                <Field type="text" name="motherOccupation" />
                <ErrorMessage name="motherOccupation" component="div" className={styles.error} />
              </div>

              <hr className={styles.divider} />

              {/* Marital Status */}
              <div className={styles.field}>
                <label>Are you Married?<span className={styles.star}>*</span></label>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name="isMarried"
                      checked={values.isMarried === true}
                      onChange={() => setFieldValue("isMarried", true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="isMarried"
                      checked={values.isMarried === false}
                      onChange={() => setFieldValue("isMarried", false)}
                    /> No
                  </label>
                </div>
                <ErrorMessage name="isMarried" component="div" className={styles.error} />
              </div>

              {/* Spouse Info */}
              {values.isMarried && (
                <>
                  <div className={styles.field}>
                    <label>Spouse Name<span className={styles.star}>*</span></label>
                    <Field type="text" name="spouseName" />
                    <ErrorMessage name="spouseName" component="div" className={styles.error} />
                  </div>
                  <div className={styles.field}>
                    <label>Spouse Occupation<span className={styles.star}>*</span></label>
                    <Field type="text" name="spouseOccupation" />
                    <ErrorMessage name="spouseOccupation" component="div" className={styles.error} />
                  </div>
                  <div className={styles.field}>
                    <label>Spouse Contact Number<span className={styles.star}>*</span></label>
                    <Field type="text" name="spouseContactNumber" 
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }}/>
                    <ErrorMessage name="spouseContactNumber" component="div" className={styles.error} />
                  </div>
                  <div className={styles.field}>
                    <label>Spouse Qualification<span className={styles.star}>*</span></label>
                    <Field type="text" name="spouseQualification" />
                    <ErrorMessage name="spouseQualification" component="div" className={styles.error} />
                  </div>

                  {/* Kids Info */}
                  <div className={styles.field}>
                    <label>Do you have Kids?<span className={styles.star}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label>
                        <input
                          type="radio"
                          name="hasKids"
                          checked={values.hasKids === true}
                          onChange={() => setFieldValue("hasKids", true)}
                        /> Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="hasKids"
                          checked={values.hasKids === false}
                          onChange={() => setFieldValue("hasKids", false)}
                        /> No
                      </label>
                    </div>
                    <ErrorMessage name="hasKids" component="div" className={styles.error} />
                  </div>

                  {values.hasKids && (
                    <>
                      <div className={styles.field}>
                        <label>How many kids?<span className={styles.star}>*</span></label>
                        <Field type="text" name="numberOfKids" />
                        <ErrorMessage name="numberOfKids" component="div" className={styles.error} />
                      </div>
                      <div className={styles.field}>
                        <label>How old are your kids?<span className={styles.star}>*</span></label>
                        <Field type="text" name="kidsAges" />
                        <ErrorMessage name="kidsAges" component="div" className={styles.error} />
                      </div>
                      <div className={styles.field}>
                        <label>What is your kid(s) doing?<span className={styles.star}>*</span></label>
                        <Field type="text" name="kidsActivities" />
                        <ErrorMessage name="kidsActivities" component="div" className={styles.error} />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className={styles.buttonGroup}>
              {role === "admin" && (
                <Button label="Skip" secondary type="button" onClick={() => navigate('/pages/EmployeeData')} />
              )}

              <Button label="Complete Process" type="submit" />
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default Dependents;
