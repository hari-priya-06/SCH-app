import React, { useState, useRef, useContext, useEffect } from "react";
import { Box, Card, Typography, Avatar, Button, IconButton, Menu, MenuItem, Switch, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, CardContent } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../theme";

const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "IT"];

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const { theme, darkMode, setDarkMode } = useContext(DarkModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(user?.profile_picture || "");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || "", email: user?.email || "", department: user?.department || "" });
  const fileInputRef = useRef();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      fetch(`http://localhost:8000/api/posts/user/${user._id}`)
        .then(res => res.json())
        .then(data => setUserPosts(data))
        .catch(() => setUserPosts([]));
    }
  }, [user]);

  if (!user) return <Typography>Loading...</Typography>;

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleDelete = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("profilePic");
    window.location.reload();
  };

  const handleDarkMode = (e) => {
    setDarkMode(e.target.checked);
    localStorage.setItem("darkMode", e.target.checked);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8000/api/auth/profile-picture', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (res.ok) {
          const updatedUser = await res.json();
          setProfilePic(updatedUser.profile_picture);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (setUser) setUser(updatedUser);
        }
      } catch {}
    }
  };

  const handleEditProfile = () => {
    setEditForm({ name: user.name || "", email: user.email || "", department: user.department || "" });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    const updatedUser = { ...user, ...editForm };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditOpen(false);
    window.location.reload();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh", bgcolor: theme.background, color: theme.text, pt: 4 }}>
      <Card sx={{ minWidth: 350, background: theme.cardBackground, color: theme.text, display: "flex", flexDirection: "column", alignItems: "center", p: 3, position: "relative" }}>
        {/* 3-dots menu on right */}
        <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", top: 8, right: 8, color: theme.primary }}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1 }} />Logout</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "red" }}><DeleteIcon sx={{ mr: 1, color: "red" }} />Delete Account</MenuItem>
        </Menu>
        <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleProfilePicChange} />
        <IconButton onClick={() => fileInputRef.current.click()} sx={{ mb: 2, mt: 4 }}>
          <Avatar src={profilePic || user?.profile_picture} sx={{ width: 100, height: 100, bgcolor: "#90caf9" }} />
        </IconButton>
        {profilePic && (
          <Button variant="outlined" color="error" sx={{ mb: 2 }} onClick={() => setProfilePic("")}>Remove Profile Picture</Button>
        )}
        <Typography variant="h6" sx={{ mt: 1 }}>{user.name || user.email.split("@")[0]}</Typography>
        <Typography variant="body2" color={theme.secondaryText}>
          {user.email}
        </Typography>
        <Typography variant="body2" color={theme.secondaryText}>
          {user.department || "-"}
        </Typography>
        <Button variant="contained" startIcon={<EditIcon />} sx={{ mt: 2, background: theme.primary }} onClick={handleEditProfile}>
          Edit Profile
        </Button>
        <Divider sx={{ my: 3, width: "100%" }} />
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>My Posts</Typography>
          {userPosts.length === 0 ? (
            <Typography color={theme.secondaryText}>No posts yet.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {userPosts.map(post => (
                <Card key={post._id} sx={{ background: theme.cardBackground, color: theme.text, borderRadius: 3, boxShadow: '0 4px 16px #0001', border: `1px solid ${theme.border}` }}>
                  <CardContent>
                    <Typography fontWeight={700} fontSize={17}>{post.title}</Typography>
                    <Typography fontSize={14} color={theme.secondaryText}>{post.category} • {new Date(post.created_at).toLocaleDateString()}</Typography>
                    <Typography variant="body2" color={theme.secondaryText} sx={{ mb: 1 }}>{post.description}</Typography>
                    {post.tags && post.tags.length > 0 && (
                      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {post.tags.map((tag, idx) => <Chip key={post._id + '-' + tag + '-' + idx} label={tag} size="small" />)}
                      </Box>
                    )}
                    {post.file_url && (
                      <Box sx={{ mb: 2 }}>
                        {post.file_type && post.file_type.startsWith('image') && (
                          <img src={post.file_url} alt="preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
                        )}
                        {post.file_type && post.file_type === 'pdf' && (
                          <a href={post.file_url} target="_blank" rel="noopener noreferrer">View PDF</a>
                        )}
                        {post.file_type && post.file_type.startsWith('video') && (
                          <video src={post.file_url} controls style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 3, width: "100%" }} />
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
          <Typography>Dark Mode</Typography>
          <Switch checked={darkMode} onChange={handleDarkMode} color="primary" />
        </Box>
      </Card>
      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300 }}>
          <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} />
          <TextField label="Email" name="email" value={editForm.email} onChange={handleEditChange} />
          <TextField select label="Department" name="department" value={editForm.department} onChange={handleEditChange}>
            {departments.map(dep => <MenuItem key={dep} value={dep}>{dep}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ background: theme.primary }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 