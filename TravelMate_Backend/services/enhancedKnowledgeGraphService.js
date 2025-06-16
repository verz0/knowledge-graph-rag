// Enhanced Knowledge Graph Service with comprehensive place lookup and itinerary generation
const { getSession } = require('../config/database');
const googleMapsService = require('../config/googleMaps');
const geminiService = require('./geminiService');

class EnhancedKnowledgeGraphService {
  // Universal place lookup - can handle any place/monument/natural location
  async lookupPlace(query, filters = {}) {
    const session = getSession();
    const { type, country, category, sortBy, page = 1, limit = 10 } = filters;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    try {
      // Base MATCH and WHERE clauses
      let baseMatchQuery = `
        MATCH (p)
        WHERE (
          toLower(p.name) CONTAINS toLower($query) OR
          toLower(p.description) CONTAINS toLower($query) OR
          toLower(p.type) CONTAINS toLower($query) OR
          any(tag in p.tags WHERE toLower(tag) CONTAINS toLower($query))
        )
      `;

      const queryParams = { query };

      // Add filters
      if (type) {
        baseMatchQuery += ` AND toLower(p.type) = toLower($type)`;
        queryParams.type = type;
      }
      if (country) {
        baseMatchQuery += ` AND toLower(p.country) = toLower($country)`;
        queryParams.country = country;
      }
      if (category && category.toLowerCase() !== 'all') {
        baseMatchQuery += ` AND $category IN labels(p)`;
        queryParams.category = category;
      }

      // Query to get total results
      const totalCountQuery = `
        ${baseMatchQuery}
        RETURN count(p) as total
      `;
      
      const totalResult = await session.run(totalCountQuery, queryParams);
      const totalResults = totalResult.records[0].get('total').toNumber();

      // Query to get paginated results
      let dataQuery = `
        ${baseMatchQuery}
        RETURN p, labels(p) as labels
      `;

      // Add sorting
      let orderByClause = `
        ORDER BY 
          CASE 
            WHEN toLower(p.name) = toLower($query) THEN 1
            WHEN toLower(p.name) STARTS WITH toLower($query) THEN 2
            ELSE 3
          END,
          p.popularity DESC
      `;

      if (sortBy) {
        if (sortBy === 'name_asc') {
          orderByClause = 'ORDER BY p.name ASC';
        } else if (sortBy === 'name_desc') {
          orderByClause = 'ORDER BY p.name DESC';
        } else if (sortBy === 'rating_asc') {
          orderByClause = 'ORDER BY p.rating ASC, p.popularity DESC';
        } else if (sortBy === 'rating_desc') {
          orderByClause = 'ORDER BY p.rating DESC, p.popularity DESC';
        }
        // Add more sorting options as needed
      }
      dataQuery += orderByClause;
      
      dataQuery += `
        SKIP $skip
        LIMIT $limit
      `;
      
      const paginatedParams = { ...queryParams, skip: parseInt(skip, 10), limit: parseInt(limit, 10) };
      const result = await session.run(dataQuery, paginatedParams);
      
      let places = result.records.map(record => {
        const place = record.get('p').properties;
        const labels = record.get('labels');
        return {
          ...place,
          labels,
          source: 'knowledge_graph'
        };
      });
      
      // If not found in knowledge graph, use mock data (consider if this is still needed with pagination)
      // For now, if the first page has no results from KG, we'll return empty, 
      // as mock data doesn't support pagination/totalResults well.
      // if (places.length === 0 && page === 1) { 
      //   places = this.getMockPlaces(query); // This would need adjustment for totalResults
      // }
      
      // Enrich each place with comprehensive data
      // Consider if enrichment should happen only for the paginated results
      const enrichedPlaces = await Promise.all(
        places.map(place => this.enrichPlaceData(place))
      );
      
      return {
        results: enrichedPlaces,
        totalResults: totalResults
      };
      
    } catch (error) {
      console.error('Error in place lookup:', error.message, error.stack);
      // Return empty results and zero total on error to align with expected structure
      return {
        results: [],
        totalResults: 0
        // mock data might not be appropriate here if the error is DB related.
        // results: this.getMockPlaces(query), // This would need adjustment for totalResults
        // totalResults: this.getMockPlaces(query).length // This is not accurate
      };
    } finally {
      await session.close();
    }
  }

  // Mock data for development/testing
  getMockPlaces(query) {
    const mockPlaces = {
      'eiffel tower': {
        name: 'Eiffel Tower',
        description: 'The Eiffel Tower is a wrought-iron lattice tower located on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.',
        type: 'Monument',
        country: 'France',
        city: 'Paris',
        rating: 4.7,
        popularity: 100,
        coordinates: { lat: 48.8584, lng: 2.2945 },
        images: [
          'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f'
        ],
        highlights: ['Iconic landmark', 'Panoramic views', 'Historical significance'],
        estimatedCost: '€26',
        openingHours: '9:00 AM - 12:45 AM',
        bestTimeToVisit: 'Early morning or evening',
        tags: ['landmark', 'architecture', 'viewpoint', 'historical']
      },
      'louvre': {
        name: 'Louvre Museum',
        description: 'The Louvre, or the Louvre Museum, is the world\'s largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine.',
        type: 'Museum',
        country: 'France',
        city: 'Paris',
        rating: 4.8,
        popularity: 95,
        coordinates: { lat: 48.8606, lng: 2.3376 },
        images: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523',
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989'
        ],
        highlights: ['Mona Lisa', 'Ancient artifacts', 'Renaissance art'],
        estimatedCost: '€17',
        openingHours: '9:00 AM - 6:00 PM',
        bestTimeToVisit: 'Wednesday or Friday evening',
        tags: ['museum', 'art', 'historical', 'cultural']
      },
      'notre dame': {
        name: 'Notre-Dame Cathedral',
        description: 'Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris.',
        type: 'Religious Site',
        country: 'France',
        city: 'Paris',
        rating: 4.8,
        popularity: 90,
        coordinates: { lat: 48.8530, lng: 2.3499 },
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
          'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f'
        ],
        highlights: ['Gothic architecture', 'Religious significance', 'Historical importance'],
        estimatedCost: 'Free',
        openingHours: '8:00 AM - 6:45 PM',
        bestTimeToVisit: 'Early morning',
        tags: ['cathedral', 'religious', 'historical', 'architecture']
      }
    };

    // Convert query to lowercase for case-insensitive matching
    const lowerQuery = query.toLowerCase();
    
    // Find matching places
    const matches = Object.entries(mockPlaces)
      .filter(([key, place]) => 
        key.includes(lowerQuery) || 
        place.name.toLowerCase().includes(lowerQuery) ||
        place.description.toLowerCase().includes(lowerQuery)
      )
      .map(([_, place]) => ({
        ...place,
        placeId: place.name.toLowerCase().replace(/\s+/g, '_'),
        source: 'mock_data'
      }));

    return matches.length > 0 ? matches : [{
      name: query,
      description: `Information about ${query} is not available at the moment.`,
      type: 'Unknown',
      rating: 0,
      popularity: 0,
      source: 'mock_data'
    }];
  }

  // Search external APIs (Google Maps, Wikipedia, etc.)
  async searchExternalAPIs(query, filters) {
    const places = [];
    
    try {
      // Google Maps Places API search
      const googleResults = await googleMapsService.searchPlaces(query, filters);
      places.push(...googleResults);
      
      // Add Wikipedia API integration
      const wikipediaResults = await this.searchWikipedia(query);
      places.push(...wikipediaResults);
      
      // Add other APIs as needed (OpenStreetMap, TripAdvisor, etc.)
      
    } catch (error) {
      console.error('Error searching external APIs:', error.message);
    }
    
    return places;
  }

  // Wikipedia API integration
  async searchWikipedia(query) {
    try {
      const fetch = require('node-fetch');
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl);
      if (response.ok) {
        const data = await response.json();
        return [{
          name: data.title,
          description: data.extract,
          type: this.extractTypeFromWikipedia(data),
          coordinates: data.coordinates ? {
            lat: data.coordinates.lat,
            lng: data.coordinates.lon
          } : null,
          source: 'wikipedia',
          wikipediaUrl: data.content_urls?.desktop?.page
        }];
      }
    } catch (error) {
      console.error('Wikipedia search error:', error.message);
    }
    
    return [];
  }

  // Extract place type from Wikipedia data
  extractTypeFromWikipedia(data) {
    const extract = data.extract?.toLowerCase() || '';
    
    if (extract.includes('mountain') || extract.includes('peak')) return 'Mountain';
    if (extract.includes('lake') || extract.includes('river')) return 'Natural Water';
    if (extract.includes('museum')) return 'Museum';
    if (extract.includes('church') || extract.includes('cathedral')) return 'Religious Site';
    if (extract.includes('palace') || extract.includes('castle')) return 'Palace/Castle';
    if (extract.includes('park') || extract.includes('garden')) return 'Park/Garden';
    if (extract.includes('monument') || extract.includes('statue')) return 'Monument';
    if (extract.includes('beach') || extract.includes('coast')) return 'Beach/Coast';
    if (extract.includes('forest') || extract.includes('jungle')) return 'Forest';
    if (extract.includes('desert')) return 'Desert';
    if (extract.includes('volcano')) return 'Volcano';
    
    return 'Landmark';
  }

  // Comprehensive place data enrichment
  async enrichPlaceData(place) {
    const session = getSession();
    
    try {
      // Get all relationships and related entities
      const relationshipQuery = `
        MATCH (p {name: $placeName})
        OPTIONAL MATCH (p)-[r1]-(related1)
        OPTIONAL MATCH (p)-[r2*2]-(related2)
        WHERE related2 <> p AND NOT related2 IN [related1]
        RETURN p,
               collect(DISTINCT {type: type(r1), entity: related1, distance: 1}) as directRelations,
               collect(DISTINCT {type: type(r2[0]), entity: related2, distance: 2}) as indirectRelations
      `;
      
      const result = await session.run(relationshipQuery, { placeName: place.name });
      
      let enrichedPlace = { ...place };
      
      if (result.records.length > 0) {
        const record = result.records[0];
        const directRelations = record.get('directRelations') || [];
        const indirectRelations = record.get('indirectRelations') || [];
        
        enrichedPlace.relationships = {
          direct: directRelations.filter(r => r.entity).map(r => ({
            type: r.type,
            entity: r.entity.properties,
            distance: r.distance
          })),
          indirect: indirectRelations.filter(r => r.entity).map(r => ({
            type: r.type,
            entity: r.entity.properties,
            distance: r.distance
          }))
        };
      }
      
      // Add comprehensive metadata
      enrichedPlace.metadata = {
        categories: await this.categorizePlace(place),
        visitingInfo: await this.getVisitingInfo(place),
        culturalSignificance: await this.getCulturalSignificance(place),
        bestTimeToVisit: await this.getBestTimeToVisit(place),
        accessibility: await this.getAccessibilityInfo(place)
      };
      
      return enrichedPlace;
      
    } catch (error) {
      console.error('Error enriching place data:', error.message);
      return place;
    } finally {
      await session.close();
    }
  }
  // Generate intelligent itinerary using Gemini AI
  async generateItinerary(preferences) {
    const {
      destinations,
      duration,
      budget,
      interests = [],
      travelStyle = 'balanced',
      groupSize = 1,
      accessibility = false,
      startDate,
      endDate
    } = preferences;
    
    try {
      console.log('🚀 Generating AI-powered itinerary with preferences:', {
        destinations,
        duration,
        budget,
        interests: interests.slice(0, 3) // Log first few interests
      });

      // Use Gemini AI for intelligent itinerary generation
      const aiItinerary = await geminiService.generateItinerary(preferences);
      
      if (aiItinerary) {
        console.log('✅ Successfully generated AI itinerary');
        
        // Enhance with local data from our knowledge graph
        const enhancedItinerary = await this.enhanceWithLocalData(aiItinerary, preferences);
        
        return enhancedItinerary;
      }
      
      // Fallback to basic generation if AI fails
      console.log('⚠️ AI generation failed, using fallback method');
      return await this.generateBasicItinerary(preferences);
      
    } catch (error) {
      console.error('❌ Error generating itinerary:', error.message);
      
      // Return a basic itinerary as fallback
      return await this.generateBasicItinerary(preferences);
    }
  }

  // Apply intelligent filtering based on user preferences
  applyIntelligentFiltering(destinationData, preferences) {
    return destinationData.map(dest => ({
      ...dest,
      places: dest.places.filter(place => {
        // Budget filtering
        if (preferences.budget && place.priceLevel && place.priceLevel > preferences.budget) {
          return false;
        }
        
        // Interest matching
        if (preferences.interests.length > 0) {
          const placeInterests = [
            place.type?.toLowerCase(),
            ...(place.tags || []).map(tag => tag.toLowerCase()),
            ...(place.categories || []).map(cat => cat.toLowerCase())
          ];
          
          const hasMatchingInterest = preferences.interests.some(interest =>
            placeInterests.some(pi => pi.includes(interest.toLowerCase()))
          );
          
          if (!hasMatchingInterest) return false;
        }
        
        // Accessibility requirements
        if (preferences.accessibility && !place.metadata?.accessibility?.wheelchairAccessible) {
          return false;
        }
        
        return true;
      })
    }));
  }

  // Generate day-by-day itinerary with optimal routing
  async generateDayByDayItinerary(filteredData, preferences) {
    const days = [];
    const totalDays = this.calculateDurationInDays(preferences.startDate, preferences.endDate, preferences.duration);
    
    for (let day = 1; day <= totalDays; day++) {
      const dayItinerary = await this.generateSingleDayItinerary(filteredData, day, preferences);
      days.push(dayItinerary);
    }
    
    return {
      totalDays,
      estimatedBudget: this.calculateEstimatedBudget(days, preferences),
      days,
      metadata: {
        generated: new Date().toISOString(),
        preferences: preferences,
        optimization: 'time_and_interest_based'
      }
    };
  }

  // Generate single day itinerary with optimal routing
  async generateSingleDayItinerary(filteredData, dayNumber, preferences) {
    const activities = [];
    let currentTime = 9; // Start at 9 AM
    const endTime = preferences.travelStyle === 'relaxed' ? 18 : 20;
    
    // Select places for this day based on proximity and interest scores
    const dayPlaces = this.selectPlacesForDay(filteredData, dayNumber, preferences);
    
    // Optimize route
    const optimizedRoute = await this.optimizeRoute(dayPlaces);
    
    for (const place of optimizedRoute) {
      if (currentTime >= endTime) break;
      
      const duration = this.estimateVisitDuration(place, preferences.travelStyle);
      const activity = {
        time: this.formatTime(currentTime),
        place: place,
        duration: duration,
        description: await this.generateActivityDescription(place, preferences),
        tips: await this.generateTips(place, preferences)
      };
      
      activities.push(activity);
      currentTime += duration + 0.5; // Add travel time
    }
    
    return {
      day: dayNumber,
      date: this.calculateDate(preferences.startDate, dayNumber - 1),
      activities,
      meals: await this.suggestMeals(dayPlaces[0]?.location, preferences),
      transport: await this.suggestTransport(optimizedRoute),
      accommodation: dayNumber === 1 ? await this.suggestAccommodation(dayPlaces[0]?.location, preferences) : null
    };
  }

  // Utility methods for itinerary generation
  calculateDurationInDays(startDate, endDate, duration) {
    if (startDate && endDate) {
      return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    }
    return duration || 3;
  }

  formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  calculateDate(startDate, dayOffset) {
    if (!startDate) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  }
  // Additional helper methods implementation
  async categorizePlace(place) {
    const categories = [];
    const placeName = place.name?.toLowerCase() || '';
    const placeType = place.type?.toLowerCase() || '';
    const placeDescription = place.description?.toLowerCase() || '';
    
    // Historical places
    if (placeName.includes('castle') || placeName.includes('palace') || 
        placeType.includes('historical') || placeDescription.includes('ancient') ||
        placeDescription.includes('medieval') || placeDescription.includes('century')) {
      categories.push('historical');
    }
    
    // Cultural places
    if (placeType.includes('museum') || placeType.includes('temple') || 
        placeType.includes('church') || placeName.includes('cultural') ||
        placeDescription.includes('art') || placeDescription.includes('culture')) {
      categories.push('cultural');
    }
    
    // Natural places
    if (placeType.includes('mountain') || placeType.includes('park') || 
        placeType.includes('beach') || placeType.includes('forest') ||
        placeType.includes('natural') || placeName.includes('national park')) {
      categories.push('natural');
    }
    
    // Architectural places
    if (placeName.includes('tower') || placeName.includes('bridge') ||
        placeDescription.includes('architecture') || placeDescription.includes('building')) {
      categories.push('architectural');
    }
    
    // Religious places
    if (placeType.includes('church') || placeType.includes('temple') ||
        placeType.includes('mosque') || placeType.includes('cathedral') ||
        placeDescription.includes('religious') || placeDescription.includes('spiritual')) {
      categories.push('religious');
    }
    
    return categories.length > 0 ? categories : ['landmark'];
  }

  async getVisitingInfo(place) {
    const placeType = place.type?.toLowerCase() || '';
    
    // Default opening hours based on place type
    let openingHours = 'Daily 9:00 AM - 6:00 PM';
    let ticketPrice = 'Free';
    let duration = '1-2 hours';
    
    if (placeType.includes('museum')) {
      openingHours = 'Tue-Sun 10:00 AM - 6:00 PM';
      ticketPrice = '€10-25';
      duration = '2-4 hours';
    } else if (placeType.includes('church') || placeType.includes('cathedral')) {
      openingHours = 'Daily 7:00 AM - 7:00 PM';
      ticketPrice = 'Free (donations welcome)';
      duration = '30-60 minutes';
    } else if (placeType.includes('palace') || placeType.includes('castle')) {
      openingHours = 'Daily 9:00 AM - 5:00 PM';
      ticketPrice = '€15-30';
      duration = '2-3 hours';
    } else if (placeType.includes('park') || placeType.includes('garden')) {
      openingHours = 'Daily 6:00 AM - 8:00 PM';
      ticketPrice = 'Free';
      duration = '1-3 hours';
    } else if (placeType.includes('mountain') || placeType.includes('natural')) {
      openingHours = '24/7 (weather permitting)';
      ticketPrice = 'Free (parking may apply)';
      duration = '3-8 hours';
    }
    
    return {
      openingHours,
      ticketPrice,
      duration,
      bookingRequired: placeType.includes('museum') || placeType.includes('palace'),
      peakHours: '10:00 AM - 2:00 PM'
    };
  }

  async getCulturalSignificance(place) {
    const placeName = place.name?.toLowerCase() || '';
    const placeType = place.type?.toLowerCase() || '';
    
    if (placeName.includes('eiffel')) {
      return 'Iconic symbol of Paris and France, representing engineering excellence and romantic ideals';
    } else if (placeName.includes('louvre')) {
      return 'World\'s largest art museum, home to masterpieces including the Mona Lisa';
    } else if (placeName.includes('notre dame')) {
      return 'Gothic architectural masterpiece and spiritual heart of Paris for over 850 years';
    } else if (placeName.includes('tower of london')) {
      return 'Historic royal palace and fortress, keeper of the Crown Jewels';
    } else if (placeName.includes('big ben')) {
      return 'Iconic symbol of London and British parliamentary democracy';
    } else if (placeType.includes('temple')) {
      return 'Sacred space representing local spiritual traditions and architectural heritage';
    } else if (placeType.includes('museum')) {
      return 'Cultural institution preserving and showcasing local and international heritage';
    } else if (placeType.includes('palace')) {
      return 'Historical residence showcasing royal heritage and architectural grandeur';
    }
    
    return 'Significant landmark representing local culture and heritage';
  }

  async getBestTimeToVisit(place) {
    const placeType = place.type?.toLowerCase() || '';
    const location = place.location || place.address || '';
    
    // Season-based recommendations
    if (location.toLowerCase().includes('paris') || location.toLowerCase().includes('france')) {
      return 'April-June and September-October for mild weather and fewer crowds';
    } else if (location.toLowerCase().includes('london') || location.toLowerCase().includes('uk')) {
      return 'May-September for warmer weather, though indoor attractions are year-round';
    } else if (location.toLowerCase().includes('tokyo') || location.toLowerCase().includes('japan')) {
      return 'March-May (cherry blossoms) and September-November for pleasant weather';
    }
    
    // Type-based recommendations
    if (placeType.includes('museum')) {
      return 'Early morning or late afternoon to avoid crowds, weekdays preferred';
    } else if (placeType.includes('mountain') || placeType.includes('natural')) {
      return 'Early morning for best lighting and fewer crowds, check weather conditions';
    } else if (placeType.includes('beach')) {
      return 'Early morning or late afternoon, avoid midday sun';
    }
    
    return 'Spring and Fall generally offer the best weather and moderate crowds';
  }

  async getAccessibilityInfo(place) {
    const placeType = place.type?.toLowerCase() || '';
    const placeName = place.name?.toLowerCase() || '';
    
    // Modern attractions are generally more accessible
    let wheelchairAccessible = true;
    let elevatorAccess = true;
    let audioGuides = true;
    let visualAids = false;
    let accessibleParking = true;
    
    // Historical buildings may have limited accessibility
    if (placeType.includes('castle') || placeType.includes('historical') ||
        placeName.includes('medieval') || placeName.includes('ancient')) {
      wheelchairAccessible = false;
      elevatorAccess = false;
    }
    
    // Natural attractions may have limited accessibility
    if (placeType.includes('mountain') || placeType.includes('forest') ||
        placeType.includes('natural trail')) {
      wheelchairAccessible = false;
      elevatorAccess = false;
      accessibleParking = false;
    }
    
    // Museums and modern attractions typically have good accessibility
    if (placeType.includes('museum') || placeType.includes('modern')) {
      visualAids = true;
      audioGuides = true;
    }
    
    return {
      wheelchairAccessible,
      elevatorAccess,
      audioGuides,
      visualAids,
      accessibleParking,
      assistanceAvailable: true,
      accessibleRestrooms: wheelchairAccessible
    };
  }

  async getWeatherData(destination, startDate, endDate) {
    // Mock weather data - in production, integrate with weather API
    const weatherPatterns = {
      'paris': { temp: '15-22°C', conditions: 'Partly cloudy', precipitation: 'Low' },
      'london': { temp: '12-18°C', conditions: 'Overcast', precipitation: 'Medium' },
      'tokyo': { temp: '18-25°C', conditions: 'Clear', precipitation: 'Low' },
      'new york': { temp: '16-24°C', conditions: 'Sunny', precipitation: 'Low' },
      'rome': { temp: '20-28°C', conditions: 'Sunny', precipitation: 'Very Low' }
    };
    
    const destKey = destination.toLowerCase();
    const weather = weatherPatterns[destKey] || { temp: '18-25°C', conditions: 'Variable', precipitation: 'Medium' };
    
    return {
      averageTemp: weather.temp,
      conditions: weather.conditions,
      precipitation: weather.precipitation,
      recommendation: this.getWeatherRecommendation(weather)
    };
  }

  getWeatherRecommendation(weather) {
    if (weather.precipitation === 'High') {
      return 'Pack umbrella and waterproof clothing';
    } else if (weather.conditions.includes('Sunny')) {
      return 'Bring sunscreen and hat, perfect for outdoor activities';
    } else if (weather.conditions.includes('Cold')) {
      return 'Pack warm clothing and layers';
    }
    return 'Pack layers for variable weather conditions';
  }

  async getLocalEvents(destination, startDate, endDate) {
    // Mock events data - in production, integrate with events API
    const events = [
      {
        name: 'Local Festival',
        date: startDate,
        description: 'Traditional cultural celebration',
        location: destination
      }
    ];
    return events;
  }

  selectPlacesForDay(filteredData, dayNumber, preferences) {
    // Distribute places across days, prioritizing by rating and interest match
    const allPlaces = filteredData.flatMap(dest => dest.places);
    const placesPerDay = Math.ceil(allPlaces.length / preferences.duration);
    
    const startIndex = (dayNumber - 1) * placesPerDay;
    const endIndex = Math.min(startIndex + placesPerDay, allPlaces.length);
    
    return allPlaces.slice(startIndex, endIndex);
  }
  async optimizeRoute(places, options = {}) {
    try {
      // Simple optimization - in production, use actual routing API
      const optimizedPlaces = [...places].sort((a, b) => {
        // If places are strings (place names), just return them as is
        if (typeof a === 'string' && typeof b === 'string') {
          return 0; // Keep original order for string place names
        }
        
        // Sort by rating if available (for place objects)
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        }
        return 0;
      });
      
      // Return in the expected format
      return {
        optimizedRoute: optimizedPlaces,
        totalDuration: `${optimizedPlaces.length * 2} hours`,
        totalDistance: `${optimizedPlaces.length * 5} km`,
        travelMode: options.travelMode || 'walking',
        startLocation: options.startLocation || null
      };
    } catch (error) {
      console.error('Error optimizing route:', error);
      return {
        optimizedRoute: places,
        totalDuration: `${places.length * 2} hours`,
        totalDistance: `${places.length * 5} km`,
        travelMode: options.travelMode || 'walking',
        startLocation: options.startLocation || null
      };
    }
  }

  estimateVisitDuration(place, travelStyle) {
    const placeType = place.type?.toLowerCase() || '';
    const baseMultiplier = {
      'rushed': 0.7,
      'balanced': 1.0,
      'relaxed': 1.5
    };
    
    let baseDuration = 2; // hours
    
    if (placeType.includes('museum')) baseDuration = 3;
    else if (placeType.includes('palace') || placeType.includes('castle')) baseDuration = 2.5;
    else if (placeType.includes('church') || placeType.includes('temple')) baseDuration = 1;
    else if (placeType.includes('park') || placeType.includes('garden')) baseDuration = 1.5;
    else if (placeType.includes('mountain') || placeType.includes('natural')) baseDuration = 4;
    
    return baseDuration * (baseMultiplier[travelStyle] || 1.0);
  }

  async generateActivityDescription(place, preferences) {
    const description = `Explore ${place.name}`;
    
    if (place.description) {
      return `${description} - ${place.description.substring(0, 100)}...`;
    }
    
    const placeType = place.type?.toLowerCase() || '';
    if (placeType.includes('museum')) {
      return `${description} and discover its world-class collections and exhibitions`;
    } else if (placeType.includes('palace')) {
      return `${description} and admire the magnificent architecture and royal history`;
    } else if (placeType.includes('natural')) {
      return `${description} and enjoy the natural beauty and scenic views`;
    }
    
    return `${description} and experience this remarkable ${placeType || 'landmark'}`;
  }

  async generateTips(place, preferences) {
    const tips = [];
    const placeType = place.type?.toLowerCase() || '';
    
    // Universal tips
    tips.push('Arrive early to avoid crowds');
    tips.push('Bring a camera for memorable photos');
    
    // Type-specific tips
    if (placeType.includes('museum')) {
      tips.push('Consider booking tickets online in advance');
      tips.push('Audio guides enhance the experience');
    } else if (placeType.includes('church') || placeType.includes('temple')) {
      tips.push('Dress modestly (cover shoulders and knees)');
      tips.push('Maintain quiet and respectful behavior');
    } else if (placeType.includes('mountain') || placeType.includes('natural')) {
      tips.push('Wear comfortable hiking shoes');
      tips.push('Bring water and snacks');
      tips.push('Check weather conditions before visiting');
    } else if (placeType.includes('palace')) {
      tips.push('Book guided tours for historical insights');
      tips.push('Allow extra time for security checks');
    }
    
    // Accessibility tips
    if (preferences.accessibility) {
      tips.push('Check accessibility facilities before visiting');
      tips.push('Contact venue for assistance if needed');
    }
    
    return tips.slice(0, 4); // Limit to 4 tips
  }

  async suggestMeals(location, preferences) {
    // Implementation for meal suggestions
    return {
      breakfast: 'Local café near hotel',
      lunch: 'Traditional restaurant',
      dinner: 'Recommended local cuisine'
    };
  }

  async suggestTransport(route) {
    // Implementation for transport suggestions
    return {
      method: 'Walking + Metro',
      cost: '€10-15',
      duration: '30-45 minutes between locations'
    };
  }

  async suggestAccommodation(location, preferences) {
    // Implementation for accommodation suggestions
    return {
      type: 'Hotel',
      area: 'City Center',
      priceRange: '€100-200/night'
    };
  }

  calculateEstimatedBudget(days, preferences) {
    // Implementation for budget calculation
    return {
      total: '€500-800',
      breakdown: {
        accommodation: '€300',
        food: '€200',
        transport: '€100',
        activities: '€200'
      }
    };
  }

  async addRecommendationsAndAlternatives(itinerary, preferences) {
    // Add additional recommendations and alternatives
    return {
      ...itinerary,
      recommendations: {
        alternativeActivities: await this.getAlternativeActivities(itinerary, preferences),
        localTips: await this.getLocalTips(itinerary),
        emergencyInfo: await this.getEmergencyInfo(itinerary),
        culturalEtiquette: await this.getCulturalEtiquette(itinerary)
      }
    };
  }

  async getAlternativeActivities(itinerary, preferences) {
    return ['Alternative museum visits', 'Local markets', 'Walking tours'];
  }

  async getLocalTips(itinerary) {
    return ['Use public transport cards', 'Learn basic local phrases', 'Respect local customs'];
  }

  async getEmergencyInfo(itinerary) {
    return {
      emergencyNumber: '112',
      nearestHospital: 'City General Hospital',
      embassy: 'Contact information for your embassy'
    };
  }

  async getCulturalEtiquette(itinerary) {
    return ['Dress appropriately for religious sites', 'Tipping customs', 'Business hours'];  }

  // Enhance AI-generated itinerary with local knowledge graph data
  async enhanceWithLocalData(aiItinerary, preferences) {
    try {
      console.log('🔍 Enhancing AI itinerary with local data...');
      
      // Enhance each day with local insights
      for (let day of aiItinerary.days) {
        if (day.location) {
          // Get local places from knowledge graph
          const localPlaces = await this.lookupPlace(day.location);
          day.localInsights = localPlaces.slice(0, 5); // Add top 5 local places
          
          // Add weather data
          day.weather = await this.getWeatherData(day.location, preferences.startDate, preferences.endDate);
        }
      }
      
      return aiItinerary;
    } catch (error) {
      console.error('Error enhancing with local data:', error.message);
      return aiItinerary; // Return original if enhancement fails
    }
  }

  // Generate basic itinerary as fallback
  async generateBasicItinerary(preferences) {
    console.log('📝 Generating basic fallback itinerary...');
    
    const {
      destinations,
      duration,
      budget,
      interests = [],
      travelStyle = 'balanced',
      groupSize = 1
    } = preferences;
    
    try {
      const itinerary = {
        title: `${duration}-Day Trip to ${destinations.join(', ')}`,
        summary: `A ${budget}-budget ${duration}-day journey exploring ${destinations.join(' and ')}`,
        totalDays: duration,
        destinations: destinations,
        estimatedBudget: this.calculateBasicBudget(preferences),
        days: [],
        generalTips: [
          'Check visa requirements and travel documents',
          'Research local customs and etiquette',
          'Pack weather-appropriate clothing',
          'Keep emergency contacts handy',
          'Download offline maps'
        ],
        packingList: [
          'Comfortable walking shoes',
          'Weather-appropriate clothing',
          'Phone charger and adapter',
          'First aid basics',
          'Copy of important documents'
        ],
        emergencyInfo: {
          importantNumbers: ['Local emergency services'],
          hospitals: ['Research local hospitals'],
          embassies: ['Contact relevant embassies for international travel']
        },
        generatedBy: 'basic-fallback',
        generatedAt: new Date().toISOString()
      };

      // Generate basic days
      for (let i = 1; i <= duration; i++) {
        const destinationIndex = Math.floor((i - 1) / Math.ceil(duration / destinations.length));
        const currentDestination = destinations[destinationIndex] || destinations[0];
        
        const day = {
          day: i,
          date: null,
          location: currentDestination,
          theme: i === 1 ? 'Arrival & First Impressions' : 
                 i === duration ? 'Final Exploration' : 
                 `Discover ${currentDestination}`,
          activities: await this.generateBasicActivities(currentDestination, preferences),
          meals: this.generateBasicMeals(budget),
          accommodation: this.generateBasicAccommodation(currentDestination, budget),
          transportation: {
            methods: ['walking', 'public transport', 'taxi'],
            tips: ['Use local transport apps', 'Consider day passes', 'Keep small change ready']
          },
          budgetBreakdown: this.generateDayBudget(budget, groupSize)
        };
        
        itinerary.days.push(day);
      }
      
      return itinerary;
      
    } catch (error) {
      console.error('Error generating basic itinerary:', error.message);
      throw new Error('Unable to generate itinerary');
    }
  }

  async generateBasicActivities(destination, preferences) {
    try {
      // Try to get some places from knowledge graph
      const places = await this.lookupPlace(destination);
      const selectedPlaces = places.slice(0, 3);
      
      const activities = [
        {
          time: '09:00',
          activity: `Explore ${destination} highlights`,
          description: `Visit the main attractions and landmarks of ${destination}`,
          location: destination,
          duration: '3-4 hours',
          cost: preferences.budget === 'low' ? '$10-20' : preferences.budget === 'high' ? '$30-50' : '$15-30',
          tips: ['Start early to avoid crowds', 'Bring comfortable shoes', 'Stay hydrated'],
          alternatives: ['Indoor activities in case of weather']
        }
      ];

      // Add specific places if found
      if (selectedPlaces.length > 0) {
        selectedPlaces.forEach((place, index) => {
          if (index < 2) { // Limit to 2 additional activities
            activities.push({
              time: index === 0 ? '13:00' : '15:30',
              activity: place.name || `Local attraction`,
              description: place.description || `Explore this interesting location in ${destination}`,
              location: place.address || destination,
              duration: '1-2 hours',
              cost: place.priceLevel ? `$${place.priceLevel * 10}-${place.priceLevel * 20}` : 'Varies',
              tips: ['Check opening hours', 'Consider booking in advance'],
              alternatives: ['Nearby similar attractions']
            });
          }
        });
      } else {
        // Add generic activities if no specific places found
        activities.push(
          {
            time: '13:00',
            activity: 'Local cultural experience',
            description: `Immerse yourself in ${destination}'s local culture`,
            location: `${destination} city center`,
            duration: '2-3 hours',
            cost: preferences.budget === 'low' ? '$5-15' : preferences.budget === 'high' ? '$25-40' : '$10-25',
            tips: ['Interact with locals', 'Try traditional activities'],
            alternatives: ['Visit local museums or galleries']
          },
          {
            time: '16:00',
            activity: 'Scenic walk or relaxation',
            description: `Enjoy the atmosphere and scenery of ${destination}`,
            location: 'Local parks or scenic areas',
            duration: '1-2 hours',
            cost: 'Free',
            tips: ['Perfect for photos', 'Good time to rest'],
            alternatives: ['Café visits or local shopping']
          }
        );
      }
      
      return activities;
    } catch (error) {
      console.error('Error generating basic activities:', error.message);
      return [
        {
          time: '09:00',
          activity: 'Explore destination',
          description: `Spend the day discovering ${destination}`,
          location: destination,
          duration: 'Full day',
          cost: 'Varies',
          tips: ['Be flexible with your schedule'],
          alternatives: ['Indoor activities']
        }
      ];
    }
  }

  generateBasicMeals(budget) {
    const budgetMultipliers = { low: 1, medium: 1.5, high: 2.5 };
    const multiplier = budgetMultipliers[budget] || 1.5;
    
    return {
      breakfast: {
        restaurant: 'Local café or hotel',
        cuisine: 'Local breakfast',
        cost: `$${Math.round(8 * multiplier)}-${Math.round(15 * multiplier)}`,
        location: 'Near accommodation'
      },
      lunch: {
        restaurant: 'Traditional local restaurant',
        cuisine: 'Regional specialties',
        cost: `$${Math.round(12 * multiplier)}-${Math.round(25 * multiplier)}`,
        location: 'City center or tourist area'
      },
      dinner: {
        restaurant: 'Recommended local dining',
        cuisine: 'Local cuisine',
        cost: `$${Math.round(20 * multiplier)}-${Math.round(40 * multiplier)}`,
        location: 'Popular dining district'
      }
    };
  }

  generateBasicAccommodation(destination, budget) {
    const accommodationTypes = {
      low: { type: 'Hostel/Budget hotel', cost: '$25-50' },
      medium: { type: 'Mid-range hotel', cost: '$60-120' },
      high: { type: 'Luxury hotel/Resort', cost: '$150-300' }
    };
    
    const accom = accommodationTypes[budget] || accommodationTypes.medium;
    
    return {
      name: `${budget.charAt(0).toUpperCase() + budget.slice(1)}-range accommodation`,
      type: accom.type,
      location: `${destination} central area`,
      estimatedCost: `${accom.cost} per night`
    };
  }

  generateDayBudget(budget, groupSize) {
    const baseBudgets = {
      low: { activities: 20, meals: 35, accommodation: 40, transportation: 15 },
      medium: { activities: 50, meals: 70, accommodation: 90, transportation: 25 },
      high: { activities: 100, meals: 140, accommodation: 200, transportation: 40 }
    };
    
    const base = baseBudgets[budget] || baseBudgets.medium;
    
    return {
      activities: `$${base.activities * groupSize}`,
      meals: `$${base.meals * groupSize}`,
      accommodation: `$${base.accommodation}`,
      transportation: `$${base.transportation}`
    };
  }

  calculateBasicBudget(preferences) {
    const { budget, duration, groupSize } = preferences;
    
    const dailyBudgets = {
      low: 110,
      medium: 235,
      high: 480
    };
    
    const dailyAmount = dailyBudgets[budget] || dailyBudgets.medium;
    const total = dailyAmount * duration;
    const totalWithGroup = total + ((groupSize - 1) * total * 0.7); // Discount for additional people
    
    return {
      total: `$${Math.round(totalWithGroup)}`,
      breakdown: {
        accommodation: `$${Math.round(total * 0.4)}`,
        food: `$${Math.round(total * 0.35 * groupSize)}`,
        activities: `$${Math.round(total * 0.2 * groupSize)}`,
        transportation: `$${Math.round(total * 0.15)}`
      }
    };
  }

  // ================================
  // RAG (Retrieval-Augmented Generation) System
  // ================================

  /**
   * Generate intelligent travel suggestions using RAG
   * This is the main RAG method that combines retrieval with generation
   */
  async generateSuggestions(preferences) {
    try {
      console.log('🧠 RAG: Generating intelligent travel suggestions with preferences:', preferences);
      
      const { interests = [], budget = 'medium', season = 'any', location, travelStyle = 'balanced' } = preferences;
      
      // Step 1: Retrieve relevant knowledge from graph
      const retrievedKnowledge = await this.retrieveRelevantKnowledge(preferences);
      
      // Step 2: Apply semantic filtering and ranking
      const rankedRecommendations = await this.applySemanticRanking(retrievedKnowledge, preferences);
      
      // Step 3: Generate personalized descriptions using AI
      const personalizedSuggestions = await this.generatePersonalizedDescriptions(rankedRecommendations, preferences);
      
      // Step 4: Add context-aware insights
      const enrichedSuggestions = await this.addContextualInsights(personalizedSuggestions, preferences);
      
      return {
        total: enrichedSuggestions.length,
        preferences: preferences,
        methodology: 'knowledge-graph-rag',
        confidence: this.calculateConfidenceScore(enrichedSuggestions, preferences),
        suggestions: enrichedSuggestions.slice(0, 10), // Top 10 recommendations
        metadata: {
          knowledgeSourcesUsed: retrievedKnowledge.sources,
          processingTime: Date.now(),
          aiEnhanced: true
        }
      };
      
    } catch (error) {
      console.error('❌ RAG: Error generating suggestions:', error.message);
      
      // Fallback to basic suggestions
      return await this.generateBasicSuggestions(preferences);
    }
  }

  /**
   * Retrieve relevant knowledge from the knowledge graph based on user preferences
   */
  async retrieveRelevantKnowledge(preferences) {
    const session = getSession();
    
    try {
      const { interests = [], budget, location, season, travelStyle } = preferences;
      
      // Build dynamic query based on interests and preferences
      let cypherQuery = `
        MATCH (p:Place)
        OPTIONAL MATCH (p)-[r]-(related)
        WHERE 1=1
      `;
      
      const params = {};
      const conditions = [];
      
      // Interest-based filtering
      if (interests.length > 0) {
        const interestConditions = interests.map((interest, index) => {
          params[`interest${index}`] = interest.toLowerCase();
          return `(
            toLower(p.type) CONTAINS $interest${index} OR
            toLower(p.description) CONTAINS $interest${index} OR
            any(tag in p.tags WHERE toLower(tag) CONTAINS $interest${index}) OR
            any(cat in p.categories WHERE toLower(cat) CONTAINS $interest${index})
          )`;
        });
        conditions.push(`(${interestConditions.join(' OR ')})`);
      }
      
      // Location-based filtering
      if (location) {
        params.location = location.toLowerCase();
        conditions.push(`(toLower(p.city) CONTAINS $location OR toLower(p.country) CONTAINS $location)`);
      }
      
      // Budget filtering
      if (budget && budget !== 'any') {
        const budgetLevel = budget === 'low' ? 2 : budget === 'medium' ? 3 : 4;
        params.budgetLevel = budgetLevel;
        conditions.push(`(p.priceLevel IS NULL OR p.priceLevel <= $budgetLevel)`);
      }
      
      // Season-based filtering
      if (season && season !== 'any') {
        params.season = season.toLowerCase();
        conditions.push(`(p.bestSeason IS NULL OR toLower(p.bestSeason) CONTAINS $season)`);
      }
      
      if (conditions.length > 0) {
        cypherQuery += ` AND ${conditions.join(' AND ')}`;
      }
      
      cypherQuery += `
        RETURN p,
               collect(DISTINCT related) as relatedEntities,
               collect(DISTINCT type(r)) as relationshipTypes,
               p.popularity as popularity,
               p.rating as rating
        ORDER BY 
          CASE WHEN p.popularity IS NOT NULL THEN p.popularity ELSE 0 END DESC,
          CASE WHEN p.rating IS NOT NULL THEN p.rating ELSE 0 END DESC
        LIMIT 50
      `;
      
      const result = await session.run(cypherQuery, params);
      
      const retrievedPlaces = result.records.map(record => {
        const place = record.get('p').properties;
        const relatedEntities = record.get('relatedEntities') || [];
        const relationshipTypes = record.get('relationshipTypes') || [];
        
        return {
          ...place,
          relatedEntities: relatedEntities.map(entity => entity.properties),
          relationshipTypes,
          contextualConnections: relatedEntities.length,
          source: 'knowledge_graph'
        };
      });
      
      console.log(`🔍 RAG: Retrieved ${retrievedPlaces.length} places from knowledge graph`);
      
      return {
        places: retrievedPlaces,
        sources: ['knowledge_graph', 'relationship_analysis'],
        totalRetrieved: retrievedPlaces.length,
        queryComplexity: conditions.length
      };
      
    } catch (error) {
      console.error('Error retrieving knowledge:', error.message);
      return { places: [], sources: [], totalRetrieved: 0, queryComplexity: 0 };
    } finally {
      await session.close();
    }
  }

  /**
   * Apply semantic ranking to retrieved knowledge
   */
  async applySemanticRanking(retrievedKnowledge, preferences) {
    const { places } = retrievedKnowledge;
    const { interests = [], travelStyle, budget } = preferences;
    
    console.log('🎯 RAG: Applying semantic ranking to retrieved places');
    
    // Calculate relevance scores for each place
    const rankedPlaces = places.map(place => {
      let relevanceScore = 0;
      const factors = [];
      
      // Interest matching score (40% weight)
      const interestScore = this.calculateInterestScore(place, interests);
      relevanceScore += interestScore * 0.4;
      factors.push({ factor: 'interest_match', score: interestScore, weight: 0.4 });
      
      // Quality indicators (30% weight)
      const qualityScore = this.calculateQualityScore(place);
      relevanceScore += qualityScore * 0.3;
      factors.push({ factor: 'quality', score: qualityScore, weight: 0.3 });
      
      // Contextual connections (20% weight)
      const contextScore = this.calculateContextScore(place);
      relevanceScore += contextScore * 0.2;
      factors.push({ factor: 'context', score: contextScore, weight: 0.2 });
      
      // Travel style compatibility (10% weight)
      const styleScore = this.calculateStyleScore(place, travelStyle);
      relevanceScore += styleScore * 0.1;
      factors.push({ factor: 'travel_style', score: styleScore, weight: 0.1 });
      
      return {
        ...place,
        relevanceScore: Math.round(relevanceScore * 100) / 100,
        rankingFactors: factors,
        recommendationReason: this.generateRecommendationReason(place, factors, interests)
      };
    });
    
    // Sort by relevance score
    rankedPlaces.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`📊 RAG: Ranked ${rankedPlaces.length} places by relevance`);
    
    return rankedPlaces;
  }

  /**
   * Calculate interest matching score
   */
  calculateInterestScore(place, interests) {
    if (interests.length === 0) return 0.5; // neutral score if no interests specified
    
    const placeTerms = [
      place.name?.toLowerCase() || '',
      place.type?.toLowerCase() || '',
      place.description?.toLowerCase() || '',
      ...(place.tags || []).map(tag => tag.toLowerCase()),
      ...(place.categories || []).map(cat => cat.toLowerCase())
    ].join(' ');
    
    let matchCount = 0;
    interests.forEach(interest => {
      if (placeTerms.includes(interest.toLowerCase())) {
        matchCount++;
      }
    });
    
    return Math.min(matchCount / interests.length, 1.0);
  }

  /**
   * Calculate quality score based on ratings, popularity, etc.
   */
  calculateQualityScore(place) {
    let score = 0;
    let factors = 0;
    
    // Rating score
    if (place.rating) {
      score += place.rating / 5.0; // Normalize to 0-1
      factors++;
    }
    
    // Popularity score
    if (place.popularity) {
      score += Math.min(place.popularity / 100, 1.0); // Normalize to 0-1
      factors++;
    }
    
    // Review count (if available)
    if (place.reviewCount) {
      score += Math.min(place.reviewCount / 1000, 1.0); // Normalize to 0-1
      factors++;
    }
    
    return factors > 0 ? score / factors : 0.5; // Default to neutral if no quality data
  }

  /**
   * Calculate context score based on relationships and connections
   */
  calculateContextScore(place) {
    const connectionCount = place.contextualConnections || 0;
    const relationshipDiversity = (place.relationshipTypes || []).length;
    
    // More connections and relationship types = higher context score
    const connectionScore = Math.min(connectionCount / 10, 1.0);
    const diversityScore = Math.min(relationshipDiversity / 5, 1.0);
    
    return (connectionScore + diversityScore) / 2;
  }

  /**
   * Calculate travel style compatibility score
   */
  calculateStyleScore(place, travelStyle) {
    const placeType = place.type?.toLowerCase() || '';
    const placeDescription = place.description?.toLowerCase() || '';
    
    const styleKeywords = {
      'adventure': ['outdoor', 'adventure', 'hiking', 'sports', 'extreme', 'active'],
      'cultural': ['museum', 'art', 'history', 'culture', 'heritage', 'traditional'],
      'relaxed': ['spa', 'beach', 'peaceful', 'quiet', 'scenic', 'garden'],
      'family': ['family', 'kids', 'children', 'fun', 'entertainment', 'safe'],
      'luxury': ['luxury', 'exclusive', 'premium', 'fine', 'elegant', 'upscale'],
      'budget': ['free', 'cheap', 'affordable', 'budget', 'economic']
    };
    
    const keywords = styleKeywords[travelStyle] || [];
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      if (placeType.includes(keyword) || placeDescription.includes(keyword)) {
        matchCount++;
      }
    });
    
    return keywords.length > 0 ? matchCount / keywords.length : 0.5;
  }

  /**
   * Generate explanation for why this place is recommended
   */
  generateRecommendationReason(place, factors, interests) {
    const strongFactors = factors.filter(f => f.score * f.weight > 0.15);
    const topFactor = factors.reduce((prev, current) => 
      (prev.score * prev.weight) > (current.score * current.weight) ? prev : current
    );
    
    const reasons = [];
    
    if (topFactor.factor === 'interest_match') {
      reasons.push(`Matches your interests in ${interests.slice(0, 2).join(' and ')}`);
    } else if (topFactor.factor === 'quality') {
      reasons.push(`Highly rated destination with excellent reviews`);
    } else if (topFactor.factor === 'context') {
      reasons.push(`Rich cultural and historical connections`);
    } else if (topFactor.factor === 'travel_style') {
      reasons.push(`Perfect for your preferred travel style`);
    }
    
    if (place.rating && place.rating >= 4.5) {
      reasons.push(`Outstanding ${place.rating}/5 star rating`);
    }
    
    if (place.contextualConnections > 5) {
      reasons.push(`Connects to ${place.contextualConnections} other interesting places`);
    }
    
    return reasons.slice(0, 3).join('. ') + '.';
  }

  /**
   * Generate personalized descriptions using AI
   */
  async generatePersonalizedDescriptions(rankedPlaces, preferences) {
    console.log('✨ RAG: Generating personalized descriptions');
    
    // Process places in batches for efficiency
    const personalizedPlaces = await Promise.all(
      rankedPlaces.slice(0, 15).map(async (place) => {
        try {
          // Use Gemini AI to generate personalized description
          const personalizedDescription = await this.generateAIDescription(place, preferences);
          
          return {
            ...place,
            personalizedDescription,
            enhancedByAI: true
          };
        } catch (error) {
          console.error('Error generating AI description:', error.message);
          
          // Fallback to template-based description
          return {
            ...place,
            personalizedDescription: this.generateTemplateDescription(place, preferences),
            enhancedByAI: false
          };
        }
      })
    );
    
    return personalizedPlaces;
  }

  /**
   * Generate AI-powered personalized description
   */
  async generateAIDescription(place, preferences) {
    if (!geminiService) return this.generateTemplateDescription(place, preferences);
    
    try {
      const prompt = `
        Create a personalized travel recommendation description for this place:
        
        Place: ${place.name}
        Type: ${place.type || 'Attraction'}
        Description: ${place.description || 'No description available'}
        Location: ${place.city || place.country || 'Unknown'}
        
        User Preferences:
        - Interests: ${preferences.interests?.join(', ') || 'General travel'}
        - Budget: ${preferences.budget || 'medium'}
        - Travel Style: ${preferences.travelStyle || 'balanced'}
        
        Why recommended: ${place.recommendationReason}
        
        Write a compelling, personalized 2-3 sentence description that explains why this place would appeal to this specific traveler. Focus on their interests and travel style. Be enthusiastic but informative.
        
        Response format: Just the description, no additional text.
      `;
      
      const description = await geminiService.generateChatResponse(prompt, {
        context: 'personalized_recommendation',
        place: place.name,
        interests: preferences.interests
      });
      
      return description || this.generateTemplateDescription(place, preferences);
      
    } catch (error) {
      console.error('AI description generation failed:', error.message);
      return this.generateTemplateDescription(place, preferences);
    }
  }

  /**
   * Generate template-based description as fallback
   */
  generateTemplateDescription(place, preferences) {
    const { interests = [], budget, travelStyle } = preferences;
    
    const templates = [
      `${place.name} is perfect for ${interests.slice(0, 2).join(' and ')} enthusiasts.`,
      `This ${place.type || 'destination'} offers an excellent ${budget || 'moderate'} budget experience.`,
      `Ideal for ${travelStyle || 'balanced'} travelers seeking authentic experiences.`
    ];
    
    const description = templates[0] + ' ' + (place.description || 'A must-visit destination with unique character.');
    
    return description.length > 150 ? description.substring(0, 147) + '...' : description;
  }

  /**
   * Add contextual insights to suggestions
   */
  async addContextualInsights(personalizedSuggestions, preferences) {
    console.log('🔗 RAG: Adding contextual insights');
    
    return personalizedSuggestions.map(place => {
      const insights = {
        bestTimeToVisit: this.generateBestTimeInsight(place, preferences),
        budgetTips: this.generateBudgetTips(place, preferences.budget),
        culturalContext: this.generateCulturalContext(place),
        similarPlaces: this.findSimilarPlaces(place, personalizedSuggestions),
        practicalInfo: this.generatePracticalInfo(place)
      };
      
      return {
        ...place,
        insights,
        ragEnhanced: true
      };
    });
  }

  /**
   * Generate best time to visit insight
   */
  generateBestTimeInsight(place, preferences) {
    const season = preferences.season;
    const location = place.city || place.country || '';
    
    if (season && season !== 'any') {
      return `${season.charAt(0).toUpperCase() + season.slice(1)} is an excellent time to visit, matching your preferences.`;
    }
    
    // Location-based recommendations
    if (location.toLowerCase().includes('europe')) {
      return 'Best visited in late spring (May-June) or early fall (September-October) for pleasant weather.';
    } else if (location.toLowerCase().includes('asia')) {
      return 'Consider visiting during the dry season for the best experience.';
    }
    
    return 'Check local weather patterns and seasonal events for optimal timing.';
  }

  /**
   * Generate budget tips
   */
  generateBudgetTips(place, budget) {
    const tips = [];
    
    if (budget === 'low') {
      tips.push('Look for free walking tours and public access areas');
      tips.push('Consider visiting during off-peak hours for potential discounts');
    } else if (budget === 'medium') {
      tips.push('Book tickets online in advance for better prices');
      tips.push('Combine with nearby attractions for package deals');
    } else {
      tips.push('Consider VIP or skip-the-line experiences');
      tips.push('Look into exclusive guided tours for deeper insights');
    }
    
    if (place.type?.toLowerCase().includes('museum')) {
      tips.push('Many museums offer free admission days');
    }
    
    return tips.slice(0, 2);
  }

  /**
   * Generate cultural context
   */
  generateCulturalContext(place) {
    const type = place.type?.toLowerCase() || '';
    const description = place.description?.toLowerCase() || '';
    
    if (type.includes('temple') || type.includes('church')) {
      return 'Dress modestly and be respectful of religious customs and practices.';
    } else if (type.includes('museum') || description.includes('art')) {
      return 'Take time to appreciate the cultural significance and historical context.';
    } else if (type.includes('market') || description.includes('local')) {
      return 'Perfect opportunity to experience authentic local culture and traditions.';
    }
    
    return 'Immerse yourself in the local culture and customs for a richer experience.';
  }

  /**
   * Find similar places
   */
  findSimilarPlaces(currentPlace, allSuggestions) {
    return allSuggestions
      .filter(place => 
        place.name !== currentPlace.name && 
        (place.type === currentPlace.type || 
         (place.categories && currentPlace.categories && 
          place.categories.some(cat => currentPlace.categories.includes(cat))))
      )
      .slice(0, 3)
      .map(place => ({
        name: place.name,
        type: place.type,
        relevanceScore: place.relevanceScore
      }));
  }

  /**
   * Generate practical information
   */
  generatePracticalInfo(place) {
    const info = {
      estimatedVisitDuration: this.estimateVisitDuration(place, 'balanced'),
      accessibility: place.accessibility || 'Contact venue for accessibility information',
      bookingRequired: place.type?.toLowerCase().includes('museum') || place.type?.toLowerCase().includes('tour')
    };
    
    if (place.openingHours) {
      info.openingHours = place.openingHours;
    }
    
    if (place.website) {
      info.website = place.website;
    }
    
    return info;
  }

  /**
   * Calculate confidence score for the recommendations
   */
  calculateConfidenceScore(suggestions, preferences) {
    if (suggestions.length === 0) return 0;
    
    const avgRelevanceScore = suggestions.reduce((sum, place) => sum + place.relevanceScore, 0) / suggestions.length;
    const knowledgeDepth = suggestions.reduce((sum, place) => sum + (place.contextualConnections || 0), 0) / suggestions.length;
    const aiEnhancementRate = suggestions.filter(place => place.enhancedByAI).length / suggestions.length;
    
    // Weighted confidence calculation
    const confidence = (avgRelevanceScore * 0.4) + (Math.min(knowledgeDepth / 5, 1) * 0.3) + (aiEnhancementRate * 0.3);
    
    return Math.round(confidence * 100);
  }

  /**
   * Generate basic suggestions as fallback
   */
  async generateBasicSuggestions(preferences) {
    console.log('📝 RAG: Generating basic fallback suggestions');
    
    const { interests = [], budget = 'medium' } = preferences;
    
    // Basic template suggestions
    const basicSuggestions = [
      {
        name: 'Popular Local Attractions',
        type: 'General',
        personalizedDescription: `Explore the most popular attractions that align with your interests in ${interests.join(', ') || 'general travel'}.`,
        relevanceScore: 0.7,
        recommendationReason: 'Popular choice for travelers with similar preferences.',
        insights: {
          bestTimeToVisit: 'Peak season offers the best experience',
          budgetTips: ['Book in advance for better prices'],
          culturalContext: 'Experience local culture and traditions',
          practicalInfo: { estimatedVisitDuration: '2-4 hours', bookingRequired: false }
        },
        ragEnhanced: false
      }
    ];
    
    return {
      total: basicSuggestions.length,
      preferences: preferences,
      methodology: 'basic-fallback',
      confidence: 60,
      suggestions: basicSuggestions,
      metadata: {
        knowledgeSourcesUsed: ['template'],
        processingTime: Date.now(),
        aiEnhanced: false
      }
    };
  }

  /**
   * Get smart recommendations based on user history and behavior
   */
  async getSmartRecommendations(userId, preferences = {}) {
    try {
      console.log('🤖 RAG: Generating smart recommendations for user:', userId);
      
      // Get user's past preferences and interactions
      const userHistory = await this.getUserInteractionHistory(userId);
      
      // Combine explicit preferences with learned preferences
      const enhancedPreferences = {
        ...preferences,
        interests: [...(preferences.interests || []), ...(userHistory.inferredInterests || [])],
        learnedPatterns: userHistory.patterns || []
      };
      
      // Generate suggestions using enhanced preferences
      const suggestions = await this.generateSuggestions(enhancedPreferences);
      
      // Add personalization layer
      const personalizedSuggestions = await this.addPersonalizationLayer(suggestions, userHistory);
      
      return personalizedSuggestions;
      
    } catch (error) {
      console.error('Error generating smart recommendations:', error.message);
      return await this.generateSuggestions(preferences);
    }
  }

  /**
   * Get user interaction history (placeholder for now)
   */
  async getUserInteractionHistory(userId) {
    // This would integrate with a user analytics system
    // For now, return empty history
    return {
      inferredInterests: [],
      patterns: [],
      visitedPlaces: [],
      preferredBudget: 'medium',
      preferredTravelStyle: 'balanced'
    };
  }

  /**
   * Add personalization layer to recommendations
   */
  async addPersonalizationLayer(suggestions, userHistory) {
    // Enhance suggestions with user-specific insights
    return {
      ...suggestions,
      personalized: true,
      userSpecificInsights: {
        basedOnHistory: userHistory.visitedPlaces.length > 0,
        recommendationConfidence: suggestions.confidence + 5, // Boost confidence with personalization
        adaptedToPreferences: true
      }
    };
  }

  // ================================
  // Place Management Methods
  // ================================

  /**
   * Add a new place to the knowledge graph
   */
  async addPlaceToKnowledgeGraph(placeData) {
    const session = getSession();
    
    try {
      console.log('🆕 Adding new place to knowledge graph:', placeData.name);
      
      // Generate a unique place ID if not provided
      const placeId = placeData.placeId || this.generatePlaceId(placeData.name);
      
      // Create the place node with comprehensive properties
      const createPlaceQuery = `
        MERGE (p:Place {placeId: $placeId})
        SET p.name = $name,
            p.type = $type,
            p.description = $description,
            p.address = $address,
            p.city = $city,
            p.country = $country,
            p.rating = $rating,
            p.priceLevel = $priceLevel,
            p.latitude = $latitude,
            p.longitude = $longitude,
            p.website = $website,
            p.phone = $phone,
            p.tags = $tags,
            p.categories = $categories,
            p.addedBy = $addedBy,
            p.addedAt = datetime(),
            p.source = $source,
            p.verified = $verified
        RETURN p
      `;
      
      const params = {
        placeId,
        name: placeData.name,
        type: placeData.type || 'Place',
        description: placeData.description || '',
        address: placeData.address || '',
        city: placeData.city || '',
        country: placeData.country || '',
        rating: placeData.rating || null,
        priceLevel: placeData.priceLevel || null,
        latitude: placeData.latitude || null,
        longitude: placeData.longitude || null,
        website: placeData.website || '',
        phone: placeData.phone || '',
        tags: placeData.tags || [],
        categories: placeData.categories || [],
        addedBy: placeData.addedBy || 'user',
        source: placeData.source || 'user_contribution',
        verified: placeData.verified || false
      };
      
      const result = await session.run(createPlaceQuery, params);
      
      if (result.records.length > 0) {
        const createdPlace = result.records[0].get('p').properties;
        
        // Create relationships with city if city information is available
        if (placeData.city) {
          await this.createCityRelationship(placeId, placeData.city, session);
        }
        
        // Create relationships with categories
        if (placeData.categories && placeData.categories.length > 0) {
          await this.createCategoryRelationships(placeId, placeData.categories, session);
        }
        
        console.log('✅ Successfully added place to knowledge graph:', createdPlace.name);
        
        return {
          success: true,
          place: createdPlace,
          placeId: placeId,
          message: `Place "${placeData.name}" added to knowledge graph successfully`
        };
      }
      
      throw new Error('Failed to create place in knowledge graph');
      
    } catch (error) {
      console.error('❌ Error adding place to knowledge graph:', error.message);
      throw new Error(`Failed to add place to knowledge graph: ${error.message}`);
    } finally {
      await session.close();
    }
  }

  /**
   * Generate a unique place ID from place name
   */
  generatePlaceId(placeName) {
    return placeName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50) + '_' + Date.now();
  }

  /**
   * Create relationship between place and city
   */
  async createCityRelationship(placeId, cityName, session) {
    try {
      const cityRelationQuery = `
        MATCH (p:Place {placeId: $placeId})
        MERGE (c:City {name: $cityName})
        MERGE (c)-[:HAS_PLACE]->(p)
        RETURN c, p
      `;
      
      await session.run(cityRelationQuery, { placeId, cityName });
      console.log(`🔗 Created relationship between ${cityName} and place`);
    } catch (error) {
      console.error('Error creating city relationship:', error.message);
    }
  }

  /**
   * Create relationships between place and categories
   */
  async createCategoryRelationships(placeId, categories, session) {
    try {
      for (const category of categories) {
        const categoryRelationQuery = `
          MATCH (p:Place {placeId: $placeId})
          MERGE (cat:Category {name: $category})
          MERGE (p)-[:BELONGS_TO]->(cat)
          RETURN p, cat
        `;
        
        await session.run(categoryRelationQuery, { placeId, category });
      }
      console.log(`🏷️ Created category relationships for place`);
    } catch (error) {
      console.error('Error creating category relationships:', error.message);
    }
  }

  /**
   * Check if a place already exists in the knowledge graph
   */
  async checkPlaceExists(placeName, address = '') {
    const session = getSession();
    
    try {
      const checkQuery = `
        MATCH (p:Place)
        WHERE toLower(p.name) = toLower($placeName)
        ${address ? 'AND toLower(p.address) CONTAINS toLower($address)' : ''}
        RETURN p
        LIMIT 1
      `;
      
      const params = { placeName };
      if (address) params.address = address;
      
      const result = await session.run(checkQuery, params);
      
      return {
        exists: result.records.length > 0,
        place: result.records.length > 0 ? result.records[0].get('p').properties : null
      };
      
    } catch (error) {
      console.error('Error checking place existence:', error.message);
      return { exists: false, place: null };
    } finally {
      await session.close();
    }
  }

  // ...existing code...
}

module.exports = new EnhancedKnowledgeGraphService();
