// src/hooks/useEscapeKey.jsx
import { useEffect } from "react";

const useEscapeKey = (onEscape) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEscape]);
};

export default useEscapeKey;
