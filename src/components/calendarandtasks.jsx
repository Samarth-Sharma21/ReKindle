import { useState, useEffect } from 'react';
import { supabase, taskService } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  DateCalendar,
  DatePicker,
} from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isPast from 'date-fns/isPast';
import isFuture from 'date-fns/isFuture';
import FullVersionTaskCard from './FullVersionTaskCard';

const CalendarAndTasks = ({
  activeTab,
  searchQuery = '',
  showCalendar = true, // Control whether to show the calendar
}) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for calendar and tasks
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState(activeTab || 0);

  // For calendar date highlighting
  const [dateTaskMap, setDateTaskMap] = useState({});

  // State for task form
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    completed: false,
    added_by: user?.name || 'User',
    frequency: 'once',
  });

  // Listen for edit task event from FullVersionTaskCard
  useEffect(() => {
    const handleEditTask = (event) => {
      const task = event.detail;
      setEditingTaskId(task.id);
      setNewTask({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date,
        priority: task.priority,
        completed: task.completed,
        added_by: task.added_by,
        frequency: task.frequency || 'once',
      });
      setOpenTaskDialog(true);
    };

    document.addEventListener('openEditTaskDialog', handleEditTask);
    document.addEventListener('openAddTaskDialog', () =>
      setOpenTaskDialog(true)
    );

    return () => {
      document.removeEventListener('openEditTaskDialog', handleEditTask);
      document.removeEventListener('openAddTaskDialog', () =>
        setOpenTaskDialog(true)
      );
    };
  }, []);

  // UI states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
          // Fallback to local state if not authenticated
          setLoading(false);
          return;
        }

        const { data, error } = await taskService.getTasks(user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setTasks(data);
          filterTasksByDate(data, selectedDate);
          createDateTaskMap(data);
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

  // Create a map of dates to task priorities for calendar highlighting
  const createDateTaskMap = (allTasks) => {
    const taskMap = {};

    allTasks.forEach((task) => {
      const dueDate = task.due_date;

      // Add one-time tasks
      if (task.frequency === 'once') {
        if (!taskMap[dueDate]) {
          taskMap[dueDate] = { priorities: [], count: 0 };
        }
        taskMap[dueDate].priorities.push(task.priority);
        taskMap[dueDate].count++;
      }

      // Generate recurring tasks dates
      if (task.frequency === 'daily') {
        // Add daily tasks for next 30 days
        const startDate = new Date(dueDate);
        for (let i = 0; i < 30; i++) {
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + i);
          const dateStr = format(nextDate, 'yyyy-MM-dd');

          if (!taskMap[dateStr]) {
            taskMap[dateStr] = { priorities: [], count: 0 };
          }
          taskMap[dateStr].priorities.push(task.priority);
          taskMap[dateStr].count++;
        }
      }

      // Weekly tasks - add for next 4 weeks
      if (task.frequency === 'weekly') {
        const startDate = new Date(dueDate);
        const dayOfWeek = startDate.getDay();

        for (let i = 0; i < 4; i++) {
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + i * 7);
          const dateStr = format(nextDate, 'yyyy-MM-dd');

          if (!taskMap[dateStr]) {
            taskMap[dateStr] = { priorities: [], count: 0 };
          }
          taskMap[dateStr].priorities.push(task.priority);
          taskMap[dateStr].count++;
        }
      }

      // Monthly tasks - add for next 3 months
      if (task.frequency === 'monthly') {
        const startDate = new Date(dueDate);
        const dayOfMonth = startDate.getDate();

        for (let i = 0; i < 3; i++) {
          const nextDate = new Date(startDate);
          nextDate.setMonth(startDate.getMonth() + i);
          const dateStr = format(nextDate, 'yyyy-MM-dd');

          if (!taskMap[dateStr]) {
            taskMap[dateStr] = { priorities: [], count: 0 };
          }
          taskMap[dateStr].priorities.push(task.priority);
          taskMap[dateStr].count++;
        }
      }
    });

    setDateTaskMap(taskMap);
  };

  // Filter tasks when selected date changes or search query changes
  useEffect(() => {
    filterTasksByDate(tasks, selectedDate);
  }, [selectedDate, tasks, searchQuery]);

  // Update current view when activeTab changes
  useEffect(() => {
    if (activeTab !== undefined) {
      setCurrentView(activeTab);
    }
  }, [activeTab]);

  const filterTasksByDate = (allTasks, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    // Get the day of week for weekly tasks
    const dayOfWeek = date.getDay();

    // Get day of month for monthly tasks
    const dayOfMonth = date.getDate();

    // Filter tasks based on frequency and date
    let filtered = allTasks.filter((task) => {
      // For exact date match (one-time tasks)
      if (task.frequency === 'once' && task.due_date === formattedDate) {
        return true;
      }

      // For daily tasks, always show
      if (task.frequency === 'daily') {
        const taskStartDate = new Date(task.due_date);
        const selectedDateTime = date.getTime();

        // Only show daily tasks if the selected date is on or after the task start date
        return selectedDateTime >= taskStartDate.getTime();
      }

      // For weekly tasks, check day of week matches
      if (task.frequency === 'weekly') {
        const taskStartDate = new Date(task.due_date);
        const taskDayOfWeek = taskStartDate.getDay();
        const selectedDateTime = date.getTime();

        // Show if day of week matches and selected date is on or after task start date
        return (
          dayOfWeek === taskDayOfWeek &&
          selectedDateTime >= taskStartDate.getTime()
        );
      }

      // For monthly tasks, check day of month matches
      if (task.frequency === 'monthly') {
        const taskStartDate = new Date(task.due_date);
        const taskDayOfMonth = taskStartDate.getDate();
        const selectedDateTime = date.getTime();

        // Show if day of month matches and selected date is on or after task start date
        return (
          dayOfMonth === taskDayOfMonth &&
          selectedDateTime >= taskStartDate.getTime()
        );
      }

      return false;
    });

    // Apply search query filter if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOpenTaskDialog = (taskId = null) => {
    if (taskId) {
      // Edit existing task
      const taskToEdit = tasks.find((task) => task.id === taskId);
      if (taskToEdit) {
        setNewTask(taskToEdit);
        setEditingTaskId(taskId);
      }
    } else {
      // Add new task
      setNewTask({
        title: '',
        description: '',
        due_date: format(selectedDate, 'yyyy-MM-dd'),
        priority: 'medium',
        completed: false,
        added_by: user?.name || 'User',
        frequency: 'once',
      });
      setEditingTaskId(null);
    }
    setOpenTaskDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewTask({ ...newTask, [name]: checked });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSaveTask = async () => {
    // Validate inputs
    if (!newTask.title) {
      showNotification('Task title is required', 'error');
      return;
    }

    try {
      // Get the current user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      if (editingTaskId) {
        // Update existing task
        const { data, error } = await taskService.updateTask(
          newTask,
          editingTaskId
        );

        if (error) throw error;

        // Update in local state
        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId ? { ...task, ...newTask } : task
          )
        );

        showNotification('Task updated successfully');
      } else {
        // Add new task
        const { data, error } = await taskService.saveTask(newTask, user.id);

        if (error) throw error;

        // Add to local state
        const newTaskWithId = data?.[0] || {
          ...newTask,
          id: Date.now().toString(),
        };
        setTasks([...tasks, newTaskWithId]);

        showNotification('Task added successfully');
      }

      handleCloseTaskDialog();
    } catch (error) {
      console.error('Error saving task:', error.message);
      showNotification('Failed to save task', 'error');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };

      // Update in database
      const { error } = await taskService.updateTask(updatedTask, taskId);

      if (error) throw error;

      // Update in local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      showNotification(
        `Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}`
      );
    } catch (error) {
      console.error('Error updating task:', error.message);
      showNotification('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Delete from database
      const { error } = await taskService.deleteTask(taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.filter((task) => task.id !== taskId));
      showNotification('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error.message);
      showNotification('Failed to delete task', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Function to render date cell with task indicators
  const renderDay = (date, _selectedDate, dayInCurrentMonth) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const tasksForDate = dateTaskMap[formattedDate];

    return (
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0.5,
        }}>
        {tasksForDate && tasksForDate.count > 0 && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: () => {
                // Determine border color based on highest priority
                if (tasksForDate.priorities.includes('high'))
                  return theme.palette.error.main;
                if (tasksForDate.priorities.includes('medium'))
                  return theme.palette.warning.main;
                if (tasksForDate.priorities.includes('low'))
                  return theme.palette.success.main;
                return theme.palette.primary.main;
              },
              opacity: 0.7,
            }}
          />
        )}
        <Typography
          variant='body2'
          sx={{
            zIndex: 1,
            fontWeight:
              tasksForDate && tasksForDate.count > 0 ? 'bold' : 'normal',
          }}>
          {date.getDate()}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        position: 'relative',
      }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          bgcolor: 'background.paper',
          height: '100%',
        }}>
        <Typography variant='h6' gutterBottom>
          Calendar & Tasks
        </Typography>

        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {/* Calendar Section - conditionally rendered */}
          {showCalendar && (
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    '& .MuiDateCalendar-root': {
                      width: { xs: '100%', sm: 'auto' },
                      maxWidth: '100%',
                      '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer':
                        {
                          justifyContent: 'space-around',
                        },
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: { xs: 0, sm: 1 },
                        paddingRight: { xs: 0, sm: 1 },
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      },
                      '& .MuiPickersDay-root': {
                        margin: { xs: '1px', sm: '2px' },
                        width: { xs: '32px', sm: '36px' },
                        height: { xs: '32px', sm: '36px' },
                      },
                    },
                  }}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderDay={renderDay}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Grid>
          )}

          {/* Tasks Section */}
          <Grid item xs={12} md={showCalendar ? 6 : 12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}>
              <Typography variant='subtitle1'>
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleOpenTaskDialog()}
                size='small'>
                Add Task
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredTasks.length > 0 ? (
              <List
                sx={{
                  maxHeight: showCalendar ? '350px' : '500px',
                  overflowY: 'auto',
                  pr: 1,
                }}>
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <ListItem
                      sx={{
                        mb: 1,
                        bgcolor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          bgcolor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)',
                        },
                        pr: 9, // Add more padding on the right for buttons
                      }}>
                      <ListItemIcon>
                        <IconButton
                          edge='start'
                          onClick={() => handleToggleComplete(task.id)}
                          color={task.completed ? 'success' : 'default'}>
                          {task.completed ? (
                            <CheckCircleIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant='body1'
                            sx={{
                              textDecoration: task.completed
                                ? 'line-through'
                                : 'none',
                              color: task.completed
                                ? 'text.disabled'
                                : 'text.primary',
                              pr: 1,
                            }}>
                            {task.title}
                            {task.frequency && task.frequency !== 'once' && (
                              <Chip
                                size='small'
                                label={
                                  task.frequency.charAt(0).toUpperCase() +
                                  task.frequency.slice(1)
                                }
                                color='primary'
                                variant='outlined'
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                pr: 3,
                              }}>
                              {task.description}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Chip
                                label={task.priority}
                                size='small'
                                sx={{
                                  bgcolor: getPriorityColor(task.priority),
                                  color: '#fff',
                                }}
                              />
                              <Chip
                                label={`Added by: ${task.added_by}`}
                                size='small'
                                variant='outlined'
                              />
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction sx={{ right: { xs: 4, sm: 8 } }}>
                        <IconButton
                          edge='end'
                          onClick={() => handleOpenTaskDialog(task.id)}
                          size='small'
                          sx={{ mr: 0.5 }}>
                          <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                          edge='end'
                          onClick={() => handleDeleteTask(task.id)}
                          size='small'>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 2,
                }}>
                <Typography color='text.secondary'>
                  No tasks for this date. Click "Add Task" to create one.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Task Dialog */}
      <Dialog
        open={openTaskDialog}
        onClose={handleCloseTaskDialog}
        maxWidth='sm'
        fullWidth>
        <DialogTitle>
          {editingTaskId ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='title'
            label='Task Title'
            type='text'
            fullWidth
            value={newTask.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='description'
            label='Description'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label='Due Date'
              value={new Date(newTask.due_date)}
              onChange={(date) =>
                setNewTask({
                  ...newTask,
                  due_date: format(date, 'yyyy-MM-dd'),
                })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} />
              )}
              sx={{ width: '100%', mb: 2 }}
            />
          </LocalizationProvider>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name='priority'
              value={newTask.priority}
              label='Priority'
              onChange={handleInputChange}>
              <MenuItem value='low'>Low</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='high'>High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Frequency</InputLabel>
            <Select
              name='frequency'
              value={newTask.frequency}
              label='Frequency'
              onChange={handleInputChange}>
              <MenuItem value='once'>Once</MenuItem>
              <MenuItem value='daily'>Daily</MenuItem>
              <MenuItem value='weekly'>Weekly</MenuItem>
              <MenuItem value='monthly'>Monthly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin='dense'
            name='added_by'
            label='Added By'
            type='text'
            fullWidth
            value={newTask.added_by}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant='contained' color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalendarAndTasks;
