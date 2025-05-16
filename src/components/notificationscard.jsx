import { useState, useEffect } from 'react';
import { supabase } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';
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
  IconButton,
  Chip,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isPast from 'date-fns/isPast';
import isFuture from 'date-fns/isFuture';
import { Link } from 'react-router-dom';

const NotificationsCard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch upcoming tasks and generate notifications
  useEffect(() => {
    const fetchNotifications = async () => {
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
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });

        if (tasksError) throw tasksError;

        // Generate notifications from tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const taskNotifications = tasks
          ? tasks
              .filter((task) => {
                const dueDate = new Date(task.due_date);
                dueDate.setHours(0, 0, 0, 0);
                // Include tasks due today or in the next 7 days, or overdue tasks that are not completed
                return (
                  isToday(dueDate) ||
                  (isFuture(dueDate) &&
                    dueDate <=
                      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) ||
                  (isPast(dueDate) && !task.completed)
                );
              })
              .map((task) => ({
                id: `task-${task.id}`,
                type: 'task',
                title: task.title,
                description: task.description || '',
                date: task.due_date,
                priority: task.priority,
                completed: task.completed,
                added_by: task.added_by,
                read: false,
              }))
          : [];

        setNotifications(taskNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Set up interval to refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type, completed) => {
    if (type === 'task') {
      return completed ? (
        <CheckCircleIcon color='success' />
      ) : (
        <EventIcon color='primary' />
      );
    }
    return <NotificationsIcon color='secondary' />;
  };

  const getNotificationColor = (priority, completed, date) => {
    if (completed) return theme.palette.success.light;

    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isPast(dueDate) && !isToday(dueDate)) {
      return theme.palette.error.light;
    }

    if (isToday(dueDate)) {
      return theme.palette.warning.light;
    }

    switch (priority) {
      case 'high':
        return theme.palette.error.light;
      case 'medium':
        return theme.palette.warning.light;
      case 'low':
        return theme.palette.success.light;
      default:
        return theme.palette.info.light;
    }
  };

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d, yyyy');
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center' }}>
          Notifications
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color='error' sx={{ ml: 1 }} />
          )}
        </Typography>
        <Button
          variant='text'
          size='small'
          onClick={markAllAsRead}
          disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Loading notifications...</Typography>
        </Box>
      ) : error ? (
        <Typography color='error' sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : notifications.length > 0 ? (
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <ListItem
                sx={{
                  mb: 1,
                  bgcolor: notification.read
                    ? 'transparent'
                    : alpha(theme.palette.primary.light, 0.1),
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
                  borderLeft: '4px solid',
                  borderLeftColor: getNotificationColor(
                    notification.priority,
                    notification.completed,
                    notification.date
                  ),
                }}>
                <ListItemIcon>
                  {getNotificationIcon(
                    notification.type,
                    notification.completed
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant='body1'
                      sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        {notification.description}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          label={formatNotificationDate(notification.date)}
                          size='small'
                          color={
                            isPast(new Date(notification.date)) &&
                            !notification.completed
                              ? 'error'
                              : 'default'
                          }
                          sx={{ mr: 1, fontSize: '0.7rem' }}
                        />
                        {notification.added_by && (
                          <Chip
                            label={`Added by: ${notification.added_by}`}
                            size='small'
                            variant='outlined'
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                <IconButton
                  edge='end'
                  onClick={() => markAsRead(notification.id)}
                  color='primary'
                  sx={{ opacity: notification.read ? 0.5 : 1 }}>
                  <CheckCircleIcon />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}>
          <Typography color='text.secondary'>
            No notifications to display
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          variant='outlined'
          color='primary'
          fullWidth
          component={Link}
          to='/task-manager'
          endIcon={<ArrowForwardIcon />}>
          View All Tasks
        </Button>
      </Box>
    </Paper>
  );
};

export default NotificationsCard;
