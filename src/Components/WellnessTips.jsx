import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WellnessTips.css"; // optional for styling

export default function WellnessTips() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    axios.get("https://type.fit/api/quotes")
      .then((res) => {
        const random = res.data[Math.floor(Math.random() * res.data.length)];
        setQuote(random.text);
      })
      .catch((err) => console.error("Error fetching quote:", err));
  }, []);

  return (
    <div className="wellness-box p-4 mt-5 mb-5 mx-auto shadow-sm rounded">
      <h5 className="text-success fw-bold mb-3">💡 Daily Wellness Tip</h5>
      <p className="fst-italic text-muted">{quote || "Loading inspiration..."}</p>
    </div>
  );
}
