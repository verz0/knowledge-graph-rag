import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Button,
  Chip,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
  Avatar,
  Fade,
  Skeleton,
  ImageList,
  ImageListItem,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  WbSunny as ClimateIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon,
  Camera as CameraIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  DirectionsTransit as TransitIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Map as MapIcon,
  FlightTakeoff as FlightIcon,
  TipsAndUpdates as TipsIcon,
  Attractions as AttractionsIcon,
  PhotoLibrary as PhotoIcon,
} from '@mui/icons-material';

const PlaceDetails = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Enhanced mock place data based on placeId
        const mockPlaces = {
          paris: {
            id: 'paris',
            name: 'Paris, France',
            description: 'The City of Light, known for its art, fashion, gastronomy, and culture. Paris is one of the most visited cities in the world, offering an enchanting blend of historic landmarks, world-class museums, charming neighborhoods, and culinary excellence.',
            longDescription: 'Paris, the capital of France, is a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.',
            images: [
              'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
              'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800',
              'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800',
              'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
              'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=800',
              'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'
            ],
            rating: 4.8,
            reviewCount: 15420,
            category: 'City',
            tags: ['Culture', 'Art', 'Romance', 'Architecture', 'Fashion', 'Cuisine'],
            location: {
              country: 'France',
              continent: 'Europe',
              coordinates: '48.8566° N, 2.3522° E',
              nearbyAirports: ['Charles de Gaulle (CDG)', 'Orly (ORY)']
            },
            highlights: [
              'Eiffel Tower - Iconic iron lattice tower',
              'Louvre Museum - World\'s largest art museum',
              'Notre-Dame Cathedral - Gothic masterpiece',
              'Champs-Élysées - Famous avenue',
              'Montmartre - Artistic hilltop district',
              'Seine River Cruise - Scenic waterway journey'
            ],
            bestTimeToVisit: {
              season: 'Spring & Fall',
              months: 'April to June, September to October',
              weather: 'Mild temperatures, fewer crowds, beautiful scenery'
            },
            costs: {
              budget: '$80-150/day',
              midRange: '$150-300/day',
              luxury: '$300+/day',
              averageMeal: '$15-40',
              hotelRange: '$60-400/night'
            },
            practical: {
              languages: ['French', 'English (tourist areas)'],
              currency: 'Euro (EUR)',
              timeZone: 'Central European Time (CET)',
              voltage: '220V',
              emergencyNumber: '112'
            },
            attractions: [
              {
                name: 'Eiffel Tower',
                description: 'Iconic iron lattice tower and symbol of Paris, offering breathtaking city views',
                rating: 4.6,
                estimatedTime: '2-3 hours',
                ticketPrice: '€25-€65',
                category: 'Landmark'
              },
              {
                name: 'Louvre Museum',
                description: 'World\'s largest art museum housing the Mona Lisa and countless masterpieces',
                rating: 4.7,
                estimatedTime: '3-4 hours',
                ticketPrice: '€17',
                category: 'Museum'
              },
              {
                name: 'Notre-Dame Cathedral',
                description: 'Medieval Catholic cathedral with stunning Gothic architecture',
                rating: 4.5,
                estimatedTime: '1-2 hours',
                ticketPrice: 'Free',
                category: 'Religious'
              },
              {
                name: 'Arc de Triomphe',
                description: 'Triumphal arch honoring those who fought for France',
                rating: 4.4,
                estimatedTime: '1 hour',
                ticketPrice: '€13',
                category: 'Monument'
              }
            ],
            tips: [
              'Book museum tickets online in advance to skip long queues',
              'Try authentic French pastries at local boulangeries',
              'Use the efficient Metro system for transportation',
              'Learn basic French phrases - locals appreciate the effort',
              'Visit popular attractions early morning or late afternoon',
              'Explore lesser-known neighborhoods like Le Marais',
              'Enjoy a picnic along the Seine River banks'
            ],
            transportation: {
              airport: 'CDG/Orly to city center: RER B train or taxi',
              metro: 'Extensive subway system covering the entire city',
              bike: 'Vélib bike-sharing system available',
              walking: 'Most attractions are within walking distance'
            }
          },
          default: {
            id: placeId,
            name: `${placeId.charAt(0).toUpperCase() + placeId.slice(1)} Destination`,
            description: 'A beautiful destination waiting to be explored.',
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
            rating: 4.5,
            reviewCount: 1000,
            category: 'Destination',
            tags: ['Adventure', 'Culture'],
            location: { country: 'Unknown', continent: 'Unknown', coordinates: 'Unknown' },
            highlights: ['Amazing views', 'Rich culture', 'Great food'],
            bestTimeToVisit: { season: 'Year-round', months: 'All year', weather: 'Pleasant' },
            costs: { budget: '$50-100/day', midRange: '$100-200/day', luxury: '$200+/day' },
            practical: { languages: ['Local language'], currency: 'Local currency', timeZone: 'Local time' },
            attractions: [],
            tips: ['Plan ahead', 'Respect local customs', 'Try local cuisine'],
            transportation: { metro: 'Public transport available' }
          }
        };
        
        const selectedPlace = mockPlaces[placeId] || mockPlaces.default;        
        setPlace(selectedPlace);
      } catch (err) {
        setError('Failed to load place details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!place) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Place not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
      </Box>

      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
          height: { xs: '300px', md: '500px' }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${place.images[selectedImage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
            }
          }}
        />
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 4,
            color: 'white'
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {place.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={place.rating} precision={0.1} readOnly sx={{ color: 'gold' }} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {place.rating} ({place.reviewCount.toLocaleString()} reviews)
              </Typography>
            </Box>
            <Chip label={place.category} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              About {place.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {place.description}
            </Typography>
          </Paper>

          {/* Highlights */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Must-See Highlights
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {place.highlights.map((highlight, index) => (
                <Chip
                  key={index}
                  label={highlight}
                  icon={<StarIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          {/* Top Attractions */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Top Attractions
            </Typography>
            <Grid container spacing={2}>
              {place.attractions.map((attraction, index) => (
                <Grid item xs={12} key={index}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {attraction.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={attraction.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {attraction.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {attraction.description}
                    </Typography>
                    <Chip
                      icon={<TimeIcon />}
                      label={`Est. time: ${attraction.estimatedTime}`}
                      size="small"
                      variant="outlined"
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Travel Tips */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Travel Tips
            </Typography>
            <List>
              {place.tips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Location Info */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Location Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={`${place.location.country}, ${place.location.continent}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Languages" 
                  secondary={place.practical.languages.join(', ')} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Currency" 
                  secondary={place.practical.currency} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Time Zone" 
                  secondary={place.practical.timeZone} 
                />
              </ListItem>
            </List>
          </Paper>

          {/* Visit Planning */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Planning Your Visit
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ClimateIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Best Time to Visit" 
                  secondary={`${place.bestTimeToVisit.season} (${place.bestTimeToVisit.months})`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <OfferIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Average Cost" 
                  secondary={place.costs.midRange} 
                />
              </ListItem>
            </List>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="contained" startIcon={<HotelIcon />} fullWidth>
                Find Hotels
              </Button>
              <Button variant="outlined" startIcon={<RestaurantIcon />} fullWidth>
                Restaurants
              </Button>
              <Button variant="outlined" startIcon={<TransitIcon />} fullWidth>
                Transportation
              </Button>
              <Button variant="outlined" startIcon={<CameraIcon />} fullWidth>
                Photo Gallery
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlaceDetails;