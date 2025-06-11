const neo4j = require('neo4j-driver');
const MockDatabase = require('./mockDatabase');

let driver;
let session;
let mockDb;
let useMockDatabase = false;

const connectToNeo4j = async () => {
  try {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password123';

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    
    // Test the connection
    const serverInfo = await driver.getServerInfo();
    console.log('✅ Connected to Neo4j:', serverInfo.address);
    useMockDatabase = false;
    
    return driver;
  } catch (error) {
    console.warn('⚠️  Failed to connect to Neo4j:', error.message);
    console.log('🔄 Falling back to mock database for development');
    
    // Initialize mock database
    mockDb = new MockDatabase();
    useMockDatabase = true;
    
    return mockDb;
  }
};

const getSession = () => {
  if (useMockDatabase) {
    return mockDb.session();
  }
  
  if (!driver) {
    throw new Error('Database not initialized. Call connectToNeo4j() first.');
  }
  return driver.session();
};

const closeConnection = async () => {
  if (useMockDatabase) {
    console.log('🔄 Mock database connection closed');
    return;
  }
  
  if (session) {
    await session.close();
  }
  if (driver) {
    await driver.close();
  }
};

// Initialize some sample data
const initializeKnowledgeGraph = async () => {
  if (useMockDatabase) {
    console.log('✅ Mock database already contains sample data');
    return;
  }
  
  const session = getSession();
  
  try {
    // Create sample cities and places
    await session.run(`
      MERGE (paris:City {name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522})
      MERGE (london:City {name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278})
      MERGE (tokyo:City {name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503})
      MERGE (newyork:City {name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060})
      
      MERGE (eiffel:Place {name: 'Eiffel Tower', type: 'Monument', placeId: 'eiffel_tower_paris'})
      MERGE (louvre:Place {name: 'Louvre Museum', type: 'Museum', placeId: 'louvre_museum_paris'})
      MERGE (notre:Place {name: 'Notre-Dame Cathedral', type: 'Cathedral', placeId: 'notre_dame_paris'})
      
      MERGE (bigben:Place {name: 'Big Ben', type: 'Monument', placeId: 'big_ben_london'})
      MERGE (tower:Place {name: 'Tower of London', type: 'Castle', placeId: 'tower_of_london'})
      MERGE (british:Place {name: 'British Museum', type: 'Museum', placeId: 'british_museum_london'})
      
      // Create relationships
      MERGE (paris)-[:HAS_PLACE]->(eiffel)
      MERGE (paris)-[:HAS_PLACE]->(louvre)
      MERGE (paris)-[:HAS_PLACE]->(notre)
      
      MERGE (london)-[:HAS_PLACE]->(bigben)
      MERGE (london)-[:HAS_PLACE]->(tower)
      MERGE (london)-[:HAS_PLACE]->(british)
      
      // Create related entities
      MERGE (french:Culture {name: 'French Culture', type: 'Culture'})
      MERGE (gothic:Architecture {name: 'Gothic Architecture', type: 'Architecture'})
      MERGE (renaissance:Art {name: 'Renaissance Art', type: 'Art'})
      
      MERGE (eiffel)-[:REPRESENTS]->(french)
      MERGE (notre)-[:HAS_STYLE]->(gothic)
      MERGE (louvre)-[:CONTAINS]->(renaissance)
      MERGE (louvre)-[:NEAR]->(eiffel)
      MERGE (notre)-[:NEAR]->(louvre)
    `);
    
    console.log('✅ Knowledge graph initialized with sample data');
  } catch (error) {
    console.error('❌ Failed to initialize knowledge graph:', error.message);
  } finally {
    await session.close();
  }
};

module.exports = {
  connectToNeo4j,
  getSession,
  closeConnection,
  initializeKnowledgeGraph
};
