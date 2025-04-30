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
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  LocationTracker,
  EmergencyContact,
  BreathingExercise,
} from '../components';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [locationShared, setLocationShared] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShareLocation = () => {
    // In a real app, this would share the location with emergency contacts
    setLocationShared(true);
    setTimeout(() => {
      setLocationShared(false);
    }, 5000);
  };

  const handleEmergencyAlert = () => {
    // In a real app, this would send an alert to emergency contacts
    setEmergencyAlertSent(true);
    setTimeout(() => {
      setEmergencyAlertSent(false);
    }, 5000);
  };

  const handleBreathingGame = () => {
    navigate('/breathing-game');
  };

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
            Help Center
          </Typography>
        </Box>

        {/* Quick Action Buttons */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(90deg, #f8bbd0 0%, #e91e63 100%)`,
            color: 'white',
          }}>
          <Typography variant='h5' gutterBottom>
            Need Immediate Help?
          </Typography>
          <Typography variant='body1' paragraph>
            Use these quick actions to get help right away or to calm yourself
            during a moment of anxiety.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='secondary'
                startIcon={<ShareIcon />}
                onClick={handleShareLocation}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Share My Location
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='error'
                startIcon={<NotificationsActiveIcon />}
                onClick={handleEmergencyAlert}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Alert Emergency Contacts
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='info'
                startIcon={<SpaIcon />}
                onClick={handleBreathingGame}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Breathing Exercise
              </Button>
            </Grid>
          </Grid>

          {locationShared && (
            <Alert severity='success' sx={{ mt: 2 }}>
              Your location has been shared with your emergency contacts.
            </Alert>
          )}

          {emergencyAlertSent && (
            <Alert severity='info' sx={{ mt: 2 }}>
              Emergency alert has been sent to your contacts. They will contact
              you shortly.
            </Alert>
          )}
        </Paper>

        {/* Tabs for different help features */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab
              icon={<LocationOnIcon />}
              label='Location Sharing'
              iconPosition='start'
            />
            <Tab
              icon={<PeopleIcon />}
              label='Emergency Contacts'
              iconPosition='start'
            />
            <Tab
              icon={<SpaIcon />}
              label='Breathing Exercise'
              iconPosition='start'
            />
          </Tabs>

          {/* Location Sharing Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Share Your Location
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Your location can be shared with your emergency contacts to help
                them find you in case of an emergency.
              </Typography>
              <LocationTracker />
            </Box>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Emergency Contacts
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Add and manage your emergency contacts who will be notified when
                you need help.
              </Typography>
              <EmergencyContact />
            </Box>
          )}

          {/* Breathing Exercise Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Breathing Exercise
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Follow this guided breathing exercise to help calm yourself
                during moments of anxiety.
              </Typography>
              <BreathingExercise />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant='outlined'
                  color='primary'
                  startIcon={<SpaIcon />}
                  onClick={handleBreathingGame}>
                  Open Full Breathing Game
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default HelpCenter;
