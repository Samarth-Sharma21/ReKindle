import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
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

// Define breakpoints explicitly to match landing page
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1200,
};

const CalendarPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(`(max-width:${breakpoints.sm}px)`);
  const isTablet = useMediaQuery(`(max-width:${breakpoints.md}px)`);
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management - using 'all' as the default task frequency
  const taskFrequency = 'all';

  const handleAddTask = () => {
    // Trigger the add task dialog in CalendarAndTasks
    document.dispatchEvent(new CustomEvent('openAddTaskDialog'));
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}>
      <Container
        maxWidth='lg'
        disableGutters={isMobile}
        sx={{
          mt: { xs: 2, sm: 3 },
          mb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box',
          width: '100%',
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
        <Grid container spacing={3}>
          {/* Calendar Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  height: '100%',
                  minHeight: '500px',
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}>
                  <Typography variant='h6' sx={{ fontWeight: 500 }}>
                    Calendar
                  </Typography>
                </Box>
                <CalendarAndTasks
                  activeTab={0} // Force calendar view
                  taskFrequency={taskFrequency}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* Task Card - Wider with Search */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  height: '100%',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}>
                 
                {/* Task List - Grid Layout */}
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(500px, 1fr))',
                      gap: 2,
                    }}>
                    <FullVersionTaskCard />
                  </Grid>
                </Box>
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
