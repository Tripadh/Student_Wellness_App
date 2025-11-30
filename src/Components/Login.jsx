import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (roleType) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.email === email && u.password === password && u.role === roleType
    );

    if (foundUser) {
      localStorage.setItem("auth", JSON.stringify(foundUser));
      if (foundUser.role === "admin") navigate("/admin");
      else navigate("/user");
    } else {
      setError("Invalid credentials or role mismatch!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg p-4">
        <h3 className="text-center text-primary fw-bold mb-3">
          Student Wellness Hub
        </h3>
        <p className="text-center text-muted mb-4">
          Login to your account
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}

          {/* Separate login buttons */}
          <div className="d-flex justify-content-between mt-3">
            <button
              type="button"
              className="btn btn-success w-50 me-2"
              onClick={() => handleLogin("student")}
            >
              👨‍🎓 Student Login
            </button>
            <button
              type="button"
              className="btn btn-danger w-50"
              onClick={() => handleLogin("admin")}
            >
              🧑‍💼 Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
