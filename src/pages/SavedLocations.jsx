import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { supabase, locationService } from '../backend/server';

const SavedLocations = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for saved locations
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Fetch locations from database on component mount
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
          // Fallback to localStorage if not authenticated
          const savedLocations = localStorage.getItem('savedLocations');
          const locationsData = savedLocations
            ? JSON.parse(savedLocations)
            : [];
          setLocations(locationsData);
          setFilteredLocations(locationsData);
          setLoading(false);
          return;
        }

        const { data, error } = await locationService.getLocations(user.id);

        if (error) {
          throw error;
        }

        if (data) {
          setLocations(data);
          setFilteredLocations(data);
        } else {
          // Fallback to localStorage if no data
          const savedLocations = localStorage.getItem('savedLocations');
          const locationsData = savedLocations
            ? JSON.parse(savedLocations)
            : [];
          setLocations(locationsData);
          setFilteredLocations(locationsData);
        }
      } catch (error) {
        console.error('Error fetching locations:', error.message);
        // Fallback to localStorage on error
        const savedLocations = localStorage.getItem('savedLocations');
        const locationsData = savedLocations ? JSON.parse(savedLocations) : [];
        setLocations(locationsData);
        setFilteredLocations(locationsData);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // State for location form
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    notes: '',
    isHome: false,
  });

  // UI states
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    index: null,
    locationName: '',
  });

  // Filter locations based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (location.notes &&
            location.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  // Save locations to localStorage as backup whenever they change
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(locations));
  }, [locations]);

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      // Edit existing location
      setNewLocation(locations[index]);
      setEditIndex(index);
    } else {
      // Add new location
      setNewLocation({ name: '', address: '', notes: '', isHome: false });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveLocation = async () => {
    // Validate inputs
    if (!newLocation.name || !newLocation.address) {
      setNotification({
        open: true,
        message: 'Name and address are required',
        severity: 'error',
      });
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

      if (editIndex !== null) {
        // Update existing location in database
        const locationToUpdate = locations[editIndex];
        const locationId = locationToUpdate.id;

        if (locationId) {
          // If the location has an ID, update it in the database
          await locationService.updateLocation(newLocation, locationId);
        }

        // Update in local state
        const updatedLocations = [...locations];
        updatedLocations[editIndex] = newLocation;
        setLocations(updatedLocations);

        setNotification({
          open: true,
          message: 'Location updated successfully',
          severity: 'success',
        });
      } else {
        // Add new location to database
        const { data, error } = await locationService.saveLocation(
          newLocation,
          user.id
        );

        if (error) throw error;

        // Add to local state (use the returned data if available, otherwise use the input)
        const newLocationWithId = data?.[0] || {
          ...newLocation,
          id: Date.now().toString(),
        };
        setLocations([...locations, newLocationWithId]);

        setNotification({
          open: true,
          message: 'Location saved successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error saving location:', error.message);

      // Fallback to local storage only
      if (editIndex !== null) {
        // Update existing location
        const updatedLocations = [...locations];
        updatedLocations[editIndex] = newLocation;
        setLocations(updatedLocations);
      } else {
        // Add new location
        setLocations([
          ...locations,
          { ...newLocation, id: Date.now().toString() },
        ]);
      }

      setNotification({
        open: true,
        message: 'Location saved locally (offline mode)',
        severity: 'info',
      });
    }

    handleCloseDialog();
  };

  const openDeleteConfirmation = (index) => {
    setConfirmDeleteDialog({
      open: true,
      index,
      locationName: locations[index].name,
    });
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteDialog({
      ...confirmDeleteDialog,
      open: false,
    });
  };

  const handleDeleteLocation = async () => {
    const index = confirmDeleteDialog.index;

    try {
      const locationToDelete = locations[index];
      const locationId = locationToDelete.id;

      if (locationId) {
        // If the location has an ID, delete it from the database
        await locationService.deleteLocation(locationId);
      }

      // Update local state
      const updatedLocations = locations.filter((_, i) => i !== index);
      setLocations(updatedLocations);

      setNotification({
        open: true,
        message: 'Location deleted',
        severity: 'info',
      });
    } catch (error) {
      console.error('Error deleting location:', error.message);

      // Still update local state even if database operation fails
      const updatedLocations = locations.filter((_, i) => i !== index);
      setLocations(updatedLocations);

      setNotification({
        open: true,
        message: 'Location deleted (offline mode)',
        severity: 'info',
      });
    }

    closeDeleteConfirmation();
  };

  const handleNavigateToLocation = (location) => {
    // Show notification and open Google Maps with the location
    setNotification({
      open: true,
      message: `Navigating to ${location.name}`,
      severity: 'info',
    });

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

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setNotification({
        open: true,
        message: 'Getting your current location...',
        severity: 'info',
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Reverse geocode to get the address
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
            }`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.status === 'OK' && data.results.length > 0) {
                const address = data.results[0].formatted_address;
                setNewLocation({
                  ...newLocation,
                  address,
                  lat,
                  lng,
                });
              } else {
                setNewLocation({
                  ...newLocation,
                  address: `Latitude: ${lat}, Longitude: ${lng}`,
                  lat,
                  lng,
                });
              }
            })
            .catch((error) => {
              console.error('Error getting address:', error);
              setNewLocation({
                ...newLocation,
                address: `Latitude: ${lat}, Longitude: ${lng}`,
                lat,
                lng,
              });
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          setNotification({
            open: true,
            message: 'Could not get your location. Please check permissions.',
            severity: 'error',
          });
        }
      );
    } else {
      setNotification({
        open: true,
        message: 'Geolocation is not supported by this browser.',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        pt: { xs: 2, sm: 3 },
        pb: { xs: 6, sm: 8 },
      }}>
      <Container maxWidth='lg' sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 3, sm: 4 },
            flexWrap: 'wrap',
            gap: 1,
          }}>
          <IconButton onClick={handleBack} edge='start' sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component='h1'
            sx={{
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
            }}>
            <LocationOnIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Saved Locations
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddLocationAltIcon />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ borderRadius: 1 }}>
            Add Location
          </Button>
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
          <TextField
            fullWidth
            placeholder='Search locations by name or address...'
            variant='outlined'
            size='small'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Locations Grid - Modern Design */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredLocations.length > 0 ? (
          <Box
            sx={{
              py: 2,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
              width: '100%',
            }}>
            {filteredLocations.map((location, index) => (
              <Paper
                key={location.id || index}
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.15)
                    : theme.palette.background.paper,
                  border: '1px solid',
                  borderColor: isDarkMode
                    ? alpha('rgb(250, 167, 43)', 0.2)
                    : alpha(theme.palette.divider, 0.5),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: isDarkMode
                      ? alpha('rgb(248, 166, 43)', 0.4)
                      : alpha(theme.palette.primary.main, 0.3),
                  },
                }}>
                {/* Header with icon and name - clickable for navigation */}
                <Box
                  onClick={() => handleNavigateToLocation(location)}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderBottom: '1px solid',
                    borderColor: isDarkMode
                      ? alpha(theme.palette.divider, 0.2)
                      : theme.palette.divider,
                    background: location.isHome
                      ? isDarkMode
                        ? alpha('rgb(252, 165, 35)', 0.15)
                        : alpha(theme.palette.primary.light, 0.15)
                      : isDarkMode
                      ? alpha('rgb(251, 165, 45)', 0.1)
                      : alpha(theme.palette.secondary.light, 0.08),
                    cursor: 'pointer',
                    '&:hover': {
                      background: location.isHome
                        ? isDarkMode
                          ? alpha('#FF9800', 0.2)
                          : alpha(theme.palette.primary.light, 0.25)
                        : isDarkMode
                        ? alpha('rgb(255, 144, 34)', 0.15)
                        : alpha(theme.palette.secondary.light, 0.15),
                    },
                  }}>
                  <Box
                    sx={{
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      background: isDarkMode
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.03),
                      boxShadow: `0 0 0 2px ${
                        location.isHome
                          ? isDarkMode
                            ? alpha('#FF9800', 0.5)
                            : alpha(theme.palette.primary.main, 0.4)
                          : isDarkMode
                          ? alpha('#FF5722', 0.5)
                          : alpha(theme.palette.secondary.main, 0.4)
                      }`,
                    }}>
                    {location.isHome ? (
                      <HomeIcon
                        sx={{
                          color: isDarkMode
                            ? '#FFB74D'
                            : theme.palette.primary.main,
                          fontSize: 28,
                        }}
                      />
                    ) : (
                      <LocationOnIcon
                        sx={{
                          color: isDarkMode
                            ? '#FF8A65'
                            : theme.palette.secondary.main,
                          fontSize: 28,
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 600,
                      color: isDarkMode
                        ? '#FAFAFA'
                        : theme.palette.text.primary,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {location.name}
                  </Typography>
                </Box>

                {/* Location content */}
                <Box
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => handleNavigateToLocation(location)}>
                  <Typography
                    variant='body1'
                    sx={{
                      color: isDarkMode
                        ? '#E0E0E0'
                        : theme.palette.text.secondary,
                      mb: 1,
                      fontSize: '0.9rem',
                      wordBreak: 'break-word',
                    }}>
                    {location.address}
                  </Typography>

                  {location.notes && (
                    <Typography
                      variant='body2'
                      sx={{
                        color: isDarkMode
                          ? alpha('#E0E0E0', 0.7)
                          : alpha(theme.palette.text.secondary, 0.8),
                        fontSize: '0.8rem',
                        mt: 'auto',
                        pt: 1,
                        fontStyle: 'italic',
                      }}>
                      {location.notes}
                    </Typography>
                  )}
                </Box>

                {/* Action buttons - moved to bottom */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid',
                    borderColor: isDarkMode
                      ? alpha(theme.palette.divider, 0.2)
                      : theme.palette.divider,
                    bgcolor: isDarkMode
                      ? alpha('#424242', 0.7)
                      : alpha(theme.palette.background.default, 0.5),
                    mt: 'auto',
                  }}>
                  <IconButton
                    aria-label='Edit location'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(index);
                    }}
                    sx={{
                      flex: 1,
                      color: isDarkMode ? '#4FC3F7' : theme.palette.info.main,
                      py: 1.2,
                      borderRadius: 0,
                      '&:hover': {
                        bgcolor: isDarkMode
                          ? alpha('#4FC3F7', 0.1)
                          : alpha(theme.palette.info.main, 0.08),
                      },
                    }}>
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <Divider orientation='vertical' flexItem />
                  <IconButton
                    aria-label='Delete location'
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(index);
                    }}
                    sx={{
                      flex: 1,
                      color: isDarkMode ? '#EF9A9A' : theme.palette.error.main,
                      py: 1.2,
                      borderRadius: 0,
                      '&:hover': {
                        bgcolor: isDarkMode
                          ? alpha('#EF9A9A', 0.1)
                          : alpha(theme.palette.error.main, 0.08),
                      },
                    }}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: 5,
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.4)
                : theme.palette.background.paper,
            }}>
            <LocationOnIcon
              sx={{
                fontSize: 60,
                color: 'text.secondary',
                opacity: 0.5,
                mb: 2,
              }}
            />
            <Typography variant='h6' gutterBottom>
              No locations saved yet
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {searchTerm
                ? 'No locations match your search criteria'
                : 'Add your important places to easily find them later'}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              startIcon={<AddLocationAltIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 2 }}>
              Add First Location
            </Button>
          </Paper>
        )}
      </Container>

      {/* Add/Edit Location Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Location' : 'Add New Location'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label='Location Name'
              name='name'
              value={newLocation.name}
              onChange={handleInputChange}
              required
              variant='outlined'
              margin='dense'
              placeholder='Home, Work, etc.'
            />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth
                label='Address'
                name='address'
                value={newLocation.address}
                onChange={handleInputChange}
                required
                variant='outlined'
                margin='dense'
                placeholder='Enter full address'
                multiline
                rows={2}
              />
              <IconButton onClick={handleGetCurrentLocation} sx={{ mt: 1 }}>
                <MyLocationIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label='Notes (optional)'
              name='notes'
              value={newLocation.notes || ''}
              onChange={handleInputChange}
              variant='outlined'
              margin='dense'
              placeholder='Any additional details about this location'
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <input
                type='checkbox'
                id='isHome'
                name='isHome'
                checked={newLocation.isHome || false}
                onChange={handleInputChange}
              />
              <label htmlFor='isHome' style={{ marginLeft: 8 }}>
                Set as home location
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveLocation}
            variant='contained'
            color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteDialog.open} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{confirmDeleteDialog.locationName}
            "? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteLocation} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Loading indicator
const CircularProgress = () => (
  <Box
    sx={{
      display: 'inline-block',
      width: 40,
      height: 40,
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '50%',
      borderTopColor: 'primary.main',
      animation: 'spin 1s ease-in-out infinite',
      '@keyframes spin': {
        to: {
          transform: 'rotate(360deg)',
        },
      },
    }}
  />
);

export default SavedLocations;
