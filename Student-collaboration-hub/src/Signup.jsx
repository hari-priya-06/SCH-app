import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const theme = {
  primary: "#E28413",
  background: "#FBF5F3"
};

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.bio) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/posts");
    } catch (err) {
      setError("Signup failed. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "white", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ color: theme.primary }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ background: theme.primary, color: "white", width: "100%", padding: 10, border: "none", borderRadius: 4 }} disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
      </form>
    </div>
  );
} 