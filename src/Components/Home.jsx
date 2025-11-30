import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

// ✅ Import the image correctly
import wellnessBanner from "../assets/wellness-banner.png";

export default function Home() {
  return (
    <div className="home-container">
      {/* 🌿 Hero Section */}
      <div className="hero-section container d-flex flex-column flex-md-row align-items-center justify-content-between">

        {/* 🟩 Left Text */}
        <motion.div
          className="hero-text text-center text-md-start"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="fw-bold text-primary mb-3">
            🌿 Welcome to <span className="text-success">Student Wellness App</span>
          </h1>
          <p className="text-muted mb-4">
            Empowering students to live healthier and happier lives.  
            Access wellness programs, track fitness goals, and receive  
            personalized guidance for mental and physical well-being.
          </p>

          <div className="mt-3">
            <Link to="/programs" className="btn btn-success me-3 shadow-sm px-4 py-2">
              Explore Programs
            </Link>
            <Link to="/user" className="btn btn-outline-primary shadow-sm px-4 py-2">
              Track My Wellness
            </Link>
          </div>
        </motion.div>

        {/* 🖼️ Right Image Section */}
        <motion.div
          className="hero-image-container mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.img
            src={wellnessBanner}
            alt="Wellness Banner"
            className="hero-image img-fluid rounded-4 shadow-lg"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* 💫 Why Choose Wellness */}
      <motion.div
        className="info-section container text-center mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <h4 className="fw-bold text-dark mb-3">Why Choose Wellness?</h4>
        <p className="text-secondary w-75 mx-auto mb-5">
          The Student Wellness Platform integrates physical fitness, mental health,
          and nutrition guidance into one space. Whether you’re tracking steps,
          joining support groups, or improving your diet — we’ve got you covered.
        </p>

        {/* 🌟 Feature Cards */}
        <div className="row justify-content-center">
          {[
            {
              icon: "/fitness.svg",
              title: "Fitness Tracking",
              color: "text-primary",
              text: "Monitor your daily activity and reach your fitness goals faster with real-time progress charts.",
            },
            {
              icon: "/nutrition.svg",
              title: "Nutrition Advice",
              color: "text-success",
              text: "Get expert guidance on maintaining a balanced diet for better energy, focus, and overall health.",
            },
            {
              icon: "/mental-health.svg",
              title: "Mental Health Support",
              color: "text-info",
              text: "Access mindfulness sessions and stress relief techniques to maintain emotional balance.",
            },
          ].map((feature, i) => (
            <motion.div key={i} className="col-md-3 col-sm-6 mb-4" whileHover={{ scale: 1.05 }}>
              <div className="feature-card shadow-sm p-4 rounded-4 bg-white">
                <img src={feature.icon} alt={feature.title} className="feature-icon mb-3" />
                <h6 className={`fw-bold ${feature.color}`}>{feature.title}</h6>
                <p className="text-muted small">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 💬 Testimonials */}
      <motion.div
        className="testimonials-section container text-center mt-5 py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <h4 className="fw-bold text-dark mb-4">💬 What Students Say</h4>
        <div className="row justify-content-center">
          {[
            {
              quote: "“This app helped me balance my studies and mental health perfectly!”",
              name: "Ananya Singh",
              course: "B.Tech CSE, 3rd Year",
              color: "text-primary",
            },
            {
              quote: "“The nutrition section gave me great food tips for hostel life.”",
              name: "Rahul Mehta",
              course: "ECE, 2nd Year",
              color: "text-success",
            },
            {
              quote: "“Tracking my wellness journey motivates me every day. Loved the design!”",
              name: "Priya Sharma",
              course: "MBA, 1st Year",
              color: "text-info",
            },
          ].map((t, i) => (
            <div key={i} className="col-md-4 mb-4">
              <div className="testimonial-card shadow-sm p-4 bg-white rounded-4">
                <p className="text-secondary fst-italic">{t.quote}</p>
                <h6 className={`fw-bold mt-3 ${t.color}`}>- {t.name}</h6>
                <small className="text-muted">{t.course}</small>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🚀 Final CTA */}
      <motion.div
        className="cta-section text-center py-5 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <h3 className="fw-bold text-white mb-3">Ready to Start Your Wellness Journey?</h3>
        <Link to="/register" className="btn btn-light fw-bold shadow-sm px-4 py-2">
          Join Now
        </Link>
      </motion.div>
    </div>
  );
}
