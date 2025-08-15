import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5A5482", // Un violet foncé et élégant
    },
    secondary: {
      main: "#A5A3BE", // Un lilas doux
    },
    background: {
      default: "#f5f5f5", // Le fond très clair
      paper: "#ffffff", // Papier blanc pur
    },
    text: {
      primary: "#333333", // Texte principal noir très foncé
      secondary: "#666666", // Texte secondaire gris
    },
  },
  typography: {
    fontFamily: [
      "Poppins", // Une police moderne
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bords arrondis par défaut pour tous les boutons
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;