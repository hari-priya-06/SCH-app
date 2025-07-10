import React, { useState, useEffect, useContext } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Link as MuiLink, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode, DarkModeContext } from "../theme";

const departments = [
  "CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "IT"
];

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    department: "",
    bio: "",
    year: 1
  });
  const [loading, setLoading] = useState(false);
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { theme } = useContext(DarkModeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (!form.department) return "Department is required";
    return null;
  };

  const handlePasswordVisibility = () => setShowPassword((show) => !show);
  const handleConfirmVisibility = () => setShowConfirm((show) => !show);

  const handleSubmit = async e => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      return;
    }
    
    setLoading(true);
    
    const userData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      department: form.department,
      bio: form.bio.trim(),
      year: parseInt(form.year)
    };
    
    const result = await signup(userData);
    
    if (result.success) {
      navigate("/");
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3, borderRadius: 4, p: 0, maxWidth: 900, width: '100%' }}>
        {/* Illustration */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F3F6F8', p: { xs: 2, md: 4 } }}>
          <img src="/illustration-login.png" alt="Register Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
        </Box>
        {/* Register Form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" color={theme.primary} fontWeight={700} mb={2}>Create your account</Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Full Name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
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
              helperText="Minimum 6 characters"
              sx={{ mb: 2 }}
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
            <TextField 
              label="Confirm Password" 
              name="confirmPassword" 
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleConfirmVisibility} edge="end" tabIndex={-1}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField 
              select 
              label="Department" 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {departments.map(dep => (
                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
              ))}
            </TextField>
            <TextField 
              select 
              label="Year" 
              name="year" 
              value={form.year} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              sx={{ mb: 2 }}
            >
              {[1, 2, 3, 4, 5].map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
            <TextField 
              label="Bio (Optional)" 
              name="bio" 
              value={form.bio} 
              onChange={handleChange} 
              fullWidth 
              margin="normal"
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
            
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{" "}
            <MuiLink 
              component={Link} 
              to="/login"
              sx={{ 
                color: theme.primary,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
} 