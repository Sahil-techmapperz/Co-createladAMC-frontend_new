// Modal component

import React from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999"
      }}
    >
      <div
        style={{
          width: "80%", // Adjust the width as a percentage
          maxWidth: "600px", // Set a maximum width
          position: "relative",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          style={{
            color: "white",
            borderRadius: "8px",
            backgroundColor: "red",
            border: "none",
            outline: "none",
            width: "fit-content",
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={closeModal}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
