import React from 'react';

// Test each import individually
console.log('Testing imports...');

// Test 1: Basic React components
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

console.log('Basic imports OK');

// Test 2: Date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

console.log('Date picker imports OK');

// Test 3: AuthContext
import { AuthProvider } from './contexts/AuthContext';

console.log('AuthContext import OK');

// Test 4: Components one by one
// import Navbar from './Components/layout/Navbar';
// console.log('Navbar import OK');

// import HomePage from './Components/pages/HomePage';
// console.log('HomePage import OK');

// import Login from './Components/auth/Login';
// console.log('Login import OK');

// import Register from './Components/auth/Register';
// console.log('Register import OK');

// import ProtectedRoute from './Components/auth/ProtectedRoute';
// console.log('ProtectedRoute import OK');

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
    },
  },
});

const TestApp = () => {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ p: 2 }}>
            <h1>Test App - Imports Working</h1>
          </Box>
        </ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
};

export default TestApp;
