import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { MemoryTimeline } from '../components';

const PatientTimeline = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
            <Link
              underline='hover'
              color='inherit'
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/patient/dashboard')}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />
              Dashboard
            </Link>
            <Typography color='text.primary'>Memory Timeline</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mr: 2 }}>
              Back
            </Button>
            <Typography variant='h4' component='h1'>
              Your Memory Timeline
            </Typography>
          </Box>

          <Typography variant='body1' color='text.secondary'>
            View all your memories in chronological order. Choose different
            views to organize your journey.
          </Typography>
        </Box>

        {/* Timeline Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <MemoryTimeline />
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PatientTimeline;
