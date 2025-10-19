import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaSync } from "react-icons/fa";
import { fetchEntriesApi } from "../api"; 

export default function AdminEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  // ✅ Fetch entries (now using API from api.js)
  async function fetchEntries() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEntriesApi();
      if (data.success) {
        setEntries(data.data);
      } else {
        setError("Failed to load entries.");
      }
    } catch (err) {
      setError("Error fetching data. Please check the server.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Filter based on search input
  const filteredEntries = entries.filter((entry) =>
    Object.values(entry).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-primary">Admin Panel – All Entries</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchEntries}>
          <FaSync className="me-1" /> Refresh
        </button>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text bg-primary text-white">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, ackId, mobile, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading entries...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Ack ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Referral Code</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Paid</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => (
                  <tr key={entry._id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{entry.ackId}</td>
                    <td>{entry.fullName}</td>
                    <td>{entry.age}</td>
                    <td>{entry.email}</td>
                    <td>{entry.mobile}</td>
                    <td>{entry.address}</td>
                    <td>{entry.referralCode}</td>
                    <td>₹{entry.amount}</td>
                    <td>{entry.transactionId}</td>
                    <td>
                      {entry.paid ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimesCircle className="text-danger" />
                      )}
                    </td>
                    <td>{new Date(entry.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
