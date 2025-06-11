const { getSession } = require('../config/database');

class KnowledgeGraphService {
  // Get related entities within N hops
  async getRelatedEntities(placeId, maxHops = 3) {
    const session = getSession();
    
    try {
      // Dynamic query based on number of hops
      let query = `
        MATCH (start:Place {placeId: $placeId})
        CALL {
          WITH start
          MATCH path = (start)-[*1..${maxHops}]-(related)
          WHERE related <> start
          RETURN related, length(path) as distance, 
                 [r in relationships(path) | type(r)] as relationshipTypes
        }
        RETURN DISTINCT related, distance, relationshipTypes
        ORDER BY distance, related.name
        LIMIT 50
      `;
      
      const result = await session.run(query, { placeId });
      
      const relatedEntities = result.records.map(record => {
        const related = record.get('related');
        const distance = record.get('distance').toNumber();
        const relationshipTypes = record.get('relationshipTypes');
        
        return {
          id: related.elementId,
          labels: related.labels,
          properties: related.properties,
          distance: distance,
          relationshipPath: relationshipTypes,
          type: related.labels[0] || 'Unknown'
        };
      });
      
      // Group by distance for better organization
      const groupedByDistance = {};
      relatedEntities.forEach(entity => {
        if (!groupedByDistance[entity.distance]) {
          groupedByDistance[entity.distance] = [];
        }
        groupedByDistance[entity.distance].push(entity);
      });
      
      return {
        placeId: placeId,
        totalFound: relatedEntities.length,
        maxHops: maxHops,
        relatedEntities: groupedByDistance
      };
      
    } catch (error) {
      console.error('Error getting related entities:', error.message);
      throw new Error('Failed to retrieve related entities from knowledge graph');
    } finally {
      await session.close();
    }
  }

  // Get direct relationships for a place
  async getDirectRelationships(placeId) {
    const session = getSession();
    
    try {
      const result = await session.run(
        `
        MATCH (p:Place {placeId: $placeId})-[r]-(related)
        RETURN type(r) as relationshipType, 
               related,
               startNode(r) = p as isOutgoing
        ORDER BY relationshipType, related.name
        `,
        { placeId }
      );
      
      const relationships = result.records.map(record => {
        const relationshipType = record.get('relationshipType');
        const related = record.get('related');
        const isOutgoing = record.get('isOutgoing');
        
        return {
          type: relationshipType,
          direction: isOutgoing ? 'outgoing' : 'incoming',
          relatedEntity: {
            id: related.elementId,
            labels: related.labels,
            properties: related.properties,
            type: related.labels[0] || 'Unknown'
          }
        };
      });
      
      // Group by relationship type
      const groupedByType = {};
      relationships.forEach(rel => {
        if (!groupedByType[rel.type]) {
          groupedByType[rel.type] = {
            outgoing: [],
            incoming: []
          };
        }
        groupedByType[rel.type][rel.direction].push(rel.relatedEntity);
      });
      
      return {
        placeId: placeId,
        directRelationships: groupedByType
      };
      
    } catch (error) {
      console.error('Error getting direct relationships:', error.message);
      throw new Error('Failed to retrieve direct relationships');
    } finally {
      await session.close();
    }
  }

  // Search for entities by type and properties
  async searchEntities(searchParams) {
    const session = getSession();
    const { type, name, properties = {} } = searchParams;
    
    try {
      let query = 'MATCH (n';
      let params = {};
      
      // Add label filter if type is specified
      if (type) {
        query += `:${type}`;
      }
      
      query += ')';
      
      // Add property filters
      const conditions = [];
      if (name) {
        conditions.push('toLower(n.name) CONTAINS toLower($name)');
        params.name = name;
      }
      
      // Add custom property filters
      Object.entries(properties).forEach(([key, value], index) => {
        const paramName = `prop${index}`;
        conditions.push(`n.${key} = $${paramName}`);
        params[paramName] = value;
      });
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' RETURN n LIMIT 20';
      
      const result = await session.run(query, params);
      
      return result.records.map(record => {
        const node = record.get('n');
        return {
          id: node.elementId,
          labels: node.labels,
          properties: node.properties,
          type: node.labels[0] || 'Unknown'
        };
      });
      
    } catch (error) {
      console.error('Error searching entities:', error.message);
      throw new Error('Failed to search entities in knowledge graph');
    } finally {
      await session.close();
    }
  }

  // Get graph statistics
  async getGraphStatistics() {
    const session = getSession();
    
    try {
      const result = await session.run(`
        CALL {
          MATCH (n) RETURN count(n) as totalNodes
        }
        CALL {
          MATCH ()-[r]->() RETURN count(r) as totalRelationships
        }
        CALL {
          MATCH (n) RETURN DISTINCT labels(n) as labelGroups
        }
        CALL {
          MATCH ()-[r]->() RETURN DISTINCT type(r) as relationshipTypes
        }
        RETURN totalNodes, totalRelationships, 
               collect(DISTINCT labelGroups) as allLabels,
               collect(DISTINCT relationshipTypes) as allRelationshipTypes
      `);
      
      if (result.records.length > 0) {
        const record = result.records[0];
        const allLabels = record.get('allLabels').flat().filter((label, index, arr) => arr.indexOf(label) === index);
        
        return {
          totalNodes: record.get('totalNodes').toNumber(),
          totalRelationships: record.get('totalRelationships').toNumber(),
          nodeTypes: allLabels,
          relationshipTypes: record.get('allRelationshipTypes')
        };
      }
      
      return {
        totalNodes: 0,
        totalRelationships: 0,
        nodeTypes: [],
        relationshipTypes: []
      };
      
    } catch (error) {
      console.error('Error getting graph statistics:', error.message);
      throw new Error('Failed to retrieve graph statistics');
    } finally {
      await session.close();
    }
  }

  // Initialize knowledge graph with sample data
  async initializeWithSampleData() {
    const session = getSession();
    
    try {
      // Create sample cities and places
      await session.run(`
        // Create Cities
        MERGE (paris:City {name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522})
        MERGE (london:City {name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278})
        MERGE (tokyo:City {name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503})
        MERGE (newyork:City {name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060})
        MERGE (rome:City {name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964})
        
        // Create Places for Paris
        MERGE (eiffel:Place {name: 'Eiffel Tower', type: 'Monument', placeId: 'eiffel_tower_paris'})
        MERGE (louvre:Place {name: 'Louvre Museum', type: 'Museum', placeId: 'louvre_museum_paris'})
        MERGE (notre:Place {name: 'Notre-Dame Cathedral', type: 'Cathedral', placeId: 'notre_dame_paris'})
        MERGE (arcTriomphe:Place {name: 'Arc de Triomphe', type: 'Monument', placeId: 'arc_de_triomphe_paris'})
        
        // Create Places for London
        MERGE (bigben:Place {name: 'Big Ben', type: 'Monument', placeId: 'big_ben_london'})
        MERGE (tower:Place {name: 'Tower of London', type: 'Castle', placeId: 'tower_of_london'})
        MERGE (british:Place {name: 'British Museum', type: 'Museum', placeId: 'british_museum_london'})
        MERGE (buckingham:Place {name: 'Buckingham Palace', type: 'Palace', placeId: 'buckingham_palace_london'})
        
        // Create Places for Tokyo
        MERGE (senso:Place {name: 'Senso-ji Temple', type: 'Temple', placeId: 'senso_ji_tokyo'})
        MERGE (tokyo_tower:Place {name: 'Tokyo Tower', type: 'Tower', placeId: 'tokyo_tower_tokyo'})
        MERGE (shibuya:Place {name: 'Shibuya Crossing', type: 'Landmark', placeId: 'shibuya_crossing_tokyo'})
        
        // Create cultural and architectural entities
        MERGE (french:Culture {name: 'French Culture', type: 'Culture'})
        MERGE (gothic:Architecture {name: 'Gothic Architecture', type: 'Architecture'})
        MERGE (renaissance:Art {name: 'Renaissance Art', type: 'Art'})
        MERGE (victorian:Architecture {name: 'Victorian Architecture', type: 'Architecture'})
        MERGE (japanese:Culture {name: 'Japanese Culture', type: 'Culture'})
        MERGE (buddhist:Religion {name: 'Buddhism', type: 'Religion'})
        
        // Create historical periods
        MERGE (medieval:Period {name: 'Medieval Period', type: 'Historical Period'})
        MERGE (modern:Period {name: 'Modern Era', type: 'Historical Period'})
        
        // Create city-place relationships
        MERGE (paris)-[:HAS_PLACE]->(eiffel)
        MERGE (paris)-[:HAS_PLACE]->(louvre)
        MERGE (paris)-[:HAS_PLACE]->(notre)
        MERGE (paris)-[:HAS_PLACE]->(arcTriomphe)
        
        MERGE (london)-[:HAS_PLACE]->(bigben)
        MERGE (london)-[:HAS_PLACE]->(tower)
        MERGE (london)-[:HAS_PLACE]->(british)
        MERGE (london)-[:HAS_PLACE]->(buckingham)
        
        MERGE (tokyo)-[:HAS_PLACE]->(senso)
        MERGE (tokyo)-[:HAS_PLACE]->(tokyo_tower)
        MERGE (tokyo)-[:HAS_PLACE]->(shibuya)
        
        // Create cultural and architectural relationships
        MERGE (eiffel)-[:REPRESENTS]->(french)
        MERGE (notre)-[:HAS_STYLE]->(gothic)
        MERGE (louvre)-[:CONTAINS]->(renaissance)
        MERGE (tower)-[:HAS_STYLE]->(medieval)
        MERGE (bigben)-[:HAS_STYLE]->(victorian)
        MERGE (senso)-[:REPRESENTS]->(buddhist)
        MERGE (senso)-[:REPRESENTS]->(japanese)
        
        // Create proximity relationships
        MERGE (louvre)-[:NEAR]->(eiffel)
        MERGE (notre)-[:NEAR]->(louvre)
        MERGE (arcTriomphe)-[:NEAR]->(eiffel)
        MERGE (bigben)-[:NEAR]->(buckingham)
        MERGE (tower)-[:NEAR]->(bigben)
        
        // Create historical relationships
        MERGE (notre)-[:FROM_PERIOD]->(medieval)
        MERGE (tower)-[:FROM_PERIOD]->(medieval)
        MERGE (eiffel)-[:FROM_PERIOD]->(modern)
        MERGE (tokyo_tower)-[:FROM_PERIOD]->(modern)
        
        // Create thematic relationships
        MERGE (louvre)-[:SIMILAR_TO]->(british)
        MERGE (eiffel)-[:SIMILAR_TO]->(tokyo_tower)
        MERGE (notre)-[:SIMILAR_TO]->(senso)
      `);
      
      console.log('✅ Knowledge graph initialized with comprehensive travel data');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize knowledge graph:', error.message);
      throw new Error('Failed to initialize knowledge graph with sample data');
    } finally {
      await session.close();
    }
  }

  // Check if a place already exists in the knowledge graph
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
}

module.exports = new KnowledgeGraphService();
