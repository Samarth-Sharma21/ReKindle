import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpaIcon from '@mui/icons-material/Spa';
import { BreathingExercise } from '../components';

const BreathingGame = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4' component='h1'>
            Breathing Exercise
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
              <SpaIcon color='primary' sx={{ fontSize: 60, mb: 2 }} />
            </motion.div>
            <Typography variant='h5' gutterBottom>
              Take a Moment to Relax
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              This breathing exercise can help reduce anxiety and promote
              relaxation. Follow the animation and breathe along with the
              prompts.
            </Typography>
          </Box>

          <BreathingExercise />

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant='body1' paragraph>
              Remember, you can use this exercise anytime you feel anxious or
              overwhelmed. Regular practice can help improve your overall
              well-being.
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              If you continue to experience severe anxiety, please consult with
              your healthcare provider.
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}>
          <Typography variant='h5' gutterBottom>
            Benefits of Breathing Exercises
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mt: 2,
            }}>
            <Box>
              <Typography variant='h6' gutterBottom>
                Reduces Anxiety
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Deep breathing activates the parasympathetic nervous system,
                which helps reduce feelings of anxiety and stress.
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6' gutterBottom>
                Improves Focus
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Regular breathing exercises can help improve concentration and
                mental clarity.
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6' gutterBottom>
                Promotes Relaxation
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Controlled breathing helps relax tense muscles and calm the
                mind.
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6' gutterBottom>
                Enhances Memory
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                By reducing stress, breathing exercises can help improve memory
                function, which is particularly beneficial for dementia
                patients.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default BreathingGame;
