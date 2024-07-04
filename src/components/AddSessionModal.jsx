// AddSessionModal.jsx
import React from 'react';
import '../CSS/Modal.css'; 

const AddSessionModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const sessionData = Object.fromEntries(formData);
    onAdd(sessionData);
    onClose(); // Close modal after adding
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <form onSubmit={handleSubmit}>
          <h2>Add New Session</h2>
          {/* Add form fields for session details */}
          <input name="title" placeholder="Session Title" required />
          {/* Include more inputs for session details */}
          <button type="submit">Add Session</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddSessionModal;
