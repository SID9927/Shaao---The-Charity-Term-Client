import React from "react";
import Modal from "react-modal";
import "../Modal.css";

Modal.setAppElement("#root");

export default function AckModal({ isOpen, onBack, onConfirm, ackId, formData }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onBack}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        },
        content: {
          position: "relative",
          inset: "unset",
          width: "420px",
          maxWidth: "95%",
          borderRadius: "16px",
          padding: "24px",
          background: "rgba(49, 46, 129, 0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          animation: "fadeIn 0.4s ease, slideUp 0.5s ease",
          overflow: "hidden",
        },
      }}
    >
      <h3 className="modal-header">Confirm Your Details</h3>

      <div className="modal-content">
        <p><strong>Ack ID:</strong> {ackId}</p>
        <p><strong>Name:</strong> {formData?.fullName}</p>
        <p><strong>Email:</strong> {formData?.email}</p>
        <p><strong>Mobile:</strong> {formData?.mobile}</p>
        <p><strong>DOB:</strong> {formData?.dob}</p>
        <p><strong>Address:</strong> {formData?.address}</p>
        <p><strong>Amount:</strong> ₹{formData?.amount}</p>
        <p><strong>Transaction ID:</strong> {formData?.transactionId}</p>
      </div>

      <div className="modal-actions">
        <button className="btn btn-cancel" onClick={onBack}>Back</button>
        <button className="btn btn-confirm" onClick={onConfirm}>Confirm & Submit</button>
      </div>
    </Modal>
  );
}
