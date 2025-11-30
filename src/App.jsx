import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 🌿 Shared Components
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Home from "./Components/Home.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import SupportForm from "./Components/SupportForm.jsx";

// 👩‍🎓 User Components
import UserDashboard from "./Components/UserDashboard.jsx";
import Fitness from "./Components/User/Fitness.jsx";
import Nutrition from "./Components/User/Nutrition.jsx";
import Wellness from "./Components/User/Wellness.jsx";
import Programs from "./Components/User/Programs.jsx";
import Consultation from "./Components/User/Consultation.jsx";

// 🧠 Admin Components
import AdminDashboard from "./Components/AdminDashboard.jsx";
import AdminPrograms from "./Components/Admin/AdminPrograms.jsx";
import AdminUsers from "./Components/Admin/AdminUsers.jsx";
import AdminConsultations from "./Components/Admin/AdminConsultations.jsx";
import AdminReports from "./Components/Admin/AdminReports.jsx"; // ✅ new Reports dashboard
import AddProgram from "./Components/AddProgram.jsx";
import EditProgram from "./Components/EditProgram.jsx";

// 🧭 Sidebars
import Sidebar from "./Components/Sidebar.jsx";
import AdminSidebar from "./Components/AdminSidebar.jsx";

import "./App.css";

// ✅ Layout Component (Dynamic Sidebar Handling)
function Layout({ children }) {
  const location = useLocation();

  const isUserRoute = location.pathname.startsWith("/user");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-layout d-flex">
      {/* 🧭 Sidebar (Admin/User Specific) */}
      {isAdminRoute ? (
        <AdminSidebar />
      ) : isUserRoute ? (
        <Sidebar />
      ) : null}

      {/* 🧩 Main Content Area */}
      <div
        className="content-area flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isUserRoute || isAdminRoute ? "230px" : "0",
          transition: "margin 0.3s ease",
          backgroundColor: "#f9fafc",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <main className="app-content flex-grow-1 p-3">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

// ✅ Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 🌿 PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/support" element={<SupportForm />} />

          {/* 👩‍🎓 USER ROUTES */}
          <Route path="/user" element={<Navigate to="/user/dashboard" />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/fitness" element={<Fitness />} />
          <Route path="/user/nutrition" element={<Nutrition />} />
          <Route path="/user/wellness" element={<Wellness />} />
          <Route path="/user/programs" element={<Programs />} />
          <Route path="/user/consultation" element={<Consultation />} />
          <Route
            path="/user/settings"
            element={
              <div className="p-4 text-center fw-semibold">
                ⚙️ User Settings Coming Soon
              </div>
            }
          />

          {/* 🧠 ADMIN ROUTES */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/add" element={<AddProgram />} />
          <Route path="/admin/edit/:id" element={<EditProgram />} />
          <Route path="/admin/consultations" element={<AdminConsultations />} />
          <Route path="/admin/reports" element={<AdminReports />} /> {/* ✅ Replaced placeholder */}
          <Route
            path="/admin/settings"
            element={
              <div className="p-4 text-center fw-semibold">
                ⚙️ Admin Settings Coming Soon
              </div>
            }
          />

          {/* 🚫 404 FALLBACK */}
          <Route
            path="*"
            element={
              <div
                className="d-flex flex-column justify-content-center align-items-center text-center"
                style={{ height: "80vh" }}
              >
                <h2 className="fw-bold text-danger">404 - Page Not Found</h2>
                <p className="text-muted">
                  The page you’re looking for doesn’t exist or has been moved.
                </p>
                <a href="/" className="btn btn-primary mt-3">
                  Go Back Home
                </a>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
