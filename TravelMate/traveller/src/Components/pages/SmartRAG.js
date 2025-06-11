import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  Clear as ClearIcon,
  TravelExplore as TravelIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
  Tune as TuneIcon,
  Speed as SpeedIcon,
  Stars as StarsIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

const SmartRAG = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('destinations');
  const [recentSearches, setRecentSearches] = useState([
    'Best romantic destinations',
    'Adventure travel Asia',
    'Budget backpacking Europe',
    'Family-friendly beaches'
  ]);

  const searchModes = [
    { value: 'destinations', label: 'Destinations', icon: <LocationIcon /> },
    { value: 'experiences', label: 'Experiences', icon: <StarsIcon /> },
    { value: 'tips', label: 'Travel Tips', icon: <LightbulbIcon /> },
    { value: 'planning', label: 'Trip Planning', icon: <ScheduleIcon /> },
  ];

  const quickQueries = [
    { text: 'Best destinations for solo travelers', category: 'destinations' },
    { text: 'Cheapest countries to visit in 2025', category: 'destinations' },
    { text: 'Most romantic honeymoon spots', category: 'destinations' },
    { text: 'Adventure activities in New Zealand', category: 'experiences' },
    { text: 'Food tours in Southeast Asia', category: 'experiences' },
    { text: 'Photography spots in Iceland', category: 'experiences' },
    { text: 'How to pack light for long trips', category: 'tips' },
    { text: 'Avoid tourist traps and find authentic experiences', category: 'tips' },
    { text: 'Digital nomad visa requirements', category: 'tips' },
    { text: 'Plan a 2-week Europe itinerary', category: 'planning' },
    { text: 'Best travel insurance options', category: 'planning' },
    { text: 'How to find cheap flights', category: 'planning' },
  ];
  const handleSearch = async (searchQuery = null) => {
    const queryText = searchQuery || query.trim();
    if (!queryText) return;

    setLoading(true);
    setError('');
    
    // Add to recent searches
    if (!recentSearches.includes(queryText)) {
      setRecentSearches(prev => [queryText, ...prev.slice(0, 7)]);
    }
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
      
      // Enhanced mock suggestions based on query and mode
      const mockSuggestions = generateMockSuggestions(queryText, searchMode);
      setSuggestions(mockSuggestions);
      
    } catch (err) {
      setError('Failed to fetch suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSuggestions = (queryText, mode) => {
    const baseData = {
      destinations: [
        {
          title: 'Paris, France',
          description: 'The City of Light offers iconic landmarks like the Eiffel Tower, world-class museums, and charming streets perfect for romantic walks. Experience French cuisine, art, and culture in this timeless destination.',
          relevance: 98,
          highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River', 'Montmartre', 'French Cuisine'],
          category: 'City',
          rating: 4.8,
          cost: '€€€',
          bestTime: 'Apr-Jun, Sep-Oct',
          image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300'
        },
        {
          title: 'Bali, Indonesia',
          description: 'A tropical paradise combining stunning beaches, ancient temples, lush rice terraces, and vibrant culture. Perfect for relaxation, adventure, and spiritual experiences.',
          relevance: 95,
          highlights: ['Ubud Rice Terraces', 'Temple Hopping', 'Beach Clubs', 'Yoga Retreats', 'Local Markets'],
          category: 'Island',
          rating: 4.7,
          cost: '€€',
          bestTime: 'May-Sep',
          image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300'
        },
        {
          title: 'Tokyo, Japan',
          description: 'A fascinating blend of ultra-modern technology and traditional culture. Experience cutting-edge innovation alongside ancient temples, incredible cuisine, and unique neighborhoods.',
          relevance: 92,
          highlights: ['Shibuya Crossing', 'Traditional Temples', 'Sushi Culture', 'Cherry Blossoms', 'Tech Districts'],
          category: 'Metropolis',
          rating: 4.9,
          cost: '€€€€',
          bestTime: 'Mar-May, Sep-Nov',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300'
        }
      ],
      experiences: [
        {
          title: 'Northern Lights in Iceland',
          description: 'Witness the magical Aurora Borealis dancing across the Arctic sky. Combine with glacier hiking, hot springs, and dramatic landscapes for an unforgettable adventure.',
          relevance: 96,
          highlights: ['Aurora Viewing', 'Blue Lagoon', 'Glacier Hiking', 'Midnight Sun', 'Geothermal Pools'],
          category: 'Natural Phenomenon',
          rating: 4.9,
          cost: '€€€€',
          bestTime: 'Sep-Mar'
        },
        {
          title: 'Safari in Kenya',
          description: 'Experience the African wilderness with the Great Migration, Big Five encounters, and stunning savanna landscapes. A life-changing wildlife adventure.',
          relevance: 94,
          highlights: ['Great Migration', 'Big Five', 'Maasai Culture', 'Balloon Safari', 'Savanna Landscapes'],
          category: 'Wildlife',
          rating: 4.8,
          cost: '€€€',
          bestTime: 'Jul-Oct'
        }
      ],
      tips: [
        {
          title: 'Master the Art of Light Packing',
          description: 'Learn proven strategies to travel with just a carry-on while having everything you need. Save money, time, and hassle with these expert packing techniques.',
          relevance: 97,
          highlights: ['Versatile Clothing', 'Packing Cubes', 'Multipurpose Items', 'Laundry Strategy', 'Weight Limits'],
          category: 'Practical',
          difficulty: 'Beginner'
        },
        {
          title: 'Find Authentic Local Experiences',
          description: 'Discover how to connect with locals, find hidden gems, and experience destinations like a resident rather than a tourist.',
          relevance: 93,
          highlights: ['Local Networks', 'Community Events', 'Neighborhood Guides', 'Language Tips', 'Cultural Etiquette'],
          category: 'Cultural',
          difficulty: 'Intermediate'
        }
      ],
      planning: [
        {
          title: '2-Week Southeast Asia Itinerary',
          description: 'A comprehensive guide to exploring Thailand, Vietnam, and Cambodia in two weeks. Perfect balance of culture, adventure, and relaxation.',
          relevance: 95,
          highlights: ['Bangkok Markets', 'Angkor Wat', 'Ha Long Bay', 'Street Food Tours', 'Temple Hopping'],
          category: 'Multi-Country',
          duration: '14 days',
          budget: '$1,200-2,500'
        }
      ]
    };

    return baseData[mode] || baseData.destinations;
  };

  const handleQuickQuery = (queryText) => {
    setQuery(queryText);
    handleSearch(queryText);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setError('');
  };

  const handleModeChange = (newMode) => {
    setSearchMode(newMode);
    if (suggestions.length > 0) {
      handleSearch(query);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4, 
              textAlign: 'center', 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <PsychologyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Smart Travel Intelligence
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, mb: 3 }}>
                AI-powered travel recommendations and insights tailored just for you
              </Typography>
              
              {/* Search Mode Selector */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ButtonGroup variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                  {searchModes.map((mode) => (
                    <Button
                      key={mode.value}
                      onClick={() => handleModeChange(mode.value)}
                      startIcon={mode.icon}
                      sx={{
                        bgcolor: searchMode === mode.value ? 'rgba(255,255,255,0.3)' : 'transparent',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                        }
                      }}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              {/* Enhanced Search Bar */}
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <TextField
                  fullWidth
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search for ${searchModes.find(m => m.value === searchMode)?.label.toLowerCase()}...`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)',
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {query && (
                          <IconButton onClick={clearSearch} size="small">
                            <ClearIcon />
                          </IconButton>
                        )}
                        <Button
                          variant="contained"
                          onClick={() => handleSearch()}
                          disabled={!query.trim() || loading}
                          sx={{
                            ml: 1,
                            borderRadius: 3,
                            minWidth: 100,
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          }}
                        >
                          {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        <Grid container spacing={4}>
          {/* Left Column - Search Results */}
          <Grid item xs={12} md={8}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {loading && (
              <Fade in>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Analyzing your request...</Typography>
                  </Box>
                  <LinearProgress sx={{ mb: 2, borderRadius: 2, height: 6 }} />
                  <Typography variant="body2" color="text.secondary">
                    Our AI is processing travel data and finding the best recommendations for you.
                  </Typography>
                </Paper>
              </Fade>
            )}

            {suggestions.length > 0 && !loading && (
              <Fade in timeout={800}>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Smart Recommendations
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {suggestions.map((suggestion, index) => (
                      <Grid item xs={12} key={index}>
                        <Card 
                          elevation={0}
                          sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-4px)',
                              boxShadow: 3,
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {suggestion.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={`${suggestion.relevance}% match`}
                                  size="small"
                                  color="success"
                                  sx={{ fontWeight: 600 }}
                                />
                                {suggestion.rating && (
                                  <Chip 
                                    label={`★ ${suggestion.rating}`}
                                    size="small"
                                    sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                              {suggestion.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {suggestion.highlights.map((highlight, idx) => (
                                <Chip
                                  key={idx}
                                  label={highlight}
                                  size="small"
                                  variant="outlined"
                                  sx={{
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
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                {suggestion.cost && (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {suggestion.cost}
                                    </Typography>
                                  </Box>
                                )}
                                {suggestion.bestTime && (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {suggestion.bestTime}
                                    </Typography>
                                  </Box>
                                )}
                                {suggestion.duration && (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {suggestion.duration}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              
                              <Button 
                                variant="contained" 
                                size="small"
                                sx={{ borderRadius: 3 }}
                              >
                                Learn More
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}

            {suggestions.length === 0 && !loading && !error && (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <InsightsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Ready to Explore?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Enter your travel interests above to get personalized AI-powered recommendations and insights.
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Quick Actions & Recent */}
          <Grid item xs={12} md={4}>
            {/* Quick Queries */}
            <Fade in timeout={1000}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Popular Queries
                </Typography>
                <List dense>
                  {quickQueries
                    .filter(q => q.category === searchMode)
                    .slice(0, 4)
                    .map((quickQuery, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      onClick={() => handleQuickQuery(quickQuery.text)}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'white',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <SpeedIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={quickQuery.text}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Fade in timeout={1200}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Recent Searches
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recentSearches.slice(0, 6).map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        variant="outlined"
                        onClick={() => handleQuickQuery(search)}
                        sx={{
                          justifyContent: 'flex-start',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Fade>
            )}
          </Grid>
        </Grid>      </Container>
    </Box>
  );
};

export default SmartRAG;