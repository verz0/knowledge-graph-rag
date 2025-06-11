// Mock database for development without Neo4j
class MockDatabase {
  constructor() {
    this.data = {
      cities: [
        {
          name: 'Paris',
          country: 'France',
          lat: 48.8566,
          lng: 2.3522
        },
        {
          name: 'London',
          country: 'UK',
          lat: 51.5074,
          lng: -0.1278
        },
        {
          name: 'Tokyo',
          country: 'Japan',
          lat: 35.6762,
          lng: 139.6503
        },
        {
          name: 'New York',
          country: 'USA',
          lat: 40.7128,
          lng: -74.0060
        }
      ],
      places: [
        {
          placeId: 'eiffel_tower_paris',
          name: 'Eiffel Tower',
          type: 'Monument',
          city: 'Paris'
        },
        {
          placeId: 'louvre_museum_paris',
          name: 'Louvre Museum',
          type: 'Museum',
          city: 'Paris'
        },
        {
          placeId: 'notre_dame_paris',
          name: 'Notre-Dame Cathedral',
          type: 'Cathedral',  
          city: 'Paris'
        },
        {
          placeId: 'big_ben_london',
          name: 'Big Ben',
          type: 'Monument',
          city: 'London'
        },
        {
          placeId: 'tower_of_london',
          name: 'Tower of London',
          type: 'Castle',
          city: 'London'
        }
      ],
      relationships: [
        {
          from: 'eiffel_tower_paris',
          to: 'french_culture',
          type: 'REPRESENTS',
          distance: 1
        },
        {
          from: 'louvre_museum_paris',
          to: 'renaissance_art',
          type: 'CONTAINS',
          distance: 1
        },
        {
          from: 'eiffel_tower_paris',
          to: 'louvre_museum_paris',
          type: 'NEAR',
          distance: 1
        }
      ],
      entities: [
        {
          id: 'french_culture',
          name: 'French Culture',
          type: 'Culture'
        },
        {
          id: 'renaissance_art',
          name: 'Renaissance Art',
          type: 'Art'
        },
        {
          id: 'gothic_architecture',
          name: 'Gothic Architecture',
          type: 'Architecture'
        }
      ]
    };
  }

  // Mock session object
  session() {
    return {
      run: async (query, params) => {
        // Mock different query responses
        if (query.includes('MATCH (c:City)') && query.includes('toLower(c.name)')) {
          const cityName = params.cityName.toLowerCase();
          const city = this.data.cities.find(c => c.name.toLowerCase() === cityName);
          
          if (city) {
            return {
              records: [{
                get: () => ({
                  properties: city
                })
              }]
            };
          } else {
            return { records: [] };
          }
        }
        
        if (query.includes('MATCH (c:City)') && query.includes('ORDER BY c.name')) {
          return {
            records: this.data.cities.map(city => ({
              get: () => ({
                properties: city
              })
            }))
          };
        }
        
        if (query.includes('MATCH (p:Place {placeId:') || query.includes('MATCH (start:Place {placeId:')) {
          const placeId = params.placeId;
          const place = this.data.places.find(p => p.placeId === placeId);
          
          if (place) {
            // Mock related entities
            const related = this.data.relationships
              .filter(r => r.from === placeId)
              .map(r => ({
                node: this.data.entities.find(e => e.id === r.to) || { name: 'Unknown', type: 'Unknown' },
                relationship: r.type,
                distance: r.distance
              }));
            
            return {
              records: [{
                get: (key) => {
                  if (key === 'p') return { properties: place };
                  if (key === 'related') return related;
                  if (key === 'totalNodes') return { toNumber: () => this.data.cities.length + this.data.places.length };
                  if (key === 'totalRelationships') return { toNumber: () => this.data.relationships.length };
                  if (key === 'allLabels') return [['City'], ['Place'], ['Culture'], ['Art']];
                  if (key === 'allRelationshipTypes') return ['HAS_PLACE', 'REPRESENTS', 'CONTAINS', 'NEAR'];
                  return null;
                }
              }]
            };
          }
          
          return { records: [] };
        }
        
        // Default mock response for statistics
        if (query.includes('count(n)') || query.includes('CALL {')) {
          return {
            records: [{
              get: (key) => {
                if (key === 'totalNodes') return { toNumber: () => this.data.cities.length + this.data.places.length };
                if (key === 'totalRelationships') return { toNumber: () => this.data.relationships.length };
                if (key === 'allLabels') return [['City'], ['Place'], ['Culture'], ['Art']];
                if (key === 'allRelationshipTypes') return ['HAS_PLACE', 'REPRESENTS', 'CONTAINS', 'NEAR'];
                return [];
              }
            }]
          };
        }
        
        return { records: [] };
      },
      close: async () => {
        // Mock close
      }
    };
  }
  
  // Add getServerInfo method to match Neo4j driver interface
  async getServerInfo() {
    return {
      address: 'mock://localhost:7687'
    };
  }
}

module.exports = MockDatabase;
