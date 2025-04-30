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
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <div>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4' component='h1'>
            Settings
          </Typography>
        </Box>

        {notification.open && (
          <Alert severity={notification.severity} sx={{ mb: 3 }}>
            {notification.message}
          </Alert>
        )}

        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<PersonIcon />} label='Profile' iconPosition='start' />
            <Tab
              icon={<AccessibilityNewIcon />}
              label='Accessibility'
              iconPosition='start'
            />
            <Tab
              icon={<PeopleIcon />}
              label='Family Connections'
              iconPosition='start'
            />
            <Tab
              icon={<NotificationsIcon />}
              label='Notifications'
              iconPosition='start'
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    alt={userData.name}
                    src='/placeholder-avatar.jpg'>
                    {userData.name.charAt(0)}
                  </Avatar>
                  <Button variant='outlined' color='primary'>
                    Change Photo
                  </Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant='h6' gutterBottom>
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
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Accessibility Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Display Settings
              </Typography>

              {/* Theme Toggle */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
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
                <Typography id='font-size-slider' gutterBottom>
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
            <Box sx={{ p: 3 }}>
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
            <Box sx={{ p: 3 }}>
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
