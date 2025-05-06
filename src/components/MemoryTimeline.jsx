import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Paper,
  Container,
  Grid,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TimelineIcon from '@mui/icons-material/Timeline';
import { MemoryCard } from './';
import { supabase } from '../backend/server';

const MemoryTimeline = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        setMemories(data || []);
      } catch (error) {
        console.error('Error fetching memories:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const handleViewChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Group memories by month and year
  const groupedMemories = memories.reduce((groups, memory) => {
    const date = new Date(memory.date);
    const monthYear = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(memory);
    return groups;
  }, {});

  // Sort groups by date (newest first)
  const sortedGroups = Object.keys(groupedMemories).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  // Render loading skeletons
  if (loading) {
    return (
      <Container>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant='rectangular' width={210} height={40} />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant='rectangular' height={300} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}>
          <Typography variant='h4' component='h1'>
            Memory Timeline
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label='view mode'>
            <ToggleButton value='grid' aria-label='grid view'>
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value='list' aria-label='list view'>
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value='timeline' aria-label='timeline view'>
              <TimelineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {memories.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}>
            <Typography variant='h6' color='text.secondary'>
              No memories found. Start creating memories to see them here!
            </Typography>
          </Paper>
        ) : (
          sortedGroups.map((monthYear) => (
            <Box key={monthYear} sx={{ mb: 6 }}>
              <Typography
                variant='h5'
                sx={{
                  mb: 3,
                  pb: 1,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  display: 'inline-block',
                }}>
                {monthYear}
              </Typography>

              <Grid container spacing={3}>
                {groupedMemories[monthYear].map((memory) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'list' ? 12 : 6}
                    md={viewMode === 'list' ? 12 : 4}
                    key={memory.id}>
                    <MemoryCard memory={memory} viewMode={viewMode} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default MemoryTimeline;
