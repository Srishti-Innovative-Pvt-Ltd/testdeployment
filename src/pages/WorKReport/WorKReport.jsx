import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import styles from "./WorKReport.module.css";
import { Icon } from "@iconify/react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { workReportSchema } from "../../utils/ValidationSchema";
import Select from "react-select";

// ProgressBar component
const ProgressBar = ({ value }) => (
    <div className={styles.progressBarOuter}>
        <div className={styles.progressBarInner} style={{ width: `${value}%` }}>
            <span className={styles.progressLabel}>{value}%</span>
        </div>
    </div>
);

const subtaskOptionsMap = {
    Development: [
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "API Integration", value: "api" },
    ],
    Debugging: [
        { label: "UI Fix", value: "ui" },
        { label: "Performance", value: "performance" },
        { label: "Logic Bug", value: "logic" },
    ],
};

const initialValues = {
    date: "",
    workType: "",
    login: "",
    logout: "",
    entries: [
        {
            project: "",
            task: "",
            subtasks: [],
            hours: "",
            details: "",
            status: "",
            progress: 0,
        },
    ],
    comments: "",
};

const getTimeDiffInHours = (start, end) => {
    if (!start || !end) return NaN;
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const diff = (endTime - startTime) / 3600000;
    return diff >= 0 ? diff : NaN;
};

function WorKReport() {
    const handleSubmit = (values) => {
        console.log("Submitted Data:", values);
    };

    return (
        <DashboardLayout>
            <div className={styles.containerWorKReport}>
                <Card title="Work Report" icon="mdi:clipboard-text-outline">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={workReportSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue }) => {
                            const totalHours = values.entries.reduce(
                                (total, { hours }) => total + (+hours || 0),
                                0
                            );
                            const totalLogged = getTimeDiffInHours(
                                values.login,
                                values.logout
                            );
                            const breakHours = isNaN(totalLogged - totalHours)
                                ? "00:00"
                                : (totalLogged - totalHours).toFixed(2);

                            return (
                                <Form>
                                    <div className={styles.gridWorKReport}>
                                        <div className={styles.rowWorKReport}>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Name</label>
                                                <input value="Employee Name" disabled />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Email</label>
                                                <input value="Employee Email" disabled />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Designation</label>
                                                <input value="Designation" disabled />
                                            </div>
                                        </div>

                                        <div className={styles.rowWorKReport}>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Choose Date</label>
                                                <Field type="date" name="date" />
                                                <ErrorMessage
                                                    name="date"
                                                    component="div"
                                                    className={styles.error}
                                                />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Work Type</label>
                                                <Field as="select" name="workType">
                                                   
                                                    <option>Full Day</option>
                                                    <option>Half Day</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="workType"
                                                    component="div"
                                                    className={styles.error}
                                                />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Login Time</label>
                                                <Field type="time" name="login" />
                                                <ErrorMessage
                                                    name="login"
                                                    component="div"
                                                    className={styles.error}
                                                />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Logout Time</label>
                                                <Field type="time" name="logout" />
                                                <ErrorMessage
                                                    name="logout"
                                                    component="div"
                                                    className={styles.error}
                                                />
                                            </div>
                                        </div>

                                        <FieldArray name="entries">
                                            {({ remove, push }) =>
                                                values.entries.map((entry, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.entryBlockWorKReport}
                                                    >
                                                        <h3 className={styles.taskHeading}>
                                                            Task {index + 1}
                                                        </h3>
                                                        <div className={styles.rowWorKReport}>
                                                            <div className={styles.inputGroupWorKReport}>
                                                                <label>Project</label>
                                                                <Field
                                                                    as="select"
                                                                    name={`entries[${index}].project`}
                                                                >
                                                                    <option value="">Select project</option>
                                                                    <option>Project A</option>
                                                                    <option>Project B</option>
                                                                </Field>
                                                                <ErrorMessage
                                                                    name={`entries[${index}].project`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>

                                                            <div className={styles.inputGroupWorKReport}>
                                                                <label>Task</label>
                                                                <Field
                                                                    as="select"
                                                                    name={`entries[${index}].task`}
                                                                >
                                                                    <option value="">Select task</option>
                                                                    <option>Development</option>
                                                                    <option>Debugging</option>
                                                                </Field>
                                                                <ErrorMessage
                                                                    name={`entries[${index}].task`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>

                                                            <div className={styles.inputGroupWorKReport}>
                                                                <label>Work Hour</label>
                                                                <Field
                                                                    type="number"
                                                                    name={`entries[${index}].hours`}
                                                                    placeholder="Eg: 5.0"
                                                                />
                                                                <ErrorMessage
                                                                    name={`entries[${index}].hours`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>
                                                        </div>


                                                        {entry.task && (
                                                            <div className={styles.inputGroupWorKReport}>
                                                                <label>Subtasks</label>
                                                                <Select
                                                                    isMulti
                                                                    name={`entries[${index}].subtasks`}
                                                                    options={subtaskOptionsMap[entry.task] || []}
                                                                    classNamePrefix="select"
                                                                    value={(entry.subtasks || []).map((val) =>
                                                                        subtaskOptionsMap[entry.task]?.find((opt) => opt.value === val)
                                                                    )}
                                                                    onChange={(selected) =>
                                                                        setFieldValue(
                                                                            `entries[${index}].subtasks`,
                                                                            selected.map((opt) => opt.value)
                                                                        )
                                                                    }
                                                                    placeholder="Select subtasks"
                                                                />
                                                                <ErrorMessage
                                                                    name={`entries[${index}].subtasks`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className={styles.rowWorKReport}>
                                                            <div className={styles.inputGroupFullWorKReport}>
                                                                <label>Comment / Description</label>
                                                                <Field
                                                                    as="textarea"
                                                                    rows="2"
                                                                    name={`entries[${index}].details`}
                                                                />
                                                                <ErrorMessage
                                                                    name={`entries[${index}].details`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className={styles.rowWorKReport}>
                                                            <div className={styles.inputGroupWorKReport}>
                                                                <label>Status</label>
                                                                <div className={styles.checkboxGroupWorKReport}>
                                                                    <label>
                                                                        <Field
                                                                            type="radio"
                                                                            name={`entries[${index}].status`}
                                                                            value="Completed"
                                                                        />
                                                                        Completed
                                                                    </label>
                                                                    <label>
                                                                        <Field
                                                                            type="radio"
                                                                            name={`entries[${index}].status`}
                                                                            value="Pending"
                                                                        />
                                                                        Pending
                                                                    </label>
                                                                </div>
                                                                <ErrorMessage
                                                                    name={`entries[${index}].status`}
                                                                    component="div"
                                                                    className={styles.error}
                                                                />
                                                            </div>

                                                            {entry.status === "Pending" && (
                                                                <div className={styles.progressWrapper}>
                                                                    <label className={styles.progressLabel}>
                                                                        Progress - {entry.progress}%
                                                                    </label>
                                                                    <ProgressBar value={entry.progress} />
                                                                    <input
                                                                        type="range"
                                                                        min="0"
                                                                        max="100"
                                                                        step="1"
                                                                        value={entry.progress}
                                                                        onChange={(e) =>
                                                                            setFieldValue(
                                                                                `entries[${index}].progress`,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className={styles.progressSlider}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className={styles.entryActionsWorKReport}>
                                                            {values.entries.length > 1 && (
                                                                <div
                                                                    className={styles.iconBtnWorKReport}
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <Icon icon="mdi:minus" />
                                                                </div>
                                                            )}
                                                            {index === values.entries.length - 1 && (
                                                                <div
                                                                    className={styles.iconBtnWorKReport}
                                                                    onClick={() =>
                                                                        push({
                                                                            project: "",
                                                                            task: "",
                                                                            subtasks: [],
                                                                            hours: "",
                                                                            details: "",
                                                                            status: "",
                                                                            progress: 0,
                                                                        })
                                                                    }
                                                                >
                                                                    <Icon icon="mdi:plus" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </FieldArray>

                                        <div className={styles.rowWorKReport}>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Total Work Hour</label>
                                                <input value={totalHours.toFixed(2)} disabled />
                                            </div>
                                            <div className={styles.inputGroupWorKReport}>
                                                <label>Break Hours</label>
                                                <input value={breakHours} disabled />
                                            </div>
                                        </div>

                                        <div className={styles.inputGroupFullWorKReport}>
                                            <label>Any additional comments</label>
                                            <Field
                                                as="textarea"
                                                rows="3"
                                                name="comments"
                                                placeholder="Write here..."
                                            />
                                        </div>

                                        <div className={styles.submitBtnWorKReport}>
                                            <Button label="Submit Sheet" type="submit" />
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default WorKReport;
