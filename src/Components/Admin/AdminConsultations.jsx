import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  User,
  Brain,
  Activity,
  Apple,
  Smile,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  Link as LinkIcon,
  NotebookPen,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/**
 * AdminConsultations.jsx
 * A professional, data-driven admin page to manage all student consultations.
 * - Filters: search, category, status, date range
 * - KPIs + trends + category mix
 * - Inline actions: assign consultant, update status, set meeting link, add notes
 * - Conflict detection for consultant schedules
 * - CSV Export
 * Persisted in localStorage under `consultations`
 */

const CATEGORY_COLORS = {
  "Mental Health": "#00bcd4",
  Fitness: "#ef5350",
  Nutrition: "#4caf50",
  Wellness: "#6c757d",
};
const STATUS_BADGE = {
  Pending: "bg-warning text-dark",
  Confirmed: "bg-info text-dark",
  Completed: "bg-success",
  Cancelled: "bg-secondary",
};

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [noteModal, setNoteModal] = useState({ open: false, idx: null, text: "" });

  // Seed sample data if empty
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("consultations"));
    if (stored && stored.length) {
      setConsultations(stored);
      return;
    }
    const seed = [
      {
        id: 1,
        name: "Priyanshu",
        email: "priyanshu@student.edu",
        gender: "male",
        category: "Mental Health",
        date: "2025-12-05",
        time: "10:00",
        message: "Feeling exam stress, want coping strategies.",
        status: "Pending",
        consultant: "",
        meetLink: "",
        notes: [],
        createdAt: Date.now() - 1000 * 60 * 60 * 72,
        updatedAt: Date.now() - 1000 * 60 * 30,
      },
      {
        id: 2,
        name: "Riya",
        email: "riya@student.edu",
        gender: "female",
        category: "Nutrition",
        date: "2025-12-06",
        time: "15:30",
        message: "Need a simple low-budget diet plan.",
        status: "Confirmed",
        consultant: "Dr. Menon",
        meetLink: "https://meet.example/riya",
        notes: ["Shared 7-day sample plan."],
        createdAt: Date.now() - 1000 * 60 * 60 * 60,
        updatedAt: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: 3,
        name: "Aarav",
        email: "aarav@student.edu",
        gender: "male",
        category: "Fitness",
        date: "2025-12-05",
        time: "11:00",
        message: "Starter strength plan, hostel-friendly.",
        status: "Completed",
        consultant: "Coach Zoya",
        meetLink: "https://meet.example/aarav",
        notes: ["Assigned bodyweight plan.", "Follow-up next week."],
        createdAt: Date.now() - 1000 * 60 * 60 * 100,
        updatedAt: Date.now() - 1000 * 60 * 60 * 10,
      },
      {
        id: 4,
        name: "Ishita",
        email: "ishita@student.edu",
        gender: "female",
        category: "Wellness",
        date: "2025-12-07",
        time: "09:00",
        message: "Sleep schedule issues; need routine.",
        status: "Pending",
        consultant: "",
        meetLink: "",
        notes: [],
        createdAt: Date.now() - 1000 * 60 * 60 * 20,
        updatedAt: Date.now() - 1000 * 60 * 60 * 3,
      },
    ];
    localStorage.setItem("consultations", JSON.stringify(seed));
    setConsultations(seed);
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("consultations", JSON.stringify(consultations));
  }, [consultations]);

  // Filters
  const filtered = useMemo(() => {
    const f = consultations.filter((c) => {
      const q =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase());

      const catOK = category === "All" || c.category === category;
      const statOK = status === "All" || c.status === status;

      const dateOK =
        (!from || new Date(c.date) >= new Date(from)) &&
        (!to || new Date(c.date) <= new Date(to));

      return q && catOK && statOK && dateOK;
    });

    // sort upcoming first (date asc), then status priority
    const priority = { Pending: 1, Confirmed: 2, Completed: 3, Cancelled: 4 };
    return f.sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || "00:00"}`);
      const db = new Date(`${b.date}T${b.time || "00:00"}`);
      if (da.getTime() === db.getTime()) {
        return (priority[a.status] || 5) - (priority[b.status] || 5);
      }
      return da - db;
    });
  }, [consultations, search, category, status, from, to]);

  // KPIs
  const kpi = useMemo(() => {
    const total = filtered.length;
    const pending = filtered.filter((c) => c.status === "Pending").length;
    const confirmed = filtered.filter((c) => c.status === "Confirmed").length;
    const completed = filtered.filter((c) => c.status === "Completed").length;

    const byCategory = ["Mental Health", "Fitness", "Nutrition", "Wellness"].map((cat) => ({
      name: cat,
      value: filtered.filter((c) => c.category === cat).length,
    }));

    // trend by date
    const map = new Map();
    filtered.forEach((c) => {
      map.set(c.date, (map.get(c.date) || 0) + 1);
    });
    const trend = Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // SLA: sessions within next 48 hours
    const now = Date.now();
    const soon = filtered.filter((c) => {
      const t = new Date(`${c.date}T${c.time || "00:00"}`).getTime();
      return t - now <= 1000 * 60 * 60 * 48 && t - now >= 0 && c.status !== "Completed";
    }).length;

    return { total, pending, confirmed, completed, byCategory, trend, soon };
  }, [filtered]);

  // helpers
  const save = (updated) => setConsultations(updated);

  const updateField = (id, field, value) => {
    const updated = consultations.map((c) =>
      c.id === id ? { ...c, [field]: value, updatedAt: Date.now() } : c
    );
    save(updated);
  };

  const addNote = () => {
    if (!noteModal.text.trim()) return;
    const updated = consultations.map((c, i) =>
      i === noteModal.idx ? { ...c, notes: [...c.notes, noteModal.text] } : c
    );
    save(updated);
    setNoteModal({ open: false, idx: null, text: "" });
  };

  // Conflict detection: same consultant, overlapping date/time
  const hasConflict = (id, consultant, date, time) => {
    if (!consultant || !date || !time) return false;
    return consultations.some(
      (c) =>
        c.id !== id &&
        c.consultant === consultant &&
        c.date === date &&
        c.time === time &&
        c.status !== "Cancelled"
    );
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "id",
      "name",
      "email",
      "gender",
      "category",
      "date",
      "time",
      "status",
      "consultant",
      "meetLink",
      "notesCount",
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.email,
      c.gender,
      c.category,
      c.date,
      c.time || "",
      c.status,
      c.consultant || "",
      c.meetLink || "",
      c.notes.length,
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consultations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // UI
  return (
    <div className="container py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="d-flex flex-wrap justify-content-between align-items-end mb-4"
      >
        <div>
          <h3 className="fw-bold text-primary mb-1">Admin • Consultations</h3>
          <div className="text-muted small">
            Manage bookings, assign consultants, track outcomes & export reports.
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={exportCSV}>
            <Download size={16} className="me-1" /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="row g-3 mb-4 text-center">
        <KPI icon={<CalendarDays size={24} />} color="bg-primary text-white" label="Total" value={kpi.total} />
        <KPI icon={<Clock size={24} />} color="bg-warning text-dark" label="Pending" value={kpi.pending} />
        <KPI icon={<ShieldCheck size={24} />} color="bg-info text-dark" label="Confirmed" value={kpi.confirmed} />
        <KPI icon={<CheckCircle2 size={24} />} color="bg-success text-white" label="Completed" value={kpi.completed} />
        <KPI icon={<AlertTriangle size={24} />} color="bg-dark text-white" label="Due ≤ 48h" value={kpi.soon} />
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Search size={16} />
              </span>
              <input
                className="form-control"
                placeholder="Name, email or message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <label className="form-label small">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All</option>
              <option>Mental Health</option>
              <option>Fitness</option>
              <option>Nutrition</option>
              <option>Wellness</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small">From</label>
            <input type="date" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label small">To</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Filter size={16} />
              </span>
              <input type="date" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <h6 className="fw-bold text-dark mb-2">Category Mix</h6>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={kpi.byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                  {kpi.byCategory.map((d, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[d.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <h6 className="fw-bold text-dark mb-2">Daily Bookings</h6>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={kpi.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <h6 className="fw-bold text-dark mb-3">All Consultations</h6>
          {filtered.length === 0 ? (
            <div className="alert alert-light text-center">No matching consultations.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="bg-light">
                  <tr className="text-muted small">
                    <th>#</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Consultant</th>
                    <th>Meeting</th>
                    <th>Notes</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const conflict = hasConflict(c.id, c.consultant, c.date, c.time);
                    return (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 18 }}>
                              {c.gender === "female" ? "👩‍🎓" : c.gender === "male" ? "👨‍🎓" : "🧑‍🎓"}
                            </span>
                            <div>
                              <div className="fw-semibold">{c.name}</div>
                              <div className="small text-muted">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: CATEGORY_COLORS[c.category],
                              color: "#fff",
                            }}
                          >
                            {c.category}
                          </span>
                        </td>
                        <td>
                          <div className="small fw-semibold">{c.date}</div>
                          <div className="small text-muted">{c.time || "—"}</div>
                        </td>
                        <td>
                          <select
                            className={`form-select form-select-sm ${STATUS_BADGE[c.status] || ""}`}
                            value={c.status}
                            onChange={(e) => updateField(c.id, "status", e.target.value)}
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className={`form-control form-control-sm ${conflict ? "is-invalid" : ""}`}
                            placeholder="Assign consultant"
                            value={c.consultant || ""}
                            onChange={(e) => updateField(c.id, "consultant", e.target.value)}
                          />
                          {conflict && (
                            <div className="invalid-feedback">
                              Conflict: {c.consultant} already booked for {c.date} @ {c.time}
                            </div>
                          )}
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white">
                              <LinkIcon size={14} />
                            </span>
                            <input
                              className="form-control"
                              placeholder="https://meet…"
                              value={c.meetLink || ""}
                              onChange={(e) => updateField(c.id, "meetLink", e.target.value)}
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setNoteModal({ open: true, idx: consultations.findIndex((x) => x.id === c.id), text: "" })
                            }
                            title="Add note"
                          >
                            <NotebookPen size={14} className="me-1" />
                            {c.notes?.length || 0}
                          </button>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => updateField(c.id, "status", "Confirmed")}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => updateField(c.id, "status", "Completed")}
                          >
                            Complete
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateField(c.id, "status", "Cancelled")}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Notes Drawer (simple modal) */}
      {noteModal.open && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
          tabIndex="-1"
          onClick={() => setNoteModal({ open: false, idx: null, text: "" })}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Add Note</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setNoteModal({ open: false, idx: null, text: "" })}
                />
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Type note…"
                  value={noteModal.text}
                  onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
                />
                {Number.isInteger(noteModal.idx) && consultations[noteModal.idx]?.notes?.length > 0 && (
                  <div className="mt-3">
                    <div className="small text-muted mb-1">Existing notes:</div>
                    <ul className="small text-muted mb-0">
                      {consultations[noteModal.idx].notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setNoteModal({ open: false, idx: null, text: "" })}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={addNote}>
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Small components ---- */

function KPI({ icon, color, label, value }) {
  return (
    <div className="col-sm-6 col-md-4 col-lg-2">
      <div className={`card border-0 shadow-sm rounded-4 text-center ${color}`}>
        <div className="card-body d-flex flex-column align-items-center">
          {icon}
          <div className="fw-bold fs-5 mt-1">{value}</div>
          <div className="small">{label}</div>
        </div>
      </div>
    </div>
  );
}
