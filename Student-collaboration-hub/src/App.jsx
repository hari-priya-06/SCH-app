// If you haven't already, run: npm install react-dom@18
// If you haven't already, run: npm install react-router-dom
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? <Navigate to="/" replace /> : children;
};

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
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/posts" element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
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
