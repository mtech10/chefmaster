import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ isOpen, title, message, type = "success", onClose }) => {

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`toast-container slide-in`}>
      <div className={`toast-icon ${type}`}>
        {type === "success" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </div>
      <div className="toast-content">
        <h4>{title}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;