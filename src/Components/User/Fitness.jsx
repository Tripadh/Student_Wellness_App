import React, { useEffect, useMemo, useState } from "react";

// helpers
const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export default function Fitness() {
  // ---------- persisted state ----------
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("fitness_goals");
    return saved
      ? JSON.parse(saved)
      : { steps: 8000, calories: 350, workoutMins: 30, waterGlasses: 8 };
  });

  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem("fitness_log");
    return saved ? JSON.parse(saved) : {};
  });

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("fitness_checklist");
    return saved
      ? JSON.parse(saved)
      : { [todayKey()]: { water: 0, meditation: false, slept8: false } };
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("fitness_streak");
    return saved ? JSON.parse(saved) : { current: 0, best: 0, lastDone: "" };
  });

  // ---------- derived for today ----------
  const today = todayKey();
  const todayLog = log[today] || { steps: 0, calories: 0, workoutMins: 0, workouts: [] };
  const todayCheck = checklist[today] || { water: 0, meditation: false, slept8: false };

  // ---------- form state ----------
  const [stepsInput, setStepsInput] = useState("");
  const [calInput, setCalInput] = useState("");
  const [minsInput, setMinsInput] = useState("");
  const [workout, setWorkout] = useState({ type: "Walk", mins: 15, intensity: "Moderate" });

  // BMI calculator
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const bmi = useMemo(() => {
    const h = Number(heightCm) / 100;
    const w = Number(weightKg);
    if (!h || !w) return null;
    const v = +(w / (h * h)).toFixed(1);
    const cat =
      v < 18.5 ? "Underweight" : v < 25 ? "Healthy" : v < 30 ? "Overweight" : "Obese";
    return { v, cat };
  }, [heightCm, weightKg]);

  // ---------- persistence ----------
  useEffect(() => localStorage.setItem("fitness_goals", JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem("fitness_log", JSON.stringify(log)), [log]);
  useEffect(
    () => localStorage.setItem("fitness_checklist", JSON.stringify(checklist)),
    [checklist]
  );
  useEffect(() => localStorage.setItem("fitness_streak", JSON.stringify(streak)), [streak]);

  // ensure today keys exist
  useEffect(() => {
    if (!log[today]) setLog((p) => ({ ...p, [today]: todayLog }));
    if (!checklist[today]) setChecklist((p) => ({ ...p, [today]: todayCheck }));
    // eslint-disable-next-line
  }, []);

  // ---------- actions ----------
  const mergeToday = (patch) =>
    setLog((prev) => ({ ...prev, [today]: { ...todayLog, ...patch } }));

  const addQuickUpdate = () => {
    const s = Number(stepsInput || 0);
    const c = Number(calInput || 0);
    const m = Number(minsInput || 0);
    mergeToday({
      steps: todayLog.steps + s,
      calories: todayLog.calories + c,
      workoutMins: todayLog.workoutMins + m,
    });
    setStepsInput("");
    setCalInput("");
    setMinsInput("");
  };

  const addWorkout = () => {
    const entry = { ...workout, id: crypto.randomUUID() };
    mergeToday({ workouts: [...todayLog.workouts, entry], workoutMins: todayLog.workoutMins + Number(workout.mins || 0) });
    setWorkout({ type: "Walk", mins: 15, intensity: "Moderate" });
  };

  const removeWorkout = (id) =>
    mergeToday({ workouts: todayLog.workouts.filter((w) => w.id !== id) });

  const incWater = () =>
    setChecklist((p) => ({
      ...p,
      [today]: { ...todayCheck, water: Math.min(goals.waterGlasses, todayCheck.water + 1) },
    }));

  const toggleCheck = (k) =>
    setChecklist((p) => ({ ...p, [today]: { ...todayCheck, [k]: !todayCheck[k] } }));

  const saveGoals = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setGoals({
      steps: Number(f.get("gSteps")),
      calories: Number(f.get("gCalories")),
      workoutMins: Number(f.get("gMins")),
      waterGlasses: Number(f.get("gWater")),
    });
  };

  // streak logic: if steps+workoutMins+water goal met today => mark & update streak
  useEffect(() => {
    const met =
      todayLog.steps >= goals.steps &&
      todayLog.workoutMins >= goals.workoutMins &&
      todayCheck.water >= goals.waterGlasses;

    if (met && streak.lastDone !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const continueStreak = streak.lastDone === yesterday;
      const next = {
        lastDone: today,
        current: continueStreak ? streak.current + 1 : 1,
        best: Math.max(streak.best, continueStreak ? streak.current + 1 : 1),
      };
      setStreak(next);
    }
  }, [todayLog.steps, todayLog.workoutMins, todayCheck.water, goals, streak, today]);

  // progress helper
  const pct = (val, goal) => Math.min(100, Math.round((val / Math.max(1, goal)) * 100));

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h4 className="fw-bold text-primary mb-2">💪 Fitness — Daily Hub</h4>
        <div className="badge rounded-pill bg-success-subtle text-success fw-semibold">
          🗓 {today}
        </div>
      </div>

      {/* Row 1: Summary & Streak & BMI */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">Today’s Summary</h6>
            <div className="row text-center g-3">
              <div className="col-4">
                <div className="p-3 rounded bg-light">
                  <div className="h5 mb-0 text-success">{todayLog.steps}</div>
                  <small className="text-muted">Steps</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded bg-light">
                  <div className="h5 mb-0 text-danger">{todayLog.calories}</div>
                  <small className="text-muted">Calories</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded bg-light">
                  <div className="h5 mb-0 text-primary">{todayLog.workoutMins}m</div>
                  <small className="text-muted">Workout</small>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <small className="text-muted">Quick add</small>
              <div className="row g-2 mt-1">
                <div className="col-4">
                  <input className="form-control" type="number" placeholder="+ Steps" value={stepsInput} onChange={(e) => setStepsInput(e.target.value)} />
                </div>
                <div className="col-4">
                  <input className="form-control" type="number" placeholder="+ Calories" value={calInput} onChange={(e) => setCalInput(e.target.value)} />
                </div>
                <div className="col-4">
                  <div className="input-group">
                    <input className="form-control" type="number" placeholder="+ Minutes" value={minsInput} onChange={(e) => setMinsInput(e.target.value)} />
                    <button className="btn btn-primary" onClick={addQuickUpdate}>Add</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals progress */}
            <div className="mt-4">
              <h6 className="fw-semibold mb-2">Goals Progress</h6>
              {[
                { label: "Steps", val: todayLog.steps, goal: goals.steps, cls: "bg-success" },
                { label: "Workout Minutes", val: todayLog.workoutMins, goal: goals.workoutMins, cls: "bg-primary" },
                { label: "Water", val: todayCheck.water, goal: goals.waterGlasses, cls: "bg-info" },
              ].map((g) => (
                <div key={g.label} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <small>{g.label}</small>
                    <small className="text-muted">
                      {g.val}/{g.goal}
                    </small>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className={`progress-bar ${g.cls}`} style={{ width: `${pct(g.val, g.goal)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streak + BMI */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">🔥 Streaks</h6>
            <div className="text-center">
              <div className="display-6 text-warning">{streak.current} 🔥</div>
              <small className="text-muted d-block">Current streak</small>
              <div className="mt-2">Best: <b>{streak.best}</b> days</div>
              <small className="text-muted">Goal must be met daily to continue</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">⚖️ BMI Checker</h6>
            <div className="row g-2">
              <div className="col-6">
                <input className="form-control" type="number" placeholder="Height (cm)" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              </div>
              <div className="col-6">
                <input className="form-control" type="number" placeholder="Weight (kg)" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              {bmi ? (
                <div className="alert alert-light mb-0 border d-flex justify-content-between">
                  <span>BMI: <b>{bmi.v}</b></span>
                  <span className="fw-semibold">{bmi.cat}</span>
                </div>
              ) : (
                <small className="text-muted">Enter height & weight to calculate</small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Workout Log + Daily Checklist + Goals editor */}
      <div className="row g-3 mt-1">
        {/* Workout log */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">🏋️ Add Workout</h6>
            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" value={workout.type} onChange={(e) => setWorkout({ ...workout, type: e.target.value })}>
                  <option>Walk</option>
                  <option>Run</option>
                  <option>Cycling</option>
                  <option>Yoga</option>
                  <option>HIIT</option>
                  <option>Strength</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Minutes</label>
                <input className="form-control" type="number" value={workout.mins} onChange={(e) => setWorkout({ ...workout, mins: Number(e.target.value) })} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Intensity</label>
                <select className="form-select" value={workout.intensity} onChange={(e) => setWorkout({ ...workout, intensity: e.target.value })}>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div className="col-12 mt-2">
                <button className="btn btn-success" onClick={addWorkout}>Add to Log</button>
              </div>
            </div>

            <hr />
            <h6 className="fw-semibold mb-2">Today’s Workouts</h6>
            {todayLog.workouts.length === 0 ? (
              <small className="text-muted">No workouts logged yet.</small>
            ) : (
              <ul className="list-group list-group-flush">
                {todayLog.workouts.map((w) => (
                  <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{w.type} • {w.mins} mins • {w.intensity}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeWorkout(w.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Daily checklist */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">✅ Daily Checklist</h6>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Water</span>
              <div>
                <span className="badge bg-info me-2">{todayCheck.water}/{goals.waterGlasses}</span>
                <button className="btn btn-sm btn-outline-info" onClick={incWater}>+1 glass</button>
              </div>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="med" checked={todayCheck.meditation} onChange={() => toggleCheck("meditation")} />
              <label className="form-check-label" htmlFor="med">10 min meditation</label>
            </div>
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="sleep" checked={todayCheck.slept8} onChange={() => toggleCheck("slept8")} />
              <label className="form-check-label" htmlFor="sleep">Slept 8 hours</label>
            </div>
            <small className="text-muted d-block mt-2">Tip: small habits → big results.</small>
          </div>
        </div>

        {/* Goals editor */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">🎯 Edit Goals</h6>
            <form onSubmit={saveGoals} className="row g-2">
              <div className="col-12">
                <label className="form-label">Daily Steps</label>
                <input name="gSteps" type="number" className="form-control" defaultValue={goals.steps} />
              </div>
              <div className="col-12">
                <label className="form-label">Workout Minutes</label>
                <input name="gMins" type="number" className="form-control" defaultValue={goals.workoutMins} />
              </div>
              <div className="col-12">
                <label className="form-label">Max Calories</label>
                <input name="gCalories" type="number" className="form-control" defaultValue={goals.calories} />
              </div>
              <div className="col-12">
                <label className="form-label">Water (glasses)</label>
                <input name="gWater" type="number" className="form-control" defaultValue={goals.waterGlasses} />
              </div>
              <div className="col-12 mt-2">
                <button className="btn btn-primary w-100">Save Goals</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* tips */}
      <div className="alert alert-primary mt-3 border-0 shadow-sm">
        💡 <b>Pro tip:</b> Logging even tiny activities keeps your streak alive. Aim for
        consistency over perfection!
      </div>
    </div>
  );
}
