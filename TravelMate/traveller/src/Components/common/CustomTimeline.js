import React from 'react';
import { Box, styled } from '@mui/material';

// Custom Timeline Components
const Timeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '24px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: theme.palette.divider,
  },
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '70px',
  position: 'relative',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
}));

const TimelineSeparator = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const TimelineDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})(({ theme, bgcolor = 'primary.main' }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: typeof bgcolor === 'string' ? bgcolor : theme.palette[bgcolor]?.main || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  boxShadow: theme.shadows[2],
  border: `3px solid ${theme.palette.background.paper}`,
}));

const TimelineConnector = styled(Box)(({ theme }) => ({
  width: '2px',
  backgroundColor: theme.palette.divider,
  flexGrow: 1,
  minHeight: '20px',
}));

const TimelineContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1, 0),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
};
