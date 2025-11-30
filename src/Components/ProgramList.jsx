import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProgramList.css";

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // ✅ Fetch from localStorage or load default seed data
    const savedPrograms = JSON.parse(localStorage.getItem("programs"));
    if (savedPrograms && savedPrograms.length > 0) {
      setPrograms(savedPrograms);
    } else {
      const defaultPrograms = [
        {
          title: "Mindfulness Basics",
          category: "Mental Health",
          description:
            "A 10-day guided meditation course to reduce anxiety and boost mindfulness.",
          startDate: "2025-12-01",
        },
        {
          title: "Campus 5K Training",
          category: "Fitness",
          description:
            "A structured 2-week plan to help students train for the annual campus 5K marathon.",
          startDate: "2025-12-10",
        },
        {
          title: "Healthy Eating 101",
          category: "Nutrition",
          description:
            "Discover simple and affordable meal plans for sustained energy and focus.",
          startDate: "2025-12-05",
        },
        {
          title: "Yoga for Focus",
          category: "Wellness",
          description:
            "Daily yoga sessions designed to improve concentration and calmness.",
          startDate: "2025-12-03",
        },
        {
          title: "Digital Detox Challenge",
          category: "Mental Health",
          description:
            "7-day challenge to help students disconnect from screens and reconnect with life.",
          startDate: "2025-12-12",
        },
        {
          title: "Strength Training for Beginners",
          category: "Fitness",
          description:
            "Learn the fundamentals of strength training with zero equipment required.",
          startDate: "2025-12-07",
        },
        {
          title: "Sleep Better Workshop",
          category: "Wellness",
          description:
            "Practical techniques to improve sleep quality and build a consistent rest routine.",
          startDate: "2025-12-09",
        },
        {
          title: "Hydration & You",
          category: "Nutrition",
          description:
            "Understand the importance of hydration and how it affects mental and physical performance.",
          startDate: "2025-12-11",
        },
        {
          title: "Stress Buster Bootcamp",
          category: "Mental Health",
          description:
            "A 5-day bootcamp with breathing exercises, self-care, and guided therapy sessions.",
          startDate: "2025-12-15",
        },
        {
          title: "Mind-Body Connection Workshop",
          category: "Wellness",
          description:
            "Explore how your emotions, posture, and breathing influence your overall health.",
          startDate: "2025-12-08",
        },
      ];
      setPrograms(defaultPrograms);
      localStorage.setItem("programs", JSON.stringify(defaultPrograms));
    }
  }, []);

  // ✅ Filter + Search Logic
  const filteredPrograms = programs.filter((p) => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Fitness", "Mental Health", "Nutrition", "Wellness"];

  return (
    <div className="programs-section container py-5 text-center">
      {/* 🌿 Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="fw-bold text-primary mb-2">🌿 Explore Wellness Programs</h2>
        <p className="text-muted mb-4">
          Filter by category or search to find programs that fit your lifestyle.
        </p>
      </motion.div>

      {/* 🔍 Search & Filter */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4">
        <input
          type="text"
          className="form-control w-auto"
          style={{ minWidth: "250px" }}
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="btn-group" role="group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${
                filter === cat ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Program Grid */}
      <div className="row justify-content-center">
        <AnimatePresence>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((p, index) => (
              <motion.div
                key={index}
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="program-card p-4 shadow-sm h-100 rounded-4 border-0 hover-scale">
                  <h5 className="fw-bold text-dark">{p.title}</h5>
                  <span
                    className={`badge mb-2 ${
                      p.category === "Fitness"
                        ? "bg-danger"
                        : p.category === "Mental Health"
                        ? "bg-info"
                        : p.category === "Nutrition"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {p.category}
                  </span>
                  <p className="text-muted small">{p.description}</p>
                  <small className="text-secondary d-block mt-2">
                    Starts on: <b>{p.startDate}</b>
                  </small>
                  <button className="btn btn-sm btn-outline-primary mt-3">
                    Join Now
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted mt-4"
            >
              No programs match your search or filter.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
