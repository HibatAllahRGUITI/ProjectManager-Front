import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";

export default function Login() {
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
          Connexion
        </Typography>
        <TextField
          label="Adresse e-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{ mb: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
        />
        <TextField
          label="Mot de passe"
          variant="outlined"
          type="password"
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
          onClick={() => navigate("/dashboard")}
        >
          Se connecter
        </Button>

        {/* Section des liens */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Mot de passe oublié ?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'text.secondary',
              cursor: 'pointer',
            }}
          >
            Pas encore de compte ?{' '}
            <Box
              component="span"
              onClick={() => navigate("/signup")}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              S'inscrire
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}