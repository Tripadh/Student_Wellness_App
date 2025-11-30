import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, GraduationCap, Clock } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalFavorites: 0,
  });

  // 🧠 Load real users and compute summaries
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("registered_users")) || [];

    const userDetails = storedUsers.map((user) => {
      const enrolled = user.enrolledPrograms || [];
      const favorites = user.favorites || [];
      const consultations = user.consultations || 0;
      const activityScore = Math.min(100, enrolled.length * 20 + favorites.length * 10 + consultations * 5);

      return {
        ...user,
        enrolled,
        favorites,
        consultations,
        activityScore,
      };
    });

    const totalEnrollments = userDetails.reduce(
      (acc, u) => acc + u.enrolled.length,
      0
    );
    const totalFavorites = userDetails.reduce(
      (acc, u) => acc + u.favorites.length,
      0
    );

    setUsers(userDetails);
    setSummary({
      totalUsers: userDetails.length,
      totalEnrollments,
      totalFavorites,
    });
  }, []);

  return (
    <div className="container py-4">
      {/* 🌟 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h3 className="fw-bold text-primary">👥 Real User Analytics Dashboard</h3>
        <p className="text-muted">
          View all registered users, their activity, and engagement insights.
        </p>
      </motion.div>

      {/* 📊 Summary Cards */}
      <div className="row text-center g-4 mb-5">
        <SummaryCard
          icon={<User size={30} />}
          color="bg-primary text-white"
          label="Total Users"
          value={summary.totalUsers}
        />
        <SummaryCard
          icon={<GraduationCap size={30} />}
          color="bg-success text-white"
          label="Total Enrollments"
          value={summary.totalEnrollments}
        />
        <SummaryCard
          icon={<Heart size={30} />}
          color="bg-danger text-white"
          label="Total Favorites"
          value={summary.totalFavorites}
        />
      </div>

      {/* 👤 User Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h5 className="fw-bold text-dark mb-3">📋 Registered Users</h5>
          {users.length === 0 ? (
            <p className="text-muted text-center py-4">
              No users found. Ask students to register on the platform.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="bg-light text-primary">
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Enrollments</th>
                    <th>Favorites</th>
                    <th>Activity</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.city || "—"}</td>

                      {/* Enrolled Programs */}
                      <td>
                        {u.enrolled.length > 0 ? (
                          <ul className="small text-muted mb-0">
                            {u.enrolled.map((p, idx) => (
                              <li key={idx}>{p.title || p}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      {/* Favorites */}
                      <td>
                        {u.favorites.length > 0 ? (
                          <ul className="small text-muted mb-0">
                            {u.favorites.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      {/* Activity Bar */}
                      <td>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${
                              u.activityScore > 70
                                ? "bg-success"
                                : u.activityScore > 40
                                ? "bg-warning"
                                : "bg-secondary"
                            }`}
                            role="progressbar"
                            style={{ width: `${u.activityScore}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            u.activityScore > 70
                              ? "bg-success"
                              : u.activityScore > 40
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {u.activityScore > 70
                            ? "Active"
                            : u.activityScore > 40
                            ? "Moderate"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td>
                        <small className="text-muted">
                          {u.joinedAt ? u.joinedAt : "—"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Summary Card
function SummaryCard({ icon, color, label, value }) {
  return (
    <div className="col-md-4 col-sm-6">
      <div className={`card border-0 shadow-sm rounded-4 ${color}`}>
        <div className="card-body d-flex flex-column align-items-center justify-content-center">
          {icon}
          <h5 className="fw-bold mt-2 mb-1">{value}</h5>
          <p className="small mb-0">{label}</p>
        </div>
      </div>
    </div>
  );
}
