import React, { useState, useRef, useContext } from "react";
import { Box, Card, Typography, Avatar, Button, IconButton, Menu, MenuItem, Switch, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../theme";

const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "IT"];

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, darkMode, setDarkMode } = useContext(DarkModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("profilePic") || "");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || "", email: user?.email || "", department: user?.department || "" });
  const fileInputRef = useRef();

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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePic(ev.target.result);
        localStorage.setItem("profilePic", ev.target.result);
      };
      reader.readAsDataURL(file);
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
          <Avatar src={profilePic} sx={{ width: 100, height: 100, bgcolor: "#90caf9" }} />
        </IconButton>
        {profilePic && (
          <Button variant="outlined" color="error" sx={{ mb: 2 }} onClick={() => { setProfilePic(""); localStorage.removeItem("profilePic"); }}>
            Remove Profile Picture
          </Button>
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