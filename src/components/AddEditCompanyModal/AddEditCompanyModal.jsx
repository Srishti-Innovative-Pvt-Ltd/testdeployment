import React, { useState } from 'react';
import styles from './AddEditCompanyModal.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from '@iconify/react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { AddEditCompanySchema } from '../../utils/ValidationSchema';
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import useEscapeKey from '../UseEscapeKey/useEscapeKey';

function AddEditCompanyModal({ onClose, initialData = {}, onSubmit = () => { }, parentOptions = [] }) {
  useEscapeKey(onClose);
  const [previewFile, setPreviewFile] = useState(null);

  const handlePreview = (file) => {
    if (!file) return;
    const isNewFile = file instanceof File;
    const url = isNewFile ? URL.createObjectURL(file) :
      file.startsWith("http") ? file :
        `${UPLOADS_PATH_BASE_URL.replace(/\/+$/, '')}/${file.replace(/^\/+/, '')}`;
    setPreviewFile({
      url,
      name: isNewFile ? file.name : file.split('/').pop(),
      isBlob: isNewFile
    });
  };

  const closePreview = () => {
    if (previewFile?.isBlob) URL.revokeObjectURL(previewFile.url);
    setPreviewFile(null);
  };

  return (
    <div className={styles.companyModalOverlay}>
      <div className={styles.companyModalContent}>
        <div className={styles.companyModalHeader}>
          <h2>{initialData?.companyName ? 'Edit Company Details' : 'Add Company Details'}</h2>
          <Icon
            icon="mdi:close"
            className={styles.companyCloseButton}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{
            companyName: initialData?.companyName || '',
            address: initialData.address || '',
            logo: null,
            header: null,
            footer: null,
            existingLogo: initialData.logo || '',
            existingHeader: initialData.letterHead || '',
            existingFooter: initialData.letterFooter || '',
            parentCompany: initialData?.parentCompany?._id || '',
             probationPeriod: initialData?.probationPeriod || ''
          }}
          validationSchema={AddEditCompanySchema}
          onSubmit={(values) => {
            onSubmit({
              ...values,
              logo: values.logo || values.existingLogo,
              letterHead: values.header || values.existingHeader,
              letterFooter: values.footer || values.existingFooter,
            });
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className={styles.companyForm}>
              <div className={styles.companyRow}>
                <div className={styles.companyInputGroup}>
                  <label>Company Name<span className={styles.star}>*</span></label>
                  <Field
                    name="companyName"
                    type="text"
                    placeholder="Enter Company Name"
                    className={styles.companyInput}
                  />
                  <ErrorMessage name="companyName" component="div" className={styles.companyError} />
                </div>

                <div className={styles.companyInputGroup}>
                  <label>Address<span className={styles.star}>*</span></label>
                  <Field
                    name="address"
                    type="text"
                    placeholder="Enter Company Address"
                    className={styles.companyInput}
                  />
                  <ErrorMessage name="address" component="div" className={styles.companyError} />
                </div>

                {parentOptions.length > 0 && (
                  <div className={styles.companyRow}>
                    <div className={styles.companyInputGroup}>
                      <label>Parent Company</label>
                      <Field
                        as="select"
                        name="parentCompany"
                        className={styles.companyInputparentCompany}
                      >
                        <option value="">Select Parent Company</option>
                        {parentOptions.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.companyName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="parentCompany" component="div" className={styles.companyError} />
                    </div>
                  </div>
                )}
              </div>

              {/* Logo & Header Row */}
              <div className={styles.companyRow}>
                {['logo', 'header'].map((field) => (
                  <div key={field} className={styles.companyInputGroup}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className={styles.star}>*</span>
                    </label>

                    <div className={styles.fileInputWrapper}>
                      <input
                        name={field}
                        type="file"
                        accept="image/*"
                        className={styles.companyInput}
                        onChange={(event) =>
                          setFieldValue(field, event.currentTarget.files[0])
                        }
                      />
                    </div>

                    {(values[field] || values[`existing${field.charAt(0).toUpperCase() + field.slice(1)}`]) && (
                      <div className={styles.previewLinkWrapper}>
                        <span
                          className={styles.previewLink}
                          onClick={() =>
                            handlePreview(
                              values[field] || values[`existing${field.charAt(0).toUpperCase() + field.slice(1)}`]
                            )
                          }
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)} Preview
                        </span>
                      </div>
                    )}

                    <ErrorMessage name={field} component="div" className={styles.companyError} />
                  </div>
                ))}
              </div>

              {/* Footer Row */}
              <div className={styles.companyRow}>
                <div className={styles.companyInputGroup}>
                  <label>Footer<span className={styles.star}>*</span></label>

                  <div className={styles.fileInputWrapper}>
                    <input
                      name="footer"
                      type="file"
                      accept="image/*"
                      className={styles.companyInput}
                      onChange={(event) =>
                        setFieldValue("footer", event.currentTarget.files[0])
                      }
                    />
                  </div>

                  {(values.footer || values.existingFooter) && (
                    <div className={styles.previewLinkWrapper}>
                      <span
                        className={styles.previewLink}
                        onClick={() => handlePreview(values.footer || values.existingFooter)}
                      >
                        Footer Preview
                      </span>
                    </div>
                  )}

                  <ErrorMessage name="footer" component="div" className={styles.companyError} />
                </div>
                <div className={styles.companyInputGroup}>
                  <label>
                    Probation Duration <span className={styles.star}>*</span>
                  </label>
                  <Field
                    as="select"
                    name="probationPeriod"
                    className={styles.companyInputparentCompany}
                  >
                    <option value="">Select Duration (in months)</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Month{i + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="probationPeriod" component="div" className={styles.companyError} />
                </div>
              </div>


              <div className={styles.companySubmitRow}>
                <PrimaryButton
                  label={initialData?.companyName ? 'Update' : 'Submit'}
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>      
      </div>

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
            <img src={previewFile.url} className={styles.previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEditCompanyModal;
