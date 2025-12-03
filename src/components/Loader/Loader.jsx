import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ loading, size = 40, color = "#4A90E2", text }) => {
  if (!loading) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.loaderBox}>
        <ClipLoader size={size} color={color} />
        {text && <p style={styles.text}>{text}</p>}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999
  },
  loaderBox: {
    display: "flex", flexDirection: "column", alignItems: "center"
  },
  text: {
    marginTop: "10px", color: "#fff", fontSize: "16px"
  }
};

export default Loader;
