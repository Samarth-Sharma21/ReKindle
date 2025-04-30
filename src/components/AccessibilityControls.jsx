import { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
  Tooltip,
  Drawer,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import CloseIcon from '@mui/icons-material/Close';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import ContrastIcon from '@mui/icons-material/Contrast';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const AccessibilityControls = () => {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // 100% is default
  const [highContrast, setHighContrast] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
    // Apply font size changes to the document
    document.documentElement.style.fontSize = `${newValue}%`;
  };

  const handleContrastChange = (event) => {
    setHighContrast(event.target.checked);
    // Apply contrast changes to the document
    if (event.target.checked) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleAudioFeedbackChange = (event) => {
    setAudioFeedback(event.target.checked);
    // Audio feedback would be implemented in actual app
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  return (
    <>
      <Tooltip title='Accessibility Options'>
        <IconButton
          onClick={toggleDrawer}
          color='primary'
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            zIndex: 1000,
            width: 56,
            height: 56,
          }}>
          <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.9 }}>
            <AccessibilityNewIcon fontSize='large' />
          </motion.div>
        </IconButton>
      </Tooltip>

      <Drawer anchor='right' open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 300,
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          role='presentation'>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}>
            <Typography variant='h5' component='div'>
              Accessibility
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              Text Size
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={decreaseFontSize} disabled={fontSize <= 80}>
                <TextDecreaseIcon />
              </IconButton>
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                aria-labelledby='font-size-slider'
                valueLabelDisplay='auto'
                step={10}
                marks
                min={80}
                max={150}
                sx={{ mx: 2 }}
              />
              <IconButton onClick={increaseFontSize} disabled={fontSize >= 150}>
                <TextIncreaseIcon />
              </IconButton>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              Current: {fontSize}%
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              Display Options
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={handleContrastChange}
                  icon={<ContrastIcon />}
                  checkedIcon={<ContrastIcon />}
                />
              }
              label='High Contrast Mode'
            />
          </Paper>

          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              Sound & Feedback
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={audioFeedback}
                  onChange={handleAudioFeedbackChange}
                  icon={<VolumeUpIcon />}
                  checkedIcon={<VolumeUpIcon />}
                />
              }
              label='Audio Feedback'
            />
          </Paper>

          <Box sx={{ mt: 'auto' }}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={toggleDrawer}
              sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AccessibilityControls;
