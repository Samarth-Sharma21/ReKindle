import { useState, useEffect, useRef } from 'react';
import {
  supabase,
  locationService,
  emergencyContactService,
} from '../backend/server';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  useTheme,
  Menu,
  MenuItem,
  ListItemButton,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import NavigationIcon from '@mui/icons-material/Navigation';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

const EnhancedLocationTracker = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const geocoderRef = useRef(null);

  // State for location data
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // UI states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    lat: null,
    lng: null,
    notes: '',
    isHome: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Share location states
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();

    // Fetch emergency contacts
    fetchEmergencyContacts();

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultLocation = { lat: 40.7128, lng: -74.006 }; // Default to NYC

    const mapOptions = {
      zoom: 13,
      center: defaultLocation,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: isDarkMode
        ? [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#242f3e' }],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#746855' }],
            },
          ]
        : [],
    };

    googleMapRef.current = new window.google.maps.Map(
      mapRef.current,
      mapOptions
    );
    geocoderRef.current = new window.google.maps.Geocoder();

    // Get current location after map is initialized
    getCurrentLocation();

    // Fetch saved locations
    fetchSavedLocations();
  };

  // Fetch saved locations from database
  const fetchSavedLocations = async () => {
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

        // Add markers for saved locations
        if (googleMapRef.current) {
          data.forEach((location) => {
            if (location.lat && location.lng) {
              addMarker({
                lat: location.lat,
                lng: location.lng,
                title: location.name,
                isHome: location.isHome,
              });
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error.message);
      setError('Failed to load saved locations');
    } finally {
      setLoading(false);
    }
  };

  // Get current location with high accuracy
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    // Use high accuracy options for better precision
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy; // Accuracy in meters

          // Center map on current location
          if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat, lng });

            // Zoom level based on accuracy (higher accuracy = higher zoom)
            const zoomLevel = Math.min(
              20,
              Math.max(15, 20 - Math.log2(accuracy / 10))
            );
            googleMapRef.current.setZoom(zoomLevel);

            // Add marker for current location
            const marker = addMarker({
              lat,
              lng,
              title: 'Current Location',
              animation: window.google.maps.Animation.DROP,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: theme.palette.primary.main,
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
              },
            });

            // Add accuracy circle
            new window.google.maps.Circle({
              strokeColor: theme.palette.primary.main,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: theme.palette.primary.main,
              fillOpacity: 0.1,
              map: googleMapRef.current,
              center: { lat, lng },
              radius: accuracy,
            });
          }

          // Get address from coordinates using Geocoder
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results, status) => {
                if (status === 'OK' && results[0]) {
                  const address = results[0].formatted_address;
                  setCurrentLocation({
                    lat,
                    lng,
                    address,
                    accuracy,
                  });
                } else {
                  setCurrentLocation({
                    lat,
                    lng,
                    address: 'Address not found',
                    accuracy,
                  });
                }
                setLoading(false);
                showNotification(
                  `Location detected (±${Math.round(accuracy)}m)`,
                  'success'
                );
              }
            );
          } else {
            setCurrentLocation({
              lat,
              lng,
              address: 'Geocoder not available',
              accuracy,
            });
            setLoading(false);
          }
        } catch (error) {
          setError('Error getting address from coordinates');
          setLoading(false);
        }
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      },
      geoOptions
    );
  };

  // Add marker to map
  const addMarker = (options) => {
    if (!googleMapRef.current) return null;

    const marker = new window.google.maps.Marker({
      position: { lat: options.lat, lng: options.lng },
      map: googleMapRef.current,
      title: options.title,
      animation: options.animation,
      icon:
        options.icon ||
        (options.isHome
          ? {
              path: window.google.maps.SymbolPath.HOME,
              scale: 12,
              fillColor: '#4CAF50',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }
          : null),
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div><strong>${options.title}</strong></div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(googleMapRef.current, marker);
    });

    return marker;
  };

  // Search for a location
  const searchLocation = () => {
    if (!searchQuery.trim() || !geocoderRef.current) {
      showNotification('Please enter a location to search', 'error');
      return;
    }

    setLoading(true);

    geocoderRef.current.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;

        // Center map on search result
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat, lng });
          googleMapRef.current.setZoom(15);

          // Add marker for search result
          addMarker({
            lat,
            lng,
            title: address,
            animation: window.google.maps.Animation.DROP,
          });
        }

        setCurrentLocation({
          lat,
          lng,
          address,
        });

        // Pre-fill new location form
        setNewLocation({
          name: searchQuery,
          address,
          lat,
          lng,
          notes: '',
          isHome: false,
        });

        showNotification('Location found', 'success');
      } else {
        showNotification(
          'Location not found. Please try a different search.',
          'error'
        );
      }
      setLoading(false);
    });
  };

  // Open Google Maps navigation
  const navigateToLocation = (location) => {
    if (!location || !location.lat || !location.lng) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  // Handle dialog open/close
  const handleOpenDialog = (locationId = null) => {
    if (locationId) {
      // Edit existing location
      const locationToEdit = savedLocations.find(
        (loc) => loc.id === locationId
      );
      if (locationToEdit) {
        setNewLocation(locationToEdit);
        setEditingLocationId(locationId);
      }
    } else {
      // Add new location
      if (currentLocation) {
        setNewLocation({
          name: '',
          address: currentLocation.address,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          notes: '',
          isHome: false,
        });
      } else {
        setNewLocation({
          name: '',
          address: '',
          lat: null,
          lng: null,
          notes: '',
          isHome: false,
        });
      }
      setEditingLocationId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewLocation({ ...newLocation, [name]: checked });
  };

  // Show notification
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

  // Save location
  const saveLocation = async () => {
    // Validate inputs
    if (!newLocation.name || !newLocation.address) {
      showNotification('Name and address are required', 'error');
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

      if (editingLocationId) {
        // Update existing location
        const { data, error } = await locationService.updateLocation(
          newLocation,
          editingLocationId
        );

        if (error) throw error;

        // Update in local state
        setSavedLocations(
          savedLocations.map((location) =>
            location.id === editingLocationId
              ? { ...location, ...newLocation }
              : location
          )
        );

        showNotification('Location updated successfully');
      } else {
        // Add new location
        const { data, error } = await locationService.saveLocation(
          newLocation,
          user.id
        );

        if (error) throw error;

        // Add to local state
        const locationWithId = data?.[0] || {
          ...newLocation,
          id: Date.now().toString(),
        };
        setSavedLocations([...savedLocations, locationWithId]);

        // Add marker for new location
        if (googleMapRef.current && newLocation.lat && newLocation.lng) {
          addMarker({
            lat: newLocation.lat,
            lng: newLocation.lng,
            title: newLocation.name,
            isHome: newLocation.isHome,
          });
        }

        showNotification('Location saved successfully');
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving location:', error.message);
      showNotification('Failed to save location', 'error');
    }
  };

  // Set a location as home
  const setAsHome = async (id) => {
    try {
      const locationToUpdate = savedLocations.find((loc) => loc.id === id);
      if (!locationToUpdate) return;

      const updatedLocation = {
        ...locationToUpdate,
        isHome: true,
      };

      // Update in database
      const { error } = await locationService.updateLocation(
        updatedLocation,
        id
      );

      if (error) throw error;

      // Update in local state
      setSavedLocations(
        savedLocations.map((location) => ({
          ...location,
          isHome: location.id === id,
        }))
      );

      showNotification('Home location updated');

      // Refresh map markers
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({
          lat: locationToUpdate.lat,
          lng: locationToUpdate.lng,
        });
      }
    } catch (error) {
      console.error('Error updating home location:', error.message);
      showNotification('Failed to update home location', 'error');
    }
  };

  // Delete a location
  const deleteLocation = async (id) => {
    try {
      // Delete from database
      const { error } = await locationService.deleteLocation(id);

      if (error) throw error;

      // Update local state
      setSavedLocations(
        savedLocations.filter((location) => location.id !== id)
      );
      showNotification('Location deleted');
    } catch (error) {
      console.error('Error deleting location:', error.message);
      showNotification('Failed to delete location', 'error');
    }
  };

  // Fetch emergency contacts
  const fetchEmergencyContacts = async () => {
    try {
      // Get the current user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return;
      }

      const { data, error } = await emergencyContactService.getContacts(
        user.id
      );

      if (error) throw error;

      if (data && data.length > 0) {
        setEmergencyContacts(data);
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error.message);
    }
  };

  // Share current location with emergency contacts
  const shareCurrentLocation = () => {
    if (!currentLocation) {
      showNotification('No location to share', 'error');
      return;
    }

    if (emergencyContacts.length === 0) {
      showNotification(
        'No emergency contacts found. Please add contacts in settings.',
        'warning'
      );
      return;
    }

    setSelectedContacts([]);
    setShareDialogOpen(true);
  };

  // Handle contact selection for sharing
  const handleContactToggle = (contactId) => {
    const currentIndex = selectedContacts.indexOf(contactId);
    const newSelectedContacts = [...selectedContacts];

    if (currentIndex === -1) {
      newSelectedContacts.push(contactId);
    } else {
      newSelectedContacts.splice(currentIndex, 1);
    }

    setSelectedContacts(newSelectedContacts);
  };

  // Send location to selected contacts
  const sendLocationToContacts = () => {
    if (selectedContacts.length === 0) {
      showNotification('Please select at least one contact', 'warning');
      return;
    }

    // In a real app, this would send the location via SMS, email, or app notification
    // For this demo, we'll just show a success message
    const selectedContactNames = emergencyContacts
      .filter((contact) => selectedContacts.includes(contact.id))
      .map((contact) => contact.name)
      .join(', ');

    showNotification(
      `Location shared with: ${selectedContactNames}`,
      'success'
    );
    setShareDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          height: '100%',
        }}>
        <Typography variant='h6' gutterBottom>
          Location Tracker
        </Typography>

        {/* Search and Current Location */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
          }}>
          <TextField
            fullWidth
            placeholder='Search for a location'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={searchLocation}
            disabled={loading}
            startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={getCurrentLocation}
            disabled={loading}
            startIcon={<MyLocationIcon />}>
            Current
          </Button>
        </Box>

        {/* Map Container */}
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '300px',
            mb: 3,
            borderRadius: 1,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        />

        {/* Current Location Info */}
        {currentLocation && (
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 1,
              bgcolor: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
            }}>
            <Typography variant='subtitle1' gutterBottom>
              Current Location
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              {currentLocation.address}
            </Typography>
            {currentLocation.accuracy && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'block', mb: 1 }}>
                Accuracy: ±{Math.round(currentLocation.accuracy)} meters
              </Typography>
            )}
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button
                size='small'
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                disabled={!currentLocation}>
                Save Location
              </Button>
              <Button
                size='small'
                variant='outlined'
                startIcon={<NavigationIcon />}
                onClick={() => navigateToLocation(currentLocation)}>
                Navigate
              </Button>
              <Button
                size='small'
                variant='outlined'
                color='secondary'
                startIcon={<ShareIcon />}
                onClick={() => shareCurrentLocation()}
                disabled={!currentLocation}>
                Share Location
              </Button>
            </Box>
          </Paper>
        )}

        {/* Saved Locations */}
        <Typography variant='subtitle1' gutterBottom>
          Saved Locations
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : savedLocations.length > 0 ? (
          <List>
            {savedLocations.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                <ListItem
                  sx={{
                    mb: 1,
                    bgcolor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      bgcolor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}>
                  <ListItemIcon>
                    {location.isHome ? (
                      <HomeIcon color='primary' />
                    ) : (
                      <LocationOnIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={location.name}
                    secondary={
                      <>
                        <Typography variant='body2' color='text.secondary'>
                          {location.address}
                        </Typography>
                        {location.notes && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mt: 0.5 }}>
                            Note: {location.notes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title='Navigate'>
                      <IconButton
                        edge='end'
                        onClick={() =>
                          navigateToLocation({
                            lat: location.lat,
                            lng: location.lng,
                          })
                        }
                        sx={{ mr: 1 }}>
                        <NavigationIcon />
                      </IconButton>
                    </Tooltip>
                    {!location.isHome && (
                      <Tooltip title='Set as Home'>
                        <IconButton
                          edge='end'
                          onClick={() => setAsHome(location.id)}
                          sx={{ mr: 1 }}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title='Edit'>
                      <IconButton
                        edge='end'
                        onClick={() => handleOpenDialog(location.id)}
                        sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton
                        edge='end'
                        onClick={() => deleteLocation(location.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 2,
            }}>
            <Typography color='text.secondary'>
              No saved locations. Use the search or current location to add one.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Location Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth>
        <DialogTitle>
          {editingLocationId ? 'Edit Location' : 'Save Location'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Location Name'
            type='text'
            fullWidth
            value={newLocation.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='address'
            label='Address'
            type='text'
            fullWidth
            value={newLocation.address}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='notes'
            label='Notes'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={newLocation.notes || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveLocation} variant='contained' color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Share Location Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth='xs'
        fullWidth>
        <DialogTitle>Share Location</DialogTitle>
        <DialogContent>
          <Typography variant='subtitle2' gutterBottom>
            Select contacts to share your current location:
          </Typography>
          {currentLocation && (
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              {currentLocation.address}
            </Typography>
          )}
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {emergencyContacts.length > 0 ? (
              emergencyContacts.map((contact) => (
                <ListItem key={contact.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleContactToggle(contact.id)}
                    dense>
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        checked={selectedContacts.indexOf(contact.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.phone || contact.email}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary='No emergency contacts found' />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={sendLocationToContacts}
            variant='contained'
            color='primary'
            disabled={selectedContacts.length === 0}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedLocationTracker;
