import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  LineChart,
  Line,
} from "recharts";

export default function Nutrition() {
  // ✅ Load saved meals or initialize
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("nutrition_meals");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "Oatmeal with Fruits",
            type: "Breakfast",
            calories: 350,
            protein: 15,
            carbs: 40,
            fats: 10,
          },
          {
            name: "Grilled Chicken & Rice",
            type: "Lunch",
            calories: 550,
            protein: 25,
            carbs: 60,
            fats: 18,
          },
          {
            name: "Veg Salad & Soup",
            type: "Dinner",
            calories: 500,
            protein: 20,
            carbs: 55,
            fats: 16,
          },
        ];
  });

  const [form, setForm] = useState({
    name: "",
    type: "Breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  // ✅ Persist meals to localStorage
  useEffect(() => {
    localStorage.setItem("nutrition_meals", JSON.stringify(meals));
  }, [meals]);

  // ✅ Totals
  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fats: acc.fats + meal.fats,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      ),
    [meals]
  );

  const goals = { calories: 2000, protein: 100, carbs: 250, fats: 70 };

  const progress = {
    calories: Math.min(100, Math.round((totals.calories / goals.calories) * 100)),
    protein: Math.min(100, Math.round((totals.protein / goals.protein) * 100)),
    carbs: Math.min(100, Math.round((totals.carbs / goals.carbs) * 100)),
    fats: Math.min(100, Math.round((totals.fats / goals.fats) * 100)),
  };

  // ✅ Add new meal
  const addMeal = () => {
    const { name, type, calories, protein, carbs, fats } = form;
    if (!name || !calories || !protein || !carbs || !fats) {
      alert("Please fill all fields!");
      return;
    }

    const newMeal = {
      name,
      type,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
    };
    setMeals([...meals, newMeal]);
    setForm({
      name: "",
      type: "Breakfast",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
  };

  // ✅ Delete a meal
  const deleteMeal = (index) => {
    if (window.confirm("Remove this meal?")) {
      const updated = meals.filter((_, i) => i !== index);
      setMeals(updated);
    }
  };

  // ✅ AI-style feedback message
  const message =
    totals.calories < 1500
      ? "🍽️ Below calorie goal — add a snack!"
      : totals.calories > 2200
      ? "⚠️ Over calorie goal — try balancing tomorrow!"
      : "✅ Great! Your intake looks balanced today.";

  const macroData = [
    { name: "Protein", value: totals.protein },
    { name: "Carbs", value: totals.carbs },
    { name: "Fats", value: totals.fats },
  ];

  const weeklyData = [
    { day: "Mon", calories: 1800 },
    { day: "Tue", calories: 2000 },
    { day: "Wed", calories: 2100 },
    { day: "Thu", calories: 1900 },
    { day: "Fri", calories: 2050 },
    { day: "Sat", calories: 2200 },
    { day: "Sun", calories: 1750 },
  ];

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h3 className="fw-bold text-primary">🥗 Nutrition Tracker</h3>
        <p className="text-muted">
          Log your meals, visualize nutrition, and stay in control of your diet.
        </p>
      </motion.div>

      {/* Add Meal Section */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h6 className="fw-bold text-secondary mb-3">🍽️ Add a Meal</h6>
        <div className="row g-2">
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          {["name", "calories", "protein", "carbs", "fats"].map((field) => (
            <div className="col-md-2" key={field}>
              <input
                type={field === "name" ? "text" : "number"}
                className="form-control"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="col-md-2">
            <button onClick={addMeal} className="btn btn-primary w-100">
              Add Meal
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Meal Log Table */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-light fw-bold text-primary">
          🧾 Today's Meals
        </div>
        <div className="table-responsive">
          <table className="table table-striped align-middle text-center mb-0">
            <thead className="table-primary">
              <tr>
                <th>Type</th>
                <th>Meal Name</th>
                <th>Calories</th>
                <th>Protein (g)</th>
                <th>Carbs (g)</th>
                <th>Fats (g)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {meals.map((meal, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>
                      <span className="badge bg-info text-dark">
                        {meal.type}
                      </span>
                    </td>
                    <td>{meal.name}</td>
                    <td>{meal.calories}</td>
                    <td>{meal.protein}</td>
                    <td>{meal.carbs}</td>
                    <td>{meal.fats}</td>
                    <td>
                      <button
                        onClick={() => deleteMeal(index)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        ✖
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h6 className="fw-bold text-success mb-3">🎯 Daily Goal Progress</h6>
        {Object.keys(progress).map((key, i) => (
          <div key={i} className="mb-2">
            <div className="d-flex justify-content-between">
              <small>{key.charAt(0).toUpperCase() + key.slice(1)}</small>
              <small>{progress[key]}%</small>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className={`progress-bar ${
                  progress[key] >= 100 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${progress[key]}%` }}
              ></div>
            </div>
          </div>
        ))}
        <p className="mt-3 text-muted small text-center">{message}</p>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold text-dark mb-2">🍞 Macronutrient Split</h6>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={macroData} dataKey="value" outerRadius={90} label>
                  {macroData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold text-dark mb-2">📊 Calorie Intake per Meal</h6>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={meals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#ff9800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card p-3 shadow-sm border-0 mt-4">
        <h6 className="fw-bold text-dark mb-2">📅 Weekly Calorie Trend</h6>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#4caf50"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Motivation Footer */}
      <div className="alert alert-info mt-4 text-center shadow-sm fw-semibold">
        🥦 “Eat smart, stay strong — your plate is your power!”
      </div>
    </div>
  );
}
