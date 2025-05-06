import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  TextField,
  Avatar,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
  CircularProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import { AccessibilityControls, EmergencyContact } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, locationService } from '../backend/server';

// Define breakpoints explicitly to match landing page
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1200,
};

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get theme from context
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar_url: null,
    fontSize: 16,
    highContrast: false,
    notifications: true,
    reminderFrequency: 'daily',
    locationSharing: false,
  });

  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(false);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get user profile from patients table
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            ...userData,
            name: data.name || '',
            email: data.email || '',
            phone: data.mobile || '',
            avatar_url: data.avatar_url || null,
            fontSize: data.font_size || 16,
            highContrast: data.high_contrast || false,
            notifications: data.notifications !== undefined ? data.notifications : true,
            reminderFrequency: data.reminder_frequency || 'daily',
            locationSharing: data.location_sharing || false,
          });
        }

        // Fetch family members
        setLoadingFamily(true);
        const { data: familyData, error: familyError } = await supabase
          .from('family_members')
          .select('*')
          .eq('patient_id', user.id);

        if (familyError) throw familyError;
        
        if (familyData) {
          setFamilyMembers(familyData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        showNotification('Failed to load user data', 'error');
      } finally {
        setLoading(false);
        setLoadingFamily(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Show notification helper
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setUserData({ ...userData, [name]: checked });
  };

  const handleFontSizeChange = (event, newValue) => {
    setUserData({ ...userData, fontSize: newValue });
  };

  const handleSaveProfile = async () => {
    if (!user) {
      showNotification('You must be logged in to update your profile', 'error');
      return;
    }

    try {
      setSaving(true);

      // Update user profile in patients table
      const { error } = await supabase
        .from('patients')
        .update({
          name: userData.name,
          mobile: userData.phone,
          location_sharing: userData.locationSharing || false,
          font_size: userData.fontSize || 16,
          high_contrast: userData.highContrast || false,
          notifications: userData.notifications || false,
          reminder_frequency: userData.reminderFrequency || 'daily',
          // Don't update email through this method as it requires auth verification
          // email: userData.email,
        })
        .eq('id', user.id);

      if (error) throw error;

      // If location sharing is enabled, ensure we have saved locations in the database
      if (userData.locationSharing) {
        // Check if we have any saved locations in localStorage
        const savedLocations = localStorage.getItem('savedLocations');
        if (savedLocations) {
          const locations = JSON.parse(savedLocations);
          
          // Save each location to the database if it doesn't already have an ID
          for (const location of locations) {
            if (!location.id || location.id.toString().startsWith('local_')) {
              try {
                await locationService.saveLocation({
                  name: location.name,
                  address: location.address,
                  notes: location.notes || '',
                }, user.id);
              } catch (locError) {
                console.error('Error saving location:', locError);
              }
            }
          }
        }
      }

      showNotification('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      showNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container
      maxWidth='md'
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 3, sm: 4, md: 5 },
        px: { xs: 1.5, sm: 3, md: 3 },
      }}>
      <div>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 3, sm: 4, md: 5 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 0 },
            width: '100%',
          }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mr: { xs: 0, sm: 2 },
              alignSelf: { xs: 'flex-start', sm: 'center' },
              mb: { xs: 1, sm: 0 },
            }}>
            Back
          </Button>
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', sm: 'auto' },
              fontWeight: 600,
            }}>
            Settings
          </Typography>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow:
              mode === 'dark'
                ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                : '0 8px 16px rgba(0, 0, 0, 0.1)',
            mb: { xs: 4, sm: 0 },
          }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}>
            <Tab
              icon={<PersonIcon />}
              label={isMobile ? '' : 'Profile'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            />
            <Tab
              icon={<AccessibilityNewIcon />}
              label={isMobile ? '' : 'Accessibility'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            />
            <Tab
              icon={<PeopleIcon />}
              label={isMobile ? '' : 'Family Connections'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            />
            <Tab
              icon={<NotificationsIcon />}
              label={isMobile ? '' : 'Notifications'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
                Profile Information
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Update your personal information and how others see you on the
                platform.
              </Typography>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
                    <Avatar
                      src={userData.avatar_url}
                      sx={{
                        width: { xs: 100, sm: 120 },
                        height: { xs: 100, sm: 120 },
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                        fontSize: { xs: '2.5rem', sm: '3rem' },
                      }}>
                      {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Tooltip title="Upload photo">
                      <IconButton 
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          right: -10,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { bgcolor: 'background.default' }
                        }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label='Full Name'
                    name='name'
                    value={userData.name}
                    onChange={handleInputChange}
                    margin='normal'
                    variant='outlined'
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label='Email Address'
                    name='email'
                    value={userData.email}
                    onChange={handleInputChange}
                    margin='normal'
                    variant='outlined'
                    disabled
                    helperText="Email cannot be changed directly. Contact support for assistance."
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label='Phone Number'
                    name='phone'
                    value={userData.phone}
                    onChange={handleInputChange}
                    margin='normal'
                    variant='outlined'
                    placeholder="e.g. 9876543210"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', sm: 'flex-end' },
                      mt: { xs: 3, sm: 2 },
                    }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveProfile}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{
                        borderRadius: 2,
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1, sm: 1.2 },
                        width: { xs: '100%', sm: 'auto' }
                      }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Accessibility Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 }
                }}>
                Display Settings
              </Typography>
              
              <Typography variant='body2' paragraph color='text.secondary' sx={{
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 2, sm: 2.5 }
              }}>
                Customize how the application looks and feels to improve your experience.
              </Typography>

              {/* Theme Toggle */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Theme Mode
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mode === 'dark'}
                        onChange={toggleTheme}
                        color='primary'
                        size={isMobile ? 'medium' : 'large'}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {mode === 'dark' ? (
                          <>
                            <DarkModeIcon color='primary' />
                            <Typography sx={{ fontWeight: 500 }}>Dark Mode</Typography>
                          </>
                        ) : (
                          <>
                            <LightModeIcon color='primary' />
                            <Typography sx={{ fontWeight: 500 }}>Light Mode</Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </Box>
              </Paper>

              {/* Font Size Control */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Text Size
                </Typography>
                
                <Box sx={{ px: { xs: 1, sm: 2 }, mb: 1 }}>
                  <Typography
                    id='font-size-slider'
                    gutterBottom
                    sx={{
                      textAlign: { xs: 'center', sm: 'left' },
                      mb: 2,
                      display: 'flex',
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: 'center',
                      gap: { xs: 0, sm: 2 }
                    }}>
                    <span>Font Size:</span> 
                    <Box 
                      component="span" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main',
                        fontSize: { xs: '1.1rem', sm: '1.2rem' }
                      }}
                    >
                      {userData.fontSize}px
                    </Box>
                  </Typography>
                  
                  <Box sx={{ px: { xs: 1, sm: 2 } }}>
                    <Slider
                      value={userData.fontSize}
                      onChange={handleFontSizeChange}
                      aria-labelledby='font-size-slider'
                      valueLabelDisplay='auto'
                      step={1}
                      marks={[
                        { value: 12, label: 'A' },
                        { value: 18, label: 'A' },
                        { value: 24, label: 'A' },
                      ]}
                      min={12}
                      max={24}
                      sx={{
                        '& .MuiSlider-markLabel': {
                          fontSize: (mark) => `${mark.value / 16}rem`,
                        },
                        '& .MuiSlider-thumb': {
                          height: 24,
                          width: 24,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
                          },
                        },
                        '& .MuiSlider-track': {
                          height: 8,
                        },
                        '& .MuiSlider-rail': {
                          height: 8,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant='body2' 
                    color='text.secondary' 
                    sx={{ 
                      mt: 2, 
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Adjust the slider to change text size throughout the application
                  </Typography>
                </Box>
              </Paper>
              
              {/* High Contrast Mode */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Visibility Options
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userData.highContrast}
                        onChange={handleSwitchChange}
                        name='highContrast'
                        color='primary'
                        size={isMobile ? 'medium' : 'large'}
                      />
                    }
                    label='High Contrast Mode'
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography 
                    variant='body2' 
                    color='text.secondary' 
                    sx={{ 
                      mt: 1, 
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Increases contrast between text and background for better readability
                  </Typography>
                </Box>
              </Paper>
              
              <Divider sx={{ my: { xs: 2, sm: 3 } }} />
              
              {/* Additional Accessibility Controls */}
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontWeight: 600,
                  mb: { xs: 2, sm: 2.5 },
                  mt: { xs: 2, sm: 3 }
                }}>
                Additional Controls
              </Typography>
              
              <AccessibilityControls />
            </Box>
          )}

          {/* Family Connections Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>
                Family Members & Caregivers
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Manage your connected family members and caregivers who can
                access your memories and help you.
              </Typography>
              
              {/* Family Members Section */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Connected Family Members
                </Typography>
                
                {loadingFamily ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : familyMembers.length > 0 ? (
                  <Box sx={{ width: '100%' }}>
                    {familyMembers.map((member) => (
                      <Paper
                        key={member.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          justifyContent: 'space-between',
                          gap: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {member.name ? member.name.charAt(0).toUpperCase() : 'F'}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {member.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.relationship || 'Family Member'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Family members can register using your email address to connect to your account.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      No family members connected yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Family members can register using your email address to connect to your account.
                    </Typography>
                  </Box>
                )}
              </Paper>
              
              {/* Location Sharing Section */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Location Sharing Preferences
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userData.locationSharing || false}
                        onChange={handleSwitchChange}
                        name='locationSharing'
                        color='primary'
                        size={isMobile ? 'medium' : 'large'}
                      />
                    }
                    label='Share my location with family members'
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography 
                    variant='body2' 
                    color='text.secondary' 
                    sx={{ 
                      mt: 1, 
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    When enabled, your family members can see your current location
                  </Typography>
                  
                  <Button
                    variant='outlined'
                    color='primary'
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate('/saved-locations')}
                  >
                    Manage Saved Locations
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant='h6' 
                gutterBottom 
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 }
                }}
              >
                Notification Preferences
              </Typography>
              
              <Typography variant='body2' paragraph color='text.secondary' sx={{
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 2, sm: 2.5 }
              }}>
                Customize how and when you receive notifications about your memories and connections.
              </Typography>
              
              {/* Enable Notifications Toggle */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Notification Settings
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userData.notifications}
                        onChange={handleSwitchChange}
                        name='notifications'
                        color='primary'
                        size={isMobile ? 'medium' : 'large'}
                      />
                    }
                    label='Enable Notifications'
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography 
                    variant='body2' 
                    color='text.secondary' 
                    sx={{ 
                      mt: 1, 
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Receive timely reminders to add memories and stay connected
                  </Typography>
                </Box>
              </Paper>
              
              {/* Reminder Frequency */}
              <Paper 
                elevation={1} 
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  opacity: userData.notifications ? 1 : 0.7
                }}
              >
                <Typography 
                  variant='subtitle1' 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 2,
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}
                >
                  Reminder Frequency
                </Typography>
                
                <FormControl 
                  fullWidth 
                  disabled={!userData.notifications}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                >
                  <InputLabel id='reminder-frequency-label'>
                    Reminder Frequency
                  </InputLabel>
                  <Select
                    labelId='reminder-frequency-label'
                    id='reminder-frequency'
                    value={userData.reminderFrequency}
                    label='Reminder Frequency'
                    name='reminderFrequency'
                    onChange={handleInputChange}
                  >
                    <MenuItem value='daily'>Daily</MenuItem>
                    <MenuItem value='weekly'>Weekly</MenuItem>
                    <MenuItem value='monthly'>Monthly</MenuItem>
                  </Select>
                  
                  <Typography 
                    variant='body2' 
                    color='text.secondary' 
                    sx={{ 
                      mt: 2, 
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Choose how often you'd like to receive memory reminders
                  </Typography>
                </FormControl>
              </Paper>
            </Box>
          )}
        </Paper>

        <Paper elevation={2} sx={{ mt: 4, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
            mb: { xs: 2, sm: 1 }
          }}>
            <SecurityIcon color='primary' sx={{ mr: { xs: 0, sm: 2 }, fontSize: { xs: 28, sm: 30 } }} />
            <Typography 
              variant='h6' 
              sx={{ 
                fontWeight: 600,
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Account Security
            </Typography>
          </Box>
          <Typography 
            variant='body2' 
            color='text.secondary' 
            sx={{ 
              mb: 2, 
              textAlign: { xs: 'center', sm: 'left' },
              display: { xs: 'block', sm: 'block' }
            }}
          >
            Manage your account security settings and preferences
          </Typography>
          <Divider sx={{ my: { xs: 2, sm: 2.5 } }} />
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 1, sm: 1.5 } }}>
            <Grid item xs={12} sm={6}>
              <Button 
                variant='outlined' 
                fullWidth
                sx={{ 
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                Change Password
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                variant='outlined' 
                color='error' 
                fullWidth
                sx={{ 
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Container>
  );
};

export default Settings;
