import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
  Grid,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MemoryCard } from './';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const MemoryListView = ({ memories = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleViewMemory = (id) => {
    navigate(`/memory/${id}`);
  };

  if (memories.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}>
        <Typography variant='h6' color='text.secondary'>
          No memories found in this time period.
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}>
          <ListItem
            alignItems='flex-start'
            sx={{
              p: 2,
              mb: index < memories.length - 1 ? 2 : 0,
              borderRadius: 2,
              bgcolor: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              border: '1px solid',
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleViewMemory(memory.id)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} md={2}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}>
                  <Typography
                    variant='h6'
                    color='primary'
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {memory.date
                      ? format(new Date(memory.date), 'MMM d')
                      : 'No Date'}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ textAlign: 'center' }}>
                    {memory.date ? format(new Date(memory.date), 'yyyy') : ''}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={9} md={10}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{ fontWeight: 'medium' }}>
                    {memory.title || 'Untitled Memory'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 1,
                    }}>
                    {memory.location && (
                      <Chip
                        icon={<LocationOnIcon fontSize='small' />}
                        label={memory.location}
                        size='small'
                        variant='outlined'
                      />
                    )}
                    {memory.people && memory.people.length > 0 && (
                      <Chip
                        icon={<PeopleIcon fontSize='small' />}
                        label={`${memory.people.length} people`}
                        size='small'
                        variant='outlined'
                      />
                    )}
                    {memory.type && (
                      <Chip
                        label={
                          memory.type.charAt(0).toUpperCase() +
                          memory.type.slice(1)
                        }
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    )}
                  </Box>

                  {memory.description && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                      {memory.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 1,
                    }}>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMemory(memory.id);
                      }}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </ListItem>
          {index < memories.length - 1 && (
            <Divider variant='inset' component='li' sx={{ ml: 0 }} />
          )}
        </motion.div>
      ))}
    </List>
  );
};

export default MemoryListView;
