import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import "./Sidebar.css"; // You can reuse Sidebar.css styling

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { name: "Programs", icon: <BookOpen size={18} />, path: "/admin/programs" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
    {
      name: "Consultations",
      icon: <CalendarDays size={18} />,
      path: "/admin/consultations",
    },
    { name: "Reports", icon: <BarChart2 size={18} />, path: "/admin/reports" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

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
        background: "linear-gradient(180deg, #004aad, #007bff)",
        color: "#fff",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-light">
        <h5 className="text-white fw-bold mb-0">
          {!collapsed && "🧭 Admin Panel"}
        </h5>
        <button
          className="toggle-btn btn btn-sm btn-light"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight color="#004aad" size={18} />
          ) : (
            <ChevronLeft color="#004aad" size={18} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="menu-list list-unstyled mt-3 flex-grow-1">
        {menuItems.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
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
          </motion.li>
        ))}
      </ul>

      {/* Logout Button */}
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
