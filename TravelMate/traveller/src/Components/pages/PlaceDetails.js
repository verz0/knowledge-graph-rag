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
import {  LocationOn as LocationIcon,
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
          // Add more mock places as needed
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

    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId]);
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 4, mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="80%" height={60} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={100} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Container>
    );
  }

  if (!place) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>Place not found</Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header with Back Button */}
        <Fade in timeout={600}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ 
                mr: 2,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Back
            </Button>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {place.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={toggleFavorite} color={isFavorite ? 'error' : 'default'}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton color="primary">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Fade>

        {/* Hero Image Section */}
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              mb: 4,
              position: 'relative',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="500"
                image={place.images[selectedImage]}
                alt={place.name}
                sx={{ 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  p: 3,
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={place.rating} precision={0.1} readOnly sx={{ mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {place.rating} ({place.reviewCount.toLocaleString()} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {place.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            
            {/* Image Gallery Thumbnails */}
            {place.images.length > 1 && (
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <ImageList sx={{ height: 80 }} cols={6} rowHeight={80}>
                  {place.images.map((image, index) => (
                    <ImageListItem 
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: selectedImage === index ? '3px solid' : '1px solid',
                        borderColor: selectedImage === index ? 'primary.main' : 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                        }
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${place.name} ${index + 1}`}
                        loading="lazy"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Paper>
        </Fade>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Details */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                {/* Tabs */}
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    mb: 3,
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }
                  }}
                >
                  <Tab label="Overview" icon={<InfoIcon />} iconPosition="start" />
                  <Tab label="Attractions" icon={<AttractionsIcon />} iconPosition="start" />
                  <Tab label="Tips" icon={<TipsIcon />} iconPosition="start" />
                  <Tab label="Photos" icon={<PhotoIcon />} iconPosition="start" />
                </Tabs>

                {/* Tab Content */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                      {place.longDescription || place.description}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                      🌟 Highlights
                    </Typography>
                    <Grid container spacing={2}>
                      {place.highlights.map((highlight, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <StarIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">{highlight}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      🎯 Top Attractions
                    </Typography>
                    <Grid container spacing={3}>
                      {place.attractions.map((attraction, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card 
                            elevation={0}
                            sx={{ 
                              border: '1px solid', 
                              borderColor: 'divider',
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: 'primary.main',
                                transform: 'translateY(-4px)',
                                boxShadow: 3,
                              }
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {attraction.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Rating value={attraction.rating} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  {attraction.rating}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {attraction.description}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                  <Typography variant="body2">{attraction.estimatedTime}</Typography>
                                </Box>
                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                                  {attraction.ticketPrice}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      💡 Insider Tips
                    </Typography>
                    <List>
                      {place.tips.map((tip, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <TipsIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={tip}
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                lineHeight: 1.6
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      📸 Photo Gallery
                    </Typography>
                    <ImageList variant="masonry" cols={3} gap={8}>
                      {place.images.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            alt={`${place.name} ${index + 1}`}
                            loading="lazy"
                            style={{ borderRadius: 8 }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>

          {/* Right Column - Quick Info */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={1200}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  📍 Quick Info
                </Typography>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Location" secondary={`${place.location.country}, ${place.location.continent}`} />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><ClimateIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Best Time to Visit" 
                      secondary={place.bestTimeToVisit.season}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><MoneyIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Budget Range" 
                      secondary={`${place.costs.budget} - ${place.costs.luxury}`}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><LanguageIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Languages" 
                      secondary={place.practical.languages.join(', ')}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><TimeIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Currency" 
                      secondary={place.practical.currency}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Fade>

            {/* Action Buttons */}
            <Fade in timeout={1400}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  🚀 Plan Your Trip
                </Typography>
                
                <ButtonGroup orientation="vertical" fullWidth sx={{ gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FlightIcon />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                      }
                    }}
                  >
                    Book Flight
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<HotelIcon />}
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    Find Hotels
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<MapIcon />}
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    View on Map
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RestaurantIcon />}
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    Find Restaurants
                  </Button>
                </ButtonGroup>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ position: 'relative', height: 300 }}>
          <CardMedia
            component="img"
            height="300"
            image={place.images[0]}
            alt={place.name}
            sx={{ objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
              p: 3,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
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
                  secondary={place.languages.join(', ')} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Currency" 
                  secondary={place.currency} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Time Zone" 
                  secondary={place.timeZone} 
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
                  secondary={place.bestTimeToVisit} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <OfferIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Average Cost" 
                  secondary={place.averageCost} 
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