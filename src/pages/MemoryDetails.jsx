import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { supabase } from '../pages/server';
import AudioPlayer from '../components/AudioPlayer';

const MemoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        // Get the current user's ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        // First, get the memory
        const { data: memoryData, error: memoryError } = await supabase
          .from('memories')
          .select('*')
          .eq('id', id)
          .single();

        if (memoryError) throw memoryError;

        if (!memoryData) {
          setError('Memory not found');
          return;
        }

        // Check if the memory belongs to the current user
        if (memoryData.user_id === user.id) {
          setMemory(memoryData);
          return;
        }

        // If not, check if the current user is a family member connected to the patient
        const { data: familyData, error: familyError } = await supabase
          .from('family_members')
          .select('patient_id')
          .eq('id', user.id)
          .single();

        if (familyError || !familyData) {
          setError('You do not have permission to view this memory');
          return;
        }

        // Check if the memory belongs to the connected patient
        if (memoryData.user_id === familyData.patient_id) {
          setMemory(memoryData);
        } else {
          setError('You do not have permission to view this memory');
        }
      } catch (err) {
        console.error('Error fetching memory:', err.message);
        setError('Error loading memory');
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    // In a real app, we would navigate to an edit page
    console.log('Edit memory:', id);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate(-1);
    } catch (err) {
      console.error('Error deleting memory:', err.message);
      setError('Error deleting memory');
    }
  };

  const handleShare = () => {
    // In a real app, we would show sharing options
    console.log('Share memory:', id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Apply different styles based on the filter type
  const getFilterStyle = (filter) => {
    switch (filter) {
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

  // Render different content based on memory type
  const renderMemoryContent = () => {
    if (!memory) return null;

    switch (memory.type) {
      case 'photo':
        return (
          <Box sx={{ mb: 4 }}>
            <CardMedia
              component='img'
              image={memory.content}
              alt={memory.title}
              sx={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: 2,
                ...getFilterStyle(memory.filter),
              }}
            />
          </Box>
        );
      case 'voice':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}>
            <Typography variant='h6' gutterBottom>
              Voice Recording
            </Typography>
            <Box sx={{ width: '100%' }}>
              <AudioPlayer filePath={memory.content} showControls={true} />
            </Box>
          </Box>
        );
      case 'text':
        return (
          <Box
            sx={{
              p: 3,
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              fontStyle: 'italic',
              lineHeight: 1.8,
            }}>
            <Typography variant='body1' paragraph>
              {memory.content}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Typography color='error'>{error}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!memory) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Typography>Memory not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4' component='h1'>
            Memory Details
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h4' component='h2' gutterBottom>
              {memory.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
              }}>
              <Chip
                icon={<CalendarTodayIcon />}
                label={formatDate(memory.date)}
                variant='outlined'
              />
              {memory.location && (
                <Chip
                  icon={<LocationOnIcon />}
                  label={memory.location}
                  variant='outlined'
                />
              )}
              {memory.people && memory.people.length > 0 && (
                <Chip
                  icon={<PeopleIcon />}
                  label={`${memory.people.length} ${
                    memory.people.length === 1 ? 'person' : 'people'
                  }`}
                  variant='outlined'
                />
              )}
            </Box>
          </Box>

          {renderMemoryContent()}

          {memory.description && (
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' gutterBottom>
                Description
              </Typography>
              <Typography variant='body1' paragraph>
                {memory.description}
              </Typography>
            </Box>
          )}

          {memory.people && memory.people.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' gutterBottom>
                People
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {memory.people.map((person, index) => (
                  <Chip key={index} label={person} />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}>
            <Button
              variant='outlined'
              color='error'
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
              Delete
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='outlined'
                startIcon={<ShareIcon />}
                onClick={handleShare}>
                Share
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<EditIcon />}
                onClick={handleEdit}>
                Edit
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default MemoryDetails;
