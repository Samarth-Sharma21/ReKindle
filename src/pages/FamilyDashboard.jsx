import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './server';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Container,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Divider,
  Stack,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoodIcon from '@mui/icons-material/Mood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import catImage from '../assets/cat.jpg';
import Logo from '../components/Logo';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [userData, setUserData] = useState({
    name: user?.name || 'Family Member',
    email: user?.email || 'family@example.com',
    patientName: 'Loading...',
    relation: user?.relation || 'Caretaker',
    lastActive: user?.lastActive || '2 days ago',
    recentActivities: [
      {
        id: 1,
        type: 'memory_added',
        title: 'Added a new photo',
        date: '2 hours ago',
      },
      {
        id: 2,
        type: 'routine_completed',
        title: 'Completed morning routine',
        date: 'Yesterday',
      },
      {
        id: 3,
        type: 'event_scheduled',
        title: 'Doctor appointment scheduled',
        date: '3 days ago',
      },
    ],
    ...user,
  });
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the current user's ID
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          throw new Error('User not authenticated');
        }

        // For testing - hardcoded patient ID (remove this in production)
        const testPatientId = '123456'; // Using a test ID to ensure we get data

        // Fetch memories directly without relying on the family_members relation
        const { data: memoriesData, error: memoriesError } = await supabase
          .from('memories')
          .select('*')
          .order('date', { ascending: false });

        if (memoriesError) {
          console.error('Memories fetch error:', memoriesError?.message);
          throw memoriesError;
        }

        console.log('Memories fetched:', memoriesData?.length || 0);
        setMemories(memoriesData || []);

        // Set a default patient name if we can't get the real one
        setUserData((prev) => ({
          ...prev,
          patientName: 'Patient',
          lastActive: 'recently',
        }));
      } catch (error) {
        console.error('Error in fetchMemories:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // For debugging
  useEffect(() => {
    console.log('Current memories state:', memories);
  }, [memories]);

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: isDarkMode
                ? `linear-gradient(90deg, ${alpha(
                    theme.palette.primary.dark,
                    0.7
                  )} 0%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`
                : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isDarkMode
                ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                : '0 10px 30px rgba(0, 0, 0, 0.15)',
            }}>
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0,
              }}
            />
            <Grid
              container
              spacing={3}
              alignItems='center'
              sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={8}>
                <Typography
                  variant='h4'
                  component='h1'
                  gutterBottom
                  sx={{ fontWeight: 700 }}>
                  Welcome back, {userData.name}
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{ mb: 3, opacity: 0.9, fontSize: '1.1rem' }}>
                  You're managing memories for {userData.patientName}. Last
                  activity was {userData.lastActive}.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant='contained'
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => navigate('/add-memory')}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                    }}>
                    Add Memory
                  </Button>
                  <Button
                    variant='outlined'
                    color='inherit'
                    startIcon={<CalendarTodayOutlinedIcon />}
                    component={Link}
                    to='/family/dashboard/timeline'
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                    }}>
                    View Timeline
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    alignItems: 'center',
                    mt: { xs: 3, md: 0 },
                    transform: 'scale(1.1)',
                    transformOrigin: 'right center',
                  }}>
                  <Logo size='large' withLink={false} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Patient's Memories */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s ease',
              bgcolor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.7)
                : theme.palette.background.paper,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode
                  ? '0 10px 30px rgba(0,0,0,0.3)'
                  : '0 10px 30px rgba(0,0,0,0.1)',
              },
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' component='h2' sx={{ fontWeight: 600 }}>
                Recent Memories
              </Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to='/family/dashboard/timeline'
                sx={{
                  borderRadius: 2,
                  color: isDarkMode
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                }}>
                View All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress color='primary' />
                  </Box>
                </Grid>
              ) : error ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      minHeight: '200px',
                    }}>
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                      Error loading memories
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ mb: 3 }}>
                      {error}
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => window.location.reload()}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                      }}>
                      Retry
                    </Button>
                  </Box>
                </Grid>
              ) : memories && memories.length > 0 ? (
                memories.slice(0, 3).map((memory) => (
                  <Grid item xs={12} sm={6} md={4} key={memory.id}>
                    <Card
                      component={motion.div}
                      whileHover={{
                        y: -10,
                        boxShadow: isDarkMode
                          ? '0 10px 20px rgba(255,138,0,0.2)'
                          : '0 10px 20px rgba(0,0,0,0.1)',
                        transition: { duration: 0.3 },
                      }}
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        bgcolor: isDarkMode
                          ? alpha(theme.palette.background.paper, 0.6)
                          : theme.palette.background.paper,
                        boxShadow: isDarkMode
                          ? '0 4px 10px rgba(0,0,0,0.2)'
                          : '0 4px 10px rgba(0,0,0,0.1)',
                        border: isDarkMode
                          ? `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : 'none',
                      }}
                      onClick={() => navigate(`/memory/${memory.id}`)}>
                      {memory.type === 'photo' && memory.content && (
                        <Box sx={{ height: 140, overflow: 'hidden' }}>
                          <img
                            src={memory.content}
                            alt={memory.title || 'Memory photo'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      )}
                      {memory.type === 'text' && (
                        <Box
                          sx={{
                            height: 140,
                            bgcolor: isDarkMode
                              ? alpha('#9c27b0', 0.15)
                              : alpha('#9c27b0', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ p: 2, fontStyle: 'italic' }}>
                            "
                            {memory.content
                              ? memory.content.substring(0, 100) + '...'
                              : 'No content'}
                            "
                          </Typography>
                        </Box>
                      )}
                      {memory.type === 'voice' && (
                        <Box
                          sx={{
                            height: 140,
                            bgcolor: isDarkMode
                              ? alpha('#2196f3', 0.15)
                              : alpha('#2196f3', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}>
                          <IconButton
                            sx={{
                              bgcolor: alpha('#2196f3', 0.2),
                              '&:hover': { bgcolor: alpha('#2196f3', 0.3) },
                            }}>
                            <svg width='24' height='24' viewBox='0 0 24 24'>
                              <path
                                fill='currentColor'
                                d='M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2Z'
                              />
                              <path
                                fill='currentColor'
                                d='M19,10C19,15 15.36,19 12,19C8.64,19 5,15 5,10H7A5,5 0 0,0 12,15A5,5 0 0,0 17,10H19Z'
                              />
                              <path
                                fill='currentColor'
                                d='M12,19V22H10V19H12M12,19V22H14V19H12'
                              />
                            </svg>
                          </IconButton>
                          <Typography variant='body2' sx={{ mt: 1 }}>
                            Voice Recording
                          </Typography>
                        </Box>
                      )}
                      {(!memory.type ||
                        (!memory.type === 'photo' &&
                          !memory.type === 'text' &&
                          !memory.type === 'voice')) && (
                        <Box
                          sx={{
                            height: 140,
                            bgcolor: isDarkMode
                              ? alpha(theme.palette.primary.main, 0.15)
                              : alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ p: 2 }}>
                            Memory
                          </Typography>
                        </Box>
                      )}
                      <CardContent>
                        <Typography
                          variant='h6'
                          component='div'
                          gutterBottom
                          noWrap>
                          {memory.title || 'Untitled Memory'}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 1 }}>
                          {memory.date
                            ? new Date(memory.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : 'No date'}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          {memory.location && (
                            <Chip
                              size='small'
                              label={memory.location}
                              sx={{
                                borderRadius: 1,
                                bgcolor: isDarkMode
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : undefined,
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      minHeight: '200px',
                    }}>
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 1 }}>
                      No memories found yet
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ mb: 3 }}>
                      {userData.patientName} doesn't have any memories yet. Add
                      their first memory!
                    </Typography>
                    <Button
                      variant='contained'
                      startIcon={<AddPhotoAlternateIcon />}
                      color='primary'
                      onClick={() => navigate('/add-memory')}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                      }}>
                      Add First Memory
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Patient Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s ease',
              bgcolor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.7)
                : theme.palette.background.paper,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode
                  ? '0 10px 30px rgba(0,0,0,0.3)'
                  : '0 10px 30px rgba(0,0,0,0.1)',
              },
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' component='h2' sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <IconButton
                size='small'
                sx={{
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha('#f5f5f5', 0.8),
                  '&:hover': {
                    bgcolor: isDarkMode
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha('#f5f5f5', 1),
                  },
                  color: isDarkMode ? theme.palette.primary.light : undefined,
                }}>
                <NotificationsNoneIcon fontSize='small' />
              </IconButton>
            </Box>
            <Stack spacing={2}>
              {userData.recentActivities.map((activity) => (
                <Card
                  key={activity.id}
                  variant='outlined'
                  sx={{
                    borderRadius: 2,
                    boxShadow: 'none',
                    bgcolor: isDarkMode
                      ? alpha(theme.palette.background.paper, 0.4)
                      : theme.palette.background.paper,
                    borderColor: isDarkMode
                      ? alpha(theme.palette.primary.main, 0.15)
                      : theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: isDarkMode
                        ? alpha(theme.palette.primary.main, 0.05)
                        : alpha('#f5f5f5', 0.5),
                    },
                  }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: isDarkMode
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha('#f5f5f5', 0.8),
                          flexShrink: 0,
                        }}>
                        {activity.type === 'memory_added' ? (
                          <AddPhotoAlternateIcon color='primary' />
                        ) : activity.type === 'routine_completed' ? (
                          <AccessTimeIcon color='success' />
                        ) : (
                          <CalendarTodayOutlinedIcon color='warning' />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant='body2'
                          gutterBottom
                          fontWeight={500}>
                          {activity.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {activity.date}
                        </Typography>
                      </Box>
                      <IconButton size='small'>
                        <MoreHorizIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='outlined'
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 2,
                  color: isDarkMode ? theme.palette.primary.light : undefined,
                  borderColor: isDarkMode
                    ? alpha(theme.palette.primary.main, 0.3)
                    : undefined,
                }}>
                View All Activity
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FamilyDashboard;
