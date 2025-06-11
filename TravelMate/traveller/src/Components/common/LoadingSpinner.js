import React from 'react';
import PropTypes from 'prop-types'; // Add this import
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  color = 'primary',
  fullScreen = false 
}) => {
  const containerStyles = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography 
          variant="body1" 
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Add these prop type definitions
LoadingSpinner.propTypes = {
  size: PropTypes.number,
  message: PropTypes.string,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;