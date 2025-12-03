import React from "react";
import styles from "./FilePreview.module.css"; // or your existing styles

const FilePreview = ({ file, uploadsBaseUrl, onImagePreview }) => {
  if (!file) return null;

  let name, url;
  if (typeof file === "string") {
    const path = file.startsWith("/") ? file : `${file}`;
    url = file.startsWith("http") ? file : `${uploadsBaseUrl}${path}`;
    name = file.split("/").pop();
  } else if (file instanceof File) {
    url = URL.createObjectURL(file);
    name = file.name;
  }

  const isPdf = name?.toLowerCase().endsWith(".pdf");

  return isPdf ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.previewLink}
    >
      {name}
    </a>
  ) : (
    <span
      className={styles.previewLink}
      onClick={() => onImagePreview(file)}
    >
      {name}
    </span>
  );
};

export default FilePreview;
