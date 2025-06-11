const express = require('express');
const cityController = require('../controllers/cityController');
const { validateRequest, cityNameSchema } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/cities
 * @desc    Get all cities from knowledge graph
 * @access  Public
 */
router.get('/', cityController.getAllCities);

/**
 * @route   GET /api/cities/search
 * @desc    Search cities by name or country
 * @access  Public
 * @query   q (required) - search query
 * @query   country (optional) - filter by country
 */
router.get('/search', cityController.searchCities);

/**
 * @route   GET /api/cities/verify/:cityName
 * @desc    Verify if a city exists in the knowledge graph
 * @access  Public
 * @param   cityName - Name of the city to verify
 */
router.get('/verify/:cityName', 
  validateRequest(cityNameSchema),
  cityController.verifyCity
);

/**
 * @route   GET /api/cities/:cityName/places
 * @desc    Get popular places for a specific city
 * @access  Public
 * @param   cityName - Name of the city
 * @query   type (optional) - Type of places to filter (tourist_attraction, restaurant, etc.)
 * @query   limit (optional) - Maximum number of places to return
 */
router.get('/:cityName/places',
  validateRequest(cityNameSchema),
  cityController.getCityPlaces
);

module.exports = router;
