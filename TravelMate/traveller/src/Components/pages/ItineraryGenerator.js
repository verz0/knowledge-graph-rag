import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControlLabel,
  Switch,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '../common/CustomTimeline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  FlightTakeoff as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  Create as CreateIcon,
  CheckCircle as CheckIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Explore as ExploreIcon,
  LocalActivity as ActivityIcon,
  Camera as CameraIcon,
  Nature as NatureIcon,
  Museum as MuseumIcon,
  ShoppingBag as ShoppingIcon,
  Nightlife as NightlifeIcon,
  Spa as SpaIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ItineraryGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [itineraryData, setItineraryData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    travelers: 1,
    budget: '',
    interests: [],
    travelStyle: '',
  });  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedItineraries, setSavedItineraries] = useState([]);

  const steps = [
    'Destination & Dates',
    'Travel Preferences',
    'Generate Itinerary'
  ];

  const interests = [
    'Culture & History',
    'Food & Dining',
    'Adventure & Sports',
    'Nature & Wildlife',
    'Art & Museums',
    'Shopping',
    'Nightlife',
    'Relaxation & Spa',
    'Photography',
    'Local Experiences'
  ];

  const travelStyles = [
    { value: 'budget', label: 'Budget Traveler', description: 'Maximize experiences while minimizing costs' },
    { value: 'comfort', label: 'Comfort Seeker', description: 'Balance of comfort and value' },
    { value: 'luxury', label: 'Luxury Explorer', description: 'Premium experiences and accommodations' },
    { value: 'adventure', label: 'Adventure Enthusiast', description: 'Action-packed and thrilling activities' },
    { value: 'cultural', label: 'Cultural Immersion', description: 'Deep dive into local culture and traditions' }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInterestToggle = (interest) => {
    setItineraryData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock itinerary generation
      const mockItinerary = {
        title: `${itineraryData.travelers}-Day Adventure in ${itineraryData.destination}`,
        totalDays: dayjs(itineraryData.endDate).diff(dayjs(itineraryData.startDate), 'day') + 1,
        estimatedBudget: '$1,200 - $1,800',
        days: [
          {
            day: 1,
            title: 'Arrival & City Exploration',
            activities: [
              { time: '09:00', activity: 'Arrive and check into hotel', type: 'hotel', icon: <HotelIcon /> },
              { time: '11:00', activity: 'Walking tour of historic district', type: 'culture', icon: <PlaceIcon /> },
              { time: '13:00', activity: 'Lunch at local restaurant', type: 'food', icon: <RestaurantIcon /> },
              { time: '15:00', activity: 'Visit main attractions', type: 'sightseeing', icon: <PlaceIcon /> },
              { time: '19:00', activity: 'Welcome dinner at rooftop restaurant', type: 'food', icon: <RestaurantIcon /> }
            ]
          },
          {
            day: 2,
            title: 'Cultural Immersion',
            activities: [
              { time: '09:00', activity: 'Visit art museum', type: 'culture', icon: <PlaceIcon /> },
              { time: '11:30', activity: 'Local cooking class', type: 'experience', icon: <RestaurantIcon /> },
              { time: '14:00', activity: 'Explore traditional markets', type: 'shopping', icon: <PlaceIcon /> },
              { time: '16:00', activity: 'Cultural performance show', type: 'culture', icon: <PlaceIcon /> },
              { time: '20:00', activity: 'Dinner at authentic local eatery', type: 'food', icon: <RestaurantIcon /> }
            ]
          },
          {
            day: 3,
            title: 'Adventure & Departure',
            activities: [
              { time: '08:00', activity: 'Adventure activity or excursion', type: 'adventure', icon: <FlightIcon /> },
              { time: '12:00', activity: 'Farewell lunch', type: 'food', icon: <RestaurantIcon /> },
              { time: '14:00', activity: 'Last-minute shopping', type: 'shopping', icon: <PlaceIcon /> },
              { time: '16:00', activity: 'Check out and depart', type: 'travel', icon: <FlightIcon /> }
            ]
          }
        ]
      };
      
      setGeneratedItinerary(mockItinerary);
      handleNext();
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {      case 0:
        return (
          <Card sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center'
            }}>
              <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
              Destination & Travel Dates
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destination"
                  value={itineraryData.destination}
                  onChange={(e) => setItineraryData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., Paris, Tokyo, New York"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={itineraryData.startDate}
                  onChange={(newValue) => setItineraryData(prev => ({ ...prev, startDate: newValue }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                        }
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={itineraryData.endDate}
                  onChange={(newValue) => setItineraryData(prev => ({ ...prev, endDate: newValue }))}
                  minDate={itineraryData.startDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                        }
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Travelers"
                  value={itineraryData.travelers}
                  onChange={(e) => setItineraryData(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                  inputProps={{ min: 1, max: 20 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    }
                  }}
                />
              </Grid>              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Budget Range</InputLabel>
                  <Select
                    value={itineraryData.budget}
                    onChange={(e) => setItineraryData(prev => ({ ...prev, budget: e.target.value }))}
                    label="Budget Range"
                    sx={{
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="budget">Budget ($500-$1000)</MenuItem>
                    <MenuItem value="mid-range">Mid-range ($1000-$2500)</MenuItem>
                    <MenuItem value="luxury">Luxury ($2500+)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        );
        case 1:
        return (
          <Card sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ExploreIcon sx={{ mr: 1, color: 'primary.main' }} />
              Travel Preferences
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                  Select your interests:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                  {interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onClick={() => handleInterestToggle(interest)}
                      color={itineraryData.interests.includes(interest) ? 'primary' : 'default'}
                      variant={itineraryData.interests.includes(interest) ? 'filled' : 'outlined'}
                      sx={{ 
                        cursor: 'pointer',
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        },
                        '&.MuiChip-filled': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                  Choose your travel style:
                </Typography>
                <Grid container spacing={3}>
                  {travelStyles.map((style) => (
                    <Grid item xs={12} sm={6} md={4} key={style.value}>
                      <Card
                        elevation={0}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 4,
                          transition: 'all 0.3s ease',
                          background: itineraryData.travelStyle === style.value 
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                            : 'rgba(255, 255, 255, 0.8)',
                          border: itineraryData.travelStyle === style.value 
                            ? '2px solid' 
                            : '1px solid',
                          borderColor: itineraryData.travelStyle === style.value 
                            ? 'primary.main' 
                            : 'rgba(0, 0, 0, 0.08)',
                          boxShadow: itineraryData.travelStyle === style.value 
                            ? '0 8px 24px rgba(102, 126, 234, 0.2)' 
                            : '0 2px 8px rgba(0, 0, 0, 0.04)',
                          '&:hover': { 
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                        onClick={() => setItineraryData(prev => ({ ...prev, travelStyle: style.value }))}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 600,
                              color: itineraryData.travelStyle === style.value ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {style.label}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {style.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Card>
        );
        case 2:
        return (
          <Card sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}>
            {!generatedItinerary ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CreateIcon sx={{ 
                  fontSize: 80, 
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }} />
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Ready to Generate Your Itinerary?
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    fontSize: '1.1rem', 
                    maxWidth: '500px', 
                    mx: 'auto', 
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  Based on your preferences, we'll create a detailed day-by-day plan for your trip to {itineraryData.destination}.
                </Typography>
                {loading ? (
                  <Box sx={{ my: 6 }}>
                    <CircularProgress 
                      size={80} 
                      sx={{ 
                        mb: 3,
                        '& .MuiCircularProgress-circle': {
                          stroke: 'url(#gradient)',
                        }
                      }} 
                    />
                    <svg width={0} height={0}>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ✨ Generating your personalized itinerary...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      This may take a few moments
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={generateItinerary}
                    startIcon={<CreateIcon />}
                    sx={{ 
                      mt: 2,
                      px: 6,
                      py: 2,
                      borderRadius: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
                      }
                    }}
                  >
                    ✨ Generate My Itinerary
                  </Button>
                )}
              </Box>            ) : (
              <Box sx={{ py: 2 }}>
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
                    💾 Save Itinerary
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
                    📤 Share
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
                    📄 Download PDF
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
                    ✏️ Edit Trip
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
                      label={`${itineraryData.travelers} Traveler${itineraryData.travelers > 1 ? 's' : ''}`}
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
                
                {generatedItinerary.days.map((day, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Day {day.day}: {day.title}
                      </Typography>
                      <List dense>
                        {day.activities.map((activity, actIndex) => (
                          <ListItem key={actIndex}>
                            <ListItemIcon>{activity.icon}</ListItemIcon>
                            <ListItemText
                              primary={activity.activity}
                              secondary={activity.time}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                ))}

                {/* Additional Travel Information */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Travel Tips & Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Best Time to Visit
                        </Typography>
                        <Typography variant="body2">
                          Based on your travel dates and destination climate
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Packing Essentials
                        </Typography>
                        <Typography variant="body2">
                          Comfortable walking shoes, weather-appropriate clothing, travel adapter
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Local Customs
                        </Typography>
                        <Typography variant="body2">
                          Research local etiquette and customs before your visit
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>                </Card>
              </Box>
            )}
          </Card>
        );
      
      default:
        return 'Unknown step';
    }
  };
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Paper 
            elevation={24} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 4, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CreateIcon sx={{ 
              fontSize: 72, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2 
            }} />
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              AI Itinerary Generator
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              paragraph
              sx={{ 
                fontWeight: 400,
                opacity: 0.8,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Create personalized travel itineraries powered by artificial intelligence
            </Typography>
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

        <Paper 
          elevation={16} 
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical"
            sx={{
              '& .MuiStep-root': {
                '& .MuiStepLabel-root': {
                  py: 2,
                },
                '& .MuiStepLabel-label': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  '&.Mui-active': {
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                  '&.Mui-completed': {
                    color: 'success.main',
                    fontWeight: 600,
                  }
                },
                '& .MuiStepIcon-root': {
                  fontSize: '1.8rem',
                  '&.Mui-active': {
                    color: 'primary.main',
                  },
                  '&.Mui-completed': {
                    color: 'success.main',
                  }
                }
              }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 3 }}>
                    {getStepContent(index)}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? null : handleNext}
                      sx={{ 
                        mt: 2, 
                        mr: 2,
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
                      disabled={
                        (index === 0 && (!itineraryData.destination || !itineraryData.startDate || !itineraryData.endDate)) ||
                        (index === 1 && (!itineraryData.interests.length || !itineraryData.travelStyle)) ||
                        loading
                      }
                    >
                      {index === steps.length - 1 ? '✨ Finish' : '→ Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ 
                        mt: 2, 
                        mr: 1,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'text.secondary',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(102, 126, 234, 0.04)',
                        }
                      }}
                      variant="outlined"
                    >
                      ← Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Container>
    </Box>
  );
};

export default ItineraryGenerator;