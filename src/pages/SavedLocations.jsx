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
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, locationService } from '../backend/server';

const SavedLocations = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for saved locations
  const [locations, setLocations] = useState([]);

  // Fetch locations from database on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Get the current user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          // Fallback to localStorage if not authenticated
          const savedLocations = localStorage.getItem('savedLocations');
          setLocations(savedLocations ? JSON.parse(savedLocations) : []);
          return;
        }

        const { data, error } = await locationService.getLocations(user.id);

        if (error) {
          throw error;
        }

        if (data) {
          setLocations(data);
        } else {
          // Fallback to localStorage if no data
          const savedLocations = localStorage.getItem('savedLocations');
          setLocations(savedLocations ? JSON.parse(savedLocations) : []);
        }
      } catch (error) {
        console.error('Error fetching locations:', error.message);
        // Fallback to localStorage on error
        const savedLocations = localStorage.getItem('savedLocations');
        setLocations(savedLocations ? JSON.parse(savedLocations) : []);
      }
    };

    fetchLocations();
  }, []);

  // State for location form
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    notes: '',
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
      setNewLocation({ name: '', address: '', notes: '' });
      setEditIndex(null);
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

  const handleDeleteLocation = async (index) => {
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
        message: 'Location deleted locally',
        severity: 'info',
      });
    }
  };

  const handleNavigate = (address) => {
    // Open Google Maps with the address
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      '_blank'
    );
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get address from coordinates
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || `${latitude}, ${longitude}`;
              setNewLocation({
                ...newLocation,
                address: address,
              });
            })
            .catch((error) => {
              console.error('Error getting address:', error);
              setNewLocation({
                ...newLocation,
                address: `${latitude}, ${longitude}`,
              });
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          setNotification({
            open: true,
            message: 'Unable to get your current location',
            severity: 'error',
          });
        }
      );
    } else {
      setNotification({
        open: true,
        message: 'Geolocation is not supported by your browser',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            color='primary'>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
            Saved Locations
          </Typography>
        </Box>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Search and Add */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: isDarkMode
              ? alpha(theme.palette.background.paper, 0.6)
              : theme.palette.background.paper,
          }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder='Search locations...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon color='primary' />
                    </InputAdornment>
                  ),
                }}
                variant='outlined'
                sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                startIcon={<AddLocationAltIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}>
                Add New Location
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Locations List */}
        <Grid container spacing={3}>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    },
                    bgcolor: isDarkMode
                      ? alpha(theme.palette.background.paper, 0.6)
                      : theme.palette.background.paper,
                  }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{ fontWeight: 600 }}>
                      {location.name}
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      gutterBottom>
                      {location.address}
                    </Typography>
                    {location.notes && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}>
                        {location.notes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size='small'
                      startIcon={<NavigationIcon />}
                      onClick={() => handleNavigate(location.address)}
                      color='primary'
                      variant='contained'
                      sx={{ mr: 1, borderRadius: 2, textTransform: 'none' }}>
                      Navigate
                    </Button>
                    <IconButton
                      size='small'
                      onClick={() => handleOpenDialog(index)}
                      color='primary'>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteLocation(index)}
                      color='error'>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.6)
                    : theme.palette.background.paper,
                }}>
                <Typography variant='h6' color='text.secondary'>
                  {searchTerm
                    ? 'No locations match your search'
                    : 'No saved locations yet'}
                </Typography>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<AddLocationAltIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}>
                  Add Your First Location
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Add/Edit Location Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='sm'
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}>
          <DialogTitle sx={{ fontWeight: 600 }}>
            {editIndex !== null ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Location Name'
                  name='name'
                  value={newLocation.name}
                  onChange={handleInputChange}
                  required
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Address'
                  name='address'
                  value={newLocation.address}
                  onChange={handleInputChange}
                  required
                  variant='outlined'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Tooltip title='Use current location'>
                          <IconButton
                            onClick={handleGetCurrentLocation}
                            edge='end'>
                            <MyLocationIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Notes (optional)'
                  name='notes'
                  value={newLocation.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} color='inherit'>
              Cancel
            </Button>
            <Button
              onClick={handleSaveLocation}
              variant='contained'
              color='primary'
              startIcon={<AddLocationAltIcon />}
              sx={{ borderRadius: 2, textTransform: 'none' }}>
              {editIndex !== null ? 'Update Location' : 'Save Location'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default SavedLocations;