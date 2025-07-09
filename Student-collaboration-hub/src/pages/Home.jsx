import React, { useContext, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Modal, TextField, Avatar, Grid, Chip } from "@mui/material";
import { DarkModeContext } from "../theme";
import { useAuth } from "../context/AuthContext";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function Home() {
  const { theme } = useContext(DarkModeContext);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likeState, setLikeState] = useState({});
  const [showComment, setShowComment] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  const allPosts = posts;

  const handleLike = (postId) => {
    setLikeState(prev => {
      const prevLiked = prev[postId]?.liked || false;
      const prevCount = prev[postId]?.count || 0;
      return {
        ...prev,
        [postId]: {
          liked: !prevLiked,
          count: prevLiked ? prevCount - 1 : prevCount + 1
        }
      };
    });
  };
  const handleComment = (postId) => {
    setShowComment(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, bgcolor: theme.background, color: theme.text, minHeight: "80vh", p: { xs: 1, sm: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 3 }} />
      <Grid container spacing={3}>
        {allPosts.length === 0 ? (
          <Grid item xs={12}><Typography>No posts yet.</Typography></Grid>
        ) : (
          allPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ background: theme.cardBackground, color: theme.text, borderRadius: 3, boxShadow: '0 4px 16px #0001', border: `1px solid ${theme.border}`, p: 0 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.primary, mr: 2, width: 48, height: 48, fontWeight: 700, fontSize: 22 }}>{post.title[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize={17}>{post.title}</Typography>
                      <Typography fontSize={14} color={theme.secondaryText}>{post.category} • {new Date(post.created_at).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color={theme.secondaryText} sx={{ mb: 1 }}>{post.description}</Typography>
                  {post.tags && post.tags.length > 0 && (
                    <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {post.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
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
                        color: likeState[post.id]?.liked ? '#0A66C2' : theme.primary,
                        background: theme.highlight,
                        borderRadius: 8,
                        boxShadow: 'none',
                        transition: 'background 0.2s, transform 0.15s',
                        transform: likeState[post.id]?.liked ? 'scale(1.15)' : 'scale(1)',
                        '&:hover': {
                          background: theme.primary,
                          color: '#fff',
                          transform: 'scale(1.15)'
                        }
                      }}
                      onClick={() => handleLike(post.id)}
                    >
                      {likeState[post.id]?.liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      <span style={{ marginLeft: 6, fontWeight: 600, fontSize: 15 }}>{likeState[post.id]?.count || 0}</span>
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
                    <Button size="small" sx={{ color: theme.primary, textTransform: "none", borderRadius: 8, fontWeight: 600, px: 2, background: theme.highlight, boxShadow: 'none', transition: 'background 0.2s', '&:hover': { background: theme.primary, color: '#fff' } }}>Expand</Button>
                  </Box>
                  {showComment[post.id] && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <input type="text" placeholder="Write a comment..." style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${theme.border}` }} />
                      <Button variant="contained" sx={{ background: theme.primary, color: '#fff', borderRadius: 6 }}>Post</Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 