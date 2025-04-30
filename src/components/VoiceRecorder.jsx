import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  LinearProgress,
  Slider,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const playbackTimerRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(playbackTimerRef.current);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Update audio element when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.onloadedmetadata = () => {
        setAudioDuration(audioRef.current.duration);
      };
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentPlaybackTime(0);
        clearInterval(playbackTimerRef.current);
      };
    }
  }, [audioUrl]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        if (onRecordingComplete) {
          onRecordingComplete(url);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // Play/pause recorded audio
  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(playbackTimerRef.current);
    } else {
      audioRef.current.play();
      playbackTimerRef.current = setInterval(() => {
        setCurrentPlaybackTime(audioRef.current.currentTime);
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };

  // Delete recording
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setCurrentPlaybackTime(0);
    setAudioDuration(0);
    setIsPlaying(false);
    clearInterval(playbackTimerRef.current);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Handle playback position change
  const handleSliderChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentPlaybackTime(newValue);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {!audioUrl ? (
        <Box sx={{ textAlign: 'center' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 1 }}
            style={{ display: 'inline-block' }}>
            <IconButton
              color={isRecording ? 'error' : 'primary'}
              sx={{
                width: 80,
                height: 80,
                bgcolor: isRecording ? 'error.light' : 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: isRecording ? 'error.main' : 'primary.main',
                },
                mb: 2,
              }}
              onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? (
                <StopIcon fontSize='large' />
              ) : (
                <MicIcon fontSize='large' />
              )}
            </IconButton>
          </motion.div>

          <Typography variant='h6' gutterBottom>
            {isRecording
              ? 'Recording in progress...'
              : 'Tap to Start Recording'}
          </Typography>

          {isRecording && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress
                color='error'
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant='body1' sx={{ mt: 1, fontWeight: 'bold' }}>
                {formatTime(recordingTime)}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant='h6' gutterBottom>
            Voice Memory
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton color='primary' onClick={togglePlayback} sx={{ mr: 1 }}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ minWidth: 45 }}>
                {formatTime(currentPlaybackTime)}
              </Typography>
              <Slider
                value={currentPlaybackTime}
                max={audioDuration || 100}
                onChange={handleSliderChange}
                aria-label='audio position'
                sx={{ mx: 2 }}
              />
              <Typography variant='body2' sx={{ minWidth: 45 }}>
                {formatTime(audioDuration)}
              </Typography>
            </Box>
          </Box>

          <Stack
            direction='row'
            spacing={2}
            justifyContent='center'
            sx={{ mt: 3 }}>
            <Button
              variant='outlined'
              color='error'
              startIcon={<DeleteIcon />}
              onClick={deleteRecording}>
              Delete
            </Button>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<MicIcon />}
              onClick={startRecording}>
              Record New
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default VoiceRecorder;
