import React, { useEffect, useState } from "react";

const theme = {
  primary: "#E28413",
  background: "#FBF5F3"
};

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", bio: "" });
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://sch-backend-zmdn.onrender.com/api/v1/users/me", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!profile.name || !profile.bio) {
      setError("Name and bio are required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch("https://sch-backend-zmdn.onrender.com/api/v1/users/update", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profile.name, bio: profile.bio })
      });
      setSuccess("Profile updated!");
      setEdit(false);
    } catch (err) {
      setError("Update failed. " + (err.message || ""));
    }
  };

  if (loading) return <div style={{ margin: 32 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "white", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ color: theme.primary }}>Profile</h2>
      <div><b>Email:</b> {profile.email}</div>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input name="name" value={profile.name} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
          <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: theme.primary, marginBottom: 8 }}>{success}</div>}
          <button type="submit" style={{ background: theme.primary, color: "white", width: "100%", padding: 10, border: "none", borderRadius: 4 }}>Update</button>
        </form>
      ) : (
        <>
          <div><b>Name:</b> {profile.name}</div>
          <div><b>Bio:</b> {profile.bio}</div>
          <button onClick={() => setEdit(true)} style={{ background: theme.primary, color: "white", width: "100%", padding: 10, border: "none", borderRadius: 4, marginTop: 12 }}>Edit</button>
        </>
      )}
    </div>
  );
} 