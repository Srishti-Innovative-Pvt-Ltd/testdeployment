import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import nameLogo from "../../assets/images/logoTitle_main.png";
import Button from "../../components/Button/Button";
import logo from "../../assets/images/logo_main.png";
import { login } from "../../services/authService";
import { useSnackbar } from "notistack";
import { getUserId, getUserRole, getVerificationStatus } from "../../utils/roleUtils";
import { Icon } from "@iconify/react";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  const { enqueueSnackbar } = useSnackbar();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validate = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Stop login if validation fails
      return;
    }

    try {
      const result = await login({
        email: credentials.username,
        password: credentials.password,
      });

      if (result.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.admin.user.role.name);//login role

        const userId = result?.admin?.user?.employeeRef?._id || result?.admin?.user?._id || null;
        if (userId) {
          localStorage.setItem("user_id", userId);
        }

        // Company ID if available
        const companyId = result?.data?.user?.employeeRef?.company || result?.admin?.user?.employeeRef?.company || null;
        if (companyId) {
          localStorage.setItem("company_id", companyId);
        }


        // Verification status only if it exists
        if (result.admin.user.employeeRef?.verificationStatus) {
          localStorage.setItem(
            "verificationStatus",
            result.admin.user.employeeRef.verificationStatus
          );
        } else {
          localStorage.removeItem("verificationStatus"); // clear old value if logging in as admin
        }



        enqueueSnackbar(result.message || "Login successful!", { variant: "success" });

        const role = getUserRole();
        const user_id = getUserId();
        const verificationStatus = getVerificationStatus();

        // Redirect rules
        if (role !== "admin") {
          if (verificationStatus === "pending") {
            // Pending status → go to Employee Data Section
            navigate(`/pages/EmployeeDataSection/${user_id}`, { replace: true });
          }
          else if (verificationStatus === "verificationPending" || verificationStatus === "rejected") {
            // Verification pending or rejected → progress dashboard
            navigate("/VerificationProgressDashboard", { replace: true });
          }
          else if (verificationStatus === "completed") {
            // Completed → role-based dashboards
            if (role === "hr") {
              navigate("/dashboard", { replace: true });
            } else if (role === "employee") {
              navigate("/dashboard", { replace: true });
            } else if (role === "manager") {
              navigate("/dashboard", { replace: true });
            } else {
              navigate("/VerificationProgressDashboard", { replace: true }); // fallback
            }
          }
          else {
            // Any unexpected status → safe fallback
            navigate("/VerificationProgressDashboard", { replace: true });
          }
        }
        else {
          // Admin always goes to default dashboard
          navigate("/dashboard", { replace: true });
        }


      } else {
        enqueueSnackbar(result.message || "Invalid username or password", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContainerBg}>
        <div className={styles.loginInputContainer}>
          <div>
            <img src={nameLogo} alt="logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="mt-3">
              <label className={styles.LoginlabelStyle}>
                <i className="ri-user-3-line"></i> Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                className={styles.inputStyle}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
              {errors.username && <div className="error">{errors.username}</div>}
            </div>

            <div className="mt-4 mb-3">
              <label className={styles.LoginlabelStyle}>
                <i className="ri-key-line"></i> Password
              </label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={credentials.password}
                  className={styles.inputStyle}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                {credentials.password.length > 0 && (
                  <Icon
                    icon={showPassword ? "mdi:eye" : "mdi:eye-off"}
                    className={styles.passwordToggleIcon}
                    onClick={toggleShowPassword}
                  />
                )}
              </div>
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            <Button label={"Log In"} type="submit" className="w-100 mt-2" />
          </form>

          <div className="mt-2 text-center">
            <Link to={""} className="text-decoration-none">
              Forgot Password
            </Link>
          </div>
        </div>

        <div className={styles.loginLogoContainer}>
          <img src={logo} alt="login visual" />
        </div>
      </div>
    </div>
  );
};

export default Login;
