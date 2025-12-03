import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { postJobOpeningSchema } from "../../utils/ValidationSchema";
import Button from "../../components/Button/Button";
import styles from "./PostJobOpening.module.css";

const jobTypes = ["Full Time", "Part Time", "Remote"];

const departments = ["Engineering", "Marketing", "HR"];
const designations = ["Developer", "Manager", "Analyst"];
const hiringManagers = ["John Doe", "Jane Smith"];
const recruiters = ["Recruiter A", "Recruiter B"];

const PostJobOpening = () => {
  return (
    <DashboardLayout>
      <Card title="Post Job Opening">
        <Formik
          initialValues={{
            jobTitle: "",
            vacancyCount: "",
            jobType: "",
            department: "",
            designation: "",
            hiringManager: "",
            recruiterAssigned: "",
            applicationStartDate: null,
            applicationEndDate: null,
            jobDescription: null,
            url: "",
          }}
          validationSchema={postJobOpeningSchema}
          onSubmit={(values) => {
            console.log("Form Submitted:", values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Job Title<span className={styles.star}>*</span></label>
                  <Field name="jobTitle" className="inputFormStyle" />
                  <ErrorMessage
                    name="jobTitle"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Vacancy Count<span className={styles.star}>*</span></label>
                  <Field
                    name="vacancyCount"
                    type="number"
                    className="inputFormStyle"
                  />
                  <ErrorMessage
                    name="vacancyCount"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Job Type<span className={styles.star}>*</span></label>
                  <div className="mt-2" role="group">
                    {jobTypes.map((type) => (
                      <label key={type} className="me-3">
                        <Field type="radio" name="jobType" value={type} />{" "}
                        {type}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Department<span className={styles.star}>*</span></label>
                  <Field
                    as="select"
                    name="department"
                    className="inputFormStyle"
                  >
                    <option value="">Select</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Designation<span className={styles.star}>*</span></label>
                  <Field
                    as="select"
                    name="designation"
                    className="inputFormStyle"
                  >
                    <option value="">Select</option>
                    {designations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Hiring Manager<span className={styles.star}>*</span></label>
                  <Field
                    as="select"
                    name="hiringManager"
                    className="inputFormStyle"
                  >
                    <option value="">Select</option>
                    {hiringManagers.map((hm) => (
                      <option key={hm} value={hm}>
                        {hm}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="hiringManager"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Recruiter Assigned<span className={styles.star}>*</span></label>
                  <Field
                    as="select"
                    name="recruiterAssigned"
                    className="inputFormStyle"
                  >
                    <option value="">Select</option>
                    {recruiters.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="recruiterAssigned"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Application Start Date<span className={styles.star}>*</span></label>
                  <Field
                    type="date"
                    name="applicationStartDate"
                    className={"inputFormStyle"}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("applicationStartDate", selectedDate);
                    }}
                  />
                  <ErrorMessage
                    name="applicationStartDate"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                  <label>Application End Date<span className={styles.star}>*</span></label>
                  <Field
                    type="date"
                    name="applicationEndDate"
                    className={"inputFormStyle"}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("applicationEndDate", selectedDate);
                    }}
                  />
                  <ErrorMessage
                    name="applicationEndDate"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                  <label>Job Description (PDF)<span className={styles.star}>*</span></label>
                  <input
                    name="jobDescription"
                    type="file"
                    accept="application/pdf"
                    className="inputFormStyle"
                    onChange={(e) =>
                      setFieldValue("jobDescription", e.currentTarget.files[0])
                    }
                  />
                  <ErrorMessage
                    name="jobDescription"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                  <label>URL<span className={styles.star}>*</span></label>
                  <Field name="url" type="url" className="inputFormStyle" />
                  <ErrorMessage
                    name="url"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button label="Submit" type={"submit"} />
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </DashboardLayout>
  );
};

export default PostJobOpening;
