import React from "react";
import styles from "./ExitModal.module.css";
import Button from "../Button/Button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom"; 
import useEscapeKey from "../UseEscapeKey/useEscapeKey";

function ExitModal({ onClose }) {
    useEscapeKey(onClose); 

  const navigate = useNavigate(); 

  const handleConfirm = () => {
    navigate("/pages/ViewEmployees"); 
  };

  return (
    <div className={styles["exitModal__overlay"]}>
      <div className={styles["exitModal__container"]}>
        <div className={styles["exitModal__header"]}>
          <h3>Exit Form</h3>
          <Icon
            icon="mdi:close"
            onClick={onClose}
            className={styles["exitModal__closeIcon"]}
          />
        </div>

        <div className={styles["exitModal__content"]}>
          <p>Are you sure you want to send exit form?</p>

          <div className={styles["exitModal__buttons"]}>
            <Button label="No" onClick={onClose} type="button" secondary/>
            <Button label="Yes" onClick={handleConfirm} type="button"  />
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExitModal;
