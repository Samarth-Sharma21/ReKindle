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
  useTheme,
} from '@mui/material';
import { useResponsive, commonResponsiveStyles } from '../styles/responsiveStyles';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  SavedLocationsCard,
  EmergencyContact,
  BreathingExercise,
} from '../components';

const HelpCenter = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
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
    <Container
      maxWidth='md'
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 3, sm: 4, md: 5 },
        px: { xs: 1.5, sm: 3, md: 3 },
      }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%' }}>
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
            Help Center
          </Typography>
        </Box>

        {/* Quick Action Buttons */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'background.card'
                : 'background.subtle',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary',
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
            boxShadow: (theme) =>
              `0 4px 12px ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 168, 77, 0.2)'
                  : 'rgba(255, 138, 0, 0.15)'
              }`,
          }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 600,
              textAlign: { xs: 'center', sm: 'left' },
            }}>
            Need Immediate Help?
          </Typography>
          <Typography
            variant='body1'
            paragraph
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 2 },
            }}>
            Use these quick actions to get help right away or to calm yourself
            during a moment of anxiety.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant='contained'
                fullWidth
                size={isMobile ? 'medium' : 'large'}
                color='secondary'
                startIcon={<ShareIcon />}
                onClick={handleShareLocation}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: 2,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}>
                Share My Location
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant='contained'
                fullWidth
                size={isMobile ? 'medium' : 'large'}
                color='primary'
                startIcon={<NotificationsActiveIcon />}
                onClick={handleEmergencyAlert}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: 2,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}>
                Alert Emergency Contacts
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                mx: { xs: 'auto', sm: 0 },
                width: { xs: '100%', sm: 'auto' },
                mt: { xs: 1, sm: 0 },
              }}>
              <Button
                variant='contained'
                fullWidth
                size={isMobile ? 'medium' : 'large'}
                color='secondary'
                startIcon={<SpaIcon />}
                onClick={handleBreathingGame}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: 2,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}>
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
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
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
              '& .MuiTab-root': {
                minHeight: { xs: '48px', sm: '64px' },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                minWidth: { xs: 'auto', sm: '160px' },
                px: { xs: 1, sm: 2 },
              },
            }}>
            <Tab
              icon={<LocationOnIcon />}
              label={isMobile ? '' : 'Location Sharing'}
              iconPosition='start'
              aria-label='Location Sharing'
            />
            <Tab
              icon={<PeopleIcon />}
              label={isMobile ? '' : 'Emergency Contacts'}
              iconPosition='start'
              aria-label='Emergency Contacts'
            />
            <Tab
              icon={<SpaIcon />}
              label={isMobile ? '' : 'Breathing Exercise'}
              iconPosition='start'
              aria-label='Breathing Exercise'
            />
          </Tabs>

          {/* Location Sharing Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 1.5, sm: 2 },
                }}>
                Share Your Location
              </Typography>
              <Typography
                variant='body2'
                paragraph
                color='text.secondary'
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  mb: { xs: 2, sm: 2.5 },
                }}>
                Your location can be shared with your emergency contacts to help
                them find you in case of an emergency.
              </Typography>
              <SavedLocationsCard />
            </Box>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 1.5, sm: 2 },
                }}>
                Emergency Contacts
              </Typography>
              <Typography
                variant='body2'
                paragraph
                color='text.secondary'
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  mb: { xs: 2, sm: 2.5 },
                }}>
                Add and manage your emergency contacts who will be notified when
                you need help.
              </Typography>
              <EmergencyContact />
            </Box>
          )}

          {/* Breathing Exercise Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 1.5, sm: 2 },
                }}>
                Breathing Exercise
              </Typography>
              <Typography
                variant='body2'
                paragraph
                color='text.secondary'
                sx={{
                  mb: { xs: 2, sm: 3 },
                  textAlign: { xs: 'center', sm: 'left' },
                }}>
                Follow this guided breathing exercise to help calm yourself
                during moments of anxiety.
              </Typography>
              <BreathingExercise />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant='outlined'
                  color='primary'
                  size={isMobile ? 'medium' : 'large'}
                  startIcon={<SpaIcon />}
                  onClick={handleBreathingGame}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}>
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
