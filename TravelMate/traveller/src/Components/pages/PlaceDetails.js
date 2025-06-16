import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [place, setPlace] = useState(location.state?.place || null);
  const [loading, setLoading] = useState(!place);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (place) return; // Use data from navigation state if available

      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/travel/place/${placeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch place details');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch place details');
        }

        setPlace(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId, place]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!place) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Place details not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Search
      </Button>

      <Grid container spacing={4}>
        {/* Image Gallery */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'relative',
              height: 400,
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            {place.images && place.images[selectedImage] ? (
              <CardMedia
                component="img"
                image={place.images[selectedImage]}
                alt={place.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No image available
                </Typography>
              </Box>
            )}
            <IconButton
              onClick={toggleFavorite}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
              }}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Paper>

          {/* Thumbnail Gallery */}
          {place.images && place.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
              {place.images.map((image, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    width: 100,
                    height: 60,
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid primary.main' : 'none',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`${place.name} - Image ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Paper>
              ))}
            </Box>
          )}
        </Grid>

        {/* Place Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {place.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={place.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({place.rating})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {place.highlights?.map((highlight, index) => (
                <Chip
                  key={index}
                  label={highlight}
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'white' }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                {place.city}, {place.country}
              </Typography>
            </Box>

            {place.estimatedCost && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Estimated Cost: {place.estimatedCost}
                </Typography>
              </Box>
            )}

            {place.openingHours && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {place.openingHours}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {place.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Additional Information Tabs */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Overview" />
              <Tab label="Best Time to Visit" />
              <Tab label="Tips & Recommendations" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    About {place.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {place.description}
                  </Typography>
                  {place.metadata?.culturalSignificance && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Cultural Significance
                      </Typography>
                      <Typography variant="body1">
                        {place.metadata.culturalSignificance}
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Best Time to Visit
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {place.bestTimeToVisit || 'Information about the best time to visit is not available.'}
                  </Typography>
                  {place.metadata?.visitingInfo && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Visiting Information
                      </Typography>
                      <Typography variant="body1">
                        {place.metadata.visitingInfo}
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tips & Recommendations
                  </Typography>
                  {place.metadata?.accessibility && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Accessibility
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {place.metadata.accessibility}
                      </Typography>
                    </>
                  )}
                  {place.tags && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {place.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ bgcolor: 'grey.200' }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlaceDetails;