const express = require('express');
const knowledgeGraphController = require('../controllers/knowledgeGraphController');
const enhancedKnowledgeGraphService = require('../services/enhancedKnowledgeGraphService');
const knowledgeGraphService = require('../services/knowledgeGraphService');
const { validateRequest, placeIdSchema } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/knowledge-graph/initialize
 * @desc    Initialize knowledge graph with sample data
 * @access  Public
 */
router.post('/initialize', knowledgeGraphController.initializeKnowledgeGraph);

/**
 * @route   GET /api/knowledge-graph/stats
 * @desc    Get knowledge graph statistics
 * @access  Public
 */
router.get('/stats', knowledgeGraphController.getGraphStats);

/**
 * @route   GET /api/knowledge-graph/search
 * @desc    Search entities in the knowledge graph
 * @access  Public
 * @query   type (optional) - Entity type to filter by
 * @query   name (optional) - Entity name to search for
 * @query   [property] (optional) - Custom properties to filter by
 */
router.get('/search', knowledgeGraphController.searchEntities);

/**
 * @route   GET /api/knowledge-graph/related/:placeId
 * @desc    Get related entities within N hops for a place
 * @access  Public
 * @param   placeId - ID of the place to find related entities for
 * @query   hops (optional) - Maximum number of hops (default: 3, max: 5)
 * @query   limit (optional) - Maximum number of results (default: 50)
 */
router.get('/related/:placeId',
  validateRequest(placeIdSchema),
  knowledgeGraphController.getRelatedEntities
);

/**
 * @route   GET /api/knowledge-graph/relationships/:placeId
 * @desc    Get direct relationships for a place
 * @access  Public
 * @param   placeId - ID of the place to get relationships for
 */
router.get('/relationships/:placeId',
  validateRequest(placeIdSchema),
  knowledgeGraphController.getDirectRelationships
);

/**
 * @route   GET /api/knowledge-graph/enrich/:placeId
 * @desc    Get comprehensive enrichment data for a place
 * @access  Public
 * @param   placeId - ID of the place to enrich
 * @query   includeRelated (optional) - Include related entities (default: true)
 * @query   maxHops (optional) - Maximum hops for related entities (default: 2, max: 3)
 */
router.get('/enrich/:placeId',
  validateRequest(placeIdSchema),
  knowledgeGraphController.getPlaceEnrichment
);

/**
 * @route   GET /api/knowledge-graph/check-place
 * @desc    Check if a place exists in the knowledge graph
 * @access  Public
 * @query   name - Place name to check
 * @query   address (optional) - Place address for better matching
 */
router.get('/check-place', async (req, res, next) => {
  try {
    const { name, address } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Place name is required'
      });
    }
    
    const result = await knowledgeGraphService.checkPlaceExists(name, address);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/knowledge-graph/places
 * @desc    Add a new place to the knowledge graph
 * @access  Public
 * @body    placeData - Place information to add
 */
router.post('/places', async (req, res, next) => {
  try {
    const placeData = req.body;
    
    // Validate required fields
    if (!placeData.name) {
      return res.status(400).json({
        success: false,
        message: 'Place name is required'
      });
    }
    
    // Check if place already exists
    const existingPlace = await knowledgeGraphService.checkPlaceExists?.(placeData.name, placeData.address);
    
    if (existingPlace?.exists) {
      return res.status(409).json({
        success: false,
        message: 'Place already exists in knowledge graph',
        existingPlace: existingPlace.place
      });
    }
    
    // Add place to knowledge graph
    const result = await enhancedKnowledgeGraphService.addPlaceToKnowledgeGraph(placeData);
    
    res.status(201).json({
      success: true,
      data: result,
      message: result.message
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
