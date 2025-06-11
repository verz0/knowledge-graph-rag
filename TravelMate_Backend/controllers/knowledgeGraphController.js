const knowledgeGraphService = require('../services/knowledgeGraphService');

class KnowledgeGraphController {
  // Get related entities within N hops
  async getRelatedEntities(req, res, next) {
    try {
      const { placeId } = req.params;
      const { hops = 3, limit = 50 } = req.query;
      
      const maxHops = Math.min(parseInt(hops), 5); // Limit to max 5 hops for performance
      
      const result = await knowledgeGraphService.getRelatedEntities(placeId, maxHops);
      
      res.status(200).json({
        success: true,
        data: result,
        message: `Found ${result.totalFound} related entities for place ID: ${placeId}`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Get direct relationships for a place
  async getDirectRelationships(req, res, next) {
    try {
      const { placeId } = req.params;
      
      const result = await knowledgeGraphService.getDirectRelationships(placeId);
      
      const totalRelationships = Object.values(result.directRelationships)
        .reduce((total, relType) => total + relType.outgoing.length + relType.incoming.length, 0);
      
      res.status(200).json({
        success: true,
        data: result,
        message: `Found ${totalRelationships} direct relationships for place ID: ${placeId}`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Search entities in the knowledge graph
  async searchEntities(req, res, next) {
    try {
      const { type, name, ...properties } = req.query;
      
      if (!type && !name && Object.keys(properties).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one search parameter is required (type, name, or properties)'
        });
      }
      
      const searchParams = {
        type,
        name,
        properties
      };
      
      const entities = await knowledgeGraphService.searchEntities(searchParams);
      
      res.status(200).json({
        success: true,
        data: {
          entities,
          count: entities.length,
          searchParams
        },
        message: `Found ${entities.length} entities matching search criteria`
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Get knowledge graph statistics
  async getGraphStats(req, res, next) {
    try {
      const stats = await knowledgeGraphService.getGraphStatistics();
      
      res.status(200).json({
        success: true,
        data: stats,
        message: 'Knowledge graph statistics retrieved successfully'
      });
      
    } catch (error) {
      next(error);
    }
  }
  // Initialize knowledge graph with sample data
  async initializeKnowledgeGraph(req, res, next) {
    try {
      await knowledgeGraphService.initializeWithSampleData();
      
      res.status(200).json({
        success: true,
        message: 'Knowledge graph initialized with sample travel data'
      });
      
    } catch (error) {
      next(error);
    }
  }

  // Get place enrichment data
  async getPlaceEnrichment(req, res, next) {
    try {
      const { placeId } = req.params;
      const { includeRelated = true, maxHops = 2 } = req.query;
      
      let enrichmentData = {
        placeId,
        directRelationships: null,
        relatedEntities: null
      };
      
      // Get direct relationships
      const directRels = await knowledgeGraphService.getDirectRelationships(placeId);
      enrichmentData.directRelationships = directRels.directRelationships;
      
      // Get related entities if requested
      if (includeRelated === 'true') {
        const relatedEntities = await knowledgeGraphService.getRelatedEntities(
          placeId, 
          Math.min(parseInt(maxHops), 3)
        );
        enrichmentData.relatedEntities = relatedEntities.relatedEntities;
      }
      
      res.status(200).json({
        success: true,
        data: enrichmentData,
        message: `Place enrichment data retrieved for place ID: ${placeId}`
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KnowledgeGraphController();
