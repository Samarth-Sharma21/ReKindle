import { useState, useEffect } from 'react';
import { supabase } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isPast from 'date-fns/isPast';
import isFuture from 'date-fns/isFuture';

const UpcomingTasksCard = ({ isWidget = false }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks from database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Get the current user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setLoading(false);
          return;
        }

        // Fetch tasks from the database
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });

        if (error) throw error;

        if (data) {
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks for today
  const todayTasks = tasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return isToday(dueDate);
  });

  // Filter upcoming tasks (future dates)
  const upcomingTasks = tasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return isFuture(dueDate) && !isToday(dueDate);
  });

  // Determine which tasks to display (max 2 total for widget, more for full view)
  const displayTodayTasks = todayTasks.slice(0, isWidget ? 2 : 3); // Show at most 2 from today for widget
  const displayUpcomingTasks = upcomingTasks.slice(0, isWidget ? 2 : 5); // Show up to 2 upcoming tasks even for widget, more for full view

  // Format date for display
  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d, yyyy');
  };

  // Function to handle task click and navigate to calendar with task ID
  const handleTaskClick = (taskId) => {
    navigate(`/calendar?taskId=${taskId}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}>
        <Typography
          variant='h6'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
          }}>
          <EventIcon
            sx={{
              mr: 1,
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
            }}
          />
          Tasks
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography color='error' sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 2 }}>
          {/* Today's Tasks */}
          <Typography
            variant='subtitle1'
            fontWeight={600}
            sx={{
              mt: 1,
              mb: 1,
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            }}>
            Today
          </Typography>
          {displayTodayTasks.length > 0 ? (
            <List sx={{ mb: 2 }} dense={isWidget}>
              {displayTodayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <ListItem
                    sx={{
                      mb: 1,
                      bgcolor: task.completed
                        ? alpha(theme.palette.success.light, 0.1)
                        : alpha(theme.palette.warning.light, 0.1),
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: task.completed
                        ? theme.palette.success.light
                        : theme.palette.warning.light,
                      cursor: 'pointer',
                      transition:
                        'transform 0.2s ease, background-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: task.completed
                          ? alpha(theme.palette.success.light, 0.15)
                          : alpha(theme.palette.warning.light, 0.15),
                      },
                    }}
                    onClick={() => handleTaskClick(task.id)}>
                    <ListItemIcon>
                      {task.completed ? (
                        <CheckCircleIcon
                          color='success'
                          fontSize={isWidget ? 'small' : 'medium'}
                        />
                      ) : (
                        <EventIcon
                          color='warning'
                          fontSize={isWidget ? 'small' : 'medium'}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      primaryTypographyProps={{
                        fontWeight: task.completed ? 400 : 600,
                        style: {
                          textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                        },
                        variant: isWidget ? 'body2' : 'body1',
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Typography
              color='text.secondary'
              sx={{ mb: 2, pl: 2 }}
              variant={isWidget ? 'body2' : 'body1'}>
              No tasks scheduled for today
            </Typography>
          )}

          {/* Upcoming Tasks */}
          <Typography
            variant='subtitle1'
            fontWeight={600}
            sx={{ mt: 2, mb: 1 }}>
            Future
          </Typography>
          {displayUpcomingTasks.length > 0 ? (
            <List dense={isWidget}>
              {displayUpcomingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <ListItem
                    sx={{
                      mb: 1,
                      bgcolor: alpha(theme.palette.info.light, 0.1),
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      cursor: 'pointer',
                      transition:
                        'transform 0.2s ease, background-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: alpha(theme.palette.info.light, 0.15),
                      },
                    }}
                    onClick={() => handleTaskClick(task.id)}>
                    <ListItemIcon>
                      <EventIcon
                        color='info'
                        fontSize={isWidget ? 'small' : 'medium'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      primaryTypographyProps={{
                        variant: isWidget ? 'body2' : 'body1',
                      }}
                      secondary={
                        <>
                          {!isWidget && task.description && (
                            <Typography
                              variant='body2'
                              component='span'
                              display='block'>
                              {task.description}
                            </Typography>
                          )}
                          <Chip
                            label={formatTaskDate(task.due_date)}
                            size='small'
                            color='primary'
                            variant='outlined'
                            sx={{ mt: 0.5, fontSize: '0.7rem' }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Typography
              color='text.secondary'
              sx={{ mb: 2, pl: 2 }}
              variant={isWidget ? 'body2' : 'body1'}>
              No upcoming tasks scheduled
            </Typography>
          )}
        </Box>
      )}

      {tasks.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography
            variant={isWidget ? 'body2' : 'body1'}
            color='text.secondary'>
            No tasks scheduled
          </Typography>
          <Button
            component={Link}
            to='/calendar'
            variant='contained'
            color='primary'
            size={isWidget ? 'small' : 'medium'}
            sx={{ mt: 2 }}>
            Add Task
          </Button>
        </Box>
      )}

      {tasks.length > 0 && !loading && !error && (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
          <Button
            component={Link}
            to='/calendar'
            variant='outlined'
            color='primary'
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 1,
              py: 1,
              fontWeight: 500,
              '&:hover': {
                color: 'primary.main',
                borderColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}>
            View All Tasks
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default UpcomingTasksCard;
