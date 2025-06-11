import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Map as MapIcon,
  Chat as ChatIcon,
  Psychology as SmartIcon,
  Route as RouteIcon,
  Close as CloseIcon,
  TravelExplore as TravelIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Search Places', path: '/search', icon: <SearchIcon /> },
    { text: 'Travel Planner', path: '/planner', icon: <TravelIcon /> },
    { text: 'Create Itinerary', path: '/itinerary', icon: <RouteIcon /> },
    { text: 'Knowledge Graph', path: '/knowledge-graph', icon: <MapIcon /> },
    { text: 'Smart RAG', path: '/rag', icon: <SmartIcon /> },
    { text: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <TravelIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            TravelMate
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 2 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 500 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                <TravelIcon />
              </Avatar>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  letterSpacing: '-0.025em',
                }}
              >
                TravelMate
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Tooltip key={item.text} title={item.text} arrow>
                    <Button
                      color="inherit"
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      variant={location.pathname === item.path ? 'contained' : 'text'}
                      sx={{
                        color: location.pathname === item.path ? 'white' : 'text.primary',
                        backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        minWidth: 'auto',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        '&:hover': {
                          backgroundColor: location.pathname === item.path ? 'primary.dark' : 'primary.light',
                          color: 'white',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {item.text}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 20px 20px 0',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
