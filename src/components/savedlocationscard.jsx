import { useState, useEffect } from 'react';
import { supabase, locationService } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SavedLocationsCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for saved locations
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UI states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch saved locations from database
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        // Get the current user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          // Fallback to local state if not authenticated
          setLoading(false);
          return;
        }

        const { data, error } = await locationService.getLocations(user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setSavedLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error.message);
        setError('Failed to load saved locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleNavigateToLocation = (location) => {
    // Show notification and open Google Maps with the location
    showNotification(`Navigating to ${location.name}`, 'info');

    // Open Google Maps with the location address or coordinates
    if (location.address) {
      // Use address for search if available
      const encodedAddress = encodeURIComponent(location.address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        '_blank'
      );
    } else if (location.lat && location.lng) {
      // Fall back to coordinates if available
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        '_blank'
      );
    }
  };

  const handleViewAllLocations = () => {
    navigate('/saved-locations');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography variant='h6' gutterBottom sx={{ mb: 0 }}>
          Saved Locations
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : savedLocations.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // Always exactly 2 side by side
            gap: 2,
            flexGrow: 1,
            overflowY: 'auto',
            pr: 2, // Increasing padding right from 1 to 2 to avoid scrollbar overlap
            pb: 1,
          }}>
          {savedLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <Paper
                elevation={1}
                onClick={() => handleNavigateToLocation(location)}
                sx={{
                  p: 2,
                  minHeight: '85px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid',
                  borderColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-3px)',
                    transition: 'transform 0.2s ease',
                  },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                <Box sx={{ mb: 1 }}>
                  {location.isHome ? (
                    <HomeIcon color='primary' sx={{ fontSize: 28 }} />
                  ) : (
                    <LocationOnIcon color='secondary' sx={{ fontSize: 28 }} />
                  )}
                </Box>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: location.isHome ? 600 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.2',
                    fontSize: '0.85rem',
                  }}>
                  {location.name}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LocationOnIcon
            sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }}
          />
          <Typography color='text.secondary' gutterBottom>
            No saved locations to display
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={handleViewAllLocations}
            sx={{ mt: 1 }}>
            Add Locations
          </Button>
        </Box>
      )}

      {/* View All Button - Always at the bottom */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          component={Link}
          to='/saved-locations'
          variant='outlined'
          color='primary'
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 1,
            py: 1,
            fontWeight: 500,
            '&:hover': {
              color: 'primary.main', // Keep text color consistent on hover
              borderColor: 'primary.main', // Keep border color consistent
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            },
          }}>
          View All Locations
        </Button>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SavedLocationsCard;
