// Test script for comprehensive travel API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }
}

async function testUniversalSearch() {
  console.log('\n🔍 Testing Universal Place Search...');
  try {
    const response = await axios.get(`${BASE_URL}/api/travel/search`, {
      params: {
        query: 'Eiffel Tower',
        category: 'tourist_attraction'
      }
    });
    console.log('✅ Universal Search Results:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Universal Search Failed:', error.message);
  }
}

async function testPlaceDetails() {
  console.log('\n📍 Testing Place Details...');
  try {
    const response = await axios.get(`${BASE_URL}/api/travel/place/eiffel-tower`);
    console.log('✅ Place Details:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Place Details Failed:', error.message);
  }
}

async function testItineraryGeneration() {
  console.log('\n📅 Testing Itinerary Generation...');
  try {
    const response = await axios.post(`${BASE_URL}/api/travel/itinerary`, {
      destination: 'Paris',
      duration: 3,
      interests: ['history', 'art', 'food'],
      budget: 'medium',
      groupType: 'couple'
    });
    console.log('✅ Generated Itinerary:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Itinerary Generation Failed:', error.message);
  }
}

async function testTravelSuggestions() {
  console.log('\n💡 Testing Travel Suggestions...');
  try {
    const response = await axios.get(`${BASE_URL}/api/travel/suggestions`, {
      params: {
        location: 'Paris',
        interests: 'art,history'
      }
    });
    console.log('✅ Travel Suggestions:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Travel Suggestions Failed:', error.message);
  }
}

async function testCategories() {
  console.log('\n📂 Testing Categories...');
  try {
    const response = await axios.get(`${BASE_URL}/api/travel/categories`);
    console.log('✅ Categories:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Categories Failed:', error.message);
  }
}

async function testRouteOptimization() {
  console.log('\n🗺️ Testing Route Optimization...');
  try {
    const response = await axios.post(`${BASE_URL}/api/travel/optimize-route`, {
      places: [
        { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945 },
        { name: 'Louvre Museum', lat: 48.8606, lng: 2.3376 },
        { name: 'Notre Dame', lat: 48.8530, lng: 2.3499 }
      ],
      startLocation: 'Paris'
    });
    console.log('✅ Optimized Route:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Route Optimization Failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Travel API Tests...\n');
  
  await testHealthCheck();
  await testUniversalSearch();
  await testPlaceDetails();
  await testItineraryGeneration();
  await testTravelSuggestions();
  await testCategories();
  await testRouteOptimization();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testUniversalSearch,
  testPlaceDetails,
  testItineraryGeneration,
  testTravelSuggestions,
  testCategories,
  testRouteOptimization,
  runAllTests
};
