import { useState } from 'react';
import { supabase } from './server.js';
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
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Chatbot from '../components/Chatbot';

const FamilyLogin = () => {
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

      // Step 2: Fetch family member details
      const { data: familyData, error: familyError } = await supabase
        .from('family_members')
        .select('*, patients:patient_id(*)')
        .eq('id', authData.user.id)
        .single();

      if (familyError || !familyData) {
        setError('Error fetching family member data');
        setLoading(false);
        return;
      }

      console.log('Family member authenticated:', familyData);

      // Step 3: Get recent memories for the connected patient
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', familyData.patient_id)
        .order('created_at', { ascending: false })
        .limit(5);

      let memories = [];
      if (!memoriesError && memoriesData) {
        memories = memoriesData;
      }

      // Step 4: Store authenticated user data in context
      const userData = {
        id: authData.user.id,
        name: familyData.name,
        email: familyData.email,
        mobile: familyData.mobile,
        relationship: familyData.relationship,
        patient_id: familyData.patient_id,
        patient_name: familyData.patients?.name || 'Patient',
        patient_mobile: familyData.patient_mobile,
        memories: memories,
        lastActive: new Date().toISOString(),
      };

      login('family', userData);
      navigate('/family/dashboard');
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
      <Chatbot />
      
      <Container maxWidth='sm'>
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
                Family Member Login - Connect with your loved one's memories
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
                  sx: { borderRadius: 2, fontSize: '1.1rem' },
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
                  py: 1.5,
                  fontSize: '1.1rem',
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
                    to='/family/register'
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
                to='/patient/login'
                fullWidth
                variant='outlined'
                color='primary'
                size='large'
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                }}>
                Log In as Patient
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FamilyLogin;
