import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const LocationTracker = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedLocations, setSavedLocations] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, Anytown, USA',
      isHome: true,
    },
    {
      id: 2,
      name: "Doctor's Office",
      address: '456 Medical Plaza, Anytown, USA',
      isHome: false,
    },
    {
      id: 3,
      name: 'Favorite Park',
      address: '789 Green Avenue, Anytown, USA',
      isHome: false,
    },
  ]);
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
  const saveCurrentLocation = () => {
    if (!currentLocation || !newLocationName.trim()) {
      showNotification('Please provide a name for this location', 'error');
      return;
    }

    const newLocation = {
      id: Date.now(),
      name: newLocationName,
      address: currentLocation.address,
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      isHome: false,
    };

    setSavedLocations([...savedLocations, newLocation]);
    setNewLocationName('');
    setShowAddForm(false);
    showNotification('Location saved successfully', 'success');
  };

  // Set a location as home
  const setAsHome = (id) => {
    setSavedLocations(
      savedLocations.map((location) => ({
        ...location,
        isHome: location.id === id,
      }))
    );
    showNotification('Home location updated', 'success');
  };

  // Delete a saved location
  const deleteLocation = (id) => {
    setSavedLocations(savedLocations.filter((location) => location.id !== id));
    showNotification('Location deleted', 'success');
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
