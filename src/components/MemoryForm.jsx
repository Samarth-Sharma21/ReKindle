import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import PhotoIcon from '@mui/icons-material/Photo';
import MicIcon from '@mui/icons-material/Mic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { PhotoUploader, VoiceRecorder } from './';
import { supabase } from '../pages/server';

const MemoryForm = ({ memoryData, setMemoryData }) => {
  const [memoryType, setMemoryType] = useState('photo');
  const [newPerson, setNewPerson] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemoryData({ ...memoryData, [name]: value });
  };

  // Handle memory type change
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setMemoryType(newType);
    setMemoryData({ ...memoryData, type: newType });
    if (newType === 'photo') {
      setPhotoPreview('');
    }
  };

  // Handle adding a person
  const handleAddPerson = () => {
    if (newPerson.trim() && !memoryData.people?.includes(newPerson.trim())) {
      setMemoryData({
        ...memoryData,
        people: [...(memoryData.people || []), newPerson.trim()],
      });
      setNewPerson('');
    }
  };

  // Handle removing a person
  const handleRemovePerson = (personToRemove) => {
    setMemoryData({
      ...memoryData,
      people: (memoryData.people || []).filter(
        (person) => person !== personToRemove
      ),
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (file) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('memories').getPublicUrl(filePath);

      // Store the full URL in memoryData
      setPhotoPreview(URL.createObjectURL(file));
      setMemoryData({
        ...memoryData,
        content: publicUrl,
        type: 'photo', // Ensure type is set to photo
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      showNotification('Error uploading file. Please try again.', 'error');
    }
  };

  // Handle voice recording
  const handleVoiceRecorded = async (audioBlob) => {
    try {
      // Convert the audio blob to a file with proper MIME type
      const audioFile = new File([audioBlob], 'voice-recording.mp3', {
        type: 'audio/mpeg',
      });

      // Upload audio file to Supabase Storage
      const fileName = `${Math.random()}.mp3`;
      const filePath = `public/${fileName}`;

      // First, try to delete any existing file with the same name
      await supabase.storage.from('memories').remove([filePath]);

      // Upload the new file with proper options
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, audioFile, {
          contentType: 'audio/mpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('memories').getPublicUrl(filePath);

      console.log('Uploaded audio URL:', publicUrl);

      // Test if the audio file is accessible
      try {
        const response = await fetch(publicUrl);
        if (!response.ok) {
          throw new Error('Audio file not accessible');
        }
      } catch (error) {
        console.error('Error testing audio URL:', error);
        throw new Error('Audio file not accessible');
      }

      // Update memory data with the public URL
      setMemoryData({
        ...memoryData,
        content: publicUrl,
        type: 'voice', // Ensure type is set to voice
      });

      // Show success notification
      showNotification('Voice recording saved successfully!', 'success');
    } catch (error) {
      console.error('Error uploading audio:', error.message);
      showNotification('Error uploading audio. Please try again.', 'error');
    }
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant='h5' component='h2' gutterBottom sx={{ mb: 3 }}>
        Memory Details
      </Typography>

      <Box>
        <Grid container spacing={3}>
          {/* Memory Type Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='memory-type-label'>Memory Type</InputLabel>
              <Select
                labelId='memory-type-label'
                id='memory-type'
                value={memoryType}
                label='Memory Type'
                onChange={handleTypeChange}>
                <MenuItem value='photo'>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhotoIcon sx={{ mr: 1 }} />
                    Photo Memory
                  </Box>
                </MenuItem>
                <MenuItem value='voice'>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MicIcon sx={{ mr: 1 }} />
                    Voice Memory
                  </Box>
                </MenuItem>
                <MenuItem value='text'>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextSnippetIcon sx={{ mr: 1 }} />
                    Text Memory
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Title and Date - make each field take full width on mobile */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label='Memory Title'
              name='title'
              value={memoryData.title}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Date'
              type='date'
              name='date'
              value={memoryData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Location'
              name='location'
              value={memoryData.location || ''}
              onChange={handleInputChange}
              placeholder='Enter or select a location'
              InputProps={{
                startAdornment: (
                  <LocationOnIcon color='action' sx={{ mr: 1 }} />
                ),
              }}
            />
          </Grid>

          {/* People - ensure people input fields are properly stacked on mobile */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'stretch', sm: 'flex-start' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                mb: 1,
              }}>
              <TextField
                fullWidth
                label='Add People in this Memory'
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                InputProps={{
                  startAdornment: <PeopleIcon color='action' sx={{ mr: 1 }} />,
                }}
                sx={{ mr: { xs: 0, sm: 1 } }}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={handleAddPerson}
                disabled={!newPerson.trim()}
                sx={{
                  alignSelf: { xs: 'flex-end', sm: 'auto' },
                  minWidth: { xs: '100px', sm: 'auto' },
                }}>
                <AddIcon />
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {memoryData.people?.map((person) => (
                <Chip
                  key={person}
                  label={person}
                  onDelete={() => handleRemovePerson(person)}
                  color='primary'
                  variant='outlined'
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Memory Content based on type */}
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Memory Content
            </Typography>

            {memoryType === 'photo' && (
              <Box>
                <Typography variant='h6' gutterBottom>
                  Upload a Photo
                </Typography>
                <PhotoUploader
                  onPhotoSelected={handlePhotoUpload}
                  defaultImage={photoPreview}
                />

                {/* Photo filters */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Photo Filter
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id='filter-label'>Apply Filter</InputLabel>
                    <Select
                      labelId='filter-label'
                      id='filter'
                      name='filter'
                      value={memoryData.filter || 'none'}
                      label='Apply Filter'
                      onChange={handleInputChange}>
                      <MenuItem value='none'>No Filter</MenuItem>
                      <MenuItem value='polaroid'>Polaroid Frame</MenuItem>
                      <MenuItem value='sepia'>Sepia Tone</MenuItem>
                      <MenuItem value='vintage'>Vintage</MenuItem>
                    </Select>
                  </FormControl>

                  {photoPreview && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <img
                        src={photoPreview}
                        alt='Memory Preview'
                        style={{
                          width: '100%',
                          maxHeight: '300px',
                          objectFit: 'contain',
                          borderRadius:
                            memoryData.filter === 'none' ? '4px' : '0',
                          border:
                            memoryData.filter === 'polaroid'
                              ? '15px solid white'
                              : memoryData.filter === 'sepia'
                              ? '5px solid #d4b483'
                              : memoryData.filter === 'vintage'
                              ? '8px solid #f5f5f5'
                              : 'none',
                          boxShadow:
                            memoryData.filter !== 'none'
                              ? '0 4px 8px rgba(0, 0, 0, 0.15)'
                              : 'none',
                          transform:
                            memoryData.filter === 'polaroid'
                              ? 'rotate(-2deg)'
                              : 'none',
                          filter:
                            memoryData.filter === 'sepia'
                              ? 'sepia(100%)'
                              : memoryData.filter === 'vintage'
                              ? 'grayscale(50%)'
                              : 'none',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {memoryType === 'voice' && (
              <Box>
                <Typography variant='h6' gutterBottom>
                  Record a Voice Memory
                </Typography>
                <VoiceRecorder onRecordingComplete={handleVoiceRecorded} />
              </Box>
            )}

            {memoryType === 'text' && (
              <TextField
                fullWidth
                multiline
                rows={6}
                label='Write your memory'
                name='content'
                value={memoryData.content}
                onChange={handleInputChange}
                placeholder='Share your thoughts, stories, or memories here...'
              />
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemoryForm;
