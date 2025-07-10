import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper, Fab, Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Typography, Chip } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from "react-router-dom";

const allowedTypes = [
  "application/pdf", "image/jpeg", "image/png", "image/jpg", "video/mp4",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const maxSize = 20 * 1024 * 1024; // 20MB

export default function BottomNavBar() {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'notes',
    tags: '',
    file: null
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNav = (idx) => {
    setValue(idx);
    if (idx === 0) navigate('/');
    if (idx === 1) navigate('/network');
    if (idx === 3) navigate('/notifications');
    if (idx === 4) navigate('/jobs');
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type.');
      return;
    }
    if (file.size > maxSize) {
      setError('File too large (max 20MB).');
      return;
    }
    setForm(f => ({ ...f, file }));
    setError('');
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else if (file.type === 'application/pdf') {
      setPreview('pdf');
    } else if (file.type.startsWith('video/')) {
      setPreview('video');
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.category) {
      setError('Title and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('tags', form.tags);
      if (form.file) data.append('file', form.file);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }
      setOpen(false);
      setForm({ title: '', description: '', category: 'notes', tags: '', file: null });
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }} elevation={6}>
        <BottomNavigation
          showlabel={false}
          value={value}
          onChange={(_, newValue) => handleNav(newValue)}
          sx={{ height: 64, bgcolor: '#fff', borderTop: '1px solid #eee' }}
        >
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', top: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: '#1976d2', marginBottom: 4 }}>create</span>
            <Box
              onClick={() => setOpen(true)}
              sx={{ width: 56, height: 56, backgroundColor: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, boxShadow: 3, cursor: 'pointer', marginBottom: 4 }}
              aria-label="post"
            >
              <AddCircleIcon sx={{ fontSize: 36 }} />
            </Box>
            <span style={{ fontWeight: 600, fontSize: 16, color: '#1976d2', marginBottom: 4 }}>post</span>
          </Box>
        </BottomNavigation>
      </Paper>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#fff', p: 4, borderRadius: 3, minWidth: 340, maxWidth: 400 }}>
          <Typography variant="h6" mb={2}>Create a Post</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select value={form.category} label="Category" onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
              <MenuItem value="notes">Notes</MenuItem>
              <MenuItem value="threads">Threads</MenuItem>
              <MenuItem value="jobs">Jobs</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Title" fullWidth sx={{ mb: 2 }} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <TextField label="Description" fullWidth multiline rows={2} sx={{ mb: 2 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <TextField label="Tags (comma separated)" fullWidth sx={{ mb: 2 }} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            {form.file ? form.file.name : 'Upload File (pdf, jpg, png, mp4, doc)'}
            <input type="file" hidden onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.mp4,.doc,.docx" />
          </Button>
          {preview && form.file && (
            <Box sx={{ mb: 2 }}>
              {form.file.type.startsWith('image/') && <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 120 }} />}
              {form.file.type === 'application/pdf' && <Typography variant="body2">PDF file selected</Typography>}
              {form.file.type.startsWith('video/') && <Typography variant="body2">Video file selected</Typography>}
            </Box>
          )}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading || !form.title || !form.category}>{loading ? <CircularProgress size={24} /> : 'Post'}</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
} 