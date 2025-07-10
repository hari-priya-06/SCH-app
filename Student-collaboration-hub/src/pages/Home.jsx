import React, { useContext, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Modal, TextField, Avatar, Grid, Chip } from "@mui/material";
import { DarkModeContext } from "../theme";
import { useAuth } from "../context/AuthContext";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

export default function Home() {
  const { theme } = useContext(DarkModeContext);
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likeState, setLikeState] = useState({});
  const [showComment, setShowComment] = useState({});
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', tags: '' });

  useEffect(() => {
    fetch('https://sch-backend-zmdn.onrender.com/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  const allPosts = posts;

  const filteredPosts = allPosts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(search.toLowerCase());
    const tagsMatch = (post.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return titleMatch || tagsMatch;
  });

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://sch-backend-zmdn.onrender.com/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLikeState(prev => ({
          ...prev,
          [postId]: {
            liked: data.liked,
            count: data.likes.length
          }
        }));
      }
    } catch (e) {
      // Optionally handle error
    }
  };
  const handleComment = (postId) => {
    setShowComment(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleExpand = (postId) => {
    setExpanded(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://sch-backend-zmdn.onrender.com/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts => posts.filter(p => p._id !== postId));
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to delete post');
      }
    } catch (e) {
      alert('Failed to delete post');
    }
  };

  const handleEditOpen = (post) => {
    setEditForm({
      title: post.title,
      description: post.description,
      category: post.category,
      tags: (post.tags || []).join(', ')
    });
    setEditModal({ open: true, post });
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !editModal.post) return;
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('description', editForm.description);
    formData.append('category', editForm.category);
    formData.append('tags', editForm.tags);
    // File editing not supported in this modal for now
    try {
      const res = await fetch(`https://sch-backend-zmdn.onrender.com/api/posts/${editModal.post._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(posts => posts.map(p => p._id === updated._id ? updated : p));
        setEditModal({ open: false, post: null });
      } else {
        alert('Failed to update post');
      }
    } catch {
      alert('Failed to update post');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, bgcolor: theme.background, color: theme.text, minHeight: "80vh", p: { xs: 1, sm: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 3 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1, bgcolor: theme.cardBackground, borderRadius: 2, px: 2, py: 1, boxShadow: 1 }}>
        <SearchIcon sx={{ color: theme.secondaryText, mr: 1 }} />
        <input
          type="text"
          placeholder="Search posts by title or hashtag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: theme.text, fontSize: 18 }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredPosts.length === 0 ? (
          <Grid item xs={12}><Typography>No posts found.</Typography></Grid>
        ) : (
          filteredPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post._id || post.id}>
              <Card sx={{ background: theme.cardBackground, color: theme.text, borderRadius: 3, boxShadow: '0 4px 16px #0001', border: `1px solid ${theme.border}`, p: 0 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.primary, mr: 2, width: 48, height: 48, fontWeight: 700, fontSize: 22 }}>{post.title[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize={17}>{post.title}</Typography>
                      {post.user_name && post.user_email && (
                        <Typography fontSize={14} color={theme.secondaryText} sx={{ fontStyle: 'italic' }}>By {post.user_name} ({post.user_email})</Typography>
                      )}
                      <Typography fontSize={14} color={theme.secondaryText}>{post.category} • {new Date(post.created_at).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
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
                      {/* Add more file type previews as needed */}
                    </Box>
                  )}
                  {/* Actions row (like, comment, expand) - UI only */}
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 2 }}>
                    <Button
                      size="small"
                      sx={{
                        minWidth: 0,
                        p: 1,
                        color: likeState[post._id]?.liked ? '#0A66C2' : theme.primary,
                        background: theme.highlight,
                        borderRadius: 8,
                        boxShadow: 'none',
                        transition: 'background 0.2s, transform 0.15s',
                        transform: likeState[post._id]?.liked ? 'scale(1.15)' : 'scale(1)',
                        '&:hover': {
                          background: theme.primary,
                          color: '#fff',
                          transform: 'scale(1.15)'
                        }
                      }}
                      onClick={() => handleLike(post._id)}
                    >
                      {likeState[post._id]?.liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      <span style={{ marginLeft: 6, fontWeight: 600, fontSize: 15 }}>{likeState[post._id]?.count || 0}</span>
                    </Button>
                    <Button
                      size="small"
                      sx={{
                        minWidth: 0,
                        p: 1,
                        color: showComment[post.id] ? '#0A66C2' : theme.primary,
                        background: theme.highlight,
                        borderRadius: 8,
                        boxShadow: 'none',
                        transition: 'background 0.2s, transform 0.15s',
                        transform: showComment[post.id] ? 'scale(1.15)' : 'scale(1)',
                        '&:hover': {
                          background: theme.primary,
                          color: '#fff',
                          transform: 'scale(1.15)'
                        }
                      }}
                      onClick={() => handleComment(post.id)}
                    >
                      <ChatBubbleOutlineIcon />
                    </Button>
                    <Button size="small" sx={{ color: theme.primary, textTransform: "none", borderRadius: 8, fontWeight: 600, px: 2, background: theme.highlight, boxShadow: 'none', transition: 'background 0.2s', '&:hover': { background: theme.primary, color: '#fff' } }} onClick={() => handleExpand(post._id)}>{expanded[post._id] ? 'Collapse' : 'Expand'}</Button>
                    {isAuthenticated && user && (user._id === post.user_id || user.id === post.user_id) && (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 8, minWidth: 0, ml: 'auto' }}
                          onClick={() => handleEditOpen(post)}
                          aria-label="Edit post"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          sx={{ borderRadius: 8, minWidth: 0, ml: 1 }}
                          onClick={() => handleDelete(post._id)}
                          aria-label="Delete post"
                        >
                          <DeleteIcon />
                        </Button>
                      </>
                    )}
                  </Box>
                  {showComment[post.id] && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <input type="text" placeholder="Write a comment..." style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${theme.border}` }} />
                      <Button variant="contained" sx={{ background: theme.primary, color: '#fff', borderRadius: 6 }}>Post</Button>
                    </Box>
                  )}
                  {expanded[post._id] && post.file_url && (
                    <Box sx={{ mt: 2 }}>
                      {post.file_type && post.file_type.startsWith('image') && (
                        <img src={post.file_url} alt="preview" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />
                      )}
                      {post.file_type && post.file_type === 'pdf' && (
                        <iframe src={post.file_url} title="PDF Preview" style={{ width: '100%', height: 400, border: 'none', borderRadius: 8 }} />
                      )}
                      {post.file_type && post.file_type.startsWith('video') && (
                        <video src={post.file_url} controls style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {/* Edit Post Modal */}
      <Modal open={editModal.open} onClose={() => setEditModal({ open: false, post: null })}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: theme.cardBackground, color: theme.text, p: 4, borderRadius: 3, minWidth: 340, maxWidth: 400 }}>
          <Typography variant="h6" mb={2}>Edit Post</Typography>
          <TextField label="Title" name="title" fullWidth sx={{ mb: 2 }} value={editForm.title} onChange={handleEditChange} required />
          <TextField label="Description" name="description" fullWidth multiline rows={2} sx={{ mb: 2 }} value={editForm.description} onChange={handleEditChange} />
          <TextField label="Category" name="category" fullWidth sx={{ mb: 2 }} value={editForm.category} onChange={handleEditChange} required />
          <TextField label="Tags (comma separated)" name="tags" fullWidth sx={{ mb: 2 }} value={editForm.tags} onChange={handleEditChange} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setEditModal({ open: false, post: null })}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
} 