import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import QrCodeIcon from '@mui/icons-material/QrCode';

const GroupCodeDisplay = ({
  groupCode = 'MEMORY-1234-ABCD',
  groupLink = 'https://memorytracker.app/join/MEMORY-1234-ABCD',
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(groupLink);
    setCopied(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Memory Tracker group',
          text: 'Join my Memory Tracker group to help preserve our memories together.',
          url: groupLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.light',
        }}>
        <Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
          Your Group Code
        </Typography>
        <Typography variant='body1' paragraph>
          Share this code with family members so they can join your memory
          group.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            variant='outlined'
            value={groupCode}
            InputProps={{
              readOnly: true,
              sx: {
                fontSize: '1.2rem',
                letterSpacing: '0.1rem',
                fontWeight: 'bold',
              },
            }}
          />
          <Tooltip title='Copy Code'>
            <IconButton
              color='primary'
              onClick={handleCopyCode}
              sx={{
                ml: 1,
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': { bgcolor: 'primary.main' },
              }}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<ShareIcon />}
            onClick={handleShare}
            fullWidth
            size='large'>
            Share Link
          </Button>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<QrCodeIcon />}
            onClick={toggleQRCode}
            fullWidth
            size='large'>
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </Button>
        </Box>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              {/* Placeholder for QR code - in a real app, use a QR code library */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: 'primary.main',
                }}>
                <QrCodeIcon
                  sx={{ fontSize: 100, color: 'primary.main', opacity: 0.7 }}
                />
              </Box>
            </Box>
          </motion.div>
        )}

        <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
          Anyone with this code can view and contribute to your memory journal.
        </Typography>
      </Paper>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setCopied(false)}
          severity='success'
          sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default GroupCodeDisplay;
