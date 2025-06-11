import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Chip,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CardMedia,
} from '@mui/material';
import {
  TravelExplore as TravelIcon,
  DateRange as DateIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Place as PlaceIcon,
  Event as EventIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  DirectionsCar as CarIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  LocalActivity as ActivityIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const TravelPlannerFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [travelData, setTravelData] = useState({
    source: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    budget: '',
    travelers: 1,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  const steps = [
    'Travel Details',
    'Select Places',
    'Generate Itinerary',
    'Your Travel Plan'
  ];

  const budgetRanges = [
    { value: 'budget', label: 'Budget ($500-$1000)', icon: '💰' },
    { value: 'mid-range', label: 'Mid-range ($1000-$2500)', icon: '💎' },
    { value: 'luxury', label: 'Luxury ($2500+)', icon: '👑' },
  ];

  const handleNext = () => {
    if (activeStep === 0 && validateTravelDetails()) {
      setActiveStep(1);
      fetchPlaces();
    } else if (activeStep === 1 && selectedPlaces.length > 0) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      generateItinerary();
    } else if (activeStep === 3) {
      setActiveStep(0);
      resetFlow();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateTravelDetails = () => {
    if (!travelData.destination || !travelData.departureDate || !travelData.returnDate || !travelData.budget) {
      setError('Please fill in all required fields');
      return false;
    }
    if (dayjs(travelData.returnDate).isBefore(dayjs(travelData.departureDate))) {
      setError('Return date must be after departure date');
      return false;
    }
    setError('');
    return true;
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const query = `
        query GetTopKPlaces($userData: UserDataInput!) {
          topKPlaces(Input: $userData) {
            business_status
            formatted_address
            geometry {
              location {
                lat
                lng
              }
            }
            icon
            name
            opening_hours {
              open_now
            }
            photos
            place_id
            rating
            reference
            types
            user_ratings_total
            selected
          }
        }
      `;

      const userDataFormatted = {
        source: travelData.source || 'Unknown',
        destination: travelData.destination,
        departureDate: travelData.departureDate?.format('YYYY-MM-DD') || '',
        returnDate: travelData.returnDate?.format('YYYY-MM-DD') || '',
        budget: travelData.budget,
        description: travelData.description || '',
      };

      const response = await fetch('http://localhost:8686/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: {
            userData: userDataFormatted,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedPlaces = data.data.topKPlaces || [];
      setPlaces(fetchedPlaces);
      
      // Auto-select places that were marked as selected
      const autoSelected = fetchedPlaces
        .filter(place => place.selected === 1)
        .map(place => place.place_id);
      setSelectedPlaces(autoSelected);
      
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to fetch places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const selectedPlaceObjects = places.filter(place => 
        selectedPlaces.includes(place.place_id)
      );

      const statement = selectedPlaceObjects
        .map(place => `${place.name} at ${place.formatted_address}`)
        .join(', ');

      const userInput = {
        source: travelData.source,
        destination: travelData.destination,
        departureDate: travelData.departureDate?.format('YYYY-MM-DD'),
        returnDate: travelData.returnDate?.format('YYYY-MM-DD'),
        budget: travelData.budget,
        description: travelData.description,
        travelers: travelData.travelers,
      };

      const query = `
        query EventPlanner($selectedPlaces: String!, $userInput: UserInputForEventPlanner!) {
          eventPlanner(selectedPlaces: $selectedPlaces, userInput: $userInput) {
            name
            details
            timing
            total_duration
            famous_activity
            recommended_transport
            additional_notes
          }
        }
      `;

      const response = await fetch('http://localhost:8686/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { 
            selectedPlaces: statement, 
            userInput 
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setItinerary(data.data.eventPlanner || []);
      setActiveStep(3);
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setTravelData({
      source: '',
      destination: '',
      departureDate: null,
      returnDate: null,
      budget: '',
      travelers: 1,
      description: '',
    });
    setPlaces([]);
    setSelectedPlaces([]);
    setItinerary(null);
    setError('');
  };

  const handlePlaceSelection = (placeId) => {
    setSelectedPlaces(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From (Source)"
                value={travelData.source}
                onChange={(e) => setTravelData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., New York"
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To (Destination)"
                value={travelData.destination}
                onChange={(e) => setTravelData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., Paris, Tokyo, London"
                required
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Departure Date"
                value={travelData.departureDate}
                onChange={(newValue) => setTravelData(prev => ({ ...prev, departureDate: newValue }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  }
                }}
                minDate={dayjs()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Return Date"
                value={travelData.returnDate}
                onChange={(newValue) => setTravelData(prev => ({ ...prev, returnDate: newValue }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  }
                }}
                minDate={travelData.departureDate || dayjs()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Travelers"
                value={travelData.travelers}
                onChange={(e) => setTravelData(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                inputProps={{ min: 1, max: 20 }}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Budget Range</InputLabel>
                <Select
                  value={travelData.budget}
                  onChange={(e) => setTravelData(prev => ({ ...prev, budget: e.target.value }))}
                  label="Budget Range"
                >
                  {budgetRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{range.icon}</span>
                        {range.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Describe your interests & preferences"
                value={travelData.description}
                onChange={(e) => setTravelData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., I love historical sites, local cuisine, adventure activities..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select places you'd like to visit in {travelData.destination}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose from recommended places based on your preferences
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {places.map((place) => (
                  <Grid item xs={12} sm={6} md={4} key={place.place_id}>
                    <Card 
                      elevation={selectedPlaces.includes(place.place_id) ? 8 : 2}
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedPlaces.includes(place.place_id) ? 2 : 0,
                        borderColor: 'primary.main',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        }
                      }}
                      onClick={() => handlePlaceSelection(place.place_id)}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                            {place.name}
                          </Typography>
                          {selectedPlaces.includes(place.place_id) && (
                            <CheckIcon color="primary" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {place.formatted_address}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={place.rating || 0} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({place.user_ratings_total || 0})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {place.types?.slice(0, 3).map((type, index) => (
                            <Chip 
                              key={index} 
                              label={type.replace(/_/g, ' ')} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {selectedPlaces.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {selectedPlaces.length} place(s) selected for your itinerary
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TravelIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Ready to generate your personalized itinerary?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We'll create a detailed travel plan based on your selected places and preferences.
            </Typography>
            <Box sx={{ my: 3 }}>
              <Chip 
                icon={<LocationIcon />} 
                label={`${selectedPlaces.length} places selected`} 
                sx={{ mr: 1, mb: 1 }} 
              />
              <Chip 
                icon={<DateIcon />} 
                label={`${dayjs(travelData.returnDate).diff(dayjs(travelData.departureDate), 'day')} days`}
                sx={{ mr: 1, mb: 1 }} 
              />
              <Chip 
                icon={<PersonIcon />} 
                label={`${travelData.travelers} traveler${travelData.travelers > 1 ? 's' : ''}`}
                sx={{ mr: 1, mb: 1 }} 
              />
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom color="success.main">
                Your Travel Plan is Ready!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's your personalized itinerary for {travelData.destination}
              </Typography>
            </Box>

            {itinerary && itinerary.length > 0 ? (
              <Grid container spacing={3}>
                {itinerary.map((location, index) => (
                  <Grid item xs={12} key={index}>
                    <Card elevation={3}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <PlaceIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {location.name}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              {location.details}
                            </Typography>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ScheduleIcon color="primary" />
                                  <Box>
                                    <Typography variant="subtitle2">Timing</Typography>
                                    <Typography variant="body2">{location.timing}</Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <EventIcon color="primary" />
                                  <Box>
                                    <Typography variant="subtitle2">Duration</Typography>
                                    <Typography variant="body2">{location.total_duration}</Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              
                              {location.famous_activity && (
                                <Grid item xs={12} sm={6} md={3}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ActivityIcon color="primary" />
                                    <Box>
                                      <Typography variant="subtitle2">Famous Activity</Typography>
                                      <Typography variant="body2">{location.famous_activity}</Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              )}
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CarIcon color="primary" />
                                  <Box>
                                    <Typography variant="subtitle2">Transport</Typography>
                                    <Typography variant="body2">{location.recommended_transport}</Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                            
                            {location.additional_notes && (
                              <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                  <strong>Notes:</strong> {location.additional_notes}
                                </Typography>
                              </Alert>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="warning">
                No itinerary generated. Please try again with different selections.
              </Alert>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <TravelIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Travel Planner
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Plan your perfect trip with AI-powered recommendations
          </Typography>
        </Paper>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '1.1rem',
                    fontWeight: activeStep === index ? 600 : 400,
                  },
                }}
              >
                {label}
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {getStepContent(index)}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={loading || (activeStep === 1 && selectedPlaces.length === 0)}
                    startIcon={loading ? <CircularProgress size={20} /> : undefined}
                  >
                    {index === steps.length - 1 ? 'Plan Another Trip' : 
                     index === 2 ? 'Generate Itinerary' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0 || loading}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                    startIcon={<BackIcon />}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default TravelPlannerFlow;
