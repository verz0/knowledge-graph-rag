import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
  Alert,
  Skeleton,
  Fade,
  MenuItem,
  IconButton,
  InputAdornment,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ButtonGroup,
  Zoom,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountTree as GraphIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
  Hub as HubIcon,
  Memory as MemoryIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  Attractions as AttractionsIcon,
  TheaterComedy as CultureIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Explore as ExploreIcon,
  AutoGraph as AutoGraphIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const KnowledgeGraph = () => {
  const [searchType, setSearchType] = useState('');
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [viewMode, setViewMode] = useState('overview');

  const entityTypes = [
    { value: '', label: 'All Types', icon: <PublicIcon />, color: 'primary' },
    { value: 'Place', label: 'Places', icon: <LocationIcon />, color: 'success' },
    { value: 'City', label: 'Cities', icon: <PublicIcon />, color: 'info' },
    { value: 'Culture', label: 'Culture', icon: <CultureIcon />, color: 'warning' },
    { value: 'Architecture', label: 'Architecture', icon: <AttractionsIcon />, color: 'error' },
    { value: 'Art', label: 'Art', icon: <CultureIcon />, color: 'secondary' },
    { value: 'Religion', label: 'Religion', icon: <CultureIcon />, color: 'primary' },
    { value: 'Period', label: 'Historical Periods', icon: <TimelineIcon />, color: 'info' },
  ];

  const mockEntities = [
    {
      id: 1,
      name: 'Eiffel Tower',
      type: 'Place',
      description: 'Iconic iron lattice tower in Paris, France',
      connections: ['Paris', 'French Architecture', 'Gustave Eiffel', 'Iron Age'],
      properties: {
        built: '1889',
        height: '324m',
        location: 'Paris, France',
        style: 'Iron Architecture'
      }
    },
    {
      id: 2,
      name: 'Paris',
      type: 'City',
      description: 'Capital city of France, known for art, fashion, and culture',
      connections: ['France', 'French Culture', 'Eiffel Tower', 'Louvre Museum'],
      properties: {
        population: '2.2M',
        founded: '3rd century BC',
        region: 'Île-de-France',
        river: 'Seine'
      }
    },
    {
      id: 3,
      name: 'French Culture',
      type: 'Culture',
      description: 'Rich cultural heritage of France including art, cuisine, and philosophy',
      connections: ['France', 'French Cuisine', 'French Art', 'Enlightenment'],
      properties: {
        language: 'French',
        cuisine: 'French',
        traditions: 'Various',
        influence: 'Global'
      }
    },
    {
      id: 4,
      name: 'Gothic Architecture',
      type: 'Architecture',
      description: 'Architectural style that flourished during the medieval period',
      connections: ['Notre-Dame', 'Medieval Period', 'Cathedral Architecture'],
      properties: {
        period: '12th-16th century',
        characteristics: 'Pointed arches, ribbed vaults',
        origin: 'France',
        influence: 'European'
      }
    }
  ];

  const handleSearch = async () => {
    if (!searchType && !searchName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams({
        ...(searchType && { type: searchType }),
        ...(searchName.trim() && { q: searchName.trim() })
      });

      const response = await fetch(`/api/travel/knowledge?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch knowledge graph data');
      }

      setGraphData(data.data.entities);
      setViewMode('results');
    } catch (err) {
      setError(err.message || 'Failed to fetch knowledge graph data');
      setGraphData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEntitySelect = async (entity) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/travel/knowledge/${entity.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch entity details');
      }

      setSelectedEntity(data.data);
      setViewMode('detail');
    } catch (err) {
      setError(err.message || 'Failed to fetch entity details');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchType('');
    setSearchName('');
    setGraphData([]);
    setSelectedEntity(null);
    setViewMode('overview');
  };

  const getEntityIcon = (type) => {
    const entityType = entityTypes.find(et => et.value === type);
    return entityType ? entityType.icon : <HubIcon />;
  };

  const getEntityColor = (type) => {
    const entityType = entityTypes.find(et => et.value === type);
    return entityType ? entityType.color : 'primary';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
                <AutoGraphIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Knowledge Graph Explorer
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, mb: 3 }}>
                Discover the interconnected world of travel destinations, cultures, and experiences
              </Typography>
              
              {/* Search Interface */}
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Entity Type"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                          borderRadius: 3,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                          '&.Mui-focused': { bgcolor: 'white' }
                        }
                      }}
                    >
                      {entityTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Search by Name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="e.g., Eiffel Tower, French Culture..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                          borderRadius: 3,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                          '&.Mui-focused': { bgcolor: 'white' }
                        }
                      }}
                      InputProps={{
                        endAdornment: searchName && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setSearchName('')} size="small">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <ButtonGroup fullWidth>
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={!searchType && !searchName.trim() || loading}
                        startIcon={loading ? null : <SearchIcon />}
                        sx={{
                          height: 56,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                      >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
                      </Button>
                      {(searchType || searchName || graphData.length > 0) && (
                        <Button
                          variant="outlined"
                          onClick={handleClear}
                          sx={{
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(255,255,255,0.5)',
                              bgcolor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          <ClearIcon />
                        </Button>
                      )}
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <Fade in timeout={800}>
            <Box>
              <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
                  Knowledge Graph Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ textAlign: 'center', p: 3, border: '1px solid', borderColor: 'divider' }}>
                      <MemoryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {mockEntities.length}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">Total Entities</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ textAlign: 'center', p: 3, border: '1px solid', borderColor: 'divider' }}>
                      <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {mockEntities.reduce((total, entity) => total + entity.connections.length, 0)}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">Total Connections</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ textAlign: 'center', p: 3, border: '1px solid', borderColor: 'divider' }}>
                      <CategoryIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {entityTypes.length - 1}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">Entity Types</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}>
                Explore by Entity Type
              </Typography>
              <Grid container spacing={3}>
                {entityTypes.slice(1).map((entityType, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                          borderColor: `${entityType.color}.main`,
                        }
                      }}
                      onClick={() => {
                        setSearchType(entityType.value);
                        handleSearch();
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: `${entityType.color}.light`,
                            color: `${entityType.color}.main`,
                          }}
                        >
                          {entityType.icon}
                        </Avatar>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {entityType.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mockEntities.filter(e => e.type === entityType.value).length} entities
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Results Mode */}
        {viewMode === 'results' && graphData.length > 0 && (
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Search Results ({graphData.length} entities found)
              </Typography>
              <Grid container spacing={3}>
                {graphData.map((entity) => (
                  <Grid item xs={12} md={6} lg={4} key={entity.id}>
                    <Card 
                      elevation={0}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: 'primary.main',
                        }
                      }}
                      onClick={() => handleEntitySelect(entity)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: `${getEntityColor(entity.type)}.light`,
                              color: `${getEntityColor(entity.type)}.main`,
                              mr: 2,
                            }}
                          >
                            {getEntityIcon(entity.type)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {entity.name}
                            </Typography>
                            <Chip
                              label={entity.type}
                              size="small"
                              icon={getEntityIcon(entity.type)}
                              color={getEntityColor(entity.type)}
                              sx={{ mr: 1 }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {entity.description}
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Connected to:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {entity.connections.slice(0, 3).map((connection, idx) => (
                            <Chip
                              key={idx}
                              label={connection}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {entity.connections.length > 3 && (
                            <Chip
                              label={`+${entity.connections.length - 3} more`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Detail Mode */}
        {viewMode === 'detail' && selectedEntity && (
          <Fade in timeout={800}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setViewMode('results')}
                sx={{ mb: 3 }}
              >
                Back to Results
              </Button>
              
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: `${getEntityColor(selectedEntity.type)}.light`,
                      color: `${getEntityColor(selectedEntity.type)}.main`,
                      mr: 3,
                    }}
                  >
                    {getEntityIcon(selectedEntity.type)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {selectedEntity.name}
                    </Typography>
                    <Chip
                      label={selectedEntity.type}
                      size="small"
                      icon={getEntityIcon(selectedEntity.type)}
                      color={getEntityColor(selectedEntity.type)}
                      sx={{ mr: 1 }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                  {selectedEntity.description}
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Properties
                    </Typography>
                    <List>
                      {Object.entries(selectedEntity.properties).map(([key, value]) => (
                        <ListItem key={key} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <AnalyticsIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={key.charAt(0).toUpperCase() + key.slice(1)}
                            secondary={value}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Connections ({selectedEntity.connections.length})
                    </Typography>
                    <List>
                      {selectedEntity.connections.map((connection, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <HubIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={connection} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Fade>
        )}

        {/* No Results */}
        {viewMode === 'results' && graphData.length === 0 && !loading && (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <ExploreIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
              No entities found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Try adjusting your search criteria or explore different entity types.
            </Typography>
            <Button variant="contained" onClick={handleClear}>
              Reset Search
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default KnowledgeGraph;
