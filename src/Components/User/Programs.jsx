import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // ✅ Load programs (from localStorage or defaults)
  useEffect(() => {
    const storedPrograms = JSON.parse(localStorage.getItem("programs")) || [
      {
        title: "Morning Yoga Routine",
        category: "Wellness",
        description: "A 20-minute flow to energize your mornings.",
        startDate: "2025-12-05",
      },
      {
        title: "Strength Training 101",
        category: "Fitness",
        description: "Beginner-friendly workouts for strength and stamina.",
        startDate: "2025-12-10",
      },
      {
        title: "Balanced Nutrition Plan",
        category: "Nutrition",
        description: "A 7-day guide to eating smart and feeling great.",
        startDate: "2025-12-15",
      },
    ];
    setPrograms(storedPrograms);
  }, []);

  // ✅ Favorites and Enrollment saved locally
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorite_programs");
    return saved ? JSON.parse(saved) : [];
  });

  const [enrolled, setEnrolled] = useState(() => {
    const saved = localStorage.getItem("enrolled_programs");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Toggle Favorite
  const toggleFavorite = (title) => {
    const updated = favorites.includes(title)
      ? favorites.filter((fav) => fav !== title)
      : [...favorites, title];
    setFavorites(updated);
    localStorage.setItem("favorite_programs", JSON.stringify(updated));
  };

  // ✅ Enroll in Program
  const toggleEnroll = (title) => {
    const updated = enrolled.includes(title)
      ? enrolled.filter((en) => en !== title)
      : [...enrolled, title];
    setEnrolled(updated);
    localStorage.setItem("enrolled_programs", JSON.stringify(updated));
  };

  // ✅ Search & Filter Logic
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mt-4 mb-5">
      {/* 🌿 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h3 className="fw-bold text-primary">🌿 Wellness Programs</h3>
        <p className="text-muted">
          Explore programs crafted to elevate your fitness, nutrition, and overall well-being.
        </p>
      </motion.div>

      {/* 🔍 Search & Filter */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Filter size={18} />
            </span>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🧘 Programs List */}
      <motion.div
        className="row justify-content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((p, i) => (
            <motion.div
              key={i}
              className="col-md-4 col-sm-6 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="card h-100 shadow-sm border-0 rounded-4 p-2 program-card">
                <div className="card-body text-start">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark">{p.title}</h5>
                    <button
                      className="btn btn-sm"
                      onClick={() => toggleFavorite(p.title)}
                      title={
                        favorites.includes(p.title)
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    >
                      {favorites.includes(p.title) ? "💖" : "🤍"}
                    </button>
                  </div>
                  <span
                    className={`badge mb-2 ${
                      p.category === "Fitness"
                        ? "bg-success"
                        : p.category === "Nutrition"
                        ? "bg-info text-dark"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {p.category}
                  </span>
                  <p className="text-muted small">{p.description}</p>
                  <small className="text-secondary d-block mb-2">
                    Starts: <b>{p.startDate}</b>
                  </small>

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className={`btn btn-sm ${
                        enrolled.includes(p.title)
                          ? "btn-outline-danger"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => toggleEnroll(p.title)}
                    >
                      {enrolled.includes(p.title) ? "Unenroll" : "Enroll"}
                    </button>

                    {enrolled.includes(p.title) && (
                      <span className="badge bg-success">Enrolled</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center mt-4">
            <p className="text-muted">
              ⚠️ No programs found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </motion.div>

      {/* 💖 Favorites Section */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card mt-5 shadow-sm border-0 p-4 rounded-4"
        >
          <h6 className="fw-bold text-dark mb-3">💖 Your Favorite Programs</h6>
          <div className="d-flex flex-wrap gap-2">
            {favorites.map((fav, i) => (
              <span key={i} className="badge bg-secondary text-light px-3 py-2">
                {fav}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* 📅 Enrolled Section */}
      {enrolled.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card mt-4 shadow-sm border-0 p-4 rounded-4"
        >
          <h6 className="fw-bold text-dark mb-3">🎓 Enrolled Programs</h6>
          <div className="d-flex flex-wrap gap-2">
            {enrolled.map((en, i) => (
              <span key={i} className="badge bg-success text-light px-3 py-2">
                {en}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ✨ Motivation Footer */}
      <div className="alert alert-success mt-4 shadow-sm text-center fw-semibold rounded-4">
        🌱 “Commit to consistency — your transformation starts today.”
      </div>
    </div>
  );
}
