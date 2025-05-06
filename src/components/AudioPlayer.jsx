import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { supabase } from '../backend/server';

const AudioPlayer = ({ filePath, showControls = true }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        // Get the public URL from Supabase storage
        const {
          data: { publicUrl },
        } = supabase.storage.from('memories').getPublicUrl(filePath);

        console.log('Fetched audio URL:', publicUrl);
        setAudioUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching audio URL:', error);
        setError('Error loading audio file');
      }
    };

    if (filePath) {
      fetchAudio();
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [filePath]);

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (error) {
    return (
      <Typography color='error' sx={{ mb: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        controls={showControls}
        style={{ width: '100%' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Error loading audio:', e);
          setError('Error loading audio file');
        }}
      />
      {!showControls && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
            color='primary'
            size='large'
            onClick={handleTogglePlay}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default AudioPlayer;