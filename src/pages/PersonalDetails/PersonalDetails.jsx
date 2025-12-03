import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { personalDetailsSchema } from "../../utils/ValidationSchema";
import styles from './PersonalDetails.module.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useSnackbar } from "notistack";
const PersonalDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef();

  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    employeeId: '',
    otherId: '',
    dob: '',
    age: '',
    doj: '',
    contactPrimary: '',
    contactSecondary: '',
    contactEmergency: '',
    emailOfficial: '',
    personalEmail: '',
    srishtiEmail: '',
    addressPrimary: '',
    addressPermanent: '',
    nationality: '',
    maritalStatus: '',
    experience: '',
    qualification: '',
    expertise: '',
    gender: '',
    licenseNumber: '',
    licenseExpiry: '',
    files: [],
    comment: ''
  };

  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    const formData = new FormData();
    values.files.forEach(file => {
      formData.append("files[]", file);

      enqueueSnackbar('Personal details submitted successfully!', { variant: 'success' });
    });

  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={personalDetailsSchema} 
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Card title="Personal Details" icon="fluent:person-24-regular">
              <div className="row">

                <div className="col-md-4 mb-3">
                  <label>First Name*</label>
                  <Field type="text" name="firstName" className="form-control" />
                  <ErrorMessage name="firstName" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Middle Name</label>
                  <Field type="text" name="middleName" className="form-control" />
                  <ErrorMessage name="middleName" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Last Name*</label>
                  <Field type="text" name="lastName" className="form-control" />
                  <ErrorMessage name="lastName" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Employee ID</label>
                  <Field type="text" name="employeeId" className="form-control" />
                  <ErrorMessage name="employeeId" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Other ID</label>
                  <Field type="text" name="otherId" className="form-control" />
                  <ErrorMessage name="otherId" component="div" className="text-danger" />
                </div>

               
                <div className="col-md-4 mb-3">
                  <label>Date of Birth</label>
                  <Field
                    type="date"
                    name="dob"
                    className="form-control"
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("dob", selectedDate);

                      if (selectedDate) {
                        const dob = new Date(selectedDate);
                        const today = new Date();

                        let years = today.getFullYear() - dob.getFullYear();
                        let months = today.getMonth() - dob.getMonth();

                        if (
                          today.getDate() < dob.getDate() &&
                          months === 0
                        ) {
                          years--;
                          months = 11;
                        } else if (months < 0) {
                          years--;
                          months += 12;
                        }
                        const age = `${years}y ${months}m`;
                        setFieldValue("age", age);
                      } else {
                        setFieldValue("age", "");
                      }
                    }}
                  />
                  <ErrorMessage name="dob" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Age</label>
                  <Field
                    type="text"
                    name="age"
                    className="form-control"
                    placeholder="00y 0m"
                    readOnly
                  />
                  <ErrorMessage name="age" component="div" className="text-danger" />
                </div>


                <div className="col-md-4 mb-3">
                  <label>Date of Joining</label>
                  <Field type="date" name="doj" className="form-control" />
                  <ErrorMessage name="doj" component="div" className="text-danger" />
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Contact No (Primary)</label>
                    <Field type="text" name="contactPrimary" className="form-control" />
                    <ErrorMessage name="contactPrimary" component="div" className="text-danger" />
                  </div>

                  <div className="col-md-4">
                    <label>Contact No (Secondary)</label>
                    <Field type="text" name="contactSecondary" className="form-control" />
                    <ErrorMessage name="contactSecondary" component="div" className="text-danger" />
                  </div>

                  <div className="col-md-4">
                    <label>Contact No (Emergency)</label>
                    <Field type="text" name="contactEmergency" className="form-control" />
                    <ErrorMessage name="contactEmergency" component="div" className="text-danger" />
                  </div>
                </div>


                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Email (Official)</label>
                    <Field type="email" name="emailOfficial" className="form-control" />
                    <ErrorMessage name="emailOfficial" component="div" className="text-danger" />
                  </div>

                  <div className="col-md-4">
                    <label>Personal Email ID</label>
                    <Field type="email" name="personalEmail" className="form-control" />
                    <ErrorMessage name="personalEmail" component="div" className="text-danger" />
                  </div>

                  <div className="col-md-4">
                    <label>Srishti Mail ID</label>
                    <Field type="email" name="srishtiEmail" className="form-control" />
                    <ErrorMessage name="srishtiEmail" component="div" className="text-danger" />
                  </div>
                </div>


                <div className="col-md-4 mb-3">
                  <label>Address (Primary)</label>
                  <Field as="textarea" rows={3} name="addressPrimary" className="form-control" />
                  <ErrorMessage name="addressPrimary" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Address (Permanent)</label>
                  <Field as="textarea" rows={3} name="addressPermanent" className="form-control" />
                  <ErrorMessage name="addressPermanent" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Nationality</label>
                  <Field type="text" name="nationality" className="form-control" />
                  <ErrorMessage name="nationality" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Marital Status</label>
                  <Field as="select" name="maritalStatus" className="form-control">
                    <option value="">-- Select --</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </Field>
                  <ErrorMessage name="maritalStatus" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Years of Experience</label>
                  <Field type="text" name="experience" className="form-control" />
                  <ErrorMessage name="experience" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Qualification</label>
                  <Field type="text" name="qualification" className="form-control" />
                  <ErrorMessage name="qualification" component="div" className="text-danger" />
                </div>

                <div className="col-md-8 mb-3">
                  <label>Technical Expertise</label>
                  <Field type="text" name="expertise" className="form-control" placeholder="UI/UX, HTML, CSS, JS" />
                  <ErrorMessage name="expertise" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Gender</label>
                  <div className="d-flex align-items-center gap-3 mt-1">
                    <label><Field type="radio" name="gender" value="Male" /> Male</label>
                    <label><Field type="radio" name="gender" value="Female" /> Female</label>
                    <label><Field type="radio" name="gender" value="Other" /> Other</label>
                  </div>
                  <ErrorMessage name="gender" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Driver's License Number</label>
                  <Field type="text" name="licenseNumber" className="form-control" />
                  <ErrorMessage name="licenseNumber" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>License Expiry Date</label>
                  <Field type="date" name="licenseExpiry" className="form-control" />
                  <ErrorMessage name="licenseExpiry" component="div" className="text-danger" />
                </div>
              </div>
            </Card>

            <Card title="Add Attachment" icon="fluent:attach-20-regular">
              <div className="d-flex flex-column" style={{ maxWidth: "100%" }}>

                <div className="mb-3" style={{ maxWidth: "400px" }}>
                  <label>Select File*</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => {
                      const selected = Array.from(e.target.files);
                      setFieldValue("files", [...values.files, ...selected]);
                      fileInputRef.current.value = '';
                    }}
                  />
                  <ErrorMessage name="files" component="div" className="text-danger" />

                  {values.files.length > 0 && (
                    <ul className="mt-2 list-unstyled">
                      {values.files.map((file, idx) => (
                        <li
                          key={idx}
                          className="mb-1 d-flex justify-content-between align-items-center"
                        >
                          <span>📄 {file.name}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => {
                              const updatedFiles = values.files.filter((_, i) => i !== idx);
                              setFieldValue("files", updatedFiles);
                            }}
                          >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>


                <div className="mb-3" style={{ maxWidth: "600px" }}>
                  <label>Comment</label>
                  <Field
                    as="textarea"
                    name="comment"
                    rows={3}
                    className="form-control"
                    placeholder="Type comment here"
                  />
                  <ErrorMessage name="comment" component="div" className="text-danger" />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button label="Cancel" secondary type="button" />
                <Button label="Save" type="submit" />
              </div>
            </Card>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PersonalDetails;
