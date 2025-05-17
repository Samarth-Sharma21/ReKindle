import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from './server';
import Logo from '../components/Logo';

const FamilyRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    patientMobile: '',
    relationship: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value,
    });
  };

  const handleTogglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.patientMobile ||
      !formData.relationship
    ) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit Indian mobile number');
      setLoading(false);
      return;
    }

    if (!mobileRegex.test(formData.patientMobile.replace(/[^0-9]/g, ''))) {
      setError(
        'Please enter a valid 10-digit Indian mobile number for the patient'
      );
      setLoading(false);
      return;
    }

    try {
      // Step 1: Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Step 2: Verify the patient's mobile number and get patient ID
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, name')
        .eq('mobile', formData.patientMobile)
        .single();

      if (patientError || !patientData) {
        throw new Error(
          'Patient not found. Please check the mobile number and try again.'
        );
      }

      // Step 3: Insert family member data
      const { data: familyData, error: familyError } = await supabase
        .from('family_members')
        .insert([
          {
            id: authData.user.id,
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            relationship: formData.relationship,
            patient_mobile: formData.patientMobile,
            patient_id: patientData.id,
          },
        ]);

      if (familyError) throw familyError;

      // Step 4: Store user data in context
      const userData = {
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        relationship: formData.relationship,
        patient_id: patientData.id,
        patient_name: patientData.name,
        patient_mobile: formData.patientMobile,
        type: 'family',
      };

      // Step 5: Login the user and navigate
      login('family', userData);
      navigate('/family/dashboard');
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message);
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
              <Box sx={{ mb: 2 }}>
                <Logo size='large' />
              </Box>
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 500 }}>
                Create Family Account
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ mb: 4, maxWidth: '450px', mx: 'auto' }}>
                Register to connect with your family member and access their
                memories.
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
                label='Full Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Mobile Number'
                name='mobile'
                value={formData.mobile}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                placeholder='e.g. 9876543210'
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PhoneIcon color='action' />
                    </InputAdornment>
                  ),
                }}
                helperText='Enter a 10-digit Indian mobile number'
              />

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
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Relationship to Patient'
                name='relationship'
                value={formData.relationship}
                onChange={handleInputChange}
                placeholder='e.g. Daughter, Son, Spouse'
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label="Patient's Mobile Number"
                name='patientMobile'
                value={formData.patientMobile}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                placeholder='e.g. 9876543210'
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PhoneIcon color='action' />
                    </InputAdornment>
                  ),
                }}
                helperText="Enter the patient's 10-digit Indian mobile number"
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
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleTogglePassword('password')}
                        edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label='Confirm Password'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleTogglePassword('confirm')}
                        edge='end'>
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name='agreeTerms'
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    color='primary'
                  />
                }
                label={
                  <Typography variant='body2'>
                    I agree to the{' '}
                    <Link
                      to='/terms'
                      style={{ color: 'inherit', fontWeight: 'bold' }}>
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                size='large'
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', mb: 2 }}>
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Register'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Already have an account?{' '}
                <Link
                  to='/family/login'
                  style={{ color: 'inherit', fontWeight: 'bold' }}>
                  Log in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FamilyRegister;
