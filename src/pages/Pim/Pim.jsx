import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card/Card";
import styles from "./Pim.module.css";
import img from "../../assets/images/profile.jpg";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import { addEmployeeSchema } from "../../utils/ValidationSchema";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Pim = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeId: "",
    createLogin: false,
    username: "",
    status: "Enabled",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

    const { enqueueSnackbar } = useSnackbar();
    const navigate=useNavigate();


  const [profileImage, setProfileImage] = useState(img);
  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Live field validation
    try {
      await addEmployeeSchema.validateAt(name, { ...formData, [name]: newValue });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleBlur = async (e) => {
    const { name } = e.target;
    try {
      await addEmployeeSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
      }));

      try {
        addEmployeeSchema.validateAt("profilePic", { ...formData, profilePic: file });
        setErrors((prev) => ({ ...prev, profilePic: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, profilePic: err.message }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployeeSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const payload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      }
      console.log("✅ Form ready to be submitted", formData);
      enqueueSnackbar("User added successfully!", { variant: "success" });
      navigate('/pim/searchedEmployeeDetails')

    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <DashboardLayout>
      <Card title="Add Employee">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="d-flex justify-content-center">
                <div className={styles.addEmployeeProfileContainer}>
                  <div
                    className={styles.addImageIcon}
                    onClick={() => document.getElementById("imageInput").click()}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon icon="material-symbols:add-rounded" />
                  </div>
                  <img src={profileImage} alt="profile" />
                </div>
              </div>
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                id="imageInput"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              {errors.profilePic && (
                <p className="text-danger text-center">{errors.profilePic}</p>
              )}
              <p className="text-center fs-small mt-2">
                Accepts .jpg, .png, .gif up to 1MB. <br />
                Recommended dimensions: 200px X 200px
              </p>
            </div>

            <div className="col-lg-8 col-md-6 col-sm-12">
              <label className="mb-1">Employee Full Name*</label>
              <div className="row">
                {["firstName", "middleName", "lastName"].map((field, index) => (
                  <div key={field} className="col-lg-4 col-md-6 col-sm-12 mb-2">
                    <input
                      type="text"
                      name={field}
                      className="inputFormStyle"
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors[field] && (
                      <small className="text-danger">{errors[field]}</small>
                    )}
                  </div>
                ))}
              </div>

              <div className="row mt-2">
                <label className="mb-1">Employee Id</label>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <input
                    type="text"
                    name="employeeId"
                    className="inputFormStyle"
                    value={formData.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.employeeId && (
                    <small className="text-danger">{errors.employeeId}</small>
                  )}
                </div>
              </div>

              <hr className="mt-4" />

             <div className={styles.formSwitchWrapper}>
  <input
    type="checkbox"
    name="createLogin"
    id="switchCheckChecked"
    className={styles.largeSwitch}
    checked={formData.createLogin}
    onChange={handleChange}
  />
  <label htmlFor="switchCheckChecked" className={styles.switchLabel}>
    Create Login Details
  </label>
</div>


              {formData.createLogin && (
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                    <label className="mb-1">Username*</label>
                    <input
                      type="text"
                      name="username"
                      className="inputFormStyle"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.username && (
                      <small className="text-danger">{errors.username}</small>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                    <label className="mb-1">Status</label>
                    <div className="row">
                      {["Enabled", "Disabled"].map((status) => (
                        <div className="col-6" key={status}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="status"
                              value={status}
                              checked={formData.status === status}
                              onChange={handleChange}
                            />
                            <label className="form-check-label mb-1">
                              {status}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <label className="mb-1">Password*</label>
                    <input
                      type="password"
                      name="password"
                      className="inputFormStyle"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                    <p className="fs-small mt-2">
                      Use uppercase, lowercase, numbers and symbols.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <label className="mb-1">Confirm Password*</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="inputFormStyle"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirmPassword && (
                      <small className="text-danger">{errors.confirmPassword}</small>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="mt-4" />
          <div className="d-flex justify-content-end">
            <Button label="Cancel" type="button" className="px-4 mx-1" secondary />
            <Button label="Save" type="submit" className="px-3" />
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default Pim;
