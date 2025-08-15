import './App.css';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import theme from './theme';
import LoginPage from './Pages/LoginPage'
import SignUpPage from './Pages/SignUpPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import Dashboard from './Pages/Dashboard'
import ProjectPage from './Pages/ProjectPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
