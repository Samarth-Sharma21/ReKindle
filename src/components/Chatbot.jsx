import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Avatar,
  Collapse,
  Fade,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import Draggable from 'react-draggable';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your memory assistant. How can I help you today?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDarkMode = mode === 'dark';
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    // Get saved position from localStorage, or use default
    const savedPosition = localStorage.getItem('chatbotPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    // Save position to localStorage
    localStorage.setItem('chatbotPosition', JSON.stringify(position));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (input.includes('memory') || input.includes('memories')) {
      return 'I can help you with managing memories. You can add new memories, view existing ones, or organize them by date.';
    } else if (input.includes('help')) {
      return 'I can help you with: \n1. Adding new memories\n2. Viewing existing memories\n3. Managing your account\n4. Understanding the features\nWhat would you like to know more about?';
    } else if (input.includes('login') || input.includes('sign in')) {
      return "To login, you can use your email and password. If you're a patient, use the patient login. If you're a family member, use the family login.";
    } else if (input.includes('register') || input.includes('sign up')) {
      return "You can register as either a patient or a family member. Patients can create and manage their memories, while family members can help manage a patient's memories.";
    } else {
      return "I'm here to help! You can ask me about:\n- How to use the memory features\n- Login and registration\n- Managing memories\n- Account settings\nWhat would you like to know?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle='.drag-handle'
      position={position}
      onDrag={handleDrag}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds='parent'>
      <Box
        ref={nodeRef}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          transition: 'filter 0.2s',
          filter: isDragging
            ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))'
            : 'none',
        }}>
        {/* Chat Button */}
        {!isOpen && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='drag-handle'>
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 56,
                height: 56,
                boxShadow: 3,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}>
              <ChatIcon />
            </IconButton>
          </motion.div>
        )}

        {/* Chat Window */}
        <Collapse in={isOpen}>
          <Paper
            elevation={isDragging ? 8 : 3}
            sx={{
              width: 350,
              height: 500,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              transition: 'box-shadow 0.2s ease',
            }}>
            {/* Chat Header */}
            <Box
              className='drag-handle'
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'relative',
                '&:hover': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    width: 32,
                    height: 32,
                  }}>
                  <ChatIcon fontSize='small' />
                </Avatar>
                <Typography variant='subtitle1'>Memory Assistant</Typography>
                <DragIndicatorIcon
                  fontSize='small'
                  sx={{ ml: 1, opacity: 0.7 }}
                />
              </Box>
              <IconButton
                size='small'
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: isDarkMode ? 'background.paper' : 'grey.50',
              }}>
              {messages.map((message, index) => (
                <Fade in={true} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent:
                        message.sender === 'user' ? 'flex-end' : 'flex-start',
                      gap: 1,
                    }}>
                    {message.sender === 'bot' && (
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: 32,
                          height: 32,
                        }}>
                        <ChatIcon fontSize='small' />
                      </Avatar>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        bgcolor:
                          message.sender === 'user'
                            ? 'primary.main'
                            : isDarkMode
                            ? 'grey.800'
                            : 'grey.100',
                        color:
                          message.sender === 'user'
                            ? 'white'
                            : isDarkMode
                            ? 'grey.100'
                            : 'text.primary',
                        borderRadius: 2,
                        whiteSpace: 'pre-line',
                      }}>
                      <Typography variant='body2'>{message.text}</Typography>
                    </Paper>
                    {message.sender === 'user' && (
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: 32,
                          height: 32,
                        }}>
                        U
                      </Avatar>
                    )}
                  </Box>
                </Fade>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: isDarkMode ? 'background.paper' : 'white',
              }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Type your message...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <IconButton
                  color='primary'
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                  sx={{
                    alignSelf: 'flex-end',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: isDarkMode ? 'grey.700' : 'grey.300',
                      color: isDarkMode ? 'grey.500' : undefined,
                    },
                  }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Collapse>
      </Box>
    </Draggable>
  );
};

export default Chatbot;
