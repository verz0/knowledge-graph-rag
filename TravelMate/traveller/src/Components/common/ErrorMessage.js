import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorMessage = ({ 
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  severity = 'error',
  onRetry,
  showRetry = false,
  ...props 
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity={severity} {...props}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
        {showRetry && onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;