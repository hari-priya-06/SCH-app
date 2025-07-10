import React from "react";
import { Box, Typography, Card, CardContent, Grid, Fade } from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const features = [
  {
    icon: <PostAddIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    emoji: '📝',
    title: 'Create & Share Posts',
    desc: 'Easily create posts with files, images, and tags. Share your knowledge and resources with your peers.'
  },
  {
    icon: <SearchIcon sx={{ fontSize: 48, color: '#43a047' }} />,
    emoji: '🔍',
    title: 'Search Instantly',
    desc: 'Find posts by title or hashtag in real time with our powerful search bar.'
  },
  {
    icon: <EditIcon sx={{ fontSize: 48, color: '#fbc02d' }} />,
    emoji: '✏️',
    title: 'Edit Your Posts',
    desc: 'Update your posts anytime. Keep your content fresh and relevant.'
  },
  {
    icon: <DeleteIcon sx={{ fontSize: 48, color: '#e53935' }} />,
    emoji: '🗑️',
    title: 'Delete with Ease',
    desc: 'Remove your posts instantly if you no longer want them visible.'
  },
  {
    icon: <CloudUploadIcon sx={{ fontSize: 48, color: '#00bcd4' }} />,
    emoji: '☁️',
    title: 'Cloud Storage',
    desc: 'All files are securely stored in the cloud for easy access and sharing.'
  },
  {
    icon: <GroupIcon sx={{ fontSize: 48, color: '#8e24aa' }} />,
    emoji: '🤝',
    title: 'Collaborate',
    desc: 'Connect and collaborate with students across departments and years.'
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 48, color: '#ff9800' }} />,
    emoji: '🏆',
    title: 'Engage & Achieve',
    desc: 'Like, comment, and interact with posts. Build your academic network.'
  }
];

export default function HomeInfo() {
  return (
    <Box sx={{ minHeight: '90vh', bgcolor: '#f5faff', py: 6 }}>
      <Fade in timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} color="#1976d2" gutterBottom>
            👋 Welcome to Student Collaboration Hub!
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Your one-stop platform for sharing, learning, and growing together.
          </Typography>
        </Box>
      </Fade>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Fade in timeout={800 + idx * 200}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.04)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h4" component="div" sx={{ mb: 1 }}>{feature.emoji} {feature.title}</Typography>
                  <Typography variant="body1" color="text.secondary">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 