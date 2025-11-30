import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WellnessTips from "./WellnessTips";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("auth")) || { name: "Student" };

  // 🔄 State
  const [wellnessLogs, setWellnessLogs] = useState([]);
  const [checklist, setChecklist] = useState({
    sleep: false,
    meditation: false,
    water: 0,
  });
  const [streak, setStreak] = useState({
    current: 0,
    best: 0,
    lastDate: null,
  });

  // 📥 Load data from localStorage on mount
  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("wellness_logs")) || [];
    const savedChecklist = JSON.parse(localStorage.getItem("wellness_checklist")) || checklist;
    const savedStreak = JSON.parse(localStorage.getItem("user_streak")) || streak;

    setWellnessLogs(logs);
    setChecklist(savedChecklist);
    setStreak(savedStreak);
  }, []);

  // 🔁 Update streak when day changes
  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastDate !== today) {
      const updated = {
        current: streak.lastDate ? streak.current + 1 : 1,
        best: Math.max(streak.best, streak.current + 1),
        lastDate: today,
      };
      setStreak(updated);
      localStorage.setItem("user_streak", JSON.stringify(updated));
    }
  }, [streak]);

  // 🧮 Calculate averages dynamically
  const avgMood = useMemo(() => {
    if (!wellnessLogs.length) return 0;
    const total = wellnessLogs.reduce((acc, w) => acc + (w.mood || 0), 0);
    return Math.round(total / wellnessLogs.length);
  }, [wellnessLogs]);

  const avgSleep = useMemo(() => {
    if (!wellnessLogs.length) return 0;
    const total = wellnessLogs.reduce((acc, w) => acc + (w.sleep || 0), 0);
    return Math.round(total / wellnessLogs.length);
  }, [wellnessLogs]);

  const avgMeditation = useMemo(() => {
    if (!wellnessLogs.length) return 0;
    const total = wellnessLogs.reduce((acc, w) => acc + (w.meditation || 0), 0);
    return Math.round(total / wellnessLogs.length);
  }, [wellnessLogs]);

  // 🏃 Generate Fitness Chart (based on sleep/steps)
  const fitnessData = wellnessLogs.slice(-7).map((w, i) => ({
    day: w.day || `Day ${i + 1}`,
    steps: Math.round((w.mood || 5) * 1000), // estimated steps based on mood
    sleep: w.sleep || 0,
  }));

  // 🍎 Nutrition Chart – mock ratio from meditation & sleep
  const nutritionData = useMemo(() => {
    const carb = 200 + avgMood * 5;
    const protein = 80 + avgMeditation;
    const fat = 50 + avgSleep;
    return [
      { nutrient: "Carbs", grams: carb },
      { nutrient: "Proteins", grams: protein },
      { nutrient: "Fats", grams: fat },
    ];
  }, [avgMood, avgMeditation, avgSleep]);

  // ✅ Goal tracking
  const goals = { steps: 8000, sleep: 8, water: 8 };
  const progress = {
    steps: Math.min(100, Math.round(((avgMood * 1000) / goals.steps) * 100)),
    sleep: Math.min(100, Math.round((avgSleep / goals.sleep) * 100)),
    water: Math.min(100, Math.round((checklist.water / goals.water) * 100)),
  };

  const overallProgress = Math.round(
    (progress.steps + progress.sleep + progress.water) / 3
  );

  const badge =
    overallProgress >= 90
      ? "🏆 Gold Champion"
      : overallProgress >= 70
      ? "🥈 Silver Achiever"
      : overallProgress >= 50
      ? "🥉 Bronze Starter"
      : "💪 Keep Going!";

  const motivationMessage =
    overallProgress >= 90
      ? "Incredible! You’re smashing your health goals!"
      : overallProgress >= 70
      ? "You’re on fire! Just a little more effort!"
      : overallProgress >= 50
      ? "Great consistency! Keep building momentum!"
      : "Every small step matters. Let’s pick up the pace!";

  // 🧘 Update Checklist
  const toggleChecklist = (key) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem("wellness_checklist", JSON.stringify(updated));
  };

  const increaseWater = () => {
    const updated = { ...checklist, water: checklist.water + 1 };
    setChecklist(updated);
    localStorage.setItem("wellness_checklist", JSON.stringify(updated));
  };

  return (
    <div className="container-fluid p-4">
      {/* 🌟 Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h2 className="fw-bold text-primary mb-2">
          👋 Welcome back, {user?.name}!
        </h2>
        <p className="text-muted">
          “Progress, not perfection. Keep showing up — your body will thank you!”
        </p>
      </motion.div>

      {/* 🔥 Stats Row */}
      <div className="row g-3 mb-4 text-center">
        {/* Streak Tracker */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100 bg-light">
            <h6 className="fw-bold text-warning mb-2">🔥 Streak Tracker</h6>
            <div className="display-6 text-danger fw-bold">
              {streak.current} 🔥
            </div>
            <p className="text-muted mb-1">Current Streak</p>
            <p className="text-success small">Best: {streak.best} days</p>
          </div>
        </div>

        {/* Goal Tracker */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100 bg-light text-start">
            <h6 className="fw-bold text-success mb-3">🎯 Daily Goal Progress</h6>
            {[
              { label: "Steps", value: progress.steps, color: "bg-success" },
              { label: "Sleep", value: progress.sleep, color: "bg-primary" },
              { label: "Water", value: progress.water, color: "bg-info" },
            ].map((goal, i) => (
              <div key={i} className="mb-2">
                <div className="d-flex justify-content-between">
                  <small>{goal.label}</small>
                  <small className="text-muted">{goal.value}%</small>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className={`progress-bar ${goal.color}`}
                    style={{ width: `${goal.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="text-center mt-3">
              <span className="badge bg-warning text-dark px-3 py-2">
                {badge}
              </span>
              <p className="small mt-2 text-muted">{motivationMessage}</p>
            </div>
          </div>
        </div>

        {/* Wellness Checklist */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100 bg-light text-start">
            <h6 className="fw-bold text-primary mb-2">✅ Daily Wellness</h6>
            <label className="d-block">
              <input
                type="checkbox"
                checked={checklist.sleep}
                onChange={() => toggleChecklist("sleep")}
              />{" "}
              Slept 8+ hours
            </label>
            <label className="d-block">
              <input
                type="checkbox"
                checked={checklist.meditation}
                onChange={() => toggleChecklist("meditation")}
              />{" "}
              Meditation 10 mins
            </label>
            <div className="mt-2">
              💧 Water Intake:{" "}
              <span className="badge bg-info text-dark">
                {checklist.water} glasses
              </span>
              <button
                className="btn btn-sm btn-outline-primary ms-2"
                onClick={increaseWater}
              >
                +1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Summary */}
      <div className="row text-center mb-5 g-3">
        {[
          { label: "Avg Mood", value: `${avgMood}/10`, color: "text-success" },
          { label: "Avg Sleep", value: `${avgSleep} hrs`, color: "text-primary" },
          { label: "Avg Meditation", value: `${avgMeditation} mins`, color: "text-warning" },
          { label: "Water Intake", value: `${checklist.water} Glasses`, color: "text-info" },
        ].map((item, idx) => (
          <div className="col-md-3 col-sm-6" key={idx}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className={`fw-bold ${item.color}`}>{item.value}</h5>
                <p className="text-muted small mb-0">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🏃 Fitness Chart */}
      <div className="mb-5">
        <h5 className="fw-bold text-dark mb-3">🏃 Weekly Fitness Activity</h5>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={fitnessData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="steps" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="sleep" stroke="#2196f3" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🍎 Nutrition Chart */}
      <div className="mb-5">
        <h5 className="fw-bold text-dark mb-3">🍎 Nutrition Breakdown</h5>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={nutritionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nutrient" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="grams" fill="#03a9f4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🌞 Daily Tip */}
      <WellnessTips />

      {/* ✨ Footer */}
      <div className="alert alert-success mt-4 shadow-sm text-center fw-semibold">
        🌱 Remember: “You don’t need to be extreme — just consistent.”
      </div>
    </div>
  );
}
