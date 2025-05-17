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
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
} from '@mui/material';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isPast from 'date-fns/isPast';
import isFuture from 'date-fns/isFuture';
import addDays from 'date-fns/addDays';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';

const FullVersionTaskCard = ({ isWidget = false }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

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

  // Filter tasks based on search term
  const filterTasksBySearchTerm = (tasksList) => {
    if (!searchTerm) return tasksList;

    return tasksList.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Filter tasks by period
  const filterTasksByPeriod = (tasksList) => {
    const today = new Date();

    switch (filterPeriod) {
      case 'today':
        return tasksList.filter((task) => {
          const dueDate = new Date(task.due_date);
          return isToday(dueDate);
        });
      case 'week':
        // Get current week (Monday to Sunday)
        const mondayOfWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
        const sundayOfWeek = endOfWeek(today, { weekStartsOn: 1 });

        return tasksList.filter((task) => {
          const dueDate = new Date(task.due_date);
          return isWithinInterval(dueDate, {
            start: mondayOfWeek,
            end: sundayOfWeek,
          });
        });
      case 'month':
        // Current month (1st to last day)
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return tasksList.filter((task) => {
          const dueDate = new Date(task.due_date);
          return isWithinInterval(dueDate, {
            start: monthStart,
            end: monthEnd,
          });
        });
      default: // 'all'
        return tasksList;
    }
  };

  // Apply both filters
  const filteredTasks = filterTasksBySearchTerm(filterTasksByPeriod(tasks));

  // Filter tasks for today
  const todayTasks = filteredTasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return isToday(dueDate);
  });

  // Filter upcoming tasks (future dates)
  const upcomingTasks = filteredTasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return isFuture(dueDate) && !isToday(dueDate);
  });

  // Determine which tasks to display based on filter and widget status
  const displayTodayTasks = todayTasks.slice(0, isWidget ? 2 : 6); // Show at most 2 from today for widget
  const displayUpcomingTasks = upcomingTasks.slice(0, isWidget ? 2 : 8); // Show up to 2 upcoming tasks for widget, more for full view

  // Determine if we should show both columns or just one based on filter
  const showTodayColumn = filterPeriod === 'all' || filterPeriod === 'today';
  const showUpcomingColumn =
    filterPeriod === 'all' ||
    filterPeriod === 'week' ||
    filterPeriod === 'month';

  // Format date for display
  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d, yyyy');
  };

  // Function to handle task click to edit
  const handleTaskClick = (task) => {
    // Dispatch event to open edit dialog with task data
    document.dispatchEvent(
      new CustomEvent('openEditTaskDialog', { detail: task })
    );
  };

  // Function to handle marking task as complete
  const handleMarkComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };

      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error.message);
      setError('Failed to update task');
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error.message);
      setError('Failed to delete task');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter period change
  const handleFilterChange = (event, newFilterPeriod) => {
    if (newFilterPeriod !== null) {
      setFilterPeriod(newFilterPeriod);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'transparent',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}>
        <Typography
          variant='h6'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' },
            width: { xs: '100%', sm: 'auto' },
          }}>
          <EventIcon
            sx={{
              mr: 1,
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
            }}
          />
          Tasks
        </Typography>

        {/* Filter Toggle Buttons - Improved styling */}
        <ToggleButtonGroup
          value={filterPeriod}
          exclusive
          onChange={handleFilterChange}
          aria-label='task filter period'
          size='small'
          sx={{
            flexWrap: 'wrap',
            '& .MuiToggleButtonGroup-grouped': {
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              px: { xs: 1.5, sm: 2 },
              py: 0.75,
              mx: 0.5, // Add horizontal spacing between buttons
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
              },
            },
          }}>
          <ToggleButton value='all' aria-label='all tasks'>
            All
          </ToggleButton>
          <ToggleButton value='today' aria-label="today's tasks">
            Today
          </ToggleButton>
          <ToggleButton value='week' aria-label="this week's tasks">
            Week
          </ToggleButton>
          <ToggleButton value='month' aria-label="this month's tasks">
            Month
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder='Search tasks by name or description...'
        variant='outlined'
        size='small'
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          mb: 3,
          width: '100%',
          '.MuiOutlinedInput-root': {
            borderRadius: 1.5,
            bgcolor: isDarkMode
              ? alpha(theme.palette.background.paper, 0.3)
              : alpha(theme.palette.background.paper, 0.7),
            fontSize: { xs: '0.85rem', sm: '1rem' },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon color='action' />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography color='error' sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: 'auto', width: '100%' }}>
          {/* Today's Tasks - Only show if filter is 'all' or 'today' */}
          {showTodayColumn && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  }}>
                  Today's Tasks
                </Typography>
                <Chip
                  label={todayTasks.length}
                  size='small'
                  color='primary'
                  sx={{ height: 20 }}
                />
              </Box>

              {displayTodayTasks.length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: { xs: 1.5, sm: 2 },
                    mb: 3,
                    width: '100%',
                  }}>
                  {displayTodayTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: task.completed
                            ? isDarkMode
                              ? alpha(theme.palette.success.main, 0.08)
                              : alpha(theme.palette.success.light, 0.08)
                            : isDarkMode
                            ? alpha(theme.palette.background.paper, 0.3)
                            : alpha(theme.palette.background.paper, 0.9),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: theme.shadows[3],
                          },
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                        onClick={() => handleTaskClick(task)}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}>
                          <Box sx={{ mr: 1.5 }}>
                            {task.completed ? (
                              <CheckCircleIcon
                                color='success'
                                fontSize='small'
                              />
                            ) : (
                              <EventIcon color='warning' fontSize='small' />
                            )}
                          </Box>
                          <Box
                            sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                            <Typography
                              variant='body1'
                              fontWeight={task.completed ? 400 : 600}
                              sx={{
                                textDecoration: task.completed
                                  ? 'line-through'
                                  : 'none',
                                color: task.completed
                                  ? theme.palette.text.secondary
                                  : theme.palette.text.primary,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                              {task.title}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                              {formatTaskDate(task.due_date)}
                            </Typography>
                          </Box>
                        </Box>
                        {task.description && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mt: 'auto',
                              pt: 1,
                              fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            }}>
                            {task.description}
                          </Typography>
                        )}
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Typography
                  color='text.secondary'
                  sx={{ mb: 3, pl: 2 }}
                  variant={isWidget ? 'body2' : 'body1'}>
                  No tasks scheduled for today
                </Typography>
              )}
            </>
          )}

          {/* Upcoming Tasks - Show for 'all', 'week', and 'month' filters */}
          {showUpcomingColumn && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  mt: showTodayColumn ? 4 : 0,
                }}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  }}>
                  {filterPeriod === 'week'
                    ? "This Week's Tasks"
                    : filterPeriod === 'month'
                    ? "This Month's Tasks"
                    : 'Upcoming Tasks'}
                </Typography>
                <Chip
                  label={upcomingTasks.length}
                  size='medium'
                  color='info'
                  sx={{ height: 20 }}
                />
              </Box>

              {displayUpcomingTasks.length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: { xs: 1.5, sm: 2 },
                    width: '100%',
                  }}>
                  {displayUpcomingTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: isDarkMode
                            ? alpha(theme.palette.background.paper, 0.3)
                            : alpha(theme.palette.background.paper, 0.9),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: theme.shadows[3],
                          },
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                        onClick={() => handleTaskClick(task)}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}>
                          <EventIcon
                            sx={{ mr: 1.5 }}
                            color='info'
                            fontSize='small'
                          />
                          <Box
                            sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                            <Typography
                              variant='body1'
                              fontWeight={600}
                              sx={{
                                color: theme.palette.text.primary,
                              }}>
                              {task.title}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                              {formatTaskDate(task.due_date)}
                            </Typography>
                          </Box>
                        </Box>
                        {task.description && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mt: 'auto',
                              pt: 1,
                              fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            }}>
                            {task.description}
                          </Typography>
                        )}
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Typography
                  color='text.secondary'
                  sx={{ pl: 2 }}
                  variant='body1'>
                  No upcoming tasks scheduled
                </Typography>
              )}
            </>
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
              py: { xs: 0.75, sm: 1 },
              mb: 2,
              fontWeight: 500,
              fontSize: { xs: '0.85rem', sm: '1rem' },
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

export default FullVersionTaskCard;
