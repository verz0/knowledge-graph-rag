const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️  Gemini API key not found. AI features will use fallback methods.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateItinerary(preferences) {
    if (!this.apiKey) {
      return this.generateFallbackItinerary(preferences);
    }

    try {
      const prompt = this.buildItineraryPrompt(preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseItineraryResponse(text, preferences);
    } catch (error) {
      console.error('Gemini API error:', error.message);
      return this.generateFallbackItinerary(preferences);
    }
  }

  buildItineraryPrompt(preferences) {
    const {
      destinations,
      duration,
      budget,
      interests = [],
      travelStyle,
      groupSize,
      accessibility,
      startDate,
      endDate
    } = preferences;

    return `
Create a detailed ${duration}-day travel itinerary for the following:

**Destinations:** ${destinations.join(', ')}
**Duration:** ${duration} days
**Budget:** ${budget} (low/medium/high)
**Travel Style:** ${travelStyle} (adventure/relaxed/cultural/family/business)
**Group Size:** ${groupSize} ${groupSize === 1 ? 'person' : 'people'}
**Interests:** ${interests.join(', ') || 'General sightseeing'}
**Accessibility Requirements:** ${accessibility ? 'Yes - include wheelchair accessible options' : 'No special requirements'}
**Travel Dates:** ${startDate ? `${startDate} to ${endDate}` : 'Flexible dates'}

Please provide a comprehensive itinerary in JSON format with the following structure:

{
  "title": "Itinerary title",
  "summary": "Brief summary of the trip",
  "totalDays": ${duration},
  "destinations": ["destination1", "destination2"],
  "estimatedBudget": {
    "total": "estimated total cost",
    "breakdown": {
      "accommodation": "amount",
      "food": "amount", 
      "activities": "amount",
      "transportation": "amount"
    }
  },
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "location": "destination name",
      "theme": "day theme (e.g., 'Historic Discovery', 'Cultural Immersion')",
      "activities": [
        {
          "time": "09:00",
          "activity": "activity name",
          "description": "detailed description",
          "location": "specific location",
          "duration": "estimated duration",
          "cost": "estimated cost",
          "tips": ["helpful tip 1", "helpful tip 2"],
          "alternatives": ["alternative option 1", "alternative option 2"]
        }
      ],
      "meals": {
        "breakfast": {
          "restaurant": "name",
          "cuisine": "type",
          "cost": "estimate",
          "location": "address/area"
        },
        "lunch": {
          "restaurant": "name", 
          "cuisine": "type",
          "cost": "estimate",
          "location": "address/area"
        },
        "dinner": {
          "restaurant": "name",
          "cuisine": "type", 
          "cost": "estimate",
          "location": "address/area"
        }
      },
      "accommodation": {
        "name": "hotel/accommodation name",
        "type": "hotel/hostel/apartment",
        "location": "area/district",
        "estimatedCost": "per night cost"
      },
      "transportation": {
        "methods": ["walking", "metro", "taxi"],
        "tips": ["transportation tip 1", "transportation tip 2"]
      },
      "budgetBreakdown": {
        "activities": "amount",
        "meals": "amount",
        "accommodation": "amount", 
        "transportation": "amount"
      }
    }
  ],
  "generalTips": [
    "general travel tip 1",
    "general travel tip 2"
  ],
  "packingList": [
    "essential item 1",
    "essential item 2"
  ],
  "emergencyInfo": {
    "importantNumbers": ["emergency contact 1", "emergency contact 2"],
    "hospitals": ["hospital 1", "hospital 2"],
    "embassies": ["embassy info if international travel"]
  }
}

Make sure to:
1. Include specific times and realistic durations for activities
2. Consider travel time between locations
3. Match activities to the specified interests and travel style
4. Provide budget-appropriate recommendations
5. Include local cultural insights and etiquette tips
6. Suggest backup plans for weather-dependent activities
7. Consider accessibility requirements if specified
8. Include practical information like opening hours and booking requirements

Respond ONLY with valid JSON, no additional text or formatting.
`;
  }

  parseItineraryResponse(text, preferences) {
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const itinerary = JSON.parse(jsonMatch[0]);
      
      // Validate and enhance the response
      return this.validateAndEnhanceItinerary(itinerary, preferences);
    } catch (error) {
      console.error('Error parsing Gemini response:', error.message);
      return this.generateFallbackItinerary(preferences);
    }
  }

  validateAndEnhanceItinerary(itinerary, preferences) {
    // Ensure required fields exist
    const enhanced = {
      title: itinerary.title || `${preferences.duration}-Day Trip to ${preferences.destinations.join(', ')}`,
      summary: itinerary.summary || `A comprehensive ${preferences.duration}-day travel experience`,
      totalDays: preferences.duration,
      destinations: preferences.destinations,
      estimatedBudget: itinerary.estimatedBudget || this.generateBudgetEstimate(preferences),
      days: itinerary.days || [],
      generalTips: itinerary.generalTips || [
        'Check local weather conditions before departure',
        'Keep important documents in a safe place',
        'Learn basic local phrases'
      ],
      packingList: itinerary.packingList || [
        'Comfortable walking shoes',
        'Weather-appropriate clothing',
        'Phone charger',
        'Travel adapter'
      ],
      emergencyInfo: itinerary.emergencyInfo || {
        importantNumbers: ['Local emergency services'],
        hospitals: ['Contact local hospitals'],
        embassies: ['Contact relevant embassies if international travel']
      },
      generatedBy: 'gemini-ai',
      generatedAt: new Date().toISOString()
    };

    return enhanced;
  }

  generateBudgetEstimate(preferences) {
    const { budget, duration, groupSize, destinations } = preferences;
    
    const baseCosts = {
      low: { daily: 50, accommodation: 30, food: 15, activities: 5 },
      medium: { daily: 120, accommodation: 80, food: 35, activities: 25 },
      high: { daily: 300, accommodation: 200, food: 75, activities: 50 }
    };
    
    const costs = baseCosts[budget] || baseCosts.medium;
    const total = costs.daily * duration * groupSize;
    
    return {
      total: `$${total}`,
      breakdown: {
        accommodation: `$${costs.accommodation * duration}`,
        food: `$${costs.food * duration * groupSize}`,
        activities: `$${costs.activities * duration * groupSize}`,
        transportation: `$${Math.round(costs.daily * 0.2) * duration}`
      }
    };
  }

  generateFallbackItinerary(preferences) {
    const { destinations, duration, budget, interests } = preferences;
    
    return {
      title: `${duration}-Day Trip to ${destinations.join(', ')}`,
      summary: `A ${budget}-budget ${duration}-day travel experience focusing on ${interests.length > 0 ? interests.join(', ') : 'general sightseeing'}`,
      totalDays: duration,
      destinations: destinations,
      estimatedBudget: this.generateBudgetEstimate(preferences),
      days: this.generateFallbackDays(preferences),
      generalTips: [
        'Check local weather conditions before departure',
        'Keep important documents in a safe place',
        'Research local customs and etiquette',
        'Download offline maps for navigation',
        'Inform your bank of travel plans'
      ],
      packingList: [
        'Comfortable walking shoes',
        'Weather-appropriate clothing',
        'Phone charger and travel adapter',
        'First aid kit',
        'Copies of important documents'
      ],
      emergencyInfo: {
        importantNumbers: ['Local emergency services: 911/112'],
        hospitals: ['Research local hospitals in advance'],
        embassies: ['Contact relevant embassies for international travel']
      },
      generatedBy: 'fallback-system',
      generatedAt: new Date().toISOString()
    };
  }

  generateFallbackDays(preferences) {
    const { duration, destinations } = preferences;
    const days = [];
    
    for (let i = 1; i <= duration; i++) {
      const destination = destinations[Math.floor((i - 1) / Math.ceil(duration / destinations.length))];
      
      days.push({
        day: i,
        date: null,
        location: destination,
        theme: i === 1 ? 'Arrival and Orientation' : i === duration ? 'Final Exploration' : 'Discovery',
        activities: [
          {
            time: '09:00',
            activity: `Explore ${destination}`,
            description: `Discover the main attractions and highlights of ${destination}`,
            location: destination,
            duration: '3-4 hours',
            cost: 'Varies',
            tips: ['Start early to avoid crowds', 'Bring comfortable shoes'],
            alternatives: ['Indoor activities in case of bad weather']
          },
          {
            time: '14:00',
            activity: 'Local Experience',
            description: 'Immerse yourself in local culture and traditions',
            location: `${destination} city center`,
            duration: '2-3 hours',
            cost: 'Budget dependent',
            tips: ['Interact with locals', 'Try local specialties'],
            alternatives: ['Visit museums or cultural centers']
          }
        ],
        meals: {
          breakfast: { restaurant: 'Local café', cuisine: 'Local', cost: '$10-15', location: 'Near accommodation' },
          lunch: { restaurant: 'Traditional restaurant', cuisine: 'Regional', cost: '$15-25', location: 'City center' },
          dinner: { restaurant: 'Recommended local spot', cuisine: 'Local specialties', cost: '$20-35', location: 'Popular district' }
        },
        accommodation: {
          name: 'Mid-range accommodation',
          type: 'Hotel/B&B',
          location: 'Central area',
          estimatedCost: '$60-120 per night'
        },
        transportation: {
          methods: ['walking', 'public transport'],
          tips: ['Get a day pass for public transport', 'Use ride-sharing apps when needed']
        },
        budgetBreakdown: {
          activities: '$30-50',
          meals: '$45-75',
          accommodation: '$60-120',
          transportation: '$10-20'
        }
      });
    }
    
    return days;
  }

  async generateChatResponse(message, context = {}) {
    if (!this.apiKey) {
      return this.generateFallbackChatResponse(message);
    }

    try {
      const prompt = `
You are a knowledgeable travel assistant. Help the user with their travel-related questions.

Context: ${JSON.stringify(context)}
User message: ${message}

Provide a helpful, informative response about travel, destinations, activities, or planning tips.
Keep responses concise but informative. If the user asks about specific places, provide practical information like:
- Best times to visit
- Key attractions
- Local tips
- Budget considerations
- Transportation options

Response:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error.message);
      return this.generateFallbackChatResponse(message);
    }
  }

  generateFallbackChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return 'I recommend checking local weather forecasts before your trip. Consider packing layers and weather-appropriate gear for your destination.';
    } else if (lowerMessage.includes('budget')) {
      return 'Budget planning is crucial! Consider accommodation, food, activities, and transportation costs. Look for free activities like walking tours or public parks to stretch your budget.';
    } else if (lowerMessage.includes('pack')) {
      return 'Essential packing items include comfortable shoes, weather-appropriate clothing, phone charger, travel adapter, and copies of important documents. Pack light and leave room for souvenirs!';
    } else {
      return 'I\'m here to help with your travel planning! Feel free to ask about destinations, activities, budgeting, or any other travel-related questions.';
    }
  }
}

module.exports = new GeminiService();
