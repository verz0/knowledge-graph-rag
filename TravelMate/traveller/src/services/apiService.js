// API service for TravelMate backend integration
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  // Generic fetch wrapper with error handling
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(`${this.baseURL}${url}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }
  // City-related API calls
  async verifyCity(cityName) {
    try {
      const response = await this.fetchWithErrorHandling(`/cities/verify/${encodeURIComponent(cityName)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to verify city "${cityName}": ${error.message}`);
    }
  }

  async getPlacesForCity(cityName) {
    try {
      const response = await this.fetchWithErrorHandling(`/cities/${encodeURIComponent(cityName)}/places`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get places for "${cityName}": ${error.message}`);
    }
  }

  // Knowledge Graph API calls
  async getRelatedEntities(placeId, hops = 3) {
    try {
      const response = await this.fetchWithErrorHandling(`/knowledge-graph/related/${encodeURIComponent(placeId)}?hops=${hops}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get related entities for place "${placeId}": ${error.message}`);
    }
  }

  async getDirectRelationships(placeId) {
    try {
      const response = await this.fetchWithErrorHandling(`/knowledge-graph/relationships/${encodeURIComponent(placeId)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get relationships for place "${placeId}": ${error.message}`);
    }
  }

  async searchEntities(searchParams) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await this.fetchWithErrorHandling(`/knowledge-graph/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search entities: ${error.message}`);
    }
  }

  async getGraphStats() {
    try {
      const response = await this.fetchWithErrorHandling('/knowledge-graph/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get graph statistics: ${error.message}`);
    }
  }
  async getPlaceEnrichment(placeId, includeRelated = true, maxHops = 2) {
    try {
      const response = await this.fetchWithErrorHandling(
        `/knowledge-graph/enrich/${encodeURIComponent(placeId)}?includeRelated=${includeRelated}&maxHops=${maxHops}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get place enrichment for "${placeId}": ${error.message}`);
    }
  }
  // Universal place search
  async searchPlaces(query, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await this.fetchWithErrorHandling(`/travel/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search for places: ${error.message}`);
    }
  }

  // Get comprehensive place details
  async getPlaceDetails(placeId) {
    try {
      const response = await this.fetchWithErrorHandling(`/travel/place/${encodeURIComponent(placeId)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get place details for "${placeId}": ${error.message}`);
    }
  }

  // Generate travel itinerary
  async generateItinerary(preferences) {
    try {
      const response = await this.fetchWithErrorHandling('/travel/itinerary', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }

  // Get travel suggestions
  async getTravelSuggestions(interests = [], budget = 'medium', season = 'any', location = '', travelStyle = 'balanced') {
    try {
      const queryParams = new URLSearchParams();
      if (interests.length > 0) queryParams.append('interests', interests.join(','));
      queryParams.append('budget', budget);
      queryParams.append('season', season);
      if (location) queryParams.append('location', location);
      queryParams.append('travelStyle', travelStyle);
      
      const response = await this.fetchWithErrorHandling(`/travel/suggestions?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get travel suggestions: ${error.message}`);
    }
  }
  // Get smart recommendations for a specific user
  async getSmartRecommendations(userId, preferences = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (preferences.interests?.length > 0) {
        queryParams.append('interests', preferences.interests.join(','));
      }
      if (preferences.budget) queryParams.append('budget', preferences.budget);
      if (preferences.location) queryParams.append('location', preferences.location);
      if (preferences.travelStyle) queryParams.append('travelStyle', preferences.travelStyle);
      if (preferences.season) queryParams.append('season', preferences.season);
      if (preferences.useAdvancedAnalysis !== undefined) {
        queryParams.append('useAdvancedAnalysis', preferences.useAdvancedAnalysis);
      }
      
      const response = await this.fetchWithErrorHandling(`/travel/smart-recommendations/${userId}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get smart recommendations: ${error.message}`);
    }
  }

  // Generate RAG-enhanced suggestions without user ID
  async generateRAGSuggestions(preferences) {
    try {
      const response = await this.fetchWithErrorHandling('/travel/rag-suggestions', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to generate RAG suggestions: ${error.message}`);
    }
  }

  // Analyze complex preferences using RAG
  async analyzePreferences(preferences) {
    try {
      const response = await this.fetchWithErrorHandling('/travel/analyze-preferences', {
        method: 'POST',
        body: JSON.stringify(preferences)
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to analyze preferences: ${error.message}`);
    }
  }

  // Get available categories
  async getCategories() {
    try {
      const response = await this.fetchWithErrorHandling('/travel/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  // Optimize route for multiple places
  async optimizeRoute(places, options = {}) {
    try {
      const response = await this.fetchWithErrorHandling('/travel/optimize-route', {
        method: 'POST',
        body: JSON.stringify({ places, ...options })
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to optimize route: ${error.message}`);
    }  }
  // Send chat message to AI assistant
  async sendChatMessage(message, context = {}) {
    try {
      const response = await this.fetchWithErrorHandling('/travel/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context })
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to send chat message: ${error.message}`);
    }
  }

  // Get detailed place information with Wikipedia and knowledge graph data
  async getPlaceInfo(placeName) {
    try {
      const response = await this.fetchWithErrorHandling(`/travel/place-info/${encodeURIComponent(placeName)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get place information for "${placeName}": ${error.message}`);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new Error(`Backend health check failed: ${error.message}`);
    }
  }

  // Add place to knowledge graph
  async addPlaceToKnowledgeGraph(placeData) {
    try {
      const response = await this.fetchWithErrorHandling('/knowledge-graph/places', {
        method: 'POST',
        body: JSON.stringify(placeData)
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add place to knowledge graph: ${error.message}`);
    }
  }  // Check if place exists in knowledge graph
  async checkPlaceExists(placeName, address = '') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('name', placeName);
      if (address) queryParams.append('address', address);
      
      const response = await this.fetchWithErrorHandling(`/knowledge-graph/check-place?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check place existence: ${error.message}`);
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
