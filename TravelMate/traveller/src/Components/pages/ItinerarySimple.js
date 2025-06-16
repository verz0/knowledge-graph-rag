import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import apiService from '../../services/apiService';

// Fallback sample itinerary
const sampleItinerary = [
  { day: 1, activities: ['City tour', 'Museum visit', 'Local dinner'] },
  { day: 2, activities: ['Beach morning', 'Seafood lunch', 'Sunset viewpoint'] },
  { day: 3, activities: ['Hiking trail', 'Picnic', 'Night market'] },
];

const ItinerarySimple = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itinerary, setItinerary] = useState([]);

  const generateItinerary = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setItinerary([]);

    try {
      // Verify city via backend; if fails use sample
      const res = await apiService.verifyCity(city.trim());
      if (!res) {
        setError('City not found, showing sample itinerary.');
        setItinerary(sampleItinerary);
      } else {
        // Call backend itinerary endpoint (optional). Fall back to sample.
        try {
          const resp = await fetch('/api/travel/itinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destinations: [city.trim()], duration: 3 }),
          });
          const data = await resp.json();
          if (data.success && Array.isArray(data.data)) {
            setItinerary(data.data);
          } else {
            setError('Backend did not return itinerary, showing sample.');
            setItinerary(sampleItinerary);
          }
        } catch (e) {
          setError('Error contacting backend, showing sample.');
          setItinerary(sampleItinerary);
        }
      }
    } catch (e) {
      setError('API error, showing sample itinerary.');
      setItinerary(sampleItinerary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Itinerary Generator
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Destination City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button variant="contained" onClick={generateItinerary} disabled={loading || !city.trim()}>
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {itinerary.length > 0 && (
        <Grid container spacing={2}>
          {itinerary.map((day, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Day {day.day || idx + 1}
                  </Typography>
                  {Array.isArray(day.activities) ? (
                    day.activities.map((act, i) => <Chip key={i} label={act} sx={{ mr: 1, mb: 1 }} />)
                  ) : (
                    <Typography variant="body2">No activities listed.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ItinerarySimple;
