import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Brain,
  HeartPulse,
  Salad,
  Dumbbell,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function Consultation() {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [latestMood, setLatestMood] = useState(null);
  const [bookings, setBookings] = useState([]);

  // 🧠 Fetch latest mood from Wellness Tracker
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("wellness_logs")) || [];
      if (data.length > 0) {
        const lastEntry = data[data.length - 1];
        setLatestMood(lastEntry.mood || 6);
      } else {
        setLatestMood(6);
      }
    } catch (err) {
      console.error("Error reading wellness data:", err);
      setLatestMood(6);
    }

    // Load saved bookings
    const saved = JSON.parse(localStorage.getItem("booked_sessions")) || [];
    setBookings(saved);
  }, []);

  // 🤖 AI Suggestion
  const aiSuggestion = useMemo(() => {
    if (latestMood >= 9)
      return "🌈 You’re energetic today! A fitness coach could help you optimize your performance.";
    if (latestMood >= 7)
      return "💪 You’re doing well — maybe consult a nutritionist to maintain energy balance.";
    if (latestMood >= 5)
      return "🌤️ A lifestyle expert could help fine-tune your daily routine.";
    if (latestMood >= 3)
      return "🧠 Feeling low? Talk to a mindfulness or psychology specialist.";
    return "💬 Consider connecting with a mental health professional for support.";
  }, [latestMood]);

  // 🩺 Expert Data
  const experts = {
    "Mental Health": [
      { name: "Dr. Neha Sharma", role: "Clinical Psychologist", available: true, time: "10 AM - 4 PM" },
      { name: "Dr. Arjun Mehta", role: "Mindfulness Coach", available: false, time: "2 PM - 8 PM" },
    ],
    Nutrition: [
      { name: "Dr. Kavita Iyer", role: "Dietitian & Gut Health", available: true, time: "9:30 AM - 3 PM" },
      { name: "Dr. Rahul Verma", role: "Sports Nutritionist", available: true, time: "11 AM - 5 PM" },
    ],
    "Fitness & Recovery": [
      { name: "Anita Das", role: "Physical Therapist", available: false, time: "1 PM - 7 PM" },
      { name: "Vikram Sen", role: "Fitness Trainer", available: true, time: "6 AM - 2 PM" },
    ],
    "Lifestyle Coaching": [
      { name: "Sakshi Patel", role: "Yoga & Sleep Coach", available: true, time: "8 AM - 12 PM" },
      { name: "Rohan Gupta", role: "Holistic Life Mentor", available: false, time: "3 PM - 9 PM" },
    ],
  };

  // 💾 Save Booking
  const handleConfirmBooking = (expert, date, time) => {
    const newBooking = {
      id: Date.now(),
      name: expert.name,
      role: expert.role,
      date,
      time,
    };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem("booked_sessions", JSON.stringify(updated));
    setSelectedExpert(null);
  };

  // ❌ Cancel Session
  const cancelBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("booked_sessions", JSON.stringify(updated));
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h3 className="fw-bold text-primary">🩺 Wellness Consultation Hub</h3>
        <p className="text-muted">
          Connect with experts across fitness, nutrition, and mental wellness — all in one place.
        </p>
      </motion.div>

      {/* AI Suggestion */}
      <motion.div
        className="alert alert-info text-center fw-semibold shadow-sm mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🤖 <b>AI Suggestion:</b> {aiSuggestion}
      </motion.div>

      {/* 🗓 My Booked Sessions */}
      {bookings.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold text-dark mb-3">📅 My Upcoming Sessions</h5>
          <div className="row g-3">
            {bookings.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                className="col-md-6 col-lg-4"
              >
                <div className="card border-0 shadow-sm p-3 h-100 bg-light">
                  <h6 className="fw-bold text-primary">{session.name}</h6>
                  <p className="text-muted small mb-2">{session.role}</p>
                  <p className="mb-1">
                    <Clock size={14} className="me-2 text-success" />
                    {session.time} | {new Date(session.date).toLocaleDateString()}
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => cancelBooking(session.id)}
                    >
                      <Trash2 size={14} className="me-1" />
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        setSelectedExpert({ name: session.name, role: session.role })
                      }
                    >
                      <RefreshCw size={14} className="me-1" />
                      Rebook
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Categories */}
      {Object.entries(experts).map(([category, people]) => (
        <motion.div
          key={category}
          className="mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h5 className="fw-bold text-dark mb-3">
            {category === "Mental Health" && <Brain className="me-2 text-primary" />}
            {category === "Nutrition" && <Salad className="me-2 text-success" />}
            {category === "Fitness & Recovery" && <Dumbbell className="me-2 text-danger" />}
            {category === "Lifestyle Coaching" && <HeartPulse className="me-2 text-warning" />}
            {category}
          </h5>

          <div className="row g-3">
            {people.map((expert, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="col-md-6 col-lg-4"
              >
                <div
                  className="card border-0 shadow-sm p-3 h-100"
                  style={{
                    borderLeft: expert.available ? "5px solid #4caf50" : "5px solid #ccc",
                  }}
                >
                  <h6 className="fw-bold text-dark mb-1">{expert.name}</h6>
                  <p className="text-muted small mb-2">{expert.role}</p>
                  <div className="d-flex justify-content-between align-items-center small">
                    <span className={expert.available ? "text-success" : "text-danger"}>
                      {expert.available ? "🟢 Available" : "🔴 Busy"}
                    </span>
                    <span className="text-muted">
                      <Clock size={14} className="me-1" />
                      {expert.time}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`btn btn-sm mt-3 w-100 ${
                      expert.available ? "btn-primary" : "btn-secondary"
                    }`}
                    disabled={!expert.available}
                    onClick={() => setSelectedExpert(expert)}
                  >
                    <Calendar size={14} className="me-2" />
                    Book a Session
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedExpert && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card p-4 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{ maxWidth: 420 }}
            >
              <h5 className="fw-bold text-primary mb-2">
                Booking with {selectedExpert.name}
              </h5>
              <p className="text-muted small mb-3">{selectedExpert.role}</p>
              <label className="form-label">Select Date</label>
              <input id="booking-date" type="date" className="form-control mb-3" />
              <label className="form-label">Preferred Time</label>
              <input id="booking-time" type="time" className="form-control mb-3" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn btn-success w-100"
                onClick={() =>
                  handleConfirmBooking(
                    selectedExpert,
                    document.getElementById("booking-date").value,
                    document.getElementById("booking-time").value
                  )
                }
              >
                Confirm Booking
              </motion.button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => setSelectedExpert(null)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="alert alert-success mt-4 text-center fw-semibold shadow-sm">
        🌿 “Tracking your progress helps you grow — keep up your wellness journey!”
      </div>
    </div>
  );
}
