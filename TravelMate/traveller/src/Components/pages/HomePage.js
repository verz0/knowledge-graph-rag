import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  IconButton,
  InputAdornment,
  Avatar,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Explore as ExploreIcon,
  Map as MapIcon,
  Chat as ChatIcon,
  Route as RouteIcon,
  TravelExplore as TravelIcon,
  LocationOn as LocationIcon,
  Psychology as SmartIcon,
  AutoAwesome as AIIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Camera as CameraIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const mainFeatures = [
    {
      title: 'Travel Planner',
      description: 'Complete end-to-end travel planning with AI recommendations',
      icon: <TravelIcon sx={{ fontSize: 48 }} />,
      path: '/planner',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Search Places',
      description: 'Discover amazing destinations around the world',
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      path: '/search',
      color: 'info',
      gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    },
    {
      title: 'Create Itinerary',
      description: 'Plan your perfect trip with AI assistance',
      icon: <RouteIcon sx={{ fontSize: 48 }} />,
      path: '/itinerary',
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get personalized travel recommendations',
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      path: '/chat',
      color: 'warning',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  const additionalFeatures = [
    {
      title: 'Knowledge Graph',
      description: 'Explore connections between places and cultures',
      icon: <MapIcon sx={{ fontSize: 32 }} />,
      path: '/knowledge-graph',
      color: 'success',
    },
    {
      title: 'Smart RAG',
      description: 'Advanced search with AI-powered insights',
      icon: <SmartIcon sx={{ fontSize: 32 }} />,
      path: '/rag',
      color: 'info',
    },
  ];

  const quickActions = [
    { icon: <FlightIcon />, text: 'Find Flights', color: 'primary' },
    { icon: <HotelIcon />, text: 'Book Hotels', color: 'secondary' },
    { icon: <RestaurantIcon />, text: 'Local Cuisine', color: 'warning' },
    { icon: <CameraIcon />, text: 'Photo Spots', color: 'success' },
  ];
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/hero.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 20px rgba(255,255,255,0.3)',
                }}
              >
                Welcome to TravelMate
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  opacity: 0.95, 
                  mb: 6, 
                  fontWeight: 300,
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.4,
                }}
              >
                Your AI-powered travel companion for discovering amazing destinations and creating unforgettable experiences
              </Typography>
              
              {/* Enhanced Search Bar */}
              <Slide direction="up" in timeout={1200}>
                <Paper
                  elevation={24}
                  sx={{
                    maxWidth: 700,
                    mx: 'auto',
                    mb: 4,
                    borderRadius: 4,
                    overflow: 'hidden',
                    backdrop: 'blur(20px)',
                    background: alpha(theme.palette.background.paper, 0.95),
                  }}
                >
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: 'none',
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                        '& input': {
                          fontSize: '1.1rem',
                          py: 2,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon sx={{ color: 'primary.main', mr: 1 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              onClick={handleSearch}
                              disabled={!searchQuery.trim()}
                              sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                minWidth: 120,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                              startIcon={<SearchIcon />}
                            >
                              Search
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Paper>
              </Slide>

              {/* Quick Action Chips */}
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={action.text}
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/planner"
                sx={{
                  fontSize: '1.2rem',
                  px: 6,
                  py: 2,
                  borderRadius: 4,
                  background: alpha(theme.palette.background.paper, 0.9),
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': {
                    background: theme.palette.background.paper,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  },
                }}
                endIcon={<ArrowRightIcon />}
              >
                Start Planning Your Trip
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 2,
              }}
            >
              Powerful Travel Tools
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Everything you need to plan, discover, and experience amazing travels
            </Typography>
          </Box>
        </Fade>
        
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <Slide direction="up" in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: feature.gradient || 'background.paper',
                    color: feature.gradient ? 'white' : 'text.primary',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                      borderColor: 'transparent',
                    },
                  }}
                  component={Link}
                  to={feature.path}
                  style={{ textDecoration: 'none' }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: feature.gradient ? 'rgba(255,255,255,0.2)' : `${feature.color}.light`,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        opacity: feature.gradient ? 0.9 : 0.8,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button 
                      size="large" 
                      variant={feature.gradient ? "outlined" : "contained"}
                      color={feature.color}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        fontWeight: 600,
                        ...(feature.gradient && {
                          borderColor: 'rgba(255,255,255,0.5)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }),
                      }}
                      startIcon={<ExploreIcon />}
                    >
                      Explore
                    </Button>
                  </CardActions>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              mb: 6, 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Advanced Features
          </Typography>
          
          <Grid container spacing={4}>
            {additionalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                  component={Link}
                  to={feature.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 3,
                      bgcolor: `${feature.color}.light`,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                  <ArrowRightIcon sx={{ ml: 'auto', color: 'text.secondary' }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Fade in timeout={1200}>
          <Paper
            elevation={8}
            sx={{
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <AIIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Explore?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
              Join thousands of travelers who have discovered their perfect destinations with TravelMate's AI-powered recommendations.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/planner"
              sx={{
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                borderRadius: 4,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  transform: 'translateY(-2px)',
                },
              }}
              endIcon={<TravelIcon />}
            >
              Start Your Journey
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;