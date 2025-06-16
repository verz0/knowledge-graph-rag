import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import {
  Check as CheckIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Money as MoneyIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import apiService from '../../services/apiService';

function ItineraryGenerator() {
  const [activeStep, setActiveStep] = useState(0);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [savedItineraries, setSavedItineraries] = useState(() => {
    try {
      const saved = localStorage.getItem('savedItineraries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const steps = ['Enter Destination', 'Review Itinerary', 'Summary & Actions'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Enter your destination city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                  boxShadow: 'none',
                  transform: 'none',
                }
              }}
              disabled={loading || !city.trim()}
            >
              Generate Itinerary
            </Button>
          </Box>
        );
      case 1:
        if (!generatedItinerary || !Array.isArray(generatedItinerary.days)) {
          return <Typography>No itinerary available.</Typography>;
        }
        return (
          <Box>
            {generatedItinerary.days.map((day, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">Day {day.day || index + 1}: {day.title || ''}</Typography>
                {Array.isArray(day.activities) ? (
                  day.activities.map((activity, idx) => (
                    <Chip key={idx} label={activity.activity || activity} sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Typography>No activities available.</Typography>
                )}
              </Box>
            ))}
          </Box>
        );
      case 2:
        if (!generatedItinerary) {
          return <Typography>No itinerary summary available.</Typography>;
        }
        return (
          <Card sx={{ 
            p: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <CheckIcon sx={{ mr: 2, color: 'success.main', fontSize: '2rem' }} />
              {generatedItinerary.title}
            </Typography>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => {
                  const saved = [...savedItineraries, { ...generatedItinerary, id: Date.now(), savedAt: new Date() }];
                  setSavedItineraries(saved);
                  localStorage.setItem('savedItineraries', JSON.stringify(saved));
                }}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    borderColor: 'primary.dark',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Save Itinerary
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => navigator.share?.({ title: generatedItinerary.title, text: 'Check out my travel itinerary!' })}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'success.main',
                  color: 'success.main',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                    borderColor: 'success.dark',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => window.print()}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'info.main',
                  color: 'info.main',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    borderColor: 'info.dark',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setActiveStep(0)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'warning.main',
                  color: 'warning.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.08)',
                    borderColor: 'warning.dark',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Edit Trip
              </Button>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Chip 
                  icon={<ScheduleIcon />} 
                  label={`${generatedItinerary.totalDays} Days`}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    color: 'primary.main',
                    '& .MuiChip-icon': {
                      color: 'primary.main'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip 
                  icon={<MoneyIcon />} 
                  label={generatedItinerary.estimatedBudget}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    color: 'success.main',
                    '& .MuiChip-icon': {
                      color: 'success.main'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip 
                  icon={<GroupIcon />} 
                  label={`${generatedItinerary.travelers} Traveler${generatedItinerary.travelers > 1 ? 's' : ''}`}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    color: 'warning.main',
                    '& .MuiChip-icon': {
                      color: 'warning.main'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedItinerary(null);

    try {
      const verifiedCity = await apiService.verifyCity(city.trim());
      if (!verifiedCity) {
        setError('City not found or not supported. Showing sample itinerary.');
        setGeneratedItinerary({ days: [] });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/travel/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinations: [city.trim()],
          duration: 3,
          budget: 'medium',
          interests: [],
          travelers: 1,
          travelStyle: 'standard',
          accessibility: false
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate itinerary');
      }

      setGeneratedItinerary(data.data);
      setActiveStep(1);
    } catch (err) {
      setError('Error generating itinerary: ' + err.message);
      setGeneratedItinerary({ days: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Paper elevation={24} sx={{ borderRadius: 6, p: 4, mb: 4, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {getStepContent(index)}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Fade>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {error}
          </Alert>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ItineraryGenerator;