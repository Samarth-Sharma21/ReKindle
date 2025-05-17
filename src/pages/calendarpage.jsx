import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  useResponsive,
  commonResponsiveStyles,
} from '../styles/responsiveStyles';
import {
  useCalendarResponsive,
  responsiveGridLayouts,
  safeContainerStyles,
} from '../styles/globalResponsive';
import { CalendarAndTasks, UpcomingTasksCard } from '../components';
import { alpha } from '@mui/material/styles'; // Adjust the path as needed
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FullVersionTaskCard from '../components/FullVersionTaskCard';

const CalendarPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  // All responsive variables are destructured here for potential future use
  // Currently only isMobile is actively used in this component
  // The other variables (isTablet, isLaptop, isDesktop) are available for
  // implementing more granular responsive designs if needed in the future
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } =
    useResponsive();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management - using 'all' as the default task frequency
  const taskFrequency = 'all';

  const handleAddTask = () => {
    // Trigger the add task dialog in CalendarAndTasks
    document.dispatchEvent(new CustomEvent('openAddTaskDialog'));
  };

  const { calendarContainer, calendarWrapper } = useCalendarResponsive();

  return (
    <Box sx={safeContainerStyles}>
      <Container
        maxWidth='lg'
        disableGutters={false}
        sx={{
          mt: { xs: 2, sm: 3 },
          mb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 2, md: 3 },
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}>
        {/* Simple Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 3 },
          }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            aria-label='go back'>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            }}>
            Calendar
          </Typography>
        </Box>

        {/* Main Content - Calendar and Tasks Layout */}
        <Grid
          container
          spacing={isMobile ? 2 : 3}
          sx={{ width: '100%', mx: 0 }}>
          {/* Calendar Section - Full Width */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 2, md: 3 },
                  borderRadius: 2,
                  height: '100%',
                  minHeight: { xs: '350px', sm: '400px', md: '500px' },
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  width: '100%',
                  position: 'relative',
                  ...calendarContainer,
                }}>
                <Box sx={calendarWrapper}>
                  <CalendarAndTasks
                    activeTab={0} // Force calendar view
                    taskFrequency={taskFrequency}
                  />
                </Box>

                {/* Add Task Button - Integrated into the calendar header instead of floating */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1,
                    mb: 2,
                    position: 'relative',
                    zIndex: 5,
                  }}>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      },
                    }}>
                    Add Task
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Task Card - Full Width */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 2, md: 3 },
                  borderRadius: 2,
                  height: '100%',
                  minHeight: { xs: '350px', sm: '400px', md: '500px' },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  width: '100%',
                  position: 'relative',
                  ...calendarContainer,
                }}>
                {/* Task List */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    width: '100%',
                    px: { xs: 0.5, sm: 1 },
                  }}>
                  <FullVersionTaskCard />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CalendarPage;
