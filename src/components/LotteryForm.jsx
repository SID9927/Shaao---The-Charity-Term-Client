import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import AckModal from "./AckModal";
import { getNextAck, createEntry, sendEmail } from "../api";
import ResultModal from "./ResultModal";
import { FaRegCopy } from "react-icons/fa"; // copy icon

// helper: calculate age
function calcAge(dobStr) {
  if (!dobStr) return "";
  const d = new Date(dobStr);
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age >= 0 ? age : "";
}

// helper: build UPI link
function upiLink(amount) {
  const pa = encodeURIComponent(import.meta.env.VITE_UPI_ID);
  const pn = encodeURIComponent(import.meta.env.VITE_UPI_NAME);
  const am = encodeURIComponent(amount);
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=Lottery-${amount}`;
}

function copyUPI() {
  const upiId = import.meta.env.VITE_UPI_ID;
  navigator.clipboard
    .writeText(upiId)
    .then(() => {
      alert("UPI ID copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy. Please copy manually.");
    });
}

export default function LotteryForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    referralCode: "", 
    amount: 10,
    transactionId: "",
  });
  const [age, setAge] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [ackPreview, setAckPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successAck, setSuccessAck] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // field-level validation
  const [resultModal, setResultModal] = useState({
    show: false,
    success: false,
    message: "",
  });
  const requiredMark = <span style={{ color: "red" }}> *</span>;

  // auto-calc age
  useEffect(() => {
    setAge(calcAge(form.dob));
  }, [form.dob]);

  // generate QR
  useEffect(() => {
    const link = upiLink(form.amount);
    QRCode.toDataURL(link, { width: 160 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [form.amount]);

  const pleasePay = useMemo(
    () => `Please pay ₹${form.amount} via UPI and enter the Transaction ID.`,
    [form.amount]
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function clearForm() {
    setForm({
      fullName: "",
      dob: "",
      mobile: "",
      email: "",
      address: "",
      referralCode: "", 
      amount: 10,
      transactionId: "",
    });
    setAge("");
    setSuccessAck("");
    setError("");
    setErrors({});
  }

  // frontend validation
  function validateForm() {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const userAge = calcAge(form.dob);
      if (userAge < 18) newErrors.dob = "You must be at least 18 years old";
    }

    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!form.transactionId.trim())
      newErrors.transactionId = "Transaction ID is required";
    return newErrors;
  }

  async function onRegister(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const { ackPreview } = await getNextAck();
      setAckPreview(ackPreview);
      setShowModal(true);
    } catch (e) {
      setError(e.message || "Failed to get acknowledgement preview.");
    }
  }

  async function onConfirm() {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        age: typeof age === "number" ? age : Number(age),
        ackId: ackPreview,
      };
      const res = await createEntry(payload);   // registration success response

      // Prepare email details
    const emailDetails = {
      toMail: form.email,
      subject: "Registration Successful | ShaShaao - The Charity Term",
      messageBody: `
Dear ${form.fullName},

Thank you for registering with ShaShaao - The Charity Term!

Your registration was successful, and your unique acknowledgement ID is **${res.ackId}**.

We appreciate your kind participation and generosity towards our charitable cause. Together, we can make a meaningful difference.

Warm regards,  
Team ShaShaao 🌸
`,
    };

    // Send email
    try {
      await sendEmail(emailDetails);
      console.log("✅ Confirmation email sent successfully!");
    } catch (err) {
      console.error("❌ Failed to send email:", err);
    }

    // Show result modal
      setShowModal(false); // close AckModal
      setResultModal({
        show: true,
        success: true,
        message: `Registered successfully! Your Ack ID is ${res.ackId}. `,
      });
      clearForm();
    } catch (e) {
      setResultModal({
        show: true,
        success: false,
        message: e.message || "Submission failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3 text-center">Lottery Registration</h5>

        {successAck && (
          <div className="alert alert-success">
            <strong>Registered!</strong> Your acknowledgement ID is {successAck}
            .
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onRegister}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-12">
              <label className="form-label">Full name{requiredMark}</label>
              <input
                type="text"
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                name="fullName"
                value={form.fullName}
                onChange={onChange}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            {/* DOB + Age */}
            <div className="col-md-6">
              <label className="form-label">Date of birth{requiredMark}</label>
              <input
                type="date"
                className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                name="dob"
                value={form.dob}
                onChange={onChange}
              />
              {errors.dob && (
                <div className="invalid-feedback">{errors.dob}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="text"
                className="form-control"
                value={age}
                readOnly
              />
            </div>

            {/* Mobile */}
            <div className="col-md-6">
              <label className="form-label">Mobile{requiredMark}</label>
              <input
                type="tel"
                className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                name="mobile"
                value={form.mobile}
                onChange={onChange}
                placeholder="10-digit mobile number"
              />
              {errors.mobile && (
                <div className="invalid-feedback">{errors.mobile}</div>
              )}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email{requiredMark}</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Address */}
            <div className="col-12">
              <label className="form-label">Full address{requiredMark}</label>
              <textarea
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                rows="2"
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Street, Area, City, State, PIN"
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>

            {/* Amount */}
            <div className="col-md-6">
              <label className="form-label">Lottery amount{requiredMark}</label>
              <select
                className="form-select"
                name="amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
              >
                <option value={10}>₹10</option>
                <option value={30}>₹30</option>
                <option value={50}>₹50</option>
              </select>
              <div className="form-text">{pleasePay}</div>
            </div>

            {/* Transaction ID */}
            <div className="col-md-6">
              <label className="form-label">Transaction ID{requiredMark}</label>
              <input
                type="text"
                className={`form-control ${
                  errors.transactionId ? "is-invalid" : ""
                }`}
                name="transactionId"
                value={form.transactionId}
                onChange={onChange}
                placeholder="Enter UPI transaction/reference ID"
              />
              {errors.transactionId && (
                <div className="invalid-feedback">{errors.transactionId}</div>
              )}
            </div>

            {/* Payment QR */}
            <div className="col-12">
              <label className="form-label">Payment Details</label>
              <div className="qr-box d-flex gap-3 align-items-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="UPI QR" className="qr-image" />
                ) : (
                  <div className="qr-image d-flex align-items-center justify-content-center text-muted">
                    QR unavailable
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#e0e7ff",
                      marginBottom: "4px",
                    }}
                  >
                    Scan the QR code or use any UPI app
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#e0e7ff",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <strong>UPI ID:</strong> {import.meta.env.VITE_UPI_ID}
                    <FaRegCopy
                      onClick={copyUPI}
                      style={{
                        cursor: "pointer",
                        color: "#a5b4fc",
                        fontSize: "1rem",
                        transition: "color 0.2s",
                      }}
                      title="Copy to clipboard"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#c7d2fe")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "#a5b4fc")
                      }
                    />
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#e0e7ff" }}>
                    Amount: ₹{form.amount}
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code + Buttons */}
            <div className="col-12 d-flex justify-content-between align-items-center mt-3">
              {/* Left side: Referral Code */}
              <div className="d-flex align-items-center">
                <label className="form-label mb-0 me-2">Referral Code :</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "180px" }}
                  name="referralCode"
                  value={form.referralCode || ""}
                  onChange={onChange}
                  placeholder="Enter code"
                />
              </div>

              {/* Right side: Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearForm}
                  disabled={submitting}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Confirmation Modal */}
        <AckModal
          isOpen={showModal}
          onBack={() => setShowModal(false)}
          onConfirm={onConfirm}
          ackId={ackPreview}
          formData={{ ...form, age }}
        />

        <ResultModal
          isOpen={resultModal.show}
          onClose={() =>
            setResultModal({ show: false, success: false, message: "" })
          }
          success={resultModal.success}
          message={resultModal.message}
        />
      </div>
    </div>
  );
}
