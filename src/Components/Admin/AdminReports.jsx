import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Download,
  Printer,
  Filter,
  CalendarDays,
  Users,
  ClipboardList,
  CheckCircle2,
  Timer,
  Activity,
} from "lucide-react";

/**
 * AdminReports
 * Data sources expected in localStorage:
 * - consultations: [{ id, name, email, category, date:'YYYY-MM-DD', time, status }]
 * - programs:      [{ id?, title, category, startDate, ... }]
 * - registered_users: [{ id?, name, email, role, ... }]
 */
export default function AdminReports() {
  const [range, setRange] = useState({
    from: "",
    to: "",
  });
  const [category, setCategory] = useState("All");

  const [raw, setRaw] = useState({
    consultations: [],
    programs: [],
    users: [],
  });

  // 📥 Load once
  useEffect(() => {
    const consultations =
      JSON.parse(localStorage.getItem("consultations")) || [];
    const programs = JSON.parse(localStorage.getItem("programs")) || [];
    const users =
      JSON.parse(localStorage.getItem("registered_users")) ||
      JSON.parse(localStorage.getItem("users")) || []; // fallback

    setRaw({ consultations, programs, users });
  }, []);

  // 🧮 Filtered consultations
  const filtered = useMemo(() => {
    const { from, to } = range;
    const inRange = (dStr) => {
      if (!from && !to) return true;
      const d = new Date(dStr);
      if (from && d < new Date(from)) return false;
      if (to && d > new Date(to)) return false;
      return true;
    };

    return raw.consultations.filter(
      (c) =>
        inRange(c.date) &&
        (category === "All" ? true : c.category === category)
    );
  }, [raw.consultations, range, category]);

  // 🧾 KPIs
  const kpi = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((c) => c.status === "Completed").length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    // Avg days from today to session date (only items with a date)
    const daysArr = filtered
      .filter((c) => c.date)
      .map((c) => {
        const s = new Date(c.date);
        const today = new Date();
        const diff = Math.round((s - today) / (1000 * 60 * 60 * 24));
        return diff;
      });
    const avgDays =
      daysArr.length > 0
        ? Math.round(daysArr.reduce((a, b) => a + b, 0) / daysArr.length)
        : 0;

    const activeUsers = raw.users.length;
    const programs = raw.programs.length;

    return { total, completionRate, avgDays, activeUsers, programs };
  }, [filtered, raw.users.length, raw.programs.length]);

  // 📈 Charts data
  const byDate = useMemo(() => {
    // group by date
    const map = new Map();
    filtered.forEach((c) => {
      const key = c.date || "No Date";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [filtered]);

  const byCategory = useMemo(() => {
    const cats = ["Mental Health", "Fitness", "Nutrition", "Wellness"];
    const map = new Map();
    cats.forEach((c) => map.set(c, 0));
    filtered.forEach((c) => {
      map.set(c.category, (map.get(c.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const byStatus = useMemo(() => {
    const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    const map = new Map();
    statuses.forEach((s) => map.set(s, 0));
    filtered.forEach((c) => map.set(c.status, (map.get(c.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // 💡 Insights (simple rule-based)
  const insights = useMemo(() => {
    const lines = [];
    if (kpi.completionRate >= 75)
      lines.push("👏 Strong completion rate — consultant scheduling is effective.");
    if (kpi.avgDays > 7)
      lines.push("⏳ Average lead time is high. Consider adding more consultant slots.");
    const busiest =
      byCategory
        .slice()
        .sort((a, b) => b.value - a.value)
        .find((x) => x.value > 0)?.name || null;
    if (busiest)
      lines.push(`🔥 Highest demand: ${busiest}. Prioritize capacity here.`);
    const pending = byStatus.find((s) => s.name === "Pending")?.value || 0;
    if (pending > 0)
      lines.push(`📌 ${pending} pending sessions — quick confirmations can raise morale.`);
    if (!lines.length) lines.push("✅ Operations look balanced across categories and statuses.");
    return lines;
  }, [kpi, byCategory, byStatus]);

  // 🎯 Export CSV
  const exportCSV = () => {
    const headers = [
      "name",
      "email",
      "category",
      "date",
      "time",
      "status",
      "consultant",
      "meeting",
      "notesCount",
    ];
    const rows = filtered.map((c) => ({
      name: c.name || "",
      email: c.email || "",
      category: c.category || "",
      date: c.date || "",
      time: c.time || "",
      status: c.status || "",
      consultant: c.consultant || "",
      meeting: c.meeting || "",
      notesCount: Array.isArray(c.notes) ? c.notes.length : c.notes || 0,
    }));

    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((r) =>
          headers
            .map((h) => {
              const v = (r[h] ?? "").toString().replace(/"/g, '""');
              return `"${v}"`;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🎨 chart palette
  const COLORS = ["#1976d2", "#43a047", "#ffb300", "#ef5350", "#6c757d", "#8e24aa"];

  return (
    <div className="container py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="d-flex flex-wrap align-items-center justify-content-between mb-4"
      >
        <div>
          <h3 className="fw-bold text-primary mb-1">📊 Admin Reports</h3>
          <div className="text-muted small">
            Operational overview of consultations, users, and programs.
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => window.print()}>
            <Printer size={16} className="me-2" /> Print
          </button>
          <button className="btn btn-success d-flex align-items-center"
                  onClick={exportCSV}>
            <Download size={16} className="me-2" /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div className="d-flex align-items-center text-secondary">
              <Filter size={18} className="me-2" />
              <span className="fw-semibold">Filters</span>
            </div>
            <div>
              <label className="form-label small mb-1">From</label>
              <input
                type="date"
                className="form-control"
                value={range.from}
                onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label small mb-1">To</label>
              <input
                type="date"
                className="form-control"
                value={range.to}
                onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label small mb-1">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All</option>
                <option>Mental Health</option>
                <option>Fitness</option>
                <option>Nutrition</option>
                <option>Wellness</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <KPI icon={<ClipboardList size={22} />} color="bg-primary" label="Consultations" value={kpi.total} />
        <KPI icon={<CheckCircle2 size={22} />} color="bg-success" label="Completion Rate" value={`${kpi.completionRate}%`} />
        <KPI icon={<Timer size={22} />} color="bg-warning text-dark" label="Avg Days to Session" value={kpi.avgDays} />
        <KPI icon={<Users size={22} />} color="bg-info text-dark" label="Active Users" value={kpi.activeUsers} />
        <KPI icon={<Activity size={22} />} color="bg-secondary" label="Programs" value={kpi.programs} />
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <Card title="Consultations Over Time" subtitle="Count of sessions by date">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={byDate}>
                <defs>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#1976d2" fill="url(#colorC)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-lg-5">
          <Card title="Status Split" subtitle="Pending / Confirmed / Completed / Cancelled">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={95} label>
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-lg-6">
          <Card title="Category Distribution" subtitle="Where demand is highest">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8,8,0,0]}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-lg-6">
          <Card title="Programs Calendar Heat (Quick View)" subtitle="Upcoming program load by start date">
            <div className="small text-muted mb-2">
              (Lightweight summary of how many programs start on a given date)
            </div>
            <ProgramHeat programs={raw.programs} />
          </Card>
        </div>
      </div>

      {/* Insights */}
      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body">
          <h6 className="fw-bold text-dark mb-2">🧠 Quick Insights</h6>
          <ul className="mb-0">
            {insights.map((line, i) => (
              <li key={i} className="text-muted">{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers & Subcomponents ---------- */

function KPI({ icon, color, label, value }) {
  return (
    <div className="col-md-6 col-lg-4 col-xl-3">
      <div className={`card border-0 shadow-sm rounded-4 ${color}`}>
        <div className="card-body d-flex align-items-center gap-3 text-white">
          <div className="rounded-3 bg-dark bg-opacity-10 p-2">{icon}</div>
          <div>
            <div className="small opacity-75">{label}</div>
            <div className="fs-5 fw-bold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body">
        <h6 className="fw-bold text-dark mb-1">{title}</h6>
        {subtitle && <div className="text-muted small mb-3">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

/** Tiny “heat” summary: programs per startDate */
function ProgramHeat({ programs }) {
  const counts = useMemo(() => {
    const map = new Map();
    programs.forEach((p) => {
      if (!p.startDate) return;
      map.set(p.startDate, (map.get(p.startDate) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [programs]);

  if (counts.length === 0) {
    return <div className="text-muted small">No upcoming program start dates.</div>;
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {counts.map(({ date, count }, i) => (
        <div
          key={i}
          className="rounded-3 px-3 py-2"
          style={{
            background:
              count >= 4
                ? "#1976d2"
                : count === 3
                ? "#42a5f5"
                : count === 2
                ? "#90caf9"
                : "#e3f2fd",
            color: count >= 3 ? "white" : "#0d47a1",
            minWidth: 110,
          }}
          title={`${count} program(s)`}
        >
          <div className="small">{date}</div>
          <div className="fw-semibold">{count} program(s)</div>
        </div>
      ))}
    </div>
  );
}
