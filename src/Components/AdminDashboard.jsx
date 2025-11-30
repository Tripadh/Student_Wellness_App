import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("auth"));
    if (!loggedUser || loggedUser.role !== "admin") {
      navigate("/login");
      return;
    }
    setAdmin(loggedUser);

    // Load all programs
    const savedPrograms = JSON.parse(localStorage.getItem("programs")) || [];
    setPrograms(savedPrograms);

    // Load all students (filter by role)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    setStudents(users.filter((u) => u.role === "student"));
  }, [navigate]);

  const deleteProgram = (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      const updated = programs.filter((p) => p.id !== id);
      setPrograms(updated);
      localStorage.setItem("programs", JSON.stringify(updated));
    }
  };

  // Data for Pie Chart
  const data = [
    { name: "Mental Health", value: programs.filter((p) => p.category === "Mental Health").length },
    { name: "Fitness", value: programs.filter((p) => p.category === "Fitness").length },
    { name: "Nutrition", value: programs.filter((p) => p.category === "Nutrition").length },
    { name: "Wellness", value: programs.filter((p) => p.category === "Wellness").length },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="admin-container container py-5">
      {/* ✅ Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2 className="fw-bold text-primary">👩‍💼 Admin Dashboard</h2>
        {admin && (
          <p className="text-muted">
            Welcome back, <span className="fw-bold text-dark">{admin.name}</span> 👋
          </p>
        )}
      </motion.div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-secondary">Program Management</h4>
        <Link to="/add" className="btn btn-primary shadow-sm">
          + Add New Program
        </Link>
      </div>

      {/* ✅ Pie Chart Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <h5 className="text-muted mb-3">📊 Program Category Overview</h5>
        <PieChart width={350} height={300} className="mx-auto">
          <Pie data={data} dataKey="value" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </motion.div>

      {/* ✅ Programs Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-5"
      >
        <h4 className="fw-bold text-secondary mb-3">📚 Wellness Programs</h4>
        <div className="table-responsive">
          <table className="table table-bordered align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.length > 0 ? (
                programs.map((p, index) => (
                  <tr key={index}>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.startDate}</td>
                    <td>{p.capacity || "N/A"}</td>
                    <td>
                      <Link
                        to={`/edit/${p.id}`}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProgram(p.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No programs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ✅ Student List Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h4 className="fw-bold text-secondary mb-3">🎓 Registered Students</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>City</th>
                <th>State</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>{s.age}</td>
                    <td>{s.gender}</td>
                    <td>{s.city}</td>
                    <td>{s.state}</td>
                    <td>{s.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
