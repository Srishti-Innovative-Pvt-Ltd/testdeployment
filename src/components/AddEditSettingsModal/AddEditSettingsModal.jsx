import React from "react";
import styles from "./AddEditSettingsModal.module.css"
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";
import { departmentSchema } from "../../utils/ValidationSchema";

function AddEditSettingsModal({ onClose, initialData, onSubmit, companies, label }) {
    useEscapeKey(onClose);

    const initialValues = {
        name: initialData?.name || "",
        companyId: initialData?.companyId || "",
    };
    return (
        <div className={styles.addEditDepartmentModalOverlay}>
            <div className={styles.addEditDepartmentModal}>
                <div className={styles.addEditDepartmentModalHeader}>
                    <span>{initialData ? `Edit ${label}` : `Add ${label}`}</span>
                    <Icon
                        icon="mdi:close"
                        className={styles.addEditDepartmentModalCloseIcon}
                        onClick={onClose}
                    />
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={departmentSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        onSubmit(values);
                        onClose();
                    }}
                >
                    {() => (
                        <Form>
                            <div className={styles.addEditDepartmentModalBody}>
                                <label>Select Company<span className={styles.star}>*</span></label>
                                <Field
                                    as="select"
                                    name="companyId"
                                    className={styles.addEditDepartmentModalInput}
                                >

                                    <option value="" disabled>
                                        -- Select Company --
                                    </option>
                                    {companies.map((company) => (
                                        <option key={company._id} value={company._id}>
                                            {company.companyName}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="companyId"
                                    component="div"
                                    className={styles.error}
                                />

                                <label style={{ marginTop: "1.5rem" }}> {label} Name<span className={styles.star}>*</span></label>
                                <Field
                                    name="name"
                                    type="text"
                                    className={styles.addEditDepartmentModalInput}
                                    placeholder={
                                        initialData
                                            ? `Edit ${label} Name`
                                            : `Enter ${label} Name`
                                    }
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className={styles.error}
                                />
                            </div>

                            <div className={styles.addEditDepartmentModalFooter}>
                                <PrimaryButton
                                    label={initialData ? "Update" : "Save"}
                                    type="submit"
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default AddEditSettingsModal;
