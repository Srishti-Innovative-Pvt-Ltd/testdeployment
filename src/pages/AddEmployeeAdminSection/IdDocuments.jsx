import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import styles from "./IdDocuments.module.css";
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';    
import { idDocumentsSchema } from '../../utils/ValidationSchema';
import { Icon } from '@iconify/react';
import { addEmployeeIDandDocDetails, getEmployeeIDandDocDetails ,getIdDocumentsRejectionReasons} from '../../services/addEmployeeService';
import { useSnackbar } from 'notistack';
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import { getUserRole,getVerificationStatus } from "../../utils/roleUtils";
import FilePreview from '../../components/FilePreview/FilePreview';
import RejectedReasonList from '../../components/RejectedReasonList/RejectedReasonList';

const initialValues = {
  hasPassport: false,
  passportNumber: '',
  passportCopy: null,
  existingPassportCopy: '',
  aadhaarNumber: '',
  aadhaarCopy: null,
  existingAadhaarCopy: '',
  panNumber: '',
  panCopy: null,
  existingPanCopy: '',
  drivingLicenseNumber: '',
  drivingLicenseCopy: null,
  existingDrivingLicenseCopy: '',
  certificates: [{ name: "", certificateCopies: null, existingCertificateCopies: "" }],
  hasDrivingLicense: false,
};

function IdDocuments({ onNext, user_id }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [initialFormValues, setInitialFormValues] = useState(initialValues);
  const [previewFile, setPreviewFile] = useState(null);
  const role = getUserRole();
  const verificationStatus = getVerificationStatus();
  const [rejectedFields, setRejectedFields] = useState([]);

  const fetchRejectionReasons = async () => {
    if (!(verificationStatus === "rejected" && role !== "admin")) return;

    const res = await getIdDocumentsRejectionReasons(user_id);
    if (!res.success || !res.data?.rejectionReasons) return;

    const fieldLabels = {
      aadhaarCopy: "Aadhaar Card Copy",
      aadhaarNumber: "Aadhaar Number",
      panCopy: "PAN Card Copy", 
      panNumber: "PAN Number",
      passportCopy: "Passport Copy",
      passportNumber: "Passport Number",
      drivingLicenseCopy: "Driving License Copy",
      drivingLicenseNumber: "Driving License Number"
    };

    const rejectedArray = Object.entries(res.data.rejectionReasons).reduce((acc, [field, reason]) => {
      const certMatch = field.match(/certificates\[(\d+)\]\.(name|copy)/);
      if (certMatch) {
        const index = parseInt(certMatch[1]);
        const fieldType = certMatch[2];
        
        if (reason && reason.trim() !== "") {
          acc.push({
            fieldName: fieldType === 'name' 
              ? `Certificate ${index + 1} Name` 
              : `Certificate ${index + 1} Copy`,
            reason
          });
        }
        return acc;
      }
      
      if (reason && reason.trim() !== "") {
        acc.push({
          fieldName: fieldLabels[field] || field,
          reason
        });
      }
      
      return acc;
    }, []);

    setRejectedFields(rejectedArray);
  };

  const handlePreview = (fileOrUrl) => {
    if (!fileOrUrl) return;

    if (typeof fileOrUrl === "string") {
      const fullPath = fileOrUrl.startsWith("http") ? fileOrUrl : `${UPLOADS_PATH_BASE_URL}${fileOrUrl}`;
      setPreviewFile({ url: fullPath, name: fileOrUrl.split("/").pop() });
    } else if (fileOrUrl instanceof File) {
      setPreviewFile({ url: URL.createObjectURL(fileOrUrl), name: fileOrUrl.name });
    }
  };

  const closePreview = () => {
    if (previewFile?.url.startsWith('blob:')) {
      URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
  };

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await getEmployeeIDandDocDetails(user_id);
        if (response.success && response.data?.idDocumentsInfo) {
          const docInfo = response.data.idDocumentsInfo;

          const formattedValues = {
            hasPassport:
              docInfo.hasPassport === true || docInfo.hasPassport === 'true',
            passportNumber: docInfo.passportNumber?.value || '',
            existingPassportCopy: docInfo.passportCopy?.value || '',
            passportCopy: null,

            aadhaarNumber: docInfo.aadhaarNumber?.value || '',
            existingAadhaarCopy: docInfo.aadhaarCopy?.value || '',
            aadhaarCopy: null,

            panNumber: docInfo.panNumber?.value || '',
            existingPanCopy: docInfo.panCopy?.value || '',
            panCopy: null,

            hasDrivingLicense:
              docInfo.hasDrivingLicense === true ||
              docInfo.hasDrivingLicense === 'true',
            drivingLicenseNumber: docInfo.drivingLicenseNumber?.value || '',
            existingDrivingLicenseCopy: docInfo.drivingLicenseCopy?.value || '',
            drivingLicenseCopy: null,

            certificates:
              docInfo.certificates?.map((cert) => ({
                name: cert.name?.value || '',
                existingCertificateCopies: cert.copy?.value || '',
                certificateCopies: null,
              })) || [
                { name: '', certificateCopies: null, existingCertificateCopies: '' },
              ],
          };

          setInitialFormValues(formattedValues);

          if (verificationStatus === "rejected" && role !== "admin") {
            await fetchRejectionReasons();
          }
        }
      } catch (error) {
        enqueueSnackbar('Failed to load document details', { variant: 'error' });
        console.error('Error loading document details:', error);
      }
    };
    fetchDocumentDetails();
  }, [user_id, enqueueSnackbar]);

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        validationSchema={idDocumentsSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();
            formData.append("hasPassport", values.hasPassport);
            formData.append("passportNumber", values.passportNumber || "");
            if (values.passportCopy) formData.append("passportCopy", values.passportCopy);
            formData.append("aadhaarNumber", values.aadhaarNumber);
            if (values.aadhaarCopy) formData.append("aadhaarCopy", values.aadhaarCopy);
            formData.append("panNumber", values.panNumber);
            if (values.panCopy) formData.append("panCopy", values.panCopy);
            formData.append("hasDrivingLicense", values.hasDrivingLicense);
            formData.append("drivingLicenseNumber", values.drivingLicenseNumber || "");
            if (values.drivingLicenseCopy) formData.append("drivingLicenseCopy", values.drivingLicenseCopy);

            const certificatesMeta = values.certificates.map(cert => ({
              name: cert.name,
              updated: cert.certificateCopies ? true : false,
            }));
            formData.append("certificates", JSON.stringify(certificatesMeta));

            values.certificates.forEach((cert, index) => {
              if (cert.certificateCopies) {
                formData.append(`certificateCopies`, cert.certificateCopies);
              }
            });

            const result = await addEmployeeIDandDocDetails(user_id, formData);

            if (result.success) {
              enqueueSnackbar('Document details saved successfully!', {
                variant: 'success',
                autoHideDuration: 3000,
              });
              onNext();
            } else {
              enqueueSnackbar(result.message || 'Failed to save document details', {
                variant: 'error',
                autoHideDuration: 5000,
              });
            }
          } catch (err) {
            enqueueSnackbar('Something went wrong. Please try again.', {
              variant: 'error',
              autoHideDuration: 5000,
            });
            console.error('Submission error:', err);
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ setFieldValue, setFieldTouched, values }) => (
          <Form className={styles.formWrapper}>
            {rejectedFields.length > 0 && (
              <RejectedReasonList rejectedFields={rejectedFields} />
            )}
            <Card title="ID and Documents" icon="mdi:card-account-details-outline">
              <div className={styles.grid}>
                {/* Passport Section */}
                <div className={styles.formGroup}>
                  <label>Do you have a passport?<span className={styles.star}>*</span></label>
                  <div className={styles.radioGroup}>
                    <label>
                      <Field
                        type="radio"
                        name="hasPassport"
                        value={true}
                        checked={values.hasPassport === true}
                        onChange={() => setFieldValue("hasPassport", true)}
                      /> Yes
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="hasPassport"
                        value={false}
                        checked={values.hasPassport === false}
                        onChange={() => setFieldValue("hasPassport", false)}
                      /> No
                    </label>
                  </div>
                  <ErrorMessage name="hasPassport" component="div" className={styles.error} />
                </div>
                {values.hasPassport === true && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Passport Number<span className={styles.star}>*</span></label>
                      <Field name="passportNumber">
                        {({ field, form }) => (
                          <input
                            {...field}
                            placeholder="e.g. A1234567"
                            className={styles.input}
                            maxLength={8}
                            onChange={(e) => {
                              let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                              if (value.length > 0) {
                                const first = value[0].replace(/[^A-Z]/g, "");
                                const rest = value.slice(1).replace(/[^0-9]/g, "").slice(0, 7);
                                value = first + rest;
                              }
                              form.setFieldValue("passportNumber", value);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="passportNumber" component="div" className={styles.error} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Upload Copy of Passport<span className={styles.star}>*</span></label>
                      <input
                        type="file"
                        className={styles.input}
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          setFieldValue("passportCopy", file);
                          setTimeout(() => setFieldTouched("passportCopy", true), 0);
                        }}
                      />
                      <ErrorMessage name="passportCopy" component="div" className={styles.error} />
                      {(values.passportCopy || values.existingPassportCopy) && (
                        <div className={styles.previewLinkWrapper}>
                          <FilePreview
                            file={values.passportCopy || values.existingPassportCopy}
                            uploadsBaseUrl={UPLOADS_PATH_BASE_URL}
                            onImagePreview={handlePreview}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Aadhar Section */}
                <div className={styles.formGroup}>
                  <label>Aadhar Number<span className={styles.star}>*</span></label>
                  <Field name="aadhaarNumber">
                    {({ field, form }) => (
                      <input
                        {...field}
                        placeholder="e.g. 1234 5678 9012"
                        className={styles.input}
                        maxLength={14}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                          const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                          form.setFieldValue("aadhaarNumber", formatted);
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="aadhaarNumber" component="div" className={styles.error} />
                </div>

                <div className={styles.formGroup}>
                  <label>Upload Copy of Aadhar Card<span className={styles.star}>*</span></label>
                  <input
                    type="file"
                    className={styles.input}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      setFieldValue("aadhaarCopy", file);
                      setTimeout(() => setFieldTouched("aadhaarCopy", true), 0);
                    }}
                  />
                  <ErrorMessage name="aadhaarCopy" component="div" className={styles.error} />
                  {(values.aadhaarCopy || values.existingAadhaarCopy) && (
                    <div className={styles.previewLinkWrapper}>
                      <FilePreview
                        file={values.aadhaarCopy || values.existingAadhaarCopy}
                        uploadsBaseUrl={UPLOADS_PATH_BASE_URL}
                        onImagePreview={handlePreview}
                      />
                    </div>
                  )}
                </div>

                {/* PAN Section */}
                <div className={styles.formGroup}>
                  <label>PAN No<span className={styles.star}>*</span></label>
                  <Field name="panNumber">
                    {({ field, form }) => (
                      <input
                        {...field}
                        placeholder="e.g.ABCDE1234F"
                        className={styles.input}
                        maxLength={10}
                        value={field.value.toUpperCase()}
                        onChange={(e) => {
                          const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                          form.setFieldValue("panNumber", raw);
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="panNumber" component="div" className={styles.error} />
                </div>

                <div className={styles.formGroup}>
                  <label>PAN Card Copy<span className={styles.star}>*</span></label>
                  <input
                    type="file"
                    className={styles.input}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      setFieldValue("panCopy", file);
                      setTimeout(() => setFieldTouched("panCopy", true), 0);
                    }}
                  />
                  <ErrorMessage name="panCopy" component="div" className={styles.error} />
                  {(values.panCopy || values.existingPanCopy) && (
                    <div className={styles.previewLinkWrapper}>
                      <FilePreview
                        file={values.panCopy || values.existingPanCopy}
                        uploadsBaseUrl={UPLOADS_PATH_BASE_URL}
                        onImagePreview={handlePreview}
                      />
                    </div>
                  )}
                </div>

                {/* Driving License Section */}
                <div className={styles.formGroup}>
                  <label>Do you have Driving License?<span className={styles.star}>*</span></label>
                  <div className={styles.radioGroup}>
                    <label>
                      <Field
                        type="radio"
                        name="hasDrivingLicense"
                        value={true}
                        checked={values.hasDrivingLicense === true}
                        onChange={() => setFieldValue("hasDrivingLicense", true)}
                      /> Yes
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="hasDrivingLicense"
                        value={false}
                        checked={values.hasDrivingLicense === false}
                        onChange={() => setFieldValue("hasDrivingLicense", false)}
                      /> No
                    </label>
                  </div>
                  <ErrorMessage name="hasDrivingLicense" component="div" className={styles.error} />
                </div>

                {values.hasDrivingLicense === true && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Driving License Number<span className={styles.star}>*</span></label>
                      <Field name="drivingLicenseNumber">
                        {({ field, form }) => (
                          <input
                            {...field}
                            placeholder="e.g. MH14 20110012345"
                            className={styles.input}
                            maxLength={16}
                            onChange={(e) => {
                              let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                              if (value.length > 4) {
                                value = value.slice(0, 4) + " " + value.slice(4, 15);
                              }
                              form.setFieldValue("drivingLicenseNumber", value);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="drivingLicenseNumber" component="div" className={styles.error} />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Upload Copy of Driving License<span className={styles.star}>*</span></label>
                      <input
                        type="file"
                        className={styles.input}
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          setFieldValue("drivingLicenseCopy", file);
                          setTimeout(() => setFieldTouched("drivingLicenseCopy", true), 0);
                        }}
                      />
                      <ErrorMessage name="drivingLicenseCopy" component="div" className={styles.error} />
                      {(values.drivingLicenseCopy || values.existingDrivingLicenseCopy) && (
                        <div className={styles.previewLinkWrapper}>
                          <FilePreview
                            file={values.drivingLicenseCopy || values.existingDrivingLicenseCopy}
                            uploadsBaseUrl={UPLOADS_PATH_BASE_URL}
                            onImagePreview={handlePreview}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

{/* Certificates Section */}
<div className={styles.grid}>
  <div className={`${styles.formGroup} ${styles.certificatesContainer}`}>
    <label>Certificates<span className={styles.star}>*</span></label>
    <FieldArray name="certificates">
      {({ push, remove }) => (
        <>
          {values.certificates.map((cert, index) => (
            <div className={styles.certificateRow} key={index}>
              {/* Certificate Name Field */}
              <div className={styles.certificateName}>
                <Field
                  name={`certificates[${index}].name`}
                  className={styles.input}
                  placeholder="Certificate name"
                />
                <ErrorMessage
                  name={`certificates[${index}].name`}
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* File Upload Section */}
              <div className={styles.fileUploadWrapper} >
                <Field name={`certificates[${index}].certificateCopies`}>
                  {({ field, form }) => (
                    <>
                      <label className={styles.fileUploadButton}>
                        Choose File
                        <input
                          type="file"
                          className={styles.fileInput}
                          onChange={(e) => {
                            const file = e.currentTarget.files[0];
                            form.setFieldValue(`certificates[${index}].certificateCopies`, file);
                            form.setFieldTouched(`certificates[${index}].certificateCopies`, true);
                          }}
                        />
                      </label>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name={`certificates[${index}].certificateCopies`}
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                {index === values.certificates.length - 1 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() =>
                      push({ name: "", certificateCopies: null, existingCertificateCopies: "" })
                    }
                  >
                    +
                  </button>
                )}
                {values.certificates.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(index)}
                  >
                    −
                  </button>
                )}
              </div>

              {/* Preview Section */}
              {(values.certificates[index].certificateCopies || 
                values.certificates[index].existingCertificateCopies) && (
                <div className={styles.previewContainer}>
                  <FilePreview
                    file={
                      values.certificates[index].certificateCopies ||
                      values.certificates[index].existingCertificateCopies
                    }
                    uploadsBaseUrl={UPLOADS_PATH_BASE_URL}
                    onImagePreview={handlePreview}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </FieldArray>
  </div>
</div>




              {/* Button Group */}
              <div className={styles.buttonGroup}>
                {role === "admin" && (
                  <Button label="Skip" secondary type="button" onClick={onNext} />)}

                <Button label="Next" type="submit" loading={loading} />
              </div>
            </Card>
          </Form>
        )}
      </Formik>

      {/* File Preview Modal */}
      {previewFile && (
        <div className={styles.previewOverlay} onClick={closePreview}>
          <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewHeader}>
              <span>{previewFile.name}</span>
              <Icon
                icon="mdi:close"
                className={styles.previewClose}
                onClick={closePreview}
              />
            </div>
            {previewFile.url.endsWith('.pdf') || previewFile.name.endsWith('.pdf') ? (
              <iframe
                src={previewFile.url}
                className={styles.previewIframe}
                title="File Preview"
              />
            ) : (
              <div className={styles.previewImageContainer}>
                <img
                  src={previewFile.url}
                  className={styles.previewImage}
                  alt="Preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.currentTarget.classList.toggle(styles.zoomed);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default IdDocuments;