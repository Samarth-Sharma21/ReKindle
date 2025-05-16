import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CalendarAndTasks,
  SavedLocationsCard,
  NotificationsCard,
  FamilyManagementCard,
} from './';

const DashboardBentoGrid = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Define the layout for the bento grid
  const gridItems = [
    {
      id: 'calendar',
      title: 'Calendar & Tasks',
      component: <CalendarAndTasks />,
      gridSize: { xs: 12, sm: 12, md: 8 },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      component: <NotificationsCard />,
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      id: 'locations',
      title: 'Saved Locations',
      component: <SavedLocationsCard />,
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      id: 'family',
      title: 'Family Management',
      component: <FamilyManagementCard />,
      gridSize: { xs: 12, sm: 12, md: 8 },
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: { xs: 2, sm: 3 } }}>
      <Typography
        variant='h5'
        component='h2'
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
        }}>
        Quick Access
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {gridItems.map((item, index) => (
          <Grid
            item
            key={item.id}
            xs={item.gridSize.xs}
            sm={item.gridSize.sm}
            md={item.gridSize.md}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ height: '100%' }}>
              <Paper
                elevation={2}
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  p: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: isDarkMode
                      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.15)',
                  },
                  width: '100%',
                }}>
                {item.component}
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardBentoGrid;
