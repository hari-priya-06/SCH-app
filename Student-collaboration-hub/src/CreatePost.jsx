import React, { useState } from "react";
import api from "./api";

const theme = {
  primary: "#E28413",
  background: "#FBF5F3"
};

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "", category: "Notes" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.title || !form.content || !form.category) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/posts/create", form);
      if (!res.ok) throw new Error("Failed to create post");
      setSuccess("Post created successfully!");
      setForm({ title: "", content: "", category: "Notes" });
    } catch (err) {
      setError("Failed to create post. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", background: "white", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ color: theme.primary }}>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }}>
          <option value="Notes">Notes</option>
          <option value="Jobs">Jobs</option>
          <option value="Threads">Threads</option>
        </select>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: theme.primary, marginBottom: 8 }}>{success}</div>}
        <button type="submit" style={{ background: theme.primary, color: "white", width: "100%", padding: 10, border: "none", borderRadius: 4 }} disabled={loading}>{loading ? "Posting..." : "Create Post"}</button>
      </form>
    </div>
  );
} 