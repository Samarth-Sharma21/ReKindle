import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // In a real app, we would send password reset instructions to the user's email
    // For demo purposes, just show success message
    setSubmitted(true);
    setError('');
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                <LockResetIcon color='primary' sx={{ fontSize: 60, mb: 2 }} />
              </motion.div>
              <Typography
                variant='h4'
                component='h1'
                gutterBottom
                sx={{
                  mb: 2,
                  textAlign: 'center',
                }}>
                <span
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 800,
                  }}>
                  Memo
                </span>
                <span
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                  }}>
                  Bloom
                </span>
              </Typography>
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 500 }}>
                Reset Your Password
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                {!submitted
                  ? 'Enter your email address and we will send you instructions to reset your password.'
                  : 'Check your email for instructions to reset your password.'}
              </Typography>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <Alert severity='success' sx={{ mb: 3 }}>
                  If an account exists with the email {email}, you will receive
                  password reset instructions.
                </Alert>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    component={Link}
                    to='/patient/login'
                    variant='contained'
                    color='primary'
                    sx={{ mr: 2, borderRadius: 2 }}>
                    Patient Login
                  </Button>
                  <Button
                    component={Link}
                    to='/family/login'
                    variant='outlined'
                    color='primary'
                    sx={{ borderRadius: 2 }}>
                    Family Login
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label='Email Address'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='normal'
                  variant='outlined'
                  required
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
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
                  sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', mb: 2 }}>
                  Reset Password
                </Button>
              </form>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Remember your password?{' '}
                <Link
                  to='/patient/login'
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

export default ForgotPassword;
