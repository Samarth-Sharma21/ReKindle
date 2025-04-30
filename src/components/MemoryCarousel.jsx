import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MicIcon from '@mui/icons-material/Mic';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import catImage from '../assets/cat.jpg';

// Update the navigation button styles to be lighter and more subtle
const NavButton = ({ children, onClick, direction }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: { xs: 4, sm: 16 },
        zIndex: 2,
        bgcolor: isDarkMode
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.6)',
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          bgcolor: isDarkMode
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.8)',
          transform: 'translateY(-50%) scale(1.05)',
        },
        transition: 'all 0.2s ease',
        color: isDarkMode ? 'white' : 'text.secondary',
      }}>
      {children}
    </IconButton>
  );
};

const MemoryCarousel = ({
  memories = [],
  interval = 5000,
  autoPlay = true,
  loading = false,
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // If no memories are provided, use default ones
  const defaultMemories = [
    {
      id: 1,
      title: 'Sample Photo Memory',
      description: 'This is a sample photo memory',
      date: new Date().toLocaleDateString(),
      content: catImage,
      location: 'Sample Location',
      type: 'photo',
    },
    {
      id: 2,
      title: 'Sample Text Memory',
      description: 'This is a sample text memory',
      date: new Date().toLocaleDateString(),
      content:
        'This is a sample text content for a memory. It could be a story, a recipe, or any other text-based memory that is worth preserving.',
      location: 'Sample Location',
      type: 'text',
    },
    {
      id: 3,
      title: 'Sample Voice Memory',
      description: 'This is a sample voice memory',
      date: new Date().toLocaleDateString(),
      content: 'voice-recording.mp3',
      location: 'Sample Location',
      type: 'voice',
    },
  ];

  const displayMemories = memories.length > 0 ? memories : defaultMemories;
  const currentMemory = displayMemories[currentIndex];

  // Auto-advance slides when isPlaying is true
  useEffect(() => {
    let timer;
    if (isPlaying && currentMemory) {
      timer = setTimeout(() => {
        goToNext();
      }, interval);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, interval, currentMemory]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayMemories.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayMemories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToDot = (index) => {
    setCurrentIndex(index);
  };

  // Render different content based on memory type
  const getMemoryContent = (memory) => {
    if (!memory) return null;

    const isDarkMode = theme.palette.mode === 'dark';

    switch (memory.type) {
      case 'photo':
        return (
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Box
              sx={{
                position: 'relative',
                flexGrow: 1,
                overflow: 'hidden',
              }}>
              <Box
                component='img'
                src={memory.content}
                alt={memory.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Info Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                  padding: 3,
                  paddingTop: 6,
                  color: 'white',
                }}>
                <Typography variant='h5' gutterBottom sx={{ fontWeight: 600 }}>
                  {memory.title}
                </Typography>
                <Typography variant='body1' gutterBottom>
                  {memory.description}
                </Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, mr: 0.5, opacity: 0.9 }}
                    />
                    <Typography variant='body2'>{memory.date}</Typography>
                  </Box>
                  {memory.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon
                        sx={{ fontSize: 16, mr: 0.5, opacity: 0.9 }}
                      />
                      <Typography variant='body2'>{memory.location}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 'text':
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: 4,
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.dark,
                    0.2
                  )}, ${alpha(theme.palette.background.paper, 0.9)})`
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.background.paper,
                    0.9
                  )}, ${alpha(theme.palette.primary.light, 0.2)})`,
              color: theme.palette.text.primary,
            }}>
            <TextSnippetIcon
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 40,
                color: alpha(theme.palette.primary.main, 0.2),
              }}
            />
            <Typography
              variant='h4'
              gutterBottom
              sx={{ fontWeight: 600, mt: 4 }}>
              {memory.title}
            </Typography>
            <Typography variant='subtitle1' gutterBottom color='text.secondary'>
              {memory.date} | {memory.location}
            </Typography>
            <Box sx={{ mt: 2, mb: 4 }}>
              <Typography
                variant='body1'
                sx={{
                  lineHeight: 1.7,
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'text.primary',
                  overflow: 'auto',
                  maxHeight: 200,
                }}>
                "{memory.content}"
              </Typography>
            </Box>
          </Box>
        );

      case 'voice':
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: 4,
              justifyContent: 'center',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.light,
                0.2
              )} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              position: 'relative',
            }}>
            <MicIcon
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 40,
                color: alpha(theme.palette.info.main, 0.3),
              }}
            />
            <Typography
              variant='h4'
              gutterBottom
              sx={{ fontWeight: 600, textAlign: 'center' }}>
              {memory.title}
            </Typography>
            <Typography
              variant='subtitle1'
              gutterBottom
              color='text.secondary'
              sx={{ textAlign: 'center', mb: 4 }}>
              {memory.date} | {memory.location}
            </Typography>

            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.info.main,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                mb: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  cursor: 'pointer',
                },
                transition: 'transform 0.2s ease',
              }}>
              <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>

            <Typography
              variant='body1'
              sx={{ textAlign: 'center', maxWidth: '80%' }}>
              {memory.description}
            </Typography>

            {/* Audio wave visualization */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'flex-end',
                height: 60,
                mt: 4,
              }}>
              {[...Array(30)].map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  animate={{
                    height: [
                      Math.random() * 10 + 5,
                      Math.random() * 30 + 10,
                      Math.random() * 15 + 5,
                    ],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: (i * 0.05) % 0.5,
                  }}
                  sx={{
                    width: 3,
                    bgcolor: theme.palette.info.main,
                    opacity: 0.7,
                    borderRadius: 4,
                  }}
                />
              ))}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.7)
              : '#fff',
        }}>
        <Typography variant='h6' color='text.secondary'>
          Loading memories...
        </Typography>
      </Box>
    );
  }

  // Render empty state
  if (!loading && memories.length === 0) {
    return (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.7)
              : '#fff',
        }}>
        <Typography variant='h6' color='text.secondary'>
          No memories yet. Add your first memory!
        </Typography>
      </Box>
    );
  }

  // Render carousel
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.7)
            : '#fff',
      }}>
      {/* Previous button */}
      <NavButton onClick={goToPrevious} direction='left'>
        <ArrowBackIosNewIcon fontSize='small' />
      </NavButton>

      {/* Memory Content */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          width: '100%',
        }}>
        <AnimatePresence mode='wait'>
          {currentMemory && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', width: '100%' }}>
              {getMemoryContent(currentMemory)}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Next button */}
      <NavButton onClick={goToNext} direction='right'>
        <ArrowForwardIosIcon fontSize='small' />
      </NavButton>

      {/* Play/Pause button */}
      <IconButton
        onClick={togglePlayPause}
        sx={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          zIndex: 2,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
        }}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      {/* Navigation dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}>
        {displayMemories.map((_, index) => (
          <Box
            key={index}
            component='button'
            onClick={() => goToDot(index)}
            sx={{
              width: index === currentIndex ? 24 : 12,
              height: 4,
              borderRadius: '4px',
              border: 'none',
              bgcolor:
                index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scaleY(1.3)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MemoryCarousel;
