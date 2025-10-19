import React from "react";
import Modal from "react-modal";
import "../Modal.css";
import { FaTelegramPlane } from "react-icons/fa"; // ✅ added
import { FaInstagramPlane } from "react-icons/fa"; // ✅ added

Modal.setAppElement("#root");

export default function ResultModal({ isOpen, onClose, success, message }) {
  const telegramLink = import.meta.env.VITE_TELEGRAM_LINK; // ✅ fetch from .env
  const instagramLink = import.meta.env.VITE_INSTAGRAM_LINK; // ✅ fetch from .env

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <h4
        className="modal-header"
        style={{ color: success ? "#22c55e" : "#ef4444" }}
      >
        {success ? "Success" : "Failed"}
      </h4>

      <p className="modal-message">{message}</p>

      {/* ✅ Extra message below only if success */}
      {success && telegramLink && (
        <div
          className="mt-3 d-flex align-items-center justify-content-center gap-2"
          style={{ fontSize: "0.9rem" }}
        >
          <span>Join us on</span>
          {/* <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#229ED9",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 500,
            }}
          >
            <FaTelegramPlane size={18} />
            Telegram
          </a> */}
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#229ED9",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 500,
            }}
          >
            <FaInstagramPlane size={18} />
            Telegram
          </a>
        </div>
      )}

      <button className="btn btn-primary mt-4" onClick={onClose}>
        OK
      </button>
    </Modal>
  );
}
