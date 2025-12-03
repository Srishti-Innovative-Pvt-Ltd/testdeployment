import React from "react";
import styles from "./AddFormTitleModal.module.css";
import { Icon } from "@iconify/react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formTitleSchema } from "../../utils/ValidationSchema";
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function AddFormTitleModal({ onClose, onSubmit }) {
    useEscapeKey(onClose); 

  return (
    <div className={styles["formModal-overlay"]}>
      <div className={styles["formModal-container"]}>
        <div className={styles["formModal-header"]}>
          <span>Forms</span>
          <Icon
            icon="mdi:close"
            className={styles["formModal-closeIcon"]}
            onClick={onClose}
          />
        </div>

        <Formik
          initialValues={{ title: "" }}
          validationSchema={formTitleSchema}
          onSubmit={(values) => {
            onSubmit(values.title.trim());
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles["formModal-body"]}>
                <label htmlFor="title">Form</label>
                <Field
                  type="text"
                  name="title"
                  className={styles["formModal-input"]}
                  placeholder="Add Form Title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className={styles["formModal-error"]}
                />
              </div>

              <div className={styles["formModal-footer"]}>
                <PrimaryButton label="Save" type="submit" disabled={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddFormTitleModal;
