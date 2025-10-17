import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* 🔹 Header */}
        <header className="bg-dark text-white py-3 shadow-sm">
          <div className="container d-flex justify-content-between align-items-center">
            <h1 className="h4 m-0">Shaao - The Charity Term</h1>

            {/* 🔹 Navigation */}
            {/* <nav>
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
