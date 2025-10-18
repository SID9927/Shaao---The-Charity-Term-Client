import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import logoName from "./assets/Logo1.png";

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* 🔹 Header */}
        <header className="bg-dark text-white py-3 shadow-sm">
          <div className="container d-flex align-items-center">
            {/* 🔹 Logo before heading */}
            <a href="/" className="me-3 d-flex align-items-center">
              <img
                src={logoName}
                alt="Shaao Logo"
                style={{ width: "25px", height: "auto" }}
              />
            </a>

            {/* 🔹 Title */}
            <h1 className="h4 m-0">Shaao - The Charity Term</h1>

            {/* (Optional) Navigation on the right */}
            {/* <nav className="ms-auto">
      <Link to="/" className="text-white text-decoration-none me-3">
        Home
      </Link>
      <Link to="/admin" className="text-white text-decoration-none">
        Admin
      </Link>
    </nav> */}
          </div>
        </header>

        {/* 🔹 Main Content */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* 🔹 Footer */}
        <footer className="bg-light py-3 mt-auto border-top">
          <div className="container text-center text-muted">
            © {new Date().getFullYear()} Shaao - The Charity Term
          </div>
        </footer>
      </div>
    </Router>
  );
}
