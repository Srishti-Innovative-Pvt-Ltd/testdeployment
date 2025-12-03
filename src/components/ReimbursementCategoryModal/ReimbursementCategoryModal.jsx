import React from "react";
import styles from "./ReimbursementCategoryModal.module.css";
import { Icon } from "@iconify/react"; 
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey";
import { reimbursementSchema } from "../../utils/ValidationSchema";

function ReimbursementCategoryModal({ onClose, initialData, label, onSubmit }) {
    useEscapeKey(onClose);

    const categories = ["Travel", "Food", "Miscellaneous"];

    return (
        <div className={styles.reimbursementModalOverlay}>
            <div className={styles.reimbursementModal}>
                <div className={styles.reimbursementModalHeader}>
                    <span>{initialData ? `Edit ${label}` : `Add ${label}`}</span>
                    <Icon
                        icon="mdi:close"
                        className={styles.reimbursementCloseIcon}
                        onClick={onClose}
                    /> 
                </div>

                <Formik
                    initialValues={{
                        category: initialData?.type || "",

                        travelEntries:
                            initialData?.type === "Travel"
                                ? initialData?.config?.modes?.map((m) => ({
                                    mode: m.modeOfTravel,
                                    km: m.kilometers,
                                    amount: m.amount,
                                }))
                                : [{ mode: "", km: "", amount: "" }],

                        food:
                            initialData?.type === "Food"
                                ? {
                                    days: initialData?.config?.days || "",
                                    amount: initialData?.config?.amount || "",
                                }
                                : { days: "", amount: "" },
                    }}
                    enableReinitialize={true}
                    validationSchema={reimbursementSchema}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={(values, { setTouched }) => {
                        // mark all fields as touched
                        const touchedTravel = values.travelEntries.map(() => ({
                            mode: true,
                            km: true,
                            amount: true,
                        }));
                        setTouched({
                            category: true,
                            travelEntries: touchedTravel,
                            food: { days: true, amount: true },
                        });

                        onSubmit(values);
                        onClose();
                    }}
                >

                    {({ values }) => (
                        <Form>
                            <div className={styles.reimbursementModalBody}>
                                {/* Category Select */}
                                <label className={styles.reimbursementLabel}>
                                    Reimbursement Category
                                    <span className={styles.star}>*</span>
                                </label>
                                <Field
                                    as="select"
                                    name="category"
                                    className={styles.reimbursementSelect}
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="category"
                                    component="div"
                                    className={styles.reimbursementError}
                                />

                                {/* Dynamic Fields */}
                                {values.category === "Travel" && (
                                    <div className={styles.reimbursementDynamicFields}>
                                        <FieldArray name="travelEntries">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.travelEntries.map((entry, index) => (
                                                        <div
                                                            key={index}
                                                            className={styles.reimbursementRow}
                                                        >
                                                            <div className={styles.reimbursementFieldWrapper}>
                                                                <Field
                                                                    name={`travelEntries[${index}].mode`}
                                                                    placeholder="Mode of Travel"
                                                                    className={styles.reimbursementInput}
                                                                />
                                                                <ErrorMessage
                                                                    name={`travelEntries[${index}].mode`}
                                                                    component="div"
                                                                    className={styles.reimbursementError}
                                                                />
                                                            </div>

                                                            <div className={styles.reimbursementFieldWrapper}>
                                                                <Field
                                                                    name={`travelEntries[${index}].km`}
                                                                    placeholder="Kilometers"
                                                                    min="0"
                                                                    type="number"
                                                                    className={styles.reimbursementInput}
                                                                />
                                                                <ErrorMessage
                                                                    name={`travelEntries[${index}].km`}
                                                                    component="div"
                                                                    className={styles.reimbursementError}
                                                                />
                                                            </div>

                                                            <div className={styles.reimbursementFieldWrapper}>
                                                                <Field
                                                                    name={`travelEntries[${index}].amount`}
                                                                    placeholder="Amount"
                                                                    type="number"
                                                                    min="0"
                                                                    className={styles.reimbursementInput}
                                                                />
                                                                <ErrorMessage
                                                                    name={`travelEntries[${index}].amount`}
                                                                    component="div"
                                                                    className={styles.reimbursementError}
                                                                />
                                                            </div>

                                                          <div className={styles.reimbursementBtnGroup}>
  <button
    type="button"
    className={`${styles.reimbursementAddBtn} ${styles.blueBtn}`}
    onClick={() => push({ mode: "", km: "", amount: "" })}
  >
    +
  </button>
  {index > 0 && (
    <button
      type="button"
      className={`${styles.reimbursementRemoveBtn} ${styles.redBtn}`}
      onClick={() => remove(index)}
    >
      –
    </button>
  )}
</div>

                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </div>
                                )}

                                {values.category === "Food" && (
                                    <div className={styles.reimbursementRow}>
                                        <div className={styles.reimbursementFieldWrapper}>
                                            <Field
                                                name="food.days"
                                                placeholder="Days"
                                                type="number"
                                                min="0"
                                                className={styles.reimbursementInput}
                                            />
                                            <ErrorMessage
                                                name="food.days"
                                                component="div"
                                                className={styles.reimbursementError}
                                            />
                                        </div>

                                        <div className={styles.reimbursementFieldWrapper}>
                                            <Field
                                                name="food.amount"
                                                placeholder="Amount"
                                                type="number"
                                                min="0"
                                                className={styles.reimbursementInput}
                                            />
                                            <ErrorMessage
                                                name="food.amount"
                                                component="div"
                                                className={styles.reimbursementError}
                                            />
                                        </div>
                                    </div>
                                )}

                                {values.category === "Miscellaneous" && (
                                    <p className={styles.reimbursementInfoText}>
                                        No fields required for this category.
                                    </p>
                                )}
                            </div>

                            <div className={styles.reimbursementModalFooter}>
                                {values.category && (
                                    <PrimaryButton
                                        label={initialData ? "Update" : "Save"}
                                        type="submit"
                                    />
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ReimbursementCategoryModal;
    