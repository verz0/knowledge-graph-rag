import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Fade,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Badge,
  Zoom,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as SmartIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  TravelExplore as TravelIcon,
  SmartToy as BotIcon,
  FlightTakeoff as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Map as MapIcon,
  Lightbulb as TipIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const TravelChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI travel assistant. I can help you plan trips, find destinations, get travel advice, and answer questions about places around the world. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickSuggestions = [
    { text: "Best destinations in Europe", icon: <MapIcon /> },
    { text: "Budget travel tips", icon: <TipIcon /> },
    { text: "Best time to visit Japan", icon: <ScheduleIcon /> },
    { text: "Cheap flights to Thailand", icon: <FlightIcon /> },
    { text: "Hotel recommendations Paris", icon: <HotelIcon /> },
    { text: "Local food must-try Italy", icon: <RestaurantIcon /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || loading) return;    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setIsTyping(true);
    setError('');

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock AI response based on message content
      let botResponse = generateMockResponse(textToSend);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type || 'text',
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const generateMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('europe') || message.includes('european')) {
      return {
        text: "🇪🇺 Europe has amazing destinations! Here are some top recommendations:\n\n🏛️ **Rome, Italy** - Rich history and incredible food\n🗼 **Paris, France** - Art, culture, and romance\n🏰 **Prague, Czech Republic** - Beautiful architecture and affordable\n🌊 **Santorini, Greece** - Stunning sunsets and beaches\n🏔️ **Swiss Alps** - Perfect for outdoor adventures\n\nWould you like detailed information about any of these destinations?",
        type: 'recommendation',
        suggestions: ['Tell me about Rome', 'Paris travel guide', 'Best time for Greece']
      };
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return {
        text: "💰 Here are my top budget travel tips:\n\n✈️ **Flights**: Book 6-8 weeks in advance, use flight comparison sites\n🏠 **Accommodation**: Consider hostels, Airbnb, or budget hotels\n🍽️ **Food**: Eat like locals, try street food, cook your own meals\n🚇 **Transport**: Use public transportation, walk when possible\n💳 **Money**: Avoid foreign transaction fees, use local ATMs\n\nWhat's your target budget and destination?",
        type: 'tips',
        suggestions: ['Cheap destinations in Asia', 'Budget Europe itinerary', 'Backpacking tips']
      };
    }
    
    if (message.includes('japan') || message.includes('tokyo')) {
      return {
        text: "🇯🇵 Japan is incredible! Here's what you need to know:\n\n🌸 **Best Time**: Spring (March-May) for cherry blossoms, Fall (September-November) for autumn colors\n🏯 **Must-Visit**: Tokyo, Kyoto, Osaka, Mount Fuji\n🍜 **Food**: Try ramen, sushi, tempura, and local specialties\n🚅 **Transport**: Get a JR Pass for unlimited train travel\n💴 **Budget**: $100-200/day depending on your style\n\nWhen are you planning to visit?",
        type: 'destination',
        suggestions: ['Tokyo itinerary', 'Cherry blossom season', 'JR Pass worth it?']
      };
    }
    
    // Default response
    return {
      text: "I'd be happy to help you with that! I can assist with:\n\n🗺️ **Destination recommendations**\n✈️ **Flight and accommodation tips**\n📅 **Travel planning and itineraries**\n💰 **Budget travel advice**\n🍽️ **Local food and culture**\n⚠️ **Travel safety and requirements**\n\nWhat specific aspect of travel would you like to explore?",
      type: 'general',
      suggestions: ['Plan a trip', 'Destination ideas', 'Travel safety tips']
    };
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "👋 Hello! I'm your AI travel assistant. How can I help you plan your next adventure?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }]);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 3, 
              textAlign: 'center', 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <BotIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                AI Travel Assistant
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Your intelligent companion for travel planning and advice
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Chat Container */}
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              height: '500px', 
              borderRadius: 4, 
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Chat Header */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge color="success" variant="dot">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <BotIcon />
                  </Avatar>
                </Badge>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Travel Assistant
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isTyping ? 'Typing...' : 'Online'}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Clear Chat">
                <IconButton onClick={clearChat} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <List sx={{ p: 0 }}>
                {messages.map((message, index) => (
                  <Fade in timeout={300} key={message.id}>
                    <ListItem 
                      sx={{ 
                        px: 0, 
                        pb: 2,
                        flexDirection: 'column',
                        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                          maxWidth: '80%',
                          width: 'fit-content'
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            mx: 1,
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main'
                          }}
                        >
                          {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                        </Avatar>
                        
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                            color: message.sender === 'user' ? 'white' : 'text.primary',
                            border: message.sender === 'bot' ? '1px solid' : 'none',
                            borderColor: 'divider',
                            maxWidth: '100%',
                            wordBreak: 'break-word'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'pre-line',
                              lineHeight: 1.5
                            }}
                          >
                            {message.text}
                          </Typography>
                          
                          {/* Message Suggestions */}
                          {message.suggestions && (
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {message.suggestions.map((suggestion, idx) => (
                                <Chip
                                  key={idx}
                                  label={suggestion}
                                  size="small"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'primary.main',
                                      color: 'white'
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Paper>
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 0.5,
                          alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </ListItem>
                  </Fade>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <Zoom in>
                    <ListItem sx={{ px: 0, pb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                        <BotIcon />
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[0, 1, 2].map((i) => (
                            <Box
                              key={i}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                animation: 'pulse 1.4s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`,
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.4 },
                                  '50%': { opacity: 1 },
                                  '100%': { opacity: 0.4 },
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </ListItem>
                  </Zoom>
                )}
              </List>
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              
              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Quick suggestions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {quickSuggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        icon={suggestion.icon}
                        label={suggestion.text}
                        variant="outlined"
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '& .MuiChip-icon': {
                              color: 'white'
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    pr: 1,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || loading}
                        color="primary"
                        sx={{
                          bgcolor: inputMessage.trim() ? 'primary.main' : 'transparent',
                          color: inputMessage.trim() ? 'white' : 'inherit',
                          '&:hover': {
                            bgcolor: inputMessage.trim() ? 'primary.dark' : 'action.hover',
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={20} /> : <SendIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Fade>      </Container>
    </Box>
  );
};

export default TravelChatBot;
