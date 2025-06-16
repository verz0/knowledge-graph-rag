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
import apiService from '../../services/apiService';

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
  const [error, setError] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);

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

  const handleNext = async () => {
    if (activeStep === 0 && validateTravelDetails()) {
      setActiveStep(1);
      await fetchPlaces();
    } else if (activeStep === 1) {
      if (selectedPlaces.length === 0) {
        setError('Please select at least one place to visit');
        return;
      }
      setError('');
      setActiveStep(2);
    } else if (activeStep === 2) {
      await generateItinerary();
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
    setError('');
    
    try {
      // Use the travel search API to get places for the destination
      const searchResult = await apiService.searchPlaces(travelData.destination.trim(), {
        limit: 20 // Get more places for selection
      });
      
      let fetchedPlaces = [];
      
      if (searchResult && searchResult.results && searchResult.results.length > 0) {
        fetchedPlaces = searchResult.results.map(place => ({
          place_id: place.placeId || place.id || place.name?.toLowerCase().replace(/\s+/g, '_'),
          name: place.name,
          formatted_address: place.address || place.location || 'Address not available',
          rating: place.rating || 0,
          user_ratings_total: place.reviews_count || place.user_ratings_total || 0,
          types: place.types || place.categories || ['tourist_attraction'],
          photos: place.images || place.photos || [],
          photo_url: place.images?.[0] || place.photo_url || null,
          business_status: 'OPERATIONAL',
          geometry: {
            location: {
              lat: place.coordinates?.lat || 0,
              lng: place.coordinates?.lng || 0
            }
          }
        }));
      }
      
      // If no results from search, try to get places for the city
      if (fetchedPlaces.length === 0) {
        try {
          const cityPlacesResult = await apiService.getPlacesForCity(travelData.destination.trim());
          if (cityPlacesResult && cityPlacesResult.length > 0) {
            fetchedPlaces = cityPlacesResult.map(place => ({
              place_id: place.placeId || place.place_id || place.name?.toLowerCase().replace(/\s+/g, '_'),
              name: place.name,
              formatted_address: place.address || place.formatted_address || 'Address not available',
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0,
              types: place.types || ['tourist_attraction'],
              photos: place.photos || [],
              photo_url: place.photo_url || null,
              business_status: 'OPERATIONAL',
              geometry: {
                location: {
                  lat: place.location?.lat || 0,
                  lng: place.location?.lng || 0
                }
              }
            }));
          }
        } catch (cityError) {
          console.warn('City places API also failed:', cityError);
        }
      }
      
      if (fetchedPlaces.length > 0) {
        setPlaces(fetchedPlaces);
        setSelectedPlaces([]); // Start with no places selected
        setError('');
      } else {
        // If still no places, create some mock places based on the destination
        const mockPlaces = [
          {
            place_id: `${travelData.destination.toLowerCase().replace(/\s+/g, '_')}_attraction_1`,
            name: `Popular Attraction in ${travelData.destination}`,
            formatted_address: `${travelData.destination}`,
            rating: 4.5,
            user_ratings_total: 100,
            types: ['tourist_attraction'],
            photos: [],
            photo_url: null,
            business_status: 'OPERATIONAL',
            geometry: { location: { lat: 0, lng: 0 } }
          },
          {
            place_id: `${travelData.destination.toLowerCase().replace(/\s+/g, '_')}_museum_1`,
            name: `Local Museum in ${travelData.destination}`,
            formatted_address: `${travelData.destination}`,
            rating: 4.2,
            user_ratings_total: 80,
            types: ['museum'],
            photos: [],
            photo_url: null,
            business_status: 'OPERATIONAL',
            geometry: { location: { lat: 0, lng: 0 } }
          },
          {
            place_id: `${travelData.destination.toLowerCase().replace(/\s+/g, '_')}_park_1`,
            name: `City Park in ${travelData.destination}`,
            formatted_address: `${travelData.destination}`,
            rating: 4.0,
            user_ratings_total: 150,
            types: ['park'],
            photos: [],
            photo_url: null,
            business_status: 'OPERATIONAL',
            geometry: { location: { lat: 0, lng: 0 } }
          }
        ];
        
        setPlaces(mockPlaces);
        setSelectedPlaces([]);
        setError('Limited places available. You can still proceed with planning.');
      }
      
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to fetch places: ' + error.message);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError('');
    setOptimizedRoute(null);

    try {
      const selectedPlaceObjects = places.filter(place => 
        selectedPlaces.includes(place.place_id)
      );

      if (selectedPlaceObjects.length === 0) {
        throw new Error('No places selected for itinerary generation');
      }

      // Try to optimize route first (optional step)
      let optimizedPlaceNames = selectedPlaceObjects.map(place => place.name);
      try {
        const routeResponse = await fetch('/api/travel/optimize-route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            places: selectedPlaceObjects.map(place => place.name),
            startLocation: travelData.source.trim() || null,
          }),
        });

        if (routeResponse.ok) {
          const routeData = await routeResponse.json();
          if (routeData.success && routeData.data && Array.isArray(routeData.data.optimizedRoute)) {
            setOptimizedRoute(routeData.data.optimizedRoute);
            optimizedPlaceNames = routeData.data.optimizedRoute;
          }
        }
      } catch (routeError) {
        console.warn('Route optimization failed, using original order:', routeError);
      }

      // Generate itinerary
      const itineraryPayload = {
        destinations: optimizedPlaceNames,
        duration: dayjs(travelData.returnDate).diff(dayjs(travelData.departureDate), 'day') || 3,
        budget: travelData.budget,
        interests: travelData.description ? [travelData.description] : [],
        travelStyle: 'balanced',
        groupSize: travelData.travelers,
        accessibility: false,
        startDate: travelData.departureDate?.format('YYYY-MM-DD'),
        endDate: travelData.returnDate?.format('YYYY-MM-DD'),
        description: travelData.description
      };

      const itineraryResponse = await fetch('/api/travel/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itineraryPayload)
      });

      const itineraryData = await itineraryResponse.json();

      if (!itineraryResponse.ok) {
        throw new Error(itineraryData.message || `HTTP ${itineraryResponse.status}: Failed to generate itinerary`);
      }

      if (!itineraryData.success) {
        throw new Error(itineraryData.message || 'Failed to generate itinerary');
      }

      // Handle the itinerary data structure
      let processedItinerary = itineraryData.data;
      
      // If the itinerary is in the expected format with days array
      if (processedItinerary && processedItinerary.days) {
        setItinerary(processedItinerary.days);
      } 
      // If it's a direct array of places/locations
      else if (Array.isArray(processedItinerary)) {
        setItinerary(processedItinerary);
      }
      // Create a basic itinerary structure if needed
      else {
        const basicItinerary = selectedPlaceObjects.map((place, index) => ({
          name: place.name,
          details: `Visit ${place.name} and explore its attractions`,
          timing: index === 0 ? '9:00 AM - 12:00 PM' : index === 1 ? '1:00 PM - 4:00 PM' : '5:00 PM - 7:00 PM',
          total_duration: '3 hours',
          famous_activity: 'Sightseeing and photography',
          recommended_transport: 'Walking or taxi',
          formatted_address: place.formatted_address
        }));
        setItinerary(basicItinerary);
      }

      setActiveStep(3);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError('Error generating itinerary: ' + err.message);
      
      // Create a fallback basic itinerary
      try {
        const selectedPlaceObjects = places.filter(place => 
          selectedPlaces.includes(place.place_id)
        );
        
        if (selectedPlaceObjects.length > 0) {
          const fallbackItinerary = selectedPlaceObjects.map((place, index) => ({
            name: place.name,
            details: `Explore ${place.name} - a wonderful ${place.types?.[0]?.replace(/_/g, ' ') || 'destination'} in ${travelData.destination}`,
            timing: `Day ${Math.floor(index / 2) + 1}, ${index % 2 === 0 ? 'Morning' : 'Afternoon'}`,
            total_duration: '2-3 hours',
            famous_activity: 'Sightseeing and exploration',
            recommended_transport: 'Local transport',
            formatted_address: place.formatted_address,
            rating: place.rating
          }));
          
          setItinerary(fallbackItinerary);
          setActiveStep(3);
          setError('Generated basic itinerary. Some features may be limited due to connectivity issues.');
        }
      } catch (fallbackError) {
        console.error('Fallback itinerary creation failed:', fallbackError);
      }
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
                      {(place.photo_url || (place.photos && place.photos.length && typeof place.photos[0] === 'string')) && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={place.photo_url || (typeof place.photos[0] === 'string' ? place.photos[0] : 'https://source.unsplash.com/random/400x300/?travel')}
                          alt={place.name}
                        />
                      )}
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
                          {place.formatted_address || 'N/A'}
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
