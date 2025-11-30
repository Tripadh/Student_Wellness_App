import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply dark/light theme globally
  useEffect(() => {
    document.body.style.backgroundColor = dark ? "#121212" : "#f8f9fa";
    document.body.style.color = dark ? "white" : "black";
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`navbar navbar-expand-lg shadow-sm px-4 ${
        dark ? "bg-dark navbar-dark" : "bg-primary navbar-light"
      }`}
    >
      <div className="container-fluid">
        {/* 🌿 Brand Name */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          Student Wellness App
        </Link>

        {/* 🔹 Mobile Menu Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔹 Navigation Links */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                end
                to="/"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "fw-bold text-warning" : ""}`
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/programs"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "fw-bold text-warning" : ""}`
                }
              >
                Programs
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "fw-bold text-warning" : ""}`
                }
              >
                Login
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "fw-bold text-warning" : ""}`
                }
              >
                Register
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "fw-bold text-warning" : ""}`
                }
              >
                Support
              </NavLink>
            </li>
          </ul>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={`btn btn-sm ${
              dark ? "btn-light" : "btn-dark"
            } ms-3 rounded-pill`}
          >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
