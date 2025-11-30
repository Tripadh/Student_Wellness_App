import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    city: "",
    state: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation checks
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.email ||
      !form.password ||
      !form.city ||
      !form.state
    ) {
      setError("All fields are required!");
      setSuccess("");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address!");
      setSuccess("");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setSuccess("");
      return;
    }

    if (isNaN(form.age) || form.age < 10 || form.age > 100) {
      setError("Please enter a valid age between 10 and 100!");
      setSuccess("");
      return;
    }

    // ✅ Check if email already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === form.email)) {
      setError("This email is already registered!");
      setSuccess("");
      return;
    }

    // ✅ Save user data to localStorage
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));

    // ✅ Success message
    setError("");
    setSuccess("✅ Registration successful! Redirecting to login...");

    // ✅ Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="register-wrapper d-flex align-items-center justify-content-center">
      <div className="register-card p-4 shadow-sm">
        <h3 className="text-center mb-3 fw-bold text-primary">
          Student Wellness Hub - Register 🌿
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label>Name</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          {/* Age & Gender */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter your age"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select
                className="form-select"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
            />
          </div>

          {/* City & State */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>City</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>State</label>
              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-3">
            <label>Role</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button className="btn btn-primary w-100 mt-2">
            Register Account
          </button>
        </form>
      </div>
    </div>
  );
}
