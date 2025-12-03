import React from "react";
import styles from "./HiringCard.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const HiringCard = ({ jobName, skills, date, applicationCount, yearOfExp }) => {
  return (
    <div>
      <div className={styles.hiringCardContainer}>
        <div>
          <h5>{jobName}</h5>
          {skills?.length > 0 && <p>{skills.join(", ")}</p>}
        </div>
        <div>
          <p className="mb-1 p-0">
            <Icon icon={"mdi:clock-outline"} width={"25"} /> {date} |{" "}
            {applicationCount} Applications
          </p>
          <p className="m-0 p-0">
            <Icon icon={"basil:bag-outline"} width={"25"} /> {yearOfExp}+ Years
          </p>
        </div>
      </div>
    </div>
  );
};

export default HiringCard;
