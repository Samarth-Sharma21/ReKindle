import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MemoryCard } from './';

const BentoGrid = ({ memories = [], loading }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Define grid layout patterns based on number of items
  const getGridLayout = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return [];
    }

    // Default sizes for items
    const defaultSizes = items.map(() => ({ xs: 12, sm: 6, md: 4 }));

    // Apply special layouts based on number of items
    if (items.length >= 5) {
      // First item spans 2 columns on larger screens
      defaultSizes[0] = { xs: 12, sm: 12, md: 8 };
      // Second item spans 2 rows on larger screens
      defaultSizes[1] = { xs: 12, sm: 6, md: 4, height: 2 };
    }

    if (items.length >= 7) {
      // Make another item span full width at the bottom
      defaultSizes[6] = { xs: 12, sm: 12, md: 12 };
    }

    return defaultSizes;
  };

  // Get layout based on current memories
  const gridLayout = getGridLayout(memories);

  // Render loading skeletons
  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton variant='rectangular' height={300} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {memories.map((memory, index) => {
        const gridSize = gridLayout[index] || { xs: 12, sm: 6, md: 4 };
        const isHighlighted = index === 0 || index === 1 || index === 6;

        return (
          <Grid
            item
            xs={gridSize.xs}
            sm={gridSize.sm}
            md={gridSize.md}
            key={memory.id}
            sx={{
              height: gridSize.height
                ? `calc(${gridSize.height} * (300px + 16px) - 16px)`
                : 'auto',
            }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{ height: '100%' }}>
              <Paper
                elevation={isHighlighted ? 3 : 1}
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: isDarkMode
                      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.15)',
                  },
                }}>
                <MemoryCard
                  memory={memory}
                  viewMode='grid'
                  isHighlighted={isHighlighted}
                />
              </Paper>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BentoGrid;
