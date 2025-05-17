import { useState, useEffect } from 'react';
import { supabase } from '../backend/server';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Button,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FamilyManagementCard = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    memberId: null,
    memberName: '',
  });

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch family members from database
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        setError('');

        // Get the current user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error('User authentication error');
        }

        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('patient_id', user.id);

        if (error) throw error;

        // Successfully loaded data
        setFamilyMembers(data || []);
      } catch (error) {
        console.error('Error fetching family members:', error.message);
        setError('Unable to load family connections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  // Notification helper function
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (memberId, memberName) => {
    setConfirmDeleteDialog({
      open: true,
      memberId,
      memberName,
    });
  };

  // Close delete confirmation dialog
  const closeDeleteConfirmation = () => {
    setConfirmDeleteDialog({
      ...confirmDeleteDialog,
      open: false,
    });
  };

  const handleRemoveFamilyMember = async () => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', confirmDeleteDialog.memberId);

      if (error) throw error;

      // Update local state
      setFamilyMembers(
        familyMembers.filter(
          (member) => member.id !== confirmDeleteDialog.memberId
        )
      );

      // Show success notification
      showNotification('Family connection removed successfully');

      // Close the confirmation dialog
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error removing family connection:', error.message);
      showNotification(
        'Unable to remove family connection. Please try again.',
        'error'
      );
      closeDeleteConfirmation();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography variant='h6' gutterBottom sx={{ mb: 0 }}>
          <FamilyRestroomIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
          Family Connect
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pr: 2, // Add padding to create space between content and scrollbar
            pb: 1,
          }}>
          {familyMembers.length > 0 ? (
            <List dense>
              {familyMembers.map((member) => (
                <ListItem
                  key={member.id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      isDarkMode ? 0.15 : 0.05
                    ),
                    py: 1,
                  }}>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        width: 30,
                        height: 30,
                        fontSize: '0.9rem',
                      }}>
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {member.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        component='span'>
                        {member.email}
                      </Typography>
                    }
                    sx={{ my: 0 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      aria-label='delete'
                      size='small'
                      onClick={() =>
                        openDeleteConfirmation(member.id, member.name)
                      }>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
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
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FamilyRestroomIcon
                sx={{
                  fontSize: 48,
                  color: 'text.secondary',
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography color='text.secondary' gutterBottom>
                No family connections to display
              </Typography>
              <Button
                variant='contained'
                color='primary'
                size='small'
                component={Link}
                to='/settings'
                sx={{ mt: 1 }}>
                Add Connection
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* View All Button - Always at the bottom */}
      {familyMembers.length > 0 && (
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            component={Link}
            to='/settings'
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
            View All Connections
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog.open}
        onClose={closeDeleteConfirmation}
        aria-labelledby='delete-family-member-dialog'>
        <DialogTitle id='delete-family-member-dialog'>
          Remove family connection
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {confirmDeleteDialog.memberName}{' '}
            from your family connections? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleRemoveFamilyMember} color='error' autoFocus>
            Remove
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
    </Paper>
  );
};

export default FamilyManagementCard;
