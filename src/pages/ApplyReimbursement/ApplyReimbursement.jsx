import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./ApplyReimbursement.module.css";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useSnackbar } from "notistack";
import { applyReimbursement, getReimbursementCategories } from "../../services/settingsService";
import { reimbursementApplySchema } from "../../utils/ValidationSchema";

function ApplyReimbursement({ setActiveTab }) {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [travelModes, setTravelModes] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getReimbursementCategories();
        if (res.success) {
          setCategories(res.data);
          const travel = res.data.find((c) => c.type === "Travel");
          if (travel) setTravelModes(travel.config.modes || []);
        } else {
          enqueueSnackbar(res.message, { variant: "error" });
        }
      } catch {
        enqueueSnackbar("Failed to fetch categories", { variant: "error" });
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  // Compute total without advance
  const computeTotal = (values) => {
    if (values.type === "Travel") {
      const travelCat = categories.find((c) => c.type === "Travel");
      const modeCfg = travelCat?.config?.modes?.find(
        (m) => m.modeOfTravel === values.modeOfTravel
      );
      if (modeCfg && values.totalKm) {
        const perKmRate = modeCfg.amount / modeCfg.kilometers;
        return Math.round(values.totalKm * perKmRate);
      }
    }

    if (values.type === "Food") {
      const foodCat = categories.find((c) => c.type === "Food");
      if (foodCat?.config?.amount && values.days) {
        return Math.round(values.days * foodCat.config.amount);
      }
    }

    if (values.type === "Miscellaneous") {
      const miscCat = categories.find((c) => c.type === "Miscellaneous");
      if (miscCat?.config?.amount) {
        return miscCat.config.amount;
      }
    }

    return 0;
  };

  return (
    <div className={styles.applyReimbursementWrapper}>
      <h2 className={styles.applyReimbursementTitle}>Apply Reimbursement</h2>

      <Formik
        initialValues={{
          type: "",
          advanceAmount: 0,
          totalAmount: 0,
          modeOfTravel: "",
          totalKm: "",
          fromLocation: "",
          toLocation: "",
          fromDate: "",
          toDate: "",
          foodFromDate: "",
          foodToDate: "",
          days: "",
          foodDate: "",
          miscDate: "",
          reason: "",
          fileAttachment: null,
        }}
        validationSchema={reimbursementApplySchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const formData = new FormData();
            formData.append("type", values.type);
            formData.append("advanceAmount", values.advanceAmount || 0);
            formData.append("totalAmount", values.totalAmount || 0);
            formData.append("purpose", values.reason);

            let details = {};
            if (values.type === "Travel") {
              details = {
                modeOfTravel: values.modeOfTravel,
                totalKm: Number(values.totalKm),
                fromLocation: values.fromLocation,
                toLocation: values.toLocation,
                fromDate: values.fromDate,
                toDate: values.toDate
              };
            } else if (values.type === "Food") {
              details = {
                days: Number(values.days),
                fromDate: values.foodFromDate,
                toDate: values.foodToDate
              };
            } else if (values.type === "Miscellaneous") {
              if (values.miscDate) details = {
                applicationDate: values.miscDate,
                amount: values.totalAmount
              };
            }

            if (Object.keys(details).length > 0) {
              formData.append("details", JSON.stringify(details));
            }

            if (values.fileAttachment) {
              formData.append("attachments", values.fileAttachment);
            }

            const res = await applyReimbursement(formData);

            if (res.success) {
              enqueueSnackbar(res.message, { variant: "success" });
              resetForm();
              if (setActiveTab) {
                setActiveTab("ReimbursementHistory");
              }
            } else {
              enqueueSnackbar(res.message, { variant: "error" });
            }
          } catch {
            enqueueSnackbar("Something went wrong", { variant: "error" });
          }
        }}
      >
        {({ values, setFieldValue }) => {
          // Auto-update totalAmount based on other fields
          useEffect(() => {
            const calculated = computeTotal(values);
            setFieldValue("totalAmount", calculated, false);
          }, [values.type, values.totalKm, values.days, values.modeOfTravel, setFieldValue]);

          return (
            <Form className={styles.applyReimbursementForm}>
              {/* Reimbursement Type */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reimbursement Type</label>
                <Field
                  as="select"
                  name="type"
                  className={styles.formSelect}
                  onChange={(e) => {
                    setFieldValue("type", e.target.value);
                    if (e.target.value === "Travel") setFieldValue("modeOfTravel", "");
                  }}
                >
                  <option value="">-- Select Type --</option>x
                  {categories.map((cat) => (
                    <option key={cat.type} value={cat.type}>
                      {cat.type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="type" component="div" className={styles.errorMessage} />
              </div>

              {values.type && (
                <>
                  {/* Travel Fields */}
                  {values.type === "Travel" && (
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Mode of Travel</label>
                        <Field
                          as="select"
                          name="modeOfTravel"
                          className={styles.formSelect}
                          onChange={(e) => setFieldValue("modeOfTravel", e.target.value)}
                        >
                          <option value="">-- Select Mode --</option>
                          {travelModes.map((m) => (
                            <option key={m.modeOfTravel} value={m.modeOfTravel}>
                              {m.modeOfTravel}
                            </option>
                          ))}
                          <option value="others">Others</option>

                        </Field>
                        <ErrorMessage name="modeOfTravel" component="div" className={styles.errorMessage} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Total KM</label>
                        <Field type="number" min="0" name="totalKm" className={styles.formInput} />
                        <ErrorMessage name="totalKm" component="div" className={styles.errorMessage} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>From Location</label>
                        <Field type="text" name="fromLocation" className={styles.formInput} />
                        <ErrorMessage name="fromLocation" component="div" className={styles.errorMessage} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>To Location</label>
                        <Field type="text" name="toLocation" className={styles.formInput} />
                        <ErrorMessage name="toLocation" component="div" className={styles.errorMessage} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>From Date</label>
                        <Field type="date" name="fromDate" className={styles.formInput} />
                        <ErrorMessage name="fromDate" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>To Date</label>
                        <Field type="date" name="toDate" className={styles.formInput} min={values.fromDate || undefined} />
                        <ErrorMessage name="toDate" component="div" className={styles.errorMessage} />
                      </div>
                    </div>
                  )}

                  {/* Food Fields */}
                  {values.type === "Food" && (
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Days</label>
                        <Field type="number" min="0" name="days" className={styles.formInput} />
                        <ErrorMessage name="days" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>From Date</label>
                        <Field type="date" name="foodFromDate" className={styles.formInput} />
                        <ErrorMessage name="foodFromDate" component="div" className={styles.errorMessage} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>To Date</label>
                        <Field type="date" name="foodToDate" className={styles.formInput} min={values.foodFromDate || undefined} />
                        <ErrorMessage name="foodToDate" component="div" className={styles.errorMessage} />
                      </div>
                    </div>
                  )}

                  {/* Miscellaneous Fields */}
                  {values.type === "Miscellaneous" && (
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Purchase Date</label>
                        <Field type="date" name="miscDate" className={styles.formInput} />
                        <ErrorMessage name="miscDate" component="div" className={styles.errorMessage} />
                      </div>
                    </div>
                  )}

                  {/* Advance and Total */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Advance Amount</label>
                      <Field type="number" min="0" name="advanceAmount" className={styles.formInput} />
                      <ErrorMessage name="advanceAmount" component="div" className={styles.errorMessage} />
                    </div>

                    <div className={styles.formGroup}  style={{ cursor: values.modeOfTravel !== "others" ? "not-allowed" : "auto" }}>
                      <label className={styles.formLabel}>Total Amount</label>
                      <Field
                        type="number"
                        name="totalAmount"
                        className={styles.formInput}
                        readOnly={values.modeOfTravel !== "others"}
                        style={{
                          backgroundColor: values.modeOfTravel !== "others" ? "#f2f2f2" : "white",
                          pointerEvents: values.modeOfTravel !== "others" ? "none" : "auto",
                        }}
                      />
                      <ErrorMessage name="totalAmount" component="div" className={styles.errorMessage} />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Upload Supporting Documents</label>
                      <input
                        type="file"
                        onChange={(e) => setFieldValue("fileAttachment", e.currentTarget.files[0])}
                        className={`${styles.formInput} ${styles.formInputFile}`}
                      />
                      <ErrorMessage name="fileAttachment" component="div" className={styles.errorMessage} />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason</label>
                    <Field as="textarea" name="reason" className={styles.formTextarea} rows={4} />
                    <ErrorMessage name="reason" component="div" className={styles.errorMessage} />
                  </div>

                  {/* Submit */}
                  <div className={styles.formFooter}>
                    <PrimaryButton label="Submit" type="submit" />
                  </div>
                </>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default ApplyReimbursement;
