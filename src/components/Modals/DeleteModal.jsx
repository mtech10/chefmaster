import React from 'react';
import './Modals.css';
import './DeleteModal.css';

const DeleteModals = ({ isOpen, onClose, onConfirm, isDeleting, itemName }) => {

  if (!isOpen) return null;

  return (
    <div className="custom-confirm-overlay" onClick={onClose}>
      <div className="custom-confirm-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="confirm-header">
          <h3>Delete Recipe?</h3>
        </div>
        
        <p className="confirm-warning-text">
         Are you sure you want to permanently delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        
        <div className="confirm-actions">
          <button 
            className="confirm-cancel-btn" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="confirm-delete-btn" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Recipe"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteModals;