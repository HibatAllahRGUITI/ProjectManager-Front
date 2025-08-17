import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import { signup } from "../Services/authService";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await signup(username, email, password);
      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert("Sign up failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
      <Paper elevation={6} sx={{ p: 6, maxWidth: 400, width: '100%', borderRadius: 3, textAlign: 'center', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
          Sign Up
        </Typography>

        {/* Champ Username */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="E-mail Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 4, py: 1.5, borderRadius: 2 }} onClick={handleSignUp}>
          Create an Account
        </Button>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }} onClick={() => navigate("/")}>
          Already have an account ? Connect
        </Typography>
      </Paper>
    </Box>
  );
}
