import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProgram() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    capacity: "",
    startDate: "",
    description: "",
  });

  useEffect(() => {
    const programs = JSON.parse(localStorage.getItem("programs")) || [];
    const existing = programs.find((p) => p.id == id);
    if (existing) setForm(existing);
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const programs = JSON.parse(localStorage.getItem("programs")) || [];
    const updated = programs.map((p) => (p.id == id ? form : p));
    localStorage.setItem("programs", JSON.stringify(updated));
    alert("Program updated successfully!");
    navigate("/admin");
  };

  return (
    <div className="col-md-8 mx-auto">
      <h3 className="mb-3 text-center">Edit Program</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Program Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Category</label>
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
        <div className="mb-3">
          <label>Capacity</label>
          <input className="form-control" name="capacity" type="number" value={form.capacity} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Start Date</label>
          <input className="form-control" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange} />
        </div>
        <button className="btn btn-success w-100">Update Program</button>
      </form>
    </div>
  );
}
