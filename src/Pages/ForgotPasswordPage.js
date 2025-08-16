import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#333',
            mb: 2,
          }}
        >
          forgot Password ?
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Enter your email address to recieve a reset link.
        </Typography>
        <TextField
          label="E-mail Address"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => alert("Reset Link is sent !")}
        >
          Reset Password
        </Button>
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: 'text.secondary',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main',
            },
          }}
          onClick={() => navigate("/")}
        >
          Back to Login
        </Typography>
      </Paper>
    </Box>
  );
}