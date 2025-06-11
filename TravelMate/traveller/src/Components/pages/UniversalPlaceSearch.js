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
  const [viewMode, setViewMode] = useState('grid');  const categories = [
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

  // Mock search results
  const mockResults = [
    {
      id: 'paris',
      name: 'Paris, France',
      description: 'The City of Light, known for its art, fashion, gastronomy and culture',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
      rating: 4.8,
      reviewCount: 15420,
      category: 'city',
      country: 'France',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
      estimatedCost: '$150-300/day'
    },
    {
      id: 'tokyo',
      name: 'Tokyo, Japan',
      description: 'A bustling metropolis blending ultra-modern and traditional',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      rating: 4.7,
      reviewCount: 12850,
      category: 'city',
      country: 'Japan',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree'],
      estimatedCost: '$120-250/day'
    },
    {
      id: 'santorini',
      name: 'Santorini, Greece',
      description: 'Stunning Greek island with white buildings and blue domes',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
      rating: 4.9,
      reviewCount: 8950,
      category: 'nature',
      country: 'Greece',
      highlights: ['Oia Sunset', 'Blue Domes', 'Volcanic Beaches'],
      estimatedCost: '$100-200/day'
    },
    {
      id: 'bali',
      name: 'Bali, Indonesia',
      description: 'Tropical paradise with temples, beaches, and rice terraces',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      rating: 4.6,
      reviewCount: 11200,
      category: 'beach',
      country: 'Indonesia',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot', 'Seminyak Beach'],
      estimatedCost: '$50-120/day'
    },
    {
      id: 'machu-picchu',
      name: 'Machu Picchu, Peru',
      description: 'Ancient Incan citadel set high in the Andes Mountains',
      image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
      rating: 4.8,
      reviewCount: 6780,
      category: 'culture',
      country: 'Peru',
      highlights: ['Huayna Picchu', 'Sun Gate', 'Inca Trail'],
      estimatedCost: '$80-150/day'
    },
    {
      id: 'iceland',
      name: 'Reykjavik, Iceland',
      description: 'Land of fire and ice with stunning natural phenomena',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d68311?w=400',
      rating: 4.7,
      reviewCount: 5420,
      category: 'nature',
      country: 'Iceland',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Golden Circle'],
      estimatedCost: '$200-400/day'
    }
  ];

  useEffect(() => {
    handleSearch();
  }, [searchQuery, category, sortBy, currentPage]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredResults = mockResults;
      
      // Filter by search query
      if (searchQuery.trim()) {
        filteredResults = filteredResults.filter(place =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by category
      if (category !== 'all') {
        filteredResults = filteredResults.filter(place => place.category === category);
      }
      
      // Sort results
      filteredResults.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'popularity':
          default:
            return b.reviewCount - a.reviewCount;
        }
      });
      
      setResults(filteredResults);
      setTotalPages(Math.ceil(filteredResults.length / 6));
    } catch (err) {
      setError('Failed to search places. Please try again.');
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

  const handlePlaceClick = (placeId) => {
    navigate(`/place/${placeId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>      {/* Header */}
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
                    onClick={() => handlePlaceClick(place.id)}
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
                        <Rating value={place.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                          {place.rating} ({place.reviewCount.toLocaleString()})
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
                        {place.highlights.slice(0, 3).map((highlight, index) => (
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
    </Container>
  );
};

export default UniversalPlaceSearch;