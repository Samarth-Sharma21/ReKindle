import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  CardActionArea,
  Avatar,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import PhotoIcon from '@mui/icons-material/Photo';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { alpha } from '@mui/material/styles';
import catImage from '../assets/cat.jpg';
import AudioPlayer from './AudioPlayer';

// Use cat image as a backup
const defaultImage = catImage;

const MemoryCard = ({
  memory = {
    id: '1',
    title: 'Family Picnic',
    date: '2023-06-15',
    type: 'photo', // 'photo', 'voice', 'text'
    content: '',
    location: 'Central Park',
    people: ['Mom', 'Dad', 'Sister'],
    filter: 'polaroid', // 'polaroid', 'sepia', 'vintage', 'none'
  },
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/memory/${memory.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Apply different styles based on the filter type
  const getFilterStyle = () => {
    switch (memory.filter) {
      case 'polaroid':
        return {
          border: '15px solid white',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(-2deg)',
          mb: 2,
        };
      case 'sepia':
        return {
          filter: 'sepia(100%)',
          border: '5px solid #d4b483',
          mb: 2,
        };
      case 'vintage':
        return {
          filter: 'grayscale(50%)',
          border: '8px solid #f5f5f5',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          mb: 2,
        };
      default:
        return { mb: 2 };
    }
  };

  // Render content based on memory type
  const renderContent = () => {
    switch (memory.type) {
      case 'photo':
        return (
          <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
            {imageLoading && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                animation="wave"
              />
            )}
            {!imageError ? (
              <img
                src={memory.content}
                alt={memory.title}
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: imageLoading ? 'none' : 'block',
                  ...getFilterStyle(),
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                }}>
                <PhotoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                p: 0.5,
              }}>
              <PhotoIcon color="primary" fontSize="small" />
            </Box>
          </Box>
        );
      case 'voice':
        return (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              bgcolor: alpha('#2196f3', 0.1),
              position: 'relative',
              overflow: 'hidden',
              p: 2,
            }}>
            <Avatar
              sx={{
                bgcolor: alpha('#2196f3', 0.8),
                width: 64,
                height: 64,
                mb: 2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  bgcolor: alpha('#2196f3', 1),
                },
                transition: 'all 0.3s ease',
              }}>
              <MicIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
              Voice Recording
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <AudioPlayer filePath={memory.content} showControls={false} />
            </Box>
          </Box>
        );
      case 'text':
        return (
          <Box
            sx={{
              p: 3,
              bgcolor: alpha('#9c27b0', 0.05),
              borderRadius: 2,
              mb: 0,
              height: 200,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}>
            <TextSnippetIcon
              sx={{ fontSize: 30, color: alpha('#9c27b0', 0.6), mb: 2 }}
            />
            <Typography
              variant='body1'
              color='text.primary'
              sx={{
                fontStyle: 'italic',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}>
              "{memory.content}"
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                p: 0.5,
              }}>
              <TextSnippetIcon color='primary' fontSize='small' />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  // Get icon based on memory type
  const getTypeIcon = () => {
    switch (memory.type) {
      case 'photo':
        return <PhotoIcon fontSize='small' />;
      case 'voice':
        return <MicIcon fontSize='small' />;
      case 'text':
        return <TextSnippetIcon fontSize='small' />;
      default:
        return <PhotoIcon fontSize='small' />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      <Card
        sx={{
          maxWidth: 345,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          bgcolor: 'background.paper',
          position: 'relative',
        }}>
        <CardActionArea onClick={handleCardClick}>
          {renderContent()}

          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <Box>
                <Typography gutterBottom variant='h6' component='div'>
                  {memory.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {new Date(memory.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <IconButton
                aria-label='more'
                id='memory-menu-button'
                aria-controls={open ? 'memory-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
                sx={{ mt: -1, mr: -1 }}>
                <MoreVertIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={getTypeIcon()}
                label={
                  memory.type.charAt(0).toUpperCase() + memory.type.slice(1)
                }
                size='small'
                color='primary'
                variant='outlined'
              />
              {memory.location && (
                <Chip
                  icon={<LocationOnIcon fontSize='small' />}
                  label={memory.location}
                  size='small'
                  variant='outlined'
                />
              )}
              {memory.people && memory.people.length > 0 && (
                <Chip
                  icon={<PeopleIcon fontSize='small' />}
                  label={`${memory.people.length} people`}
                  size='small'
                  variant='outlined'
                />
              )}
            </Box>
          </CardContent>
        </CardActionArea>

        <Menu
          id='memory-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'memory-menu-button',
          }}>
          <MenuItem
            onClick={(e) => {
              handleClose(e);
              navigate(`/memory/${memory.id}`);
            }}>
            View Details
          </MenuItem>
          <MenuItem onClick={handleClose}>Share Memory</MenuItem>
          <MenuItem onClick={handleClose}>Edit Memory</MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default MemoryCard;
