import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { backgroundVerificationSchema } from "../../utils/ValidationSchema";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import styles from "./BackgroundVerification.module.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Icon } from "@iconify/react";

const BackgroundVerification = ({ onNext }) => {
  const [filePreviews, setFilePreviews] = useState({});

  const handleFileChange = (e, name, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue(name, file);
      const url = URL.createObjectURL(file);
      setFilePreviews((prev) => ({ ...prev, [name]: url }));
    }
  };

  return (
    <DashboardLayout>
      <Formik
        initialValues={{
          externalVerification: "",
          agencyName: "",
          contactPerson: "",
          agencyContact: "",
          verificationReport: null,
          highestQualification: "",
          universityName: "",
          yearOfPassing: "",
          degreeCertificate: null,
          previousCompany: "",
          relievingLetter: null,
          criminalRecord: "",
          criminalDetails: "",
        }}
        validationSchema={backgroundVerificationSchema}
        onSubmit={(values) => {
          console.log("Background Verification:", values);
          onNext();
        }}
      >
        {({ setFieldValue }) => (
          <Form className={styles.BackgroundVerificationFormContainer}>
            <Card title="Background Verification" icon="mdi:account-search-outline">
              {/* Section 1 */}
              <div className={styles.BackgroundVerificationGrid3}>
                <div className={styles.BackgroundVerificationRadioGroup}>
                  <label>Is this verification done by an external agency?<span className={styles.star}>*</span></label>
                  <div className={styles.BackgroundVerificationRadioOptions}>
                    <label>
                      <Field type="radio" name="externalVerification" value="Yes" /> Yes
                    </label>
                    <label>
                      <Field type="radio" name="externalVerification" value="No" /> No
                    </label>
                  </div>
                  <ErrorMessage name="externalVerification" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Agency Name<span className={styles.star}>*</span></label>
                  <Field name="agencyName" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="agencyName" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Contact Person<span className={styles.star}>*</span></label>
                  <Field name="contactPerson" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="contactPerson" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Agency Contact Number<span className={styles.star}>*</span></label>
                  <Field name="agencyContact" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="agencyContact" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Verification Report Upload<span className={styles.star}>*</span></label>
                  <div className={styles.BackgroundVerificationUploadWithIcon}>
                    <input
                      type="file"
                      name="verificationReport"
                      onChange={(e) => handleFileChange(e, "verificationReport", setFieldValue)}
                      className={styles.BackgroundVerificationFormInput}
                    />
                    {filePreviews.verificationReport && (
                      <Icon
                        icon="mdi:eye"
                        className={styles.BackgroundVerificationEyeIcon}
                        onClick={() => window.open(filePreviews.verificationReport, "_blank")}
                      />
                    )}
                  </div>
                  <ErrorMessage name="verificationReport" component="div" className={styles.BackgroundVerificationError} />
                </div>
              </div>

              <br />

              {/* Section 2 */}
              <div className={styles.BackgroundVerificationGrid3}>
                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Highest Qualification<span className={styles.star}>*</span></label>
                  <Field name="highestQualification" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="highestQualification" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Institution / University Name<span className={styles.star}>*</span></label>
                  <Field name="universityName" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="universityName" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Year of Passing<span className={styles.star}>*</span></label>
                  <Field name="yearOfPassing" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="yearOfPassing" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Upload Degree Certificate<span className={styles.star}>*</span></label>
                  <div className={styles.BackgroundVerificationUploadWithIcon}>
                    <input
                      type="file"
                      name="degreeCertificate"
                      onChange={(e) => handleFileChange(e, "degreeCertificate", setFieldValue)}
                      className={styles.BackgroundVerificationFormInput}
                    />
                    {filePreviews.degreeCertificate && (
                      <Icon
                        icon="mdi:eye"
                        className={styles.BackgroundVerificationEyeIcon}
                        onClick={() => window.open(filePreviews.degreeCertificate, "_blank")}
                      />
                    )}
                  </div>
                  <ErrorMessage name="degreeCertificate" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Previous Company Name<span className={styles.star}>*</span></label>
                  <Field name="previousCompany" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="previousCompany" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>Upload Relieving/Experience Letter<span className={styles.star}>*</span></label>
                  <div className={styles.BackgroundVerificationUploadWithIcon}>
                    <input
                      type="file"
                      name="relievingLetter"
                      onChange={(e) => handleFileChange(e, "relievingLetter", setFieldValue)}
                      className={styles.BackgroundVerificationFormInput}
                    />
                    {filePreviews.relievingLetter && (
                      <Icon
                        icon="mdi:eye"
                        className={styles.BackgroundVerificationEyeIcon}
                        onClick={() => window.open(filePreviews.relievingLetter, "_blank")}
                      />
                    )}
                  </div>
                  <ErrorMessage name="relievingLetter" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationRadioGroup}>
                  <label>Any Criminal Record?<span className={styles.star}>*</span></label>
                  <div className={styles.BackgroundVerificationRadioOptions}>
                    <label>
                      <Field type="radio" name="criminalRecord" value="Yes" /> Yes
                    </label>
                    <label>
                      <Field type="radio" name="criminalRecord" value="No" /> No
                    </label>
                  </div>
                  <ErrorMessage name="criminalRecord" component="div" className={styles.BackgroundVerificationError} />
                </div>

                <div className={styles.BackgroundVerificationFormGroup}>
                  <label>If Yes, Details</label>
                  <Field as="textarea" name="criminalDetails" className={styles.BackgroundVerificationFormInput} />
                  <ErrorMessage name="criminalDetails" component="div" className={styles.BackgroundVerificationError} />
                </div>
              </div>

              <div className={styles.BackgroundVerificationFooterButtons}>
                <Button type="submit" label="Submit" />
              </div>
            </Card>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export default BackgroundVerification;
