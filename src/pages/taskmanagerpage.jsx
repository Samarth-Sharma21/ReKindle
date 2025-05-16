import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { CalendarAndTasks } from '../components';
import { motion } from 'framer-motion';

const TaskManagerPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth='lg'
      disableGutters={isMobile}
      sx={{
        mt: { xs: 1.5, sm: 3 },
        mb: { xs: 3, sm: 6 },
        px: { xs: 1.5, sm: 3, md: 4 },
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{
            mb: 2.5,
            fontWeight: 600,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          }}>
          Task Manager
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 1.5, sm: 2.5, md: 3 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            mb: { xs: 3, sm: 4 },
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Manage your tasks and schedule in one place
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            paragraph
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Use the calendar to view your schedule and the task list to keep
            track of your to-dos. You can add, edit, and delete tasks as needed.
          </Typography>
        </Paper>

        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: isDarkMode
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.01)',
            p: { xs: 0.25, sm: 0.5 },
            mb: { xs: 3, sm: 4 },
          }}>
          <CalendarAndTasks />
        </Box>
      </motion.div>
    </Container>
  );
};

export default TaskManagerPage;
