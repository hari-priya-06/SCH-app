// If you haven't already, run: npm install react-dom@18
// If you haven't already, run: npm install react-router-dom
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PostsList from "./PostsList";
import BottomNavBar from "./components/common/BottomNavBar";
import { DarkModeContext, getTheme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomeInfo from "./pages/HomeInfo";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);
  if (loading) return null;
  return isAuthenticated ? children : null;
}

// Public Route Component (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, loading, navigate]);
  if (loading) return null;
  return !isAuthenticated ? children : null;
}

function AppContent() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem("darkMode") === "true");
  const theme = getTheme(darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, theme }}>
      <Router>
        <CssBaseline />
        {user && <Navbar />}
        <Box sx={{ display: "flex", bgcolor: theme.background, color: theme.text, minHeight: "100vh" }}>
          {/* Sidebar removed */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: user ? 3 : 0, 
              bgcolor: theme.background, 
              color: theme.text 
            }}
          >
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={<ProtectedRoute><HomeInfo /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/posts" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {user && <BottomNavBar />}
          </Box>
        </Box>
      </Router>
    </DarkModeContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
