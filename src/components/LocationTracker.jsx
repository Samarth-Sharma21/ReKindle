import { useState, useEffect } from 'react';
import { supabase, locationService } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  useResponsive,
  commonResponsiveStyles,
} from '../styles/responsiveStyles';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const LocationTracker = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } =
    useResponsive();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);

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
  const [newLocationName, setNewLocationName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, we would use a geocoding service to get the address
          // For this demo, we'll use a placeholder address
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current location (coordinates available)',
          });
          setLoading(false);
          showNotification('Location successfully detected', 'success');
        } catch (error) {
          setError('Error getting address from coordinates');
          setLoading(false);
        }
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Save current location
  const saveCurrentLocation = async () => {
    if (!currentLocation || !newLocationName.trim()) {
      showNotification('Please provide a name for this location', 'error');
      return;
    }

    try {
      // Get the current user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const newLocation = {
        name: newLocationName,
        address: currentLocation.address,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        isHome: false,
      };

      // Save to database
      const { data, error } = await locationService.saveLocation(
        newLocation,
        user.id
      );

      if (error) throw error;

      // Add to local state (use the returned data if available, otherwise use the input)
      const locationWithId = data?.[0] || {
        ...newLocation,
        id: Date.now().toString(),
      };

      setSavedLocations([...savedLocations, locationWithId]);
      setNewLocationName('');
      setShowAddForm(false);
      showNotification('Location saved successfully', 'success');
    } catch (error) {
      console.error('Error saving location:', error.message);
      showNotification('Failed to save location', 'error');
    }
  };

  // Set a location as home
  const setAsHome = async (id) => {
    try {
      // Update in database
      const locationToUpdate = savedLocations.find((loc) => loc.id === id);
      if (locationToUpdate) {
        await locationService.updateLocation(
          { ...locationToUpdate, isHome: true },
          id
        );
      }

      // Update in local state
      setSavedLocations(
        savedLocations.map((location) => ({
          ...location,
          isHome: location.id === id,
        }))
      );
      showNotification('Home location updated', 'success');
    } catch (error) {
      console.error('Error updating home location:', error.message);
      showNotification('Failed to update home location', 'error');
    }
  };

  // Delete a saved location
  const deleteLocation = async (id) => {
    try {
      // Delete from database
      await locationService.deleteLocation(id);

      // Update local state
      setSavedLocations(
        savedLocations.filter((location) => location.id !== id)
      );
      showNotification('Location deleted', 'success');
    } catch (error) {
      console.error('Error deleting location:', error.message);
      showNotification('Failed to delete location', 'error');
    }
  };

  // Share a location
  const shareLocation = async (location) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Location: ${location.name}`,
          text: `Here's my location: ${location.address}`,
          url: `https://maps.google.com/?q=${location.address}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${location.name}: ${location.address}`);
      showNotification('Location copied to clipboard', 'success');
    }
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' component='h2' gutterBottom>
        Location Tracker
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Current Location
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={loading}
            sx={{ mr: 2 }}>
            {loading ? 'Detecting...' : 'Get My Location'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
              <Typography variant='body1'>
                <LocationOnIcon
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                {currentLocation.address}
              </Typography>

              {!showAddForm ? (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddForm(true)}
                  sx={{ mt: 2 }}>
                  Save This Location
                </Button>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    label='Location Name'
                    variant='outlined'
                    size='small'
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    sx={{ mr: 2, flexGrow: 1 }}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={saveCurrentLocation}
                    disabled={!newLocationName.trim()}>
                    Save
                  </Button>
                  <Button
                    variant='text'
                    onClick={() => setShowAddForm(false)}
                    sx={{ ml: 1 }}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Saved Locations
        </Typography>

        {savedLocations.length === 0 ? (
          <Typography variant='body1' color='text.secondary' sx={{ py: 2 }}>
            No saved locations yet. Use the "Get My Location" button above to
            add locations.
          </Typography>
        ) : (
          <List>
            {savedLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}>
                <ListItem
                  sx={{
                    bgcolor: location.isHome
                      ? 'rgba(106, 90, 205, 0.1)'
                      : 'transparent',
                    borderRadius: 1,
                  }}>
                  <ListItemIcon>
                    {location.isHome ? (
                      <HomeIcon color='primary' />
                    ) : (
                      <LocationOnIcon color='secondary' />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={location.name}
                    secondary={location.address}
                    primaryTypographyProps={{
                      fontWeight: location.isHome ? 'bold' : 'normal',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title='Share Location'>
                      <IconButton
                        edge='end'
                        onClick={() => shareLocation(location)}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    {!location.isHome && (
                      <Tooltip title='Set as Home'>
                        <IconButton
                          edge='end'
                          onClick={() => setAsHome(location.id)}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title='Delete Location'>
                      <IconButton
                        edge='end'
                        onClick={() => deleteLocation(location.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < savedLocations.length - 1 && (
                  <Divider variant='inset' component='li' />
                )}
              </motion.div>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationTracker;
