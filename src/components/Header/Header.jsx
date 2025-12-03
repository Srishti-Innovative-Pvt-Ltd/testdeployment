import { Icon } from "@iconify/react/dist/iconify.js";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getUserRole, getUserId } from "../../utils/roleUtils";
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import defaultImg from "../../assets/images/profile.jpg";
import { fetchProfileImage } from "../../services/addEmployeeService";

const Header = ({ title = "Dashboard", isCollapsed }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("User");
  const [profilePic, setProfilePic] = useState(defaultImg);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const role = getUserRole();
    if (role) {
      const formatted = role
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setDisplayName(formatted);
    }

    const loadProfile = async () => {
      const userId = getUserId();
      const filePath = await fetchProfileImage(userId);
      if (filePath) {
        setProfilePic(`${UPLOADS_PATH_BASE_URL}${filePath}`);
      }
    };

    loadProfile();
  }, []);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("verificationStatus");
    localStorage.removeItem("company_id");
    navigate("/", { replace: true });
  };

  return (
    <header
      className={`${styles.header} ${isCollapsed ? styles.collapsedHeader : ""
        }`}
    >
      <h3 className={styles.headerTitle}>{title}</h3>
      <div className={styles.actions}>
        {/* Notification Icon */}
        <div className={styles.notification}>
          <Icon
            icon="mdi:bell-badge-outline"
            className={styles.notificationIcon}
          />
        </div>

        {/* Role text + Profile Image */}
        <div className={styles.profileWrapper} ref={dropdownRef}>
          <span className={styles.displayName}>{displayName}</span>
          <img
            src={profilePic}
            alt="Profile"
            className={styles.profileImage}
            onClick={() => setShowDropdown((prev) => !prev)}
          />

          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <Icon icon="mdi:logout" width="20" />
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
