import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DarkModeContext } from "../../theme";
import { Box, Typography, Button } from "@mui/material";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useContext(DarkModeContext);
  const location = useLocation();
  return (
    <Box
      component="nav"
      sx={{
        background: theme.primary,
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 64,
        boxShadow: 2,
        zIndex: 1000,
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo and App Name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="24" height="12" rx="3" fill={theme.primaryDark} />
          <rect x="8" y="6" width="16" height="6" rx="2" fill={theme.primaryLight} />
          <rect x="10" y="22" width="12" height="2" rx="1" fill={theme.primaryLight} />
        </svg>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "white",
            letterSpacing: 2,
            fontSize: { xs: "1.1rem", md: "1.35rem" },
            userSelect: "none",
          }}
        >
          STUDENT HUB
        </Typography>
      </Box>
      {/* Navigation Links */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
        {user && (
          <Button component={Link} to="/home" sx={{ color: "white", fontWeight: 500 }}>Home</Button>
        )}
        {user && (
          <Button component={Link} to="/posts" sx={{ color: "white", fontWeight: 500 }}>Posts</Button>
        )}
        {user && (
          <Button component={Link} to="/profile" sx={{ color: "white", fontWeight: 500 }}>Profile</Button>
        )}
        {!user && (
          <Button component={Link} to="/login" sx={{ color: "white", fontWeight: 500 }}>Login</Button>
        )}
        {!user && (
          <Button component={Link} to="/register" sx={{ color: "white", fontWeight: 500 }}>Register</Button>
        )}
        {user && (
          <Button onClick={logout} sx={{ color: "white", fontWeight: 500 }}>Logout</Button>
        )}
      </Box>
    </Box>
  );
} 