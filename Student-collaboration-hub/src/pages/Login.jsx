import React, { useState, useEffect, useContext } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink, Alert, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode, DarkModeContext } from "../theme";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { theme } = useContext(DarkModeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(form.email, form.password);
    
    if (result.success) {
      navigate("/");
    }
    
    setLoading(false);
  };

  const handlePasswordVisibility = () => setShowPassword((show) => !show);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Top left Study Hub title */}
      {/* Main content */}
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3, borderRadius: 4, p: 0, maxWidth: 900, width: '100%' }}>
        {/* Illustration */}
        <Box sx={{ flex: 1, minHeight: { xs: 180, md: 420 }, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.background, p: { xs: 2, md: 4 }, boxShadow: { md: '2px 0 8px 0 rgba(0,0,0,0.03)' }, position: 'relative', overflow: 'hidden' }}>
          <img src="/login_image.png" alt="Login" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </Box>
        {/* Login Form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1976d2" mb={0}>
            Sign in to
          </Typography>
          <Typography variant="h2" fontWeight={900} color="#1976d2" mb={2} sx={{ lineHeight: 1.1 }}>
            Student Hub
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Email" 
              name="email" 
              type="email"
              value={form.email} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Password" 
              name="password" 
              type={showPassword ? "text" : "password"}
              value={form.password} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              required
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePasswordVisibility} edge="end" tabIndex={-1}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <MuiLink
              component="button"
              type="button"
              onClick={() => setForgotOpen(true)}
              sx={{ display: 'block', textAlign: 'right', mb: 2, color: theme.primary, fontSize: 14 }}
            >
              Forgot password?
            </MuiLink>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ 
                background: theme.primary,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  background: theme.primaryDark
                }
              }} 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            Don't have an account?{" "}
            <MuiLink 
              component={Link} 
              to="/register"
              sx={{ 
                color: theme.primary,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Card>
      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {resetSent ? (
            <Alert severity="success">If this email is registered, a reset link has been sent.</Alert>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Registered Email"
              type="email"
              fullWidth
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          {!resetSent && <Button onClick={() => { setResetSent(true); }}>Send Reset Link</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
} 