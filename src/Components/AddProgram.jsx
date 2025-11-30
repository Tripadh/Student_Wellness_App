import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddProgram() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    capacity: "",
    startDate: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.startDate || !form.description) {
      setError("⚠️ Please fill all required fields before submitting.");
      return;
    }

    const programs = JSON.parse(localStorage.getItem("programs")) || [];
    programs.push({ ...form, id: Date.now() });
    localStorage.setItem("programs", JSON.stringify(programs));

    setSuccess(true);
    setTimeout(() => navigate("/admin/programs"), 1200);
  };

  const categoryColors = {
    "Mental Health": "bg-info text-dark",
    Fitness: "bg-danger",
    Nutrition: "bg-warning text-dark",
    "General Wellness": "bg-success",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-4"
    >
      <div className="col-lg-8 col-md-10 mx-auto">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold text-center mb-3 text-primary">
              ➕ Add New Wellness Program
            </h3>

            {/* ✅ Alerts */}
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="alert alert-success text-center"
              >
                ✅ Program added successfully! Redirecting...
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="fw-semibold">Program Title *</label>
                <input
                  className="form-control"
                  name="title"
                  placeholder="e.g., Mindfulness Basics"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="fw-semibold">Category *</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>Mental Health</option>
                  <option>Fitness</option>
                  <option>Nutrition</option>
                  <option>General Wellness</option>
                </select>

                {form.category && (
                  <span
                    className={`badge mt-2 px-3 py-2 ${categoryColors[form.category]}`}
                  >
                    {form.category}
                  </span>
                )}
              </div>

              {/* Capacity */}
              <div className="mb-3">
                <label className="fw-semibold">Capacity (optional)</label>
                <input
                  className="form-control"
                  name="capacity"
                  type="number"
                  placeholder="e.g., 30"
                  value={form.capacity}
                  onChange={handleChange}
                />
              </div>

              {/* Start Date */}
              <div className="mb-3">
                <label className="fw-semibold">Start Date *</label>
                <input
                  className="form-control"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="fw-semibold">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  placeholder="Briefly describe the program..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary w-100 mt-3 fw-semibold"
              >
                Add Program
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
