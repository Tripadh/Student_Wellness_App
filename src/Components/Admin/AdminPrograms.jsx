import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "General Wellness",
    capacity: "",
    startDate: "",
    description: "",
  });

  // Load programs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("programs")) || [];
    setPrograms(stored);
  }, []);

  // Save programs whenever updated
  useEffect(() => {
    localStorage.setItem("programs", JSON.stringify(programs));
  }, [programs]);

  // Handle input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or Update Program
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing !== null) {
      const updated = programs.map((p, i) => (i === editing ? form : p));
      setPrograms(updated);
      setEditing(null);
    } else {
      setPrograms([...programs, { ...form, id: Date.now() }]);
    }

    setForm({
      title: "",
      category: "General Wellness",
      capacity: "",
      startDate: "",
      description: "",
    });
  };

  // Edit Program
  const handleEdit = (index) => {
    setForm(programs[index]);
    setEditing(index);
  };

  // Delete Program
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      const updated = programs.filter((_, i) => i !== index);
      setPrograms(updated);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h3 className="fw-bold text-primary">📚 Manage Wellness Programs</h3>
        <p className="text-muted">
          Add, edit, or remove wellness programs to keep the platform up to date.
        </p>
      </motion.div>

      {/* Add / Edit Form */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h5 className="fw-bold text-success mb-3">
          {editing !== null ? "✏️ Edit Program" : "➕ Add New Program"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Program Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Mental Health</option>
                <option>Fitness</option>
                <option>Nutrition</option>
                <option>General Wellness</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 text-end">
              <button className="btn btn-success mt-3 px-4">
                {editing !== null ? "Update Program" : "Add Program"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Program List */}
      <div className="card p-4 shadow-sm border-0">
        <h5 className="fw-bold text-primary mb-3">📋 Program List</h5>
        {programs.length === 0 ? (
          <p className="text-muted text-center">No programs added yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Capacity</th>
                  <th>Start Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program, index) => (
                  <tr key={program.id}>
                    <td>{program.title}</td>
                    <td>{program.category}</td>
                    <td>{program.capacity}</td>
                    <td>{program.startDate}</td>
                    <td>{program.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
