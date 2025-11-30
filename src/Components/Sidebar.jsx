import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Home,
  Activity,
  Apple,
  Brain,
  BookOpen,
  Stethoscope,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/user/dashboard" },
    { name: "Fitness", icon: <Activity size={18} />, path: "/user/fitness" },
    { name: "Nutrition", icon: <Apple size={18} />, path: "/user/nutrition" },
    { name: "Wellness", icon: <Brain size={18} />, path: "/user/wellness" },
    { name: "Programs", icon: <BookOpen size={18} />, path: "/user/programs" },
    { name: "Consultant", icon: <Stethoscope size={18} />, path: "/user/consultation" }, // 🩺 Replaced Reports
    { name: "Settings", icon: <Settings size={18} />, path: "/user/settings" },
  ];

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 70 : 230 }}
      transition={{ duration: 0.3 }}
      className="sidebar shadow-sm d-flex flex-column position-fixed top-0 start-0 vh-100"
      style={{
        background: "linear-gradient(180deg, #1976d2, #2196f3)",
        color: "#fff",
        zIndex: 1000,
      }}
    >
      {/* 🌿 Sidebar Header */}
      <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-light">
        <h5 className="text-white fw-bold mb-0">
          {!collapsed && "🌿 Wellness"}
        </h5>
        <button
          className="toggle-btn btn btn-sm btn-light"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight color="#1976d2" size={18} />
          ) : (
            <ChevronLeft color="#1976d2" size={18} />
          )}
        </button>
      </div>

      {/* 📋 Sidebar Menu */}
      <ul className="menu-list list-unstyled mt-3 flex-grow-1">
        {menuItems.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="position-relative"
          >
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `menu-item d-flex align-items-center px-3 py-2 text-white text-decoration-none ${
                  isActive ? "active" : ""
                }`
              }
              title={collapsed ? item.name : ""}
            >
              {item.icon}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="ms-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>

            {/* ✅ Active Glow Effect */}
            <AnimatePresence>
              <motion.div
                className="active-glow"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#fff",
                  opacity: 0.8,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>

      {/* 🚪 Logout Button */}
      <div className="logout-section mt-auto mb-3 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="btn btn-outline-light d-flex align-items-center justify-content-center mx-auto w-75"
          style={{
            borderRadius: "10px",
            fontSize: "0.9rem",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <LogOut size={16} className="me-2" />
          {!collapsed && "Logout"}
        </motion.button>
      </div>
    </motion.div>
  );
}
