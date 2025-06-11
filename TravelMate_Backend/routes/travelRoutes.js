const express = require('express');
const enhancedKnowledgeGraphService = require('../services/enhancedKnowledgeGraphService');
const geminiService = require('../services/geminiService');
const { validateRequest, searchSchema, itinerarySchema } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/travel/search
 * @desc    Universal place search - monuments, natural places, museums, etc.
 * @access  Public
 * @query   q - Search query (required)
 * @query   type - Place type filter (optional)
 * @query   country - Country filter (optional)
 * @query   category - Category filter (optional)
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q: query, type, country, category } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const filters = {};
    if (type) filters.type = type;
    if (country) filters.country = country;
    if (category) filters.category = category;
    
    const results = await enhancedKnowledgeGraphService.lookupPlace(query.trim(), filters);
    
    res.status(200).json({
      success: true,
      data: {
        query: query.trim(),
        filters,
        results,
        totalResults: results.length
      },
      message: `Found ${results.length} places matching "${query}"`
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/travel/place/:placeId
 * @desc    Get comprehensive details for a specific place
 * @access  Public
 * @param   placeId - ID of the place
 */
router.get('/place/:placeId', async (req, res, next) => {
  try {
    const { placeId } = req.params;
    
    // First try to find the place
    const places = await enhancedKnowledgeGraphService.lookupPlace(placeId);
    
    if (places.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Place with ID "${placeId}" not found`
      });
    }
    
    // Get the first result and enrich it with comprehensive data
    const place = places[0];
    const enrichedPlace = await enhancedKnowledgeGraphService.enrichPlaceData(place);
    
    res.status(200).json({
      success: true,
      data: enrichedPlace,
      message: `Comprehensive details retrieved for "${place.name}"`
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/travel/itinerary
 * @desc    Generate intelligent travel itinerary
 * @access  Public
 * @body    preferences - User preferences and requirements
 */
router.post('/itinerary', async (req, res, next) => {
  try {
    const preferences = req.body;
    
    // Validate required fields
    if (!preferences.destinations || !Array.isArray(preferences.destinations) || preferences.destinations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one destination is required'
      });
    }
    
    // Set defaults for optional fields
    const fullPreferences = {
      duration: 3,
      budget: 'medium',
      interests: [],
      travelStyle: 'balanced',
      groupSize: 1,
      accessibility: false,
      ...preferences
    };
    
    const itinerary = await enhancedKnowledgeGraphService.generateItinerary(fullPreferences);
    
    res.status(200).json({
      success: true,
      data: itinerary,
      message: `Personalized ${itinerary.totalDays}-day itinerary generated for ${preferences.destinations.join(', ')}`
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/travel/suggestions
 * @desc    Get travel suggestions based on interests and preferences
 * @access  Public
 * @query   interests - Comma-separated list of interests
 * @query   budget - Budget level (low, medium, high)
 * @query   season - Preferred season (spring, summer, fall, winter)
 * @query   location - Location filter
 * @query   travelStyle - Travel style preference
 */
router.get('/suggestions', async (req, res, next) => {
  try {
    const { 
      interests, 
      budget = 'medium', 
      season = 'any',
      location,
      travelStyle = 'balanced'
    } = req.query;
    
    const interestList = interests ? interests.split(',').map(i => i.trim()) : [];
    
    // Generate RAG-enhanced suggestions
    const suggestions = await enhancedKnowledgeGraphService.generateSuggestions({
      interests: interestList,
      budget,
      season,
      location,
      travelStyle
    });
    
    res.status(200).json({
      success: true,
      data: suggestions,
      message: `Generated ${suggestions.total || 0} intelligent travel suggestions using RAG`
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/travel/smart-recommendations/:userId
 * @desc    Get personalized smart recommendations for a user
 * @access  Public
 * @param   userId - User ID for personalization
 * @query   interests - Additional interests
 * @query   budget - Budget preference
 * @query   location - Location preference
 */
router.get('/smart-recommendations/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { 
      interests, 
      budget, 
      location,
      travelStyle
    } = req.query;
    
    const interestList = interests ? interests.split(',').map(i => i.trim()) : [];
    
    const preferences = {
      interests: interestList,
      budget,
      location,
      travelStyle
    };
    
    const smartRecommendations = await enhancedKnowledgeGraphService.getSmartRecommendations(userId, preferences);
    
    res.status(200).json({
      success: true,
      data: smartRecommendations,
      message: `Generated personalized recommendations for user ${userId}`
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/travel/analyze-preferences
 * @desc    Analyze complex user preferences and return intelligent suggestions
 * @access  Public
 * @body    Detailed preferences object
 */
router.post('/analyze-preferences', async (req, res, next) => {
  try {
    const preferences = req.body;
    
    // Validate required fields
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Preferences object is required'
      });
    }
    
    // Use RAG system for complex preference analysis
    const analysis = await enhancedKnowledgeGraphService.generateSuggestions(preferences);
    
    res.status(200).json({
      success: true,
      data: {
        analysis,
        processingMethod: 'knowledge-graph-rag',
        recommendationEngine: 'ai-enhanced'
      },
      message: 'Analyzed preferences and generated intelligent recommendations'
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/travel/rag-suggestions
 * @desc    Generate RAG-enhanced travel suggestions based on a query
 * @access  Public
 * @body    query - User's travel question or request
 * @body    preferences - Optional user preferences object
 */
router.post('/rag-suggestions', async (req, res, next) => {
  try {
    const { query, preferences = {} } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    console.log('🔍 Processing RAG query:', query.substring(0, 100) + '...');
    
    // Use Gemini AI to generate intelligent response
    const aiResponse = await geminiService.generateChatResponse(query, {
      type: 'rag-query',
      preferences,
      instructions: 'Please provide detailed travel recommendations based on this query. Include specific places, activities, and practical advice.'
    });
    
    // Also get knowledge graph suggestions if possible
    let suggestions = [];
    try {
      const kgSuggestions = await enhancedKnowledgeGraphService.generateSuggestions({
        ...preferences,
        query: query
      });
      suggestions = kgSuggestions.suggestions || kgSuggestions.results || [];
    } catch (kgError) {
      console.log('📊 Knowledge graph enhancement failed, using AI-only response');
    }
    
    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        suggestions: suggestions.slice(0, 6),
        query: query,
        timestamp: new Date().toISOString(),
        powered_by: 'gemini-ai-rag'
      },
      message: 'RAG-enhanced travel suggestions generated successfully'
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/travel/categories
 * @desc    Get available place categories and types
 * @access  Public
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = {
      types: [
        'Monument',
        'Museum',
        'Palace/Castle',
        'Religious Site',
        'Natural Feature',
        'Mountain',
        'Lake/River',
        'Beach/Coast',
        'Park/Garden',
        'Forest',
        'Desert',
        'Volcano',
        'Tower',
        'Bridge',
        'Market',
        'Theater',
        'Stadium',
        'Landmark'
      ],
      categories: [
        'Historical',
        'Cultural',
        'Natural',
        'Religious',
        'Entertainment',
        'Educational',
        'Adventure',
        'Relaxation',
        'Architecture',
        'Art'
      ],
      interests: [
        'history',
        'culture',
        'nature',
        'art',
        'architecture',
        'religion',
        'adventure',
        'photography',
        'food',
        'shopping',
        'nightlife',
        'relaxation',
        'sports',
        'music',
        'literature'
      ]
    };
    
    res.status(200).json({
      success: true,
      data: categories,
      message: 'Available categories and types retrieved'
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/travel/optimize-route
 * @desc    Optimize route for multiple destinations
 * @access  Public
 * @body    places - Array of places to visit
 * @body    startLocation - Starting location (optional)
 */
router.post('/optimize-route', async (req, res, next) => {
  try {
    const { places, startLocation, travelMode = 'walking' } = req.body;
    
    if (!places || !Array.isArray(places) || places.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 places are required for route optimization'
      });
    }
    
    const optimizedRoute = await enhancedKnowledgeGraphService.optimizeRoute(places, {
      startLocation,
      travelMode
    });
    
    res.status(200).json({
      success: true,
      data: {
        originalOrder: places,
        optimizedRoute,
        estimatedDuration: optimizedRoute.totalDuration,
        estimatedDistance: optimizedRoute.totalDistance
      },
      message: `Route optimized for ${places.length} destinations`
    });
      } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/travel/chat
 * @desc    AI-powered travel chat assistance using Gemini
 * @access  Public
 * @body    message - User message (required)
 * @body    context - Optional context object
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    console.log('💬 Processing chat message:', message.substring(0, 100) + '...');
    
    const response = await geminiService.generateChatResponse(message, context);
    
    res.status(200).json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
        powered_by: 'gemini-ai'
      },
      message: 'Chat response generated successfully'
    });
      } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/travel/place-info/:placeName
 * @desc    Get detailed Wikipedia and external information about a place
 * @access  Public
 * @param   placeName - Name of the place to get information about
 */
router.get('/place-info/:placeName', async (req, res, next) => {
  try {
    const { placeName } = req.params;
    
    if (!placeName || placeName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Place name is required'
      });
    }
      console.log('🔍 Getting detailed information for place:', placeName);
      // Get Wikipedia information
    let wikipediaInfo = [];
    try {
      wikipediaInfo = await enhancedKnowledgeGraphService.searchWikipedia(placeName);
      console.log('📖 Wikipedia search completed, results:', wikipediaInfo.length);
    } catch (wikiError) {
      console.error('⚠️ Wikipedia search failed:', wikiError.message);
    }
    
    // Try to get additional information from our knowledge graph
    let knowledgeGraphInfo = [];
    try {
      knowledgeGraphInfo = await enhancedKnowledgeGraphService.lookupPlace(placeName, {});
      console.log('🔗 Knowledge graph search completed, results:', knowledgeGraphInfo.length);
    } catch (kgError) {
      console.error('⚠️ Knowledge graph search failed:', kgError.message);
    }
    
    // Combine information
    let placeInfo = {
      name: placeName,
      wikipedia: wikipediaInfo[0] || null,
      knowledgeGraph: knowledgeGraphInfo.slice(0, 3), // Get top 3 results
      searchTime: new Date().toISOString()
    };
    
    // If we have Wikipedia info, enhance it
    if (placeInfo.wikipedia) {
      // Add additional details from the knowledge graph if available
      const matchingKGPlace = knowledgeGraphInfo.find(place => 
        place.name.toLowerCase().includes(placeName.toLowerCase()) ||
        placeName.toLowerCase().includes(place.name.toLowerCase())
      );
      
      if (matchingKGPlace) {
        placeInfo.wikipedia.additionalInfo = {
          rating: matchingKGPlace.rating,
          address: matchingKGPlace.address,
          types: matchingKGPlace.types,
          metadata: matchingKGPlace.metadata
        };
      }
    }
    
    res.status(200).json({
      success: true,
      data: placeInfo,
      message: `Detailed information retrieved for "${placeName}"`
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
