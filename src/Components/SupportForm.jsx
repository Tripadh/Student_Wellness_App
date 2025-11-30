import React, { useState } from "react";

export default function SupportForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("All fields are required!");
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="col-md-6 mx-auto">
      <h3 className="text-center mb-3">Support & Counseling</h3>
      {submitted && <div className="alert alert-success">Your request has been submitted!</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Message</label>
          <textarea className="form-control" name="message" rows="3" value={form.message} onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
}
