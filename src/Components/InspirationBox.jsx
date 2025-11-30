import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // ✅ direct axios call (to avoid dummyjson baseURL)
import "./InspirationBox.css";

export default function InspirationBox() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://type.fit/api/quotes");
      const randomIndex = Math.floor(Math.random() * res.data.length);
      setQuote(res.data[randomIndex]);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <motion.div
      className="inspiration-box text-center mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h5 className="fw-bold text-success mb-3">💡 Daily Wellness Tip</h5>

      {loading ? (
        <p className="text-muted">Loading inspiration...</p>
      ) : quote ? (
        <>
          <p className="fst-italic text-dark">“{quote.text}”</p>
          <p className="text-muted small">— {quote.author || "Anonymous"}</p>
        </>
      ) : (
        <p className="text-danger">Could not load a tip 😔</p>
      )}

      <button
        className="btn btn-outline-success btn-sm mt-3"
        onClick={fetchQuote}
      >
        🔄 New Tip
      </button>
    </motion.div>
  );
}
