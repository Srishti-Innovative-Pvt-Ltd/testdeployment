import React, { useEffect, useState } from "react";
import styles from "./EmployeeIdPatternModal.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { employeeIdPatternSchema } from "../../utils/ValidationSchema";
import {
  createEmployeeIdPattern,
  updateEmployeeIdPattern,
} from "../../services/settingsService";
import { getCompanies } from "../../services/companyService";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import{getCompaniesByName} from "../../services/companyService";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function EmployeeIdPatternModal({ onClose, initialData }) {
    useEscapeKey(onClose); 

  const { enqueueSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data);
      } else {
        enqueueSnackbar("Failed to fetch companies", { variant: "error" });
      }
    };
    fetchCompanies();
  }, []);

  // ✅ Create handler
  const handleCreateSubmit = async (values) => {
    const payload = {
      companyId: values.companyId,
      employeeIdPattern: {
        prefix: values.prefix,
        nextSequence: Number(values.nextSequence),
      },
      usernameFromEmail: true,
    };

    const response = await createEmployeeIdPattern(payload);
    if (response.success) {
      enqueueSnackbar("Employee ID Pattern saved successfully!", {
        variant: "success",
      });
      onClose();
    } else {
      enqueueSnackbar(response.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  // ✅ Edit handler
  const handleEditSubmit = async (values) => {
    const payload = {
      employeeIdPattern: {
        prefix: values.prefix,
        nextSequence: Number(values.nextSequence),
      },
      usernameFromEmail: true,
    };

    const response = await updateEmployeeIdPattern(initialData._id, payload);
    if (response.success) {
      enqueueSnackbar("Employee ID Pattern updated successfully!", {
        variant: "success",
      });
      onClose();
    } else {
      enqueueSnackbar(response.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  // Common handler that routes based on whether editing
  const handleSubmit = async (values) => {
    if (initialData?._id) {
      await handleEditSubmit(values);
    } else {
      await handleCreateSubmit(values);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{initialData ? "Edit" : "Add"} Employee ID Pattern</h3>
          <Icon icon="mdi:close" onClick={onClose} className={styles.closeIcon} />
        </div>
        <Formik
          initialValues={{
            companyId:
              typeof initialData?.companyId === "object"
                ? initialData.companyId._id
                : initialData?.companyId || "",
            prefix: initialData?.employeeIdPattern?.prefix || "",
            nextSequence: initialData?.employeeIdPattern?.nextSequence || "",
          }}
          validationSchema={employeeIdPatternSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="companyId">Company Name<span className={styles.star}>*</span></label>
                <Field
                  as="select"
                  name="companyId"
                  id="companyId"
                  disabled={!!initialData} // disable when editing
                  className={!!initialData ? styles.disabledSelect : ""}
                >
                  <option value="">Select Company<span className={styles.star}>*</span></option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="companyId" component="div" className={styles.error} />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="prefix">Prefix<span className={styles.star}>*</span></label>
                <Field type="text" name="prefix" placeholder="e.g., EMP" />
                <ErrorMessage name="prefix" component="div" className={styles.error} />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="nextSequence">Next Sequence<span className={styles.star}>*</span></label>
                <Field type="number" name="nextSequence" placeholder="e.g., 1001" />
                <ErrorMessage name="nextSequence" component="div" className={styles.error} />
              </div>

              <div className={styles.buttonWrapper}>
                <PrimaryButton label={initialData ? "Update" : "Save"} type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EmployeeIdPatternModal;
