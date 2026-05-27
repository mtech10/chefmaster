
import React from 'react';
import './Modals.css'; 

const LoadingModal = ({ isOpen = true, message = "Loading..." }) => {
  
  if (!isOpen) return null;

  return (
    <div className="custom-confirm-overlay">
      <div className="loading-modal-box">
        
        <div className="modal-spinner"></div>
        
        <p className="loading-modal-text">{message}</p>
        
      </div>
    </div>
  );
};

export default LoadingModal;