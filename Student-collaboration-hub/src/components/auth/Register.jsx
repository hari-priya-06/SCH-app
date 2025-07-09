import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import theme from "../../theme";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    department: "",
    year: "",
    bio: "",
    skills: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ ...form, skills: form.skills.split(",").map(s => s.trim()) });
      navigate("/posts");
    } catch (err) {
      setError("Registration failed. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "white", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ color: theme.primary }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="college" placeholder="College" value={form.college} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ background: theme.primary, color: "white", width: "100%", padding: 10, border: "none", borderRadius: 4 }} disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
} 