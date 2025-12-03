import styles from "./Button.module.css";

export default function Button({ label, onClick, type, className, secondary }) {
  return (
    <button
      className={`${secondary ? styles.secondaryButton : styles.blueButton} ${
        className || ""
      }`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
