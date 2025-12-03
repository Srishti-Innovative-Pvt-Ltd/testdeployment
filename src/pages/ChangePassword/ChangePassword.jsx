import React from "react";
import styles from "./ChangePassword.module.css";
import { Icon } from "@iconify/react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { ChangePasswordSchema } from "../../utils/ValidationSchema";
import { useFormik } from "formik";
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey";

function ChangePassword({ onClose }) {
    useEscapeKey(onClose); 

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      // Call API or handle password change logic here
    },
  });

  return (
    <div className={styles.changePassword__modalOverlay}>
      <div className={styles.changePassword__modal}>
        <div className={styles.changePassword__modalHeader}>
          <h3>Change Password</h3>
          <Icon
            icon="mdi:close"
            onClick={onClose}
            className={styles.changePassword__closeIcon}
          />
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.changePassword__modalBody}>
          <div className={styles.changePassword__row}>
            <div className={styles.changePassword__inputGroup}>
              <label>User Name</label>
              <input type="text" value="Username" readOnly />
            </div>

            <div className={styles.changePassword__inputGroup}>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="**********"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.currentPassword && formik.errors.currentPassword && (
                <span className={styles.errorText}>{formik.errors.currentPassword}</span>
              )}
            </div>
          </div>

          <div className={styles.changePassword__row}>
            <div className={styles.changePassword__inputGroup}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="**********"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <span className={styles.errorText}>{formik.errors.newPassword}</span>
              )}
            </div>

            <div className={styles.changePassword__inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="**********"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className={styles.errorText}>{formik.errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className={styles.changePassword__modalFooter}>
            <PrimaryButton label="Cancel" onClick={onClose} secondary />
            <PrimaryButton label="Confirm" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
