import React, { useState, useCallback, useEffect } from "react";
import styles from "./AddEmployee.module.css";
import img from "../../assets/images/profile.jpg";
import { Icon } from "@iconify/react";
import { addEmployeeSchema } from "../../utils/ValidationSchema"
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { fetchGeneratedEmployeeId } from "../../services/addEmployeeService";
import { addEmployee } from "../../services/addEmployeeService";
import { getCompaniesByName } from "../../services/companyService";
import { getRole } from "../../services/roleService";
import Loader from "../../components/Loader/Loader";
import DashboardLayout from "../../layouts/DashboardLayout";

function AddEmployee() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    employeeId: "",
    companies: "",
    officialEmail: "",
    username: "",
    status: true,
    password: "",
    confirmPassword: "",
    profilePic: null,
    createLogin: true,
    role: ''
  };

  const [formData, setFormData] = useState(initialFormData);


  const [previewImage, setPreviewImage] = useState(img);
  const [errors, setErrors] = useState({});
  const [submitAction, setSubmitAction] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleBlur = useCallback(async (e) => {
    const { name } = e.target;
    try {
      await addEmployeeSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  }, [formData]);


  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreviewImage(reader.result);
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
      }));

      try {
        await addEmployeeSchema.validateAt("profilePic", {
          ...formData,
          profilePic: file,
        });
        setErrors((prev) => ({ ...prev, profilePic: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, profilePic: err.message }));
      }
    };
    reader.readAsDataURL(file);
  }, [formData]);

  // to fetch companies

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanyOptions(res.data);
      } else {
        enqueueSnackbar(res.message || "Failed to fetch companies", {
          variant: "error",
        });
      }
    };
    const fetchRoles = async () => {
      const res = await getRole();

      if (res.success) {
        setRoleOptions(res.data);
      } else {
        enqueueSnackbar(res.message || "Failed to fetch roles", {
          variant: "error",
        });
      }
    };
    fetchCompanies();
    fetchRoles();
  }, [enqueueSnackbar]);


  // Move company/employeeId autofetch logic inside handleChange

  const handleChange = useCallback(async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    let updatedFormData = {
      ...formData,
      [name]: newValue,
    };
    // Auto-update username when officialEmail changes
    if (name === "officialEmail") {
      updatedFormData.username = value;
    }
    // Autofetch employeeId when company changes
    if (name === "companies" && newValue) {
      const res = await fetchGeneratedEmployeeId(newValue);
      if (res.success) {
        updatedFormData = {
          ...updatedFormData,
          employeeId: res.employeeId,
          companies: newValue,
        };
        setFormData(updatedFormData);
      } else {
        enqueueSnackbar(res.message || "Failed to generate Employee ID", {
          variant: "error",
        });
        setFormData(initialFormData);
        setPreviewImage(img);
        setErrors({});
        return;
      }
    } else {
      setFormData(updatedFormData);
    }
    try {
      await addEmployeeSchema.validateAt(
        name,
        name === "companies" && newValue
          ? { ...updatedFormData, employeeId: updatedFormData.employeeId }
          : updatedFormData
      );
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  }, [formData, enqueueSnackbar]);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEmployeeSchema.validate(formData, { abortEarly: false });
      const res = await addEmployee(formData);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: "success" });
        setLoading(false);
        if (submitAction === "next") {
          navigate(`/pages/EmployeeDataSection/${res.data.id}`);
        } else if (submitAction === "finish") {
          navigate("/pages/EmployeeData");
        }
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
        setLoading(false);

      }
    } catch (err) {
      setLoading(false);
      const newErrors = {};
      if (err.inner) {
        err.inner.forEach((fieldError) => {
          newErrors[fieldError.path] = fieldError.message;
        });
      } else {
        enqueueSnackbar(err.message || "Validation failed", {
          variant: "error",
        });
      }
      setErrors(newErrors);

    }
  }, [formData, submitAction, enqueueSnackbar, navigate]);

  return (
    <DashboardLayout>
      <Card title="Add Employee" icon="mdi:account-plus-outline">
        <Loader loading={loading} text="Submitting Employee Data..." />

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left: Profile Image */}
            <div className="col-lg-4 col-md-5 col-sm-12 d-flex flex-column align-items-center">
              <div className={styles.employeeImageWrapper}>
                <div className={styles.customImageContainer}>
                  <div
                    className={styles.customAddIcon}
                    onClick={() =>
                      document.getElementById("uploadProfilePic").click()
                    }
                  >
                    <Icon icon="material-symbols:add-rounded" />
                  </div>
                  <img src={previewImage} alt="Profile" />
                </div>

                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  id="uploadProfilePic"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                {errors.profilePic && (
                  <p className={styles.errorText}>{errors.profilePic}</p>
                )}
                <p className={`${styles.hintText} text-center mt-2`}>
                  Accepts .jpg, .png, .gif up to 2MB.
                  <br />
                  Recommended: 200px X 200px
                </p>
              </div>
            </div>

            {/* Right: Name & Employee ID */}
            <div className="col-lg-8 col-md-7 col-sm-12">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="mb-1">First Name<span className={styles.star}>*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className="inputFormStyle"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.firstName && (
                    <small className={styles.errorText}>
                      {errors.firstName}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="mb-1">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    className="inputFormStyle"
                    placeholder="Middle Name"
                    value={formData.middleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.middleName && (
                    <small className={styles.errorText}>
                      {errors.middleName}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="mb-1">Last Name<span className={styles.star}>*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    className="inputFormStyle"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.lastName && (
                    <small className={styles.errorText}>
                      {errors.lastName}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-2">
                  <label className="mb-1">Company<span className={styles.star}>*</span></label>
                  <select
                    name="companies"
                    className={`inputFormStyle ${styles.AddEmployeeSelect}`}
                    value={formData.companies || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Company</option>
                    {companyOptions.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.companies && (
                    <small className={styles.errorText}>
                      {errors.companies}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-2">
                  <label className="mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    className="inputFormStyle"
                    value={formData.employeeId}
                    readOnly
                    style={{ cursor: "not-allowed" }}
                  />
                  {errors.employeeId && (
                    <small className={styles.errorText}>
                      {errors.employeeId}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-2">
                  <label className="mb-1">Role<span className={styles.star}>*</span></label>
                  <select
                    name="role"
                    className={`inputFormStyle ${styles.AddEmployeeSelect}`}
                    value={formData.role || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map((role) => (
                      <option className="text-capitalize" key={role._id} value={role._id}>
                        {role.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <small className={styles.errorText}>
                      {errors.role}
                    </small>
                  )}
                </div>

              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Bottom Section */}
          <div className="row mt-2">
            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
              <label className="mb-1">Official Email ID / User Name<span className={styles.star}>*</span></label>
              <input
                type="email"
                name="officialEmail"
                className="inputFormStyle"
                value={formData.officialEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
              />
              {errors.officialEmail && (
                <small className={styles.errorText}>
                  {errors.officialEmail}
                </small>
              )}
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
              <label className="mb-1">Password<span className={styles.star}>*</span></label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  className="inputFormStyle"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {formData.password.length > 0 && (
                  <Icon
                    icon={showPassword.password ? "mdi:eye" : "mdi:eye-off"}
                    className={styles.passwordToggleIcon}
                    onClick={() => toggleShowPassword("password")}
                  />
                )}
              </div>
              {errors.password && (
                <small className={styles.errorText}>{errors.password}</small>
              )}
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 mb-2">
              <label className="mb-1">Confirm Password<span className={styles.star}>*</span></label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="inputFormStyle"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {formData.confirmPassword.length > 0 && (
                  <Icon
                    icon={showPassword.confirmPassword ? "mdi:eye" : "mdi:eye-off"}
                    className={styles.passwordToggleIcon}
                    onClick={() => toggleShowPassword("confirmPassword")}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <small className={styles.errorText}>
                  {errors.confirmPassword}
                </small>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
            <label className="mb-1">Status</label>
            <div className="d-flex gap-4 mt-2">
              {[
                { label: "Enabled", value: true },
                { label: "Disabled", value: false },
              ].map(({ label, value }) => (
                <div key={label}>
                  <input
                    className={styles.AddEmployeelargeRadio}
                    type="radio"
                    name="status"
                    value={value.toString()} // Will be "true" or "false"
                    checked={formData.status === value} // Compare against boolean  
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "status",
                          value: e.target.value === "true", // Convert string back to boolean
                        },
                      })
                    }
                  />
                  <label className={styles.AddEmployeeEnableDisable}>{label}</label>
                </div>
              ))}
            </div>

          </div>
          {/* Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              label="Cancel"
              type="button"
              className="px-4 mx-2"
              secondary
              onClick={() => navigate(-1)}
            />
            <Button
              label="Finish"
              type="submit"
              className="px-4 mx-2"
              onClick={() => setSubmitAction("finish")}
            />
            <Button
              label="Next"
              type="submit"
              className="px-4 mx-2"
              onClick={() => setSubmitAction("next")}
            />
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default AddEmployee;
