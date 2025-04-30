import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Container,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SpaIcon from '@mui/icons-material/Spa';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // 'ready', 'inhale', 'hold', 'exhale'
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  // Breathing cycle configuration
  const breathConfig = {
    inhale: 4, // seconds
    hold: 2, // seconds
    exhale: 6, // seconds
    totalCycles: 3,
  };

  useEffect(() => {
    let timer;
    if (isActive) {
      if (phase === 'ready') {
        setPhase('inhale');
        setCount(breathConfig.inhale);
      } else {
        timer = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount <= 1) {
              // Move to next phase when count reaches 0
              if (phase === 'inhale') {
                setPhase('hold');
                return breathConfig.hold;
              } else if (phase === 'hold') {
                setPhase('exhale');
                return breathConfig.exhale;
              } else if (phase === 'exhale') {
                // Complete one cycle
                const newCycles = cycles + 1;
                setCycles(newCycles);

                if (newCycles >= breathConfig.totalCycles) {
                  // Exercise complete
                  setIsActive(false);
                  setPhase('ready');
                  setCycles(0);
                  return 0;
                } else {
                  // Start next cycle
                  setPhase('inhale');
                  return breathConfig.inhale;
                }
              }
            }
            return prevCount - 1;
          });
        }, 1000);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [isActive, phase, cycles]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('ready');
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCount(0);
    setCycles(0);
  };

  // Get instructions based on current phase
  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
      default:
        return 'Press start when ready';
    }
  };

  // Get color based on current phase
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return '#6a5acd'; // primary color
      case 'hold':
        return '#ff8c69'; // secondary color
      case 'exhale':
        return '#4a3b9c'; // primary dark
      default:
        return '#9d8ce0'; // primary light
    }
  };

  // Calculate progress percentage for the circular animation
  const getProgress = () => {
    if (!isActive || phase === 'ready') return 0;

    const total =
      phase === 'inhale'
        ? breathConfig.inhale
        : phase === 'hold'
        ? breathConfig.hold
        : breathConfig.exhale;

    // Use a smoother progress calculation that doesn't reach exactly 100%
    // This prevents the abrupt reset between phases
    return Math.min(((total - count) / total) * 100, 99.5);
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          align='center'
          color='primary'>
          Breathing Exercise
        </Typography>

        <Typography variant='body1' paragraph align='center'>
          Take a moment to relax with this guided breathing exercise. Follow the
          animation and breathe along.
        </Typography>

        <Box
          sx={{
            position: 'relative',
            my: 4,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'relative' }}>
              <CircularProgress
                variant='determinate'
                value={getProgress()}
                size={200}
                thickness={4}
                sx={{ color: getPhaseColor() }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <motion.div
                  animate={{
                    scale:
                      phase === 'inhale'
                        ? [1, 1.3]
                        : phase === 'exhale'
                        ? [1.3, 1]
                        : 1.3,
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration:
                      phase === 'inhale'
                        ? breathConfig.inhale
                        : phase === 'exhale'
                        ? breathConfig.exhale
                        : 0,
                    ease: 'easeInOut',
                    opacity: {
                      duration:
                        phase === 'inhale' || phase === 'exhale' ? 2 : 0,
                      repeat: phase === 'inhale' || phase === 'exhale' ? 1 : 0,
                      repeatType: 'reverse',
                    },
                  }}>
                  <SpaIcon
                    sx={{
                      fontSize: 80,
                      color: getPhaseColor(),
                      opacity: 0.8,
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h5' gutterBottom>
            {getInstructions()}
          </Typography>
          {isActive && (
            <Typography variant='h3' color={getPhaseColor()}>
              {count}
            </Typography>
          )}
          {isActive && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Cycle {cycles + 1} of {breathConfig.totalCycles}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!isActive ? (
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={startExercise}
              aria-label='Start breathing exercise'
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
              Start Breathing
            </Button>
          ) : (
            <Button
              variant='outlined'
              color='primary'
              size='large'
              onClick={stopExercise}
              aria-label='Stop breathing exercise'
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
              Stop
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BreathingExercise;
