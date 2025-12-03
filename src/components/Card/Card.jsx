import styles from "./Card.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const Card = ({ title, children, icon, none }) => {
  return (
    <div className={styles.dashboardCard}>
      <p>
        <Icon icon={icon} className={styles.icon} />{" "}
        <span className="fw-medium">{title}</span>
      </p>
      {!none ? <hr /> : ""}
      {children}
    </div>
  );
};

export default Card;
