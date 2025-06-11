# TravelMate Backend

A Node.js/Express backend API for the TravelMate application featuring knowledge graph integration with Neo4j and Google Maps API.

## Features

- **City Verification**: Validates destination cities against the knowledge graph
- **Place Discovery**: Retrieves popular places using Google Maps API
- **Knowledge Graph Enrichment**: Discovers related entities within 3 hops for richer context
- **Rate Limiting**: Protects against API abuse
- **CORS Support**: Configured for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- Neo4j Database
- Google Maps API Key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - Neo4j connection details
   - Google Maps API key
   - Other configuration options

4. Start Neo4j database (using Docker):
```bash
docker run --name neo4j-travel -p 7474:7474 -p 7687:7687 -d -e NEO4J_AUTH=neo4j/password123 neo4j:latest
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### City Operations
- `GET /api/cities/verify/:cityName` - Verify if a city exists in the knowledge graph
- `GET /api/cities/:cityName/places` - Get popular places for a city

### Knowledge Graph Operations
- `GET /api/knowledge-graph/related/:placeId` - Get related entities within 3 hops

## Project Structure

```
TravelMate_Backend/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middleware/       # Custom middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

## Environment Variables

See `.env.example` for all available configuration options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request
