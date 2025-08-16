import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";

export default function SignUpPage() {
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
            mb: 4,
          }}
        >
          Sign Up
        </Typography>
        <TextField
          label="E-mail Address"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          sx={{ mt: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
        />
        <TextField
          label="Confirm the password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          sx={{ mt: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
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
          onClick={() => alert("Signing UUp...")}
        >
          Create an Account
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
          Already have an account ? Connect
        </Typography>
      </Paper>
    </Box>
  );
}