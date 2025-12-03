import React from "react";
import styles from "./PrimaryButton.module.css";

export default function PrimaryButton({
  label,
  onClick,
  type = "button",
  className = "",
  secondary = false, 
}) {
  return (
    <button
      className={`${secondary ? styles.primarySecondary : styles.primaryButton} ${className}`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

