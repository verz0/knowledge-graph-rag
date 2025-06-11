const cityService = require('../services/cityService');

class CityController {
  // Verify if a city exists in the knowledge graph
  async verifyCity(req, res, next) {
    try {
      const { cityName } = req.params;
      
      const result = await cityService.verifyCityExists(cityName);
      
      res.status(200).json({
        success: true,
        data: result,
        message: result.exists ? 
          `City "${cityName}" found in knowledge graph` : 
          `City "${cityName}" not found in knowledge graph`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Get popular places for a city
  async getCityPlaces(req, res, next) {
    try {
      const { cityName } = req.params;
      const { type = 'tourist_attraction', limit = 10 } = req.query;
      
      // First verify the city exists
      const cityVerification = await cityService.verifyCityExists(cityName);
      if (!cityVerification.exists) {
        return res.status(404).json({
          success: false,
          message: `City "${cityName}" not found`
        });
      }
      
      // Get places for the city
      const places = await cityService.getPlacesForCity(cityName);
      
      // Apply filters
      let filteredPlaces = places;
      if (type !== 'all') {
        filteredPlaces = places.filter(place => 
          place.types.includes(type)
        );
      }
      
      // Apply limit
      if (limit && !isNaN(limit)) {
        filteredPlaces = filteredPlaces.slice(0, parseInt(limit));
      }
      
      res.status(200).json({
        success: true,
        data: {
          city: cityVerification.city,
          places: filteredPlaces,
          totalFound: filteredPlaces.length,
          filters: {
            type,
            limit: parseInt(limit)
          }
        },
        message: `Found ${filteredPlaces.length} places in ${cityName}`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Get all cities from knowledge graph
  async getAllCities(req, res, next) {
    try {
      const cities = await cityService.getAllCities();
      
      res.status(200).json({
        success: true,
        data: {
          cities,
          count: cities.length
        },
        message: `Retrieved ${cities.length} cities from knowledge graph`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Search cities
  async searchCities(req, res, next) {
    try {
      const { q: query, country } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const allCities = await cityService.getAllCities();
      
      // Filter cities based on search query
      let filteredCities = allCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      
      // Filter by country if specified
      if (country) {
        filteredCities = filteredCities.filter(city =>
          city.country.toLowerCase().includes(country.toLowerCase())
        );
      }
      
      res.status(200).json({
        success: true,
        data: {
          cities: filteredCities,
          count: filteredCities.length,
          searchQuery: query,
          countryFilter: country
        },
        message: `Found ${filteredCities.length} cities matching "${query}"`
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CityController();
