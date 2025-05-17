import { useState } from 'react';
import { supabase } from '../backend/server';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Chatbot from '../components/Chatbot';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Authenticate user with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Step 2: Fetch additional user details from 'patients' table
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', authData.user.id) // Fetch data using authenticated user ID
        .single();

      if (patientError) {
        setError('Error fetching patient data');
        setLoading(false);
        return;
      }

      console.log('Patient authenticated:', patientData);

      // Step 3: Get family members
      const { data: familyData, error: familyError } = await supabase
        .from('family_members')
        .select('id, name, relationship')
        .eq('patient_id', authData.user.id);

      let familyMembers = [];
      if (!familyError && familyData) {
        familyMembers = familyData;
      }

      // Step 4: Get recent memories
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      let memories = [];
      if (!memoriesError && memoriesData) {
        memories = memoriesData;
      }

      // Step 5: Store authenticated user data in context/state
      const userData = {
        id: authData.user.id,
        name: patientData.name,
        email: patientData.email,
        mobile: patientData.mobile,
        familyMembers: familyMembers,
        memories: memories,
      };

      login('patient', userData); // Store user session
      navigate('/patient/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}>
      {/* Chatbot */}
      {/* <Chatbot /> */}

      <Container maxWidth='sm' disableGutters sx={{ px: { xs: 0, sm: 2 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Button
            component={Link}
            to='/'
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4 }}>
            Back to Home
          </Button>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}>
              <Box sx={{ mb: 3 }}>
                <Logo size='large' />
              </Box>
              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                Welcome back! Please log in to access your memories.
              </Typography>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Email Address'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2, fontSize: '1.1rem' },
                }}
              />

              <TextField
                fullWidth
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleTogglePassword}
                        edge='end'
                        aria-label='toggle password visibility'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                size='large'
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                }}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to='/forgot-password'
                    fullWidth
                    color='primary'
                    sx={{ textTransform: 'none' }}>
                    Forgot Password?
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to='/patient/register'
                    fullWidth
                    color='primary'
                    sx={{ textTransform: 'none' }}>
                    Create Account
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  or
                </Typography>
              </Divider>

              <Button
                component={Link}
                to='/family/login'
                fullWidth
                variant='outlined'
                color='primary'
                size='large'
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                }}>
                Log In as Family Member
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PatientLogin;
