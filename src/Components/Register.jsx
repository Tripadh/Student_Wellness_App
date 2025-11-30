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
    role: "user", // default to user
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
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
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (isNaN(form.age) || form.age < 10 || form.age > 100) {
      setError("Please enter a valid age between 10 and 100!");
      return;
    }

    // ✅ Get existing users (real user system)
    const users = JSON.parse(localStorage.getItem("registered_users")) || [];

    // Check if email exists
    if (users.some((u) => u.email === form.email)) {
      setError("This email is already registered!");
      return;
    }

    // ✅ Create new user object
    const newUser = {
      id: Date.now(),
      name: form.name,
      age: form.age,
      gender: form.gender,
      email: form.email,
      password: form.password,
      city: form.city,
      state: form.state,
      role: form.role === "admin" ? "admin" : "user", // ensure proper role mapping
      joinedAt: new Date().toLocaleString(),
      enrolledPrograms: [],
      favorites: [],
      consultations: 0,
    };

    // ✅ Save to localStorage
    users.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(users));

    // ✅ Save auth session
    localStorage.setItem(
      "auth",
      JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      })
    );

    setError("");
    setSuccess("🎉 Registration successful! Redirecting to your dashboard...");

    // Redirect to appropriate dashboard
    setTimeout(() => {
      if (newUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user/dashboard");
      }
    }, 1500);
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
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary w-100 mt-2">Register</button>
        </form>
      </div>
    </div>
  );
}
