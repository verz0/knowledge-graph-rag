const axios = require('axios');

class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
    
    if (!this.apiKey) {
      console.warn('⚠️  Google Maps API key not found. Some features may not work.');
    }
  }

  // Universal place search - can handle any type of place
  async searchPlaces(query, filters = {}) {
    try {
      if (!this.apiKey) {
        return this.getMockSearchResults(query);
      }

      // Use Google Places Text Search API for comprehensive search
      const response = await axios.get(`${this.baseUrl}/place/textsearch/json`, {
        params: {
          query: query,
          type: filters.type || 'establishment|natural_feature|park|museum|church|tourist_attraction',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        console.error('Google Places API error:', response.data.status);
        return this.getMockSearchResults(query);
      }

      return response.data.results.map(place => ({
        placeId: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        address: place.formatted_address,
        types: place.types,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        priceLevel: place.price_level,
        photoReference: place.photos && place.photos[0] ? place.photos[0].photo_reference : null,
        source: 'google_maps'
      }));

    } catch (error) {
      console.error('Google Maps Search Error:', error.message);
      return this.getMockSearchResults(query);
    }
  }

  // Get places for a city using Google Places API
  async getPlacesForCity(cityName, type = 'tourist_attraction') {
    try {
      if (!this.apiKey) {
        // Return mock data if no API key
        return this.getMockPlaces(cityName);
      }

      // First, get city coordinates
      const geocodeResponse = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address: cityName,
          key: this.apiKey
        }
      });

      if (geocodeResponse.data.status !== 'OK' || geocodeResponse.data.results.length === 0) {
        throw new Error(`City "${cityName}" not found`);
      }

      const location = geocodeResponse.data.results[0].geometry.location;
      
      // Search for multiple types of places
      const placeTypes = [
        'tourist_attraction',
        'museum',
        'park',
        'natural_feature',
        'church',
        'monument',
        'zoo',
        'amusement_park'
      ];
      
      const allPlaces = [];
      
      for (const placeType of placeTypes) {
        try {
          const placesResponse = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
            params: {
              location: `${location.lat},${location.lng}`,
              radius: 15000, // 15km radius for better coverage
              type: placeType,
              key: this.apiKey
            }
          });

          if (placesResponse.data.status === 'OK') {
            allPlaces.push(...placesResponse.data.results);
          }
        } catch (typeError) {
          console.error(`Error fetching ${placeType} places:`, typeError.message);
        }
      }

      // Remove duplicates and format results
      const uniquePlaces = this.removeDuplicatePlaces(allPlaces);
      
      return uniquePlaces.map(place => ({
        placeId: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        address: place.vicinity,
        types: place.types,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        priceLevel: place.price_level,
        photoReference: place.photos && place.photos[0] ? place.photos[0].photo_reference : null,
        source: 'google_maps'
      }));

    } catch (error) {
      console.error('Google Maps API Error:', error.message);
      // Return mock data as fallback
      return this.getMockPlaces(cityName);
    }
  }

  // Remove duplicate places based on place_id and name similarity
  removeDuplicatePlaces(places) {
    const seen = new Set();
    return places.filter(place => {
      const key = place.place_id || place.name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Get place details
  async getPlaceDetails(placeId) {
    try {
      if (!this.apiKey) {
        return this.getMockPlaceDetails(placeId);
      }

      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_address,geometry,photos,types,opening_hours,website,formatted_phone_number',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Failed to fetch place details');
      }

      const place = response.data.result;
      return {
        placeId: placeId,
        name: place.name,
        rating: place.rating || 0,
        address: place.formatted_address,
        types: place.types,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        website: place.website,
        phone: place.formatted_phone_number,
        openingHours: place.opening_hours,
        photoReference: place.photos && place.photos[0] ? place.photos[0].photo_reference : null
      };

    } catch (error) {
      console.error('Google Maps API Error:', error.message);
      return this.getMockPlaceDetails(placeId);
    }
  }

  // Mock data for development/testing
  getMockPlaces(cityName) {
    const mockData = {
      'Paris': [
        {
          placeId: 'eiffel_tower_paris',
          name: 'Eiffel Tower',
          rating: 4.6,
          address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          types: ['tourist_attraction', 'point_of_interest'],
          location: { lat: 48.8584, lng: 2.2945 },
          photoReference: null
        },
        {
          placeId: 'louvre_museum_paris',
          name: 'Louvre Museum',
          rating: 4.7,
          address: 'Rue de Rivoli, 75001 Paris, France',
          types: ['museum', 'tourist_attraction', 'point_of_interest'],
          location: { lat: 48.8606, lng: 2.3376 },
          photoReference: null
        },
        {
          placeId: 'notre_dame_paris',
          name: 'Notre-Dame Cathedral',
          rating: 4.5,
          address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
          types: ['church', 'tourist_attraction', 'point_of_interest'],
          location: { lat: 48.8530, lng: 2.3499 },
          photoReference: null
        }
      ],
      'London': [
        {
          placeId: 'big_ben_london',
          name: 'Big Ben',
          rating: 4.5,
          address: 'Westminster, London SW1A 0AA, UK',
          types: ['tourist_attraction', 'point_of_interest'],
          location: { lat: 51.5007, lng: -0.1246 },
          photoReference: null
        },
        {
          placeId: 'tower_of_london',
          name: 'Tower of London',
          rating: 4.4,
          address: 'St Katharine\'s & Wapping, London EC3N 4AB, UK',
          types: ['castle', 'tourist_attraction', 'point_of_interest'],
          location: { lat: 51.5081, lng: -0.0759 },
          photoReference: null
        },
        {
          placeId: 'british_museum_london',
          name: 'British Museum',
          rating: 4.6,
          address: 'Great Russell St, Bloomsbury, London WC1B 3DG, UK',
          types: ['museum', 'tourist_attraction', 'point_of_interest'],
          location: { lat: 51.5194, lng: -0.1270 },
          photoReference: null
        }
      ]
    };

    return mockData[cityName] || [];
  }

  getMockPlaceDetails(placeId) {
    const mockDetails = {
      'eiffel_tower_paris': {
        placeId: 'eiffel_tower_paris',
        name: 'Eiffel Tower',
        rating: 4.6,
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        types: ['tourist_attraction', 'point_of_interest'],
        location: { lat: 48.8584, lng: 2.2945 },
        website: 'https://www.toureiffel.paris/',
        phone: '+33 8 92 70 12 39',
        openingHours: null,
        photoReference: null
      }
    };

    return mockDetails[placeId] || null;
  }

  // Mock search results for development/testing
  getMockSearchResults(query) {
    const mockResults = {
      'eiffel tower': [
        {
          placeId: 'eiffel_tower_paris',
          name: 'Eiffel Tower',
          rating: 4.6,
          address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          types: ['tourist_attraction', 'point_of_interest', 'establishment'],
          location: { lat: 48.8584, lng: 2.2945 },
          priceLevel: 3,
          source: 'google_maps'
        }
      ],
      'statue of liberty': [
        {
          placeId: 'statue_of_liberty_ny',
          name: 'Statue of Liberty',
          rating: 4.7,
          address: 'New York, NY 10004, USA',
          types: ['tourist_attraction', 'point_of_interest', 'establishment'],
          location: { lat: 40.6892, lng: -74.0445 },
          priceLevel: 2,
          source: 'google_maps'
        }
      ],
      'mount everest': [
        {
          placeId: 'mount_everest_nepal',
          name: 'Mount Everest',
          rating: 4.8,
          address: 'Nepal-Tibet',
          types: ['natural_feature', 'mountain'],
          location: { lat: 27.9881, lng: 86.9250 },
          source: 'google_maps'
        }
      ],
      'grand canyon': [
        {
          placeId: 'grand_canyon_arizona',
          name: 'Grand Canyon National Park',
          rating: 4.8,
          address: 'Arizona, USA',
          types: ['park', 'natural_feature', 'point_of_interest'],
          location: { lat: 36.1069, lng: -112.1129 },
          priceLevel: 2,
          source: 'google_maps'
        }
      ],
      'louvre museum': [
        {
          placeId: 'louvre_museum_paris',
          name: 'Louvre Museum',
          rating: 4.7,
          address: 'Rue de Rivoli, 75001 Paris, France',
          types: ['museum', 'tourist_attraction', 'point_of_interest'],
          location: { lat: 48.8606, lng: 2.3376 },
          priceLevel: 3,
          source: 'google_maps'
        }
      ]
    };

    const searchKey = query.toLowerCase();
    
    // Try exact match first
    if (mockResults[searchKey]) {
      return mockResults[searchKey];
    }
    
    // Try partial matches
    for (const [key, results] of Object.entries(mockResults)) {
      if (key.includes(searchKey) || searchKey.includes(key)) {
        return results;
      }
    }
    
    // Return generic result if no match found
    return [
      {
        placeId: `${query.replace(/\s+/g, '_').toLowerCase()}_generic`,
        name: query,
        rating: 4.0,
        address: 'Location varies',
        types: ['point_of_interest', 'establishment'],
        location: { lat: 0, lng: 0 },
        source: 'google_maps'
      }
    ];
  }
}

module.exports = new GoogleMapsService();
