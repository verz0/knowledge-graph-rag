import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  Button,
  Chip,
  Rating,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Fade,
  Avatar,
  Skeleton,
  Tooltip,
  ButtonGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  TravelExplore as TravelIcon,
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material';

const UniversalPlaceSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌍' },
    { value: 'city', label: 'Cities', icon: '🏙️' },
    { value: 'landmark', label: 'Landmarks', icon: '🏛️' },
    { value: 'nature', label: 'Nature & Parks', icon: '🌳' },
    { value: 'beach', label: 'Beaches', icon: '🏖️' },
    { value: 'mountain', label: 'Mountains', icon: '⛰️' },
    { value: 'museum', label: 'Museums', icon: '🏛️' },
    { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { value: 'hotel', label: 'Hotels', icon: '🏨' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'culture', label: 'Cultural Sites', icon: '🏛️' },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  useEffect(() => {
    handleSearch();
  }, [searchQuery, category, sortBy, currentPage]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const limit = 10; // Define items per page
      const queryParams = new URLSearchParams({
        q: searchQuery,
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(category !== 'all' && { category }),
        ...(sortBy && { sort: sortBy })
      });

      const response = await fetch(`/api/travel/search?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch search results');
      }

      setResults(data.data.results);
      setTotalPages(Math.ceil(data.data.totalResults / limit)); // Use the limit variable
    } catch (err) {
      setError(err.message || 'Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const handlePlaceClick = async (placeId) => {
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

      // Navigate to place details with the fetched data
      navigate(`/place/${placeId}`, { 
        state: { 
          place: data.data,
          fromSearch: true
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceDetailsClick = async (placeName) => {
    setSelectedPlace(placeName);
    setPlaceDetails(null);
    setDetailsError('');
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/travel/place-info/${encodeURIComponent(placeName)}`);
      const data = await response.json();
      if (data.success) {
        setPlaceDetails(data.data);
      } else {
        setDetailsError(data.message || 'Failed to load place details');
      }
    } catch (err) {
      setDetailsError('Error loading details: ' + err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedPlace(null);
    setPlaceDetails(null);
    setDetailsError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <TravelIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              Discover Amazing Places
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 300 }}>
              Search through thousands of destinations worldwide and find your next adventure
            </Typography>
            
            {/* Enhanced Search and Filters */}
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Paris, Tokyo, Beaches, Museums..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.95)',
                        },
                        '&.Mui-focused': {
                          bgcolor: 'white',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0,0,0,0.7)',
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClear} size="small">
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(0,0,0,0.7)' }}>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.95)',
                        },
                        '&.Mui-focused': {
                          bgcolor: 'white',
                        }
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{cat.icon}</span>
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(0,0,0,0.7)' }}>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.95)',
                        },
                        '&.Mui-focused': {
                          bgcolor: 'white',
                        }
                      }}
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {/* Quick Filter Chips */}
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {categories.slice(1, 7).map((cat) => (
                  <Chip
                    key={cat.value}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{cat.icon}</span>
                        {cat.label}
                      </Box>
                    }
                    variant={category === cat.value ? 'filled' : 'outlined'}
                    onClick={() => setCategory(cat.value)}
                    sx={{
                      bgcolor: category === cat.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      },
                      '&.MuiChip-filled': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Results */}
      {!loading && (
        <Fade in timeout={600}>
          <Box>
            {results.length > 0 && (
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <FilterIcon sx={{ mr: 1 }} />
                {results.length} places found
              </Typography>
            )}
            
            <Grid container spacing={3}>              {results.map((place) => (
                <Grid item xs={12} sm={6} md={4} key={place.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: 'primary.main',
                        '& .place-image': {
                          transform: 'scale(1.05)',
                        },
                        '& .place-overlay': {
                          opacity: 1,
                        }
                      },
                    }}
                    onClick={() => handlePlaceDetailsClick(place.name)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={place.image}
                        alt={place.name}
                        className="place-image"
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                      <Box
                        className="place-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ViewIcon sx={{ color: 'white', fontSize: 40 }} />
                      </Box>
                      <Chip 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>
                              {categories.find(cat => cat.value === place.category)?.icon || '📍'}
                            </span>
                            {categories.find(cat => cat.value === place.category)?.label || place.category}
                          </Box>
                        }
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 1,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {place.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={place.rating || 0} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                          {place.rating || 0} ({place.reviewCount ? place.reviewCount.toLocaleString() : 0})
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph
                        sx={{ 
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {place.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {(place.highlights || []).slice(0, 3).map((highlight, index) => (
                          <Chip
                            key={index}
                            label={highlight}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                              }
                            }}
                          />
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {place.country}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <MoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {place.estimatedCost}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
              {results.length === 0 && !loading && (searchQuery || category !== 'all') && (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  No places found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  We couldn't find any destinations matching your search criteria. Try adjusting your filters or explore different categories to discover amazing places.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleClear}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'white',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }
                      }
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        </Fade>
      )}
      
      <Dialog open={!!selectedPlace} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Place Details: {selectedPlace}</DialogTitle>
        <DialogContent dividers>
          {detailsLoading && <CircularProgress />}
          {detailsError && <Alert severity="error">{detailsError}</Alert>}
          {placeDetails && (
            <Box>
              <Typography variant="h6">Wikipedia Summary</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {placeDetails.wikipedia?.extract || 'No Wikipedia summary available.'}
              </Typography>
              <Typography variant="h6">Additional Info</Typography>
              {placeDetails.wikipedia?.additionalInfo ? (
                <Box>
                  <Typography>Rating: {placeDetails.wikipedia.additionalInfo.rating || 'N/A'}</Typography>
                  <Typography>Address: {placeDetails.wikipedia.additionalInfo.address || 'N/A'}</Typography>
                  <Typography>Types: {(placeDetails.wikipedia.additionalInfo.types || []).join(', ')}</Typography>
                </Box>
              ) : (
                <Typography>No additional info available.</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UniversalPlaceSearch;