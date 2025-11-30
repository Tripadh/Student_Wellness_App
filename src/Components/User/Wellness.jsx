import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Wellness() {
  // 🌿 Load saved or default data
  const [wellnessData, setWellnessData] = useState(() => {
    const saved = localStorage.getItem("wellness_logs");
    return saved
      ? JSON.parse(saved)
      : [
          { day: "Mon", date: "Nov 24, 2025", mood: 7, sleep: 6, meditation: 10 },
          { day: "Tue", date: "Nov 25, 2025", mood: 8, sleep: 7, meditation: 15 },
          { day: "Wed", date: "Nov 26, 2025", mood: 6, sleep: 5, meditation: 5 },
          { day: "Thu", date: "Nov 27, 2025", mood: 9, sleep: 8, meditation: 20 },
          { day: "Fri", date: "Nov 28, 2025", mood: 8, sleep: 7, meditation: 10 },
          { day: "Sat", date: "Nov 29, 2025", mood: 7, sleep: 6, meditation: 8 },
          { day: "Sun", date: "Nov 30, 2025", mood: 9, sleep: 8, meditation: 25 },
        ];
  });

  // 🌤️ Form states
  const [manualDay, setManualDay] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [mood, setMood] = useState("😊");
  const [sleep, setSleep] = useState("");
  const [meditation, setMeditation] = useState("");
  const [gratitude, setGratitude] = useState("");

  // 🌸 Daily Motivational Quotes
  const affirmations = [
    "🌈 You are becoming the best version of yourself.",
    "💫 Peace begins the moment you take a deep breath.",
    "🌻 Your calmness is your superpower.",
    "🔥 Every day is a fresh start to rise stronger.",
    "🌊 Let go of what you can’t control — breathe and flow.",
  ];
  const dailyQuote = useMemo(
    () => affirmations[Math.floor(Math.random() * affirmations.length)],
    []
  );

  // 💾 Save wellness logs
  useEffect(() => {
    localStorage.setItem("wellness_logs", JSON.stringify(wellnessData));
  }, [wellnessData]);

  // ✅ Add a new entry manually
  const addWellnessEntry = () => {
    if (!manualDay || !manualDate || !sleep || !meditation || !gratitude) {
      alert("Please fill all fields including Day and Date!");
      return;
    }

    const newEntry = {
      day: manualDay,
      date: manualDate,
      mood:
        mood === "😔"
          ? 4
          : mood === "😐"
          ? 6
          : mood === "😊"
          ? 8
          : mood === "😁"
          ? 10
          : 5,
      sleep: Number(sleep),
      meditation: Number(meditation),
      gratitude,
    };

    setWellnessData((prev) => [...prev.slice(-6), newEntry]);
    setManualDay("");
    setManualDate("");
    setSleep("");
    setMeditation("");
    setGratitude("");
  };

  // 🧠 Calculate Averages
  const avgMood = Math.round(
    wellnessData.reduce((acc, w) => acc + w.mood, 0) / wellnessData.length
  );
  const avgSleep = Math.round(
    wellnessData.reduce((acc, w) => acc + w.sleep, 0) / wellnessData.length
  );
  const avgMeditation = Math.round(
    wellnessData.reduce((acc, w) => acc + w.meditation, 0) / wellnessData.length
  );

  // 💡 Insights
  const insight =
    avgMood >= 9
      ? "🌞 You’re glowing with positivity — keep shining your light!"
      : avgMood >= 7
      ? "💛 You’re doing amazing — remember to stay consistent with meditation."
      : avgMood >= 5
      ? "🌤️ Some ups and downs — try deep breathing or a walk outdoors."
      : "🌧️ Tough week? Journaling or gratitude can bring calm energy.";

  // 🎯 Mood Distribution Data
  const moodCount = wellnessData.reduce(
    (acc, w) => {
      if (w.mood >= 9) acc.happy++;
      else if (w.mood >= 7) acc.good++;
      else if (w.mood >= 5) acc.okay++;
      else acc.low++;
      return acc;
    },
    { happy: 0, good: 0, okay: 0, low: 0 }
  );

  const moodData = [
    { name: "Happy", value: moodCount.happy },
    { name: "Good", value: moodCount.good },
    { name: "Okay", value: moodCount.okay },
    { name: "Low", value: moodCount.low },
  ];

  const COLORS = ["#4caf50", "#8bc34a", "#ffc107", "#f44336"];

  return (
    <div className="container mt-4 mb-5">
      {/* 🌅 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h3 className="fw-bold text-primary">🧘 Wellness & Mindfulness Tracker</h3>
        <p className="text-muted">
          Log your own day and date — track mood, sleep, meditation & gratitude.
        </p>
      </motion.div>

      {/* 🌿 Manual Entry Form */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h6 className="fw-bold text-secondary mb-3">🌿 Log Wellness Entry</h6>
        <div className="row g-3 align-items-end">
          {/* Manual Day */}
          <div className="col-md-2">
            <label className="form-label">Day</label>
            <select
              className="form-select"
              value={manualDay}
              onChange={(e) => setManualDay(e.target.value)}
            >
              <option value="">Select</option>
              <option>Mon</option>
              <option>Tue</option>
              <option>Wed</option>
              <option>Thu</option>
              <option>Fri</option>
              <option>Sat</option>
              <option>Sun</option>
            </select>
          </div>

          {/* Manual Date */}
          <div className="col-md-2">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => {
                const dateObj = new Date(e.target.value);
                const formatted = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                setManualDate(formatted);
              }}
            />
          </div>

          {/* Mood */}
          <div className="col-md-2">
            <label className="form-label">Mood</label>
            <select
              className="form-select"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option>😔</option>
              <option>😐</option>
              <option>😊</option>
              <option>😁</option>
            </select>
          </div>

          {/* Sleep */}
          <div className="col-md-2">
            <label className="form-label">Sleep (hrs)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 7"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
          </div>

          {/* Meditation */}
          <div className="col-md-2">
            <label className="form-label">Meditation (mins)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 15"
              value={meditation}
              onChange={(e) => setMeditation(e.target.value)}
            />
          </div>

          {/* Gratitude */}
          <div className="col-md-4 mt-3">
            <label className="form-label">Gratitude Note</label>
            <input
              type="text"
              className="form-control"
              placeholder="Something you’re thankful for..."
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
          </div>

          <div className="col-md-2 mt-3">
            <button onClick={addWellnessEntry} className="btn btn-primary w-100">
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* 📈 Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold text-dark mb-2">📈 Mood & Sleep Trends</h6>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={wellnessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#4caf50" strokeWidth={3} />
                <Line type="monotone" dataKey="sleep" stroke="#2196f3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold text-dark mb-2">💖 Emotion Radar</h6>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={moodData} dataKey="value" outerRadius={90} label>
                  {moodData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 💬 Gratitude Journal */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h6 className="fw-bold text-dark mb-3">🌸 Gratitude Journal</h6>
        <ul className="list-group list-group-flush">
          {wellnessData
            .filter((w) => w.gratitude)
            .slice(-5)
            .reverse()
            .map((entry, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <b>
                    {entry.day} - {entry.date}:
                  </b>{" "}
                  {entry.gratitude}
                </span>
                <span className="text-muted small">
                  {entry.mood >= 8 ? "🌞" : "🌤️"}
                </span>
              </motion.li>
            ))}
        </ul>
      </div>

      {/* 🧠 Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="alert alert-success mt-4 text-center fw-semibold shadow-sm"
      >
        {insight}
      </motion.div>

      {/* 🌅 Daily Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="alert alert-info mt-3 text-center shadow-sm fw-semibold"
      >
        {dailyQuote}
      </motion.div>
    </div>
  );
}
