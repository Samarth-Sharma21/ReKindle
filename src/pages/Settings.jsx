import { useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AccessibilityControls, EmergencyContact } from '../components';
import { useTheme } from '../contexts/ThemeContext';

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
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get theme from context
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(`(max-width:${breakpoints.sm}px)`);
  const isTablet = useMediaQuery(
    `(min-width:${breakpoints.sm}px) and (max-width:${breakpoints.md}px)`
  );

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '(555) 123-4567',
    fontSize: 16,
    highContrast: false,
    notifications: true,
    reminderFrequency: 'daily',
  });

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

  const handleSaveProfile = () => {
    // In a real app, this would save to a backend
    setNotification({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success',
    });
    setTimeout(() => {
      setNotification({ ...notification, open: false });
    }, 3000);
  };

  return (
    <Container
      maxWidth='md'
      sx={{
        mt: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 3 },
      }}>
      <div>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mr: { xs: 0, sm: 2 },
              alignSelf: { xs: 'flex-start', sm: 'center' },
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
            }}>
            Settings
          </Typography>
        </Box>

        {notification.open && (
          <Alert severity={notification.severity} sx={{ mb: 3 }}>
            {notification.message}
          </Alert>
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
              }}
            />
            <Tab
              icon={<AccessibilityNewIcon />}
              label={isMobile ? '' : 'Accessibility'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
              }}
            />
            <Tab
              icon={<PeopleIcon />}
              label={isMobile ? '' : 'Family Connections'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
              }}
            />
            <Tab
              icon={<NotificationsIcon />}
              label={isMobile ? '' : 'Notifications'}
              iconPosition='start'
              sx={{
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
              }}
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      mx: 'auto',
                      mb: 2,
                    }}
                    alt={userData.name}
                    src='/placeholder-avatar.jpg'>
                    {userData.name.charAt(0)}
                  </Avatar>
                  <Button
                    variant='outlined'
                    color='primary'
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: { xs: 2, sm: 3 },
                    }}>
                    Change Photo
                  </Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      textAlign: { xs: 'center', md: 'left' },
                    }}>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Full Name'
                        name='name'
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Email Address'
                        name='email'
                        type='email'
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Phone Number'
                        name='phone'
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      mt: 3,
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                    }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveProfile}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1, sm: 1.2 },
                      }}>
                      Save Changes
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
                }}>
                Display Settings
              </Typography>

              {/* Theme Toggle */}
              <Box
                sx={{
                  mb: 3,
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
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {mode === 'dark' ? (
                        <>
                          <DarkModeIcon color='primary' />
                          <Typography>Dark Mode</Typography>
                        </>
                      ) : (
                        <>
                          <LightModeIcon color='primary' />
                          <Typography>Light Mode</Typography>
                        </>
                      )}
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 4 }}>
                <Typography
                  id='font-size-slider'
                  gutterBottom
                  sx={{
                    textAlign: { xs: 'center', sm: 'left' },
                  }}>
                  Font Size: {userData.fontSize}px
                </Typography>
                <Slider
                  value={userData.fontSize}
                  onChange={handleFontSizeChange}
                  aria-labelledby='font-size-slider'
                  valueLabelDisplay='auto'
                  step={1}
                  marks
                  min={12}
                  max={24}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.highContrast}
                    onChange={handleSwitchChange}
                    name='highContrast'
                    color='primary'
                  />
                }
                label='High Contrast Mode'
              />
              <Divider sx={{ my: 3 }} />
              <AccessibilityControls />
            </Box>
          )}

          {/* Family Connections Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant='h6' gutterBottom>
                Family Members & Caregivers
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Manage your connected family members and caregivers who can
                access your memories and help you.
              </Typography>
              <EmergencyContact />
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant='h6' gutterBottom>
                Notification Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.notifications}
                    onChange={handleSwitchChange}
                    name='notifications'
                    color='primary'
                  />
                }
                label='Enable Notifications'
              />
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth disabled={!userData.notifications}>
                  <InputLabel id='reminder-frequency-label'>
                    Reminder Frequency
                  </InputLabel>
                  <Select
                    labelId='reminder-frequency-label'
                    id='reminder-frequency'
                    value={userData.reminderFrequency}
                    label='Reminder Frequency'
                    name='reminderFrequency'
                    onChange={handleInputChange}>
                    <MenuItem value='daily'>Daily</MenuItem>
                    <MenuItem value='weekly'>Weekly</MenuItem>
                    <MenuItem value='monthly'>Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  Notifications help you remember to add new memories and stay
                  connected with your family members.
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper elevation={2} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon color='primary' sx={{ mr: 2 }} />
            <Typography variant='h6'>Account Security</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button variant='outlined' fullWidth>
                Change Password
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant='outlined' color='error' fullWidth>
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
