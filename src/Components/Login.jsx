import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", captchaInput: "" });
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (role) => {
    setError("");

    // ✅ CAPTCHA Validation
    if (form.captchaInput.toUpperCase() !== captcha) {
      setError("⚠️ CAPTCHA does not match. Please try again.");
      generateCaptcha();
      return;
    }

    // ✅ Credential Validation
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        u.email === form.email &&
        u.password === form.password &&
        u.role === role
    );

    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
      navigate(role === "admin" ? "/admin" : "/user/dashboard");
    } else {
      setError("❌ Invalid credentials or role mismatch!");
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="login-card p-4 shadow-sm rounded-4">
        <h3 className="text-center mb-3 fw-bold text-primary">
          Student Wellness Hub
        </h3>
        <p className="text-center text-muted mb-3">Login to your account</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {/* Email Field */}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {/* ✅ CAPTCHA Section */}
        <div className="mb-3">
          <label>CAPTCHA Verification</label>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div
              className="captcha-box fw-bold fs-5 text-primary text-center rounded-3 p-2"
              style={{
                letterSpacing: "3px",
                background: "#eaf4ff",
                width: "130px",
                border: "2px dashed #007bff",
              }}
            >
              {captcha}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              className="btn btn-outline-secondary btn-sm"
              title="Refresh CAPTCHA"
            >
              🔄 Refresh
            </button>
          </div>
          <input
            type="text"
            className="form-control"
            name="captchaInput"
            value={form.captchaInput}
            onChange={handleChange}
            placeholder="Enter CAPTCHA here"
          />
        </div>

        {/* Login Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-success w-50 me-2"
            onClick={() => handleLogin("student")}
          >
            🎓 Student Login
          </button>

          <button
            className="btn btn-danger w-50"
            onClick={() => handleLogin("admin")}
          >
            🧑‍💼 Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
