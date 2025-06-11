const { getSession } = require('../config/database');
const googleMapsService = require('../config/googleMaps');

class CityService {
  // Verify if a city exists in the knowledge graph
  async verifyCityExists(cityName) {
    const session = getSession();
    
    try {
      const result = await session.run(
        'MATCH (c:City) WHERE toLower(c.name) = toLower($cityName) RETURN c',
        { cityName }
      );
      
      if (result.records.length > 0) {
        const city = result.records[0].get('c').properties;
        return {
          exists: true,
          city: {
            name: city.name,
            country: city.country,
            coordinates: {
              lat: city.lat,
              lng: city.lng
            }
          }
        };
      }
      
      // If not in knowledge graph, try to add it from Google Maps
      try {
        const places = await googleMapsService.getPlacesForCity(cityName);
        if (places.length > 0) {
          // City exists according to Google Maps, add to knowledge graph
          await this.addCityToKnowledgeGraph(cityName);
          return {
            exists: true,
            city: {
              name: cityName,
              country: 'Unknown',
              coordinates: {
                lat: 0,
                lng: 0
              }
            },
            source: 'google_maps'
          };
        }
      } catch (error) {
        console.error('Error checking city with Google Maps:', error.message);
      }
      
      return {
        exists: false,
        city: null
      };
      
    } catch (error) {
      console.error('Error verifying city:', error.message);
      throw new Error('Failed to verify city existence');
    } finally {
      await session.close();
    }
  }

  // Get popular places for a city
  async getPlacesForCity(cityName) {
    try {
      // Get places from Google Maps API
      const googlePlaces = await googleMapsService.getPlacesForCity(cityName);
      
      // Enrich with knowledge graph data
      const enrichedPlaces = await Promise.all(
        googlePlaces.map(async (place) => {
          const knowledgeGraphData = await this.getPlaceKnowledgeGraphData(place.placeId);
          return {
            ...place,
            knowledgeGraph: knowledgeGraphData
          };
        })
      );
      
      return enrichedPlaces;
      
    } catch (error) {
      console.error('Error getting places for city:', error.message);
      throw new Error('Failed to retrieve places for city');
    }
  }

  // Add city to knowledge graph
  async addCityToKnowledgeGraph(cityName) {
    const session = getSession();
    
    try {
      await session.run(
        `
        MERGE (c:City {name: $cityName})
        SET c.addedAt = datetime()
        RETURN c
        `,
        { cityName }
      );
      
      console.log(`Added city "${cityName}" to knowledge graph`);
      
    } catch (error) {
      console.error('Error adding city to knowledge graph:', error.message);
    } finally {
      await session.close();
    }
  }

  // Get knowledge graph data for a place
  async getPlaceKnowledgeGraphData(placeId) {
    const session = getSession();
    
    try {
      const result = await session.run(
        `
        MATCH (p:Place {placeId: $placeId})
        OPTIONAL MATCH (p)-[r1]-(related1)-[r2]-(related2)-[r3]-(related3)
        WHERE related1 <> p AND related2 <> p AND related3 <> p
        RETURN p, 
               collect(DISTINCT {node: related1, relationship: type(r1), distance: 1}) +
               collect(DISTINCT {node: related2, relationship: type(r2), distance: 2}) +
               collect(DISTINCT {node: related3, relationship: type(r3), distance: 3}) as related
        `,
        { placeId }
      );
      
      if (result.records.length === 0) {
        return null;
      }
      
      const record = result.records[0];
      const place = record.get('p')?.properties;
      const related = record.get('related') || [];
      
      return {
        place: place,
        relatedEntities: related.map(rel => ({
          name: rel.node?.properties?.name || 'Unknown',
          type: rel.node?.labels?.[0] || 'Unknown',
          relationship: rel.relationship,
          distance: rel.distance,
          properties: rel.node?.properties || {}
        })).filter(rel => rel.name !== 'Unknown').slice(0, 10) // Limit to 10 related entities
      };
      
    } catch (error) {
      console.error('Error getting knowledge graph data:', error.message);
      return null;
    } finally {
      await session.close();
    }
  }

  // Get all cities in the knowledge graph
  async getAllCities() {
    const session = getSession();
    
    try {
      const result = await session.run('MATCH (c:City) RETURN c ORDER BY c.name');
      
      return result.records.map(record => {
        const city = record.get('c').properties;
        return {
          name: city.name,
          country: city.country,
          coordinates: {
            lat: city.lat,
            lng: city.lng
          }
        };
      });
      
    } catch (error) {
      console.error('Error getting all cities:', error.message);
      throw new Error('Failed to retrieve cities');
    } finally {
      await session.close();
    }
  }
}

module.exports = new CityService();
